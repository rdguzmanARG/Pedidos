const fetch = require("node-fetch");
const mongoose = require("mongoose");
const moment = require("moment");
let Producto = require("../models/producto.model");
let Pedido = require("../models/pedido.model");
let Entrega = require("../models/entrega.model");
const EmailSender = require("../helpers/email-sender");

exports.pedidos_get_all = (req, res) => {
  Pedido.find()
    .select(
      "_id nombre apellido celular estado comentarios conEntrega direccion usuarioMod"
    )
    .then((pedidos) => {
      Entrega.findOne()
        .sort({ fechaImportacion: -1 })
        .then((entrega) => {
          res.status(200).json({ pedidos, last: new Date(), entrega: entrega });
        })
        .catch((err) => res.status(500).json({ error: err }));
    })
    .catch((err) => res.status(500).json({ error: err }));
};

exports.pedido_getPendingEmails = (req, res) => {
  Pedido.count({ emailEnviado: 0 }).then((count) => {
    return res.json({ count });
  });
};

exports.pedido_sendPendingEmails = (req, res) => {
  Pedido.find({ emailEnviado: 0 })
    .limit(5)
    .select(
      "_id nombre apellido celular estado comentarios conEntrega direccion usuarioMod"
    )
    .then((pedidos) => {
      EmailSender.sendEmails(pedidos)
        .then((data) => {
          Pedido.count({ emailEnviado: 0 }).then((count) => {
            return res.json({ restantes: count, procesado: data });
          });
        })
        .catch((err) => {
          return res.status(500).json("Error: " + err);
        });
    })
    .catch((err) => res.status(500).json({ error: err }));
};

exports.pedidos_get_last = (req, res) => {
  Pedido.find({ updatedAt: { $gt: req.params.date } })
    .select(
      "_id nombre apellido celular estado comentarios conEntrega direccion usuarioMod"
    )
    .then((pedidos) => {
      Entrega.findOne()
        .sort({ fechaImportacion: -1 })
        .then((entrega) => {
          res.status(200).json({ pedidos, last: new Date(), entrega: entrega });
        })
        .catch((err) => res.status(500).json({ error: err }));
    })
    .catch((err) => res.status(500).json({ error: err }));
};

exports.pedidos_get_pedido = (req, res) => {
  Pedido.findById(req.params.idPedido)
    .populate("items.producto")
    .then((pedido) => {
      // Si el pedido no fue entregado, debe completar los valores de precio y pago.
      if (pedido.estado === 0) {
        pedido.items.forEach((item) => {
          item.precio = item.producto.precio;
          item.pago = item.producto.anulado
            ? null
            : item.producto.precio * item.cantidad;
        });
      }
      res.status(200).json(pedido);
    })
    .catch((err) => res.status(500).json({ error: err }));
};

exports.pedidos_get_pedidoByCode = (req, res) => {
  const email = req.params.email;
  const code = req.params.code;
  const message =
    "La dirección de correo electrónico o el código, son incorrectos.";
  Pedido.find({ email: email })
    .then((pedidos) => {
      const ids = pedidos.find(
        (f) =>
          f._id
            .toString()
            .substr(f._id.toString().length - 5)
            .toUpperCase() == code
      );
      if (ids === undefined) {
        return res.status(404).json({ message });
      }
      Pedido.findById(ids._doc._id)
        .populate("items.producto")
        .exec()
        .then((pedido) => {
          // Si el pedido no fue entregado, debe completar los valores de precio y pago.
          if (pedido == null) {
            res.status(404).json({ message });
          } else {
            if (pedido.estado === 0) {
              pedido.items.forEach((item) => {
                item.precio = item.producto.precio;
                item.pago = item.producto.anulado
                  ? null
                  : item.producto.precio * item.cantidad;
              });
            }
            res.status(200).json(pedido);
          }
        })
        .catch((err) => res.status(500).json({ error: err }));
    })
    .catch((err) => res.status(500).json({ error: err }));
};

