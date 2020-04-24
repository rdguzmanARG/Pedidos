import React, { Component } from "react";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";
import { pedido_getAll, pedido_getLast } from "../services/pedidoService";
import auth from "../services/authService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTruck, faWalking } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Moment from "react-moment";

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
          this.props.onGlobalError(ex.response.status);
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
                  this.state.pedidos.filter((f) => f.entregado).length;
                const entregados = newPedidos.filter((p) => p.entregado).length;
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

  render() {
    const { pedidos, isLoading, entrega } = this.state;
    const { text, pendientes, conEntrega, sinEntrega } = this.props.filter;

    const pedidosFilteres = pedidos
      .filter(
        (f) =>
          f.nombre.toLowerCase().includes(text.toLowerCase()) ||
          f.apellido.toLowerCase().includes(text.toLowerCase()) ||
          (text === "*" && f.comentarios)
      )
      .filter((f) => !pendientes || !f.entregado)
      .filter((f) => !conEntrega || f.conEntrega)
      .filter((f) => !sinEntrega || !f.conEntrega);

    if (isLoading) {
      return (
        <div id="overlay">
          <Loader type="Circles" color="#025f17" height={100} width={100} />
        </div>
      );
    }
    const cantidad = pedidosFilteres.length;
    const restantes =
      cantidad - pedidosFilteres.filter((f) => f.entregado).length;
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
              <th className="d-none d-md-table-cell">Entregado por</th>
              <th className="cell-icon"></th>
              <th className="cell-icon"></th>
              <th className="cell-icon"></th>
            </tr>
          </thead>
          <tbody>
            {pedidosFilteres
              .sort((a, b) => {
                var nameA = a.nombre.toLowerCase() + a.apellido.toLowerCase(); // ignore upper and lowercase
                var nameB = b.nombre.toLowerCase() + b.apellido.toLowerCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }

                // names must be equal
                return 0;
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
                <tr key={p._id} className={p.entregado ? "bg-entregado" : ""}>
                  <td>
                    {p.nombre}, {p.apellido} {p.comentarios ? "(*)" : ""}
                  </td>
                  <td className="d-none d-sm-table-cell">
                    <a href={"tel:+" + p.celular}>{p.celular}</a>{" "}
                  </td>
                  <td className="d-none d-md-table-cell">
                    {p.entregado ? p.usuarioMod.toUpperCase() : ""}
                  </td>
                  <td className="cell-icon">
                    {p.entregado && p.celFormat != "" && (
                      <a
                        href={
                          "https://api.whatsapp.com/send?phone=+549" +
                          p.celFormat +
                          "&text=Puede ingresar al Sitio Web del *NODO Temperley* para consultar su pedido.%0a‎Código de pedido= " +
                          p._id.substr(p._id.length - 5).toUpperCase() +
                          "%0D%0Ahttps://nodo-temperley.azurewebsites.net/mi-pedido %0D%0AMuchas Gracias."
                        }
                      >
                        <img
                          className="whatsapp"
                          src="/images/whatsapp.png"
                        ></img>
                      </a>
                    )}
                    {p.entregado && p.celFormat == "" && (
                      <span>
                        {p._id.substr(p._id.length - 5).toUpperCase()}
                      </span>
                    )}
                  </td>
                  <td className="cell-icon">
                    {!p.conEntrega && <FontAwesomeIcon icon={faWalking} />}
                    {p.conEntrega && p.direccion && (
                      <FontAwesomeIcon
                        icon={faTruck}
                        className="text-primary"
                      />
                    )}
                    {p.conEntrega && !p.direccion && (
                      <FontAwesomeIcon icon={faTruck} className="text-danger" />
                    )}
                  </td>
                  <td className="cell-icon">
                    <Link to={`/pedidos/ver/${p._id}`}>
                      <button
                        title="Pedido sin entrega"
                        type="button"
                        class="btn btn-sm btn-success"
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
