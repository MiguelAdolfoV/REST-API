import * as messages from "./Art/Messages.js";
import cors from 'cors';
import express from 'express';
const app = express();
app.use(express.json());

//crear roles por defecto
import { createRoles } from './src/libs/initialSetup.js';
createRoles();

//Ruta inicial
app.get('/', (req, res) =>{
    res.send(messages.Welcome)
});


app.use(cors(
  {
    origin: "*",
    methods: ["POST", "GET"],
    credentials: true
  }
))

//rutas
import authRoutes from './src/routes/auth.routes.js';
import ingresoRoutes from './src/routes/ingreso.routes.js';
app.use('/api/auth',authRoutes);
app.use('/api/ingreso',ingresoRoutes);


export default app;