import { User } from "../../models/User.js";
import { Board } from "../../models/Board.js";
import fs from "fs";
import path from "path";

export const up = async ({ _context }) => {
  const seedPath = path.resolve(process.cwd(), "src/db/seed.json");
  const rawData = fs.readFileSync(seedPath, "utf-8");
  const { users, boards } = JSON.parse(rawData);

  // Seed Users
  for (const user of users) {
    const exists = await User.findOne({ email: user.email });
    if (!exists) {
      await User.create(user);
    }
  }

  const userDocs = await User.find({});
  const userMap = {};
  for (const user of userDocs) {
    userMap[user.username] = user;
  }

  // Seed Boards
  for (const board of boards) {
    // Resolve owner
    const ownerUser = userMap[board.owner.username];
    const owner = {
      userId: ownerUser._id,
      username: ownerUser.username,
      fullName: ownerUser.fullName,
    };

    // Resolve members
    const members = [];
    for (const m of board.members) {
      const memberUser = userMap[m.username];
      if (memberUser) {
        members.push({
          userId: memberUser._id,
          username: memberUser.username,
          fullName: memberUser.fullName,
        });
      }
    }

    // Board doc
    const boardDoc = {
      title: board.title,
      description: board.description,
      labels: board.labels.map(label => ({
        title: label.title,
        color: label.color,
      })),
      owner,
      members,
    };

    const exists = await Board.findOne({
      title: boardDoc.title,
      owner: boardDoc.owner,
    });
    if (!exists) {
      await Board.create(boardDoc);
    }
  }
};

export const down = async ({ _context }) => {
  const seedPath = path.resolve(process.cwd(), "src/db/seed.json");
  const rawData = fs.readFileSync(seedPath, "utf-8");
  const { users, boards } = JSON.parse(rawData);

  for (const user of users) {
    await User.deleteOne({ email: user.email });
  }

  for (const board of boards) {
    await Board.deleteOne({ title: board.title });
  }
};
