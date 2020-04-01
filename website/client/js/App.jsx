import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Header from "./Header";
import Form from "./components/form";
import Contact from "./components/contact";
import QuienesSomos from "./components/quienes-somos";
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
            render={props => {
              return <QuienesSomos></QuienesSomos>;
            }}
          />
          <Route
            path="/contactos"
            render={props => {
              return <Contact></Contact>;
            }}
          />
          <Route
            path="/"
            render={props => {
              return <Form></Form>;
            }}
          />
        </Switch>

        <Footer></Footer>
      </React.Fragment>
    );
  }
}

export default App;
