import React from "react";
import { Link, NavLink } from "react-router-dom";
import ReactGA from "react-ga";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHome } from "@fortawesome/free-solid-svg-icons";

class Header extends React.Component {
  state = {
    collapse: true,
  };

  clickBanner = (banner) => {
    ReactGA.event({
      category: "Banner",
      action: "Click",
      label: banner,
    });
  };
  render() {
    const banners = [
      {
        key: 1,
        html: (
          <div className="romina-monzon">
            <div
              className="carousel-item-image d-lg-none"
              style={{
                backgroundImage:
                  "url(" + "/images/adds/romina-monzon.jpg" + ")",
              }}
            >
              <div className="carousel-caption">
                <h6>Estudio contable</h6>
                <h5>Romina Monzón</h5>
                <div className="carousel-caption-row">
                  <span className="d-none d-sm-inline">
                    Consultas sin cargo:{" "}
                  </span>
                  <a
                    target="_blank"
                    onClick={() => this.clickBanner("romina-monzon")}
                    href="https://api.whatsapp.com/send?phone=1163999959&text=Necesito asesoramiento contable"
                  >
                    116399-9959
                  </a>
                  <img
                    className="whatsapp-icon"
                    src="/images/Icons/whatsapp.png"
                  ></img>
                </div>
              </div>
            </div>

            <div
              className="carousel-item-image d-none d-lg-block"
              style={{
                backgroundImage:
                  "url(" + "/images/adds/romina-monzon-large.jpg" + ")",
              }}
            >
              <div className="carousel-caption">
                <h6>Estudio contable</h6>
                <h5>Romina Monzón</h5>
                <div className="carousel-caption-row">
                  <span>Consultas sin cargo:</span>
                  <a
                    target="_blank"
                    href="https://api.whatsapp.com/send?phone=1163999959&text=Necesito asesoramiento contable"
                  >
                    116399-9959
                  </a>
                  <img
                    className="whatsapp-icon"
                    src="/images/Icons/whatsapp.png"
                  ></img>
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        key: 2,
        html: (
          <div
            className="carousel-item-image"
            style={{
              backgroundImage: "url(" + "/images/banner-1.jpg" + ")",
            }}
          >
            <div className="carousel-caption">
              <h5>Ayudanos a crecer!!!!</h5>
              <p className="d-none d-sm-block">
                Te ayudamos a conseguir mas trabajos! Pone tu publicidad aqui!.
              </p>
              <Link
                onClick={() => this.clickBanner("banner-1")}
                to="/contactos"
              >
                Contactanos
              </Link>
            </div>
          </div>
        ),
      },
      {
        key: 2,
        html: (
          <div
            className="carousel-item-image"
            style={{
              backgroundImage: "url(" + "/images/banner-2.jpg" + ")",
            }}
          >
            <div className="carousel-caption">
              <h5>Su oficio aquí!!!</h5>
              <p className="d-none d-sm-block">
                Hagase conocer a la comunidad a través de este espacio.
              </p>
              <Link
                onClick={() => this.clickBanner("banner-2")}
                to="/contactos"
              >
                Contactanos
              </Link>
            </div>
          </div>
        ),
      },
    ].sort(() => 0.5 - Math.random());

    return (
      <header>
        <div className="container">
          <div class="carousel slide carousel-fade" data-ride="carousel">
            <div class="carousel-inner" role="listbox">
              {banners.map((e, index) => (
                <div
                  key={index}
                  class={index === 0 ? "carousel-item active" : "carousel-item"}
                >
                  {e.html}
                </div>
              ))}
            </div>
          </div>
          <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <NavLink
              to="/"
              onClick={() => this.setState({ collapse: true })}
              className="navbar-brand"
            >
              <FontAwesomeIcon icon={faHome} /> Nodo Temperley
            </NavLink>
            <button
              class="navbar-toggler"
              type="button"
              onClick={() => this.setState({ collapse: !this.state.collapse })}
              data-toggle="collapse"
              data-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div
              class={
                this.state.collapse
                  ? "collapse navbar-collapse"
                  : "navbar-collapse"
              }
              id="navbarNavDropdown"
            >
              <ul class="navbar-nav">
                <li class="nav-item">
                  <NavLink
                    to="/pedido"
                    onClick={() => this.setState({ collapse: true })}
                    className="nav-link"
                  >
                    Cargá tu pedido
                  </NavLink>
                </li>
                <li class="nav-item">
                  <NavLink
                    to="/quienes-somos"
                    onClick={() => this.setState({ collapse: true })}
                    className="nav-link"
                  >
                    ¿Quienes somos?
                  </NavLink>
                </li>
                <li class="nav-item">
                  <NavLink
                    to="/contactos"
                    onClick={() => this.setState({ collapse: true })}
                    className="nav-link"
                  >
                    Contactenos
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
    );
  }
}

export default Header;
