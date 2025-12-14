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

    // Create a map of username to user object
    const userMap = {};
    for (const member of board.members) {
      const user = await context
        .collection("users")
        .findOne({ username: member.username });
      if (user) {
        userMap[member.username] = {
          userId: user._id,
          username: user.username,
          fullName: user.fullName,
        };
      }
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

        const assignees = [];
        if (cardData.assignees && Array.isArray(cardData.assignees)) {
          for (const assignee of cardData.assignees) {
            const userInfo = userMap[assignee.username];
            if (userInfo) {
              assignees.push(userInfo);
            }
          }
        }

        await context
          .collection("cards")
          .updateOne({ _id: card._id }, { $set: { assignees } });
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
    .updateMany({ title: { $in: allTitles } }, { $set: { assignees: [] } });
};
