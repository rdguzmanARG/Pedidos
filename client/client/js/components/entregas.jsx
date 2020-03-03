import React, { Component } from "react";
import Loader from "react-loader-spinner";
import Moment from "react-moment";
import { pedido_import } from "../services/pedidoService";
import {
  entrega_getCurrent,
  entrega_setStatus
} from "../services/entregaService";
import auth from "../services/authService";

class Inicio extends Component {
  state = {
    entrega: { estado: "" },
    error: null,
    isLoading: true
  };

  componentDidMount() {
    entrega_getCurrent()
      .then(res => {
        if (res.status === 200) {
          this.setState({ entrega: res.data, isLoading: false });
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
  ImportData = () => {
    this.setState({ isLoading: true });
    pedido_import()
      .then(res => {
        console.log("Datos importados");
        if (res.status === 200) {
          this.setState({ entrega: res.data, isLoading: false });
        }
      })
      .catch(ex => {
        this.setState({ error: ex, isLoading: false });
      });
  };

  CambioDeEstado = nuevoEstado => {
    this.setState({ isLoading: true });
    entrega_setStatus(this.state.entrega._id, {
      ...this.state.entrega,
      estado: nuevoEstado
    })
      .then(res => {
        if (res.status === 200) {
          this.setState({ entrega: res.data, isLoading: false });
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
  };
  render() {
    const { entrega, isLoading } = this.state;
    if (isLoading) {
      return (
        <div id="overlay">
          <Loader
            type="Circles"
            color="#025f17"
            height={100}
            width={100}
          ></Loader>
        </div>
      );
    }

    const estado =
      entrega == null || entrega.estado === "IMP"
        ? " Paso 1 - Importación de datos"
        : entrega.estado === "PRE"
        ? " Paso 2 - Ajuste de precios"
        : entrega.estado === "INI"
        ? " Paso 3 - Entrega de pedidosEntrega de pedidos"
        : " Paso 4 - Entrega finalizada";
    return (
      <div>
        <div class="card border-secondary mb-3">
          <div class="card-header text-white bg-secondary">
            Administración de Entregas
          </div>
          <h5 class="card-header">Información de la Entrega en curso</h5>
          <div class="card-body">
            {entrega && (
              <React.Fragment>
                <p class="card-text">
                  Estado: <b>{estado}</b>
                </p>
                <p class="card-text">
                  Fecha / Hora de última Importacion:{" "}
                  <Moment format="DD/MM/YYYY HH:mm">
                    {entrega.fechaImportacion}
                  </Moment>
                </p>
                <p class="card-text">
                  Cantidad de productos: {entrega.cantProductos}
                </p>
                <p class="card-text">
                  Cantidad de productos: {entrega.cantPedidos}
                </p>
              </React.Fragment>
            )}
            {!entrega && <p class="card-text">No hay Entrega dosponible</p>}
          </div>
        </div>

        <div id="accordion">
          <div class="card">
            <div class="card-header text-white bg-danger" id="headingOne">
              <button
                class="btn btn-lg text-white"
                data-toggle="collapse"
                data-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                Paso 1 - Importación de datos
              </button>
            </div>

            <div
              id="collapseOne"
              class={entrega.estado === "IMP" ? "collapse show" : "collapse"}
              aria-labelledby="headingOne"
              data-parent="#accordion"
            >
              <div class="card border-danger">
                <div class="card-body">
                  <p class="card-text">
                    Este paso puede ser ejecutado todas las veces que sea
                    necesario, actualiza el sistema con los productos y pedidos
                    en curso. Una vez iniciado el <b>paso 2</b>, ya no se podrán
                    importar más datos.
                  </p>
                  <button
                    disabled={
                      entrega != null &&
                      entrega.estado != "IMP" &&
                      entrega.estado != "CER"
                    }
                    onClick={() => this.ImportData()}
                    class="btn btn-danger mr-1"
                  >
                    Importar datos
                  </button>
                  <button
                    disabled={entrega === null || entrega.estado != "IMP"}
                    onClick={() => this.CambioDeEstado("PRE")}
                    class="btn btn-info mr-1"
                  >
                    Iniciar Paso 2
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header text-white bg-info" id="headingTwo">
              <button
                class="btn btn-lg collapsed text-white"
                data-toggle="collapse"
                data-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                Paso 2 - Ajuste de precios
              </button>
            </div>
            <div
              id="collapseTwo"
              class={entrega.estado === "PRE" ? "collapse show" : "collapse"}
              aria-labelledby="headingTwo"
              data-parent="#accordion"
            >
              <div class="card border-info">
                <div class="card-body">
                  <p class="card-text">
                    Permite ajustar los precios si fuera necesario, y anular los
                    productos que no fueron recibidos. Una vez iniciado el{" "}
                    <b>paso 3</b>, ya no se podrán modificar estos datos.
                  </p>
                  <button
                    disabled={entrega === null || entrega.estado != "PRE"}
                    onClick={() => this.CambioDeEstado("INI")}
                    class="btn btn-success mr-1"
                  >
                    Iniciar Paso 3
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header text-white bg-success" id="headingThree">
              <button
                class="btn btn-lg collapsed text-white"
                data-toggle="collapse"
                data-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                Paso 3 - Entrega de pedidos
              </button>
            </div>
            <div
              id="collapseThree"
              class={entrega.estado === "INI" ? "collapse show" : "collapse"}
              aria-labelledby="headingThree"
              data-parent="#accordion"
            >
              <div class="card border-sucess">
                <div class="card-body">
                  <p class="card-text">
                    Permite ajustar los precios si fuera necesario, y anular los
                    productos que no fueron recibidos. Estos datos no podrán ser
                    modificados una vez aprobado este paso.
                  </p>
                  <button
                    disabled={entrega === null || entrega.estado != "INI"}
                    onClick={() => this.CambioDeEstado("CER")}
                    class="btn btn-primary mr-1"
                  >
                    Cerrar Entrega
                  </button>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header text-white bg-primary" id="headingFour">
                <button
                  class="btn btn-lg collapsed text-white"
                  data-toggle="collapse"
                  data-target="#collapseFour"
                  aria-expanded="false"
                  aria-controls="collapseFour"
                >
                  Paso 4 - Entrega finalizada
                </button>
              </div>
              <div
                id="collapseFour"
                class={entrega.estado === "CER" ? "collapse show" : "collapse"}
                aria-labelledby="headingFour"
                data-parent="#accordion"
              >
                <div class="card border-primary">
                  <div class="card-body">
                    <p class="card-text">
                      Este es el último paso del proceso, una vez cerrada la
                      entrega no se podran modificar más datos de pedidos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Inicio;
