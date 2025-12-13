import { useLocation, useNavigate, useSearchParams } from "react-router";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout } from "../store/actions/user-actions";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useSelector(storeState => storeState.users.currentUser);

  const isBoardIndex = location.pathname === "/board";

  const search = isBoardIndex ? searchParams.get("search") || "" : "";

  function onSearchChange(e) {
    if (!isBoardIndex) return;

    const value = e.target.value;

    if (isBoardIndex) {
      navigate(value ? `/board?search=${encodeURIComponent(value)}` : "/board");
    }
  }

  async function onLogout() {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Cannot logout: " + err.message);
    }
  }

  return (
    <header className="app-header">
      <nav>
        <NavLink to="/board" className="logo">
          Trello
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
            <Link to={`user/${user._id}`}>
              {user.imgUrl && <img src={user.imgUrl} />}
              {user.fullname}
            </Link>
            <span className="score">{user.score?.toLocaleString()}</span>
            <button onClick={onLogout}>logout</button>
          </div>
        )}
      </nav>
    </header>
  );
}
