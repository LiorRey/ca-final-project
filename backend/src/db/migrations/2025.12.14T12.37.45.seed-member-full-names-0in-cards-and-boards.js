export const up = async ({ context }) => {
  console.log("Starting migration: Adding fullname to boards and cards...");

  const users = await context.collection("users").find({}).toArray();
  const userMap = new Map();
  users.forEach(user => {
    userMap.set(user._id.toString(), {
      username: user.username,
      fullname: user.fullname,
    });
  });

  const boards = await context.collection("boards").find({}).toArray();
  let boardsUpdated = 0;

  for (const board of boards) {
    const updates = {};

    if (board.owner && !board.owner.fullname) {
      const ownerData = userMap.get(board.owner.userId.toString());
      if (ownerData) {
        updates["owner.fullname"] = ownerData.fullname;
      }
    }

    if (board.members && board.members.length > 0) {
      const updatedMembers = board.members.map(member => {
        if (!member.fullname) {
          const memberData = userMap.get(member.userId.toString());
          if (memberData) {
            return {
              ...member,
              fullname: memberData.fullname,
            };
          }
        }
        return member;
      });

      const hasUpdates = updatedMembers.some(
        (member, idx) => member.fullname !== board.members[idx].fullname
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

  console.log(`✓ Updated ${boardsUpdated} boards with fullname`);

  const cards = await context.collection("cards").find({}).toArray();
  let cardsUpdated = 0;

  for (const card of cards) {
    const updates = {};

    if (card.assignees && card.assignees.length > 0) {
      const updatedAssignees = card.assignees.map(assignee => {
        if (!assignee.fullname) {
          const assigneeData = userMap.get(assignee.userId.toString());
          if (assigneeData) {
            return {
              ...assignee,
              fullname: assigneeData.fullname,
            };
          }
        }
        return assignee;
      });

      const hasUpdates = updatedAssignees.some(
        (assignee, idx) => assignee.fullname !== card.assignees[idx]?.fullname
      );

      if (hasUpdates) {
        updates.assignees = updatedAssignees;
      }
    }

    if (card.comments && card.comments.length > 0) {
      const updatedComments = card.comments.map(comment => {
        if (comment.author && !comment.author.fullname) {
          const authorData = userMap.get(comment.author.userId.toString());
          if (authorData) {
            return {
              ...comment,
              author: {
                ...comment.author,
                fullname: authorData.fullname,
              },
            };
          }
        }
        return comment;
      });

      const hasUpdates = updatedComments.some(
        (comment, idx) =>
          comment.author?.fullname !== card.comments[idx]?.author?.fullname
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

  console.log(`✓ Updated ${cardsUpdated} cards with fullname`);
  console.log("✓ Migration completed successfully");
};

export const down = async ({ context }) => {
  console.log("Starting rollback: Removing fullname from boards and cards...");

  const boardResult = await context.collection("boards").updateMany(
    {},
    {
      $unset: {
        "owner.fullname": "",
        "members.$[].fullname": "",
      },
    }
  );

  console.log(`✓ Removed fullname from ${boardResult.modifiedCount} boards`);

  const cardResult = await context.collection("cards").updateMany(
    {},
    {
      $unset: {
        "assignees.$[].fullname": "",
        "comments.$[].author.fullname": "",
      },
    }
  );

  console.log(`✓ Removed fullname from ${cardResult.modifiedCount} cards`);
  console.log("✓ Rollback completed successfully");
};
