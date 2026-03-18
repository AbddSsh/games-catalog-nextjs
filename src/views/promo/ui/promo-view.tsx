import { getPromoGames } from "@/entities/game";
import { PromoCard } from "./promo-card";
import { Pagination } from "@/features/pagination";
import { ROUTES } from "@/shared/router";

interface IPromoViewProps {
  locale: string;
  page?: number;
  elements?: number;
  translations: {
    loadMore: string;
    back: string;
    next: string;
  };
}


export async function PromoView({
  locale,
  page = 1,
  elements,
  translations,
}: IPromoViewProps) {
  const { items, pagination } = await getPromoGames({ locale, page, elements });

  return (
    <section className="flex flex-col gap-10 pt-[40px]">
      <h1 className="text-3xl font-bold text-text-primary">
        Best Online Games 2026
      </h1>

      <div className="flex flex-col gap-3">
        {items.map((game) => (
          <PromoCard key={game.id} game={game} locale={locale} />
        ))}
      </div>

      {(pagination.totalPages > 1 || items.length < pagination.totalItems) && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          locale={locale}
          basePath={ROUTES.PROMO}
          currentElements={elements}
          elementsStep={elements}
          totalItems={pagination.totalItems}
          translations={translations}
        />
      )}
    </section>
  );
}
