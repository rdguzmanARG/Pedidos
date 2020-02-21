import React, { Component } from "react";
import { Link } from "react-router-dom";

class ProductosList extends Component {
  state = {
    filter: ""
  };

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
            onChange={this.search}
          />
        </div>
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>P.Venta</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.productos
              .filter(f => f.nombre.toLowerCase().includes(this.state.filter))
              .map(p => (
                <tr key={p._id}>
                  <td>
                    <Link to={`/productos/ver/${p._id}`}>{p.nombre}</Link>
                  </td>
                  <td className="cell-right">${p.precio.toFixed(2)}</td>
                  <td>
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
