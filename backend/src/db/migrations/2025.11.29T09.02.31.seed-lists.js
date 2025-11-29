import fs from "fs";
import path from "path";

export const up = async ({ context }) => {
  const seedPath = path.resolve(process.cwd(), "src/db/seed.json");
  const raw = fs.readFileSync(seedPath, "utf8");
  const seed = JSON.parse(raw);
  const listsSeed = seed.lists || [];

  for (const boardLists of listsSeed) {
    const board = await context
      .collection("boards")
      .findOne({ title: boardLists.boardTitle });
    if (!board) continue;

    for (const list of boardLists.lists) {
      await context.collection("lists").insertOne({
        boardId: board._id,
        title: list.title,
        description: list.description,
        position: list.position,
      });
    }
  }
};

export const down = async ({ context }) => {
  const seedPath = path.resolve(process.cwd(), "src/db/seed.json");
  const raw = fs.readFileSync(seedPath, "utf8");
  const seed = JSON.parse(raw);
  const listsSeed = seed.lists || [];
  const allTitles = listsSeed.flatMap(boardLists =>
    boardLists.lists.map(l => l.title)
  );
  await context.collection("lists").deleteMany({ title: { $in: allTitles } });
};
