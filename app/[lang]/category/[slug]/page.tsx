import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryView } from "@/views/category";
import { getCategoryBySlug, getAllCategorySlugs } from "@/entities/category";
import { getLocales } from "@/entities/locale";
import { getTranslations } from "@/entities/translations";
import { getCanonicalUrl, getAlternatesLanguages } from "@/shared/lib";
import type { TViewMode } from "@/features/view-mode-toggle";
import type { TSortOption } from "@/features/sort-select";
import { ROUTES } from "@/shared/router";

interface ICategoryPageProps {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
    view?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({
  params,
}: ICategoryPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const data = await getCategoryBySlug(slug, lang);

  const translations = await getTranslations(lang);
  
  if (!data) {
    return {
      title: translations?.errors.category_not_found || "Category Not Found",
    };
  }

  const pathSegments = `${ROUTES.CATEGORY}/${slug}`.replace(/^\//, "");
  const languages = await getAlternatesLanguages(pathSegments);
  return {
    title: data.category.seo.title,
    description: data.category.seo.description,
    alternates: {
      canonical: getCanonicalUrl(lang, pathSegments),
      languages,
    },
  };
}

export async function generateStaticParams() {
  try {
    const [locales, slugs] = await Promise.all([
      getLocales(),
      getAllCategorySlugs(),
    ]);
    // Фильтруем только активные локали
    const activeLocales = locales.filter((l) => l.status === "active");
    
    // Генерируем параметры только для локали по умолчанию, чтобы избежать ошибок 404
    // Остальные локали будут генерироваться динамически при запросе
    const defaultLocale = activeLocales.find((l) => l.isDefault) || activeLocales[0];
    
    if (!defaultLocale) {
      return [];
    }
    
    return slugs.map((slug) => ({
      lang: defaultLocale.code,
      slug,
    }));
  } catch {
    console.error("Error generating static params for category pages");
    return [];
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: ICategoryPageProps) {
  const [{ lang, slug }, search] = await Promise.all([params, searchParams]);
  const page = search.page ? parseInt(search.page, 10) : 1;
  const viewMode = (search.view === "list" ? "list" : "grid") as TViewMode;
  const sort = (search.sort || "recommended") as TSortOption;

  const [data, translations] = await Promise.all([
    getCategoryBySlug(slug, lang, page),
    getTranslations(lang),
  ]);

  if (!data || !translations) {
    notFound();
  }

  return (
    <CategoryView
      data={data}
      locale={lang}
      viewMode={viewMode}
      sort={sort}
      translations={{
        home: translations.common.games,
        games: translations.common.games,
        download: translations.common.download,
        browser: translations.common.play_now,
        freeToPlay: translations.common.free_to_play,
        loadMore: translations.common.load_more,
        back: translations.common.back,
        next: translations.common?.next ?? "Next",
      }}
    />
  );
}
