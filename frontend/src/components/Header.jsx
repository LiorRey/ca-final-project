import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus-service";
import { logout } from "../store/actions/user-actions";

export function Header() {
  const user = useSelector(storeState => storeState.users.currentUser);
  const navigate = useNavigate();

  async function onLogout() {
    try {
      await logout();
      navigate("/");
      showSuccessMsg(`Bye now`);
    } catch (err) {
      showErrorMsg("Cannot logout");
    }
  }

  return (
    <header className="app-header">
      <nav>
        <NavLink to="/" className="logo">
          Trello
        </NavLink>
        <div>
          <NavLink to="about">About</NavLink>
          <NavLink to="board">Boards</NavLink>
          <NavLink to="chat">Chat</NavLink>
          <NavLink to="review">Review</NavLink>
        </div>
        <input className="search-input" type="text" placeholder="Search" />

        {user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}

        {!user && (
          <NavLink to="auth/login" className="login-link">
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
