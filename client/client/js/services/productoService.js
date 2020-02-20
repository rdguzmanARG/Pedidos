import http from "./httpService";
import { apiUrl } from "../../../config.json";

export function producto_getAll() {
  return http.get(apiUrl + "/productos");
}

export function producto_get(idProducto) {
  return http.get(apiUrl + "/productos/" + idProducto);
}

export function producto_update(idProducto, producto) {
  return http.put(apiUrl + "/productos/" + idProducto, producto);
}
