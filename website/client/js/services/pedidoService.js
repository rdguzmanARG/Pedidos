import http from "./httpService";
const apiUrl = process.env.API_URL;

export function pedido_getByCode(email, code) {
  return http.get(apiUrl + "/pedidos/" + email + "/" + code);
}

export function pedido_get(id) {
  return http.get(apiUrl + "/pedidos/" + id);
}
