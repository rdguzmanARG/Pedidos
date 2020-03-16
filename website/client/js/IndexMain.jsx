import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "../../client/css/main.scss";
import { BrowserRouter as Router } from "react-router-dom";

const container = document.getElementById("app");
ReactDOM.render(
  <Router>
    <App></App>
  </Router>,
  container
);
