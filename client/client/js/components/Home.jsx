import React, { Component } from "react";
import { Link } from "react-router-dom";

class Inicio extends Component {
  state = {};
  render() {
    return (
      <div class="p-3 mt-5 mb-5 jumbotron">
        <h1>LA CHAPANAY</h1>
        <h2 className="mt-3">Sistema de pedidos</h2>
        <div className="mb-5">
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
