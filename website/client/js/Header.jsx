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
      </header>
    );
  }
}

export default Header;
