"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib";

interface IRevalidatePayload {
  model?: string;
  entry?: { slug?: string; locale?: string };
  path?: string;
  tag?: string;
  tags?: string[];
}

interface IRevalidateButton {
  label: string;
  payload: IRevalidatePayload;
}

const REVALIDATE_ACTIONS: IRevalidateButton[] = [
  { label: "Ревалидировать: главная (en)", payload: { model: "page_home", entry: { locale: "en" } } },
  { label: "Ревалидировать: главная (sk)", payload: { model: "page_home", entry: { locale: "sk" } } },
  { label: "Ревалидировать: каталог / список игр", payload: { model: "games", entry: { locale: "en" } } },
  { label: "Ревалидировать: список категорий", payload: { model: "categories", entry: { locale: "en" } } },
  { label: "Ревалидировать: игру hero-wars", payload: { model: "game", entry: { slug: "hero-wars", locale: "en" } } },
  { label: "Ревалидировать: игру sea-of-conquest", payload: { model: "game", entry: { slug: "sea-of-conquest", locale: "en" } } },
  { label: "Ревалидировать: категорию action", payload: { model: "category", entry: { slug: "action", locale: "en" } } },
  { label: "Ревалидировать: категорию rpg", payload: { model: "category", entry: { slug: "rpg", locale: "en" } } },
  { label: "Ревалидировать: локали", payload: { model: "locales" } },
  { label: "Ревалидировать: переводы (en)", payload: { model: "translations", entry: { locale: "en" } } },
  { label: "Ревалидировать path: /en", payload: { path: "/en" } },
  { label: "Ревалидировать path: /en/catalog", payload: { path: "/en/catalog" } },
  { label: "Ревалидировать path: /en/game/hero-wars", payload: { path: "/en/game/hero-wars" } },
  { label: "Ревалидировать тег: games", payload: { tag: "games" } },
  { label: "Ревалидировать тег: game:hero-wars", payload: { tag: "game:hero-wars" } },
  { label: "Ревалидировать теги: games + categories", payload: { tags: ["games", "categories"] } },
];

export function RevalidateButtons() {
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleRevalidate(payload: IRevalidatePayload, label: string) {
    if (!secret.trim()) {
      setLastResult({ ok: false, text: "Введите REVALIDATION_SECRET" });
      return;
    }
    setLoading(label);
    setLastResult(null);
    try {
      const res = await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: secret.trim(), ...payload }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLastResult({ ok: false, text: `${res.status}: ${data?.message || res.statusText}` });
        return;
      }
      setLastResult({
        ok: true,
        text: `OK: paths=[${(data.revalidatedPaths || []).join(", ")}] tags=[${(data.revalidatedTags || []).join(", ")}]`,
      });
    } catch (e) {
      setLastResult({ ok: false, text: String(e) });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-8 rounded-lg border border-border bg-muted/30 p-4">
      <p className="mb-2 text-xs font-semibold uppercase text-text-muted">
        Тест ревалидации кэша (временно)
      </p>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className="text-xs text-text-muted">Secret:</label>
        <Input
          type="password"
          placeholder="REVALIDATION_SECRET из .env"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          className="max-w-[220px] text-xs"
          autoComplete="off"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {REVALIDATE_ACTIONS.map(({ label, payload }) => (
          <Button
            key={label}
            variant="outline"
            size="sm"
            disabled={!!loading}
            onClick={() => handleRevalidate(payload, label)}
            className={cn("text-xs", loading === label && "opacity-60")}
          >
            {loading === label ? "…" : label}
          </Button>
        ))}
      </div>
      {lastResult && (
        <pre
          className={cn(
            "mt-3 overflow-auto rounded p-2 text-xs",
            lastResult.ok ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-red-500/10 text-red-700 dark:text-red-400"
          )}
        >
          {lastResult.text}
        </pre>
      )}
    </div>
  );
}
