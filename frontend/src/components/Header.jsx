import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import { Avatar } from "./ui/Avatar";
import { UserMenu } from "./UserMenu";
import "../assets/styles/components/Header.css";

export function Header() {
  const user = useSelector(storeState => storeState.auth.currentUser);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const isUserMenuOpen = Boolean(userMenuAnchorEl);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isBoardIndex = location.pathname === "/board";

  const search = isBoardIndex ? searchParams.get("search") || "" : "";

  function onSearchChange(e) {
    if (!isBoardIndex) return;

    const value = e.target.value;

    if (isBoardIndex) {
      navigate(value ? `/board?search=${encodeURIComponent(value)}` : "/board");
    }
  }

  function handleOpenUserMenu(event) {
    setUserMenuAnchorEl(event.currentTarget);
  }

  function handleCloseUserMenu() {
    setUserMenuAnchorEl(null);
  }

  return (
    <header className="app-header">
      <nav>
        <NavLink to="/board" className="logo">
          <img className="logo-icon" src="/icon.svg" alt="Kanbox logo" />
          <span className="logo-text">Kanbox</span>
        </NavLink>

        <input
          className="search-input"
          type="text"
          placeholder={isBoardIndex ? "Search boards..." : "Search..."}
          value={search}
          onChange={onSearchChange}
        />

        {user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}

        {!user && (
          <NavLink to="/login" className="login-link">
            Login
          </NavLink>
        )}

        {user && (
          <div className="user-info">
            <button
              onClick={handleOpenUserMenu}
              className="user-menu-button"
              aria-label="User menu"
            >
              <Avatar user={user} size={32} />
            </button>
          </div>
        )}
      </nav>
      <UserMenu
        user={user}
        anchorEl={userMenuAnchorEl}
        isOpen={isUserMenuOpen}
        onClose={handleCloseUserMenu}
      />
    </header>
  );
}
