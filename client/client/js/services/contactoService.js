import http from "./httpService";
//import { apiUrl } from "../../../config.json";
const apiUrl = process.env.BACKEND_URL + "/api";

export function contacto_getAll() {
  return http.get(apiUrl + "/contactos");
}
