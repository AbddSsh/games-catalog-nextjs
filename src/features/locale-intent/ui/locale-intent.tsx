"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Search } from "lucide-react";
import type { ILocaleConfig } from "@/entities/locale";
import { DEFAULT_LOCALE, LOCALE_SELECTED_COOKIE_NAME, LOCALE_SUGGESTED_COOKIE_NAME } from "@/shared/config";
import { Dialog, DialogContent, DialogTitle, Input } from "@/shared/ui";

interface ILocaleIntentProps {
  currentLocale: string;
  locales: ILocaleConfig[];
}

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie ? document.cookie.split("; ") : [];
  const target = cookies.find((item) => item.startsWith(`${name}=`));
  if (!target) return null;
  return decodeURIComponent(target.split("=").slice(1).join("="));
}

function setCookie(name: string, value: string): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}

function buildLocalizedPath(
  pathname: string,
  currentLocale: string,
  targetLocale: string,
  localeCodes: string[],
  search: string
): string {
  const nonDefaultCodes = localeCodes.filter((code) => code !== DEFAULT_LOCALE);
  let barePath = pathname;
  const currentPrefix = nonDefaultCodes.find(
    (code) => pathname.startsWith(`/${code}/`) || pathname === `/${code}`
  );

  if (currentPrefix) {
    barePath = pathname.replace(new RegExp(`^/${currentPrefix}`), "") || "/";
  } else if (currentLocale !== DEFAULT_LOCALE && pathname === "/") {
    barePath = "/";
  }

  const targetPath =
    targetLocale === DEFAULT_LOCALE
      ? barePath
      : `/${targetLocale}${barePath === "/" ? "" : barePath}`;

  return search ? `${targetPath}?${search}` : targetPath;
}

