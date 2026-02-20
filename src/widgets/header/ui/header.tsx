/**
 * Header Widget
 * Main site header with logo, navigation, language selector, and search
 */

import { Suspense } from "react";
import { HeaderNav } from "./header-nav";
import { HeaderSearch } from "./header-search";
import { LanguageSelector } from "@/features/language-selector";
import type { INavItem } from "@/shared/types";
import type { ILocaleConfig } from "@/entities/locale";
import type { ITranslations } from "@/entities/translations";
import Image from "next/image";
import Link from "next/link";

interface IHeaderProps {
  locale: string;
  locales: ILocaleConfig[];
  navigation?: INavItem[];
  translations: ITranslations;
}

export function Header({ locale, locales, navigation = [], translations }: IHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full">
      <section className="flex items-center bg-bg-light h-[70px]">
        <div className="flex items-center justify-between gap-4 max-w-[1400px] mx-auto w-full py-4 px-[25px]">
          <Link href={`/${locale}`} className="max-w-[120px] h-[31px] min-w-[70px]">
            <Image
              src={"/logo.svg"}
              alt="logo"
              width={100}
              height={100}
            />
          </Link>
          <div className="grid grid-flow-col gap-4 justify-items-end">
            <Suspense fallback={null}>
              <LanguageSelector currentLocale={locale} locales={locales} />
            </Suspense>
            <Suspense fallback={null}>
              <HeaderSearch locale={locale} placeholder={translations.common.search} />
            </Suspense>
          </div>
        </div>
      </section>
      <section className="bg-bg-main">
        <div className="grid  items-center max-w-[1400px] mx-auto w-full py-4 px-[25px] h-[60px]">
          <Suspense fallback={null}>
            <HeaderNav locale={locale} items={navigation} translations={translations} />
          </Suspense>
        </div>
      </section>
    </header>
  );
}
