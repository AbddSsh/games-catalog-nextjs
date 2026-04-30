import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui";
import type { IBlogCollapseBlock } from "@/entities/blog/model/blog.types";

interface ICollapseBlockProps {
  block: IBlogCollapseBlock;
  value: string;
}

export function CollapseBlock({ block, value }: ICollapseBlockProps) {
  return (
    <div
      className="rounded-[16px] p-[2px]"
      style={{ background: "linear-gradient(90deg, rgba(95, 104, 135, 0.14) 0%, rgba(96, 73, 118, 0.14) 100%)" }}
    >
      <Accordion
        type="single"
        collapsible
        className="rounded-[14px] bg-[linear-gradient(120.81deg,rgba(168,105,228,0.07)_6.11%,rgba(255,255,255,0.07)_95.17%)] px-[28px]"
      >
        <AccordionItem value={value} className="border-none">
          <AccordionTrigger className="py-[28px] text-left text-[25px] font-semibold uppercase leading-[1] text-[#D6ACFF] hover:no-underline [&>svg]:h-8 [&>svg]:w-8">
            {block.title}
          </AccordionTrigger>
          <AccordionContent className="pb-[28px] pt-0 text-[18px] font-normal leading-[1] text-[#FFFFFF99]">
            {block.description}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
