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
    console.log("header");
    return (
      <header>
        <div
          id="carousel-example-1z"
          class="carousel slide carousel-fade"
          data-ride="carousel"
        >
          <div class="carousel-inner" role="listbox">
            <Link
              onClick={() => this.clickBanner("banner-1")}
              to="/contactos"
              class="carousel-item active"
              style={{
                backgroundImage: "url(" + "/images/banner-1.jpg" + ")",
              }}
            >
              <div className="carousel-caption">
                <h5>Su oficio aquí!!!</h5>
                <p>Hagase conocer a la comunidad a través de este espacio.</p>
              </div>
            </Link>
            <Link
              onClick={() => this.clickBanner("banner-1")}
              to="/contactos"
              class="carousel-item"
              style={{
                backgroundImage: "url(" + "/images/banner-2.jpg" + ")",
              }}
            >
              <div className="carousel-caption">
                <h5>Ayudanos a crecer!!!!</h5>
                <p>
                  Te ayudamos a conseguir mas trabajos! Pone tu publicidad
                  aqui!.
                </p>
              </div>
            </Link>
          </div>
        </div>
        <nav class="container navbar navbar-expand-lg navbar-light bg-light">
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
      </header>
    );
  }
}

export default Header;
