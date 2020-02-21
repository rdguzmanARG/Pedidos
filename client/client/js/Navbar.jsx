import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = props => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">
        Sistemas de Pedidos
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className="collapse navbar-collapse justify-content-between"
        id="navbarNav"
      >
        <ul className="navbar-nav">
          {props.user && (
            <React.Fragment>
              <li className="nav-item">
                <NavLink className="nav-link" to="/pedidos">
                  Pedidos
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/productos">
                  Productos
                </NavLink>
              </li>
              {props.user.isAdmin && (
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
                    Administración
                  </a>
                  <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <Link className="dropdown-item" to="/admin">
                      Importar datos
                    </Link>
                    <div class="dropdown-divider"></div>
                    <Link className="dropdown-item" to="/usuarios">
                      Usuarios
                    </Link>
                  </div>
                </li>
              )}
              <li>
                <NavLink className="nav-link" to="/logout">
                  Cerrar Sesión
                </NavLink>
              </li>
            </React.Fragment>
          )}
          {!props.user && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/login">
                Iniciar sesión
              </NavLink>
            </li>
          )}
        </ul>
        {props.user && (
          <span class="navbar-text current-user">
            Usuario: {props.user.username}
          </span>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
