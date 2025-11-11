import { storageService } from "../async-storage-service";

export const authService = {
  signup,
  login,
  setCurrentUserInSession,
  getCurrentUserFromSession,
};

const USERS_STORAGE_KEY = "userDB";
const CURRENT_USER_SESSION_KEY = "currentUser";

export async function signup(userData) {
  try {
    const { password: _, ...userWithoutPassword } = await storageService.post(
      USERS_STORAGE_KEY,
      userData
    );
    setCurrentUserInSession(userWithoutPassword);
    return userWithoutPassword;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
}

export async function login(credentials) {
  const { email, password } = credentials;
  try {
    const users = await storageService.query(USERS_STORAGE_KEY);
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error("Invalid email or password");

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

export function setCurrentUserInSession(user) {
  sessionStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(user));
}
export function getCurrentUserFromSession() {
  const user = sessionStorage.getItem(CURRENT_USER_SESSION_KEY);
  return user ? JSON.parse(user) : null;
}
