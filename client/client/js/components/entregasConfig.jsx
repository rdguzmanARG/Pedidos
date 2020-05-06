import React, { Component } from "react";
import Scroll from "react-scroll";
import Loader from "react-loader-spinner";
import SweetAlert from "react-bootstrap-sweetalert";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { pedido_import } from "../services/pedidoService";
import { turno_procesar } from "../services/turnoService";
import {
  entrega_getCurrent,
  entrega_setStatus,
} from "../services/entregaService";
import auth from "../services/authService";
import {
  pedido_sendPendingEmails,
  pedido_getPendingEmails,
} from "../services/pedidoService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Element = Scroll.Element;
const scroller = Scroll.scroller;

class Inicio extends Component {
  state = {
    entrega: { estado: "" },
    error: null,
    isLoading: true,
    action: "",
    intervalId: null,
    count: null,
    errorMessage: null,
    dia1: null,
    dia1Desde: null,
    dia1Hasta: null,
    dia2: null,
    dia2Desde: null,
    dia2Hasta: null,
    message: null,
  };

  scrollTo = () => {
    scroller.scrollTo("myScrollToElement", {
      duration: 1000,
      delay: 100,
      smooth: true,
      offset: -65, // Scrolls to element + 50 pixels down the page
    });
  };
  componentDidMount() {
    entrega_getCurrent()
      .then((res) => {
        if (res.status === 200) {
          pedido_getPendingEmails().then((resCount) => {
            this.setState({
              entrega: res.data,
              isLoading: false,
              count: resCount.data.count,
            });
          });
        }
      })
      .catch((ex) => {
        if (ex.response && ex.response.status === 401) {
          auth.logout();
          window.location = "/login";
        } else {
          this.props.onGlobalError("No se pudo conectar con el Servidor.");
        }
      });
  }

  componentWillUnmount() {
    if (this.state.intervalId != null) {
      clearInterval(this.state.intervalId);
    }
  }

  ImportData = (next) => {
    this.setState({ isLoading: true, action: "" });
    pedido_import()
      .then((res) => {
        console.log("Datos importados");
        if (res.status === 200) {
          this.setState({
            entrega: res.data,
            errorMessage: null,
            isLoading: false,
          });
          if (next != null) {
            next();
            return;
          }
          pedido_getPendingEmails().then((resCount) => {
            this.setState({
              count: resCount.data.count,
            });
            this.scrollTo();
          });
        }
      })
      .catch((ex) => {
        this.setState({ error: ex, isLoading: false });
      });
  };

  CambioDeEstado = (nuevoEstado) => {
    this.setState({ isLoading: true, action: "" });
    entrega_setStatus(this.state.entrega._id, {
      ...this.state.entrega,
      estado: nuevoEstado,
    })
      .then((res) => {
        if (res.status === 200) {
          pedido_getPendingEmails().then((resCount) => {
            this.setState({
              entrega: res.data,
              isLoading: false,
              errorMessage: null,
              count: resCount.data.count,
            });
            this.scrollTo();
          });
        }
      })
      .catch((ex) => {
        if (ex.response && ex.response.status === 401) {
          auth.logout();
          window.location = "/login";
        } else {
          this.props.onGlobalError("No se pudo conectar con el Servidor.");
        }
      });
  };

  sendEmails = () => {
    pedido_sendPendingEmails()
      .then((restan) => {
        //console.log(restan.data.procesado);
        if (restan.data.count == 0) {
          if (this.state.intervalId != null) {
            clearInterval(this.state.intervalId);
          }
          this.setState({
            ...this.state,
            errorMessage: null,
            intervalId: null,
            count: 0,
          });
        } else {
          this.setState({
            ...this.state,
            count: restan.data.restantes,
            errorMessage: null,
          });
        }
      })
      .catch((ex) => {
        if (ex.response && ex.response.status === 401) {
          auth.logout();
          window.location = "/login";
        } else {
          if (this.state.intervalId != null) {
            clearInterval(this.state.intervalId);
          }
          this.setState({
            ...this.state,
            errorMessage: "Hubo un error al enviar los Emails.",
            intervalId: null,
          });
        }
      });
  };

  setDia1 = (current) => {
    current.setHours(9, 0, 0, 0);
    this.setState({
      ...this.state,
      dia1: current,
      dia1Desde: current,
      dia1Hasta: null,
    });
  };
  setDia1Desde = (date) => {
    let date2 = new Date(date.getTime());
    date2.setHours(date2.getHours() + 4);
    this.setState({ ...this.state, dia1Desde: date, dia1Hasta: date2 });
  };
  setDia1Hasta = (date) => {
    this.setState({ ...this.state, dia1Hasta: date });
  };

