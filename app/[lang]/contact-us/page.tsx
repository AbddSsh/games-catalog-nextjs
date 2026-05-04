import type { Metadata } from "next";
import { getLocales } from "@/entities/locale";
import { getTranslations } from "@/entities/translations";
import { getCanonicalUrl, getAlternatesLanguages } from "@/shared/lib";
import { ROUTES } from "@/shared/router";
import { ContactUsView } from "@/views/contact-us";

interface IContactUsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: IContactUsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const translations = await getTranslations(lang);
  const siteName = translations?.meta.default_title ?? "Site";
  const languages = await getAlternatesLanguages(ROUTES.CONTACT_US.replace(/^\//, ""));
  return {
    title: `Contact Us | ${siteName}`,
    description:
      "Have questions, feedback, or requests? Reach out to the Go Get Games team. We will get back to you as soon as possible.",
    alternates: {
      canonical: getCanonicalUrl(lang, ROUTES.CONTACT_US.replace(/^\//, "")),
      languages,
    },
  };
}

export async function generateStaticParams() {
  try {
    const locales = await getLocales();
    const activeLocales = locales.filter((l) => l.status === "active");
    return activeLocales.map((l) => ({ lang: l.code }));
  } catch (error) {
    console.error("Error generating static params for contact-us:", error);
    return [];
  }
}

export default async function ContactUsPage({ params }: IContactUsPageProps) {
  await params;
  return <ContactUsView />;
}
