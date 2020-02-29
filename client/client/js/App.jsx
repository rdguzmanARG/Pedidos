import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Loader from "react-loader-spinner";
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
import "react-toastify/dist/ReactToastify.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

class App extends Component {
  state = {
    filterPedidos: "",
    filterProductos: "",
    hasError: false,
    isLoading: true
  };
  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ ...this.state, user, isLoading: false });
  }

  ChangeFilterPedidos = filterPedidos => {
    this.setState({ ...this.state, filterPedidos });
  };

  ChangeFilterProductos = filterProductos => {
    this.setState({ ...this.state, filterProductos });
  };

  SetGlobalError = () => {
    this.setState({ ...this.state, hasError: true });
  };

  render() {
    const { user, isLoading } = this.state;
    if (isLoading) {
      return (
        <div id="overlay">
          <Loader type="Circles" color="#025f17" height={100} width={100} />
        </div>
      );
    }
    if (this.state.hasError) {
      return (
        <div id="overlay">
          <div class="alert alert-danger alert-dismissible fade show">
            <h2>Sistema de Pedidos</h2>
            <div>
              No se pudo conectar con el servidor, si el problema persiste
              comuniquese con el administrador del sistema.
            </div>
            <a href="/" class="alert-link">
              Haga click aqui para reintentar
            </a>
          </div>
        </div>
      );
    }
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
                    onGlobalError={this.SetGlobalError}
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
                    onGlobalError={this.SetGlobalError}
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
                return (
                  <ProductoDetail
                    onGlobalError={this.SetGlobalError}
                    user={user}
                    {...props}
                  ></ProductoDetail>
                );
              }}
            />
            <Route
              path="/productos"
              render={props => {
                if (!user) return <Redirect to="/login"></Redirect>;
                return (
                  <ProductosList
                    onGlobalError={this.SetGlobalError}
                    user={user}
                    filter={this.state.filterProductos}
                    onChangeFilter={this.ChangeFilterProductos}
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
                return (
                  <ImportarDatos
                    onGlobalError={this.SetGlobalError}
                    {...props}
                  ></ImportarDatos>
                );
              }}
            />
            <Route path="/404">
              <div class="mt-5 mb-5 pt-5 pb-5 alert alert-danger" role="alert">
                <h4 class="alert-heading">
                  La página que esta buscando no existe!
                </h4>
              </div>
            </Route>
            <Route
              path="/login"
              render={() => (
                <LoginForm onGlobalError={this.SetGlobalError}></LoginForm>
              )}
            />
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
