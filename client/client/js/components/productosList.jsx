import React, { Component } from "react";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";
import { producto_getAll } from "../services/productoService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

class ProductosList extends Component {
  state = {
    isLoading: true,
    productos: [],
  };

  componentDidMount() {
    producto_getAll()
      .then((res) => {
        if (res.status === 200) {
          this.setState({ productos: res.data, isLoading: false });
        }
      })
      .catch((ex) => {
        if (ex.response && ex.response.status === 401) {
          auth.logout();
          window.location = "/login";
        } else {
          this.props.onGlobalError(ex.response.status);
        }
      });
  }

  render() {
    const { productos, isLoading } = this.state;

    const resultado = productos.filter(
      (f) =>
        f.nombre.toLowerCase().includes(this.props.filter.text.toLowerCase()) &&
        (!this.props.filter.soloPedidos || f.cantidad > 0)
    );

    if (isLoading) {
      return (
        <div id="overlay">
          <Loader type="Circles" color="#025f17" height={100} width={100} />
        </div>
      );
    }
    return (
      <div className="productos-list">
        <div class="input-group mb-2 mt-2">
          <input
            type="text"
            class="form-control form-control-lg"
            placeholder="Ingresar texto para buscar..."
            value={this.props.filter.text}
            onChange={(e) => this.props.onChangeFilter(e.target.value)}
          />
        </div>
        <div class="input-group mb-2 mt-2">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              checked={this.props.filter.soloPedidos}
              id="soloPedidos"
              onChange={(e) => this.props.onChangeFilter(e.target.checked)}
            ></input>
            <label class="form-check-label" for="soloPedidos">
              Solo productos pedidos
            </label>
          </div>
        </div>
        <div className="text-right">
          <b>Pedidos: {resultado.length}</b>
        </div>
        <table className="table table-striped table-sm table-productos">
          <thead className="thead-dark">
            <tr>
              <th>Nombre del producto</th>
              <th className="d-none d-sm-table-cell">Cantidad</th>
              <th className="cell-right">P.Venta</th>
              <th className="cell-icon"></th>
            </tr>
          </thead>
          <tbody>
            {resultado
              .sort((a, b) => {
                var nameA = a.nombre.toLowerCase(); // ignore upper and lowercase
                var nameB = b.nombre.toLowerCase(); // ignore upper and lowercase
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
                  <td className="d-none d-sm-table-cell">{p.cantidad}</td>
                  <td className="cell-right">${p.precio.toFixed(2)}</td>
                  <td className="cell-icon">
                    <Link to={`/productos/ver/${p._id}`} title="Modificar">
                      <button type="button" class="btn btn-primary btn-sm">
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

export default ProductosList;
