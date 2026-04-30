"use client";

import { useState } from "react";
import { cn } from "@/shared/lib";
import { GameOverviewBlocks } from "@/widgets/game-overview-blocks";
import { GameFeaturesBlocks } from "@/widgets/game-features-blocks";
import type { TGameOverviewBlock, TSpecialFeatureBlock } from "@/entities/game";

interface IGameContentTabsProps {
  gameOverview: TGameOverviewBlock[];
  specialFeatures: TSpecialFeatureBlock[];
  trackingCtaUrl?: string;
  translations?: {
    overview: string;
    specialFeatures: string;
  };
}

export function GameContentTabs({
  gameOverview,
  specialFeatures,
  trackingCtaUrl,
  translations = {
    overview: "Game Overview",
    specialFeatures: "Special Features",
  },
}: IGameContentTabsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "features">("overview");

  const HAS_OVERVIEW = gameOverview.length > 0;
  const HAS_FEATURES = specialFeatures.length > 0;

  if (!HAS_OVERVIEW && !HAS_FEATURES) return null;

  return (
    <div className="space-y-5">
      {HAS_OVERVIEW && HAS_FEATURES && (
        <div className="flex gap-3">
          <TabButton
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          >
            {translations.overview}
          </TabButton>
          <TabButton
            active={activeTab === "features"}
            onClick={() => setActiveTab("features")}
          >
            {translations.specialFeatures}
          </TabButton>
        </div>
      )}

      {activeTab === "overview" && HAS_OVERVIEW && (
        <GameOverviewBlocks blocks={gameOverview} trackingCtaUrl={trackingCtaUrl} />
      )}
      {activeTab === "features" && HAS_FEATURES && (
        <GameFeaturesBlocks blocks={specialFeatures} trackingCtaUrl={trackingCtaUrl} />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "hover:scale-[1.03] transition-transform duration-300 rounded-full px-6 py-2.5 text-xs font-black uppercase tracking-wide",
        active
          ? "border-2 border-[#B744B6] bg-[#682D78] text-white shadow-[inset_0_0_16px_#D2189A,0_0_9px_#D2189A]"
          : "border border-[#312A46] bg-[#2D293F] text-text-primary hover:bg-[#3a3550]"
      )}
    >
      {children}
    </button>
  );
}
