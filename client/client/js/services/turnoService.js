import http from "./httpService";
//import { apiUrl } from "../../../config.json";
const apiUrl = process.env.API_URL;

export function turno_disponibles() {
  return http.get(apiUrl + "/turnos");
}
export function turno_confirmar(idTurno, turno) {
  return http.put(apiUrl + "/turnos/" + idTurno, turno);
}
export function turno_procesar(config) {
  console.log(config);
  return http.post(apiUrl + "/turnos/procesar", config);
}
