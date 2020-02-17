const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");

const pedidosRouter = require("./routes/pedidos");
const productosRouter = require("./routes/productos");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
//app.use(express.static("dist"));

const uri = process.env.DB_URL;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully.");

  app.use("/api/pedidos", pedidosRouter);
  app.use("/api/productos", productosRouter);

  app.use((req, res, next) => {
    const error = new Error("Resource not exists.");
    error.status = 404;
    next(error);
  });

  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
  });

  app.listen(port, () => {
    console.log("Server is running on port " + port);
  });
});
