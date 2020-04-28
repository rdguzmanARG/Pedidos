const nodemailer = require("nodemailer");
const Pedido = require("../models/pedido.model");

exports.sendEmails = (pedidos) => {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PSW,
      },
    });
    let emails = [];
    if (process.env.ENVIRONMENT == "PRODUCCION") {
      emails = pedidos.map((ped) => {
        return {
          idPedido: ped._id,
          nombre: ped.nombre,
          apellido: ped.apellido,
          email: ped.email,
        };
      });
    } else {
      emails = pedidos.map((ped) => {
        return {
          idPedido: ped._id,
          nombre: ped.nombre,
          apellido: ped.apellido,
          email:
            ped.nombre.toLowerCase().indexOf("e") >= 0
              ? "laura.grisolia@gmail.com"
              : "ricardo.deguzman@gmail.com",
        };
      });
    }

    SendAllEmails(transporter, emails)
      .then((data) => {
        return resolve(data);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

SendAllEmails = function (transporter, pedidos) {
  var promises = pedidos.map(function (pe) {
    const code = pe.idPedido.toString();

    var mailOptions = {
      from: process.env.EMAIL_SENDER,
      to: pe.email,
      subject: "Nodo Temperley - Pedido",
      html: `
      <div>
        <p>Hola ${pe.nombre} ${
        pe.apellido
      }, tu pedido al NODO Temperley, se esta procesado.</p>
        <p>Podes ingresar al sitio y con este CODIGO: ${code
          .substr(code.length - 5)
          .toUpperCase()} y tu E-mail podes ver su estado, las veces que lo desees..</p>
        <a href="http://nodo-temperley.azurewebsites.net/mi-pedido/${pe.idPedido.toString()}">ver pedido</a>
        <p>Muchas Gracias</p>
        <p>Nodo Temperley</p>
      </div>`,
    };

    const prom = transporter
      .sendMail(mailOptions)
      .then(() => {
        return new Promise((resolve, reject) => {
          Pedido.findByIdAndUpdate(pe.idPedido, { emailEnviado: 1 })
            .then(() => {
              resolve({ result: "Pudo Enviar", email: pe.email });
            })
            .catch((err) => reject({ error: err }));
        });
      })
      .catch((err) => {
        console.log(err);
        if (err.responseCode == 454 || err.responseCode == 550) {
          reject({ result: "Error al procesar datos", email: pe.email });
        } else {
          return new Promise((resolve, reject) => {
            Pedido.findByIdAndUpdate(pe.idPedido, { emailEnviado: 2 })
              .then(() => {
                resolve({ result: "No Pudo Enviar", email: pe.email });
              })
              .catch((err) => {
                reject({ result: "Error al procesar datos", email: pe.email });
              });
          });
        }
      });
    return prom;
  });
  return Promise.all(promises);
};
