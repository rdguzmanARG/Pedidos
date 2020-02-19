const router = require("express").Router();
const fetch = require("node-fetch");
let Pedido = require("../models/pedido.model");
let Producto = require("../models/producto.model");
const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
  Pedido.find()
    .select("_id nombre apellido celular")
    .then(pedidos => res.status(200).json(pedidos))
    .catch(err => res.status(500).json({ error: err }));
});

router.get("/import", (request, response, next) => {
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

  fetch("https://sheet.best/api/sheets/2c84077a-9587-4180-898d-56b0ad076f16")
    .then(res => res.json())
    .then(data => {
      const cols = Object.keys(data[0]).filter(c => excludeCols.indexOf(c) < 0);

      Producto.collection
        .drop()
        .then(
          Producto.insertMany(
            cols.map(c => {
              return new Producto({
                _id: new mongoose.Types.ObjectId(),
                nombre: c,
                precio: isNaN(
                  Number(c.substring(c.lastIndexOf("$") + 1).trim())
                )
                  ? 0
                  : Number(c.substring(c.lastIndexOf("$") + 1).trim())
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

              const borrarPedidos = Pedido.collection.drop();
              const crearPedidos = Pedido.insertMany(pedidos);

              Promise.all([borrarPedidos, crearPedidos])
                .then(values => {
                  const borrarPedidosResult = values[0];
                  const crearPedidosResult = values[1];

                  return response.json({
                    success: true,
                    pedidos: pedidos.length,
                    productos: productos.length
                  });
                })
                .catch(err => next(err));
            })
            .catch(err => res.status(500).json({ error: err }))
        )
        .catch(err => res.status(500).json({ error: err }));
    })
    .catch(err => res.status(500).json({ error: err }));
});

router.get("/:idPedido", (req, res, next) => {
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
});

module.exports = router;
