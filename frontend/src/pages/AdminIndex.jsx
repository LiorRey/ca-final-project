import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { loadUsers, deleteUser } from "../store/actions/user-actions";

export function AdminIndex() {
  const navigate = useNavigate();

  const user = useSelector(storeState => storeState.users.currentUser);
  const users = useSelector(storeState => storeState.users.currentUsers);
  const isLoading = useSelector(storeState => storeState.userModule.isLoading);

  useEffect(() => {
    if (!user.isAdmin) navigate("/");
    loadUsers();
  }, []);

  return (
    <section className="admin">
      {isLoading && "Loading..."}
      {users && (
        <ul>
          {users.map(user => (
            <li key={user._id}>
              <pre>{JSON.stringify(user, null, 2)}</pre>
              <button onClick={() => deleteUser(user._id)}>
                Remove {user.username}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
