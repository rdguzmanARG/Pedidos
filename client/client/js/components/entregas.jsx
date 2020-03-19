import React, { Component } from "react";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";
import { entrega_getAll } from "../services/entregaService";
import moment from "moment";
import Moment from "react-moment";
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
            entregas: res.data.filter(
              f => f.estado == "INI" || f.estado == "CER"
            ),
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

    const entregaActual = entregas.filter(f => f.estado == "INI")[0];

    if (isLoading) {
      return (
        <div id="overlay">
          <Loader type="Circles" color="#025f17" height={100} width={100} />
        </div>
      );
    }
    return (
      <div className="entrega-historial">
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
        {entregaActual && (
          <React.Fragment>
            <div class="card border-success mb-2 mt-2">
              <div class="card-header text-white bg-success">
                Entrega en curso
              </div>
              <h5 class="card-header">Información de la Entrega en curso</h5>
              <div class="card-body">
                <div class="row">
                  <div class="col-sm">
                    <div>
                      <div>Ultima Importación:</div>
                      <div>
                        Fecha:
                        <b>
                          <Moment format="DD/MM/YYYY">
                            {entregaActual.fechaImportacion}
                          </Moment>
                        </b>
                      </div>
                      <div>
                        Hora:
                        <b>
                          <Moment format="HH:mm">
                            {entregaActual.fechaImportacion}
                          </Moment>
                        </b>
                      </div>
                    </div>
                    <div>
                      Cantidad de productos:{" "}
                      <b>{entregaActual.cantProductos}</b>
                    </div>
                    <div>
                      Cantidad de pedidos: <b>{entregaActual.cantPedidos}</b>
                    </div>
                  </div>
                  <div class="col-sm totales">
                    <div>
                      Total almacén:{" "}
                      <b>${entregaActual.totalAlmacen.toFixed(2)}</b>
                    </div>
                    <div>
                      Total pedidos:{" "}
                      <b>${entregaActual.totalEntrega.toFixed(2)}</b>
                    </div>
                    <div>
                      Total:{" "}
                      <b>
                        $
                        {(
                          entregaActual.totalAlmacen +
                          entregaActual.totalEntrega
                        ).toFixed(2)}
                      </b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
        {entregas.length > 0 && (
          <React.Fragment>
            <div class="card border-secondary mb-2 mt-2">
              <div class="card-header text-white bg-secondary">
                Entregas previas
              </div>
              <table className="table table-striped table-sm table-productos">
                <thead className="thead-dark">
                  <tr>
                    <th>Fecha de importación</th>
                    <th className="d-none d-sm-table-cell">Productos</th>
                    <th className="d-none d-sm-table-cell">Pedidos</th>
                    <th className="d-none d-sm-table-cell cell-right">
                      Total Pedidos
                    </th>
                    <th className="d-none d-sm-table-cell cell-right">
                      Total Almacen
                    </th>
                    <th className="cell-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {entregas
                    .filter(f => f.estado == "CER")
                    .map(p => (
                      <tr key={p._id}>
                        <td>
                          {moment(p.fechaImportacion).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </td>
                        <td className="d-none d-sm-table-cell">
                          {p.cantProductos}
                        </td>
                        <td className="d-none d-sm-table-cell">
                          {p.cantPedidos}
                        </td>
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
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default Entregas;
