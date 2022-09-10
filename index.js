const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const router = express.Router();
const path = require("path");

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);
app.use("/images", express.static(path.join(__dirname, "public/images")));
/* Cuando usamos app.use(), le estamos diciendo a Express que use un Middleware, el Middleware básicamente es un bloque de código o función que se ejecuta entre la petición que hace el usuario hasta que la petición llega al servidor, funciona como una especie de proxy.
express.static() busca y devuelve los archivos estáticos solicitados por el usuario y recibe como parámetro la ruta del folder donde están esos archivos.
Utilizamos el modulo path para proporcionar una ruta absoluta de la carpeta, ya que se colocas la ruta directamente estarías proporcionando una ruta relativa y si ejecutas la aplicación desde otro directorio o similar puedes tener problemas, por ello se recomienda utilizar la ruta absoluta y módulo path nos ayuda con eso. */

//middleware
app.use(express.json());
/* app.use(helmet()); */
/* Helmet.js es un módulo de Node.js que ayuda a proteger los encabezados HTTP. Se implementa en aplicaciones express. Por lo tanto, podemos decir que helmet.js ayuda a proteger las aplicaciones express. Configura varios encabezados HTTP para evitar ataques como Cross-Site-Scripting (XSS), clickjacking, etc.
Por qué es importante la seguridad de los encabezados HTTP: a veces, los desarrolladores ignoran los encabezados HTTP. Dado que los encabezados HTTP pueden filtrar información confidencial sobre la aplicación, es importante utilizar los encabezados de forma segura. */

/* app.use(morgan("common")); */
/*Es un middleware para la captura de solicitudes HTTP para Node.js para su posterior registro y seguimiento. 
Morgan es un Middleware de nivel de solicitud HTTP. Es una gran herramienta que registra las requests junto con alguna otra información dependiendo de su configuración y el valor predeterminado utilizado. Demuestra ser muy útil durante la depuración y también si desea crear archivos de registro.
Explicación: Básicamente, configuramos Morgan, y dado que es un middleware, usamos el método .use() para decirle a express que lo use como middleware en nuestra aplicación. */

/* Multer es un "middleware" de node.js para el manejo de multipart/form-data, el cuál es usado sobre todo para la subida de archivos.  */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api running");
  });
}

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
