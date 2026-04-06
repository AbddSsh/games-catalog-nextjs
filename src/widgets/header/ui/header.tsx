"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { HeaderNav } from "./header-nav";
import { HeaderSearch } from "./header-search";
import { LanguageSelector } from "@/features/language-selector";
import type { INavItem } from "@/shared/types";
import type { ILocaleConfig } from "@/entities/locale";
import type { ITranslations } from "@/entities/translations";
import Image from "next/image";
import Link from "next/link";
import { localePath } from "@/shared/lib";
import { ROUTES } from "@/shared/router";

interface IHeaderProps {
  locale: string;
  locales: ILocaleConfig[];
  navigation?: INavItem[];
  translations: ITranslations;
}

function isPromoPage(pathname: string): boolean {
  return pathname.endsWith(ROUTES.PROMO) || pathname.includes(`${ROUTES.PROMO}/`);
}

export function Header({ locale, locales, navigation = [], translations }: IHeaderProps) {
  const pathname = usePathname();
  const hidePromoBlocks = isPromoPage(pathname ?? "");

  return (
    <header className="sticky top-0 z-40 w-full">
      <section className="flex items-center bg-bg-light md:h-[70px] h-fit">
        <div className="flex items-center justify-between gap-4 max-w-[1400px] mx-auto w-full py-4 md:px-[25px] px-[16px]">
          <Link href={localePath(locale)} className="max-w-[120px] h-[31px] min-w-[70px]">
            <Image
              src={"/logo.svg"}
              alt="logo"
              width={100}
              height={100}
              quality={100}
            />
          </Link>
          {!hidePromoBlocks && (
            <div className="grid grid-flow-col gap-4 justify-items-end">
              <Suspense fallback={null}>
                {/* <LanguageSelector currentLocale={locale} locales={locales} /> */}
              </Suspense>
              <Suspense fallback={null}>
                <div className="hidden md:block">
                  <HeaderSearch locale={locale} placeholder={translations.common.search} />
                </div>
              </Suspense>
            </div>
          )}
        </div>
      </section>
      {!hidePromoBlocks && (
        <section className="bg-bg-main">
          <div className="grid  items-center max-w-[1400px] mx-auto w-full py-4 md:px-[25px] px-[16px] md:h-[60px] h-fit">
            <Suspense fallback={null}>
              <HeaderNav locale={locale} items={navigation} translations={translations} />
            </Suspense>
          </div>
        </section>
      )}
    </header>
  );
}
