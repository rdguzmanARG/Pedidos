import React, { Component } from "react";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";
import {
  pedido_getAll,
  pedido_getLast,
  pedido_notificado,
} from "../services/pedidoService";
import auth from "../services/authService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTruck,
  faWalking,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Moment from "react-moment";
import removeAccents from "../Utils/helpers";

class PedidosList extends Component {
  state = {
    isLoading: true,
    pedidos: [],
    last: null,
    intervalId: null,
    entrega: null,
  };

  componentDidMount() {
    pedido_getAll()
      .then((res) => {
        if (res.status === 200) {
          const { pedidos, last, entrega } = res.data;
          this.setState({ pedidos, last, isLoading: false, entrega });
          const intervalId = setInterval(this.updatePedidosList, 1000 * 60);
          this.setState({ ...this.state, intervalId: intervalId });
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

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  updatePedidosList = () => {
    if (this.state.last != null) {
      pedido_getLast(this.state.last)
        .then((res) => {
          if (res.status == 200 && res.data) {
            // Validate if has new data
            if (res.data.pedidos.length > 0) {
              const newPedidos = res.data.pedidos;

              if (this.state.entrega.estado == "INI") {
                const pedidos = this.state.pedidos.filter(function (item) {
                  return !newPedidos.map((p) => p._id).includes(item._id)
                    ? true
                    : false;
                });
                this.setState({
                  ...this.state,
                  pedidos: [...pedidos, ...newPedidos],
                  last: res.data.last,
                  entrega: res.data.entrega,
                });
                const restantes =
                  this.state.pedidos.length -
                  this.state.pedidos.filter((f) => f.estado === 3).length;
                const entregados = newPedidos.filter((p) => p.estado === 3)
                  .length;

                if (entregados > 0) {
                  toast.info(
                    <div>
                      <h2>Atención:</h2>
                      {entregados == 1 && (
                        <div>
                          <b>{entregados}</b> nuevo pedido entregado
                          recientemente.
                        </div>
                      )}
                      {entregados > 1 && (
                        <div>
                          <b>{entregados}</b> nuevos pedidos entregados
                          recientemente.
                        </div>
                      )}
                      {restantes == 0 && (
                        <div>
                          <b>Felicitaciones</b>, no quedan más pedidos por
                          entregar.
                        </div>
                      )}
                      {restantes > 0 && (
                        <div>Restan {restantes} por entregar.</div>
                      )}
                    </div>
                  );
                }
              } else {
                this.setState({
                  ...this.state,
                  pedidos: [...newPedidos],
                  last: res.data.last,
                  entrega: res.data.entrega,
                });
                toast.info("Se han importado datos recientemente.");
              }
            } else {
              this.setState({
                ...this.state,
                last: res.data.last,
                entrega: res.data.entrega,
              });
            }
          }
        })
        .catch(() => {
          clearInterval(this.state.intervalId);
        });
    }
  };

  notify = (pedido) => {
    pedido_notificado(pedido._id).then(({ data }) => {
      const pedidos = this.state.pedidos.filter(function (p) {
        return p._id != data.idPedido;
      });
      const pedido = this.state.pedidos.filter(function (p) {
        return p._id == data.idPedido;
      });
      if (pedido.length === 1) {
        pedido[0].notificado = true;
        this.setState({ ...this.state, pedidos: [...pedidos, pedido[0]] });
      }
    });
    window.open(
      "https://api.whatsapp.com/send?phone=+549" +
        pedido.celFormat +
        "&text=Su pedido ha sido procesado, puede ingresar al Sitio Web del *NODO Temperley* para consultar su estado actual.%0a%0D%0Ahttps://nodo-temperley.azurewebsites.net/mi-pedido/" +
        pedido._id.toString() +
        "%0D%0AMuchas Gracias.",
      "_blank"
    );
  };

  render() {
    const { pedidos, isLoading, entrega } = this.state;
    const { text, pendientes, conEntrega, sinEntrega } = this.props.filter;

    const pedidosFilteres = pedidos
      .filter(
        (f) =>
          removeAccents(f.nombre + " " + f.apellido).includes(
            removeAccents(text)
          ) ||
          (text === "*" && f.comentarios)
      )
      .filter((f) => !pendientes || f.estado !== 3)
      .filter((f) => !conEntrega || f.conEntrega)
      .filter((f) => !sinEntrega || !f.conEntrega);

    const sinTurno = pedidosFilteres.filter(
      (f) => !f.conEntrega && f.turno == null && f.estado < 3
    ).length;

    const sinAsignar = pedidosFilteres.filter(
      (f) => f.conEntrega && f.repartidor == null && f.estado < 3
    ).length;

    if (isLoading) {
      return (
        <div id="overlay">
          <Loader type="Oval" color="#025f17" height={100} width={100} />
        </div>
      );
    }
    const cantidad = pedidosFilteres.length;
    const restantes =
      cantidad - pedidosFilteres.filter((f) => f.estado === 3).length;
    return (
      <div className="pedidos-list">
        <div class="input-group mb-2 mt-2">
          <input
            type="text"
            class="form-control form-control-lg"
            placeholder="Ingresar texto para buscar..."
            value={this.props.filter.text}
            onChange={(e) => this.props.onChangeFilter(e.target.value)}
          />
        </div>
        <div class="input-group mb-2 mt-2 ">
          <div class="form-check mr-2">
            <input
              class="form-check-input"
              type="checkbox"
              checked={pendientes}
              id="pendientes"
              onChange={(e) => this.props.onChangeFilter("filter-pendientes")}
            ></input>
            <label class="form-check-label" for="pendientes">
              Pendientes de entrega
            </label>
          </div>
        </div>
        <div class="input-group mb-2 mt-2 ">
          <div class="form-check mr-2">
            <input
              class="form-check-input"
              type="radio"
              name="entrega"
              id="filterConSinEntrega"
              checked={!conEntrega && !sinEntrega}
              onChange={(e) =>
                this.props.onChangeFilter("filter-con-sin-entrega")
              }
            ></input>
            <label class="form-check-label" for="filterConSinEntrega">
              Todos
            </label>
          </div>
          <div class="form-check mr-2">
            <input
              class="form-check-input"
              type="radio"
              name="entrega"
              id="filterConEntrega"
              checked={conEntrega}
              onChange={(e) => this.props.onChangeFilter("filter-con-entrega")}
            ></input>
            <label class="form-check-label" for="filterConEntrega">
              Con entrega
            </label>
          </div>
          <div class="form-check mr-2">
            <input
              class="form-check-input"
              type="radio"
              name="entrega"
              id="filterSinEntrega"
              checked={sinEntrega}
              onChange={(e) => this.props.onChangeFilter("filter-sin-entrega")}
            ></input>
            <label class="form-check-label" for="filterSinEntrega">
              Sin entrega
            </label>
          </div>
        </div>
        <div className="pedidos-list--header">
          <span>
            <b>
              {<Moment format="DD/MM HH:mm">{entrega.fechaImportacion}</Moment>}
            </b>
          </span>
          <span>
            <b>
              Pend. ({restantes}/{cantidad})
            </b>
          </span>
        </div>
        <table className="table table-striped table-sm table-pedidos">
          <thead className="thead-dark">
            <tr>
              <th>Nombre y Apellido</th>
              <th className="d-none d-sm-table-cell">Teléfono</th>
              <th className="d-none d-md-table-cell">Procesado por</th>
              <th className="cell-icon"></th>
              <th className="cell-icon text-center">
                {sinEntrega ? <span>S.T.:{sinTurno}</span> : <span></span>}
                {conEntrega ? <span>S.R.:{sinAsignar}</span> : <span></span>}
              </th>
              <th className="cell-icon"></th>
            </tr>
          </thead>
          <tbody>
            {pedidosFilteres
              .sort((a, b) => {
                if (sinEntrega) {
                  const turnoA = a.turno
                    ? a.turno.dia + a.turno.hora
                    : "zzz" + a.nombre.toLowerCase() + a.apellido.toLowerCase();

                  const turnoB = b.turno
                    ? b.turno.dia + b.turno.hora
                    : "zzz" + b.nombre.toLowerCase() + b.apellido.toLowerCase();

                  if (turnoA < turnoB) {
                    return -1;
                  }
                  if (turnoA > turnoB) {
                    return 1;
                  }

                  // names must be equal
                  return 0;
                } else {
                  if (conEntrega) {
                    const repaA = a.repartidor
                      ? a.repartidor +
                        a.nombre.toLowerCase() +
                        a.apellido.toLowerCase()
                      : "zzz" +
                        a.nombre.toLowerCase() +
                        a.apellido.toLowerCase();

                    const repaB = b.repartidor
                      ? b.repartidor +
                        b.nombre.toLowerCase() +
                        b.apellido.toLowerCase()
                      : "zzz" +
                        b.nombre.toLowerCase() +
                        b.apellido.toLowerCase();

                    if (repaA < repaB) {
                      return -1;
                    }
                    if (repaA > repaB) {
                      return 1;
                    }

                    // names must be equal
                    return 0;
                  } else {
                    var nameA =
                      a.nombre.toLowerCase() + a.apellido.toLowerCase(); // ignore upper and lowercase
                    var nameB =
                      b.nombre.toLowerCase() + b.apellido.toLowerCase(); // ignore upper and lowercase

                    if (nameA < nameB) {
                      return -1;
                    }
                    if (nameA > nameB) {
                      return 1;
                    }

                    // names must be equal
                    return 0;
                  }
                }
              })
              .map((p) => {
                let celularFormat = p.celular.replace(/[^\d]/g, "");
                if (celularFormat.length < 8) {
                  celularFormat = "";
                }

                if (celularFormat.startsWith("0")) {
                  celularFormat = celularFormat.substr(1);
                }

                if (celularFormat.startsWith("15")) {
                  celularFormat = "11" + celularFormat.substr(2);
                }
                if (
                  !celularFormat.startsWith("11") &&
                  celularFormat.length > 2
                ) {
                  celularFormat = "11" + celularFormat;
                }

                return { ...p, celFormat: celularFormat };
              })
              .map((p) => (
                <tr
                  key={p._id}
                  className={
                    p.estado === 3
                      ? "bg-entregado"
                      : p.estado === 2
                      ? "bg-listo"
                      : p.estado === 1
                      ? "bg-guardado"
                      : ""
                  }
                >
                  <td>
                    <b className="mr-1">
                      {p.nombre}, {p.apellido}
                    </b>
                    {p.emailEnviado > 1 && (
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="text-danger"
                      />
                    )}
                  </td>
                  <td className="d-none d-sm-table-cell">
                    <a href={"tel:+" + p.celular}>{p.celular}</a>{" "}
                  </td>
                  <td className="d-none d-md-table-cell">
                    {p.estado > 0 ? p.usuarioMod.toUpperCase() : ""}
                  </td>
                  <td className="cell-icon">
                    {p.celFormat != "" && (
                      <a href="#" onClick={() => this.notify(p)}>
                        <img
                          className={
                            p.notificado ? "whatsapp selected" : "whatsapp"
                          }
                          src="/images/whatsapp.png"
                        ></img>
                      </a>
                    )}
                    {p.celFormat == "" && (
                      <span>
                        {p._id.substr(p._id.length - 5).toUpperCase()}
                      </span>
                    )}
                  </td>
                  <td className="cell-icon">
                    {conEntrega && (
                      <React.Fragment>
                        {p.repartidor && <b>{p.repartidor}</b>}
                        {!p.repartidor && <FontAwesomeIcon icon={faTruck} />}
                      </React.Fragment>
                    )}
                    {sinEntrega && (
                      <React.Fragment>
                        {p.turno && <b>{p.turno.hora}</b>}
                        {!p.turno && <FontAwesomeIcon icon={faWalking} />}
                      </React.Fragment>
                    )}
                    {!sinEntrega && !conEntrega && (
                      <React.Fragment>
                        {!p.conEntrega && <FontAwesomeIcon icon={faWalking} />}
                        {p.conEntrega && p.direccion && (
                          <FontAwesomeIcon
                            icon={faTruck}
                            className="text-primary"
                          />
                        )}
                        {p.conEntrega && !p.direccion && (
                          <FontAwesomeIcon
                            icon={faTruck}
                            className="text-danger"
                          />
                        )}
                      </React.Fragment>
                    )}
                  </td>
                  <td className="cell-icon">
                    <Link to={`/pedidos/ver/${p._id}`}>
                      <button
                        title="Pedido sin entrega"
                        type="button"
                        class="btn btn-success"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default PedidosList;
