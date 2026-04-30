"use client";

import { ENUM_BLOG_BLOCK_KIND, type TBlogArticleBodyBlock } from "@/entities/blog/model/blog.types";
import { AttentionBlock } from "../components/attention-block";
import { CollapseBlock } from "../components/collapse-block";
import { CtaBlock } from "../components/cta-block";
import { HeadingBlock } from "../components/heading-block";
import { ImageBlock } from "../components/image-block";
import { ImageGalleryBlock } from "../components/image-gallery-block";
import { OptionsBlock } from "../components/options-block";
import { ParagraphBlock } from "../components/paragraph-block";
import { SubheadingBlock } from "../components/subheading-block";
import { TableBlock } from "../components/table-block";
import { VersusBlock } from "../components/versus-block";
import { VideoUrlBlock } from "../components/video-url-block";

interface IBlogArticleBlocksProps {
  blocks: TBlogArticleBodyBlock[];
}

export function BlogArticleBlocks({ blocks }: IBlogArticleBlocksProps) {
  return (
    <div className="space-y-8">
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`;

        switch (block.kind) {
          case ENUM_BLOG_BLOCK_KIND.HEADING:
            return <HeadingBlock key={key} block={block} />;
          case ENUM_BLOG_BLOCK_KIND.SUBHEADING:
            return <SubheadingBlock key={key} block={block} />;
          case ENUM_BLOG_BLOCK_KIND.PARAGRAPH:
            return <ParagraphBlock key={key} block={block} />;
          case ENUM_BLOG_BLOCK_KIND.VIDEO_URL:
            return <VideoUrlBlock key={key} block={block} index={index} />;
          case ENUM_BLOG_BLOCK_KIND.IMAGE:
            return <ImageBlock key={key} block={block} />;
          case ENUM_BLOG_BLOCK_KIND.IMAGE_GALLERY:
            return <ImageGalleryBlock key={key} block={block} baseKey={key} />;
          case ENUM_BLOG_BLOCK_KIND.OPTIONS_BLOCK:
            return <OptionsBlock key={key} block={block} baseKey={key} />;
          case ENUM_BLOG_BLOCK_KIND.VERSUS_BLOCK:
            return <VersusBlock key={key} block={block} baseKey={key} />;
          case ENUM_BLOG_BLOCK_KIND.CTA:
            return <CtaBlock key={key} block={block} />;
          case ENUM_BLOG_BLOCK_KIND.COLLAPSE_BLOCK:
            return <CollapseBlock key={key} block={block} value={key} />;
          case ENUM_BLOG_BLOCK_KIND.TABLE:
            return <TableBlock key={key} block={block} baseKey={key} />;
          case ENUM_BLOG_BLOCK_KIND.ATTENTION_BLOCK:
            return <AttentionBlock key={key} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
