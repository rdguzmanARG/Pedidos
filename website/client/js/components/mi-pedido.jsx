import React, { Component } from "react";
import { pedido_get, pedido_getByCode } from "../services/pedidoService";
import { entrega_getCurrent } from "../services/entregaService";
import {
  turno_confirmar,
  turno_anular,
  turno_disponibles,
} from "../services/turnoService";
import Scroll from "react-scroll";
import ReactGA from "react-ga";
import moment from "moment";
const Element = Scroll.Element;
const scroller = Scroll.scroller;

class MiPedido extends Component {
  state = {
    search: { email: "", code: "" },
    pedido: null,
    errorMessage: null,
    enviado: false,
    estado: "",
    turnos: null,
    dias: null,
    dia: null,
    idTurno: null,
    errorTurno: null,
  };

  validarHorarios() {
    turno_disponibles()
      .then(({ data }) => {
        this.setState({ ...this.state, turnos: data.turnos, dias: data.dias });
      })
      .catch((ex) => {
        this.setState({
          errorMessage: ex.response.data.message,
          pedido: null,
        });
      });
  }

  componentDidMount() {
    ReactGA.pageview(window.location.pathname + window.location.search);

    entrega_getCurrent().then((res) => {
      this.setState({ estado: res.data.estado });
      if (res.data.estado === "INI") {
        let code = this.props.match.params.code;
        if (code != undefined && code.length > 5) {
          pedido_get(code)
            .then(({ data }) => {
              // Si es Sin Entrega tengo que traer los horarios
              if (!data.conEntrega) {
                this.validarHorarios();
              }
              console.log(data);
              code = code.substr(code.length - 5).toUpperCase();
              this.setState({
                ...this.state,
                pedido: data,
                search: { code, email: data.email },
              });
              scroller.scrollTo("myScrollToElement", {
                duration: 1000,
                delay: 100,
                smooth: true,
                offset: -65, // Scrolls to element + 50 pixels down the page
              });
            })
            .catch((ex) => {
              this.setState({
                errorMessage: ex.response.data.message,
                pedido: null,
              });
            });
        }
      }
    });
  }

  onFieldChange = (e) => {
    const search = { ...this.state.search };
    search[e.target.name] = e.target.value;
    this.setState({ ...this.state, search, errorMessage: "" });
  };

  submitForm = (e) => {
    const { search } = this.state;
    ReactGA.event({
      category: "Pedido",
      action: "Consultar",
    });
    e.preventDefault();
    pedido_getByCode(search.email, search.code.toUpperCase())
      .then((res) => {
        // Si es Sin Entrega tengo que traer los horarios
        if (!res.data.conEntrega) {
          this.validarHorarios();
        }
        this.setState({ ...this.state, pedido: res.data, errorMessage: null });
        scroller.scrollTo("myScrollToElement", {
          duration: 1000,
          delay: 100,
          smooth: true,
          offset: -65, // Scrolls to element + 50 pixels down the page
        });
      })
      .catch((ex) => {
        if (ex.response.status === 404) {
          this.setState({
            errorMessage: ex.response.data.message,
            pedido: null,
          });
        } else {
          this.setState({
            errorMessage: "No se pudieron recuperar los datos.",
            pedido: null,
          });
        }
      });
  };

  selectedDate = (date) => {
    this.setState({
      ...this.state,
      dia: date === "" ? null : date,
      errorTurno: null,
    });
  };

