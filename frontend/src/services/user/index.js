const { DEV, VITE_LOCAL } = import.meta.env;

import { userService as local } from "./user-service-local";
import { userService as remote } from "./user-service-remote";
import userDataGenerator from "../user/user-data-generator.js";

function getEmptyUser() {
  return {
    username: "",
    password: "",
    fullname: "",
    isAdmin: false,
    score: 100,
  };
}

const service = VITE_LOCAL === "true" ? local : remote;
export const userService = { ...service, getEmptyUser };

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) {
  window.userService = userService;
  window.userDataGenerator = userDataGenerator;
}
