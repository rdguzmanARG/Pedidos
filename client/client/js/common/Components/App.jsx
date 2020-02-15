import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Footer from "./Footer";
import PedidosList from "../../pedidos/pedidosList";
import PedidoDetail from "../../pedidos/pedidoDetail";
import Inicio from "../../inicio/index";
import NavBar from "./Navbar";

export default function App(props) {
  const { title } = props;

  return (
    <Router>
      <div className="container mt-2">
        <NavBar></NavBar>
        <div className="mt-2 mb-2">
          <Switch>
            <Route path="/pedidos/:verb/:id" component={PedidoDetail} />
            <Route path="/pedidos" component={PedidosList} />
            <Route path="/productos/:verb?/:id?">
              <div>Productos</div>
            </Route>
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
