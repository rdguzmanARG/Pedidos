const Turno = require("../models/turno.model");
const Entrega = require("../models/entrega.model");
const Pedido = require("../models/pedido.model");
const mongoose = require("mongoose");
const moment = require("moment");

exports.turnos_disponibles = (req, res) => {
  Turno.find({ idPedido: null })
    .then((allTurnos) => {
      let turnos = [];
      let dias = [];
      const now = new Date();

      allTurnos.forEach((element) => {
        if (
          turnos.filter(
            (f) =>
              f.dia.toLocaleString() === element.dia.toLocaleString() &&
              f.hora === element.hora
          ).length === 0
        ) {
          if (
            dias.filter(
              (f) => f.dia.toLocaleString() === element.dia.toLocaleString()
            ).length === 0
          ) {
            dias.push({ dia: element.dia });
          }

          if (
            moment(now).format("DD/MM/YYYY") >=
            moment(element.dia).format("DD/MM/YYYY")
          ) {
            if (now.getHours() + 1 < parseInt(element.hora.substr(0, 2))) {
              turnos.push(element);
            }
          } else {
            turnos.push(element);
          }
        }
      });
      const retorno = { dias, turnos };
      res.status(200).json(retorno);
    })
    .catch((err) => res.status(500).json({ Error: err }));
};

exports.turnos_confirmar = (req, res) => {
  Turno.find({ idPedido: req.body.idPedido })
    .then((turnos) => {
      if (turnos.length === 0) {
        Turno.findByIdAndUpdate(req.params.idTurno, req.body, { new: true })
          .exec()
          .then((turno) => {
            Pedido.findByIdAndUpdate(req.body.idPedido, { turno })
              .then(() => {
                res.json(turno);
              })
              .catch((err) => res.status(500).json("Error: " + err));
          })
          .catch((err) => res.status(500).json("Error: " + err));
      } else {
        res.json(turnos[0]);
      }
    })
    .catch((err) => res.status(500).json("Error: " + err));
};

exports.turnos_anular = (req, res) => {
  Turno.findByIdAndUpdate(req.params.idTurno, { idPedido: null }, { new: true })
    .exec()
    .then((turno) => {
      Pedido.findByIdAndUpdate(req.body.idPedido, { turno: null })
        .then(() => {
          res.json(turno);
        })
        .catch((err) => res.status(500).json("Error: " + err));
    })
    .catch((err) => res.status(500).json("Error: " + err));
};

exports.turnos_procesar = (req, res) => {
  const personas = 3;
  const frecuencia = 15;

  Turno.find({ idPedido: { $ne: null } })
    .then((data) => {
      if (data.length > 0) {
        res.status(403).json({
          message:
            "Hay pedidos reservados, no se pueden modificar los horarios.",
        });
        return;
      }
      const { dia1, dia1DesdeH, dia1DesdeM, dia1HastaH, dia1HastaM } = req.body;
      const { dia2, dia2DesdeH, dia2DesdeM, dia2HastaH, dia2HastaM } = req.body;
      let hora = dia1DesdeH;
      let minuto = dia1DesdeM;
      let turnos = [];

      // Procesa Dia 1
      while (hora != dia1HastaH || minuto != dia1HastaM) {
        // proceso el horario
        for (let index = 0; index < personas; index++) {
          turnos.push(
            new Turno({
              dia: dia1,
              hora:
                (hora <= 9 ? "0" : "") +
                hora +
                ":" +
                (minuto <= 9 ? "0" : "") +
                minuto,
              idPedido: null,
            })
          );
        }
        // incremento la frecuencia
        minuto = minuto + frecuencia;
        if (minuto >= 60) {
          minuto = 0;
          hora = hora + 1;
        }
      }

      // Procesa Dia 2
      if (dia2 != null && dia2DesdeH != null && dia2HastaH != null) {
        let hora = dia2DesdeH;
        let minuto = dia2DesdeM;
        while (hora != dia2HastaH || minuto != dia2HastaM) {
          // proceso el horario
          for (let index = 0; index < personas; index++) {
            turnos.push(
              new Turno({
                dia: dia2,
                hora:
                  (hora <= 9 ? "0" : "") +
                  hora +
                  ":" +
                  (minuto <= 9 ? "0" : "") +
                  minuto,
                idPedido: null,
              })
            );
          }
          // incremento la frecuencia
          minuto = minuto + frecuencia;
          if (minuto >= 60) {
            minuto = 0;
            hora = hora + 1;
          }
        }
      }

      Turno.deleteMany({})
        .then(() => {
          Turno.insertMany(turnos)
            .then((data) => {
              // Busca la Entrega
              Entrega.findOne()
                .sort({ fechaImportacion: -1 })
                .then((entrega) => {
                  const dia1str =
                    moment(new Date(dia1)).format("DD/MM/YYYY") +
                    " de " +
                    (dia1DesdeH < 9 ? "0" + dia1DesdeH : dia1DesdeH) +
                    ":" +
                    (dia1DesdeM < 9 ? "0" + dia1DesdeM : dia1DesdeM) +
                    " a " +
                    (dia1HastaH < 9 ? "0" + dia1HastaH : dia1HastaH) +
                    ":" +
                    (dia1HastaM < 9 ? "0" + dia1HastaM : dia1HastaM);

                  entrega.dia1Horarios = dia1str;
                  let dia2str = null;
                  if (dia2HastaH != null) {
                    dia2str =
                      moment(new Date(dia2)).format("DD/MM/YYYY") +
                      " de " +
                      (dia2DesdeH < 9 ? "0" + dia2DesdeH : dia2DesdeH) +
                      ":" +
                      (dia2DesdeM < 9 ? "0" + dia2DesdeM : dia2DesdeM) +
                      " a " +
                      (dia2HastaH < 9 ? "0" + dia2HastaH : dia2HastaH) +
                      ":" +
                      (dia2HastaM < 9 ? "0" + dia2HastaM : dia2HastaM);
                    entrega.dia2Horarios = dia2str;
                  }
                  Entrega.findByIdAndUpdate(entrega._id, entrega, { new: true })
                    .then(() => {
                      res.status(200).json({ dia1str, dia2str: dia2str });
                    })
                    .catch((err) => res.status(500).json("Error: " + err));
                })
                .catch((err) => {
                  res.status(500).json("Error: " + err);
                });
            })
            .catch((err) => res.status(500).json("Error: " + err));
        })
        .catch((err) => res.status(500).json("Error: " + err));
    })
    .catch((err) => res.status(500).json("Error: " + err));
};
