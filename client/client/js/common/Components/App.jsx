import React, { Component } from "react";
import Axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Footer from "./Footer";
import PedidosList from "../../pedidos/pedidosList";
import PedidoDetail from "../../pedidos/pedidoDetail";
import ProductosList from "../../productos/productosList";
import ProductoDetail from "../../productos/productoDetail";
import Inicio from "../../inicio/index";
import NavBar from "./Navbar";

class App extends Component {
  state = { productos: [] };

  componentDidMount() {
    Axios.get("http://localhost:5000/api/productos").then(res => {
      console.log("Recuperar Productos!!");
      if (res.status === 200) {
        this.setState({ productos: res.data });
      }
    });
  }

  render() {
    return (
      <Router>
        <div className="container mt-2">
          <NavBar></NavBar>
          <div className="mt-2 mb-2">
            <Switch>
              <Route
                path="/pedidos/:verb/:id"
                render={props => (
                  <PedidoDetail
                    productos={this.state.productos}
                    {...props}
                  ></PedidoDetail>
                )}
              />
              <Route path="/pedidos" component={PedidosList} />
              <Route path="/productos/:verb/:id" component={ProductoDetail} />
              <Route
                path="/productos"
                render={props => (
                  <ProductosList
                    productos={this.state.productos}
                    {...props}
                  ></ProductosList>
                )}
              />
              <Route path="/404">
                <div class="alert alert-danger" role="alert">
                  <h4 class="alert-heading">
                    La página que esta buscando no existe!
                  </h4>
                </div>
              </Route>
              <Route path="/" exact component={Inicio} />
              <Redirect to="/404" />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
