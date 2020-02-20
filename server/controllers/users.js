let User = require("../models/user.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.users_signup = (req, res) => {
  const username = req.body.username;
  User.find({ username: username }).then(user => {
    if (user.length >= 1) {
      res.status(409).json({ message: "El usuario ya fue dado de alta." });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ message: "Contraseña inválida" });
        } else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            username: req.body.username,
            password: hash,
            isAdmin: req.body.isAdmin
          });
          user
            .save()
            .then(result =>
              res.status(201).json({ message: "Usuario registrado." })
            )
            .catch(err => res.status(500).json({ error: err }));
        }
      });
    }
  });
};

exports.users_login = (req, res) => {
  User.find({ username: req.body.username })
    .exec()
    .then(user => {
      console.log(user);
      if (user.length < 1) {
        return res.status(401).json({
          message: "Autenticacion invalida"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Autenticacion invalida"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              username: user[0].username,
              userId: user[0]._id,
              isAdmin: user[0].isAdmin
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h"
            }
          );
          return res
            .header("x-auth-token", token)
            .header("access-control-expose-headers", "x-auth-token")
            .status(200)
            .json({
              message: "Usuario autenticado !!"
            });
        }
        return res.status(401).json({
          message: "Autenticacion invalida"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
};
