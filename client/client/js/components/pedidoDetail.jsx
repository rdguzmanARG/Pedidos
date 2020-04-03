import React, { Component } from "react";
import Loader from "react-loader-spinner";
import moment from "moment";
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { pedido_get, pedido_update } from "../services/pedidoService";
import { entrega_getCurrent } from "../services/entregaService";
import NumberFormat from "react-number-format";
import auth from "../services/authService";

class PedidoDetail extends Component {
  state = {
    isLoading: true,
    pedido: {
      items: [],
    },
    entregaEstado: "",
    totalPedidos: 0,
    totalAlmacen: null,
    showConfirmAceptado: false,
    showConfirmAnulado: false,
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    pedido_get(id)
      .then((resPedido) => {
        if (resPedido.status === 200) {
          entrega_getCurrent()
            .then((resEntrega) => {
              const pedido = resPedido.data;
              const totalPedidos = pedido.entregado
                ? pedido.totalPedido
                : this.arrSum(
                    pedido.items
                      .filter((f) => !f.producto.anulado)
                      .map((m) => m.pago)
                  );
              this.setState({
                pedido,
                totalPedidos,
                totalAlmacen:
                  pedido.totalAlmacen == 0 ? null : pedido.totalAlmacen,
                isLoading: false,
                entregaEstado: resEntrega.data ? resEntrega.data.estado : "",
              });
            })
            .catch((ex) => {
              if (ex.response && ex.response.status === 401) {
                auth.logout();
                window.location = "/login";
              } else {
                this.props.onGlobalError();
              }
            });
        }
      })
      .catch((ex) => {
        if (ex.response && ex.response.status === 401) {
          auth.logout();
          window.location = "/login";
        } else {
          this.props.onGlobalError();
        }
      });
  }
  arrSum = (arr) => arr.reduce((a, b) => a + b, 0);

  onAlmacenChange = (e) => {
    let valor = e.target.value;
    let totalAlmacen = Number(valor.replace("$", ""));
    if (totalAlmacen == 0) {
      totalAlmacen = null;
    }

    this.setState({
      ...this.state,
      totalAlmacen,
    });
  };

  onPagoChange = (e) => {
    let valor = e.target.value;
    const ped = { ...this.state.pedido };
    // Es el item a modificar
    const item = ped.items.filter((f) => f._id === e.target.name)[0];
    item.pago = Number(valor.replace("$", ""));
    if (item.pago == 0) {
      item.pago = null;
    }

    const totalPedidos = this.arrSum(
      ped.items.filter((f) => !f.producto.anulado).map((m) => m.pago)
    );
    this.setState({ ...this.state, totalPedidos, pedido: { ...ped } });
  };

  onPagoReset = (id) => {
    const ped = { ...this.state.pedido };
    // Es el item a modificar
    const item = ped.items.filter((f) => f._id === id)[0];
    item.pago = item.cantidad * item.precio;
    const totalPedidos = this.arrSum(
      ped.items.filter((f) => !f.producto.anulado).map((m) => m.pago)
    );
    this.setState({ ...this.state, totalPedidos, pedido: { ...ped } });
  };

  onPagoCero = (id) => {
    const ped = { ...this.state.pedido };
    // Es el item a modificar
    const item = ped.items.filter((f) => f._id === id)[0];
    item.pago = null;
    const totalPedidos = this.arrSum(
      ped.items.filter((f) => !f.producto.anulado).map((m) => m.pago)
    );
    this.setState({ ...this.state, totalPedidos, pedido: { ...ped } });
  };

