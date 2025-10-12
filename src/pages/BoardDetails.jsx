import React, { useState, useEffect } from "react";

import { userService } from "../services/user";

import List from "../components/List";

export default function BoardDetails({ board }) {
  async function onRemoveList(listId) {}

  async function onAddList() {}

  async function onUpdateList(list) {}

  return (
    <section className="board-container">
      <header>
        <h2 className="pl-2">Board</h2>
        {userService.getLoggedinUser() && (
          <button onClick={onAddCar}>Add a List</button>
        )}
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
        </ul>
      </div>
    </section>
  );
}

function ListFilter() {
  return <section>ListFilter</section>;
}
