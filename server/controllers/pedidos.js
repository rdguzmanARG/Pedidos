const fetch = require("node-fetch");
const mongoose = require("mongoose");
let Producto = require("../models/producto.model");
let Pedido = require("../models/pedido.model");

exports.pedidos_get_all = (req, res, next) => {
  Pedido.find()
    .select("_id nombre apellido celular entregado")
    .then(pedidos => res.status(200).json(pedidos))
    .catch(err => res.status(500).json({ error: err }));
};

exports.pedidos_get_pedido = (req, res, next) => {
  Pedido.findById(req.params.idPedido)
    .then(pedido => {
      if (pedido) {
        Producto.find({ _id: { $in: pedido.items.map(p => p._id) } })
          .then(prod => {
            res.status(200).json({
              _id: pedido._id,
              nombre: pedido.nombre,
              apellido: pedido.apellido,
              celular: pedido.celular,
              email: pedido.email,
              entregado: pedido.entregado,
              items: prod.map(p => {
                return {
                  _id: p._id,
                  nombre: p.nombre,
                  precio: p.precio,
                  cantidad: pedido.items.filter(
                    i => i._id.toString() === p._id.toString()
                  )[0].cantidad
                };
              })
            });
          })
          .catch(err => res.status(500).json({ error: err }));
      } else {
        res.status(404).json({ message: "Pedido inexistente." });
      }
    })
    .catch(err => res.status(500).json({ error: err }));
};

exports.pedidos_update_pedido = (req, res) => {
  Pedido.findByIdAndUpdate(req.params.idPedido, req.body)
    .then(pedido => res.json(pedido))
    .catch(err => res.status(500).json("Error: " + err));
};

exports.pedidos_import = (request, response, next) => {
  const colNombre = "Nombre";
  const colApellido = "Apellido";
  const colCelular = "Celular";
  const colMarcaTemporal = "Marca temporal";
  const colEmail = "Dirección de correo electrónico";
  const colcomentarios = "Comentarios ";
  const excludeCols = [
    "2",
    colNombre,
    colApellido,
    colCelular,
    colMarcaTemporal,
    colEmail,
    colcomentarios
  ];
  Pedido.collection.remove().then(
    Producto.collection.remove().then(
      fetch(
        "https://sheet.best/api/sheets/2c84077a-9587-4180-898d-56b0ad076f16"
      )
        .then(res => res.json())
        .then(data => {
          if (data.length === 0) {
            return response.json({
              success: true,
              pedidos: 0,
              productos: 0
            });
          }
          const cols = Object.keys(data[0]).filter(
            c => excludeCols.indexOf(c) < 0
          );
          Producto.insertMany(
            cols.map(c => {
              return new Producto({
                _id: new mongoose.Types.ObjectId(),
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
                    )
              });
            })
          )
            .then(res => {
              const productos = res.map(r => r._doc);
              const pedidos = data
                .filter(
                  d =>
                    d.Nombre !== null &&
                    d.Nombre !== "" &&
                    d.Apellido !== null &&
                    d.Apellido !== ""
                )
                .map(d => {
                  return new Pedido({
                    _id: new mongoose.Types.ObjectId(),
                    date: d[colMarcaTemporal],
                    nombre: d[colNombre],
                    apellido: d[colApellido],
                    celular: d[colCelular],
                    email: d[colEmail],
                    comentarios: d[colcomentarios],
                    items: productos
                      .filter(
                        p =>
                          d[p.nombre] !== null &&
                          d[p.nombre] !== "" &&
                          d[p.nombre] > 0
                      )
                      .map(pr => {
                        return {
                          _id: pr._id,
                          cantidad: d[pr.nombre]
                        };
                      })
                  });
                });

              if (pedidos.length === 0) {
                return response.json({
                  success: true,
                  pedidos: pedidos.length,
                  productos: productos.length
                });
              }

              Pedido.insertMany(pedidos)
                .then(() => {
                  // Calcular cantidades por pedido.

                  productos.map(prod => {
                    pedidos.map(ped => {
                      ped.items.map(item => {
                        if (
                          item &&
                          item._id.toString() === prod._id.toString()
                        ) {
                          prod.cantidad += item.cantidad;
                        }
                      });
                    });
                  });

                  // productos.map(prod => {
                  //   Producto.findByIdAndUpdate(prod._id.toString(), prod)
                  //     .then()
                  //     .catch(err => console.log(err));
                  // });

                  let checkADCompletions = function(prods) {
                    var promises = prods.map(function(pr) {
                      return Producto.findByIdAndUpdate(pr._id.toString(), pr);
                    });
                    return Promise.all(promises);
                  };

                  checkADCompletions(productos)
                    .then(function(responses) {
                      return response.json({
                        success: true,
                        pedidos: pedidos.length,
                        productos: responses.length
                      });
                    })
                    .catch(function(err) {
                      console.log(err);
                    });

                  // Producto.updateMany(
                  //   {},
                  //   productos.map(p => {
                  //     return { $set: { ...p, _id: p._id.toString() } };
                  //   })
                  // )
                  //   .then(() => {
                  //     return response.json({
                  //       success: true,
                  //       pedidos: pedidos.length,
                  //       productos: productos.length
                  //     });
                  //   })
                  //   .catch(err => console.log(err));
                })
                .catch(err => {
                  console.log(err);
                  response.status(500).json({ error: err });
                });
            })
            .catch(err => {
              console.log(err);
              response.status(500).json({ error: err });
            });
        })
        .catch(err => {
          console.log(err);
          response.status(500).json({ error: err });
        })
    )
  );
};