exports.pedidos_update_pedido = (req, res) => {
  Pedido.findByIdAndUpdate(req.params.idPedido, req.body, { new: true })
    .populate("items.producto")
    .exec()
    .then((pedido) => {
      if (pedido.estado === 0) {
        pedido.items.forEach((item) => {
          item.precio = item.producto.precio;
          item.pago = item.producto.anulado
            ? null
            : item.producto.precio * item.cantidad;
        });
      }
      res.json(pedido);
    })
    .catch((err) => res.status(500).json("Error: " + err));
};

exports.pedidos_import = (request, response, next) => {
  // Valida si la Entrega en curso puede ser importada nuevamente.
  Entrega.findOne()
    .sort({ fechaImportacion: -1 })
    .then((entrega) => {
      // Si no hay entrega disponble, debe crear una nueva.
      if (entrega == null || entrega.estado === "CER") {
        Entrega.create(
          new Entrega({
            _id: new mongoose.Types.ObjectId(),
            fechaImportacion: Date(),
            estado: "IMP",
          })
        )
          .then((entrega) => {
            return ImportarDatos(response, entrega._doc);
          })
          .catch((err) => {
            console.log(err);
            response.status(500).json({ error: err });
          });
      } else {
        if (entrega.estado === "IMP") {
          return ImportarDatos(response, entrega._doc);
        } else {
          const message = "La Entrega en curso no puede ser importada.";
          console.log(message);
          response.status(500).json({ message });
        }
      }
    })
    .catch((err) => {
      console.log(err);
      response.status(500).json({ error: err });
    });
};

