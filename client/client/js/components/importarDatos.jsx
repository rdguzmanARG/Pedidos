import React, { Component } from "react";
import { pedido_import } from "../services/pedidoService";

class Inicio extends Component {
  state = {
    result: null
  };
  ImportData = () => {
    pedido_import()
      .then(res => {
        console.log("Datos importados");
        if (res.status === 200) {
          this.setState({ result: res.data });
        }
      })
      .catch(ex => {
        this.setState({ result: ex });
      });
  };
  render() {
    return (
      <div>
        <div class="alert alert-warning" role="alert">
          <h4 class="alert-heading">Proceso de importacion de datos</h4>
          <p>ATENCION: Este proceso reemplazara los datos existentes. </p>
          {this.state.result != null && this.state.result.success && (
            <div>
              <b>Datos importados:</b>
              <ul>
                <li>Pedidos: {this.state.result.pedidos}</li>
                <li>Productos: {this.state.result.productos}</li>
              </ul>
            </div>
          )}
          {this.state.result != null && !this.state.result.success && (
            <div>
              <b>Hubo un error al importar los datos.</b>
            </div>
          )}
        </div>
        <button
          disabled={this.state.result != null}
          onClick={() => this.ImportData()}
          class="btn btn-danger ml-2"
        >
          Importar datos
        </button>
      </div>
    );
  }
}

export default Inicio;
