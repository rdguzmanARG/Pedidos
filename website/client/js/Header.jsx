import React from "react";
import { Link, NavLink } from "react-router-dom";
import ReactGA from "react-ga";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHome } from "@fortawesome/free-solid-svg-icons";

class Header extends React.Component {
  state = {
    collapse: true
  };

  clickBanner = banner => {
    ReactGA.event({
      category: "Banner",
      action: "Click",
      label: banner
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
                backgroundImage:
                  "url(" + "/images/banners-publicite-aqui.jpg" + ")"
              }}
            ></Link>
            <Link
              onClick={() => this.clickBanner("banner-2")}
              to="/contactos"
              class="carousel-item"
              style={{
                backgroundImage:
                  "url(" + "/images/publicite-banner-fino.png" + ")"
              }}
            ></Link>
          </div>
        </div>
        <nav class="container navbar navbar-expand-lg navbar-light bg-light">
          <NavLink
            to="/"
            onClick={() => this.setState({ collapse: true })}
            className="navbar-brand"
          >
            Nodo Temperley
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
