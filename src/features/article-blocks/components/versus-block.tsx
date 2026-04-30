import type { IBlogVersusBlock } from "@/entities/blog/model/blog.types";

interface IVersusBlockProps {
  block: IBlogVersusBlock;
  baseKey: string;
}

export function VersusBlock({ block, baseKey }: IVersusBlockProps) {
  return (
    <div className="relative grid grid-cols-2 gap-3">
      <div className="rounded-[16px] border border-[#A869E442] bg-[linear-gradient(180deg,rgba(138,24,210,0.16)_0%,rgba(71,12,108,0.16)_100%)] p-[22px]">
        <h4 className="mb-3 text-[20px] font-bold uppercase leading-[1] text-white">{block.leftSide.title}</h4>
        <ul className="space-y-2">
          {block.leftSide.points.map((point, pointIndex) => (
            <li
              key={`${baseKey}-left-${pointIndex}`}
              className="flex items-start gap-3 text-[18px] font-normal leading-[1] text-[#FFFFFF99]"
            >
              <span className="mt-[4px] h-[11px] w-[11px] shrink-0 rounded-full bg-[#A869E4]" />
              <span>{point.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 sm:flex">
        <span className="z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#A869E4] bg-[#2F2445] text-[18px] font-bold uppercase leading-none text-white">
          VS
        </span>
      </div>

      <div className="rounded-[16px] border border-[#A869E442] bg-[linear-gradient(180deg,rgba(216,48,169,0.16)_0%,rgba(82,17,64,0.16)_100%)] p-[22px]">
        <h4 className="mb-3 text-[20px] font-bold uppercase leading-[1] text-white">{block.rightSide.title}</h4>
        <ul className="space-y-2">
          {block.rightSide.points.map((point, pointIndex) => (
            <li
              key={`${baseKey}-right-${pointIndex}`}
              className="flex items-start gap-3 text-[18px] font-normal leading-[1] text-[#FFFFFF99]"
            >
              <span className="mt-[4px] h-[11px] w-[11px] shrink-0 rounded-full bg-[#A869E4]" />
              <span>{point.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
