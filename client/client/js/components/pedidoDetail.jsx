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
            <div class="d-flex">
              <div>
                <b>
                  {pedido.nombre}, {pedido.apellido}
                </b>
              </div>
            </div>
          </div>
          <div className="card-body m-1">
            {pedido.celular && (
              <div>
                Telefono:
                <b>{pedido.celular}</b>
              </div>
            )}
            {pedido.email && (
              <div>
                Email:
                <b>{pedido.email}</b>
              </div>
            )}
          </div>
        </div>
        {pedido.items && (
          <table className="table mt-2">
            <thead>
              <tr className="main-header">
                <th>Detalle del pedido</th>
                <th className="d-none d-md-table-cell">Cant.</th>
                <th className="d-none d-md-table-cell cell-right">Unidad</th>
                <th className="d-none d-md-table-cell cell-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {pedido.items.map((item, index) => (
                <tr key={index}>
                  <td className="d-table-cell d-md-none">
                    <div class="row">
                      <div class="col pb-3">
                        <b>{item.nombre}</b>
                      </div>
                    </div>
                    <table className="table">
                      <thead>
                        <tr className="secondary-header">
                          <th>Cantidad</th>
                          <th className="cell-right">P. Unitario</th>
                          <th className="cell-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{item.cantidad}</td>
                          <td className="cell-right">
                            ${item.precio.toFixed(2)}
                          </td>
                          <td className="cell-right">
                            ${(item.precio * item.cantidad).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>

                  <td className="d-none d-md-table-cell">{item.nombre}</td>
                  <td className="d-none d-md-table-cell">{item.cantidad}</td>
                  <td className="d-none d-md-table-cell cell-right">
                    ${item.precio.toFixed(2)}
                  </td>
                  <td className="d-none d-md-table-cell cell-right">
                    ${(item.precio * item.cantidad).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="totales">
                <td colSpan="4" className="cell-right d-none d-md-table-cell  ">
                  Total ${total.toFixed(2)}
                </td>
                <td colSpan="3" className="cell-right d-table-cell d-md-none ">
                  Total ${total.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        )}
        <button
          onClick={() => this.props.history.push("/pedidos")}
          class="btn btn-success ml-2"
          disabled="true"
        >
          Confirmar retiro
        </button>
        <button
          onClick={() => this.props.history.push("/pedidos")}
          class="btn btn-primary ml-2"
        >
          Volver
        </button>
      </React.Fragment>
    );
  }
}

export default PedidoDetail;