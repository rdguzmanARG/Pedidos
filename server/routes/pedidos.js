const router = require("express").Router();
const fetch = require("node-fetch");
let Pedido = require("../models/pedido.model");
let Producto = require("../models/producto.model");

router.route("/").get((req, res) => {
  Pedido.find()
    .then(pedidos => res.json(pedidos))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/import").get((request, response) => {
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
      const pedidos = data
        .filter(
          d =>
            d.Nombre !== null &&
            d.Nombre !== "" &&
            d.Apellido !== null &&
            d.Apellido !== ""
        )
        .map(d => {
          return {
            date: d[colMarcaTemporal],
            nombre: d[colNombre],
            apellido: d[colApellido],
            celular: d[colCelular],
            email: d[colEmail],
            comentarios: d[colcomentarios],
            items: cols
              .filter(f => d[f] !== null && d[f] !== "" && d[f] > 0)
              .map(c => {
                return [c, d[c]];
              })
          };
        });

      const borrarProductos = Producto.collection.drop();
      const borrarPedidos = Pedido.collection.drop();
      const crearProductos = Producto.insertMany(
        cols.map(c => {
          return { nombre: c };
        })
      );
      const crearPedidos = Pedido.insertMany(pedidos);

      Promise.all([
        borrarProductos,
        borrarPedidos,
        crearProductos,
        crearPedidos
      ])
        .then(values => {
          const borrarProductosResult = values[0];
          const borrarPedidosResult = values[1];
          const crearProductosResult = values[2];
          const crearPedidosResult = values[3];

          return response.send({
            success: true,
            pedidos: pedidos.length,
            productos: cols.length
          });
        })
        .catch(reason => {
          logger.error(`msg`, reason);
          return response.status(400).send({ reason: "unknown" });
        });
    });
});

router.route("/:idPedido").get((req, res) => {
  console.log(req.params.idPedido);
  Pedido.findById(req.params.idPedido)
    .then(pedido => res.json(pedido))
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
