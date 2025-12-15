import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Avatar } from "./ui/Avatar";
import { UserMenu } from "./UserMenu";
import "../assets/styles/components/Header.css";

export function Header() {
  const user = useSelector(storeState => storeState.auth.currentUser);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const isUserMenuOpen = Boolean(userMenuAnchorEl);

  function handleOpenUserMenu(event) {
    setUserMenuAnchorEl(event.currentTarget);
  }

  function handleCloseUserMenu() {
    setUserMenuAnchorEl(null);
  }

  console.log("user", user);

  return (
    <header className="app-header">
      <nav>
        <NavLink to="/" className="logo">
          Trello
        </NavLink>

        <input className="search-input" type="text" placeholder="Search" />

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
