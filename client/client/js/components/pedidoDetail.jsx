import React, { Component } from "react";
import Loader from "react-loader-spinner";
import moment from "moment";
import Scroll from "react-scroll";
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUndo,
  faWindowClose,
  faSave,
  faCheckSquare,
  faDolly,
  faTimes,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { pedido_get, pedido_update } from "../services/pedidoService";
import { entrega_getCurrent } from "../services/entregaService";
import NumberFormat from "react-number-format";
import auth from "../services/authService";

const Element = Scroll.Element;
const scroller = Scroll.scroller;

class PedidoDetail extends Component {
  state = {
    isLoading: true,
    pedido: {
      items: [],
    },
    entregaEstado: "",
    totalPedidos: 0,
    totalAlmacen: 0,
    direccion: "",
    direccionDetalle: "",
    celular: "",
    comentarioInterno: "",
    repartidor: "",
    varios: null,
    pressEntregado: false,
    pressPreparado: false,
    pressGuardado: false,
    pressAnulado: false,
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    pedido_get(id)
      .then((resPedido) => {
        if (resPedido.status === 200) {
          entrega_getCurrent()
            .then((resEntrega) => {
              const pedido = resPedido.data;
              const totalPedidos =
                pedido.estado > 0
                  ? pedido.totalPedido
                  : this.arrSum(
                      pedido.items
                        .filter((f) => !f.producto.almacen)
                        .map((m) => m.pago)
                    );
              const totalAlmacen =
                pedido.estado > 0
                  ? pedido.totalAlmacen
                  : this.arrSum(
                      pedido.items
                        .filter((f) => f.producto.almacen)
                        .map((m) => m.pago)
                    );
              this.setState({
                pedido,
                totalPedidos,
                direccion: pedido.direccion,
                direccionDetalle: pedido.direccionDetalle,
                celular: pedido.celular,
                repartidor: pedido.repartidor,
                comentarioInterno: pedido.comentarioInterno,
                varios: pedido.varios,
                totalAlmacen,
                isLoading: false,
                entregaEstado: resEntrega.data ? resEntrega.data.estado : "",
              });
            })
            .catch((ex) => {
              if (ex.response && ex.response.status === 401) {
                auth.logout();
                window.location = "/login";
              } else {
                this.props.onGlobalError(
                  "No se pudo conectar con el Servidor."
                );
              }
            });
        }
      })
      .catch((ex) => {
        if (ex.response && ex.response.status === 401) {
          auth.logout();
          window.location = "/login";
        } else {
          this.props.onGlobalError("No se pudo conectar con el Servidor.");
        }
      });
  }
  arrSum = (arr) => arr.reduce((a, b) => a + b, 0);

  onVariosChange = (e) => {
    let valor = e.target.value;
    let varios = Number(valor.replace("$", ""));

    this.setState({
      ...this.state,
      varios,
    });
  };

  onPagoChange = (e) => {
    let valor = e.target.value;
    const ped = { ...this.state.pedido };
    // Es el item a modificar
    const item = ped.items.filter((f) => f._id === e.target.name)[0];
    item.pago = Number(valor.replace("$", ""));

    const totalPedidos = this.arrSum(
      ped.items.filter((f) => !f.producto.almacen).map((m) => m.pago)
    );
    const totalAlmacen = this.arrSum(
      ped.items.filter((f) => f.producto.almacen).map((m) => m.pago)
    );

    this.setState({
      ...this.state,
      totalPedidos,
      totalAlmacen,
      pedido: { ...ped },
    });
  };

  onPagoReset = (id) => {
    const ped = { ...this.state.pedido };
    // Es el item a modificar
    const item = ped.items.filter((f) => f._id === id)[0];
    item.pago = item.cantidad * item.precio;
    const totalPedidos = this.arrSum(
      ped.items.filter((f) => !f.producto.almacen).map((m) => m.pago)
    );
    const totalAlmacen = this.arrSum(
      ped.items.filter((f) => f.producto.almacen).map((m) => m.pago)
    );
    this.setState({
      ...this.state,
      totalPedidos,
      totalAlmacen,
      pedido: { ...ped },
    });
  };

