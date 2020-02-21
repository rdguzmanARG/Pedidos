import http from "./httpService";
import jwdtDecode from "jwt-decode";
//import { apiUrl } from "../../../config.json";
const apiUrl = process.env.API_URL;
const apiEndpoint = apiUrl + "/users/login";
const tokenKey = "token";

http.setJwt(getJwt());

function login(username, password) {
  return new Promise((resolve, reject) => {
    http
      .post(apiEndpoint, { username, password })
      .then(res => {
        localStorage.setItem(tokenKey, res.headers["x-auth-token"]);
        resolve();
      })
      .catch(ex => {
        reject(ex);
      });
  });
}

function logout() {
  localStorage.removeItem(tokenKey);
}

function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwdtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

function getJwt() {
  return localStorage.getItem(tokenKey);
}

export default {
  login,
  logout,
  getJwt,
  getCurrentUser
};
