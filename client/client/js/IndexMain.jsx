import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "../../client/css/main.scss";
import { BrowserRouter as Router } from "react-router-dom";

const title = "La Chapanay - Sisteam de Pedidos";

const container = document.getElementById("container");
ReactDOM.render(
  <Router>
    <App title={title}></App>
  </Router>,
  container
);
