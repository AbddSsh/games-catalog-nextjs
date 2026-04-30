import type { IBlogParagraphBlock } from "@/entities/blog/model/blog.types";

interface IParagraphBlockProps {
  block: IBlogParagraphBlock;
}

export function ParagraphBlock({ block }: IParagraphBlockProps) {
  return (
    <p className="whitespace-pre-wrap text-[18px] font-normal leading-[1.2] text-[#FFFFFF99]">
      {block.value}
    </p>
  );
}
