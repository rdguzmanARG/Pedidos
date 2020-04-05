import React, { Component } from "react";
import ReactGA from "react-ga";
import AwesomeSlider from "react-awesome-slider";
import withAutoplay from "react-awesome-slider/dist/autoplay";
import "react-awesome-slider/dist/styles.css";
import Carousel from "react-bootstrap/Carousel";

class Form extends Component {
  componentDidMount() {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }
  render() {
    const slides = [
      {
        src: "/images/inicio-1.jpg",
        title: "Acercate a nuestro almacen cooperativo",
      },
      {
        src: "/images/inicio-2.jpg",
        title: "Relaciones en comunidad",
      },
      {
        src: "/images/inicio-3.jpg",
        title: "Reforzando y promoviendo lazos!!!",
      },
      {
        src: "/images/inicio-4.jpg",
        title: "Juntos y organizados",
      },
    ].sort(() => Math.random() - 0.5);

    const AutoplaySlider = withAutoplay(AwesomeSlider);
    return (
      <div className="inicio">
        <Carousel
          interval={3500}
          indicators={false}
          slide={false}
          fade={true}
          touch={false}
          controls={false}
        >
          {slides.map((slide, index) => {
            return (
              <Carousel.Item
                key={index}
                style={{ backgroundImage: "url(" + slide.src + ")" }}
              >
                {/* <img
                  className="d-block w-100"
                  src={slide.src}
                  alt={slide.title}
                /> */}
                {slide.title && (
                  <Carousel.Caption>
                    <h5>{slide.title}</h5>
                  </Carousel.Caption>
                )}
              </Carousel.Item>
            );
          })}
        </Carousel>

        <div className="container pt-4 pb-4">
          <h2 className="title">Nuestros productos</h2>
          <div className="pt-4 pb-4">
            <AutoplaySlider
              play={true}
              cancelOnInteraction={false} // should stop playing on user interaction
              interval={3000}
            >
              <div data-src="/images/bolson.jpg" />
              <div data-src="/images/harina.jpg" />
              <div data-src="/images/limon.jpg" />
              <div data-src="/images/mango.jpg" />
              <div data-src="/images/pesados.jpg" />
            </AutoplaySlider>
          </div>

          <h2 className="title">Seguí nuestros consejos</h2>
          <div className="pb-4 pt-4">
            <AutoplaySlider
              play={true}
              cancelOnInteraction={false} // should stop playing on user interaction
              interval={10000}
            >
              <div data-src="/images/higiene-1.jpg" />
              <div data-src="/images/higiene-2.jpg" />
              <div data-src="/images/higiene-3.jpg" />
              <div data-src="/images/higiene-4.jpg" />
              <div data-src="/images/higiene-5.jpg" />
              <div data-src="/images/higiene-6.jpg" />
            </AutoplaySlider>
          </div>

          <div class="card-group pt-3">
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
                  La 1610 es una Asociación de 17 familias productoras dedicadas
                  principalmente a la horticultura que se consolida en el año
                  2012. El nombre de la organización surge de reconocer su lugar
                  de origen, es decir del espacio territorial al cual
                  pertenecen, dado que la sede de la organización se encuentra
                  en la CALLE 1610 del barrio La Capilla, partido de Florencio
                  Varela. En los últimos años, con el apoyo de diversas
                  instituciones públicas, la organización viene experimentando
                  un proceso de transición hacia una producción agroecológica
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
                  son xxx familias quienes viven en la localidad del Peligro en
                  el cordón hortícola de la Plata. Hace un año y medio, la
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
                  iniciativa que surgió en el año 2015 como desarrollo de una de
                  las líneas de trabajo de la Incubadora de Economía, Mercado y
                  Finanzas de la Universidad Nacional de Quilmes.{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Form;
