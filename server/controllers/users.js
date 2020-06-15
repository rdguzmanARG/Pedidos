let User = require("../models/user.model");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.users_signup = (req, res) => {
  const username = req.body.username;
  User.find({ username: username }).then((user) => {
    if (user.length >= 1) {
      res.status(409).json({ message: "El usuario ya fue dado de alta." });
    } else {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
          if (err) {
            return res.status(500).json({ message: "Contraseña inválida" });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              password: hash,
              isSysAdmin: req.body.isSysAdmin,
              isAdmin: req.body.isAdmin,
              isAdminPed: req.body.isAdminPed,
            });
            user
              .save()
              .then((result) =>
                res.status(201).json({ message: "Usuario registrado." })
              )
              .catch((err) => res.status(500).json({ error: err }));
          }
        });
      });

      // bcryptjs.hash(req.body.password, 10, (err, hash) => {
      //   if (err) {
      //     return res.status(500).json({ message: "Contraseña inválida" });
      //   } else {
      //     const user = new User({
      //       _id: new mongoose.Types.ObjectId(),
      //       username: req.body.username,
      //       password: hash,
      //       isAdmin: req.body.isAdmin
      //     });
      //     user
      //       .save()
      //       .then(result =>
      //         res.status(201).json({ message: "Usuario registrado." })
      //       )
      //       .catch(err => res.status(500).json({ error: err }));
      //   }
      // });
    }
  });
};

exports.users_login = (req, res) => {
  User.find({ username: req.body.username })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Autenticacion invalida",
        });
      }

      bcrypt.compare(req.body.password, user[0].password, function (
        err,
        result
      ) {
        if (err) {
          return res.status(401).json({
            message: "Autenticacion invalida",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              username: user[0].username,
              userId: user[0]._id,
              isSysAdmin: user[0].isSysAdmin,
              isAdmin: user[0].isAdmin,
              isAdminPed: user[0].isAdminPed,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "3h",
            }
          );
          return res
            .header("x-auth-token", token)
            .header("access-control-expose-headers", "x-auth-token")
            .status(200)
            .json({
              message: "Usuario autenticado !!",
            });
        }
        return res.status(401).json({
          message: "Autenticacion invalida",
        });
      });

      // bcrypt.compare(req.body.password, user[0].password, (err, result) => {
      //   if (err) {
      //     return res.status(401).json({
      //       message: "Autenticacion invalida"
      //     });
      //   }
      //   if (result) {
      //     const token = jwt.sign(
      //       {
      //         username: user[0].username,
      //         userId: user[0]._id,
      //         isAdmin: user[0].isAdmin
      //       },
      //       process.env.JWT_KEY,
      //       {
      //         expiresIn: "1h"
      //       }
      //     );
      //     return res
      //       .header("x-auth-token", token)
      //       .header("access-control-expose-headers", "x-auth-token")
      //       .status(200)
      //       .json({
      //         message: "Usuario autenticado !!"
      //       });
      //   }
      //   return res.status(401).json({
      //     message: "Autenticacion invalida"
      //   });
      // });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
};
