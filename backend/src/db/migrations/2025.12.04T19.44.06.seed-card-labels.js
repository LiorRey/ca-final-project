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

    const labelMap = {};
    for (const label of board.labels) {
      labelMap[label.title] = label._id;
    }

    for (const listCards of boardCards.lists) {
      const list = await context
        .collection("lists")
        .findOne({ title: listCards.listTitle, boardId: board._id });
      if (!list) continue;

      for (const cardData of listCards.cards) {
        const card = await context.collection("cards").findOne({
          title: cardData.title,
          listId: list._id,
          boardId: board._id,
        });
        if (!card) continue;

        const labelIds = [];
        if (cardData.labels && Array.isArray(cardData.labels)) {
          for (const labelTitle of cardData.labels) {
            const labelId = labelMap[labelTitle];
            if (labelId) {
              labelIds.push(labelId);
            }
          }
        }

        await context
          .collection("cards")
          .updateOne({ _id: card._id }, { $set: { labelIds } });
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

  await context
    .collection("cards")
    .updateMany({ title: { $in: allTitles } }, { $set: { labelIds: [] } });
};
