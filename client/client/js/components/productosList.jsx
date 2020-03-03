import React, { Component } from "react";
import Scroll from "react-scroll";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";
import { producto_getAll } from "../services/productoService";
const Element = Scroll.Element;

class ProductosList extends Component {
  state = {
    isLoading: true,
    productos: []
  };

  search = e => {
    this.setState({ filter: e.target.value.toLowerCase() });
  };

  componentDidMount() {
    producto_getAll()
      .then(res => {
        if (res.status === 200) {
          this.setState({ productos: res.data, isLoading: false });
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
        } else {
          this.props.onGlobalError();
        }
      });
  }

  render() {
    const { productos, isLoading } = this.state;
    if (isLoading) {
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
            <li class="breadcrumb-item active" aria-current="page">
              Productos
            </li>
          </ol>
        </nav>
        <div class="input-group mb-3">
          <Element name="myScrollToElement"></Element>
          <input
            type="text"
            autoFocus
            class="form-control"
            placeholder="Ingresar texto para buscar..."
            value={this.props.filter}
            onChange={e =>
              this.props.onChangeFilter(e.target.value.toLowerCase())
            }
          />
        </div>
        <table className="table table-striped table-sm table-productos">
          <thead className="thead-dark">
            <tr>
              <th>Nombre del producto</th>
              <th className="d-none d-sm-table-cell">Cantidad</th>
              <th className="cell-right">P.Venta</th>
              {this.props.user.isAdmin && <th></th>}
            </tr>
          </thead>
          <tbody>
            {productos
              .filter(f => f.nombre.toLowerCase().includes(this.props.filter))
              .map(p => (
                <tr key={p._id} className={p.anulado ? "bg-danger" : ""}>
                  <td>{p.nombre}</td>
                  <td className="d-none d-sm-table-cell">{p.cantidad}</td>
                  <td className="cell-right">${p.precio.toFixed(2)}</td>
                  {this.props.user.isAdmin && (
                    <td className="cell-right">
                      <Link to={`/productos/ver/${p._id}`}>
                        <button type="button" class="btn btn-primary btn-sm">
                          Editar
                        </button>
                      </Link>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default ProductosList;
