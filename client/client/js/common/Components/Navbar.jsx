import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark  bg-dark">
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
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
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
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;