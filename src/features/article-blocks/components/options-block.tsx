import { ChevronLeft, ChevronRight } from "lucide-react";
import type { IBlogOptionsBlock } from "@/entities/blog/model/blog.types";
import { ArticleImageWithLoader } from "./article-image-with-loader";

interface IOptionsBlockProps {
  block: IBlogOptionsBlock;
  baseKey: string;
}

export function OptionsBlock({ block, baseKey }: IOptionsBlockProps) {
  return (
    <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-20">
      {[block.optionFirst, block.optionSecond].map((option, optionIndex) => (
        <div
          key={`${baseKey}-${optionIndex}`}
          className="rounded-[16px] border border-[#A869E442] bg-[linear-gradient(120.81deg,rgba(168,105,228,0.07)_6.11%,rgba(255,255,255,0.07)_95.17%)] p-[22px]"
        >
          <div className="mb-6 overflow-hidden rounded-[16px] border border-[#A869E442]">
            <ArticleImageWithLoader
              src={option.image}
              alt={option.title}
              width={820}
              height={460}
              className="h-auto w-full object-cover"
            />
          </div>
          <p className="text-center text-[20px] font-bold uppercase leading-[1] text-text-primary">{option.title}</p>
        </div>
      ))}

      <div className="pointer-events-none absolute bottom-[22px] left-1/2 top-[22px] hidden -translate-x-1/2 items-center sm:flex">
        <div className="relative flex h-full items-center justify-center">
          <div className="h-full w-px bg-[#A869E442]" />
          <span className="absolute inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#A869E442] bg-[#2A2145] text-[#BFA8DF]">
            <ChevronLeft className="h-4 w-4" />
            <ChevronRight className="-ml-1 h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  );
}
