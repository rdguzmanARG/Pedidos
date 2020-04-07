import http from "./httpService";
//import { apiUrl } from "../../../config.json";
const apiUrl = process.env.API_URL;
console.log(apiUrl);
export function contacto_getAll() {
  return http.get(apiUrl + "/contactos");
}
