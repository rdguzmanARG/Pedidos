import React, { Component } from "react";
import ReactGA from "react-ga";

class Recetas extends Component {
  state = {
    recetas: [
      {
        titulo: "Canelones Integrales",
        ingredientes:
          "<p><b>Masa:</b><br>2 tazas de harina integral, aprox. 500Grs.<br>1 huevo<br>2 tazas de agua, aprox. 500 cm&sup3;<br>1 cucharadita de bicarbonato de sodio.<br>Sal y Jengibre a gusto.</p><p><strong>Relleno:</strong></p><p>1 paquete de acelga.<br />2 dientes de ajo<br />2 cebollitas peque&ntilde;as.<br />&frac12; morr&oacute;n .<br />Sal y nuez moscada a gusto.</p>",
        preparacion:
          "<p>Batir el huevo con la sal y el jengibre. Agregar el harina mezclada con el bicarbonato y el agua. Batir todo muy bien evitando que se formen grumos.<br />Dejar reposar &frac12; hora.<br />Untar el fondo de la panquequera o sart&eacute;n con aceite.<br />Cada cuchar&oacute;n completo es un panqueque. Verter y girar el sart&eacute;n para distribuir la masa para que ocupe todo el fondo de la sart&eacute;n.<br />Cocinar a fuego fuerte, 5 minutos de un lado, dar vuelta con la ayuda de la punta de un cuchillo de punta redonda o directamente con las manos. El otro lado 2 minutos m&aacute;s de cocci&oacute;n.<br />Esta cantidad rinde m&aacute;s de 12 panqueques del tama&ntilde;o del fondo de un plato.</p>",
        imagen: "/images/recetas/receta-1.jpg",
      },
    ],
  };

  componentDidMount() {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  render() {
    const { recetas } = this.state;
    return (
      <div className="recetas">
        <div className="container pl-0 pr-0">
          <div className="hero">
            <h2 className="title">Nuestras Recetas de </h2>
          </div>
        </div>
        <div className="container">
          {recetas.map((receta, index) => {
            return (
              <div key={index} className="cardBlock">
                <h2 className="title">{receta.titulo}</h2>
                <div className="cardItem">
                  <div className="imageBlock">
                    <img alt="image" src="/images/recetas/receta-1.jpg" />
                  </div>
                  <div className="textBlock">
                    <h3>Ingredientes</h3>
                    <div
                      className="lead"
                      dangerouslySetInnerHTML={{ __html: receta.ingredientes }}
                    ></div>
                  </div>
                </div>
                <h3 className="title">Preparación</h3>
                <div
                  className="lead"
                  dangerouslySetInnerHTML={{ __html: receta.preparacion }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Recetas;
