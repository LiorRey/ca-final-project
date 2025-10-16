import { Footer } from "../components/Footer";
import { List } from "../components/List";
import { AddRounded } from "@mui/icons-material";

import {
  MoreHoriz,
  Sort,
  StarBorderRounded,
  LockOutlineRounded,
} from "@mui/icons-material";

export function BoardDetails({ board }) {
  async function onRemoveList(listId) {}

  async function onAddList() {}

  async function onUpdateList(list) {}

  return (
    <section className="board-container">
      <header className="board-header">
        <h2 className="board-title">{board.name}</h2>
        <div className="board-header-right">
          <button className="icon-button">
            <Sort />
          </button>
          <button className="icon-button">
            <StarBorderRounded />
          </button>
          <button className="icon-button">
            <LockOutlineRounded />
          </button>
          <button className="icon-button">
            <MoreHoriz />
          </button>
        </div>
      </header>
      <div className="board-canvas">
        <ul className="lists-list">
          {board.lists.map(list => (
            <li key={list.id}>
              <List
                key={list.id}
                list={list}
                onRemoveList={onRemoveList}
                onUpdateList={onUpdateList}
              />
            </li>
          ))}
          <li>
            <AddListButton />
          </li>
        </ul>
        <nav className="board-footer">
          <Footer />
        </nav>
      </div>
    </section>
  );
}

function AddListButton() {
  return (
    <button className="add-list-button">
      <AddRounded /> Add a List
    </button>
  );
}
