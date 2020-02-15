import React, { Component } from "react";
import { Link } from "react-router-dom";

class Inicio extends Component {
  state = {};
  render() {
    return (
      <div class="jumbotron">
        <h1>Sistema de pedidos</h1>
        <h2>La Chapanay</h2>
        <p class="lead">
          Seleccione <Link to="/pedidos">Pedidos</Link> para iniciar la entrega.
        </p>
      </div>
    );
  }
}

export default Inicio;