  setDia2 = (current) => {
    current.setHours(9, 0, 0, 0);
    this.setState({
      ...this.state,
      dia2: current,
      dia2Desde: current,
      dia2Hasta: null,
    });
  };
  setDia2Desde = (date) => {
    let date2 = new Date(date.getTime());
    date2.setHours(date2.getHours() + 4);
    this.setState({ ...this.state, dia2Desde: date, dia2Hasta: date2 });
  };
  setDia2Hasta = (date) => {
    this.setState({ ...this.state, dia2Hasta: date });
  };

  setTurnos = () => {
    const {
      dia1,
      dia1Desde,
      dia1Hasta,
      dia2,
      dia2Desde,
      dia2Hasta,
      entrega,
    } = this.state;
    if (dia1 == null || dia1Desde == null || dia1Hasta == null) {
      this.setState({
        ...this.state,
        errorMessage: "Debe seleccionar al menos un dia de entrega.",
      });
      return;
    }
    const config = {
      dia1,
      dia1DesdeH: dia1Desde.getHours(),
      dia1DesdeM: dia1Desde.getMinutes(),
      dia1HastaH: dia1Hasta.getHours(),
      dia1HastaM: dia1Hasta.getMinutes(),
      dia2,
      dia2DesdeH: dia2Desde ? dia2Desde.getHours() : null,
      dia2DesdeM: dia2Desde ? dia2Desde.getMinutes() : null,
      dia2HastaH: dia2Hasta ? dia2Hasta.getHours() : null,
      dia2HastaM: dia2Hasta ? dia2Hasta.getMinutes() : null,
    };
    turno_procesar(config)
      .then((res) => {
        entrega.dia1Horarios = res.data.dia1str;
        entrega.dia2Horarios = res.data.dia2str;
        this.setState({
          ...this.state,
          entrega,
          errorMessage: null,
        });
      })
      .catch((ex) => {
        if (ex.response && ex.response.status === 401) {
          auth.logout();
          window.location = "/login";
        } else {
          if (this.state.intervalId != null) {
            clearInterval(this.state.intervalId);
          }
          const msg = ex.response.data.message
            ? ex.response.data.message
            : "Hubo un error al intentar grabar los datos.";

          this.setState({
            ...this.state,
            errorMessage: msg,
            intervalId: null,
          });
        }
      });
  };

