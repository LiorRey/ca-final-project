export const up = async ({ context }) => {
  const dateUpdates = [
    {
      titles: [
        "extend next-generation lifetime value",
        "deploy transparent architectures",
      ],
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      titles: [
        "syndicate intuitive architectures",
        "grow cross-media supply-chains",
      ],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      startDate: null,
    },
    {
      titles: ["embrace distributed paradigms"],
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
    {
      titles: [
        "monetize compelling smart contracts",
        "optimize holistic communities",
      ],
      startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // starts tomorrow
      dueDate: null,
    },
    {
      titles: ["incubate cross-platform platforms", "engage immersive ROI"],
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    },
  ];

  for (const update of dateUpdates) {
    await context.collection("cards").updateMany(
      { title: { $in: update.titles } },
      {
        $set: {
          startDate: update.startDate,
          dueDate: update.dueDate,
        },
      }
    );
  }
};

export const down = async ({ context }) => {
  await context.collection("cards").updateMany(
    {},
    {
      $unset: { startDate: 1, dueDate: 1 },
    }
  );
};
