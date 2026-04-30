import type { IBlogVideoUrlBlock } from "@/entities/blog/model/blog.types";

interface IVideoUrlBlockProps {
  block: IBlogVideoUrlBlock;
  index: number;
}

export function VideoUrlBlock({ block, index }: IVideoUrlBlockProps) {
  return (
    <div
      className="aspect-video overflow-hidden rounded-[14px] bg-black"
      style={{ boxShadow: "0px 0px 17.3px 0px #A869E4" }}
    >
      <iframe
        src={block.url}
        className="h-full w-full"
        title={`blog-video-${index}`}
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
