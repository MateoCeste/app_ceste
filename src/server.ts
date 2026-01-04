import express from "express";
import colors from "colors";
import cors, { CorsOptions } from 'cors'
import productsRouter from "./routes/router";
import db from "./config/db";
import swaggerUi from "swagger-ui-express";
import swaggerSpec, { swaggerUiOptions } from "./config/swagger";
import morgan from 'morgan';


// Conectar a base de datos
export async function connectDB() {
  // Aquí iría la lógica para conectar a la base de datos
  try {
    // Simulación de conexión exitosa
    await db.authenticate();
    db.sync(); // Sincronizar modelos
    console.log(colors.green("Conexión a la base de datos exitosa"));
  } catch (error) {
    console.error(colors.red.bold("Error al conectar a la base de datos"), error);
  }
}

connectDB();

// Instancia de express
const server = express();

//Permitir conexiones
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (origin === process.env.FRONTEND_URL) {
      callback(null, true)
    } else {
      callback(new Error('Error de CORS'))
    }
  }
}
server.use(cors(corsOptions))

// Leer datos de formularios
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(morgan('dev'))
server.use("/api/products", productsRouter);

//Docs
server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

export default server;