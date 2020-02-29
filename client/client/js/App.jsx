import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Footer from "./Footer";
import NavBar from "./Navbar";
import PedidosList from "./components/pedidosList";
import PedidoDetail from "./components/pedidoDetail";
import ProductosList from "./components/productosList";
import ProductoDetail from "./components/productoDetail";
import ImportarDatos from "./components/importarDatos";
import Inicio from "./components/Home";
import LoginForm from "./components/loginForm";
import Logout from "./components/logout";
import auth from "./services/authService";
import { producto_getAll } from "./services/productoService";
import "react-toastify/dist/ReactToastify.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

class App extends Component {
  state = { productos: [], filterPedidos: "", filterProductos: "" };

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ ...this.state, user });
    if (user) {
      producto_getAll()
        .then(res => {
          console.log("Recuperar Productos!!");
          if (res.status === 200) {
            this.setState({ productos: res.data });
          }
        })
        .catch(ex => {
          if (ex.response && ex.response.status === 401) {
            auth.logout();
            window.location = "/login";
          }
        });
    }
  }

  ChangeFilterPedidos = filterPedidos => {
    this.setState({ ...this.state, filterPedidos });
  };

  ChangeFilterProductos = filterProductos => {
    this.setState({ ...this.state, filterProductos });
  };

  render() {
    const { user } = this.state;
    if (user === undefined) return null;
    return (
      <div className="container mt-2">
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
        <NavBar user={user}></NavBar>
        <div className="mt-2 mb-2">
          <Route
            path="/"
            render={({ location, history }) => {
              if (typeof window.ga === "function") {
                window.ga("set", "page", location.pathname + location.search);
                window.ga("send", "pageview");
              }
              return null;
            }}
          />
          <Switch>
            <Route
              path="/pedidos/:verb/:id"
              render={props => {
                if (!user) return <Redirect to="/login"></Redirect>;
                return (
                  <PedidoDetail
                    productos={this.state.productos}
                    {...props}
                  ></PedidoDetail>
                );
              }}
            />
            <Route
              path="/pedidos"
              render={props => {
                if (!user) return <Redirect to="/login"></Redirect>;
                return (
                  <PedidosList
                    filter={this.state.filterPedidos}
                    onChangeFilter={this.ChangeFilterPedidos}
                    {...props}
                  ></PedidosList>
                );
              }}
            />
            <Route
              path="/productos/:verb/:id"
              render={props => {
                if (!user) return <Redirect to="/login"></Redirect>;
                if (!user.isAdmin) return <Redirect to="/404"></Redirect>;
                return <ProductoDetail user={user} {...props}></ProductoDetail>;
              }}
            />
            <Route
              path="/productos"
              render={props => {
                if (!user) return <Redirect to="/login"></Redirect>;
                return (
                  <ProductosList
                    user={user}
                    filter={this.state.filterProductos}
                    onChangeFilter={this.ChangeFilterProductos}
                    productos={this.state.productos}
                    {...props}
                  ></ProductosList>
                );
              }}
            />
            <Route
              path="/importar-datos"
              render={props => {
                if (!user) return <Redirect to="/login"></Redirect>;
                if (!user.isAdmin) return <Redirect to="/404"></Redirect>;
                return <ImportarDatos {...props}></ImportarDatos>;
              }}
            />
            <Route path="/404">
              <div class="mt-5 mb-5 pt-5 pb-5 alert alert-danger" role="alert">
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
    );
  }
}

export default App;
