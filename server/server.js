const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");

const pedidosRoutes = require("./routes/pedidos");
const productosRoutes = require("./routes/productos");
const usersRoutes = require("./routes/users");
const entregasRoutes = require("./routes/entregas");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
//app.use(express.static("dist"));

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: false,
    useFindAndModify: false
  })
  .then(() => {
    console.log("MongoDB database connection established successfully.");
    app.use("/api/pedidos", pedidosRoutes);
    app.use("/api/productos", productosRoutes);
    app.use("/api/users", usersRoutes);
    app.use("/api/entregas", entregasRoutes);
    app.use((req, res, next) => {
      const error = new Error("Resource does not exists.");
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
  })
  .catch(error => console.log(error));
