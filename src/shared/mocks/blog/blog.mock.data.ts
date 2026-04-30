import type { IBlogArticleDetail, IBlogChip } from "@/entities/blog";

export const BLOG_MOCK_CHIPS: IBlogChip[] = [
  { slug: "all", label: "All" },
  { slug: "best-games", label: "Best games" },
  { slug: "guides", label: "Guides" },
  { slug: "compare", label: "Compare" },
  { slug: "news", label: "News" },
];

export const BLOG_MOCK_HERO_TITLE_BY_LOCALE: Record<string, string> = {
  en: "Explore Free Games with Our Blog",
  de: "Explore Free Games with Our Blog",
  fr: "Explore Free Games with Our Blog",
};

export const BLOG_MOCK_ARTICLES: IBlogArticleDetail[] = [
  {
    slug: "best-free-strategy-games-2026",
    articleHeader: {
      relatedGames: [{ name: "Total War: Warhammer III", slug: "total-war-warhammer-3" }],
      title: "Best free strategy games on PC in 2026",
      subtitle: "Rise of Kingdoms, Star Trek Fleet Command, and more in one ranked list.",
      headerImage:
        "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1600&q=80",
      publishedAt: "2026-04-08T09:30:00Z",
      readMinutes: 14,
      rating: 8.9,
      reactionsCount: 120,
    },
    articleBody: {
      blocks: [
        { kind: "heading", value: "TOP PICKS FOR 2026: STRATEGY WITHOUT PAYWALL PAIN" },
        {
          kind: "paragraph",
          value:
            "This long-form breakdown is intentionally content-heavy so you can test every article layout block and edge case in real UI conditions. The ranking focuses on active communities, fair free-to-play progression, strategic depth, and how quickly new players can become useful in PvP or guild events.",
        },
        {
          kind: "subheading",
          value: "How we ranked these games",
        },
        {
          kind: "paragraph",
          value:
            "We tested account growth speed, daily task pressure, clarity of strategic choices, and real retention signals from social platforms and patch cadence. A game scores higher if it offers multiple viable paths and does not force hard spending to stay competitive in midgame.",
        },
        {
          kind: "attentionBlock",
          title: "Methodology note",
          value:
            "Scores are editorial and practical, not sponsored. We focus on what a normal player can achieve in the first 30 days with low or zero spend.",
        },
        {
          kind: "image",
          url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1400&q=80",
        },
        {
          kind: "subheading",
          value: "Quick overview table",
        },
        {
          kind: "table",
          columns: [
            "Game",
            "Core loop",
            "F2P friendliness",
            "Session length",
            "Best for",
          ],
          rows: [
            [
              "Rise of Kingdoms",
              "Alliance conquest + map control",
              "Medium",
              "20-40 min",
              "Long-term planners",
            ],
            [
              "Star Trek Fleet Command",
              "Base growth + sector wars",
              "Medium",
              "15-30 min",
              "Asymmetric PvP fans",
            ],
            [
              "Conflict of Nations",
              "Grand strategy + diplomacy",
              "High",
              "10-20 min",
              "Slow-burn strategists",
            ],
            [
              "War Thunder",
              "Vehicle mastery + tactical fights",
              "Medium-High",
              "15-35 min",
              "Skill-expression players",
            ],
          ],
        },
        {
          kind: "subheading",
          value: "1) Rise of Kingdoms - macro decisions win wars",
        },
        {
          kind: "paragraph",
          value:
            "Rise of Kingdoms remains one of the cleanest examples of strategic compounding. Good alliance positioning, resource discipline, and commander priorities matter more than isolated spending spikes. For layout testing, this paragraph is intentionally longer and includes enough text to wrap across several lines in both desktop and mobile breakpoints.",
        },
        {
          kind: "imageGallery",
          images: [
            "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
          ],
        },
        {
          kind: "collapseBlock",
          title: "Advanced tip: migration timing",
          description:
            "If your kingdom is stagnating, migration timing can multiply progression. Move only when your alliance has a clear plan and role assignment, otherwise you lose momentum.",
        },
        {
          kind: "subheading",
          value: "2) Star Trek Fleet Command - asymmetry done right",
        },
        {
          kind: "paragraph",
          value:
            "The game rewards information advantage. Knowing when to punch above your ship class, when to farm, and when to avoid heat zones creates large strategic gaps between players with similar power levels.",
        },
        {
          kind: "videoUrl",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
        {
          kind: "optionsBlock",
          optionFirst: {
            title: "Aggressive route: early PvP pressure",
            image:
              "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
          },
          optionSecond: {
            title: "Control route: economy-first scaling",
            image:
              "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
          },
        },
        {
          kind: "collapseBlock",
          title: "Should beginners force PvP early?",
          description:
            "Usually no. Build your resource engine and mission consistency first. Early forced PvP often delays core unlocks and creates account fatigue.",
        },
        {
          kind: "subheading",
          value: "3) Conflict of Nations - diplomacy is a weapon",
        },
        {
          kind: "paragraph",
          value:
            "This is where strategic patience pays. The highest-value move is often political: trade map visibility, coordinate fake pressure, or split fronts while conserving your strongest units.",
        },
        {
          kind: "versusBlock",
          vsLabel: "Early focus comparison",
          leftSide: {
            title: "Rush expansion",
            points: [
              { value: "Fast map presence" },
              { value: "High risk of overextension" },
              { value: "Requires constant uptime" },
              { value: "Can snowball if alliance support exists" },
            ],
          },
          rightSide: {
            title: "Fortify economy",
            points: [
              { value: "Slower opening but safer scaling" },
              { value: "Higher strategic flexibility later" },
              { value: "Less punishing for casual schedules" },
              { value: "Better resilience after failed offensives" },
            ],
          },
        },
        {
          kind: "table",
          columns: ["Decision", "Short-term effect", "Long-term effect", "Risk"],
          rows: [
            ["Split army", "More map touch points", "Weaker frontline trades", "High"],
            ["Concentrate force", "Stronger local wins", "Slower expansion", "Medium"],
            ["Tech-first", "Temporary combat dip", "Power spike at midgame", "Medium"],
            ["Diplomacy-first", "Unstable trust deals", "Massive strategic leverage", "High"],
          ],
        },
        {
          kind: "attentionBlock",
          title: "Common mistake",
          value:
            "Players copy top-server openings without adapting to alliance quality and timezone activity. Your context matters more than meta templates.",
        },
        {
          kind: "subheading",
          value: "4) War Thunder - strategy through execution",
        },
        {
          kind: "paragraph",
          value:
            "War Thunder is tactical strategy under mechanical pressure. Positioning, angle control, target priority, and resource management translate directly into win rate. This section gives you dense content for rendering sustained text blocks between media segments.",
        },
        {
          kind: "image",
          url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1400&q=80",
        },
        {
          kind: "imageGallery",
          images: [
            "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
          ],
        },
        {
          kind: "subheading",
          value: "Build path recommendation for new players",
        },
        {
          kind: "paragraph",
          value:
            "Start with one nation line and one role focus. Avoid branching too early. Depth beats breadth in the first month, because knowledge of map timings and engagement angles compounds faster than raw unlock count.",
        },
        {
          kind: "CTA",
          ctaLabel: "Open full free strategy ranking with patch updates",
          ctaUrl: "https://example.com/strategy-ranking-2026",
        },
        {
          kind: "heading",
          value: "FINAL VERDICT",
        },
        {
          kind: "paragraph",
          value:
            "If you want diplomacy and macro depth, go with Conflict of Nations. If you want alliance-based growth and city pressure, pick Rise of Kingdoms. If you prefer tactical mechanical expression with strategic context, War Thunder remains a top choice. For most free players in 2026, the best game is the one that matches your session rhythm and social commitment, not just tier-list hype.",
        },
      ],
    },
    articleFooter: {
      FAQBlock: {
        title: "Strategy games FAQ",
        items: [
          {
            question: "Are these games fully free to play?",
            answer: "Yes, all games in this list are free to start and play.",
          },
          {
            question: "Which game is best if I only play 30 minutes per day?",
            answer:
              "Conflict of Nations and Star Trek Fleet Command are generally easier to maintain on shorter sessions because many decisions are strategic rather than mechanically intense.",
          },
          {
            question: "Do I need to join an alliance or clan immediately?",
            answer:
              "In most strategy titles, yes. Social infrastructure multiplies progression speed and gives access to high-value events and protection windows.",
          },
          {
            question: "What should I prioritize in my first week?",
            answer:
              "Resource stability, one clear progression route, and event participation discipline. Avoid spreading upgrades across too many systems at once.",
          },
          {
            question: "How do I avoid pay-to-win traps?",
            answer:
              "Skip low-value impulse bundles, track event efficiency, and invest only in systems that unlock permanent strategic options rather than temporary stat spikes.",
          },
        ],
      },
      isLiked: {
        kind: "isLiked",
        label: "Did you like the ARTICLE?",
        yesLabel: "Yes",
        noLabel: "No",
      },
      bottomCTA: {
        title: "Ready to choose your main strategy game for 2026?",
        captions: [
          "Free access to all listed games",
          "Detailed onboarding and role guides",
          "Weekly meta updates and patch reactions",
          "Beginner and midgame optimization checklists",
          "Faction and alliance progression roadmaps",
        ],
        ctaText: "Explore strategy hub",
        ctaUrl: "https://example.com/strategy-games-hub",
      },
    },
    seo: {
      title: "Best Free Strategy Games on PC in 2026",
      description: "Our editorial ranking of free strategy games for 2026.",
      canonical: "https://example.com/blog/best-free-strategy-games-2026",
    },
  },
  {
    slug: "dark-genesis-divine-awakening-review",
    articleHeader: {
      relatedGames: [{ name: "Dark Genesis", slug: "dark-genesis" }],
      title: "DARK GENESIS: DIVINE AWAKENING REVIEW",
      subtitle: "A polished hero-collector with excellent art direction and mixed monetization.",
      headerImage:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80",
      publishedAt: "2026-04-07T07:30:00Z",
      readMinutes: 14,
      rating: 8.2,
      reactionsCount: 89,
    },
    articleBody: {
      blocks: [
        { kind: "heading", value: "WHAT WORKS WELL" },
        {
          kind: "paragraph",
          value:
            "Combat pacing and team-building are the strongest parts of Dark Genesis in its current state.",
        },
        {
          kind: "image",
          url: "https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1400&q=80",
        },
      ],
    },
    articleFooter: {
      isLiked: {
        kind: "isLiked",
        label: "Did you like the ARTICLE?",
        yesLabel: "Yes",
        noLabel: "No",
      },
    },
    seo: {
      title: "Dark Genesis Review",
      description: "A practical review of Dark Genesis and its current meta.",
      canonical: "https://example.com/blog/dark-genesis-divine-awakening-review",
    },
  },
  {
    slug: "genshin-impact-best-team-comps-spiral-abyss",
    articleHeader: {
      relatedGames: [{ name: "Genshin Impact", slug: "genshin-impact" }],
      title: "GENSHIN IMPACT: BEST TEAM COMPS FOR SPIRAL ABYSS",
      subtitle: "Reliable teams for low-investment clears and safer rotations.",
      headerImage:
        "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1600&q=80",
      publishedAt: "2026-04-06T08:10:00Z",
      readMinutes: 20,
      rating: 8.6,
      reactionsCount: 125,
    },
    articleBody: {
      blocks: [
        { kind: "heading", value: "ABYSS TEAMS THAT SCALE" },
        {
          kind: "paragraph",
          value:
            "The comps below prioritize consistency, not speedrun numbers, which makes them ideal for weekly clears.",
        },
      ],
    },
    articleFooter: {
      bottomCTA: {
        title: "Build your next abyss team",
        captions: ["Low investment", "Flexible rotations"],
        ctaText: "Open guide",
        ctaUrl: "https://example.com/genshin-abyss",
      },
    },
    seo: {
      title: "Best Genshin Spiral Abyss Teams",
      description: "Team comp guide for Spiral Abyss in 2026.",
      canonical: "https://example.com/blog/genshin-impact-best-team-comps-spiral-abyss",
    },
  },
  {
    slug: "war-thunder-mastering-air-combat-sons-of-attila",
    articleHeader: {
      relatedGames: [{ name: "War Thunder", slug: "war-thunder" }],
      title: "WAR THUNDER: MASTERING AIR COMBAT IN SONS OF ATTILA",
      subtitle: "Practical piloting tips and energy management for patch-ready performance.",
      headerImage:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80",
      publishedAt: "2026-04-05T10:40:00Z",
      readMinutes: 15,
      rating: 8.1,
      reactionsCount: 120,
    },
    articleBody: {
      blocks: [
        { kind: "heading", value: "FLIGHT DISCIPLINE FIRST" },
        {
          kind: "paragraph",
          value:
            "Most duel losses come from poor altitude decisions, not weapon spread. Focus on setup before engagement.",
        },
      ],
    },
    articleFooter: {
      isLiked: {
        kind: "isLiked",
        label: "Did you like the ARTICLE?",
        yesLabel: "Yes",
        noLabel: "No",
      },
    },
    seo: {
      title: "War Thunder Air Combat Guide",
      description: "How to master air combat in Sons of Attila update.",
      canonical: "https://example.com/blog/war-thunder-mastering-air-combat-sons-of-attila",
    },
  },
  {
    slug: "arknights-endfield-everything-we-know",
    articleHeader: {
      relatedGames: [{ name: "Arknights: Endfield", slug: "arknights-endfield" }],
      title: "ARKNIGHTS: ENDFIELD - EVERYTHING WE KNOW",
      subtitle: "Systems overview, progression expectations, and launch signals to watch.",
      headerImage:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
      publishedAt: "2026-04-04T11:20:00Z",
      readMinutes: 10,
      rating: 7.9,
      reactionsCount: 60,
    },
    articleBody: {
      blocks: [
        { kind: "heading", value: "WHAT TO EXPECT AT LAUNCH" },
        {
          kind: "paragraph",
          value:
            "Expect onboarding depth and long-term build optimization to be core pillars of Endfield's design loop.",
        },
      ],
    },
    articleFooter: {
      bottomCTA: {
        title: "Track Endfield launch updates",
        captions: ["Patch notes", "Beta changes", "Meta watch"],
        ctaText: "Follow updates",
        ctaUrl: "https://example.com/endfield-updates",
      },
    },
    seo: {
      title: "Arknights Endfield Overview",
      description: "Everything we know about Arknights Endfield so far.",
      canonical: "https://example.com/blog/arknights-endfield-everything-we-know",
    },
  },
  {
    slug: "world-of-tanks-2026-strategy-update-review",
    articleHeader: {
      relatedGames: [{ name: "World of Tanks", slug: "world-of-tanks" }],
      title: "WORLD OF TANKS: 2026 STRATEGY UPDATE REVIEW",
      subtitle: "Meta shifts, map flow changes, and class rebalancing highlights.",
      headerImage:
        "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=1600&q=80",
      publishedAt: "2026-04-03T08:10:00Z",
      readMinutes: 10,
      rating: 8.4,
      reactionsCount: 120,
    },
    articleBody: {
      blocks: [
        { kind: "heading", value: "META OVERVIEW" },
        {
          kind: "paragraph",
          value:
            "Medium tanks benefit the most from map timing changes, while heavies remain strong in close-control zones.",
        },
      ],
    },
    articleFooter: {},
    seo: {
      title: "World of Tanks 2026 Strategy Update",
      description: "Update review with practical meta implications.",
      canonical: "https://example.com/blog/world-of-tanks-2026-strategy-update-review",
    },
  },
  {
    slug: "enlisted-how-to-play-engineers-effectively",
    articleHeader: {
      relatedGames: [{ name: "Enlisted", slug: "enlisted" }],
      title: "ENLISTED: HOW TO PLAY ENGINEERS EFFECTIVELY",
      subtitle: "The fastest path to team impact in your first week.",
      headerImage:
        "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=1600&q=80",
      publishedAt: "2026-04-02T07:50:00Z",
      readMinutes: 9,
      rating: 8.1,
      reactionsCount: 112,
    },
    articleBody: {
      blocks: [
        { kind: "heading", value: "BUILD PRIORITIES" },
        {
          kind: "paragraph",
          value:
            "Engineers scale through smart rally placement and build timing. Avoid overexposure during construction.",
        },
      ],
    },
    articleFooter: {},
    seo: {
      title: "Enlisted Engineer Guide",
      description: "Practical engineer guide for Enlisted players.",
      canonical: "https://example.com/blog/enlisted-how-to-play-engineers-effectively",
    },
  },
  {
    slug: "raid-shadow-legends-2026-definitive-review",
    articleHeader: {
      relatedGames: [{ name: "Raid: Shadow Legends", slug: "raid-shadow-legends" }],
      title: "RAID: SHADOW LEGENDS - 2026 DEFINITIVE REVIEW",
      subtitle:
        "The visual gold standard of hero collectors still reigns with massive roster depth.",
      headerImage:
        "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=1600&q=80",
      publishedAt: "2026-04-01T09:01:00Z",
      readMinutes: 14,
      rating: 8.7,
      reactionsCount: 118,
    },
    articleBody: {
      blocks: [
        { kind: "heading", value: "A LEGION OF CHAMPIONS" },
        {
          kind: "paragraph",
          value:
            "Raid remains one of the strongest collector experiences thanks to steady content cadence and polished combat.",
        },
      ],
    },
    articleFooter: {
      FAQBlock: {
        title: "Raid FAQ",
        items: [
          {
            question: "Is Raid still worth playing in 2026?",
            answer: "Yes, especially if you enjoy long-term roster optimization.",
          },
        ],
      },
    },
    seo: {
      title: "Raid Shadow Legends Review 2026",
      description: "In-depth review and progression strategy for Raid.",
      canonical: "https://example.com/blog/raid-shadow-legends-2026-definitive-review",
    },
  },
];

export const BLOG_MOCK_ARTICLE_CHIP: Record<string, { slug: string; label: string }> = {
  "best-free-strategy-games-2026": { slug: "best-games", label: "Best games" },
  "dark-genesis-divine-awakening-review": { slug: "best-games", label: "Best games" },
  "genshin-impact-best-team-comps-spiral-abyss": { slug: "guides", label: "Guides" },
  "war-thunder-mastering-air-combat-sons-of-attila": { slug: "news", label: "News" },
  "arknights-endfield-everything-we-know": { slug: "news", label: "News" },
  "world-of-tanks-2026-strategy-update-review": { slug: "compare", label: "Compare" },
  "enlisted-how-to-play-engineers-effectively": { slug: "guides", label: "guides" },
  "raid-shadow-legends-2026-definitive-review": { slug: "best-games", label: "Best games" },
};

