import React from "react";
import { Link, NavLink } from "react-router-dom";

class Navbar extends React.Component {
  state = { collapse: false };
  changeSelection = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  render() {
    const { user } = this.props;
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand" to="/">
          Pedidos
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
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    onClick={this.changeSelection}
                    to="/productos"
                  >
                    Productos
                  </NavLink>
                </li>

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
                  <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    {user.isAdmin && (
                      <Link
                        className="dropdown-item"
                        to="/entregas-configuracion"
                        onClick={this.changeSelection}
                      >
                        Configuracion
                      </Link>
                    )}
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

                <li>
                  <NavLink className="nav-link" to="/logout">
                    Cerrar Sesión
                  </NavLink>
                </li>
              </React.Fragment>
            )}
            {!user && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">
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
      </nav>
    );
  }
}

export default Navbar;
