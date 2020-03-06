import React, { Component } from "react";
import Scroll from "react-scroll";
import Loader from "react-loader-spinner";
import SweetAlert from "react-bootstrap-sweetalert";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { pedido_import } from "../services/pedidoService";
import {
  entrega_getCurrent,
  entrega_setStatus
} from "../services/entregaService";
import auth from "../services/authService";
const Element = Scroll.Element;
const scroller = Scroll.scroller;

class Inicio extends Component {
  state = {
    entrega: { estado: "" },
    error: null,
    isLoading: true,
    action: ""
  };

  scrollTo = () => {
    scroller.scrollTo("myScrollToElement", {
      duration: 1000,
      delay: 100,
      smooth: true,
      offset: -65 // Scrolls to element + 50 pixels down the page
    });
  };
  componentDidMount() {
    entrega_getCurrent()
      .then(res => {
        if (res.status === 200) {
          this.setState({ entrega: res.data, isLoading: false });
          this.scrollTo();
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
    this.setState({ isLoading: true, action: "" });
    pedido_import()
      .then(res => {
        console.log("Datos importados");
        if (res.status === 200) {
          this.setState({ entrega: res.data, isLoading: false });
          this.scrollTo();
        }
      })
      .catch(ex => {
        this.setState({ error: ex, isLoading: false });
      });
  };

  CambioDeEstado = nuevoEstado => {
    this.setState({ isLoading: true, action: "" });
    entrega_setStatus(this.state.entrega._id, {
      ...this.state.entrega,
      estado: nuevoEstado
    })
      .then(res => {
        if (res.status === 200) {
          this.setState({ entrega: res.data, isLoading: false });
          this.scrollTo();
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
    const { entrega, isLoading, action } = this.state;
    const { user } = this.props;
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
        ? " 1 - IMPORTACION DE DATOS"
        : entrega.estado === "PRE"
        ? " 2 - AJUSTE DE PRECIOS"
        : entrega.estado === "INI"
        ? " 3 - ENTREGA DE PEDIDOS"
        : " 4 - ENTREGA FINALIZADA";
    return (
      <div className="entregas-config">
        {action != "" && (
          <SweetAlert
            showCancel
            reverseButtons
            btnSize="sm"
            confirmBtnText="Confirmar!"
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="primary"
            title={
              action == "STA"
                ? "Iniciar nueva Entrega"
                : action == "IMP"
                ? "Importación de datos"
                : action == "PRE"
                ? "Iniciar ajuste de precios"
                : action == "INI"
                ? "Iniciar Entrega de pedidos"
                : "Finalización de Entrega"
            }
            onConfirm={() => {
              if (action == "STA" || action == "IMP") {
                this.ImportData();
              } else {
                this.CambioDeEstado(action);
              }
            }}
            onCancel={() => {
              this.setState({ ...this.state, action: "" });
            }}
            focusCancelBtn
          >
            <div>
              {action == "STA"
                ? "ATENCIÓN: asegurese haber completados los datos mencionados en el formulario de Google. ¿Desea continuar?"
                : action == "IMP"
                ? "Se actualizarán los pedidos y productos. ¿Desea continuar?"
                : action == "PRE"
                ? "ATENCION: una vez iniciado el Ajuste de Pedidos, no se podran importar nuevos datos, asegurese de haber cerrad el Formulario de Google antes de continuar. ¿Desea continuar?"
                : action == "INI"
                ? "ATENCION: una vez iniciada la Entrega de Pedidos, no se podran modificar los precios ni anular los productos que no esten disponibles. ¿Desea continuar?"
                : "ATENCION: si finaliza la entrega, no se podrán registrar nuevos pedidos. ¿Desea continuar?"}
            </div>
          </SweetAlert>
        )}

        <div class="card border-secondary mb-3">
          <div class="card-header text-white bg-secondary">
            Configuración de Entregas
          </div>
          <h5 class="card-header">Información de la Entrega en curso</h5>
          <div class="card-body">
            {entrega && (
              <React.Fragment>
                <p class="card-text">
                  Estado actual: <b>{estado}</b>
                </p>
                <p class="card-text">
                  Ultima Importación:{" "}
                  <b>
                    <Moment format="DD/MM/YYYY HH:mm">
                      {entrega.fechaImportacion}
                    </Moment>
                  </b>
                </p>
                <p class="card-text">
                  Cantidad de productos: <b>{entrega.cantProductos}</b>
                </p>
                <p class="card-text">
                  Cantidad de pedidos: <b>{entrega.cantPedidos}</b>
                </p>
              </React.Fragment>
            )}
            {!entrega && <p class="card-text">No hay Entrega disponible</p>}
          </div>
        </div>

        <div id="accordion">
          <div class="card">
            <div class="card-header bg-warning" id="headingCero">
              {entrega == null ||
                (entrega.estado == "CER" && (
                  <Element name="myScrollToElement"></Element>
                ))}
              <button
                class="btn btn-lg"
                data-toggle="collapse"
                data-target="#collapseCero"
                aria-expanded="true"
                aria-controls="collapseCero"
              >
                Iniciar nueva entrega{" "}
              </button>
            </div>

            <div
              id="collapseCero"
              class={
                entrega == null || entrega.estado == "CER"
                  ? "collapse show"
                  : "collapse"
              }
              aria-labelledby="headingCero"
              data-parent="#accordion"
            >
              <div class="card border-warning">
                <div class="card-body">
                  <p class="card-text">
                    ATENCIÓN: antes de iniciar una nueva entrega debe:
                  </p>
                  <p>
                    Desde el <b>formulario de Google</b>:
                  </p>
                  <ol>
                    <li>
                      Desvincular de la planilla <b>Excel</b>.
                    </li>
                    <li>Borrar todas las respuestas.</li>
                    <li>Armar el formulario con los nuevos productos.</li>
                    <li>
                      Volver a vincular la misma planilla <b>Excel</b>.
                    </li>
                    <li>
                      Habilitar el formulario para comenzar a recibir pedidos.
                    </li>
                  </ol>
                  <p>
                    <i>
                      Nota: Hasta que no haya un pedido cargado, los productos y
                      pedidos no podrán ser importados.
                    </i>
                  </p>
                  {user.isAdmin && (
                    <button
                      disabled={entrega != null && entrega.estado != "CER"}
                      onClick={() =>
                        this.setState({ ...this.state, action: "STA" })
                      }
                      class="btn btn-warning btn-pasos"
                    >
                      Iniciar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header text-white bg-danger" id="headingOne">
              {entrega != null && entrega.estado === "IMP" && (
                <Element name="myScrollToElement"></Element>
              )}
              <button
                class="btn btn-lg text-white"
                data-toggle="collapse"
                data-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                1 - Importación de datos
              </button>
            </div>

            <div
              id="collapseOne"
              class={
                entrega != null && entrega.estado === "IMP"
                  ? "collapse show"
                  : "collapse"
              }
              aria-labelledby="headingOne"
              data-parent="#accordion"
            >
              <div class="card border-danger">
                <div class="card-body">
                  <p class="card-text">
                    La <b>importación de los datos</b> puede realizarce todas
                    las veces que sea necesaria, la misma permite ir importando
                    los pedidos que se han realizado hasta el momento.
                  </p>
                  {user.isAdmin && (
                    <button
                      disabled={entrega == null || entrega.estado != "IMP"}
                      onClick={() =>
                        this.setState({ ...this.state, action: "IMP" })
                      }
                      class="btn btn-danger btn-pasos"
                    >
                      Importar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header text-white bg-info" id="headingTwo">
              {entrega != null && entrega.estado === "PRE" && (
                <Element name="myScrollToElement"></Element>
              )}
              <button
                class="btn btn-lg collapsed text-white"
                data-toggle="collapse"
                data-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                2 - Ajuste de precios
              </button>
            </div>
            <div
              id="collapseTwo"
              class={
                entrega != null && entrega.estado === "PRE"
                  ? "collapse show"
                  : "collapse"
              }
              aria-labelledby="headingTwo"
              data-parent="#accordion"
            >
              <div class="card border-info">
                <div class="card-body">
                  <p class="card-text">
                    El <b>ajuste de precios</b> le permitirá modificar los
                    precios que sean necesarios así como anular los productos
                    que no fueron recibidos.{" "}
                  </p>
                  <p>
                    ATENCION: Antes de iniciar este paso, el{" "}
                    <b>formulario de google</b> debe estar cerrado para impedir
                    que lleguen nuevos pedidos.
                  </p>
                  {user.isAdmin && (
                    <button
                      disabled={entrega === null || entrega.estado != "IMP"}
                      onClick={() =>
                        this.setState({ ...this.state, action: "PRE" })
                      }
                      class="btn btn-info btn-pasos"
                    >
                      Iniciar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header text-white bg-success" id="headingThree">
              {entrega != null && entrega.estado === "INI" && (
                <Element name="myScrollToElement"></Element>
              )}
              <button
                class="btn btn-lg collapsed text-white"
                data-toggle="collapse"
                data-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                3 - Entrega de pedidos
              </button>
            </div>
            <div
              id="collapseThree"
              class={
                entrega != null && entrega.estado === "INI"
                  ? "collapse show"
                  : "collapse"
              }
              aria-labelledby="headingThree"
              data-parent="#accordion"
            >
              <div class="card border-sucess">
                <div class="card-body">
                  <p class="card-text">
                    La <b>entrega de pedidos</b> le permitira confirmar los
                    pedidos que fueron retirados, asi como asentar ajustes o
                    compras en el almacén.
                  </p>
                  {user.isAdmin && (
                    <button
                      disabled={entrega === null || entrega.estado != "PRE"}
                      onClick={() =>
                        this.setState({ ...this.state, action: "INI" })
                      }
                      class="btn btn-success btn-pasos"
                    >
                      Iniciar
                    </button>
                  )}
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
                  4 - Finalización de entrega
                </button>
              </div>
              <div
                id="collapseFour"
                class={
                  entrega != null && entrega.estado === "CER"
                    ? "collapse show"
                    : "collapse"
                }
                aria-labelledby="headingFour"
                data-parent="#accordion"
              >
                <div class="card border-primary">
                  <div class="card-body">
                    <p class="card-text">
                      Este es el último paso de la entrega, una vez finalizada
                      se podrán visualizar los totales obtenidos desde el{" "}
                      <Link to="/entregas">Historial</Link> de las entregas.
                    </p>
                    {user.isAdmin && (
                      <button
                        disabled={entrega === null || entrega.estado != "INI"}
                        onClick={() =>
                          this.setState({ ...this.state, action: "CER" })
                        }
                        class="btn btn-primary btn-pasos"
                      >
                        Finalizar
                      </button>
                    )}
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
