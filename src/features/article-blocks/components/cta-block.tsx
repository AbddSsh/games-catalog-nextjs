import Link from "next/link";
import { Button } from "@/shared/ui";
import type { IBlogCtaBlock } from "@/entities/blog/model/blog.types";

interface ICtaBlockProps {
  block: IBlogCtaBlock;
}

export function CtaBlock({ block }: ICtaBlockProps) {
  return (
    <div className="flex w-full justify-center">
      <Button
        asChild
        className="min-w-[70%] rounded-[13px] bg-[#A4115E] px-6 text-center text-[16.8px] font-bold uppercase leading-[1] text-white hover:bg-[#A4115E]/90"
        style={{
          boxShadow: "0px 4px 4px 0px #00000040, inset 0px 2px 4px 0px #FFFFFF40",
        }}
      >
        <Link href={block.ctaUrl} target="_blank" rel="noreferrer">
          {block.ctaLabel}
        </Link>
      </Button>
    </div>
  );
}
