import React, { Component } from "react";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";
import { producto_getAll } from "../services/productoService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

class ProductosList extends Component {
  state = {
    isLoading: true,
    productos: []
  };

  search = e => {
    this.setState({ filter: e.target.value.toLowerCase() });
  };

  componentDidMount() {
    producto_getAll()
      .then(res => {
        if (res.status === 200) {
          this.setState({ productos: res.data, isLoading: false });
        }
      })
      .catch(ex => {
        if (ex.response && ex.response.status === 401) {
          auth.logout();
          window.location = "/login";
        } else {
          this.props.onGlobalError();
        }
      });
  }

  render() {
    const { productos, isLoading } = this.state;
    if (isLoading) {
      return (
        <div id="overlay">
          <Loader type="Circles" color="#025f17" height={100} width={100} />
        </div>
      );
    }
    return (
      <React.Fragment>
        <div class="input-group mb-2 mt-2">
          <input
            type="text"
            class="form-control"
            placeholder="Ingresar texto para buscar..."
            value={this.props.filter}
            onChange={e =>
              this.props.onChangeFilter(e.target.value.toLowerCase())
            }
          />
        </div>
        <table className="table table-striped table-sm table-productos">
          <thead className="thead-dark">
            <tr>
              <th>Nombre del producto</th>
              <th className="d-none d-sm-table-cell">Cantidad</th>
              <th className="cell-right">P.Venta</th>
              {this.props.user.isAdmin && <th></th>}
            </tr>
          </thead>
          <tbody>
            {productos
              .filter(f => f.nombre.toLowerCase().includes(this.props.filter))
              .map(p => (
                <tr key={p._id} className={p.anulado ? "bg-danger" : ""}>
                  <td>{p.nombre}</td>
                  <td className="d-none d-sm-table-cell">{p.cantidad}</td>
                  <td className="cell-right">${p.precio.toFixed(2)}</td>
                  {this.props.user.isAdmin && (
                    <td className="cell-right">
                      <Link to={`/productos/ver/${p._id}`} title="Modificar">
                        <button type="button" class="btn btn-primary btn-sm">
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default ProductosList;
