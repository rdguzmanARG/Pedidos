import React, { Component } from "react";
import Scroll from "react-scroll";
import { Link } from "react-router-dom";
import { pedido_getAll } from "../services/pedidoService";
import auth from "../services/authService";
const Element = Scroll.Element;

class PedidosList extends Component {
  state = {
    pedidos: []
  };

  componentDidMount() {
    pedido_getAll()
      .then(res => {
        if (res.status === 200) {
          this.setState({ pedidos: res.data });
          const scroller = Scroll.scroller;
          scroller.scrollTo("myScrollToElement", {
            duration: 1000,
            delay: 100,
            smooth: true,
            offset: -5 // Scrolls to element + 50 pixels down the page
          });
        }
      })
      .catch(ex => {
        if (ex.response && ex.response.status === 401) {
          auth.logout();
          window.location = "/login";
        }
      });
  }

  render() {
    return (
      <React.Fragment>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <Link to="/">Inicio</Link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              Pedidos
            </li>
          </ol>
        </nav>
        <div class="input-group mb-3">
          <Element name="myScrollToElement"></Element>
          <input
            type="text"
            class="form-control"
            placeholder="Ingresar texto para buscar..."
            value={this.props.filter}
            onChange={e =>
              this.props.onChangeFilter(e.target.value.toLowerCase())
            }
          />
        </div>
        <table className="table table-striped table-sm table-pedidos">
          <thead className="thead-dark">
            <tr>
              <th>Nombre y Apellido</th>
              <th className="d-none d-sm-table-cell">Teléfono</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.pedidos
              .filter(
                f =>
                  f.nombre.toLowerCase().includes(this.props.filter) ||
                  f.apellido.toLowerCase().includes(this.props.filter)
              )
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
                <tr key={p._id} className={p.entregado ? "bg-success" : ""}>
                  <td>
                    {p.nombre}, {p.apellido}
                  </td>
                  <td className="d-none d-sm-table-cell">
                    <a href={"tel:+" + p.celular}>{p.celular}</a>{" "}
                  </td>
                  <td className="cell-right">
                    <Link to={`/pedidos/ver/${p._id}`}>
                      <button type="button" class="btn btn-primary btn-sm">
                        Ver
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default PedidosList;
