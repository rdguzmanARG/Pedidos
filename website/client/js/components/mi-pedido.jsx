import React, { Component } from "react";
import { pedido_get, pedido_getByCode } from "../services/pedidoService";
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
  };

  componentDidMount() {
    ReactGA.pageview(window.location.pathname + window.location.search);

    let code = this.props.match.params.code;
    if (code != undefined && code.length > 5) {
      pedido_get(code)
        .then(({ data }) => {
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

  arrSum = (arr) => arr.reduce((a, b) => a + b, 0);

  render() {
    const { errorMessage, pedido, search } = this.state;
    if (search == null) return null;

    const totalPedido = !pedido
      ? 0
      : pedido.entregado
      ? pedido.totalPedido
      : this.arrSum(
          pedido.items.filter((f) => !f.producto.anulado).map((m) => m.pago)
        );

    const total =
      totalPedido + (pedido && pedido.totalAlmacen ? pedido.totalAlmacen : 0);

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
        <Element name="myScrollToElement"></Element>
        {pedido != null && (
          <div className="container pl-0 pr-0">
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
                    <th className="d-none d-md-table-cell text-right">
                      P. Unitario
                    </th>
                    <th className="d-none d-md-table-cell text-right">Total</th>
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
                                  <th className="text-right">P. Unit.</th>
                                  <th className="text-right">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                  className={
                                    producto.anulado ? "bg-danger" : ""
                                  }
                                >
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
                  <tr className="sub-totales">
                    <td
                      colSpan="4"
                      className="text-right d-none d-md-table-cell  "
                    >
                      Total almacén:
                      <span className="ml-2">
                        $
                        {pedido.totalAlmacen
                          ? pedido.totalAlmacen.toFixed(2)
                          : "0.00"}
                      </span>
                    </td>
                    <td
                      colSpan="3"
                      className="text-right d-table-cell d-md-none "
                    >
                      Total almacén:
                      <span className="ml-2">
                        $
                        {pedido.totalAlmacen
                          ? pedido.totalAlmacen.toFixed(2)
                          : "0.00"}
                      </span>
                    </td>
                  </tr>
                  <tr className="totales">
                    <td
                      colSpan="4"
                      className="text-right d-none d-md-table-cell  "
                    >
                      Total: <span className="ml-2">${total.toFixed(2)}</span>
                    </td>
                    <td
                      colSpan="3"
                      className="text-right d-table-cell d-md-none "
                    >
                      Total:
                      <span className="ml-2">${total.toFixed(2)}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default MiPedido;
