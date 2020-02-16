import React, { Component } from "react";
import { Link } from "react-router-dom";

class Inicio extends Component {
  state = {};
  render() {
    return (
      <div class="jumbotron">
        <h1>La Chapanay</h1>
        <h2>Sistema de pedidos</h2>
        <div>
          <b> Nodo vecinxs de Temperley.</b>{" "}
        </div>
        <div>
          Seleccione <Link to="/pedidos">pedidos</Link> para iniciar la entrega.
        </div>
      </div>
    );
  }
}

export default Inicio;
