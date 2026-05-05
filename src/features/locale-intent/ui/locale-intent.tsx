"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, Search } from "lucide-react";
import type { ILocaleConfig } from "@/entities/locale";
import type { ITranslationsCountry, ITranslations } from "@/entities/translations";
import { DEFAULT_LOCALE, LOCALE_SELECTED_COOKIE_NAME, LOCALE_SUGGESTED_COOKIE_NAME } from "@/shared/config";
import { apiGet } from "@/shared/api";
import { Dialog, DialogContent, DialogDescription, DialogTitle, Input } from "@/shared/ui";

interface ILocaleIntentProps {
  currentLocale: string;
  locales: ILocaleConfig[];
}

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
const COOKIE_CONSENT_STORAGE_KEY = "ggg_cookie_consent";
const COOKIE_CONSENT_TTL_MS = 1000 * 60 * 60 * 24 * 365;

type TCookieConsentSettings = {
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
};

type TConsentSignalState = "granted" | "denied";

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

function readCookieConsent(): TCookieConsentSettings | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<TCookieConsentSettings>;
    if (
      typeof parsed.analytics !== "boolean" ||
      typeof parsed.marketing !== "boolean" ||
      typeof parsed.timestamp !== "string"
    ) {
      window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
      return null;
    }

    const savedAt = Date.parse(parsed.timestamp);
    if (Number.isNaN(savedAt) || Date.now() - savedAt > COOKIE_CONSENT_TTL_MS) {
      window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
      return null;
    }

    return {
      analytics: parsed.analytics,
      marketing: parsed.marketing,
      timestamp: parsed.timestamp,
    };
  } catch {
    window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
    return null;
  }
}

function saveCookieConsent(consent: TCookieConsentSettings): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(consent));
}

