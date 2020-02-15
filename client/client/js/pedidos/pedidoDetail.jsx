import React, { Component } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

class PedidoDetail extends Component {
  state = { pedido: {} };

  componentDidMount() {
    const id = this.props.match.params.id;
    Axios.get("http://localhost:5000/api/pedidos/" + id).then(res => {
      if (res.status === 200) {
        this.setState({ pedido: res.data });
      }
    });
  }

  render() {
    const pedido = this.state.pedido;
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
                  <td>{item[0]}</td>
                  <td>{item[1]}</td>
                  <td>$0.00</td>
                  <td>$0.00</td>
                </tr>
              ))}
              {/* <tr>
                <td colSpan="2">Total</td>
                <td>$3213</td>
                <td>$443242</td>
              </tr> */}
            </tbody>
          </table>
        )}
      </React.Fragment>
    );
  }
}

export default PedidoDetail;
