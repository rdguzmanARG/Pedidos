import React, { Component } from "react";
import { Link } from "react-router-dom";
import { pedido_get } from "../services/pedidoService";
import auth from "../services/authService";

class PedidoDetail extends Component {
  state = {
    pedido: {
      items: []
    }
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    pedido_get(id)
      .then(res => {
        if (res.status === 200) {
          this.setState({ pedido: res.data });
        }
      })
      .catch(ex => {
        if (ex.response && ex.response.status === 401) {
          auth.logout();
          window.location = "/login";
        }
      });
  }
  arrSum = arr => arr.reduce((a, b) => a + b, 0);

  render() {
    const pedido = this.state.pedido;
    const total = this.arrSum(pedido.items.map(p => p.cantidad * p.precio));
    return (
      <React.Fragment>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <Link to="/">Inicio</Link>
            </li>
            <li class="breadcrumb-item">
              <Link to="/pedidos">Pedidos</Link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              Detalle
            </li>
          </ol>
        </nav>

        <div className="card">
          <div className="card-header">
            <div class="d-flex justify-content-between">
              Detalle de Pedido
              <button
                onClick={() => this.props.history.push("/pedidos")}
                class="btn btn-light ml-2"
              >
                Volver
              </button>
            </div>
          </div>
          <div className="card-body m-2">
            <div>
              Nombre y Apellido:
              <b className="m-2">
                {pedido.nombre}, {pedido.apellido}
              </b>
            </div>
            {pedido.celular && (
              <div>
                Telefono:
                <b className="m-2">{pedido.celular}</b>
              </div>
            )}
            {pedido.email && (
              <div>
                Correo electrónico:
                <b className="m-2">{pedido.email}</b>
              </div>
            )}
          </div>
        </div>
        {pedido.items && (
          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cant.</th>
                <th>Uni</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {pedido.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.nombre}</td>
                  <td>{item.cantidad}</td>
                  <td className="cell-right">${item.precio.toFixed(2)}</td>
                  <td className="cell-right">
                    ${(item.precio * item.cantidad).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="3" className="cell-right">
                  Total
                </td>
                <td className="cell-right">${total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        )}
      </React.Fragment>
    );
  }
}

export default PedidoDetail;
