import React, { Component } from "react";
import { entrega_getCurrent } from "../services/entregaService";
import ReactGA from "react-ga";
import AwesomeSlider from "react-awesome-slider";
import withAutoplay from "react-awesome-slider/dist/autoplay";
import "react-awesome-slider/dist/styles.css";

class Form extends Component {
  state = {
    estado: "",
  };

  componentDidMount() {
    entrega_getCurrent().then((res) => {
      this.setState({ estado: res.data.estado });
      ReactGA.pageview(window.location.pathname + window.location.search);
    });
  }
  render() {
    const { estado } = this.state;
    const AutoplaySlider = withAutoplay(AwesomeSlider);
    if (estado == "") return null;
    return (
      <div className="form">
        {estado != "IMP" && (
          <div class="container pl-0 pr-0">
            <div className="hero">
              <div className="herp-box">
                <h2 className="hero-title">Cargá tu pedido</h2>
              </div>
            </div>
            <div className="container">
              <h2 className="title">Vecinxs</h2>
              <div className="text">
                <p>
                  La carga de pedidos no esta habilitada en este momento, la
                  misma será habilitada y notificada por las canales habituales
                  de comunicación.
                </p>
                <p>Desde ya, muchas gracias.</p>
              </div>
            </div>
          </div>
        )}
        {estado == "IMP" && (
          <div className="container pl-0 pr-0">
            <iframe
              src="https://docs.google.com/forms/d/1fpnmoqs2Nwig5ErxfbuCtacf0G9XIMtj9Ts05ylFQHY/viewform?embedded=true"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              scrolling="yes"
            >
              Cargndo...
            </iframe>
          </div>
        )}
      </div>
    );
  }
}

export default Form;
