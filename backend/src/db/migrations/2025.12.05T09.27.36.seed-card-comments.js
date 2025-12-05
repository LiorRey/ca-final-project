import fs from "fs";
import path from "path";

export const up = async ({ context }) => {
  const seedPath = path.resolve(process.cwd(), "src/db/seed.json");
  const raw = fs.readFileSync(seedPath, "utf8");
  const seed = JSON.parse(raw);

  const users = await context.collection("users").find({}).toArray();
  const userMap = {};
  users.forEach(user => {
    userMap[user.username] = user._id;
  });

  const cards = await context.collection("cards").find({}).toArray();

  for (const boardCards of seed.cards) {
    for (const listCards of boardCards.lists) {
      for (const card of listCards.cards) {
        if (card.comments && card.comments.length > 0) {
          const existingCard = cards.find(
            c =>
              c.title === card.title &&
              c.description === (card.description || "Dummy card description")
          );

          if (existingCard) {
            const processedComments = card.comments.map(comment => {
              const userId = userMap[comment.author.userId];
              const user = users.find(
                u => u._id.toString() === userId.toString()
              );

              return {
                ...comment,
                author: {
                  userId: userId,
                  username: user.username,
                },
              };
            });

            await context.collection("cards").updateOne(
              { _id: existingCard._id },
              {
                $push: { comments: { $each: processedComments } },
                $set: { updatedAt: new Date() },
              }
            );

            console.log(
              `✓ Added ${processedComments.length} comments to card: ${card.title}`
            );
          } else {
            console.warn(
              `⚠ Card not found for comment seeding: ${card.title}`
            );
          }
        }
      }
    }
  }

  console.log("✓ Comments seeding completed successfully");
};

export const down = async ({ context }) => {
  const result = await context
    .collection("cards")
    .updateMany({}, { $unset: { comments: 1 } });

  console.log(`✓ Removed comments from ${result.modifiedCount} cards`);
};
