
import type {
  ISeoMeta,
  IFaqItem,
  INavigation,
} from "@/shared/types";
import type { IGameBase } from "@/entities/game";

// Hero carousel config (best-pick filter)
export interface IHeroConfig {
  label: string;
  filter: string;
  elements: number;
}

// Genres tabs section config
export interface IGenresSection {
  title: string;
  subtitle: string;
  tabs?: string[];
  elements: number;
  viewAllLink?: string;
}

// Game section config (carousel of games)
export interface IGameSectionConfig {
  title: string;
  subtitle: string;
  filter: string;
  elements: number;
}

// Why play feature item
export interface IWhyPlayFeature {
  icon: string;
  title: string;
  description: string;
}

// Why play section
export interface IWhyPlaySection {
  title: string;
  features: IWhyPlayFeature[];
}

// FAQ section
export interface IFaqSection {
  title: string;
  items: IFaqItem[];
}

// Catalog CTA section
export interface ICatalogCtaSection {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  image: string;
}

// Home page config (GET /api/pages/home)
export interface IHomePage {
  hero: IHeroConfig;
  genres: IGenresSection;
  gameSections: IGameSectionConfig[];
  whyPlay: IWhyPlaySection;
  faq: IFaqSection;
  catalogCta: ICatalogCtaSection;
  navigation: INavigation;
  seo: ISeoMeta;
}

// SEO landing content section (from API)
export interface ISeoLandingContentSection {
  title: string;
  text: string;
}

// SEO landing page (GET /api/pages/seo-landing/:type)
export interface ISeoLandingPage {
  type: string;
  title: string;
  description: string;
  content: ISeoLandingContentSection[];
  games: IGameBase[];
  seo: ISeoMeta;
}
