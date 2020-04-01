import http from "./httpService";
const apiUrl = process.env.API_URL;

export function contacto_send(contacto) {
  return http.post(apiUrl + "/contactos/", contacto);
}