  onPagoCero = (id) => {
    const ped = { ...this.state.pedido };
    // Es el item a modificar
    const item = ped.items.filter((f) => f._id === id)[0];
    item.pago = 0;
    const totalPedidos = this.arrSum(
      ped.items
        .filter((f) => !f.pago != null && !f.producto.almacen)
        .map((m) => m.pago)
    );
    const totalAlmacen = this.arrSum(
      ped.items
        .filter((f) => !f.pago != null && f.producto.almacen)
        .map((m) => m.pago)
    );

    this.setState({
      ...this.state,
      totalPedidos,
      totalAlmacen,
      pedido: { ...ped },
    });
  };

  updateDireccion = () => {
    this.setState({ ...this.state, isLoading: true });
    const { pedido } = this.state;

    pedido_update(pedido._id, {
      direccion: this.state.direccion,
      direccionDetalle: this.state.direccionDetalle,
      celular: this.state.celular,
      repartidor: this.state.repartidor,
      comentarioInterno: this.state.comentarioInterno,
    })
      .then(({ data: updatePedido }) => {
        this.setState({
          ...this.state,
          pedido: updatePedido,
          direccion: updatePedido.direccion,
          direccionDetalle: updatePedido.direccionDetalle,
          celular: updatePedido.celular,
          repartidor: updatePedido.repartidor,
          comentarioInterno: updatePedido.comentarioInterno,
          isLoading: false,
        });
        scroller.scrollTo("mapaId", {
          duration: 1000,
          delay: 100,
          smooth: true,
          offset: -120, // Scrolls to element + 50 pixels down the page
        });
      })
      .catch((ex) => {
        if (ex.response && ex.response.status === 401) {
          auth.logout();
          window.location = "/login";
        } else {
          this.setState({
            ...this.state,
            isLoading: false,
          });
        }
      });
  };

