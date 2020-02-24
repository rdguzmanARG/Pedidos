import React, { Component } from "react";
import { Link } from "react-router-dom";

class ProductosList extends Component {
  search = e => {
    this.setState({ filter: e.target.value.toLowerCase() });
  };

  render() {
    return (
      <React.Fragment>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <Link to="/">Inicio</Link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              Productos
            </li>
          </ol>
        </nav>
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Ingresar texto para buscar..."
            value={this.props.filter}
            onChange={e =>
              this.props.onChangeFilter(e.target.value.toLowerCase())
            }
          />
          <div class="input-group-append">
            <button
              class="btn btn-outline-secondary"
              type="button"
              onClick={e => {
                e.preventDefault();
                this.props.onChangeFilter("");
              }}
            >
              Borrar
            </button>
          </div>
        </div>
        <table className="table table-striped table-sm">
          <thead className="thead-dark">
            <tr>
              <th>Nombre del producto</th>
              <th>Cantidad</th>
              <th className="cell-right">P.Venta</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.productos
              .filter(f => f.nombre.toLowerCase().includes(this.props.filter))
              .map(p => (
                <tr key={p._id}>
                  <td>{p.nombre}</td>
                  <td>{p.cantidad}</td>
                  <td className="cell-right">${p.precio.toFixed(2)}</td>
                  <td className="cell-right">
                    <Link to={`/productos/ver/${p._id}`}>
                      <button type="button" class="btn btn-primary btn-sm">
                        Modificar
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default ProductosList;
