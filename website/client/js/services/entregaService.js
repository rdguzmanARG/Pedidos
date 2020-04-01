import http from "./httpService";
const apiUrl = process.env.API_URL;

export function entrega_getCurrent() {
  return http.get(apiUrl + "/entregas/get-current");
}
