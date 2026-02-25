import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { ENV } from "@/shared/config";
import { CACHE_TAGS } from "@/shared/config/cache.config";
import { ROUTES } from "@/shared/router";

/** Модели, которые бэкенд может передать для ревалидации */
const ENUM_REVALIDATE_MODEL = {
  GAME: "game",
  CATEGORY: "category",
  GAMES_LIST: "games",
  CATEGORIES_LIST: "categories",
  PAGE_HOME: "page_home",
  LOCALES: "locales",
  TRANSLATIONS: "translations",
} as const;

type TRevalidateModel = (typeof ENUM_REVALIDATE_MODEL)[keyof typeof ENUM_REVALIDATE_MODEL];

interface IRevalidateBody {
  secret?: string;
  /** Модель сущности — ревалидируем по тегам и путям */
  model?: TRevalidateModel;
  /** Данные сущности: slug, locale и т.д. */
  entry?: { slug?: string; locale?: string };
  /** Явный path для revalidatePath (например /en/game/hero-wars). Имеет приоритет над model+entry */
  path?: string;
  /** Один тег для revalidateTag */
  tag?: string;
  /** Несколько тегов */
  tags?: string[];
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as IRevalidateBody;
    const { secret, model, entry, path: pathFromBody, tag, tags } = body;

    if (!ENV.REVALIDATION_SECRET || secret !== ENV.REVALIDATION_SECRET) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    const revalidatedPaths: string[] = [];
    const revalidatedTags: string[] = [];

    // Явный path
    if (pathFromBody?.trim()) {
      revalidatePath(pathFromBody.trim());
      revalidatedPaths.push(pathFromBody.trim());
    }

    // Явные теги
    const explicitTags = [...(tag ? [tag] : []), ...(tags || [])].filter(Boolean);
    for (const t of explicitTags) {
      revalidateTag(t);
      revalidatedTags.push(t);
    }

    // По model + entry
    if (model && !pathFromBody && explicitTags.length === 0) {
      const lang = entry?.locale || "en";

      switch (model) {
        case ENUM_REVALIDATE_MODEL.GAME: {
          const slug = entry?.slug;
          revalidateTag(CACHE_TAGS.GAMES);
          if (slug) {
            revalidateTag(CACHE_TAGS.GAME(slug));
            revalidatedTags.push(CACHE_TAGS.GAME(slug));
            revalidatePath(`/${lang}${ROUTES.GAME}/${slug}`);
            revalidatedPaths.push(`/${lang}${ROUTES.GAME}/${slug}`);
          }
          revalidatedTags.push(CACHE_TAGS.GAMES);
          break;
        }
        case ENUM_REVALIDATE_MODEL.CATEGORY: {
          const slug = entry?.slug;
          revalidateTag(CACHE_TAGS.CATEGORIES);
          if (slug) {
            revalidateTag(CACHE_TAGS.CATEGORY(slug));
            revalidatedTags.push(CACHE_TAGS.CATEGORY(slug));
            revalidatePath(`/${lang}${ROUTES.CATEGORY}/${slug}`);
            revalidatedPaths.push(`/${lang}${ROUTES.CATEGORY}/${slug}`);
          }
          revalidatedTags.push(CACHE_TAGS.CATEGORIES);
          break;
        }
        case ENUM_REVALIDATE_MODEL.GAMES_LIST:
          revalidateTag(CACHE_TAGS.GAMES);
          revalidatedTags.push(CACHE_TAGS.GAMES);
          revalidatePath(`/${lang}${ROUTES.CATALOG}`);
          revalidatedPaths.push(`/${lang}${ROUTES.CATALOG}`);
          break;
        case ENUM_REVALIDATE_MODEL.CATEGORIES_LIST:
          revalidateTag(CACHE_TAGS.CATEGORIES);
          revalidatedTags.push(CACHE_TAGS.CATEGORIES);
          revalidatePath(`/${lang}${ROUTES.CATALOG}`);
          revalidatedPaths.push(`/${lang}${ROUTES.CATALOG}`);
          break;
        case ENUM_REVALIDATE_MODEL.PAGE_HOME:
          revalidateTag(CACHE_TAGS.PAGE_HOME);
          if (entry?.locale) {
            revalidateTag(CACHE_TAGS.PAGE_HOME_LOCALE(entry.locale));
            revalidatedTags.push(CACHE_TAGS.PAGE_HOME_LOCALE(entry.locale));
          }
          revalidatedTags.push(CACHE_TAGS.PAGE_HOME);
          revalidatePath(`/${lang}`);
          revalidatedPaths.push(`/${lang}`);
          break;
        case ENUM_REVALIDATE_MODEL.LOCALES:
          revalidateTag(CACHE_TAGS.LOCALES);
          revalidatedTags.push(CACHE_TAGS.LOCALES);
          revalidatePath("/", "layout");
          revalidatedPaths.push("/ (layout)");
          break;
        case ENUM_REVALIDATE_MODEL.TRANSLATIONS: {
          const locale = entry?.locale || lang;
          revalidateTag(CACHE_TAGS.TRANSLATIONS);
          revalidateTag(CACHE_TAGS.TRANSLATION(locale));
          revalidatedTags.push(CACHE_TAGS.TRANSLATIONS, CACHE_TAGS.TRANSLATION(locale));
          revalidatePath(`/${locale}`);
          revalidatePath(`/${locale}${ROUTES.CATALOG}`);
          revalidatedPaths.push(`/${locale}`, `/${locale}${ROUTES.CATALOG}`);
          break;
        }
        default:
          return NextResponse.json({ message: "Unknown model", model }, { status: 400 });
      }
    }

    return NextResponse.json({
      message: "Revalidation successful",
      revalidatedPaths,
      revalidatedTags,
      ...(model && { model }),
    });
  } catch (error) {
    console.error("Error during revalidation:", error);
    return NextResponse.json({ message: "Error during revalidation" }, { status: 500 });
  }
}
