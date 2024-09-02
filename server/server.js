import dotenv from 'dotenv/config';
import express from "express";
import cors from 'cors';
import db from "./db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_FRONTEND,
  credentials: true
}));

app.use(express.static("public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    return cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

app.get("/", async(req, res) => {
  try {
    const sql = "SELECT * FROM writing";
    const [result] = await db.query(sql);
    res.json(result);
    console.log(result);
    console.table(result);
  } catch (error) {
    console.error("Database error:", error);
  }
});

app.get("/upload", async (req, res) => {
  try {
    const sql = "SELECT * FROM imagenes";
    const [result] = await db.query(sql);
    res.json(result);
    
    // console.log(result);
    // // Convertir el resultado a una cadena JSON con pretty print
    // const resultString = JSON.stringify(result, (key, value) => {
    //   if (typeof value === 'object' && value !== null) {
    //     // Verificar si el valor es un array de objetos
    //     if (Array.isArray(value)) {
    //       return value.map(item => (typeof item === 'object' ? item : item.toString()));
    //     }
    //     return value;
    //   }
    //   return value;
    // }, 2);
    // console.log(resultString);

    // console.log(util.inspect(result, { showHidden: false, depth: null, colors: true }));
    console.dir(result, { depth: null, colors: true });
    
    console.table(result);
    
  } catch (error) {
    console.error("Database error:", error);
  }
});


app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const filename = req.file.filename;
    const filepath = req.file.path;
    const {name_character, info} = req.body;

    // Validar el formato de cada opción
    const parsedInfos = JSON.parse(info);
    for (const infos of parsedInfos) {
        if (typeof infos.amigo !== 'string' || typeof infos.demonio !== 'boolean') {
            return res.status(400).json({ message: 'Formato de opciones incorrecto, se requiere name_option como string y answer como boolean' });
        }
    }

    // Asegurarse de que las opciones tengan las claves correctas en el orden correcto
    const formattedInfos = parsedInfos.map(info => ({
      amigo: info.amigo,
      demonio: info.demonio
    }));

    const sql = "INSERT INTO imagenes (name_character, filename, filepath, info) VALUES (?,?,?, ?)";
    const values = [name_character, filename, filepath, JSON.stringify(formattedInfos)];

    const [result] = await db.query(sql, values);

    console.log("Imagen subida y datos almacenados en la base de datos");
    console.log(req.body);
    console.log(req.file);
    console.log(result);
    res.json(result);
  } catch (error) {
    console.log("Error al almacenar los datos en la base de datos.", error);
  }
});

app.get("/upload/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const sql = "SELECT * FROM imagenes WHERE id = ?";
    const [result] = await db.query(sql, [id]);
    res.json(result);
    console.log(result);
    console.table(result);
  } catch (error) {
    console.error("Database error:", error);
  }
});

app.put("/update/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id;
  const filename = req.file.filename;
  const filepath = req.file.path;
  const {name_character, info} = req.body;

  try {
    // Obtener la información de la imagen anterior
    const selectSql = "SELECT filepath FROM imagenes WHERE id = ?";
    const [selectResult] = await db.query(selectSql, [id]);
    const oldFilepath = selectResult[0].filepath;

    // Validar el formato de cada opción
    const parsedInfos = JSON.parse(info);
    for (const infos of parsedInfos) {
        if (typeof infos.amigo !== 'string' || typeof infos.demonio !== 'boolean') {
            return res.status(400).json({ message: 'Formato de opciones incorrecto, se requiere name_option como string y answer como boolean' });
        }
    }

    // Asegurarse de que las opciones tengan las claves correctas en el orden correcto
    const formattedInfos = parsedInfos.map(info => ({
      amigo: info.amigo,
      demonio: info.demonio
    }));

    // Eliminar la imagen anterior del servidor
    fs.unlink(oldFilepath, (err) => {
      if (err) {
        console.error("Error al eliminar la imagen anterior:", err);
      }
    });

    const sql = "UPDATE imagenes SET name_character = ?, filename = ?, filepath = ?, info = ? WHERE id = ?";
    const values = [name_character, filename, filepath, JSON.stringify(formattedInfos), id];

    const [result] = await db.query(sql, values);
    console.log(result);

    console.log(req.body);
    console.log(req.file);
  } catch (error) {
    console.error("Database error:", error);
  }
});

// Ruta para eliminar una imagen
app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Obtener la información de la imagen a eliminar
    const selectSql = "SELECT filepath FROM imagenes WHERE id = ?";
    const [resultSelect] = await db.query(selectSql, [id]);
    if (resultSelect.length === 0) {
      return res.status(404).send("Imagen no encontrada.");
    }

    // Eliminar el registro de la base de datos
    

    const filepath = resultSelect[0].filepath;
    // Eliminar la imagen del servidor
    fs.unlink(filepath, (err) => {
      if (err) {
        console.error("Error al eliminar la imagen:", err);
      }
    });

    const deleteSql = "DELETE FROM imagenes WHERE id = ?";
    const [result] = await db.query(deleteSql, [id]);
    console.log(result);
  } catch (error) {
    console.log("Error al eliminar los datos en la base de datos.");

    console.error("Database error:", error);
  }
});



app.listen(PORT, () => {
  console.log(`Server escuchando en el puerto ${PORT}`);
});
