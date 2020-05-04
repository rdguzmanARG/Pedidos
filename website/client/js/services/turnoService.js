import http from "./httpService";
const apiUrl = process.env.API_URL;

export function turno_disponibles() {
  return http.get(apiUrl + "/turnos");
}
export function turno_confirmar(idTurno, turno) {
  return http.put(apiUrl + "/turnos/" + idTurno, turno);
}

export function turno_anular(idTurno, turno) {
  return http.put(apiUrl + "/turnos/" + idTurno + "/anular", turno);
}
