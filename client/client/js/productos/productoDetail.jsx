import React, { Component } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

class ProductoDetail extends Component {
  state = {
    nombre: "",
    precio: 0
  };

  componentDidMount() {
    const id = this.props.match.params.id;
    Axios.get("http://localhost:5000/api/productos/" + id).then(res => {
      if (res.status === 200) {
        this.setState({ ...this.state, ...res.data });
      }
    });
  }

  onFieldChange = e => {
    console.log(e.target);
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  };

  submitForm = e => {
    e.preventDefault();
    Axios.put(
      "http://localhost:5000/api/productos/" + this.state._id,
      this.state
    ).then(res => {
      if (res.status === 200) {
        window.location = "/productos";
      }
    });
  };

  render() {
    const producto = this.state;
    console.log(this.state);
    return (
      <React.Fragment>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <Link to="/">Inicio</Link>
            </li>
            <li class="breadcrumb-item">
              <Link to="/productos">Productos</Link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
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
            />
          </div>
          <div class="form-group">
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
          <button type="submit" class="btn btn-success">
            Aceptar
          </button>
          <button
            onClick={() => this.props.history.push("/productos")}
            class="btn btn-light ml-2"
          >
            Cancelar
          </button>
        </form>
      </React.Fragment>
    );
  }
}

export default ProductoDetail;