import React, { Component } from "react";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import RichTextEditor from "react-rte";
import {
  receta_get,
  receta_create,
  receta_update,
  receta_delete,
} from "../services/recetaService";
import auth from "../services/authService";

class RecetaDetail extends Component {
  state = {
    isLoading: true,
    receta: {},
    verb: "",
    selectedFile: null,
    deleteImage: false,
    imagePreviewUrl: null,
  };

  componentDidMount() {
    const verb = this.props.match.params.verb;
    if (verb !== "agregar") {
      const id = this.props.match.params.id;

      receta_get(id)
        .then((resReceta) => {
          if (resReceta.status === 200) {
            this.setState({
              receta: resReceta.data,
              ingredientes: resReceta.data.ingredientes
                ? RichTextEditor.createValueFromString(
                    resReceta.data.ingredientes,
                    "html"
                  )
                : RichTextEditor.createEmptyValue(),
              preparacion: resReceta.data.preparacion
                ? RichTextEditor.createValueFromString(
                    resReceta.data.preparacion,
                    "html"
                  )
                : RichTextEditor.createEmptyValue(),
              isLoading: false,
              verb,
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
    } else {
      this.setState({
        ingredientes: RichTextEditor.createEmptyValue(),
        preparacion: RichTextEditor.createEmptyValue(),
        isLoading: false,
        verb,
      });
    }
  }

  onFieldChange = (e) => {
    const receta = { ...this.state.receta };
    if (e.target.type === "checkbox") {
      receta[e.target.name] = e.target.checked;
    } else {
      receta[e.target.name] = e.target.value;
    }
    this.setState({ ...this.state, receta });
  };

  onChangeRtf = (field, value) => {
    let newState = this.state;
    newState[field] = value;
    newState.receta[field] = value.toString("html");
    this.setState({
      newState,
    });
  };

  fileSelectedHandler = (event) => {
    const file = event.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        ...this.state,
        selectedFile: file,
        deleteImage: false,
        imagePreviewUrl: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };
  fileDeletedHandler = (event) => {
    event.preventDefault();
    this.setState({
      ...this.state,
      selectedFile: null,
      imagePreviewUrl: null,
      deleteImage: true,
    });
  };

  submitForm = (e) => {
    e.preventDefault();

    const {
      verb,
      receta,
      selectedFile,
      deleteImage,
      imagePreviewUrl,
    } = this.state;
    const fd = new FormData();
    if (selectedFile) {
      fd.append("newimage", selectedFile, selectedFile.name);
    }
    fd.set("nombre", receta.nombre);
    fd.set("ingredientes", receta.ingredientes ? receta.ingredientes : "");
    fd.set("preparacion", receta.preparacion ? receta.preparacion : "");
    fd.set("image", receta.image ? receta.image : "");
    fd.set("deleteImage", deleteImage);

    if (verb == "agregar") {
      receta_create(fd).then((res) => {
        if (res.status === 201) {
          this.props.history.push("/recetas");
        }
      });
    } else if (verb == "eliminar") {
      receta_delete(receta._id).then((res) => {
        if (res.status === 200) {
          this.props.history.push("/recetas");
        }
      });
    } else {
      receta_update(receta._id, fd).then((res) => {
        if (res.status === 200) {
          this.props.history.push("/recetas");
        }
      });
    }
  };

  render() {
    const toolbarConfig = {
      // Optionally specify the groups to display (displayed in the order listed).
      display: [
        "INLINE_STYLE_BUTTONS",
        "BLOCK_TYPE_BUTTONS",
        "LINK_BUTTONS",
        "HISTORY_BUTTONS",
      ],
      INLINE_STYLE_BUTTONS: [
        { label: "Bold", style: "BOLD", className: "custom-css-class" },
        { label: "Italic", style: "ITALIC" },
        { label: "Underline", style: "UNDERLINE" },
      ],
      BLOCK_TYPE_BUTTONS: [
        { label: "UL", style: "unordered-list-item" },
        { label: "OL", style: "ordered-list-item" },
      ],
    };
    const {
      verb,
      receta,
      isLoading,
      ingredientes,
      preparacion,
      deleteImage,
      imagePreviewUrl,
    } = this.state;
    const { user } = this.props;
    if (isLoading) {
      return (
        <div id="overlay">
          <Loader type="Oval" color="#025f17" height={100} width={100} />
        </div>
      );
    }
    return (
      <div className="receta-detail">
        <div class="card border-primary mb-2 mt-2">
          <div class="card-header text-white bg-primary">
            Detalle de la receta
          </div>
          <div className="card-body m-1">
            <form onSubmit={this.submitForm}>
              <div className="form-group">
                <label for="exampleInputEmail1">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  required
                  readOnly={verb === "eliminar"}
                  value={receta.nombre}
                  onChange={this.onFieldChange}
                />
              </div>
              <div className="form-group">
                <label for="exampleInputEmail1">Ingredientes</label>
                <RichTextEditor
                  readOnly={verb === "eliminar"}
                  value={ingredientes}
                  name="ingredientes"
                  onChange={(value) => this.onChangeRtf("ingredientes", value)}
                  toolbarConfig={toolbarConfig}
                />
              </div>
              <div className="form-group">
                <label for="exampleInputEmail1">Preparación</label>
                <RichTextEditor
                  readOnly={verb === "eliminar"}
                  value={preparacion}
                  name="preparacion"
                  onChange={(value) => this.onChangeRtf("preparacion", value)}
                  toolbarConfig={toolbarConfig}
                />
              </div>
              <div className="form-group">
                {!imagePreviewUrl && receta.image && !deleteImage && (
                  <img
                    width="200"
                    className="image mr-2"
                    src={process.env.BACKEND_URL + "/" + receta.image}
                  ></img>
                )}
                {imagePreviewUrl && (
                  <img
                    width="200"
                    className="image mr-2"
                    src={imagePreviewUrl}
                  ></img>
                )}

                <input
                  style={{ display: "none" }}
                  type="file"
                  name="newimage"
                  onChange={this.fileSelectedHandler}
                  ref={(fileInput) => (this.fileInput = fileInput)}
                ></input>
                {verb !== "eliminar" && (
                  <React.Fragment>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        this.fileInput.click();
                      }}
                    >
                      Subir imagen
                    </button>
                    {!deleteImage && (receta.image || imagePreviewUrl) && (
                      <button onClick={this.fileDeletedHandler}>
                        Borrar Imagen
                      </button>
                    )}
                  </React.Fragment>
                )}
              </div>
              <button
                type="submit"
                className="btn btn-success"
                disabled={!user.isAdmin}
              >
                Aceptar
              </button>
              <button
                title="Cancelar"
                onClick={() => this.props.history.push("/recetas")}
                class="btn btn-primary ml-2"
              >
                <FontAwesomeIcon icon={faUndo} /> Volver
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default RecetaDetail;