  selectedTime = (idTurno) => {
    this.setState({
      ...this.state,
      idTurno: idTurno === "" ? null : idTurno,
      errorTurno: null,
    });
  };
  removeTurno = () => {
    const { pedido } = this.state;
    turno_anular(pedido.turno._id, { idPedido: pedido._id })
      .then(({ data }) => {
        const pedido = this.state.pedido;
        pedido.turno = null;
        this.setState({ ...this.state, pedido, idTurno: null, dia: null });
        this.validarHorarios();
      })
      .catch((ex) => {
        if (ex.response.status === 404) {
          this.setState({
            errorMessage: ex.response.data.message,
            pedido: null,
          });
        } else {
          this.setState({
            errorMessage: "No se pudieron recuperar los datos.",
            pedido: null,
          });
        }
      });
  };
  setTurno = () => {
    const { dia, idTurno, pedido } = this.state;
    if (dia == null || idTurno == null) {
      this.setState({
        ...this.state,
        errorTurno: "Debe completar día y hora para retirar su pedido.",
      });
      return;
    }

    turno_confirmar(idTurno, { idPedido: pedido._id })
      .then(({ data }) => {
        const pedido = this.state.pedido;
        pedido.turno = data;
        this.setState({ ...this.state, pedido });
      })
      .catch((ex) => {
        if (ex.response.status === 404) {
          this.setState({
            errorMessage: ex.response.data.message,
            pedido: null,
          });
        } else {
          this.setState({
            errorMessage: "No se pudieron recuperar los datos.",
            pedido: null,
          });
        }
      });
  };

  arrSum = (arr) => arr.reduce((a, b) => a + b, 0);

