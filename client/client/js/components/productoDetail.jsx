import React, { Component } from "react";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { producto_get, producto_update } from "../services/productoService";
import { entrega_getCurrent } from "../services/entregaService";
import auth from "../services/authService";

class ProductoDetail extends Component {
  state = {
    isLoading: true,
    producto: {},
    pedidos: [],
    entregaEstado: "",
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    producto_get(id)
      .then((resProducto) => {
        if (resProducto.status === 200) {
          entrega_getCurrent()
            .then((resEntrega) => {
              this.setState({
                producto: resProducto.data.producto,
                pedidos: resProducto.data.pedidos,
                isLoading: false,
                entregaEstado: resEntrega.data ? resEntrega.data.estado : "",
              });
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

  onFieldChange = (e) => {
    const prod = { ...this.state.producto };
    if (e.target.type === "checkbox") {
      prod[e.target.name] = e.target.checked;
    } else {
      prod[e.target.name] = e.target.value;
    }

    this.setState({ ...this.state, producto: prod });
  };

  submitForm = (e) => {
    const { producto } = this.state;
    e.preventDefault();
    producto_update(producto._id, producto).then((res) => {
      if (res.status === 200) {
        this.props.history.push("/productos");
      }
    });
  };

  render() {
    const { producto, pedidos, isLoading, entregaEstado } = this.state;
    const { user } = this.props;
    if (isLoading) {
      return (
        <div id="overlay">
          <Loader type="Circles" color="#025f17" height={100} width={100} />
        </div>
      );
    }
    return (
      <div className="producto-detail">
        <div class="card border-primary mb-2 mt-2">
          <div class="card-header text-white bg-primary">
            Detalle del producto
          </div>
          <div className="card-body m-1">
            <form onSubmit={this.submitForm}>
              <div className="form-group">
                <label for="exampleInputEmail1">Nombre del Producto</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={producto.nombre}
                  onChange={this.onFieldChange}
                  disabled={true}
                />
              </div>
              <div className="form-group">
                <label for="exampleInputPassword1">Precio de Venta</label>
                <input
                  type="text"
                  name="precio"
                  disabled={!user.isAdmin || entregaEstado != "INI"}
                  value={producto.precio}
                  onChange={this.onFieldChange}
                  class="form-control"
                  placeholder="$0.00"
                />
              </div>
              <div className="form-group">
                <input
                  className="form-check"
                  type="checkbox"
                  disabled={!user.isAdmin || entregaEstado != "INI"}
                  defaultChecked={producto.anulado}
                  name="anulado"
                  onChange={this.onFieldChange}
                  id="anulado"
                />
                <label for="anulado">Producto faltante</label>
              </div>
              {entregaEstado == "INI" && (
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={!user.isAdmin}
                >
                  Aceptar
                </button>
              )}

              <button
                title="Cancelar"
                onClick={() => this.props.history.push("/productos")}
                class="btn btn-primary ml-2"
              >
                <FontAwesomeIcon icon={faUndo} />
              </button>
            </form>
          </div>
        </div>
        {pedidos.length == 0 && (
          <div class="mt-5 mb-5 pt-5 pb-5 alert alert-success" role="alert">
            <h4 class="alert-heading">
              El producto no fue comprado hasta el momento.
            </h4>
          </div>
        )}
        {pedidos.length > 0 && (
          <div class="card border-success mb-2 mt-2">
            <div class="card-header text-white bg-success">
              Pedidos realizados
            </div>
            <div class="card-body">
              <table className="table table-striped table-sm table-pedidos">
                <thead className="thead-dark">
                  <tr>
                    <th>Nombre y Apellido</th>
                    <th className="cell-right">
                      (Unidades: {producto.cantidad})
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos
                    .sort((a, b) => {
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
                    })
                    .map((pedido, index) => (
                      <tr
                        key={index}
                        className={pedido.entregado ? "bg-entregado" : ""}
                      >
                        <td>
                          <b>
                            {pedido.nombre}, {pedido.apellido}
                          </b>
                        </td>
                        <td className="cell-right">
                          <Link
                            title="Ver pedido"
                            to={`/pedidos/ver/${pedido._id}`}
                          >
                            <button
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
          </div>
        )}
      </div>
    );
  }
}

export default ProductoDetail;
