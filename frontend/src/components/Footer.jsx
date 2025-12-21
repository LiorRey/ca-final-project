import {
  InboxRounded,
  CalendarMonthRounded,
  ViewWeekOutlined,
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
          Planner
        </FooterButton>
        <FooterButton active={true}>
          <ViewWeekOutlined />
          Board
        </FooterButton>
        <span className="footer-separator" />
        <FooterButton>
          <LibraryBooksOutlined />
          Switch Board
        </FooterButton>
      </div>
    </footer>
  );
}

function FooterButton({ active = false, onClick, children }) {
  return (
    <button
      className={`footer-button ${active ? "active" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