  render() {
    const {
      errorMessage,
      errorTurno,
      pedido,
      search,
      estado,
      turnos,
      dias,
    } = this.state;
    if (search == null) return null;

    const totalPedido = !pedido
      ? 0
      : pedido.estado > 0
      ? pedido.totalPedido
      : this.arrSum(
          pedido.items.filter((f) => !f.producto.almacen).map((m) => m.pago)
        );
    const totalAlmacen = !pedido
      ? 0
      : pedido.estado > 0
      ? pedido.totalAlmacen
      : this.arrSum(
          pedido.items.filter((f) => f.producto.almacen).map((m) => m.pago)
        );

    const total = pedido ? totalPedido + totalAlmacen + pedido.varios : 0;
    const itemsPedido = pedido
      ? pedido.items.filter((p) => !p.producto.almacen)
      : null;
    const itemsAlmacen = pedido
      ? pedido.items.filter((p) => p.producto.almacen)
      : null;

    return (
      <div className="mi-pedido">
        <div class="container pl-0 pr-0">
          <div className="hero">
            <div className="herp-box">
              <h2 className="hero-title">Consulta tus pedidos</h2>
              <p className="hero-text">
                Si hiciste un Pedido con entrega a domicilio, recibiras tu
                codigo de pedido para consultar
              </p>
            </div>
          </div>
        </div>
        {estado === "INI" && (
          <div class="container pl-0 pr-0">
            <div className="box-find">
              <form onSubmit={this.submitForm}>
                <div className="box-find--input">
                  <h2>Correo</h2>
                  <input
                    className="email"
                    type="email"
                    name="email"
                    defaultValue={search.email}
                    required
                    placeholder="Ingresa el correo.."
                    onChange={this.onFieldChange}
                  ></input>
                </div>
                <div className="box-find--input">
                  <h2>Código</h2>
                  <input
                    className="codigo"
                    type="text"
                    name="code"
                    defaultValue={search.code}
                    placeholder="Código"
                    required
                    onChange={this.onFieldChange}
                  ></input>
                </div>
                <div className="box-find--input">
                  <button class="btn btn-primary" type="submit">
                    Consultar
                  </button>
                </div>
              </form>
              {errorMessage && (
                <div class="alert alert-danger text-center m-4" role="alert">
                  {errorMessage}
                </div>
              )}
            </div>
          </div>
        )}
        <Element name="myScrollToElement"></Element>
        {estado != "INI" && (
          <div className="container">
            <div>
              <h2 className="title">Vecinxs</h2>
              <div className="text">
                <p>
                  Podrás consultar el estado de tu pedido desde aquí, una vez
                  realizado tu pedido te enviaremos por correo electrónico los
                  datos para que puedas consultarlo.
                </p>
                <p>Desde ya, muchas gracias.</p>
              </div>
            </div>
          </div>
        )}
        {pedido != null && (
          <div className="container">
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
                  <div className="col-md-6">
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
                      Entrega a domicilio:{" "}
                      <b>{pedido.conEntrega ? "Si" : "No"}</b>{" "}
                    </div>
                    {pedido.direccion && (
                      <div>
                        Dirección: <b>{pedido.direccion}</b>{" "}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    {pedido.comentarios && (
                      <div>
                        Comentarios: <b>{pedido.comentarios}</b>{" "}
                      </div>
                    )}
                    {turnos != null && !pedido.conEntrega && (
                      <div className="horarios-box">
                        <div className="horarios-box--title">
                          Horario de retiro
                        </div>
                        {pedido.turno && (
                          <React.Fragment>
                            <div className="horarios-box--seleccionado">
                              <span>Día:</span>
                              <span>
                                {moment(pedido.turno.dia).format("DD/MM/YYYY")}
                              </span>
                              <span>Hora:</span>
                              <span>{pedido.turno.hora}</span>
                            </div>
                            <button
                              className="btn btn-danger"
                              onClick={() => this.removeTurno()}
                            >
                              Anular Horario
                            </button>
                          </React.Fragment>
                        )}
                        {!pedido.turno && turnos && turnos.length > 0 && (
                          <React.Fragment>
                            <div className="horarios-box--seleccion">
                              <span>Día</span>
                              <select
                                onChange={(e) =>
                                  this.selectedDate(e.target.value)
                                }
                              >
                                <option value={null}></option>
                                {dias.map((d) => (
                                  <option
                                    key={moment(d.dia).format("DD/MM/YYYY")}
                                    value={moment(d.dia).format("DD/MM/YYYY")}
                                  >
                                    {moment(d.dia).format("DD/MM/YYYY")}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="horarios-box--seleccion">
                              <span>Hora</span>
                              <select
                                onChange={(e) =>
                                  this.selectedTime(e.target.value)
                                }
                              >
                                <option value={null}></option>
                                {turnos
                                  .filter(
                                    (f) =>
                                      moment(f.dia).format("DD/MM/YYYY") ===
                                      this.state.dia
                                  )
                                  .map((d) => (
                                    <option key={d._id} value={d._id}>
                                      {d.hora}
                                    </option>
                                  ))}
                              </select>
                            </div>
                            {errorTurno && (
                              <div className="horario-error">{errorTurno}</div>
                            )}
                            <button
                              className="btn btn-success"
                              onClick={() => this.setTurno()}
                            >
                              Confirmar Horario
                            </button>
                          </React.Fragment>
                        )}
                        {!pedido.turno && (!turnos || turnos.length === 0) && (
                          <div>No hay turnos disponible en este momento.</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {(pedido.estado === 0 || pedido.estado === 1) && (
              <div class="alert alert-warning alert-estado" role="alert">
                <b>ATENCIÓN:</b> el pedido no fué procesado, algunos productos
                pueden no estar disponibles.
              </div>
            )}
            {pedido.estado === 2 && (
              <div class="alert alert-success alert-estado" role="alert">
                <b>ATENCIÓN:</b> el pedido fué procesado y está listo para
                retirar, puede acercarce a retirarlo en el horario seleccionado.
              </div>
            )}
            {pedido.estado === 3 && (
              <div class="alert alert-success alert-estado" role="alert">
                El pedido ya fué entregado, muchas gracias.
              </div>
            )}
            {pedido.items && (
              <table className="table ">
                <thead>
                  <tr className="main-header">
                    <th>Detalle del pedido</th>
                    <th className="d-none d-md-table-cell">Cantidad</th>
                    <th className="d-none d-md-table-cell text-right col-unitario">
                      P. Unitario
                    </th>
                    <th className="d-none d-md-table-cell text-right col-total">
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
                            cssName = "bg-danger";
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
                            cssName = "bg-danger";
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
                                  <th className="text-right">P. Unit.</th>
                                  <th className="text-right">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className={cssName}>
                                  <td>{cantidad}</td>
                                  <td className="text-right">
                                    ${producto.precio.toFixed(2)}
                                  </td>
                                  <td className="text-right">
                                    $
                                    {!producto.anulado && pago
                                      ? pago.toFixed(2)
                                      : "0.00"}
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
                          <td className="d-none d-md-table-cell text-right">
                            $
                            {precio == undefined
                              ? producto.precio.toFixed(2)
                              : precio.toFixed(2)}
                          </td>
                          <td className="d-none d-md-table-cell text-right">
                            $
                            {!producto.anulado && pago
                              ? pago.toFixed(2)
                              : "0.00"}
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
                            <span className="mr-2">Subtotal M.T. y P.L.:</span>
                            <b>${totalPedido.toFixed(2)}</b>
                          </div>
                        </td>
                        <td
                          colSpan="3"
                          className="cell-right d-table-cell d-md-none "
                        >
                          <div className="form-group">
                            <span className="mr-2">Subtotal M.T. y P.L.:</span>
                            <b>${totalPedido.toFixed(2)}</b>
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
                            cssName = "bg-danger";
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
                            cssName = "bg-danger";
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
                                  <th className="text-right">P. Unit.</th>
                                  <th className="text-right">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className={cssName}>
                                  <td>{cantidad}</td>
                                  <td className="text-right">
                                    ${producto.precio.toFixed(2)}
                                  </td>
                                  <td className="text-right">
                                    $
                                    {!producto.anulado && pago
                                      ? pago.toFixed(2)
                                      : "0.00"}
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
                          <td className="d-none d-md-table-cell text-right">
                            $
                            {precio == undefined
                              ? producto.precio.toFixed(2)
                              : precio.toFixed(2)}
                          </td>
                          <td className="d-none d-md-table-cell text-right">
                            $
                            {!producto.anulado && pago
                              ? pago.toFixed(2)
                              : "0.00"}
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
                            <span className="mr-2">Total almacén:</span>
                            <b>${totalAlmacen.toFixed(2)}</b>
                          </div>
                        </td>
                        <td
                          colSpan="3"
                          className="cell-right d-table-cell d-md-none "
                        >
                          <div className="form-group">
                            <span className="mr-2">Total almacén:</span>
                            <b>${totalAlmacen.toFixed(2)}</b>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  )}
                  <tr className="subtotales">
                    <td colSpan="4">Varios</td>
                  </tr>
                  <tr>
                    <td
                      colSpan="4"
                      className="cell-right d-none d-md-table-cell"
                    >
                      <div className="form-group">
                        <span className="mr-2">Total varios:</span>
                        <b>{pedido.varios.toFixed(2)}</b>
                      </div>
                    </td>
                    <td
                      colSpan="3"
                      className="cell-right d-table-cell d-md-none"
                    >
                      <div className="form-group">
                        <span className="mr-2">Total varios:</span>
                        <b>{pedido.varios.toFixed(2)}</b>
                      </div>
                    </td>
                  </tr>
                  <tr className="totales">
                    <td
                      colSpan="4"
                      className="cell-right d-none d-md-table-cell  "
                    >
                      Total ${total.toFixed(2)}
                    </td>
                    <td
                      colSpan="3"
                      className="cell-right d-table-cell d-md-none "
                    >
                      Total ${total.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}

            <div className="esquema-colores">
              <div className="esquema-colores--title">Esquema de colores:</div>
              <div className="esquema-colores--box">
                <div>
                  <span className="esquema-colores--anulado"></span>El producto
                  no esta disponible.
                </div>
                <div>
                  <span className="esquema-colores--cambio-precio"></span>
                  El total del producto tiene un ajuste en el precio.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default MiPedido;