function LocaleFlagImage({
  src,
  alt,
  size,
  className,
  fallbackCode,
}: {
  src: string;
  alt: string;
  size: number;
  className?: string;
  fallbackCode: string;
}) {
  if (!src?.trim()) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded border border-white/20 bg-white/10 text-xs font-semibold uppercase text-white/80 ${className ?? ""}`}
      >
        {fallbackCode.slice(0, 2)}
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      unoptimized={src.startsWith("http://")}
    />
  );
}

export function LocaleIntent({ currentLocale, locales }: ILocaleIntentProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isQuestionOpen, setIsQuestionOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedLocale, setSelectedLocale] = useState(currentLocale);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);

  const search = searchParams.toString();
  const hasGclid = searchParams.has("gclid");
  const localeCodes = useMemo(() => locales.map((locale) => locale.code), [locales]);
  const suggestedLocale = readCookie(LOCALE_SUGGESTED_COOKIE_NAME);
  const selectedCookieLocale = readCookie(LOCALE_SELECTED_COOKIE_NAME);

  const suggestedLocaleConfig = useMemo(
    () => locales.find((locale) => locale.code === suggestedLocale) ?? null,
    [locales, suggestedLocale]
  );

  const filteredLocales = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return locales;
    return locales.filter((locale) => {
      return (
        locale.name.toLowerCase().includes(normalized) ||
        locale.nativeName.toLowerCase().includes(normalized) ||
        locale.code.toLowerCase().includes(normalized)
      );
    });
  }, [locales, query]);

  // DEBUG: вывод детекции локали в браузерную консоль (удалить эффект после дебага)
  useEffect(() => {
    try {
      const raw = readCookie("__debug_locale_detection");
      if (raw) {
        const data = JSON.parse(raw);
        console.log(
          "%c[locale-detect]",
          "color: #D2189A; font-weight: bold",
          "\n  IP raw header:", data.ipRaw || "(empty)",
          "\n  IP locale:", data.ipLocale || "(none — not matched)",
          "\n  Browser locale:", data.browserLocale || "(none)",
          "\n  Winner source:", data.source,
          "\n  Final result:", data.result
        );
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (hasGclid || selectedCookieLocale) return;
    if (!suggestedLocale || suggestedLocale === currentLocale) return;

    setIsQuestionOpen(true);
    setPendingRedirect(suggestedLocale);
    setSelectedLocale(suggestedLocale);
  }, [currentLocale, hasGclid, selectedCookieLocale, suggestedLocale]);

  const pendingRedirectHref = useMemo(() => {
    if (!pendingRedirect) return "";
    return buildLocalizedPath(pathname, currentLocale, pendingRedirect, localeCodes, search);
  }, [pathname, currentLocale, pendingRedirect, localeCodes, search]);

  const selectedLocaleHref = useMemo(
    () => buildLocalizedPath(pathname, currentLocale, selectedLocale, localeCodes, search),
    [pathname, currentLocale, selectedLocale, localeCodes, search]
  );

  const handlePendingRedirectClick = () => {
    if (pendingRedirect) {
      setCookie(LOCALE_SELECTED_COOKIE_NAME, pendingRedirect);
    }
    setPendingRedirect(null);
    setIsQuestionOpen(false);
    setIsListOpen(false);
  };

  const handleSelectedLocaleClick = () => {
    setCookie(LOCALE_SELECTED_COOKIE_NAME, selectedLocale);
    setPendingRedirect(null);
    setIsQuestionOpen(false);
    setIsListOpen(false);
  };

  if (!suggestedLocaleConfig || hasGclid || !!selectedCookieLocale) {
    return null;
  }

  const overlayLink = pendingRedirectHref ? (
    <Link
      href={pendingRedirectHref}
      onClick={handlePendingRedirectClick}
      className="pointer-events-auto fixed inset-0 z-50 bg-black/60"
      aria-hidden="true"
      tabIndex={-1}
    />
  ) : undefined;

  return (
    <>
      {pendingRedirect && !isQuestionOpen && !isListOpen && pendingRedirectHref && (
        <Link
          href={pendingRedirectHref}
          onClick={handlePendingRedirectClick}
          className="fixed inset-0 z-50"
          aria-hidden="true"
          tabIndex={-1}
        />
      )}

      <Dialog
        open={isQuestionOpen}
        onOpenChange={(isOpen) => {
          setIsQuestionOpen(isOpen);
          if (!isOpen) setIsListOpen(false);
        }}
      >
        <DialogContent
          showClose={false}
          data-locale-intent-modal="true"
          overlaySlot={overlayLink}
          onInteractOutside={(e) => e.preventDefault()}
          className="gap-8 max-w-md border-none !rounded-[28px] bg-[#200D33] p-10 text-white"
        >
          <div className="flex justify-center">
            <LocaleFlagImage
              size={37}
              src={suggestedLocaleConfig.flagIcon}
              alt={suggestedLocaleConfig.nativeName}
              fallbackCode={suggestedLocaleConfig.code}
              className="shrink-0"
            />
          </div>
          <DialogTitle className="text-center text-base font-semibold">
            Are you from the {suggestedLocaleConfig.nativeName}?
          </DialogTitle>
          <div className="flex flex-col gap-2">
            <Link
              href={pendingRedirectHref}
              onClick={handlePendingRedirectClick}
              className="flex h-11 items-center justify-center rounded-full bg-[#D2189A] text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#D2189A]/80 focus:outline-none"
            >
              Yes, continue
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsQuestionOpen(false);
                setIsListOpen(true);
              }}
              className="h-11 rounded-full bg-[#2C1A3D] text-sm font-semibold text-white/90 transition hover:bg-[#2C1A3D]/80"
            >
              No, choose another country
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isListOpen}
        onOpenChange={(isOpen) => {
          setIsListOpen(isOpen);
          if (!isOpen) setIsQuestionOpen(false);
        }}
      >
        <DialogContent
          showClose={false}
          data-locale-intent-modal="true"
          overlaySlot={overlayLink}
          onInteractOutside={(e) => e.preventDefault()}
          className="max-w-md !rounded-[28px] border-none bg-[#200D33] p-6 text-white"
        >
          <button
            type="button"
            onClick={() => {
              setIsListOpen(false);
              setIsQuestionOpen(true);
            }}
            className="mb-2 inline-flex w-fit items-center text-[#58486C] transition hover:text-white"
            aria-label="Back to locale question"
          >
            <ArrowLeft className="size-4" />
          </button>

          <DialogTitle className="mb-2 text-center text-xl font-bold uppercase">
            Choose a country
          </DialogTitle>

          <div className="relative mb-3 rounded-full border-[2px] border-[#382947]">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/50" />
            <Input
              value={query}
              autoFocus
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Enter a country"
              className="h-10 rounded-full border-none bg-[#2C1A3D] pl-10 text-white placeholder:text-white/40 shadow-[inset_0px_5px_12.2px_0px_#8C8C8C2B]"
            />
          </div>

          <div className="mb-4 max-h-56 space-y-2 overflow-y-auto px-3">
            {filteredLocales.map((locale) => {
              const isActive = selectedLocale === locale.code;
              return (
                <button
                  key={locale.code}
                  type="button"
                  onClick={() => setSelectedLocale(locale.code)}
                  className={[
                    "flex border-[2px] w-full items-center rounded-[14px] px-2 py-1.5 text-left text-sm bg-[#2B1C39]",
                    isActive
                      ? "border-[#9738C3] shadow-[0px_4px_18.3px_0px_#FFFFFF40_inset]"
                      : "border-[#2B1C39] bg-[#2B1C39] hover:bg-[#2B1C39]/80 hover:border-[#9738C3]/80",
                  ].join(" ")}
                >
                  <LocaleFlagImage
                    size={37}
                    src={locale.flagIcon}
                    alt={locale.nativeName}
                    fallbackCode={locale.code}
                    className="mr-3 shrink-0"
                  />
                  <span className="min-w-0 flex-1 truncate">{locale.nativeName}</span>
                </button>
              );
            })}
          </div>

          <Link
            href={selectedLocaleHref}
            onClick={handleSelectedLocaleClick}
            className="flex h-11 w-full items-center justify-center rounded-full bg-[#FF1FC7] text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#ff1fc7]/90"
          >
            Continue
          </Link>
        </DialogContent>
      </Dialog>
    </>
  );
}
