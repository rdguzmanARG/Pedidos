import React, { Component } from "react";
import { contacto_send } from "../services/contactoService";
import ReactGA from "react-ga";

class Contact extends Component {
  state = {
    contacto: {},
    enviado: false,
  };

  componentDidMount() {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  onFieldChange = (e) => {
    const contacto = { ...this.state.contacto };
    contacto[e.target.name] = e.target.value;
    this.setState({ ...this.state, contacto });
  };

  submitForm = (e) => {
    const { contacto } = this.state;
    ReactGA.event({
      category: "Form",
      action: "Send",
    });
    e.preventDefault();
    contacto_send(contacto)
      .then((res) => {
        this.setState({ ...this.state, enviado: true });
      })
      .catch((ex) => {
        console.log(ex);
      });
  };

  render() {
    const { enviado } = this.state;
    return (
      <div className="contactos">
        <div className="hero">
          <h2 className="title">Contactenos</h2>
        </div>

        <div class="container">
          <h2 className="title">
            Ayuda al espacio y hace conocer tu emprendimiento
          </h2>
          <div className="text">
            <p>
              Este sitio lo acercara a sus vecinos, haga conocer su trabajo,
              producto y/o servicio, contactese con nosotros y sume su{" "}
              <b>BANNER</b>, crezca y ayudenos a crecer.
            </p>
            <p>
              Recibimos mas de 300 visitas mensuales de la zona de Temperley,
              Lomas de Zamora y Banfield. No se pierda esta posibilidad,
              súmese!!!
            </p>
          </div>

          <h2 className="title">Contacto</h2>
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
                  <label for="validationDefault01">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    class="form-control"
                    id="validationDefault01"
                    placeholder="Ingresa tu nombre"
                    onChange={this.onFieldChange}
                    required
                  ></input>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="validationDefault02">Apellido *</label>
                  <input
                    type="text"
                    name="apellido"
                    class="form-control"
                    id="validationDefault02"
                    placeholder="Ingresa tu apellido"
                    onChange={this.onFieldChange}
                    required
                  ></input>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="exampleInputEmail1">Correo electrónico *</label>
                  <input
                    type="email"
                    name="email"
                    class="form-control"
                    id="exampleInputEmail1"
                    placeholder="Ingresa tu correo electrónico"
                    onChange={this.onFieldChange}
                    aria-describedby="emailHelp"
                    required
                  ></input>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="exampleInputTel">Teléfono *</label>
                  <input
                    type="tel"
                    name="telefono"
                    class="form-control"
                    id="exampleInputTel"
                    placeholder="Ingresa tu teléfono"
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
                    placeholder="Dejanos tu comentario"
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
    );
  }
}

export default Contact;
