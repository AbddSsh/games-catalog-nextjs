import type { IBlogHeadingBlock } from "@/entities/blog/model/blog.types";

interface IHeadingBlockProps {
  block: IBlogHeadingBlock;
}

export function HeadingBlock({ block }: IHeadingBlockProps) {
  return <h2 className="text-[30px] font-extrabold leading-[1.2] text-text-primary">{block.value}</h2>;
}
