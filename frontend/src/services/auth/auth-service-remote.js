import { httpService } from "../http-service";

const CURRENT_USER_SESSION_KEY = "currentUser";

export const authService = {
  signup,
  login,
  logout,
  getSession,
};

async function signup(userData) {
  const data = await httpService.post("auth/signup", userData);
  const user = data.user;
  return user;
}

async function login(credentials) {
  const data = await httpService.post("auth/login", credentials);
  const user = data.user;
  return user;
}

async function logout() {
  await httpService.post("auth/logout");
}

async function getSession() {
  const data = await httpService.get("auth/session");
  return data.user;
}
