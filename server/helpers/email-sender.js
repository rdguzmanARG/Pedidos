const nodemailer = require("nodemailer");
const Pedido = require("../models/pedido.model");

exports.sendEmails = (entrega, pedidos) => {
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

    SendAllEmails(transporter, emails, entrega)
      .then((data) => {
        return resolve(data);
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

SendAllEmails = function (transporter, pedidos, entrega) {
  var promises = pedidos.map(function (pe) {
    let dias = `<li>${entrega.dia1Horarios}</li>`;
    dias += entrega.dia2Horarios && `<li>${entrega.dia2Horarios}</li>`;

    var mailOptions = {
      from: process.env.EMAIL_SENDER,
      to: pe.email,
      subject: "Nodo Temperley - Pedido",
      html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="viewport" content="width=device-width" />
      
          <style type="text/css">
            * {
              margin: 0;
              padding: 0;
              font-size: 100%;
              font-family: "Avenir Next", "Helvetica Neue", "Helvetica", Helvetica,
                Arial, sans-serif;
              line-height: 1.65;
            }
      
            img {
              max-width: 100%;
              margin: 0 auto;
              display: block;
            }
      
            body,
            .body-wrap {
              width: 100% !important;
              height: 100%;
              background: #f8f8f8;
              color:#5f6368;
            }
      
            a {
              color: #71bc37;
              text-decoration: none;
            }
      
            a:hover {
              text-decoration: underline;
            }
      
            ul {
              margin-left: 20px;
            }
      
            .text-center {
              text-align: center;
            }
      
            .text-right {
              text-align: right;
            }
      
            .text-left {
              text-align: left;
            }
      
            .button {
              display: inline-block;
              color: white;
              background: #71bc37;
              border: solid #71bc37;
              border-width: 10px 20px 8px;
              font-weight: bold;
              border-radius: 4px;
            }
      
            .button:hover {
              text-decoration: none;
            }
      
            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
              margin-bottom: 20px;
              line-height: 1.25;
            }
      
            h1 {
              font-size: 32px;
            }
      
            h2 {
              font-size: 28px;
            }
      
            h3 {
              font-size: 24px;
            }
      
            h4 {
              font-size: 20px;
            }
      
            h5 {
              font-size: 16px;
            }
      
            p,
            ul,
            ol {
              font-size: 16px;
              font-weight: normal;
              margin-bottom: 20px;
            }
      
            .container {
              display: block !important;
              clear: both !important;
              margin: 0 auto !important;
              max-width: 580px !important;
            }
      
            .container table {
              width: 100% !important;
              border-collapse: collapse;
            }
            .text-green {
              color: #71bc37 !important;
            }
            .text-white {
              color: white !important;
            }
            .container .masthead {
              padding: 80px 0;
              background: #71bc37;
              color: white;
            }
      
            .container .masthead h1 {
              margin: 0 auto !important;
              max-width: 90%;
              text-transform: uppercase;
            }
      
            .container .content {
              background: white;
              padding: 30px 35px;
            }
      
            .container .content.footer {
              background: none;
            }
      
            .container .content.footer p {
              margin-bottom: 0;
              color: #888;
              text-align: center;
              font-size: 14px;
            }

            span.im  {
              color: #5f6368 !important;
            }
              

            .container .content.footer a {
              color: #888;
              text-decoration: none;
              font-weight: bold;
            }
      
            .container .content.footer a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <table class="body-wrap">
            <tr>
              <td class="container">
                <!-- Message start -->
                <table>
                  <tr>
                    <td align="center" class="masthead">
                      <h1>NODO Temperley</h1>
                    </td>
                  </tr>
                  <tr>
                    <td class="content">
                      <h2>Hola, ${pe.nombre} ${pe.apellido}</h2>
                      <p>En los próximos días vamos a estar procesando tu pedido, podes consultar su estado desde nuestro Sitio.</p><p><b>Si vas a retirar tu pedido por nuestra casa, reservá un <b>día y horario</b> para retirarlo.</b></p>
                      <h3>Día/s y horario/s disponible/s</h3>
                      <ul>
                        ${dias}
                      </ul>
                      <table>
                        <tr>
                          <td align="center">
                            <p>
                              <a
                                href="http://nodo-temperley.azurewebsites.net/mi-pedido/${pe.idPedido.toString()}"
                                class="button text-white"
                                >VER PEDIDO</a
                              >
                            </p>
                          </td>
                        </tr>
                      </table>                      
                      <p>
                        Si queres ver mas información de LA CHAPANAY - Nodo Temperley
                        hace click
                        <a
                          class="text-green"
                          href="https://nodo-temperley.azurewebsites.net"
                        >
                          AQUI...</a
                        >.
                      </p>
                      <p>
                        Muchas Gracias!!
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="container">
                <!-- Message start -->
                <table>
                  <tr>
                    <td class="content footer" align="center">
                      <p>© 2020 <a href="#">Diseñado por MrcGo</a>, 11-3208-9799</p>
                      <p>
                        <a href="mailto:">ricardo.deguzman@gmail.com</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
      `,
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
