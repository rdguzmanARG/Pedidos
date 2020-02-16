import React, { Component } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

class PedidosList extends Component {
  state = {
    pedidos: [],
    pedidosFiltrados: []
  };

  componentDidMount() {
    Axios.get("http://localhost:5000/api/pedidos").then(res => {
      console.log("Recuperar Pedidos!!");
      if (res.status === 200) {
        this.setState({ pedidos: res.data, pedidosFiltrados: res.data });
      }
    });
  }

  search = e => {
    const text = e.target.value.toLowerCase();
    const pedidosFiltrados = this.state.pedidos.filter(
      p =>
        p.nombre.toLowerCase().includes(text) ||
        p.apellido.toLowerCase().includes(text)
    );
    this.setState({ pedidosFiltrados });
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
          <thead>
            <tr>
              <th>Nombre y Apellido</th>
              <th className="d-none d-sm-block">Telefono</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.pedidosFiltrados.map(p => (
              <tr key={p._id}>
                <td>
                  <Link to={`/pedidos/ver/${p._id}`}>
                    {p.nombre}, {p.apellido}
                  </Link>
                </td>
                <td className="d-none d-sm-block">{p.celular}</td>
                <td>
                  <Link to={`/pedidos/ver/${p._id}`}>Ver</Link>
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