function ImportarDatos(response, entrega) {
  const colNombre = "Nombre";
  const colApellido = "Apellido";
  const colCelular = "Celular";
  const colMarcaTemporal = "Marca temporal";
  const colEmail = "Dirección de correo electrónico";
  const colComentarios = "Comentarios";
  const colDomicilio = "Domicilio";
  const colDetalleDomicilio = "Detalle domicilio";
  const colConEntrega = "¿Pedido con entrega a domicilio?";
  const excludeCols = [
    "2",
    colNombre,
    colApellido,
    colCelular,
    colMarcaTemporal,
    colEmail,
    colComentarios,
    colDomicilio,
    colDetalleDomicilio,
    colConEntrega,
  ];
  console.log("Imp - Inicio");
  Pedido.deleteMany({}).then(() => {
    console.log("Imp - Borra pedidos");
    Producto.deleteMany({}).then(() => {
      console.log("Imp - Borra productos");
      fetch(
        "https://sheet.best/api/sheets/2c84077a-9587-4180-898d-56b0ad076f16"
      )
        .then((xldRes) => xldRes.json())
        .then((data) => {
          // Verify if there is data to import.
          if (data.length === 0) {
            ///////////////////////////////
            // La importacion no tiene datos.
            ///////////////////////////////
            Entrega.findByIdAndUpdate(
              entrega._id,
              {
                $set: {
                  fechaImportacion: Date(),
                },
              },
              { new: true }
            )
              .then((finalEnt) => {
                return response.json({
                  ...finalEnt._doc,
                });
              })
              .catch((err) => {
                console.log(err);
                response.status(500).json({ error: err });
              });
          } else {
            ///////////////////////////////
            // La importacion tiene datos
            ///////////////////////////////
            const cols = Object.keys(data[0]).filter(
              (c) => excludeCols.indexOf(c) < 0
            );

            // INSERT ALL PRODUCTS
            Producto.insertMany(
              cols.map((c) => {
                return new Producto({
                  _id: new mongoose.Types.ObjectId(),
                  almacen: c.startsWith("Almacén"),
                  nombre: c,
                  precio: isNaN(
                    Number(
                      c
                        .substring(c.lastIndexOf("$") + 1)
                        .replace("]", "")
                        .trim()
                    )
                  )
                    ? 0
                    : Number(
                        c
                          .substring(c.lastIndexOf("$") + 1)
                          .replace("]", "")
                          .trim()
                      ),
                });
              })
            )
              .then((resProductos) => {
                //Inserto los productos
                console.log("Imp - Inserto productos - " + resProductos.length);
                const productos = resProductos.map((r) => r._doc);
                const pedidos = data
                  .filter(
                    (d) =>
                      d.Nombre !== null &&
                      d.Nombre !== "" &&
                      d.Apellido !== null &&
                      d.Apellido !== ""
                  )
                  .map((d) => {
                    return new Pedido({
                      _id: new mongoose.Types.ObjectId(),
                      date: moment(d[colMarcaTemporal], "DD/MM/YYYY HH:mm:ss"),
                      nombre: d[colNombre].trim(),
                      apellido: d[colApellido].trim(),
                      celular: d[colCelular],
                      email: d[colEmail],
                      comentarios: d[colComentarios],
                      direccion: d[colDomicilio],
                      direccionDetalle: d[colDetalleDomicilio],
                      conEntrega: d[colConEntrega] == "Si",
                      totalAlmacen: 0,
                      totalPedido: 0,
                      varios: 0,
                      estado: 0,
                      emailEnviado: 0,
                      items: productos
                        .filter(
                          (p) =>
                            d[p.nombre] !== null &&
                            d[p.nombre] !== "" &&
                            d[p.nombre] > 0
                        )
                        .map((pr) => {
                          return {
                            producto: pr._id,
                            cantidad: d[pr.nombre],
                            precio: pr.precio,
                            pago: d[pr.nombre] * pr.precio,
                          };
                        }),
                    });
                  });
                ///////////////////////////////////////////
                //Verifica si tiene pedidos por insertar
                ///////////////////////////////////////////
                if (pedidos.length === 0) {
                  Entrega.findByIdAndUpdate(
                    entrega._id,
                    {
                      ...entrega,
                      fechaImportacion: Date(),
                      cantPedidos: pedidos.length,
                      cantProductos: productos.length,
                    },
                    { new: true }
                  )
                    .exec()
                    .then((finalEnt) => {
                      return response.json({
                        ...finalEnt._doc,
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                      response.status(500).json({ error: err });
                    });
                } else {
                  ///////////////////////////////
                  // Tiene pedidos para insertar
                  ///////////////////////////////
                  Pedido.insertMany(pedidos)
                    .then((resPedidos) => {
                      console.log(
                        "Imp - Inserto pedidos - " + resPedidos.length
                      );
                      // Calcular cantidades por pedido.

                      productos.map((prod) => {
                        pedidos.map((ped) => {
                          ped.items.map((item) => {
                            if (
                              item &&
                              item.producto &&
                              item.producto._id.toString() ===
                                prod._id.toString()
                            ) {
                              prod.cantidad += item.cantidad;
                            }
                          });
                        });
                      });

                      let checkADCompletions = function (prods) {
                        var promises = prods.map(function (pr) {
                          return Producto.findByIdAndUpdate(
                            pr._id.toString(),
                            pr,
                            {
                              new: true,
                            }
                          );
                        });
                        return Promise.all(promises);
                      };

                      checkADCompletions(productos)
                        .then(function (responses) {
                          ////////////////////////////////
                          // Actualizo las cantidades
                          ///////////////////////////////
                          console.log("Imp - Actualizo cantidades");
                          Entrega.findByIdAndUpdate(
                            entrega._id.toString(),
                            {
                              $set: {
                                fechaImportacion: Date(),
                                cantPedidos: pedidos.length,
                                cantProductos: productos.length,
                              },
                            },
                            { new: true }
                          )
                            .then((finalEnt) => {
                              ////////////////////////////////
                              // Actualizo las cantidades
                              ///////////////////////////////
                              console.log(
                                "Imp - Actualizo la Entrega " + finalEnt
                              );
                              response.json({ ...finalEnt._doc });
                            })
                            .catch((err) => {
                              console.log(err);
                              response.status(500).json({ error: err });
                            });
                        })
                        .catch(function (err) {
                          console.log(err);
                        });
                    })
                    .catch((err) => {
                      console.log(err);
                      response.status(500).json({ error: err });
                    });
                }
              })
              .catch((err) => {
                console.log(err);
                response.status(500).json({ error: err });
              });
          }
        })
        .catch((err) => {
          console.log(err);
          response.status(500).json({ error: err });
        });
    });
  });
}
