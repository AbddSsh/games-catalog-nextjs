import type { IContentParagraph } from "@/shared/types";

interface IFactsSidebarProps {
  facts: IContentParagraph[];
  title?: string;
}

export function FactsSidebar({ facts, title = "Facts" }: IFactsSidebarProps) {
  if (facts.length === 0) {
    return null;
  }

  return (
    <aside className="rounded-lg border border-border-main bg-bg-card p-4">
      <h3 className="mb-4 text-lg font-semibold text-text-primary">{title}</h3>
      <dl className="space-y-3">
        {facts.map((fact, index) => (
          <div key={index}>
            <dt className="text-sm font-medium text-text-muted">{fact.title}</dt>
            <dd className="text-sm text-text-secondary">{fact.text}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
