import http from "./httpService";
const apiUrl = process.env.API_URL;

export function entrega_getAll() {
  return http.get(apiUrl + "/entregas");
}

export function entrega_getCurrent() {
  return http.get(apiUrl + "/entregas/get-current");
}

export function entrega_setStatus(idEntrega, status) {
  return http.put(apiUrl + "/entregas/" + idEntrega, status);
}
