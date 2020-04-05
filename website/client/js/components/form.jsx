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
          <div className="container pt-4 pb-4 text-center">
            <h2 className="title">Vecinxs</h2>
            <p>
              <b>
                Estamos prepadando la próxima entrega, se informará de la misma
                a través de los canales habituales.
              </b>
            </p>
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