  render() {
    const {
      entrega,
      isLoading,
      action,
      count,
      errorMessage,
      dia1,
      dia1Desde,
      dia1Hasta,
      dia2,
      dia2Desde,
      dia2Hasta,
    } = this.state;

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
        : entrega.estado === "INI"
        ? " 2 - ENTREGA DE PEDIDOS"
        : " 3 - ENTREGA FINALIZADA";

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
                : action == "INI"
                ? "Iniciar Entrega de pedidos"
                : "Finalización de Entrega"
            }
            onConfirm={() => {
              if (action == "STA" || action == "IMP") {
                this.ImportData(null);
              } else {
                if (action == "INI") {
                  this.ImportData(() => this.CambioDeEstado("INI"));
                } else {
                  this.CambioDeEstado(action);
                }
              }
            }}
            onCancel={() => {
              this.setState({ ...this.state, action: "" });
            }}
            focusCancelBtn
          >
            <div>
              {action == "STA"
                ? "ATENCIÓN: asegurese haber completado los pasos en el formulario de Google. ¿Desea continuar?"
                : action == "IMP"
                ? "Se actualizarán los pedidos y productos. ¿Desea continuar?"
                : action == "INI"
                ? "ATENCION: una vez iniciada la Entrega de Pedidos,  no se podran importar nuevos datos, asegurese de haber cerrad el Formulario de Google antes de continuar. ¿Desea continuar?"
                : "ATENCION: si finaliza la entrega, no se podrán registrar nuevos pedidos. ¿Desea continuar?"}
            </div>
          </SweetAlert>
        )}

        <div class="card border-secondary mb-2 mt-2">
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
                {count === 0 && (
                  <p class="card-text">Todos los Emails fueron enviados.</p>
                )}
              </React.Fragment>
            )}
            {!entrega && <p class="card-text">No hay Entrega disponible</p>}
          </div>
        </div>

        <div id="accordion">
          <div class="card">
            <div class="card-header bg-warning" id="headingCero">
              {(entrega == null || entrega.estado == "CER") && (
                <Element name="myScrollToElement"></Element>
              )}
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
                2 - Entrega de pedidos
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
                    La <b>entrega de pedidos</b> le permitirá confirmar los
                    pedidos que fueron retirados, así como anular productos y
                    asentar ajustes o compras en el almacén por cada pedido.{" "}
                  </p>
                  <p class="card-text">
                    ATENCION: Antes de iniciar este paso, el{" "}
                    <b>formulario de google</b> debe estar cerrado para impedir
                    que lleguen nuevos pedidos.
                  </p>
                  {user.isAdmin && (
                    <React.Fragment>
                      <button
                        disabled={entrega === null || entrega.estado != "IMP"}
                        onClick={() =>
                          this.setState({ ...this.state, action: "INI" })
                        }
                        class="btn btn-success btn-pasos"
                      >
                        Iniciar
                      </button>
                      {entrega.estado === "INI" && (
                        <div className="horarios-box">
                          <div className="horarios-box--title">
                            Días y horarios de entrega
                          </div>

                          <div className="horarios-box--dia">
                            <span>Día 1: </span>
                            <DatePicker
                              selected={dia1}
                              dateFormat="dd/MM/yyyy"
                              onChange={(date) => this.setDia1(date)}
                            />
                            <span>Hora desde: </span>
                            <DatePicker
                              selected={dia1Desde}
                              disabled={!dia1}
                              onChange={(date) => this.setDia1Desde(date)}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={60}
                              timeCaption="Hora"
                              dateFormat="h:mm aa"
                            />
                            <span>Hora hasta: </span>
                            <DatePicker
                              selected={dia1Hasta}
                              disabled={!dia1}
                              onChange={(date) => this.setDia1Hasta(date)}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={60}
                              timeCaption="Hora"
                              dateFormat="h:mm aa"
                            />
                          </div>
                          <div className="horarios-box--dia">
                            <span>Día 2: </span>
                            <DatePicker
                              selected={dia2}
                              dateFormat="dd/MM/yyyy"
                              onChange={(date) => this.setDia2(date)}
                            />
                            <span>Hora desde: </span>
                            <DatePicker
                              selected={dia2Desde}
                              disabled={!dia2}
                              onChange={(date) => this.setDia2Desde(date)}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={60}
                              timeCaption="Hora"
                              dateFormat="h:mm aa"
                            />
                            <span>Hora hasta: </span>
                            <DatePicker
                              selected={dia2Hasta}
                              disabled={!dia2}
                              onChange={(date) => this.setDia2Hasta(date)}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={60}
                              timeCaption="Hora"
                              dateFormat="h:mm aa"
                            />
                          </div>

                          <div className="horarios-box--dia">
                            <span>
                              Se van a permitir 3 personas cada 15 minutos en
                              cada uno de los dias.
                            </span>
                            <button
                              type="submit"
                              class="btn btn-primary"
                              onClick={() => {
                                this.setTurnos();
                              }}
                            >
                              Aceptar
                            </button>
                          </div>
                          <div className="horarios-box--subtitle">
                            {!entrega.dia1Horarios && (
                              <div>
                                No hay horarios seleccionados por el momento,
                                debe indicar los días y el rango horario antes
                                de enviar los emails.
                              </div>
                            )}
                            {entrega.dia1Horarios && (
                              <div>Día 1: {entrega.dia1Horarios} </div>
                            )}
                            {entrega.dia2Horarios && (
                              <div>Día 2: {entrega.dia2Horarios} </div>
                            )}
                          </div>
                        </div>
                      )}

                      {errorMessage && (
                        <div
                          class="alert alert-danger text-center mt-4"
                          role="alert"
                        >
                          <h4 class="alert-heading">{errorMessage}</h4>
                        </div>
                      )}
                      {count > 0 && (
                        <p class="card-text mt-4">
                          Debe iniciar el proceso de envio de EMails, este
                          proceso enviara Emails a las direcciones de cada uno
                          de los pedidos realizados.
                        </p>
                      )}

                      {count > 0 && (
                        <button
                          disabled={
                            entrega.estado != "INI" ||
                            this.state.intervalId != null ||
                            entrega.dia1Horarios == null
                          }
                          onClick={() => {
                            this.sendEmails();
                            const intervalId = setInterval(
                              this.sendEmails,
                              1000 * 6
                            );
                            this.setState({
                              ...this.state,
                              errorMessage: null,
                              intervalId: intervalId,
                            });
                          }}
                          class="btn btn-danger btn-pasos"
                        >
                          {this.state.intervalId == null
                            ? "Enviar Emails, restan (" + this.state.count + ")"
                            : "Enviando Emails, restan (" +
                              this.state.count +
                              ")"}
                        </button>
                      )}

                      {this.state.intervalId && (
                        <button
                          disabled={
                            entrega.estado != "INI" ||
                            this.state.intervalId == null
                          }
                          onClick={() => {
                            if (this.state.intervalId != null) {
                              clearInterval(this.state.intervalId);
                            }

                            this.setState({
                              ...this.state,
                              intervalId: null,
                            });
                          }}
                          class="btn btn-danger btn-pasos"
                        >
                          Cancelar envio
                        </button>
                      )}
                    </React.Fragment>
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
                  3 - Finalización de entrega
                </button>
              </div>
              <div
                id="collapseFour"
                class="collapse"
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
