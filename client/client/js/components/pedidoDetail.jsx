import React, { Component } from "react";
import Loader from "react-loader-spinner";
import moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { pedido_get, pedido_update } from "../services/pedidoService";
import { entrega_getCurrent } from "../services/entregaService";
import NumberFormat from "react-number-format";
import auth from "../services/authService";

class PedidoDetail extends Component {
  state = {
    isLoading: true,
    pedido: {
      items: []
    },
    entregaEstado: "",
    totalPedidos: 0,
    totalAlmacen: 0,
    showConfirm: false
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    pedido_get(id)
      .then(resPedido => {
        if (resPedido.status === 200) {
          entrega_getCurrent()
            .then(resEntrega => {
              const pedido = resPedido.data;
              const totalPedidos = pedido.entregado
                ? pedido.totalPedido
                : this.arrSum(
                    pedido.items
                      .filter(f => !f.anulado)
                      .map(m => m.cantidad * m.precio)
                  );
              this.setState({
                pedido,
                totalPedidos,
                isLoading: false,
                entregaEstado: resEntrega.data ? resEntrega.data.estado : ""
              });
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
  arrSum = arr => arr.reduce((a, b) => a + b, 0);

  onFieldChange = e => {
    let valor = e.target.value;
    if (
      e.target.value == "" ||
      e.target.value == "-" ||
      e.target.value == "$."
    ) {
      valor = "0";
    }
    const ped = { ...this.state.pedido };
    ped[e.target.name] = Number(valor.replace("$", ""));
    this.setState({ ...this.state, pedido: ped });
  };

  render() {
    const {
      pedido,
      isLoading,
      entregaEstado,
      totalPedidos,
      showConfirm
    } = this.state;
    if (isLoading) {
      return (
        <div id="overlay">
          <Loader type="Circles" color="#025f17" height={100} width={100} />
        </div>
      );
    }

    const total = totalPedidos + pedido.ajuste;

    return (
      <div className="pedido-detail">
        {showConfirm && (
          <SweetAlert
            showCancel
            reverseButtons
            btnSize="sm"
            confirmBtnText="Confirmar!"
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="primary"
            showCloseButton={true}
            title="¿Desea continuar?"
            onConfirm={() => {
              const { pedido, totalPedidos, totalAlmacen } = this.state;
              const { user } = this.props;
              const newPedido = {
                ...pedido,
                entregado: !pedido.entregado,
                ajuste: !pedido.entregado ? pedido.ajuste : 0,
                totalPedido: !pedido.entregado ? totalPedidos : 0,
                totalAlmacen: !pedido.entregado ? totalAlmacen : 0,
                usuarioMod: user.username
              };
              pedido_update(pedido._id, newPedido)
                .then(res => {
                  if (res.status === 200) {
                    if (res.data.entregado) {
                      this.props.history.push("/pedidos");
                    } else {
                      this.setState({
                        ...this.state,
                        pedido: newPedido,
                        showConfirm: false
                      });
                    }
                  }
                })
                .catch(ex => {
                  this.props.onGlobalError();
                });
            }}
            onCancel={() => {
              this.setState({
                ...this.state,
                showConfirm: false
              });
            }}
            focusCancelBtn
          >
            <div>
              El pedido de{" "}
              <b>
                {pedido.nombre}, {pedido.apellido}
              </b>{" "}
              será {!pedido.entregado && <span>confirmado</span>}
              {pedido.entregado && <span>anulado</span>}.
            </div>
          </SweetAlert>
        )}
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
                Teléfono:
                <b>{pedido.celular}</b>
              </div>
            )}
            {pedido.email && (
              <div>
                Email:
                <b>{pedido.email}</b>
              </div>
            )}
            {pedido.date && (
              <div>
                Fecha - Hora:{" "}
                <b>{moment(pedido.date).format("DD/MM/YYYY HH:mm")}</b>
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
                <tr key={index} className={item.anulado ? "bg-danger" : ""}>
                  <td className="pedido-detail-mobile d-table-cell d-md-none">
                    <div class="row2">
                      <div class="pedido-detail-item-title col pb-3">
                        <b>{item.nombre}</b>
                      </div>
                    </div>
                    <table className="table m-0">
                      <thead>
                        <tr className="secondary-header">
                          <th>Cant.</th>
                          <th className="cell-right">P. Unit.</th>
                          <th className="cell-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className={item.anulado ? "bg-danger" : ""}>
                          <td>{item.cantidad}</td>
                          <td className="cell-right">
                            ${item.precio.toFixed(2)}
                          </td>
                          <td className="cell-right">
                            $
                            {(item.anulado
                              ? 0
                              : item.precio * item.cantidad
                            ).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="space"></div>
                  </td>

                  <td className="d-none d-md-table-cell">{item.nombre}</td>
                  <td className="d-none d-md-table-cell">{item.cantidad}</td>
                  <td className="d-none d-md-table-cell cell-right">
                    ${item.precio.toFixed(2)}
                  </td>
                  <td className="d-none d-md-table-cell cell-right">
                    $
                    {(item.anulado ? 0 : item.precio * item.cantidad).toFixed(
                      2
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="4" className="cell-right d-none d-md-table-cell  ">
                  <div className="form-group">
                    <label for="ajusteporPesoD">Ajuste:</label>
                    <NumberFormat
                      id="ajusteporPesoD"
                      name="ajuste"
                      disabled={entregaEstado !== "INI" || pedido.entregado}
                      onChange={this.onFieldChange}
                      thousandSeparator={false}
                      defaultValue={pedido.ajuste}
                      prefix={"$"}
                      className="form-control"
                      placeholder="$0.00"
                    />
                  </div>
                </td>
                <td colSpan="3" className="cell-right d-table-cell d-md-none ">
                  <div className="form-group">
                    <label for="ajusteporPesoM">Ajuste:</label>
                    <NumberFormat
                      id="ajusteporPesoM"
                      name="ajuste"
                      disabled={entregaEstado !== "INI" || pedido.entregado}
                      onChange={this.onFieldChange}
                      thousandSeparator={false}
                      defaultValue={pedido.ajuste}
                      prefix={"$"}
                      className="form-control"
                      placeholder="$0.00"
                    />
                  </div>
                </td>
              </tr>
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
            <button
              onClick={() =>
                this.setState({ ...this.state, showConfirm: true })
              }
              disabled={entregaEstado !== "INI"}
              class="btn btn-success ml-2"
            >
              Confirmar retiro
            </button>
          ))}
        {pedido.entregado === true && (
          <button
            onClick={() => this.setState({ ...this.state, showConfirm: true })}
            disabled={entregaEstado !== "INI"}
            class="btn btn-danger ml-2"
          >
            Anular retiro
          </button>
        )}
        <button
          title="Volver"
          onClick={() => this.props.history.push("/pedidos")}
          class="btn btn-primary ml-2"
        >
          <FontAwesomeIcon icon={faUndo} />
        </button>
      </div>
    );
  }
}

export default PedidoDetail;
