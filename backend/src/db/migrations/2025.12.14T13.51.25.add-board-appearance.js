export const up = async ({ context }) => {
  await context.collection("boards").updateMany(
    { appearance: { $exists: false } },
    {
      $set: {
        appearance: {
          background: null,
        },
      },
    }
  );
};

export const down = async ({ context }) => {
  await context
    .collection("boards")
    .updateMany({}, { $unset: { appearance: 1 } });
};
