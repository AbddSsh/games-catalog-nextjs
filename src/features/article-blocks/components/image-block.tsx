import type { IBlogImageBlock } from "@/entities/blog/model/blog.types";
import { ArticleImageWithLoader } from "./article-image-with-loader";

interface IImageBlockProps {
  block: IBlogImageBlock;
}

export function ImageBlock({ block }: IImageBlockProps) {
  return (
    <div className="overflow-hidden rounded-[14px]">
      <ArticleImageWithLoader
        src={block.url}
        alt=""
        width={1000}
        height={560}
        className="h-auto w-full object-cover"
      />
    </div>
  );
}
