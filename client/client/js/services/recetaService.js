import http from "./httpService";
//import { apiUrl } from "../../../config.json";
const apiUrl = process.env.BACKEND_URL + "/api";

export function recetas_getAll() {
  return http.get(apiUrl + "/recetas");
}

export function receta_get(idReceta) {
  return http.get(apiUrl + "/recetas/" + idReceta);
}

export function receta_update(idReceta, receta) {
  return http.put(apiUrl + "/recetas/" + idReceta, receta);
}

export function receta_create(receta) {
  return http.post(apiUrl + "/recetas/", receta);
}

export function receta_delete(idReceta) {
  return http.delete(apiUrl + "/recetas/" + idReceta);
}
