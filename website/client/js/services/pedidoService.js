import http from "./httpService";
const apiUrl = process.env.API_URL;

export function pedido_get(email, code) {
  return http.post(apiUrl + "/pedidos/", { email, code });
}
