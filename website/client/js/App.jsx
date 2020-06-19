import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Header from "./Header";
import Inicio from "./components/inicio";
import Form from "./components/form";
import Contact from "./components/contact";
import Recetas from "./components/recetas";
import QuienesSomos from "./components/quienes-somos";
import MiPedido from "./components/mi-pedido";
import Footer from "./Footer";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

class App extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <Header></Header>
        <Switch>
          <Route
            path="/quienes-somos"
            render={(props) => {
              return <QuienesSomos></QuienesSomos>;
            }}
          />
          <Route
            path="/pedido"
            render={(props) => {
              return <Form></Form>;
            }}
          />
          <Route
            path="/mi-pedido/:code?"
            render={(props) => {
              return <MiPedido {...props}></MiPedido>;
            }}
          />
          <Route
            path="/recetas"
            render={(props) => {
              return <Recetas></Recetas>;
            }}
          />          
          <Route
            path="/contactos"
            render={(props) => {
              return <Contact></Contact>;
            }}
          />
          <Route
            path="/"
            render={(props) => {
              return <Inicio></Inicio>;
            }}
          />
        </Switch>

        <Footer></Footer>
      </React.Fragment>
    );
  }
}

export default App;
