import React, { Component } from "react";
import { entrega_getCurrent } from "../services/entregaService";
import ReactGA from "react-ga";

class Form extends Component {
  state = {
    estado: ""
  };

  componentDidMount() {
    entrega_getCurrent().then(res => {
      this.setState({ estado: res.data.estado });
      ReactGA.pageview(window.location.pathname + window.location.search);
    });
  }
  render() {
    const { estado } = this.state;
    if (estado == "") return null;
    return (
      <div className="form">
        {estado != "IMP" && (
          <div className="container pt-4 pb-4">
            <div className="pb-4">
              <h2>
                En este momento no se encuentra habilitado el formulario para
                realizar pedidos.
              </h2>
              <p>
                Se informara por los medios habituales al momento de iniciar una
                nueva recepción de pedidos.
              </p>
            </div>
            <div class="card-group">
              <div class="card">
                <img
                  class="card-img-top"
                  src="http://mercadoterritorial.observatorioess.org.ar/wp-content/uploads/2017/06/logo.jpg"
                  alt="Card image cap"
                ></img>
                <div class="card-body">
                  <h5 class="card-title">
                    ASOCIACIÓN DE PRODUCTORES HORTÍCOLAS LA 1610
                  </h5>
                  <p class="card-text">
                    La 1610 es una Asociación de 17 familias productoras
                    dedicadas principalmente a la horticultura que se consolida
                    en el año 2012. El nombre de la organización surge de
                    reconocer su lugar de origen, es decir del espacio
                    territorial al cual pertenecen, dado que la sede de la
                    organización se encuentra en la CALLE 1610 del barrio La
                    Capilla, partido de Florencio Varela. En los últimos años,
                    con el apoyo de diversas instituciones públicas, la
                    organización viene experimentando un proceso de transición
                    hacia una producción agroecológica
                  </p>
                </div>
              </div>
              <div class="card">
                <img
                  class="card-img-top"
                  src="http://mercadoterritorial.observatorioess.org.ar/wp-content/uploads/2017/06/Logo-el-progreso.png"
                  alt="Card image cap"
                ></img>
                <div class="card-body">
                  <h5 class="card-title">
                    GRUPO DE PRODUCTORES HORTÍCOLAS EL PROGRESO
                  </h5>
                  <p class="card-text">
                    El Progreso es un grupo de productores hortícolas
                    pertenecientes a la asociación La Guadalquivir. Actualmente
                    son xxx familias quienes viven en la localidad del Peligro
                    en el cordón hortícola de la Plata. Hace un año y medio, la
                    agrupación da inicio a la transición agroecológica con el
                    acompañamiento del INTA, transformando paulatinamente la
                    producción convencional por una de base agroecológica.
                  </p>
                </div>
              </div>
              <div class="card">
                <img
                  class="card-img-top"
                  src="http://mercadoterritorial.observatorioess.org.ar/wp-content/uploads/2018/09/cropped-logo-png-mercado-territorial-.png"
                  alt="Card image cap"
                ></img>
                <div class="card-body">
                  <h5 class="card-title">Mercado Territorial</h5>
                  <p class="card-text">
                    Mercado Territorial- línea Agricultura Familiar es una
                    iniciativa que surgió en el año 2015 como desarrollo de una
                    de las líneas de trabajo de la Incubadora de Economía,
                    Mercado y Finanzas de la Universidad Nacional de Quilmes.{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {estado == "IMP" && (
          <iframe
            src="https://docs.google.com/forms/d/1fpnmoqs2Nwig5ErxfbuCtacf0G9XIMtj9Ts05ylFQHY/viewform?embedded=true"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            scrolling="yes"
          >
            Cargndo...
          </iframe>
        )}
      </div>
    );
  }
}

export default Form;
