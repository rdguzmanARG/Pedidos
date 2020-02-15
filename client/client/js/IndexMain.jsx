import React from "react";
import ReactDOM from "react-dom";
import App from "./common/components/App";
import "bootstrap/dist/css/bootstrap.css";
import "../../client/css/main.scss";

const title = "Pedidos";

const container = document.getElementById("container");
ReactDOM.render(<App title={title}></App>, container);
