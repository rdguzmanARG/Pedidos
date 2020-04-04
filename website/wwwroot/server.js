const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

app.use("/", express.static(__dirname + "/"));

app.get("/*", (req, res) => {
  if (req.hostname != "localhost") {
    if (req.protocol == "https") {
      res.redirect("http://" + req.hostname + req.path);
    } else {
      res.sendFile(__dirname + "/index.html");
    }
  } else {
    res.sendFile(__dirname + "/index.html");
  }
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
