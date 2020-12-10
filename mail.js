const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/", (req, res) => {
  nodemailer.createTestAccount((err, account) => {
    const htmlEmail = `
        <h3>Email enviado desde React</h3>
        <ul>
            <li>Email: ${req.body.to}</li>
            <li>Asunto: ${req.body.summary}</li>
        </ul>
        <h3>Mensaje</h3>
        <p>${req.body.description}</p>
      `;
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "adrianfernandezj@gmail.com", //El email del servicio SMTP que va a utilizar (en este caso Gmail)
        pass: "java10denoviembre" // La contraseña de dicho SMTP
      }
    });

    let mailOptions = {
      from: "adrianfernandezj@gmail.com", // Quien manda el email
      to: req.body.to, // El email de destino
      replyTo: "@gmail.com",
      subject: req.body.summary, // El asunto del email
      text: req.body.description, // El mensaje
      html: htmlEmail // La parte HTML del email
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.log(err);
      }
      console.log("Mensaje enviado: %s", info.mensaje);
      console.log("Url del mensaje: %s", nodemailer.getTestMessageUrl(info));
    });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor a la escucha en el puerto ${PORT}`);
});
