import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

class Navbar extends React.Component {
  state = { collapse: false };
  changeSelection = () => {
    this.setState({ collapse: !this.state.collapse });
    this.props.onGlobalError("");
  };

  render() {
    const { user } = this.props;
    return (
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark box-shadow mb-3">
        <div className="container">
          <Link className="navbar-brand" to="/" onClick={this.changeSelection}>
            <FontAwesomeIcon icon={faHome} />
            <span className="ml-1">Inicio</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={this.changeSelection}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={
              this.state.collapse
                ? "collapse navbar-collapse justify-content-between show"
                : "collapse navbar-collapse justify-content-between"
            }
            id="navbarNav"
          >
            <ul className="navbar-nav">
              {user && (
                <React.Fragment>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      onClick={this.changeSelection}
                      to="/pedidos"
                    >
                      Pedidos
                    </NavLink>
                  </li>
                  {(user.isAdmin || user.isAdminPed) && (
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        onClick={this.changeSelection}
                        to="/productos"
                      >
                        Productos
                      </NavLink>
                    </li>
                  )}
                  {(user.isAdmin || user.isAdminPed) && (
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        onClick={this.changeSelection}
                        to="/recetas"
                      >
                        Recetas
                      </NavLink>
                    </li>
                  )}
                  {(user.isAdmin || user.isAdminPed) && (
                    <li class="nav-item dropdown">
                      <a
                        class="nav-link dropdown-toggle"
                        href="#"
                        id="navbarDropdown"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Entregas
                      </a>
                      <div
                        class="dropdown-menu"
                        aria-labelledby="navbarDropdown"
                      >
                        <Link
                          className="dropdown-item"
                          to="/entregas-configuracion"
                          onClick={this.changeSelection}
                        >
                          Configuración
                        </Link>
                        <div class="dropdown-divider"></div>
                        <Link
                          className="dropdown-item"
                          to="/entregas"
                          onClick={this.changeSelection}
                        >
                          Historial
                        </Link>
                      </div>
                    </li>
                  )}
                  {user.isSysAdmin && (
                    <li className="nav-item">
                      <NavLink
                        className="nav-link"
                        onClick={this.changeSelection}
                        to="/contactos"
                      >
                        Contactos
                      </NavLink>
                    </li>
                  )}
                  <li>
                    <NavLink
                      className="nav-link"
                      to="/logout"
                      onClick={this.changeSelection}
                    >
                      Cerrar Sesión
                    </NavLink>
                  </li>
                </React.Fragment>
              )}
              {!user && (
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/login"
                    onClick={this.changeSelection}
                  >
                    Iniciar sesión
                  </NavLink>
                </li>
              )}
            </ul>
            {user && (
              <span class="navbar-text current-user">
                Usuario: {user.username.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
