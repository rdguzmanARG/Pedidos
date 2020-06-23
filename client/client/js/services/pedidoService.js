import http from "./httpService";
//import { apiUrl } from "../../../config.json";
const apiUrl = process.env.BACKEND_URL + "/api";

export function pedido_getAll() {
  return http.get(apiUrl + "/pedidos");
}

export function pedido_getPendingEmails() {
  return http.get(apiUrl + "/pedidos/pending-emails");
}

export function pedido_sendPendingEmails() {
  return http.post(apiUrl + "/pedidos/pending-emails");
}

export function pedido_notificado(idPedido) {
  return http.post(apiUrl + "/pedidos/notificado", { idPedido });
}

export function pedido_getLast(lastCheck) {
  return http.get(apiUrl + "/pedidos/last/" + lastCheck);
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
