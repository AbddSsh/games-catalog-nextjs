"use client";

import { useState } from "react";
import { cn } from "@/shared/lib";
import type { IContentParagraph } from "@/shared/types";

interface IGameContentTabsProps {
  gameOverview: IContentParagraph[];
  specialFeatures: IContentParagraph[];
  translations?: {
    overview: string;
    specialFeatures: string;
  };
}

export function GameContentTabs({
  gameOverview,
  specialFeatures,
  translations = {
    overview: "Game Overview",
    specialFeatures: "Special Features",
  },
}: IGameContentTabsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "features">("overview");

  const tabs = [
    { id: "overview" as const, label: translations.overview, content: gameOverview },
    { id: "features" as const, label: translations.specialFeatures, content: specialFeatures },
  ].filter((tab) => tab.content.length > 0);

  if (tabs.length === 0) {
    return null;
  }

  const activeContent = tabs.find((t) => t.id === activeTab)?.content || tabs[0].content;

  return (
    <div className="space-y-4">
      {/* Tab Buttons */}
      {tabs.length > 1 && (
        <div className="flex gap-2 border-b border-border-main">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                activeTab === tab.id
                  ? "border-accent-primary text-accent-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {activeContent.map((paragraph, index) => (
          <div key={index}>
            {paragraph.title && (
              <h4 className="mb-2 text-lg font-semibold text-text-primary">
                {paragraph.title}
              </h4>
            )}
            <p
              className="text-text-secondary"
              dangerouslySetInnerHTML={{ __html: paragraph.text }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
