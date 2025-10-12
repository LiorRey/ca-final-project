import BoardDetails from "./BoardDetails";

const boardObject = {
  id: "board1",
  title: "Template Board",
  lists: [
    {
      id: "list1",
      title: "Template List 1",
      cards: [
        {
          id: "card1",
          title: "Card 1",
          description: "Template Card Description",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "card2",
          title: "Card 2",
          description: "Template Card Description",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: "list2",
      title: "Template List 2",
      cards: [
        {
          id: "card3",
          title: "Card 3",
          description: "Template Card Description",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: "list3",
      title: "Template List 3",
      cards: [
        {
          id: "card4",
          title: "Card 4",
          description: "Template Card Description",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "card5",
          title: "Card 5",
          description: "Template Card Description",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    },

    {
      id: "list3",
      title: "Template List 3",
      cards: [
        {
          id: "card4",
          title: "Card 4",
          description: "Template Card Description",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "card5",
          title: "Card 5",
          description: "Template Card Description",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "card6",
          title: "Card 5",
          description: "Template Card Description",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    },
  ],
};

export function BoardIndex() {
  return (
    <section className="board-index">
      <BoardDetails board={boardObject} />
    </section>
  );
}
