import { USERNAME } from "../constants/localStorage";

export const getUser = () => {
  const lsUser = window.localStorage.getItem(USERNAME);
  if (lsUser) {
    return lsUser;
  }
  const randomUser = `r${(Math.random() + 1).toString(36).substring(7)}`;
  window.localStorage.setItem(USERNAME, randomUser);
  return randomUser;
};
