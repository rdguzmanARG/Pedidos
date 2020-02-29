import React, { Component } from "react";
import { confirmAlert } from "react-confirm-alert";
import Loader from "react-loader-spinner";
import "react-confirm-alert/src/react-confirm-alert.css";

import { Link } from "react-router-dom";
import { pedido_get, pedido_update } from "../services/pedidoService";
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

  submit = () => {
    confirmAlert({
      title: "Atención",
      message: (
        <div>
          <div>Pedido a nombre de: </div>
          <div>
            <b>
              {this.state.pedido.nombre + ", " + this.state.pedido.apellido}
            </b>
          </div>
          <div>
            {this.state.pedido.entregado
              ? "¿Confirma anulación de la entrega?"
              : "¿Confirma entrega?"}
          </div>
        </div>
      ),
      buttons: [
        {
          label: "Confirmar",
          className: this.state.pedido.entregado
            ? "btn btn-danger"
            : "btn btn-success",
          onClick: () => {
            const { pedido } = this.state;
            pedido_update(pedido._id, {
              ...pedido,
              entregado: !pedido.entregado,
              usuarioMod: ""
            })
              .then(res => {
                if (res.status === 200) {
                  this.props.history.push("/pedidos");
                }
              })
              .catch(ex => {
                toast.error("No se pudo confirmar el pedido.");
              });
          }
        },
        {
          label: "Cancelar",
          onClick: () => {}
        }
      ]
    });
  };

  render() {
    const pedido = this.state.pedido;
    const total = this.arrSum(pedido.items.map(p => p.cantidad * p.precio));
    if (pedido._id === undefined) {
      return (
        <div id="overlay">
          <Loader type="Circles" color="#025f17" height={100} width={100} />
        </div>
      );
    }
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
                <th className="d-none d-md-table-cell">Cantidad</th>
                <th className="d-none d-md-table-cell cell-right">
                  P. Unitario
                </th>
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
                          <th>Cant.</th>
                          <th className="cell-right">P. Unit.</th>
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

        {pedido.entregado === undefined ||
          (pedido.entregado === false && (
            <button onClick={this.submit} class="btn btn-success ml-2">
              Confirmar retiro
            </button>
          ))}
        {pedido.entregado === true && (
          <button onClick={this.submit} class="btn btn-danger ml-2">
            Anular retiro
          </button>
        )}
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
