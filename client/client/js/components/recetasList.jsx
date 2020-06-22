import React, { Component } from "react";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";
import { recetas_getAll } from "../services/recetaService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import removeAccents from "../Utils/helpers";

class RecetasList extends Component {
  state = {
    isLoading: true,
    recetas: [],
  };

  componentDidMount() {
    recetas_getAll()
      .then((res) => {
        if (res.status === 200) {
          this.setState({ recetas: res.data, isLoading: false });
        }
      })
      .catch((ex) => {
        if (ex.response && ex.response.status === 401) {
          auth.logout();
          window.location = "/login";
        } else {
          this.props.onGlobalError("No se pudo conectar con el Servidor.");
        }
      });
  }

  render() {
    const { recetas, isLoading } = this.state;

    const resultados = recetas.filter((f) =>
      removeAccents(f.nombre).includes(removeAccents(this.props.filter.text))
    );

    if (isLoading) {
      return (
        <div id="overlay">
          <Loader type="Oval" color="#025f17" height={100} width={100} />
        </div>
      );
    }
    return (
      <div className="recetas-list">
        <div class="input-group mb-2 mt-2">
          <input
            type="text"
            class="form-control form-control-lg"
            placeholder="Ingresar texto para buscar..."
            value={this.props.filter.text}
            onChange={(e) => this.props.onChangeFilter(e.target.value)}
          />
        </div>

        <Link to={`/recetas/agregar/`}>
          <button title="Agregar receta" className="btn btn-success">
            Nueva
          </button>
        </Link>
        <table className="table table-striped table-sm">
          <thead className="thead-dark">
            <tr>
              <th>Nombre</th>
              <th className="cell-icon text-right"></th>
            </tr>
          </thead>
          <tbody>
            {resultados
              .sort((a, b) => {
                var nameA = removeAccents(a.nombre); // ignore upper and lowercase
                var nameB = removeAccents(b.nombre); // ignore upper and lowercase
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                // names must be equal
                return 0;
              })
              .map((p) => (
                <tr key={p._id} className={p.anulado ? "bg-danger" : ""}>
                  <td>{p.nombre}</td>
                  <td className="cell-icon text-right">
                    <Link to={`/recetas/modificar/${p._id}`} title="Modificar">
                      <button type="button" class="btn btn-primary">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </Link>
                    <Link to={`/recetas/eliminar/${p._id}`} title="Modificar">
                      <button type="button" class="btn btn-danger ml-1">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}
export default RecetasList;
