import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GameView } from "@/views/game";
import { getGameBySlug, getAllGameSlugs } from "@/entities/game";
import { getTranslations } from "@/entities/translations";
import { getLocales } from "@/entities/locale";
import { ROUTES } from "@/shared/router";

interface IGamePageProps {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: IGamePageProps): Promise<Metadata> {
  try {
    const { lang, slug } = await params;
    const game = await getGameBySlug(slug, lang);

    const translations = await getTranslations(lang);
    
    if (!game) {
      return {
        title: translations?.errors.game_not_found || "Game Not Found",
      };
    }

    return {
      title: game.seo.title,
      description: game.seo.description,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}/${ROUTES.GAME}/${game.slug}`,
      },
    };
  } catch {
    // Если API не поддерживает эту локаль для этой игры, возвращаем базовые метаданные
    try {
      const { lang } = await params;
      const translations = await getTranslations(lang);
      return {
        title: translations?.errors.game_not_found || "Game Not Found",
      };
    } catch {
      return {
        title: "Game Not Found",
      };
    }
  }
}

export async function generateStaticParams() {
  try {
    const [locales, slugs] = await Promise.all([
      getLocales(),
      getAllGameSlugs(),
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
    console.error("Error generating static params for game pages");
    return [];
  }
}

export default async function GamePage({ params }: IGamePageProps) {
  try {
    const { lang, slug } = await params;

    const [game, translations] = await Promise.all([
      getGameBySlug(slug, lang),
      getTranslations(lang),
    ]);

    if (!game || !translations) {
      notFound();
    }

    return (
      <GameView
        game={game}
        locale={lang}
        translations={{
          overview: translations.game.game_overview,
          specialFeatures: translations.game.special_features,
          facts: translations.game.facts,
          similarGames: translations.game.similar_games,
          playNow: translations.common.play_now,
          download: translations.common.download,
          freeToPlay: translations.common.free_to_play,
          browser: translations.common.play_now,
          home: translations.common.games,
          games: translations.common.games,
        }}
      />
    );
  } catch {
    // Если API не поддерживает эту локаль, возвращаем 404
    notFound();
  }
}
