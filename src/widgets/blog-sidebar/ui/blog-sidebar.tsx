import Link from "next/link";
import { localePath } from "@/shared/lib";
import { ROUTES } from "@/shared/router";
import type { ICategoryCard } from "@/entities/category";
import type { IGameBase } from "@/entities/game";

interface IBlogSidebarProps {
  locale: string;
  categories: ICategoryCard[];
  tryThisWeek: IGameBase[];
}

export function BlogSidebar({
  locale,
  categories,
  tryThisWeek,
}: IBlogSidebarProps) {
  return (
    // laptop:sticky top-[140px] laptop:self-start
    <aside className="space-y-3">
      <div className="space-y-4 rounded-[16px] border border-[#A869E442] bg-[linear-gradient(120.81deg,rgba(168,105,228,0.07)_6.11%,rgba(255,255,255,0.07)_95.17%),linear-gradient(270deg,rgba(21,21,52,0.79)_0%,#151534_97.51%)] p-5">
        <h3 className="text-[18px] font-bold uppercase leading-none text-[#B944DB]">Find your game</h3>
        <p className="text-[17px] font-normal leading-none text-[#DEDEDE]">What genre do you prefer?</p>
        <div className="flex flex-wrap gap-1.5">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.slug}
              href={localePath(locale, `${ROUTES.CATEGORY}/${category.slug}`)}
              className="inline-flex h-[31px] items-center rounded-[23.31px] border border-[#8B76A9] bg-[#332551] px-5 text-[16px] font-normal leading-none text-[#CABBE0] transition-[transform,background-color] duration-200 hover:scale-[1.02] hover:bg-[#443365]"
            >
              {category.name}
            </Link>
          ))}
        </div>
        <Link
          href={localePath(locale, ROUTES.CATALOG)}
          className="block rounded-full bg-[#C12FC7] py-2.5 text-center text-[16.8px] font-bold leading-none text-white transition-opacity hover:opacity-90"
        >
          Show me games
        </Link>
      </div>

      <div className="space-y-4 rounded-[16px] border border-[#A869E442] bg-[linear-gradient(120.81deg,rgba(168,105,228,0.07)_6.11%,rgba(255,255,255,0.07)_95.17%)] p-5">
        <h3 className="text-[18px] font-bold leading-none text-[#6DD963]">Try this week</h3>
        <div className="space-y-2.5">
          {tryThisWeek.map((game) => (
            <Link
              key={game.slug}
              href={localePath(locale, `${ROUTES.GAME}/${game.slug}`)}
              className="flex items-center justify-between gap-2 rounded-[7px] border border-white/10 bg-[#FFFFFF08] px-3 py-2 transition-colors hover:border-accent-purple/70"
            >
              <div className="min-w-0">
                <p className="truncate text-[17px] font-bold leading-[22px] text-text-primary">{game.name}</p>
                <p className="text-xs text-[#E660EB]">{game.genres.map((item) => item.name).join(", ")}</p>
              </div>
              <span className="inline-flex h-7 items-center rounded-[28px] bg-button px-4 text-[14px] font-bold leading-none text-white">
                Play
              </span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
