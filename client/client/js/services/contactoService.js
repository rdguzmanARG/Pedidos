import http from "./httpService";
//import { apiUrl } from "../../../config.json";
const apiUrl = process.env.API_URL;

export function contacto_getAll() {
  return http.get(apiUrl + "/contactos");
}
