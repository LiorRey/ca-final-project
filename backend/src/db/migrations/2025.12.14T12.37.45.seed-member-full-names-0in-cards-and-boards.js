export const up = async ({ context }) => {
  console.log("Starting migration: Adding fullName to boards and cards...");

  const users = await context.collection("users").find({}).toArray();
  const userMap = new Map();
  users.forEach(user => {
    userMap.set(user._id.toString(), {
      username: user.username,
      fullName: user.fullName,
    });
  });

  const boards = await context.collection("boards").find({}).toArray();
  let boardsUpdated = 0;

  for (const board of boards) {
    const updates = {};

    if (board.owner && !board.owner.fullName) {
      const ownerData = userMap.get(board.owner.userId.toString());
      if (ownerData) {
        updates["owner.fullName"] = ownerData.fullName;
      }
    }

    if (board.members && board.members.length > 0) {
      const updatedMembers = board.members.map(member => {
        if (!member.fullName) {
          const memberData = userMap.get(member.userId.toString());
          if (memberData) {
            return {
              ...member,
              fullName: memberData.fullName,
            };
          }
        }
        return member;
      });

      const hasUpdates = updatedMembers.some(
        (member, idx) => member.fullName !== board.members[idx].fullName
      );

      if (hasUpdates) {
        updates.members = updatedMembers;
      }
    }

    if (Object.keys(updates).length > 0) {
      await context
        .collection("boards")
        .updateOne({ _id: board._id }, { $set: updates });
      boardsUpdated++;
    }
  }

  console.log(`✓ Updated ${boardsUpdated} boards with fullName`);

  const cards = await context.collection("cards").find({}).toArray();
  let cardsUpdated = 0;

  for (const card of cards) {
    const updates = {};

    if (card.assignees && card.assignees.length > 0) {
      const updatedAssignees = card.assignees.map(assignee => {
        if (!assignee.fullName) {
          const assigneeData = userMap.get(assignee.userId.toString());
          if (assigneeData) {
            return {
              ...assignee,
              fullName: assigneeData.fullName,
            };
          }
        }
        return assignee;
      });

      const hasUpdates = updatedAssignees.some(
        (assignee, idx) => assignee.fullName !== card.assignees[idx]?.fullName
      );

      if (hasUpdates) {
        updates.assignees = updatedAssignees;
      }
    }

    if (card.comments && card.comments.length > 0) {
      const updatedComments = card.comments.map(comment => {
        if (comment.author && !comment.author.fullName) {
          const authorData = userMap.get(comment.author.userId.toString());
          if (authorData) {
            return {
              ...comment,
              author: {
                ...comment.author,
                fullName: authorData.fullName,
              },
            };
          }
        }
        return comment;
      });

      const hasUpdates = updatedComments.some(
        (comment, idx) =>
          comment.author?.fullName !== card.comments[idx]?.author?.fullName
      );

      if (hasUpdates) {
        updates.comments = updatedComments;
      }
    }

    if (Object.keys(updates).length > 0) {
      await context
        .collection("cards")
        .updateOne({ _id: card._id }, { $set: updates });
      cardsUpdated++;
    }
  }

  console.log(`✓ Updated ${cardsUpdated} cards with fullName`);
  console.log("✓ Migration completed successfully");
};

export const down = async ({ context }) => {
  console.log("Starting rollback: Removing fullName from boards and cards...");

  const boardResult = await context.collection("boards").updateMany(
    {},
    {
      $unset: {
        "owner.fullName": "",
        "members.$[].fullName": "",
      },
    }
  );

  console.log(`✓ Removed fullName from ${boardResult.modifiedCount} boards`);

  const cardResult = await context.collection("cards").updateMany(
    {},
    {
      $unset: {
        "assignees.$[].fullName": "",
        "comments.$[].author.fullName": "",
      },
    }
  );

  console.log(`✓ Removed fullName from ${cardResult.modifiedCount} cards`);
  console.log("✓ Rollback completed successfully");
};
