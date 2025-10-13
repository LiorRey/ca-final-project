import { useState } from "react";
import { Inbox, Calendar1, Columns3, SquareKanban } from "lucide-react";

export function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <FooterButton>
          <Inbox />
          Inbox
        </FooterButton>
        <FooterButton>
          <Calendar1 />
          Planer
        </FooterButton>
        <FooterButton>
          <Columns3 />
          Board
        </FooterButton>
        <FooterButton>
          <SquareKanban />
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