  render() {
    const {
      pedido,
      isLoading,
      entregaEstado,
      totalPedidos,
      totalAlmacen,
      showConfirmAceptado,
      showConfirmAnulado,
    } = this.state;

    if (isLoading) {
      return (
        <div id="overlay">
          <Loader type="Circles" color="#025f17" height={100} width={100} />
        </div>
      );
    }

    const total = totalPedidos + totalAlmacen;
    const { user } = this.props;

    return (
      <div className="pedido-detail">
        {(showConfirmAceptado || showConfirmAnulado) && (
          <SweetAlert
            showCancel
            reverseButtons
            btnSize="sm"
            confirmBtnText="Confirmar!"
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="primary"
            title="¿Desea continuar?"
            onConfirm={() => {
              const { pedido, totalPedidos, totalAlmacen } = this.state;
              const { user } = this.props;
              const newPedido = {
                ...pedido,
                entregado: showConfirmAceptado,
                totalPedido: showConfirmAceptado ? totalPedidos : 0,
                totalAlmacen: showConfirmAceptado ? totalAlmacen : 0,
                usuarioMod: user.username,
              };
              pedido_update(pedido._id, newPedido)
                .then((res) => {
                  if (res.status === 200) {
                    if (showConfirmAceptado) {
                      this.props.history.push("/pedidos");
                    } else {
                      this.setState({
                        ...this.state,
                        pedido: res.data,
                        showConfirmAnulado: false,
                      });
                    }
                  }
                })
                .catch((ex) => {
                  this.props.onGlobalError();
                });
            }}
            onCancel={() => {
              this.setState({
                ...this.state,
                showConfirmAceptado: false,
                showConfirmAnulado: false,
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
        <div className="card mt-2 mb-2">
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
            <div className="row">
              <div className="col-md-6 mb-2">
                {pedido.celular && (
                  <div>
                    Teléfono: <b>{pedido.celular}</b>
                  </div>
                )}
                {pedido.email && (
                  <div>
                    Email: <b>{pedido.email}</b>
                  </div>
                )}
                {pedido.date && (
                  <div>
                    Fecha - Hora:{" "}
                    <b>{moment(pedido.date).format("DD/MM/YYYY HH:mm")}</b>
                  </div>
                )}
                <div>
                  Entrega a domicilio: <b>{pedido.conEntrega ? "Si" : "No"}</b>{" "}
                </div>
                {pedido.direccion && (
                  <div>
                    Dirección: <b>{pedido.direccion}</b>{" "}
                  </div>
                )}
                {pedido.comentarios && (
                  <div>
                    Comentarios: <b>{pedido.comentarios}</b>{" "}
                  </div>
                )}
              </div>
              <div className="col-md-6 map-position">
                {pedido.direccion && (
                  <iframe
                    width="300"
                    height="300"
                    frameborder="0"
                    src={
                      "https://www.google.com/maps/embed/v1/place?key=AIzaSyCh0CejOsqJPPExI64OAx_66Qq78zcaAgY&q=" +
                      pedido.direccion
                    }
                    allowfullscreen
                  ></iframe>
                )}
              </div>
            </div>
          </div>
        </div>
        {pedido.items && (
          <table className="table ">
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
              {pedido.items.map(
                (
                  {
                    producto,
                    cantidad,
                    precio: currentPrecio,
                    pago: currentPago,
                    _id,
                  },
                  index
                ) => {
                  const precio =
                    currentPrecio == undefined
                      ? producto.precio
                      : currentPrecio;
                  const pago =
                    currentPrecio == undefined
                      ? precio * cantidad
                      : currentPago;

                  return (
                    <tr
                      key={index}
                      className={
                        pedido.entregado
                          ? producto.anulado
                            ? pago > 0
                              ? "bg-danger"
                              : ""
                            : pago != null
                            ? pago != precio * cantidad
                              ? "bg-primary"
                              : ""
                            : "bg-warning"
                          : producto.anulado
                          ? "bg-danger"
                          : pago == null
                          ? "bg-warning"
                          : pago != precio * cantidad
                          ? "bg-primary"
                          : ""
                      }
                    >
                      <td className="pedido-detail-mobile d-table-cell d-md-none">
                        <div class="row2">
                          <div class="pedido-detail-item-title col pb-3">
                            <b>{producto.nombre}</b>
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
                            <tr className={producto.anulado ? "bg-danger" : ""}>
                              <td>{cantidad}</td>
                              <td className="cell-right">
                                ${producto.precio.toFixed(2)}
                              </td>
                              <td className="cell-right">
                                <NumberFormat
                                  name={_id}
                                  disabled={
                                    entregaEstado !== "INI" ||
                                    pedido.entregado ||
                                    producto.anulado
                                  }
                                  onChange={this.onPagoChange}
                                  thousandSeparator={false}
                                  value={producto.anulado ? null : pago}
                                  allowNegative={false}
                                  prefix={"$"}
                                  className="form-control field-pago"
                                  placeholder="$0.00"
                                />
                                {entregaEstado == "INI" && !pedido.entregado && (
                                  <React.Fragment>
                                    {pago == precio * cantidad && (
                                      <button
                                        disabled={producto.anulado}
                                        title="Volver al valor inicial"
                                        onClick={() => this.onPagoCero(_id)}
                                        class="btn btn-danger btn-reset-pago"
                                      >
                                        <FontAwesomeIcon icon={faWindowClose} />
                                      </button>
                                    )}
                                    {pago != precio * cantidad && (
                                      <button
                                        disabled={producto.anulado}
                                        title="Volver al valor inicial"
                                        onClick={() => this.onPagoReset(_id)}
                                        class="btn btn-primary btn-reset-pago"
                                      >
                                        <FontAwesomeIcon icon={faUndo} />
                                      </button>
                                    )}
                                  </React.Fragment>
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="space"></div>
                      </td>

                      <td className="d-none d-md-table-cell">
                        {producto.nombre}
                      </td>
                      <td className="d-none d-md-table-cell">{cantidad}</td>
                      <td className="d-none d-md-table-cell cell-right">
                        $
                        {precio == undefined
                          ? producto.precio.toFixed(2)
                          : precio.toFixed(2)}
                      </td>
                      <td className="d-none d-md-table-cell cell-right">
                        <NumberFormat
                          name={_id}
                          disabled={
                            entregaEstado !== "INI" ||
                            pedido.entregado ||
                            producto.anulado
                          }
                          onChange={this.onPagoChange}
                          thousandSeparator={false}
                          allowNegative={false}
                          value={producto.anulado ? null : pago}
                          prefix={"$"}
                          className="form-control field-pago"
                          placeholder="$0.00"
                        />
                        {entregaEstado == "INI" && !pedido.entregado && (
                          <React.Fragment>
                            {pago == precio * cantidad && (
                              <button
                                disabled={producto.anulado}
                                title="Volver al valor inicial"
                                onClick={() => this.onPagoCero(_id)}
                                class="btn btn-danger btn-reset-pago"
                              >
                                <FontAwesomeIcon icon={faWindowClose} />
                              </button>
                            )}
                            {pago != precio * cantidad && (
                              <button
                                disabled={producto.anulado}
                                title="Volver al valor inicial"
                                onClick={() => this.onPagoReset(_id)}
                                class="btn btn-primary btn-reset-pago"
                              >
                                <FontAwesomeIcon icon={faUndo} />
                              </button>
                            )}
                          </React.Fragment>
                        )}
                      </td>
                    </tr>
                  );
                }
              )}
              <tr>
                <td colSpan="4" className="cell-right d-none d-md-table-cell  ">
                  <div className="form-group">
                    <label for="almacenD">Total almacén:</label>
                    <NumberFormat
                      id="almacenD"
                      disabled={entregaEstado !== "INI" || pedido.entregado}
                      onChange={this.onAlmacenChange}
                      thousandSeparator={false}
                      allowNegative={false}
                      value={totalAlmacen}
                      prefix={"$"}
                      className="form-control"
                      placeholder="$0.00"
                    />
                  </div>
                </td>
                <td colSpan="3" className="cell-right d-table-cell d-md-none ">
                  <div className="form-group">
                    <label for="almacenM">Total almacén:</label>
                    <NumberFormat
                      id="almacenM"
                      disabled={entregaEstado !== "INI" || pedido.entregado}
                      onChange={this.onAlmacenChange}
                      thousandSeparator={false}
                      allowNegative={false}
                      value={totalAlmacen}
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
        {(user.isAdmin || user.isAdminPed) && (
          <React.Fragment>
            {entregaEstado === "INI" && pedido.entregado === false && (
              <button
                onClick={() =>
                  this.setState({ ...this.state, showConfirmAceptado: true })
                }
                disabled={entregaEstado !== "INI"}
                class="btn btn-success ml-2"
              >
                Confirmar retiro
              </button>
            )}
            {entregaEstado === "INI" && pedido.entregado === true && (
              <button
                onClick={() =>
                  this.setState({ ...this.state, showConfirmAnulado: true })
                }
                disabled={entregaEstado !== "INI"}
                class="btn btn-danger ml-2"
              >
                Anular retiro
              </button>
            )}
          </React.Fragment>
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
