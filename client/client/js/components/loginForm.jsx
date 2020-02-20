import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import auth from "../services/authService";

class LoginForm extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {}
  };

  schema = {
    username: Joi.string()
      .required()
      .label("Username"),
    password: Joi.string()
      .required()
      .label("Password")
  };

  doSubmit = () => {
    const { data } = this.state;
    auth
      .login(data.username, data.password)
      .then(() => {
        window.location = "/";
      })
      .catch(ex => {
        if (ex.response && ex.response.status == 401) {
          const errors = { ...this.state.errors };
          errors.username = "Usuario y contraseña inválida.";
          this.setState({ errors });
        } else {
          const errors = { ...this.state.errors };
          errors.username = "No se pudieron validar los datos.";
          this.setState({ errors });
        }
      });
  };

  render() {
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Usuario")}
          {this.renderInput("password", "Contraseña", "password")}
          {this.renderButton("Aceptar")}
        </form>
      </div>
    );
  }
}

export default LoginForm;
