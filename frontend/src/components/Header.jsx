import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { logout } from "../store/actions/user-actions";

export function Header() {
  const user = useSelector(storeState => storeState.users.currentUser);
  const navigate = useNavigate();

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

        <input className="search-input" type="text" placeholder="Search" />

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
