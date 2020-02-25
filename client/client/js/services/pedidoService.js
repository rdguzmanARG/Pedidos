import http from "./httpService";
//import { apiUrl } from "../../../config.json";
const apiUrl = process.env.API_URL;

export function pedido_getAll() {
  return http.get(apiUrl + "/pedidos");
}

export function pedido_get(idPedido) {
  return http.get(apiUrl + "/pedidos/" + idPedido);
}

export function pedido_update(idPedido, pedido) {
  return http.put(apiUrl + "/pedidos/" + idPedido, pedido);
}

export function pedido_import() {
  return http.get(apiUrl + "/pedidos/import");
}
