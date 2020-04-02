import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "../../client/css/main.scss";
import { BrowserRouter as Router } from "react-router-dom";
import ReactGA from "react-ga";
ReactGA.initialize("UA-77439351-3");

const container = document.getElementById("app");
ReactDOM.render(
  <Router>
    <App></App>
  </Router>,
  container
);
