import React from "react";
// import { Link, NavLink } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHome } from "@fortawesome/free-solid-svg-icons";

class Header extends React.Component {
  render() {
    return (
      <header>
        <div
          id="carousel-example-1z"
          class="carousel slide carousel-fade"
          data-ride="carousel"
        >
          <div class="carousel-inner" role="listbox">
            <a
              href="/contactos"
              class="carousel-item active"
              style={{
                backgroundImage:
                  "url(" + "/images/banners-publicite-aqui.jpg" + ")"
              }}
            ></a>
            <a
              href="/contactos"
              className="carousel-item"
              style={{
                backgroundImage:
                  "url(" + "/images/publicite-banner-fino.png" + ")"
              }}
            ></a>
          </div>
        </div>
        <nav class="container navbar navbar-expand-lg navbar-light bg-light">
          <a class="navbar-brand" href="/">
            Nodo Temperley
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" href="/quienes-somos">
                  ¿Quienes somos?
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/contactos">
                  Contactenos
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}

export default Header;
