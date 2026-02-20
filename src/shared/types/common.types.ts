/**
 * Common types used across the application
 * Based on official API specification
 */

// Pagination
export interface IPagination {
  page: number;
  elements: number;
  totalPages: number;
  totalItems: number;
  hasMore: boolean;
}

// Paginated API response
export interface IPaginatedResponse<T> {
  items: T[];
  pagination: IPagination;
}

// API Error format
export interface IApiError {
  statusCode: number;
  message: string;
  error: string;
}

// Content paragraph (used in gameOverview, specialFeatures, facts, seoText)
// HTML links (<a>) allowed ONLY in gameOverview and specialFeatures on game page
export interface IContentParagraph {
  title: string;
  text: string;
}

// SEO metadata
export interface ISeoMeta {
  title: string;
  description: string;
  canonical: string;
}

// FAQ item
export interface IFaqItem {
  question: string;
  answer: string;
}

// Navigation item
export interface INavItem {
  label: string;
  href: string;
  icon?: string;
}

// Navigation structure
export interface INavigation {
  header: INavItem[];
  footer: INavItem[];
}
