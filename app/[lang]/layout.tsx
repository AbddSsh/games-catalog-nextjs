import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { getTranslations } from "@/entities/translations";
import { getHomePage } from "@/entities/page";
import { getLocales } from "@/entities/locale";
import "@/shared/styles/globals.scss";
import NextTopLoader from "nextjs-toploader";
import Head from "next/head";
import { Suspense } from "react";
import { ScrollTopButton } from "@/widgets/scroll-top";
import { LocaleIntent } from "@/features/locale-intent";

const nunitoSans = Nunito_Sans({
  subsets: ["latin", "cyrillic"],
  variable: "--font-nunito-sans",
  display: "swap",
});

interface ILangLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    lang: string;
  }>;
}

export async function generateMetadata({
  params,
}: ILangLayoutProps): Promise<Metadata> {
  const { lang } = await params;
  const translations = await getTranslations(lang);
  
  if (!translations) {
    return {
      title: "GameSite",
      description: "Free Online Games",
    };
  }

  return {
    title: {
      default: translations.meta.default_title,
      template: `%s | ${translations.meta.site_name}`,
    },
    description: translations.meta.default_description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  };
}

export default async function LangLayout({
  children,
  params,
}: ILangLayoutProps) {
  const { lang } = await params;
  const locales = await getLocales();
  const supportedCodes = locales.map((l) => l.code);

  if (!supportedCodes.includes(lang)) {
    notFound();
  }

  const locale = lang;

  const [pageConfig, translations] = await Promise.all([
    getHomePage(locale),
    getTranslations(locale),
  ]);

  if (!translations) {
    notFound();
  }

  const GTM_ID = "GTM-MZZ4MGGH";

  return (
    <html lang={locale} className={`dark ${nunitoSans.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
try {
  var c = JSON.parse(localStorage.getItem('ggg_cookie_consent') || '{}');
  window.gtag('consent', 'default', {
    analytics_storage: c.analytics ? 'granted' : 'denied',
    ad_storage: c.marketing ? 'granted' : 'denied',
    ad_user_data: c.marketing ? 'granted' : 'denied',
    ad_personalization: c.marketing ? 'granted' : 'denied',
    wait_for_update: 500
  });
  window.dataLayer.push({
    event: 'consent_init',
    consent_analytics: c.analytics ? 'granted' : 'denied',
    consent_marketing: c.marketing ? 'granted' : 'denied'
  });
} catch (e) {
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });
  window.dataLayer.push({
    event: 'consent_init',
    consent_analytics: 'denied',
    consent_marketing: 'denied'
  });
}`,
          }}
        />
        {/* Google Tag Manager - as high in head as possible */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        <meta name="google-site-verification" content="1Pa-5zedmxoqMHGTpMiVKO-1_e0ijaTC81Tt0RY2urg" />
        <meta name="msapplication-TileColor" content="#091121" />
        <meta name="theme-color" content="#091121" />
        {/* Google Tag Manager */}
        {/* <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-582D3SVQ');
          `}
        </Script> */}
        {/* Яндекс.Метрика */}
        {/* <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            
            // Инициализация после загрузки скрипта
            (function() {
              if (typeof window !== 'undefined' && window.ym) {
                window.ym(100210634, "init", {
                  defer: true,
                  clickmap: true,
                  trackLinks: true,
                  accurateTrackBounce: true
                });
              } else {
                // Если ym еще не загружен, ждем
                setTimeout(arguments.callee, 100);
              }
            })();
          `}
        </Script> */}
        {/* <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "MoneySwap",
              "url": process.env.NEXT_PUBLIC_SITE_URL,
              "logo": "/og_logo.svg",
              "description": "MoneySwap - удобный помощник для поиска обменников в любой точке мира",
              "sameAs": [
                "https://t.me/moneyswap",
                "https://t.me/moneyswap_robot",
                "https://vc.ru/u/3979537-moneyswap",
                "https://dzen.ru/moneyswap",
              ],
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "contactType": "customer service",
                  "url": "https://t.me/moneyswap_support",
                  "availableLanguage": ["Russian", "English"]
                },
                {
                  "@type": "ContactPoint",
                  "contactType": "partnership",
                  "email": "exchange@moneyswap.online",
                  "availableLanguage": ["Russian", "English"]
                }
              ],
              "foundingDate": "2024",
            }).replace(/</g, '\\u003c')
          }}
        /> */}
      </head>
      <Head>
        <link rel="icon" href="/public/favicon/favicon.ico" />
        <link rel="icon" href="/favicon/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={`${nunitoSans.className} flex flex-col min-h-screen items-center`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <NextTopLoader
          color="#A855F7"
          initialPosition={0.08}
          crawlSpeed={50}
          height={4}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={50}
        />

        <Header
          locale={locale}
          locales={locales}
          navigation={pageConfig.navigation?.header}
          translations={translations}
        />
        <Suspense fallback={null}>
          <LocaleIntent currentLocale={locale} locales={locales} />
        </Suspense>

        <main className="max-w-[1400px] flex-grow w-full pb-[40px] mobile-xl:px-[25px] px-[15px]">
          {children}
        </main>

        <ScrollTopButton />

        <Suspense fallback={null}>
          <Footer
            locale={locale}
            navigation={pageConfig.navigation?.footer}
            translations={translations}
          />
        </Suspense>
      </body>
    </html>
  );
}
