import React, { Component } from "react";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import { producto_get, producto_update } from "../services/productoService";
import auth from "../services/authService";

class ProductoDetail extends Component {
  state = {
    isLoading: true,
    producto: {}
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    producto_get(id)
      .then(res => {
        if (res.status === 200) {
          this.setState({ producto: res.data, isLoading: false });
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

  onFieldChange = e => {
    const prod = { ...this.state.producto };
    if (e.target.type === "checkbox") {
      prod[e.target.name] = e.target.checked;
    } else {
      prod[e.target.name] = e.target.value;
    }

    this.setState({ ...this.state, producto: prod });
  };

  submitForm = e => {
    const { producto } = this.state;
    e.preventDefault();
    producto_update(producto._id, producto).then(res => {
      if (res.status === 200) {
        this.props.history.push("/productos");
      }
    });
  };

  render() {
    const { producto, isLoading } = this.state;
    if (isLoading) {
      return (
        <div id="overlay">
          <Loader type="Circles" color="#025f17" height={100} width={100} />
        </div>
      );
    }
    console.log(producto);
    return (
      <React.Fragment>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Inicio</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/productos">Productos</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Detalle
            </li>
          </ol>
        </nav>

        <form onSubmit={this.submitForm}>
          <div className="form-group">
            <label for="exampleInputEmail1">Nombre del Producto</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={producto.nombre}
              onChange={this.onFieldChange}
              readOnly={true}
            />
          </div>
          <div className="form-group">
            <label for="exampleInputPassword1">Precio de Venta</label>
            <input
              type="text"
              name="precio"
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
              defaultChecked={producto.anulado}
              name="anulado"
              onChange={this.onFieldChange}
              id="anulado"
            />
            <label for="anulado">Producto anulado</label>
          </div>
          <button type="submit" className="btn btn-success">
            Aceptar
          </button>
          <button
            onClick={() => this.props.history.push("/productos")}
            className="btn btn-light ml-2"
          >
            Cancelar
          </button>
        </form>
      </React.Fragment>
    );
  }
}

export default ProductoDetail;