  render() {
    const {
      pedido,
      isLoading,
      entregaEstado,
      totalPedidos,
      totalAlmacen,
      varios,
      pressEntregado,
      pressPreparado,
      pressGuardado,
      pressAnulado,
      repartidor,
    } = this.state;
    const itemsPedido = pedido.items.filter((p) => !p.producto.almacen);
    const itemsAlmacen = pedido.items.filter((p) => p.producto.almacen);

    const newEstado = pressEntregado
      ? 3
      : pressPreparado
      ? 2
      : pressGuardado
      ? 1
      : 0;

    if (isLoading) {
      return (
        <div id="overlay">
          <Loader type="Oval" color="#025f17" height={100} width={100} />
        </div>
      );
    }

    const total = totalPedidos + totalAlmacen + varios;
    const { user } = this.props;
    return (
      <div className="pedido-detail">
        {(pressEntregado ||
          pressPreparado ||
          pressAnulado ||
          pressGuardado) && (
          <SweetAlert
            showCancel
            reverseButtons
            btnSize="sm"
            confirmBtnText="Confirmar!"
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="primary"
            title="¿Desea continuar?"
            onConfirm={() => {
              const { pedido, totalPedidos, totalAlmacen, varios } = this.state;
              const { user } = this.props;
              const newPedido = {
                ...pedido,
                estado: newEstado,
                varios: newEstado > 0 ? varios : 0,
                totalPedido: newEstado > 0 ? totalPedidos : 0,
                totalAlmacen: newEstado > 0 ? totalAlmacen : 0,
                usuarioMod: user.username,
              };
              pedido_update(pedido._id, newPedido)
                .then((res) => {
                  if (res.status === 200) {
                    if (newEstado >= 1) {
                      this.props.history.push("/pedidos");
                    } else {
                      this.setState({
                        ...this.state,
                        pedido: res.data,
                        varios: res.data.varios,
                        pressEntregado: false,
                        pressPreparado: false,
                        pressGuardado: false,
                        pressAnulado: false,
                      });
                    }
                  }
                })
                .catch((ex) => {
                  this.props.onGlobalError(
                    "No se pudo conectar con el Servidor."
                  );
                });
            }}
            onCancel={() => {
              this.setState({
                ...this.state,
                pressEntregado: false,
                pressPreparado: false,
                pressGuardado: false,
                pressAnulado: false,
              });
            }}
            focusCancelBtn
          >
            <div>
              El pedido de{" "}
              <b>
                {pedido.nombre}, {pedido.apellido}
              </b>{" "}
              {newEstado === 1 && <span> será guardado.</span>}
              {newEstado === 2 && <span> esta listo para entregar.</span>}
              {newEstado === 3 && <span> fue entregado.</span>}
              {newEstado === 0 && <span> será anulado.</span>}
            </div>
          </SweetAlert>
        )}
        <div className="card mt-2 mb-2">
          <div className="card-header">
            <div className="title">
              <b>
                {pedido.nombre}, {pedido.apellido}
              </b>
            </div>
            {pedido.estado === 0 && (
              <span className="text text-0"> Pedido sin procesar</span>
            )}
            {pedido.estado === 1 && (
              <span className="text text-1">
                {" "}
                Pedido modificado {moment(pedido.updatedAt).format("HH:mm")}
              </span>
            )}
            {pedido.estado === 2 && (
              <span className="text text-2"> Pedido listo para entregar</span>
            )}
            {pedido.estado === 3 && (
              <span className="text text-3"> Pedido entregado</span>
            )}
          </div>
          <div className="card-body m-1">
            <div className="row">
              <div className="col-md-6 mb-1">
                Código:{" "}
                <b>{pedido._id.substr(pedido._id.length - 5).toUpperCase()}</b>
                {pedido.date && (
                  <div>
                    Fecha del pedido:{" "}
                    <b>{moment(pedido.date).format("DD/MM HH:mm")}</b>
                  </div>
                )}
                {pedido.email && (
                  <div>
                    Email: <b>{pedido.email}</b>
                  </div>
                )}
                <div>
                  Email Enviado:{" "}
                  <b>
                    {pedido.emailEnviado == 0
                      ? "No"
                      : pedido.emailEnviado == 1
                      ? "Si"
                      : "No se pudo enviar el Email."}
                  </b>{" "}
                </div>
                <div>
                  Entrega a domicilio: <b>{pedido.conEntrega ? "Si" : "No"}</b>{" "}
                </div>
                {pedido.comentarios && (
                  <div>
                    Comentarios: <b>{pedido.comentarios}</b>{" "}
                  </div>
                )}
                {!pedido.conEntrega && !pedido.turno && (
                  <div>
                    Horario: <b>Sin reservar</b>{" "}
                  </div>
                )}
              </div>
              <div className="col-md-6 map-position">
                {pedido.turno && (
                  <div className="text-left">
                    <div className="pedido-detail--title">
                      Horario de retiro
                    </div>
                    <div>
                      Fecha:{" "}
                      <b>{moment(pedido.turno.dia).format("DD/MM/YYYY")}</b>
                    </div>
                    <div>
                      Hora: <b>{pedido.turno.hora}</b>
                    </div>
                  </div>
                )}
                {pedido.conEntrega && (
                  <div className="pedido-detail--title text-left">
                    Datos para el envio
                  </div>
                )}
                {!pedido.conEntrega && (
                  <div className="pedido-detail--title text-left">
                    Datos de contacto
                  </div>
                )}
                <Element name="mapaId"></Element>
                {pedido.conEntrega && pedido.direccion && (
                  <React.Fragment>
                    <div className="pedido-detail--edicion">
                      <label>Domicilio:</label>
                      <input
                        disabled={entregaEstado !== "INI"}
                        className="form-control"
                        defaultValue={pedido.direccion}
                        onChange={(e) =>
                          this.setState({
                            ...this.state,
                            direccion: e.target.value,
                          })
                        }
                      ></input>
                    </div>
                    <div className="pedido-detail--edicion">
                      <label>Detalle:</label>
                      <input
                        disabled={entregaEstado !== "INI"}
                        className="form-control"
                        defaultValue={pedido.direccionDetalle}
                        onChange={(e) =>
                          this.setState({
                            ...this.state,
                            direccionDetalle: e.target.value,
                          })
                        }
                      ></input>
                    </div>
                    <div className="pedido-detail--edicion">
                      <label>Repartidor:</label>
                      <input
                        disabled={entregaEstado !== "INI"}
                        maxLength="5"
                        className="form-control"
                        value={repartidor}
                        onChange={(e) =>
                          this.setState({
                            ...this.state,
                            repartidor: e.target.value
                              .substr(0, 5)
                              .toUpperCase(),
                          })
                        }
                      ></input>
                    </div>
                  </React.Fragment>
                )}
                <div className="pedido-detail--edicion">
                  <label>Teléfono:</label>
                  <input
                    disabled={entregaEstado !== "INI"}
                    className="form-control"
                    defaultValue={pedido.celular}
                    onChange={(e) =>
                      this.setState({
                        ...this.state,
                        celular: e.target.value,
                      })
                    }
                  ></input>
                </div>
                <div className="pedido-detail--edicion">
                  <label>Comentarios internos:</label>
                  <textarea
                    disabled={entregaEstado !== "INI"}
                    className="form-control"
                    defaultValue={pedido.comentarioInterno}
                    onChange={(e) =>
                      this.setState({
                        ...this.state,
                        comentarioInterno: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div className="pedido-detail--edicion">
                  <button
                    disabled={entregaEstado !== "INI"}
                    title="Actualizar datos"
                    onClick={() => this.updateDireccion()}
                    class="btn btn-info"
                  >
                    Actualizar
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </div>

                {pedido.conEntrega && pedido.direccion && (
                  <iframe
                    width="300"
                    height="300"
                    frameBorder="0"
                    src={
                      "https://www.google.com/maps/embed/v1/place?key=AIzaSyCh0CejOsqJPPExI64OAx_66Qq78zcaAgY&q=" +
                      pedido.direccion
                    }
                    allowFullScreen
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
                <th className="d-none d-md-table-cell cell-right col-unitario">
                  P. Unit.
                </th>
                <th className="d-none d-md-table-cell cell-right col-total">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {itemsPedido && (
                <tr className="subtotales">
                  <td colSpan="4" className="d-none d-md-table-cell">
                    Pedido Mercado Territorial y Productores Locales
                  </td>
                  <td colSpan="4" className="d-md-none">
                    Pedido M.T. y Productores Locales
                  </td>
                </tr>
              )}
              {itemsPedido.map(
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
                  let cssName = "";
                  if (pedido.estado > 0) {
                    // Pago procesado
                    if (pago != null) {
                      // Pago con datos
                      if (pago === 0) {
                        cssName = "bg-warning";
                      } else {
                        if (pago != precio * cantidad) {
                          cssName = "bg-primary";
                        }
                      }
                    } else {
                      if (producto.anulado) {
                        cssName = "bg-danger";
                      }
                    }
                  } else {
                    // Pago NO procesado
                    if (producto.anulado) {
                      cssName = "bg-danger";
                    } else {
                      if (pago === 0) {
                        cssName = "bg-warning";
                      } else {
                        if (pago != precio * cantidad) {
                          cssName = "bg-primary";
                        }
                      }
                    }
                  }

                  return (
                    <tr key={index} className={cssName}>
                      <td className="pedido-detail-mobile d-table-cell d-md-none">
                        <div class="row2">
                          <div class="pedido-detail-item-title col">
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
                            <tr className={cssName}>
                              <td>{cantidad}</td>
                              <td className="cell-right">
                                ${producto.precio.toFixed(2)}
                              </td>
                              <td className="cell-right">
                                <NumberFormat
                                  name={_id}
                                  disabled={
                                    entregaEstado !== "INI" ||
                                    pedido.estado > 1 ||
                                    (producto.anulado && pago == null)
                                  }
                                  onChange={this.onPagoChange}
                                  thousandSeparator={false}
                                  value={
                                    producto.anulado && pago == null
                                      ? null
                                      : pago
                                  }
                                  allowNegative={false}
                                  prefix={"$"}
                                  className="form-control field-pago"
                                  placeholder="$0.00"
                                />
                                {entregaEstado == "INI" && pedido.estado <= 1 && (
                                  <React.Fragment>
                                    {(pago == precio * cantidad ||
                                      pago == null) && (
                                      <button
                                        disabled={
                                          producto.anulado && pago == null
                                        }
                                        title="Volver al valor inicial"
                                        onClick={() => this.onPagoCero(_id)}
                                        class="btn btn-danger btn-reset-pago"
                                      >
                                        <FontAwesomeIcon icon={faWindowClose} />
                                      </button>
                                    )}
                                    {pago != precio * cantidad && pago != null && (
                                      <button
                                        disabled={
                                          producto.anulado && pago == null
                                        }
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
                            pedido.estado > 1 ||
                            (producto.anulado && pago == null)
                          }
                          onChange={this.onPagoChange}
                          thousandSeparator={false}
                          allowNegative={false}
                          value={producto.anulado && pago == null ? null : pago}
                          prefix={"$"}
                          className="form-control field-pago"
                          placeholder="$0.00"
                        />
                        {entregaEstado == "INI" && pedido.estado <= 1 && (
                          <React.Fragment>
                            {(pago == precio * cantidad || pago == null) && (
                              <button
                                disabled={producto.anulado && pago == null}
                                title="Volver al valor inicial"
                                onClick={() => this.onPagoCero(_id)}
                                class="btn btn-danger btn-reset-pago"
                              >
                                <FontAwesomeIcon icon={faWindowClose} />
                              </button>
                            )}
                            {pago != precio * cantidad && pago != null && (
                              <button
                                disabled={producto.anulado && pago == null}
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
              {itemsPedido && (
                <React.Fragment>
                  <tr>
                    <td
                      colSpan="4"
                      className="cell-right d-none d-md-table-cell  "
                    >
                      <div className="form-group">
                        <label>
                          <b>Subtotal M.T. y P.L.:</b>
                        </label>
                        <NumberFormat
                          disabled={true}
                          thousandSeparator={false}
                          value={totalPedidos}
                          prefix={"$"}
                          className="form-control"
                        />
                      </div>
                    </td>
                    <td
                      colSpan="3"
                      className="cell-right d-table-cell d-md-none "
                    >
                      <div className="form-group">
                        <label>
                          <b>Subtotal M.T. y P.L.:</b>
                        </label>
                        <NumberFormat
                          disabled={true}
                          thousandSeparator={false}
                          value={totalPedidos}
                          prefix={"$"}
                          className="form-control"
                        />
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              )}
              {itemsAlmacen && (
                <tr className="subtotales">
                  <td colSpan="4">Pedido de Almacén</td>
                </tr>
              )}
              {itemsAlmacen.map(
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
                  let cssName = "";
                  if (pedido.estado > 0) {
                    // Pago procesado
                    if (pago != null) {
                      // Pago con datos
                      if (pago === 0) {
                        cssName = "bg-warning";
                      } else {
                        if (pago != precio * cantidad) {
                          cssName = "bg-primary";
                        }
                      }
                    } else {
                      // Pago sin datos
                      if (producto.anulado) {
                        cssName = "bg-danger";
                      }
                    }
                  } else {
                    // Pago NO procesado
                    if (producto.anulado) {
                      cssName = "bg-danger";
                    } else {
                      if (pago === 0) {
                        cssName = "bg-warning";
                      } else {
                        if (pago != precio * cantidad) {
                          cssName = "bg-primary";
                        }
                      }
                    }
                  }

                  return (
                    <tr key={index} className={cssName}>
                      <td className="pedido-detail-mobile d-table-cell d-md-none">
                        <div class="row2">
                          <div class="pedido-detail-item-title col almacen">
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
                            <tr className={cssName}>
                              <td>{cantidad}</td>
                              <td className="cell-right">
                                ${producto.precio.toFixed(2)}
                              </td>
                              <td className="cell-right">
                                <NumberFormat
                                  name={_id}
                                  disabled={
                                    entregaEstado !== "INI" ||
                                    pedido.estado > 1 ||
                                    (producto.anulado && pago == null)
                                  }
                                  onChange={this.onPagoChange}
                                  thousandSeparator={false}
                                  value={
                                    producto.anulado && pago == null
                                      ? null
                                      : pago
                                  }
                                  allowNegative={false}
                                  prefix={"$"}
                                  className="form-control field-pago"
                                  placeholder="$0.00"
                                />
                                {entregaEstado == "INI" && pedido.estado <= 1 && (
                                  <React.Fragment>
                                    {(pago == precio * cantidad ||
                                      pago == null) && (
                                      <button
                                        disabled={
                                          producto.anulado && pago == null
                                        }
                                        title="Volver al valor inicial"
                                        onClick={() => this.onPagoCero(_id)}
                                        class="btn btn-danger btn-reset-pago"
                                      >
                                        <FontAwesomeIcon icon={faWindowClose} />
                                      </button>
                                    )}
                                    {pago != precio * cantidad && pago != null && (
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
                        {/* <div className="space"></div> */}
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
                            pedido.estado > 1 ||
                            (producto.anulado && pago == null)
                          }
                          onChange={this.onPagoChange}
                          thousandSeparator={false}
                          allowNegative={false}
                          value={producto.anulado && pago == null ? null : pago}
                          prefix={"$"}
                          className="form-control field-pago"
                          placeholder="$0.00"
                        />
                        {entregaEstado == "INI" && pedido.estado <= 1 && (
                          <React.Fragment>
                            {(pago == precio * cantidad || pago == null) && (
                              <button
                                disabled={producto.anulado && pago == null}
                                title="Volver al valor inicial"
                                onClick={() => this.onPagoCero(_id)}
                                class="btn btn-danger btn-reset-pago"
                              >
                                <FontAwesomeIcon icon={faWindowClose} />
                              </button>
                            )}
                            {pago != precio * cantidad && pago != null && (
                              <button
                                disabled={producto.anulado && pago == null}
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
              {itemsAlmacen && (
                <React.Fragment>
                  <tr>
                    <td
                      colSpan="4"
                      className="cell-right d-none d-md-table-cell  "
                    >
                      <div className="form-group">
                        <label>
                          <b>Subtotal almacén:</b>
                        </label>
                        <NumberFormat
                          disabled={true}
                          thousandSeparator={false}
                          value={totalAlmacen}
                          prefix={"$"}
                          className="form-control"
                        />
                      </div>
                    </td>
                    <td
                      colSpan="3"
                      className="cell-right d-table-cell d-md-none "
                    >
                      <div className="form-group">
                        <label>
                          <b>Subtotal almacén:</b>
                        </label>
                        <NumberFormat
                          disabled={true}
                          thousandSeparator={false}
                          value={totalAlmacen}
                          prefix={"$"}
                          className="form-control"
                        />
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              )}
              <tr className="subtotales">
                <td colSpan="4">Varios</td>
              </tr>
              <tr>
                <td colSpan="4" className="cell-right d-none d-md-table-cell">
                  <div className="form-group">
                    <label for="almacenD">
                      <b>Total varios:</b>
                    </label>
                    <NumberFormat
                      id="almacenD"
                      disabled={entregaEstado !== "INI" || pedido.estado > 1}
                      onChange={this.onVariosChange}
                      thousandSeparator={false}
                      allowNegative={false}
                      value={varios}
                      prefix={"$"}
                      className="form-control"
                      placeholder="$0.00"
                    />
                  </div>
                </td>
                <td colSpan="3" className="cell-right d-table-cell d-md-none">
                  <div className="form-group">
                    <label for="almacenM">
                      <b>Total varios:</b>
                    </label>
                    <NumberFormat
                      id="almacenM"
                      disabled={entregaEstado !== "INI" || pedido.estado > 1}
                      onChange={this.onVariosChange}
                      thousandSeparator={false}
                      allowNegative={false}
                      value={varios}
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
            {entregaEstado === "INI" && (
              <div className="pedido-detalle-botones">
                <div className="pedido-detalle-botones--left">
                  <button
                    onClick={() =>
                      this.setState({
                        ...this.state,
                        pressEntregado: true,
                      })
                    }
                    disabled={pedido.estado === 3}
                    class="btn btn-lg btn-success"
                    title="El pedido fue entregado."
                  >
                    <FontAwesomeIcon icon={faCheckSquare} /> Entregado
                  </button>
                  <button
                    onClick={() =>
                      this.setState({
                        ...this.state,
                        pressPreparado: true,
                      })
                    }
                    disabled={pedido.estado > 1}
                    class="btn btn-lg btn-info"
                  >
                    <FontAwesomeIcon icon={faDolly} /> Preparado
                  </button>
                  <button
                    onClick={() =>
                      this.setState({
                        ...this.state,
                        pressGuardado: true,
                      })
                    }
                    disabled={pedido.estado > 1}
                    class="btn btn-lg btn-warning"
                  >
                    <FontAwesomeIcon icon={faSave} /> Guardado
                  </button>
                </div>
                <div className="pedido-detalle-botones--right">
                  <button
                    onClick={() =>
                      this.setState({
                        ...this.state,
                        pressAnulado: true,
                      })
                    }
                    disabled={pedido.estado === 0}
                    class="btn btn-lg btn-danger mr-1"
                  >
                    <FontAwesomeIcon icon={faTimes} /> Anular
                  </button>
                  <button
                    title="Volver"
                    onClick={() => this.props.history.push("/pedidos")}
                    class="btn btn-lg btn-primary ml-1"
                  >
                    <FontAwesomeIcon icon={faUndo} /> Volver
                  </button>
                </div>
              </div>
            )}
          </React.Fragment>
        )}
        {(!(user.isAdmin || user.isAdminPed) || entregaEstado !== "INI") && (
          <div className="pedido-detalle-botones">
            <button
              title="Volver"
              onClick={() => this.props.history.push("/pedidos")}
              class="btn btn-lg btn-primary mt-2 mr-2"
            >
              <FontAwesomeIcon icon={faUndo} /> Volver
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default PedidoDetail;
