import app from "../app.js";
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();
//Declaramos puerto
const port = process.env.Port || 3000;

//iniciar servidor
app.listen(port, () => {
    console.log('servidor corriendo en el puerto = ' + port);
});

//conexion con mongoose
mongoose.connect(process.env.MONGODB_URI)
.then(() =>
    console.log('conectando a la base de datos Atlas'))
    .catch((error) =>
    console.error(error))

