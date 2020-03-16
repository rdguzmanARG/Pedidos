import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Header from "./Header";
import Form from "./components/form";
import Footer from "./Footer";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

class App extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <Header></Header>
        <Form></Form>
        <Footer></Footer>
      </React.Fragment>
    );
  }
}

export default App;
