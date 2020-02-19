const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

router.post("/signup", (req, res, next) => {
  const userName = req.body.userName;
  User.find({ userName: userName }).then(user => {
    if (user.length >= 1) {
      res.status(409).json({ message: "El usuario ya fue dado de alta." });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ error: "Contraseña inválida" });
        } else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            userName: req.body.userName,
            password: hash
          });
          user
            .save()
            .then(result =>
              res.status(201).json({ message: "Usuario creado." })
            )
            .catch(err => res.status(500).json({ error: err }));
        }
      });
    }
  });
});

router.post("/login", (req, res, next) => {
  User.find({ userName: req.body.userName })
    .exec()
    .then(user => {
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
              userName: user[0].userName,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Usuario autenticado !!",
            token
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
});
module.exports = router;
