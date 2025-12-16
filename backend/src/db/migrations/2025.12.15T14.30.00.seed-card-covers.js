import fs from "fs";
import path from "path";

/**
 * Migration: Seed card covers
 *
 * Purpose: Add cover colors and textOverlay settings to selected cards for demonstration
 *
 * Changes:
 * - Adds cover.color and cover.textOverlay to specific cards
 * - Uses various colors from the COVER_COLORS palette
 * - Mixes cards with and without textOverlay
 */

export const up = async ({ context }) => {
  // Cover configurations: card titles with their cover settings
  const coverConfigs = [
    {
      titles: [
        "extend next-generation lifetime value",
        "deploy transparent architectures",
      ],
      cover: {
        color: "#0a4d1f", // dark-green
        textOverlay: false,
      },
    },
    {
      titles: [
        "syndicate intuitive architectures",
        "grow cross-media supply-chains",
      ],
      cover: {
        color: "#cc5529", // orange
        textOverlay: true,
      },
    },
    {
      titles: ["embrace distributed paradigms"],
      cover: {
        color: "#0f4d8f", // blue
        textOverlay: false,
      },
    },
    {
      titles: [
        "monetize compelling smart contracts",
        "optimize holistic communities",
      ],
      cover: {
        color: "#6a1a8a", // purple
        textOverlay: true,
      },
    },
    {
      titles: ["incubate cross-platform platforms", "engage immersive ROI"],
      cover: {
        color: "#9e1f1f", // red
        textOverlay: false,
      },
    },
    {
      titles: ["revolutionize seamless e-commerce"],
      cover: {
        color: "#006b5f", // teal
        textOverlay: true,
      },
    },
  ];

  // Update cards with covers
  for (const config of coverConfigs) {
    const result = await context.collection("cards").updateMany(
      { title: { $in: config.titles } },
      {
        $set: {
          cover: config.cover,
          updatedAt: new Date(),
        },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(
        `✓ Added cover to ${result.modifiedCount} card(s): ${config.titles.join(", ")}`
      );
    }
  }

  console.log("✓ Card covers seeding completed successfully");
};

export const down = async ({ context }) => {
  const seedPath = path.resolve(process.cwd(), "src/db/seed.json");
  const raw = fs.readFileSync(seedPath, "utf8");
  const seed = JSON.parse(raw);
  const cardsSeed = seed.cards || [];

  // Get all card titles that might have covers
  const allTitles = cardsSeed.flatMap(boardCards =>
    boardCards.lists.flatMap(listCards => listCards.cards.map(c => c.title))
  );

  // Remove covers from all seeded cards
  const result = await context.collection("cards").updateMany(
    { title: { $in: allTitles } },
    {
      $unset: { cover: 1 },
      $set: { updatedAt: new Date() },
    }
  );

  console.log(`✓ Removed covers from ${result.modifiedCount} cards`);
};
