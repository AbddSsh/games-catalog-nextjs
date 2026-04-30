import type { IBlogAttentionBlock } from "@/entities/blog/model/blog.types";

interface IAttentionBlockProps {
  block: IBlogAttentionBlock;
}

export function AttentionBlock({ block }: IAttentionBlockProps) {
  return (
    <div className="rounded-[16px] bg-[#C26B82] p-0">
      <div
        className="relative left-[10px] rounded-[16px] py-[28px] pl-[40px] pr-[28px]"
        style={{
          background:
            "linear-gradient(92.51deg, #382132 -7.91%, #1F1F30 19.51%, #191F2F 78.82%, #2F1F43 104.56%)",
        }}
      >
        <h4 className="mb-7 text-[30px] font-extrabold uppercase leading-[1] text-text-primary">{block.title}</h4>
        <p className="text-[18px] font-normal leading-[1] text-[#FFFFFF99]">{block.value}</p>
      </div>
    </div>
  );
}
