import  express  from "express";
import productsRouters from './src/routes/products.routes';
import authRutes from './src/routes/auth.routes';
import tokenRoutes from './src/routes/token.routes';
import { createRoles } from "./src/libs/initialSetup";



const app = express();
app.use(express.json());

//Ejecutar funcion para crear roles por defecto
createRoles();

//endpint index
app.get('/', (req,res) => {
    res.send("Bienvenido a mi API");
});

//endpoint para productos
app.use('/api/products', productsRouters);

//endpoint para auth
app.use('/api/auth', authRutes);

//enpoint para token
app.use('/api/token',tokenRoutes);

export default app;
