import http from "./httpService";
//import { apiUrl } from "../../../config.json";
const apiUrl = process.env.BACKEND_URL + "/api";

export function turno_disponibles() {
  return http.get(apiUrl + "/turnos");
}
export function turno_confirmar(idTurno, turno) {
  return http.put(apiUrl + "/turnos/" + idTurno, turno);
}
export function turno_procesar(config) {
  return http.post(apiUrl + "/turnos/procesar", config);
}
