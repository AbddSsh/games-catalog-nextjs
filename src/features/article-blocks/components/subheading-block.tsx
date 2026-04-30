import type { IBlogSubheadingBlock } from "@/entities/blog/model/blog.types";

interface ISubheadingBlockProps {
  block: IBlogSubheadingBlock;
}

export function SubheadingBlock({ block }: ISubheadingBlockProps) {
  return <h3 className="text-[30px] font-bold uppercase leading-[1] text-text-primary">{block.value}</h3>;
}