function pushConsentEvent(
  eventName: "consent_init" | "consent_update",
  consent: Pick<TCookieConsentSettings, "analytics" | "marketing">
): void {
  if (typeof window === "undefined") return;
  const scopedWindow = window as unknown as {
    dataLayer?: unknown[];
    gtag?: CallableFunction;
    clarity?: CallableFunction;
  };
  const dataLayer = (scopedWindow.dataLayer ??= []);
  const analyticsState: TConsentSignalState = consent.analytics ? "granted" : "denied";
  const marketingState: TConsentSignalState = consent.marketing ? "granted" : "denied";

  if (eventName === "consent_update") {
    const gtagPayload = {
      analytics_storage: analyticsState,
      ad_storage: marketingState,
      ad_user_data: marketingState,
      ad_personalization: marketingState,
    };
    const gtagFunction = scopedWindow.gtag;
    if (typeof gtagFunction === "function") {
      gtagFunction("consent", "update", gtagPayload);
    } else {
      dataLayer.push(["consent", "update", gtagPayload]);
    }

    const clarityFunction = scopedWindow.clarity;
    if (typeof clarityFunction === "function") {
      clarityFunction("consentv2", {
        ad_Storage: marketingState,
        analytics_Storage: analyticsState,
      });
    }
  }

  dataLayer.push({
    event: eventName,
    consent_analytics: analyticsState,
    consent_marketing: marketingState,
  });
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
  const [countryTranslations, setCountryTranslations] = useState<ITranslationsCountry | null>(null);
  const [cookieConsent, setCookieConsent] = useState<TCookieConsentSettings | null>(null);
  const [cookieAnalytics, setCookieAnalytics] = useState(false);
  const [cookieMarketing, setCookieMarketing] = useState(false);
  const [isCookieOnlyMode, setIsCookieOnlyMode] = useState(false);
  const [isCookieConsentReady, setIsCookieConsentReady] = useState(false);

  const search = searchParams.toString();
  const hasGclid = searchParams.has("gclid");
  const localeCodes = useMemo(() => locales.map((locale) => locale.code), [locales]);
  const suggestedLocale = readCookie(LOCALE_SUGGESTED_COOKIE_NAME);
  const selectedCookieLocale = readCookie(LOCALE_SELECTED_COOKIE_NAME);
  const fallbackLocaleConfig = useMemo(
    () => locales.find((locale) => locale.code === currentLocale) ?? locales[0] ?? null,
    [currentLocale, locales]
  );

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

  useEffect(() => {
    const existingConsent = readCookieConsent();
    setCookieConsent(existingConsent);
    if (existingConsent) {
      setCookieAnalytics(existingConsent.analytics);
      setCookieMarketing(existingConsent.marketing);
    }
    setIsCookieConsentReady(true);
  }, []);

  // Получение переводов страны для предложенной локали
  useEffect(() => {
    const localeForTranslations = suggestedLocale || currentLocale;
    if (!localeForTranslations || hasGclid) return;

    let cancelled = false;
    apiGet<ITranslations>(`/translations/${localeForTranslations}`)
      .then((data) => {
        if (!cancelled) setCountryTranslations(data.country);
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [suggestedLocale, currentLocale, hasGclid]);

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
    if (hasGclid || selectedCookieLocale || cookieConsent) return;
    if (!suggestedLocale || suggestedLocale === currentLocale) return;

    setIsCookieOnlyMode(false);
    setIsQuestionOpen(true);
    setPendingRedirect(suggestedLocale);
    setSelectedLocale(suggestedLocale);
  }, [currentLocale, hasGclid, selectedCookieLocale, suggestedLocale, cookieConsent]);

  useEffect(() => {
    if (!isCookieConsentReady || cookieConsent) return;

    const shouldShowLocaleIntent =
      !hasGclid &&
      !selectedCookieLocale &&
      !!suggestedLocale &&
      suggestedLocale !== currentLocale;

    if (shouldShowLocaleIntent) return;

    setPendingRedirect(null);
    setIsListOpen(false);
    setIsCookieOnlyMode(true);
    setIsQuestionOpen(true);
  }, [
    isCookieConsentReady,
    cookieConsent,
    hasGclid,
    selectedCookieLocale,
    suggestedLocale,
    currentLocale,
  ]);

  useEffect(() => {
    const handler = () => {
      const existingConsent = readCookieConsent();
      setCookieConsent(existingConsent);
      setCookieAnalytics(existingConsent?.analytics ?? false);
      setCookieMarketing(existingConsent?.marketing ?? false);
      setPendingRedirect(null);
      setIsListOpen(false);
      setIsCookieOnlyMode(true);
      setIsQuestionOpen(true);
    };

    window.addEventListener("open-cookie-settings", handler as EventListener);
    return () => {
      window.removeEventListener("open-cookie-settings", handler as EventListener);
    };
  }, []);

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

  const handleCookieConsentSubmit = (analytics: boolean, marketing: boolean) => {
    const nextConsent: TCookieConsentSettings = {
      analytics,
      marketing,
      timestamp: new Date().toISOString(),
    };

    saveCookieConsent(nextConsent);
    setCookieConsent(nextConsent);
    setCookieAnalytics(analytics);
    setCookieMarketing(marketing);
    pushConsentEvent("consent_update", nextConsent);
    setIsCookieOnlyMode(false);
    setIsQuestionOpen(false);
    setIsListOpen(false);
  };

  const renderCookieSettingsSection = (showDivider: boolean) => (
    <>
      {showDivider ? (
        <div className="mt-12 h-0 w-[448px] self-center border-t border-[#B08871]/[0.22]" />
      ) : null}

      <div className={showDivider ? "mt-5 space-y-0" : "mt-0 space-y-0"}>
        <p className="text-[16.8px] font-semibold leading-[22.92px] text-white">Cookie Settings</p>
        <p className="mt-[6px] text-sm font-semibold leading-[19.1px] text-[#A69BB9]">
          We use cookies for analytics and marketing.
        </p>
        <p className="mt-1 text-sm font-semibold leading-[19.1px] text-[#A69BB9]">
          Read our{" "}
          <a
            href="https://go-get-games.com/privacy"
            target="_blank"
            rel="noreferrer"
            className="text-[#D2189A] underline underline-offset-4"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>

      <div className="mt-[13px] space-y-[10px]">
        <label className="flex cursor-pointer items-center gap-4 text-sm font-semibold leading-[19.1px] text-white">
          <span
            className={[
              "inline-flex size-[25px] items-center justify-center rounded-[6px] border-[1.72px]",
              cookieAnalytics ? "border-[#D2189A]" : "border-[#776C82]",
            ].join(" ")}
          >
            {cookieAnalytics ? <Check className="size-4 text-white" strokeWidth={3} /> : null}
          </span>
          <input
            type="checkbox"
            checked={cookieAnalytics}
            onChange={(event) => setCookieAnalytics(event.target.checked)}
            className="sr-only"
          />
          Analytics
        </label>
        <label className="flex cursor-pointer items-center gap-4 text-sm font-semibold leading-[19.1px] text-white">
          <span
            className={[
              "inline-flex size-[25px] items-center justify-center rounded-[6px] border-[1.72px]",
              cookieMarketing ? "border-[#D2189A]" : "border-[#776C82]",
            ].join(" ")}
          >
            {cookieMarketing ? <Check className="size-4 text-white" strokeWidth={3} /> : null}
          </span>
          <input
            type="checkbox"
            checked={cookieMarketing}
            onChange={(event) => setCookieMarketing(event.target.checked)}
            className="sr-only"
          />
          Marketing & Behaviour
        </label>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleCookieConsentSubmit(true, true)}
          className="h-[50px] w-[202px] rounded-[13px] bg-[#D2189A] px-4 text-[14.94px] font-bold leading-[20.37px] text-white transition hover:bg-[#D2189A]/85"
        >
          Accept All
        </button>
        <button
          type="button"
          onClick={() => handleCookieConsentSubmit(false, false)}
          className="h-[50px] w-[238px] rounded-[13px] bg-[#8A18D2] px-4 text-[14.94px] font-bold leading-[20.37px] text-white transition hover:bg-[#8A18D2]/85"
        >
          Continue without accepting
        </button>
      </div>
    </>
  );

  const displayLocaleConfig = suggestedLocaleConfig ?? fallbackLocaleConfig;

  if (!displayLocaleConfig || hasGclid || !countryTranslations) {
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
          className={[
            "gap-0 max-w-[536px] border-none !rounded-[28px] bg-[#200D33] px-[37px] pb-[31px] text-white",
            isCookieOnlyMode ? "pt-[31px]" : "pt-10",
          ].join(" ")}
        >
          {isCookieOnlyMode ? (
            <DialogTitle className="sr-only">Cookie Settings</DialogTitle>
          ) : null}
          <DialogDescription className="sr-only">
            Locale and cookie settings dialog.
          </DialogDescription>

          {!isCookieOnlyMode ? (
            <>
              <div className="flex justify-center">
                <LocaleFlagImage
                  size={37}
                  src={displayLocaleConfig.flagIcon}
                  alt={displayLocaleConfig.nativeName}
                  fallbackCode={displayLocaleConfig.code}
                  className="shrink-0"
                />
              </div>
              <DialogTitle className="mt-6 text-center text-base font-semibold">
                {countryTranslations.are_you_from} {displayLocaleConfig.nativeName}?
              </DialogTitle>
              <div className="mt-8 flex flex-col gap-2">
                <Link
                  href={pendingRedirectHref}
                  onClick={handlePendingRedirectClick}
                  className="flex h-[56px] items-center justify-center rounded-[22px] bg-[#D2189A] text-[16.8px] font-bold uppercase leading-[22.9px] text-white transition hover:bg-[#D2189A]/80 focus:outline-none"
                >
                  {countryTranslations.yes_continue}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsQuestionOpen(false);
                    setIsListOpen(true);
                  }}
                  className="h-[56px] rounded-[22px] bg-[#402955] text-[16.8px] font-semibold leading-[22.9px] text-white/90 transition hover:bg-[#402955]/80"
                >
                  {countryTranslations.no_choose_another_country}
                </button>
              </div>
            </>
          ) : null}

          {renderCookieSettingsSection(!isCookieOnlyMode)}
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
          className="gap-0 max-w-[536px] !rounded-[28px] border-none bg-[#200D33] px-[37px] pb-[31px] pt-6 text-white"
        >
          <DialogDescription className="sr-only">
            Choose country and cookie settings dialog.
          </DialogDescription>

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

          <DialogTitle className="mb-2 text-center text-[21.19px] font-bold uppercase leading-[28.9px]">
            {countryTranslations.choose_a_country}
          </DialogTitle>

          <div className="relative mb-3 rounded-full border-[2px] border-[#382947]">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/50" />
            <Input
              value={query}
              autoFocus
              onChange={(event) => setQuery(event.target.value)}
              placeholder={countryTranslations.enter_a_country}
              className="h-10 rounded-full border-none bg-[#2C1A3D] pl-10 text-white placeholder:text-white/40 shadow-[inset_0px_5px_12.2px_0px_#8C8C8C2B] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-none focus:outline-none"
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
            className="flex h-[56px] w-full items-center justify-center rounded-[13px] bg-[#FF1FC7] text-[16.8px] font-bold uppercase leading-[22.9px] tracking-wide text-white transition hover:bg-[#ff1fc7]/90"
          >
            {countryTranslations.continue}
          </Link>

          {renderCookieSettingsSection(true)}
        </DialogContent>
      </Dialog>
    </>
  );
}
