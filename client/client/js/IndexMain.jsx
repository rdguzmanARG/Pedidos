﻿import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import "../../client/css/main.scss";

const title = "La Chapanay - Sisteam de Pedidos";

const container = document.getElementById("container");
ReactDOM.render(<App title={title}></App>, container);
