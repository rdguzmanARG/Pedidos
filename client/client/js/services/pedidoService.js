import http from "./httpService";
import { apiUrl } from "../../../config.json";

export function pedido_getAll() {
  return http.get(apiUrl + "/pedidos");
}

export function pedido_get(idPedido) {
  return http.get(apiUrl + "/pedidos/" + idPedido);
}

export function pedido_update(idPedido, pedido) {
  return http.put(apiUrl + "/pedidos/" + idPedido, pedido);
}
