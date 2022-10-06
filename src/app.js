const express = require("express");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const { engine } = require("express-handlebars");
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access");
const Handlebars = require("handlebars");
const { extname } = require("path");
require("dotenv").config(); //!! modulo dotenv para leer archivos .env

//* Initializations
const app = express();
require("./database");

//* Settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
      partialsDir: path.join(app.get("views"), "partials"),
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    extname: "handlebars",
  })
);
app.set("view engine", "handlebars");

//* Middlewares
app.use(morgan("dev"));

//* metodo de express para obtener los datos json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//* ubicacion de las imagenes usando multer, para subir imagenes
const storage = multer.diskStorage({
  //!destino de las imagnes
  destination: path.join(__dirname, "public/uploads"),
  //! le coloco un nombre a las imagenes usando la hora en milisegundo y
  //! le concateno su extencion usando file.originalname
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  },
});
app.use(multer({ storage }).single("image"));

//* Routes
app.use(require("./routes"));

module.exports = app;
