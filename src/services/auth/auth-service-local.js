import { storageService } from "../async-storage-service";

export const authService = {
  signup,
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

export function setCurrentUserInSession(user) {
  sessionStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(user));
}
export function getCurrentUserFromSession() {
  const user = sessionStorage.getItem(CURRENT_USER_SESSION_KEY);
  return user ? JSON.parse(user) : null;
}
