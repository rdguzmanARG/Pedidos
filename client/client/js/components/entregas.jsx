import React, { Component } from "react";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";
import { entrega_getAll } from "../services/entregaService";
import moment from "moment";
import auth from "../services/authService";

class Entregas extends Component {
  state = {
    isLoading: true,
    entregas: []
  };

  componentDidMount() {
    entrega_getAll()
      .then(res => {
        if (res.status === 200) {
          this.setState({
            entregas: res.data.filter(f => f.estado == "CER"),
            isLoading: false
          });
        }
      })
      .catch(ex => {
        if (ex.response && ex.response.status === 401) {
          auth.logout();
          window.location = "/login";
        } else {
          this.props.onGlobalError();
        }
      });
  }

  render() {
    const { entregas, isLoading } = this.state;
    if (isLoading) {
      return (
        <div id="overlay">
          <Loader type="Circles" color="#025f17" height={100} width={100} />
        </div>
      );
    }
    return (
      <React.Fragment>
        {entregas.length == 0 && (
          <div className="mt-2 mb-2">
            <div class="alert alert-success" role="alert">
              <h4 class="alert-heading">
                No hay entregas registradas por el momento.
              </h4>
              <p>Solo se muestran las entregas que esten cerradas.</p>
            </div>
          </div>
        )}
        {entregas.length > 0 && (
          <table className="table table-striped table-sm table-productos">
            <thead className="thead-dark">
              <tr>
                <th>Fecha de importación</th>
                <th className="d-none d-sm-table-cell">Productos</th>
                <th className="d-none d-sm-table-cell">Pedidos</th>
                <th className="d-none d-sm-table-cell cell-right">
                  Total Entregas
                </th>
                <th className="d-none d-sm-table-cell cell-right">
                  Total Almacen
                </th>
                <th className="cell-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {entregas.map(p => (
                <tr key={p._id}>
                  <td>
                    {moment(p.fechaImportacion).format("DD/MM/YYYY HH:mm")}
                  </td>
                  <td className="d-none d-sm-table-cell">{p.cantProductos}</td>
                  <td className="d-none d-sm-table-cell">{p.cantPedidos}</td>
                  <td className="d-none d-sm-table-cell cell-right">
                    ${p.totalEntrega.toFixed(2)}
                  </td>
                  <td className="d-none d-sm-table-cell cell-right">
                    ${p.totalAlmacen.toFixed(2)}
                  </td>
                  <td className="cell-right">
                    ${(p.totalEntrega + p.totalAlmacen).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </React.Fragment>
    );
  }
}

export default Entregas;
