import React from "react";
import { Ellipsis, ListFilter, Star, LockKeyhole } from "lucide-react";
import { Footer } from "../components/Footer";

import { userService } from "../services/user";

import List from "../components/List";

export default function BoardDetails({ board }) {
  async function onRemoveList(listId) {}

  async function onAddList() {}

  async function onUpdateList(list) {}

  return (
    <section className="board-container">
      <header className="board-header">
        <h2 className="board-title">{board.name}</h2>
        <div className="board-header-right">
          <button className="icon-button">
            <ListFilter />
          </button>
          <button className="icon-button">
            <Star />
          </button>
          <button className="icon-button">
            <LockKeyhole />
          </button>
          <button className="icon-button">
            <Ellipsis />
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
  return <button className="add-list-button">+ Add a List</button>;
}
