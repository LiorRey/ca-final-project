import { useState } from "react";
import {
  InboxRounded,
  CalendarMonthRounded,
  ViewWeekOutlined,
  ViewKanbanOutlined,
  LibraryBooksOutlined,
} from "@mui/icons-material";
export function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <FooterButton>
          <InboxRounded />
          Inbox
        </FooterButton>
        <FooterButton>
          <CalendarMonthRounded />
          Planer
        </FooterButton>
        <FooterButton>
          <ViewWeekOutlined />
          Board
        </FooterButton>
        <span className="footer-separator" />
        <FooterButton>
          {/* <ViewKanbanOutlined /> */}
          <LibraryBooksOutlined />
          Switch Board
        </FooterButton>
      </div>
    </footer>
  );
}

function FooterButton(props) {
  const [isActive, setIsActive] = useState(false);

  function onToggle() {
    setIsActive(!isActive);
  }

  return (
    <button
      className={`footer-button ${isActive ? "active" : ""}`}
      onClick={onToggle}
    >
      {props.children}
    </button>
  );
}
