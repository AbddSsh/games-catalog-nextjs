import { Fragment } from "react";
import type { IGameFact } from "@/entities/game";

interface IFactsSidebarProps {
  facts: IGameFact[];
  title?: string;
}

export function FactsSidebar({ facts, title = "Facts" }: IFactsSidebarProps) {
  if (facts.length === 0) {
    return null;
  }

  return (
    <aside
      className="h-fit rounded-[13px] p-[1px]"
      style={{
        background:
          "linear-gradient(90deg, #6A85B0 0%, #2F2D42 50%, #4B2A66 100%)",
      }}
    >
      <div className="rounded-[12px] bg-[#16172C] p-6">
        <h2 className="mb-4 text-lg font-black text-text-primary">{title}</h2>
        <dl className="grid grid-cols-[minmax(auto,0.5fr)_1fr] gap-x-4 gap-y-4">
          {facts.map((fact, index) => (
            <Fragment key={index}>
              <dt className="whitespace-normal text-xs font-normal text-text-primary">
                {fact.title}:
              </dt>
              <dd className="whitespace-pre-line text-start text-xs font-black text-text-primary">
                {fact.text}
              </dd>
            </Fragment>
          ))}
        </dl>
      </div>
    </aside>
  );
}
