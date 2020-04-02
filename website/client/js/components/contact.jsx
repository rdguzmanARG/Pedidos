import React, { Component } from "react";
import { contacto_send } from "../services/contactoService";
import ReactGA from "react-ga";

class Contact extends Component {
  state = {
    contacto: {},
    enviado: false
  };

  componentDidMount() {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  onFieldChange = e => {
    const contacto = { ...this.state.contacto };
    contacto[e.target.name] = e.target.value;
    this.setState({ ...this.state, contacto });
  };

  submitForm = e => {
    const { contacto } = this.state;
    ReactGA.event({
      category: "Form",
      action: "Send"
    });
    e.preventDefault();
    contacto_send(contacto)
      .then(res => {
        this.setState({ ...this.state, enviado: true });
      })
      .catch(ex => {
        console.log(ex);
      });
  };

  render() {
    const { enviado } = this.state;
    return (
      <div>
        <div>
          <div class="container">
            <h2 className="mt-4">
              ¿Quiere hacer crecer su negocio o actividad?
            </h2>
            <h2 className="mt-4">
              ¿Sus clientes se encuentran en la zona de Temperley y/o aledaños?
            </h2>
            <div class="card mt-4 mb-4">
              <img src="/images/grafico-1.PNG" class="card-img "></img>
              <div class="card-body">
                <h5 class="card-title">
                  Mas de 300 visitas mensuales en su zona de influencia{" "}
                </h5>
                <p class="card-text">
                  Los vecinos de su barrio acceden a realizar sus compras en el
                  Nodo cada mes.
                </p>
              </div>
            </div>
            <h2>Contactese y publicite con nosotros</h2>
            <p>
              Este sitio lo acercara a sus vecinos, haga conocer su marca,
              producto y/o servicio a un costo muy bajo mensual, contactese con
              nosotros y sume su <b>BANNER</b>, crezca y aydenos a crecer.
            </p>
            <p>
              <b>Dejenos sus datos, y nos pondremos en contacto:</b>
            </p>
            {enviado && (
              <div class="alert alert-success" role="alert">
                <p>
                  El mensaje ha sido enviado correctamente, a la brevedad nos
                  pondremos encontacto.
                </p>
                <p>Muchas Gracás</p>
              </div>
            )}
            {!enviado && (
              <form onSubmit={this.submitForm}>
                <div class="form-row">
                  <div class="col-md-6 mb-3">
                    <label for="validationDefault01">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      class="form-control"
                      id="validationDefault01"
                      placeholder="Fernando"
                      onChange={this.onFieldChange}
                      required
                    ></input>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="validationDefault02">Apellido</label>
                    <input
                      type="text"
                      name="apellido"
                      class="form-control"
                      id="validationDefault02"
                      placeholder="Otto"
                      onChange={this.onFieldChange}
                      required
                    ></input>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="exampleInputEmail1">Correo electrónico</label>
                    <input
                      type="email"
                      name="email"
                      class="form-control"
                      id="exampleInputEmail1"
                      placeholder="fernando.otto@gmail.com"
                      onChange={this.onFieldChange}
                      aria-describedby="emailHelp"
                      required
                    ></input>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="exampleInputTel">Teléfono</label>
                    <input
                      type="tel"
                      name="telefono"
                      class="form-control"
                      id="exampleInputTel"
                      placeholder="11 3322 3322"
                      onChange={this.onFieldChange}
                      required
                    ></input>
                  </div>
                </div>
                <div class="form-row">
                  <div class="col-md mb-3">
                    <label for="exampleFormControlTextarea1">Comentarios</label>
                    <textarea
                      class="form-control"
                      name="comentarios"
                      id="exampleFormControlTextarea1"
                      rows="3"
                      onChange={this.onFieldChange}
                    ></textarea>
                  </div>
                </div>

                <button class="btn btn-primary" type="submit">
                  Enviar
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Contact;
