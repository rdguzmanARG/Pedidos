import React, { Component } from "react";
import { Link } from "react-router-dom";
import { pedido_getAll } from "../services/pedidoService";
import auth from "../services/authService";

class PedidosList extends Component {
  state = {
    pedidos: [],
    filter: ""
  };

  componentDidMount() {
    pedido_getAll()
      .then(res => {
        console.log("Recuperar Pedidos!!");
        if (res.status === 200) {
          this.setState({ pedidos: res.data });
        }
      })
      .catch(ex => {
        if (ex.response && ex.response.status === 401) {
          auth.logout();
          window.location = "/login";
        }
      });
  }

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
              Pedidos
            </li>
          </ol>
        </nav>
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Ingresar Nombre y/o Apellido para filtrar la búqeuda..."
            onChange={this.search}
          />
        </div>
        <table className="table table-striped table-sm">
          <thead className="thead-dark">
            <tr>
              <th>Nombre y Apellido</th>
              <th className="hide-on-mobile">Telefono</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.pedidos
              .filter(
                f =>
                  f.nombre.toLowerCase().includes(this.state.filter) ||
                  f.apellido.toLowerCase().includes(this.state.filter)
              )
              .map(p => (
                <tr key={p._id}>
                  <td>
                    {p.nombre}, {p.apellido}
                  </td>
                  <td className="hide-on-mobile">
                    <a href={"tel:+" + p.celular}>{p.celular}</a>{" "}
                  </td>
                  <td>
                    <Link to={`/pedidos/ver/${p._id}`}>
                      <button type="button" class="btn btn-primary btn-sm">
                        Ver
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

export default PedidosList;
