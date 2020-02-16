import React, { Component } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

class PedidoDetail extends Component {
  state = {
    pedido: {
      items: []
    }
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    Axios.get("http://localhost:5000/api/pedidos/" + id).then(res => {
      if (res.status === 200) {
        this.setState({ pedido: res.data });
      }
    });
  }
  arrSum = arr => arr.reduce((a, b) => a + b, 0);

  render() {
    const pedido = this.state.pedido;
    const items = pedido.items.map(i => [
      ...i,
      this.props.productos.filter(p => p.nombre === i[0])[0] === undefined
        ? 0
        : this.props.productos.filter(p => p.nombre === i[0])[0].precio
    ]);
    const total = this.arrSum(items.map(p => p[1] * p[2]));
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
                className="btn btn-success btn-sm"
                onClick={() => this.props.history.push("/pedidos")}
              >
                Volder
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
        {items && (
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
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item[0]}</td>
                  <td>{item[1]}</td>
                  <td className="cell-right">${item[2].toFixed(2)}</td>
                  <td className="cell-right">
                    ${(item[1] * item[2]).toFixed(2)}
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
