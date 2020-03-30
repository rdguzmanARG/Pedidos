import React, { Component } from "react";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";
import { pedido_getAll, pedido_getLast } from "../services/pedidoService";
import auth from "../services/authService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

class PedidosList extends Component {
  state = {
    isLoading: true,
    pedidos: [],
    last: null,
    intervalId: null,
    entregaEstado: null
  };

  componentDidMount() {
    pedido_getAll()
      .then(res => {
        if (res.status === 200) {
          const { pedidos, last, entregaEstado } = res.data;
          this.setState({ pedidos, last, isLoading: false, entregaEstado });
          const intervalId = setInterval(this.updatePedidosList, 1000 * 60);
          this.setState({ ...this.state, intervalId: intervalId });
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

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  updatePedidosList = () => {
    if (this.state.last != null) {
      pedido_getLast(this.state.last)
        .then(res => {
          if (res.status == 200 && res.data) {
            // Validate if has new data
            if (res.data.pedidos.length > 0) {
              const newPedidos = res.data.pedidos;

              if (this.state.entregaEstado == "INI") {
                const pedidos = this.state.pedidos.filter(function(item) {
                  return !newPedidos.map(p => p._id).includes(item._id)
                    ? true
                    : false;
                });
                this.setState({
                  ...this.state,
                  pedidos: [...pedidos, ...newPedidos],
                  last: res.data.last,
                  entregaEstado: res.data.entregaEstado
                });
                const restantes =
                  this.state.pedidos.length -
                  this.state.pedidos.filter(f => f.entregado).length;
                const entregados = newPedidos.filter(p => p.entregado).length;
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
                  entregaEstado: res.data.entregaEstado
                });
                toast.info("Se han importado datos recientemente.");
              }
            } else {
              this.setState({
                ...this.state,
                last: res.data.last,
                entregaEstado: res.data.entregaEstado
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
    const { pedidos, isLoading } = this.state;
    const pedidosFilteres = pedidos.filter(
      f =>
        f.nombre.toLowerCase().includes(this.props.filter.toLowerCase()) ||
        f.apellido.toLowerCase().includes(this.props.filter.toLowerCase()) ||
        (this.props.filter === "*" && f.comentarios)
    );
    if (isLoading) {
      return (
        <div id="overlay">
          <Loader type="Circles" color="#025f17" height={100} width={100} />
        </div>
      );
    }
    const cantidad = pedidosFilteres.length;
    const restantes =
      cantidad - pedidosFilteres.filter(f => f.entregado).length;
    return (
      <div className="pedidos-list">
        <div class="input-group mb-2 mt-2">
          <input
            type="text"
            class="form-control form-control-lg"
            placeholder="Ingresar texto para buscar..."
            value={this.props.filter}
            onChange={e => this.props.onChangeFilter(e.target.value)}
          />
        </div>
        <div className="text-right">
          <b>
            Pend. ({restantes}/{cantidad})
          </b>
        </div>
        <table className="table table-striped table-sm table-pedidos">
          <thead className="thead-dark">
            <tr>
              <th>Nombre y Apellido</th>
              <th className="d-none d-sm-table-cell">Teléfono</th>
              <th className="d-none d-md-table-cell">Entregado por</th>
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
              .map(p => (
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
                    <Link title="Ver pedido" to={`/pedidos/ver/${p._id}`}>
                      <button type="button" class="btn btn-sm btn-success">
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
