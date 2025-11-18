const { DEV, VITE_LOCAL } = import.meta.env;

import { authService as local } from "./auth-service-local";
import { authService as remote } from "./auth-service-remote";

const service = VITE_LOCAL === "true" ? local : remote;
export const authService = {
  ...service,
};

if (DEV) {
  window.authService = authService;
}
