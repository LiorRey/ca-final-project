import fs from "fs";
import path from "path";

export const up = async ({ context }) => {
  const seedPath = path.resolve(process.cwd(), "src/db/seed.json");
  const raw = fs.readFileSync(seedPath, "utf8");
  const seed = JSON.parse(raw);
  const cardsSeed = seed.cards || [];

  for (const boardCards of cardsSeed) {
    const board = await context
      .collection("boards")
      .findOne({ title: boardCards.boardTitle });
    if (!board) continue;

    for (const listCards of boardCards.lists) {
      const list = await context
        .collection("lists")
        .findOne({ title: listCards.listTitle, boardId: board._id });
      if (!list) continue;

      for (const card of listCards.cards) {
        await context.collection("cards").insertOne({
          boardId: board._id,
          listId: list._id,
          title: card.title,
          description: card.description,
          position: card.position,
          archivedAt: card.archivedAt ?? null,
          comments: [],
          createdAt: card.createdAt ?? new Date(),
          updatedAt: card.updatedAt ?? new Date(),
        });
      }
    }
  }
};

export const down = async ({ context }) => {
  const seedPath = path.resolve(process.cwd(), "src/db/seed.json");
  const raw = fs.readFileSync(seedPath, "utf8");
  const seed = JSON.parse(raw);
  const cardsSeed = seed.cards || [];
  const allTitles = cardsSeed.flatMap(boardCards =>
    boardCards.lists.flatMap(listCards => listCards.cards.map(c => c.title))
  );
  await context.collection("cards").deleteMany({ title: { $in: allTitles } });
};
