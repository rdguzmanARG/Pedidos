import React, { Component } from "react";
import Loader from "react-loader-spinner";
import { contacto_getAll } from "../services/contactoService";
import auth from "../services/authService";

class Contactos extends Component {
  state = {
    isLoading: true,
    contactos: [],
  };

  componentDidMount() {
    contacto_getAll()
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            contactos: res.data,
            isLoading: false,
          });
        }
      })
      .catch((ex) => {
        if (ex.response && ex.response.status === 401) {
          auth.logout();
          window.location = "/login";
        } else {
          this.props.onGlobalError("No se pudo conectar con el Servidor.");
        }
      });
  }

  render() {
    const { contactos, isLoading } = this.state;
    if (isLoading) {
      return (
        <div id="overlay">
          <Loader type="Circles" color="#025f17" height={100} width={100} />
        </div>
      );
    }
    return (
      <div className="contactos">
        <div class="card border-secondary mb-2 mt-2">
          <div class="card-header text-white bg-secondary">Contactos</div>
          <table className="table table-striped table-sm table-productos">
            <thead className="thead-dark">
              <tr>
                <th>Nombre y Apellido</th>
                <th>Email</th>
                <th className="d-none d-sm-table-cell">Telefono</th>
                <th className="d-none d-sm-table-cell">Comentarios</th>
              </tr>
            </thead>
            <tbody>
              {contactos.map((contacto) => (
                <tr key={contacto._id}>
                  <td>
                    {contacto.nombre}, {contacto.apellido}
                  </td>
                  <td className="d-none d-sm-table-cell">{contacto.email}</td>
                  <td className="d-none d-sm-table-cell">
                    {contacto.telefono}
                  </td>
                  <td className="d-none d-sm-table-cell">
                    {contacto.comentarios}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Contactos;
