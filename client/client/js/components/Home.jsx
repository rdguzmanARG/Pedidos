import React, { Component } from "react";
import { Link } from "react-router-dom";

class Inicio extends Component {
  state = {};
  render() {
    return (
      <div className="home-page">
        <div className="main-box">
          <div className="secondary-box">
            <h1>LA CHAPANAY</h1>
            <p>Nodo vecinxs de Temperley</p>
            <h2>Sistema de pedidos</h2>
          </div>
        </div>
      </div>
    );
  }
}

export default Inicio;

{
  /* <div class="p-3 mb-5 jumbotron">
<img className="main-image" src="../../images/home.png"></img>
<h1>LA CHAPANAY</h1>
<div>
  <b> Nodo vecinxs de Temperley.</b>{" "}
</div>
<h2 className="mt-3">Sistema de pedidos</h2>
<div>
  Seleccione <Link to="/pedidos">pedidos</Link> para iniciar la entrega.
</div>
</div> */
}
