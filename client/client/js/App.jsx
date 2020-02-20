import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Footer from "./Footer";
import NavBar from "./Navbar";
import PedidosList from "./components/pedidosList";
import PedidoDetail from "./components/pedidoDetail";
import ProductosList from "./components/productosList";
import ProductoDetail from "./components/productoDetail";
import Inicio from "./components/Home";
import LoginForm from "./components/loginForm";
import Logout from "./components/logout";
import auth from "./services/authService";
import { producto_getAll } from "./services/productoService";

class App extends Component {
  state = { productos: [] };

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
    if (user) {
      producto_getAll().then(res => {
        console.log("Recuperar Productos!!");
        if (res.status === 200) {
          this.setState({ productos: res.data });
        }
      });
    }
  }

  render() {
    return (
      <Router>
        <div className="container mt-2">
          <NavBar user={this.state.user}></NavBar>
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
              <Route path="/login" component={LoginForm} />
              <Route path="/logout" component={Logout} />
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
