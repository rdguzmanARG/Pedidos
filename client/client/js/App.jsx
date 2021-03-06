﻿import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { ToastContainer, toast, Flip } from "react-toastify";
import Loader from "react-loader-spinner";
import Footer from "./Footer";
import NavBar from "./Navbar";
import PedidosList from "./components/pedidosList";
import PedidoDetail from "./components/pedidoDetail";
import ProductosList from "./components/productosList";
import ProductoDetail from "./components/productoDetail";
import Recetas from "./components/recetasList";
import RecetaDetail from "./components/recetaDetail";
import EntregasConfig from "./components/entregasConfig";
import Entregas from "./components/entregas";
import Contactos from "./components/contactos";
import Inicio from "./components/Home";
import LoginForm from "./components/loginForm";
import Logout from "./components/logout";
import auth from "./services/authService";
import "react-toastify/dist/ReactToastify.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

class App extends Component {
  state = {
    filterPedidos: "",
    filterPedidosPendientes: false,
    filterPedidosConEntrega: false,
    filterPedidosSinEntrega: false,
    filterProductos: "",
    filterRecetas: "",
    filterProductosPedidos: false,
    hasError: "",
    isLoading: true,
  };
  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ ...this.state, user, isLoading: false, hasError: "" });
  }
  ChangeFilterPedidos = (filter) => {
    if (filter == "filter-pendientes") {
      this.setState({
        ...this.state,
        filterPedidosPendientes: !this.state.filterPedidosPendientes,
      });
    } else if (filter == "filter-con-entrega") {
      this.setState({
        ...this.state,
        filterPedidosConEntrega: true,
        filterPedidosSinEntrega: false,
      });
    } else if (filter == "filter-sin-entrega") {
      this.setState({
        ...this.state,
        filterPedidosSinEntrega: true,
        filterPedidosConEntrega: false,
      });
    } else if (filter == "filter-con-sin-entrega") {
      this.setState({
        ...this.state,
        filterPedidosSinEntrega: false,
        filterPedidosConEntrega: false,
      });
    } else {
      this.setState({ ...this.state, filterPedidos: filter });
    }
  };

  ChangeFilterProductos = (filterProductos) => {
    if (typeof filterProductos === "boolean") {
      this.setState({ ...this.state, filterProductosPedidos: filterProductos });
    } else {
      this.setState({ ...this.state, filterProductos });
    }
  };

  ChangeFilterRecetas = (filterRecetas) => {
    this.setState({ ...this.state, filterRecetas });
  };

  SetGlobalError = (status) => {
    this.setState({ ...this.state, hasError: status });
  };

  render() {
    const { user, isLoading } = this.state;
    if (isLoading) {
      return (
        <div id="overlay">
          <Loader type="Oval" color="#025f17" height={100} width={100} />
        </div>
      );
    }
    if (this.state.hasError != "") {
      return (
        <React.Fragment>
          <NavBar user={user} onGlobalError={this.SetGlobalError}></NavBar>
          <div className="container">
            <div className="main-container">
              <div class="alert alert-danger alert-dismissible fade show">
                <h2>Atención</h2>
                {this.state.hasError == "403" && (
                  <div>No tiene acceso para ver esta página.</div>
                )}
                {this.state.hasError != "403" && (
                  <div>
                    No se pudo conectar con el servidor, verifique si tiene
                    conexión a Internet y vuelva a intentar.
                  </div>
                )}

                <a href="/" class="alert-link">
                  Haga click aqui para reintentar
                </a>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <NavBar user={user} onGlobalError={this.SetGlobalError}></NavBar>
        <div className="container">
          <ToastContainer
            position="top-center"
            autoClose={8000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            transition={Flip}
            rtl={false}
            pauseOnVisibilityChange
            draggable
            pauseOnHover
          />

          <div className="main-container">
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
                render={(props) => {
                  if (!user) return <Redirect to="/login"></Redirect>;
                  return (
                    <PedidoDetail
                      user={user}
                      onGlobalError={this.SetGlobalError}
                      {...props}
                    ></PedidoDetail>
                  );
                }}
              />
              <Route
                path="/pedidos"
                render={(props) => {
                  if (!user) return <Redirect to="/login"></Redirect>;
                  return (
                    <PedidosList
                      filter={{
                        text: this.state.filterPedidos,
                        pendientes: this.state.filterPedidosPendientes,
                        conEntrega: this.state.filterPedidosConEntrega,
                        sinEntrega: this.state.filterPedidosSinEntrega,
                      }}
                      onChangeFilter={this.ChangeFilterPedidos}
                      onGlobalError={this.SetGlobalError}
                      {...props}
                    ></PedidosList>
                  );
                }}
              />
              <Route
                path="/productos/:verb/:id"
                render={(props) => {
                  if (!user) return <Redirect to="/login"></Redirect>;
                  if (!user.isAdmin && !user.isAdminPed)
                    return <Redirect to="/404"></Redirect>;
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
                render={(props) => {
                  if (!user) return <Redirect to="/login"></Redirect>;
                  if (!user.isAdmin && !user.isAdminPed)
                    return <Redirect to="/404"></Redirect>;
                  return (
                    <ProductosList
                      onGlobalError={this.SetGlobalError}
                      user={user}
                      filter={{
                        text: this.state.filterProductos,
                        soloPedidos: this.state.filterProductosPedidos,
                      }}
                      onChangeFilter={this.ChangeFilterProductos}
                      {...props}
                    ></ProductosList>
                  );
                }}
              />
              <Route
                path="/recetas/:verb/:id"
                render={(props) => {
                  if (!user) return <Redirect to="/login"></Redirect>;
                  if (!user.isAdmin && !user.isAdminPed)
                    return <Redirect to="/404"></Redirect>;
                  return (
                    <RecetaDetail
                      onGlobalError={this.SetGlobalError}
                      user={user}
                      {...props}
                    ></RecetaDetail>
                  );
                }}
              />              
              <Route
                path="/recetas/:verb"
                render={(props) => {
                  if (!user) return <Redirect to="/login"></Redirect>;
                  if (!user.isAdmin && !user.isAdminPed)
                    return <Redirect to="/404"></Redirect>;
                  return (
                    <RecetaDetail
                      onGlobalError={this.SetGlobalError}
                      user={user}
                      {...props}
                    ></RecetaDetail>
                  );
                }}
              />              

              <Route
                path="/recetas"
                render={(props) => {
                  if (!user) return <Redirect to="/login"></Redirect>;
                  if (!user.isAdmin && !user.isAdminPed)
                    return <Redirect to="/404"></Redirect>;
                  return (
                    <Recetas
                      onGlobalError={this.SetGlobalError}
                      {...props}
                      filter={{
                        text: this.state.filterRecetas,
                      }}
                      onChangeFilter={this.ChangeFilterRecetas}
                    ></Recetas>
                  );
                }}
              />
              <Route
                path="/entregas"
                render={(props) => {
                  if (!user) return <Redirect to="/login"></Redirect>;
                  if (!user.isAdmin && !user.isAdminPed)
                    return <Redirect to="/404"></Redirect>;
                  return (
                    <Entregas
                      onGlobalError={this.SetGlobalError}
                      {...props}
                    ></Entregas>
                  );
                }}
              />
              <Route
                path="/entregas-configuracion"
                render={(props) => {
                  if (!user) return <Redirect to="/login"></Redirect>;
                  if (!user.isAdmin && !user.isAdminPed)
                    return <Redirect to="/404"></Redirect>;
                  return (
                    <EntregasConfig
                      user={user}
                      onGlobalError={this.SetGlobalError}
                      {...props}
                    ></EntregasConfig>
                  );
                }}
              />
              <Route
                path="/contactos"
                render={(props) => {
                  if (!user) return <Redirect to="/login"></Redirect>;
                  if (!user.isAdmin && !user.isAdminPed)
                    return <Redirect to="/404"></Redirect>;
                  return (
                    <Contactos
                      onGlobalError={this.SetGlobalError}
                      {...props}
                    ></Contactos>
                  );
                }}
              />
              <Route path="/404">
                <div
                  class="mt-5 mb-5 pt-5 pb-5 alert alert-danger"
                  role="alert"
                >
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
      </React.Fragment>
    );
  }
}

export default App;
