import React from "react";
import Joi from "joi-browser";
import Loader from "react-loader-spinner";
import Form from "../common/form";
import auth from "../services/authService";

class LoginForm extends Form {
  state = {
    isLoading: false,
    data: { username: "", password: "" },
    errors: {},
  };

  schema = {
    username: Joi.string().required().label("Username"),
    password: Joi.string().required().label("Password"),
  };

  doSubmit = () => {
    const { data } = this.state;
    this.setState({ ...this.state, isLoading: true });
    auth
      .login(data.username.toLowerCase(), data.password)
      .then(() => {
        window.location = "/";
      })
      .catch((ex) => {
        if (ex.response && ex.response.status == 401) {
          const errors = { ...this.state.errors };
          errors.username = "Usuario y/o contraseña inválida.";
          this.setState({ errors, isLoading: false });
        } else {
          const errors = { ...this.state.errors };
          errors.username = "No se pudieron validar los datos.";
          this.setState({ errors, isLoading: false });
        }
      });
  };

  render() {
    const { isLoading } = this.state;
    if (isLoading) {
      return (
        <div id="overlay">
          <Loader type="Oval" color="#025f17" height={100} width={100} />
        </div>
      );
    }
    return (
      <div className="pt-4 pb-5">
        <h1>Iniciar Sesión</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Usuario", "text", true)}
          {this.renderInput("password", "Contraseña", "password")}
          {this.renderButton("Aceptar")}
        </form>
      </div>
    );
  }
}

export default LoginForm;
