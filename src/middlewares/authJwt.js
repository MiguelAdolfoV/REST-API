import User from '../models/User.js';
import Role from "../models/Role.js";
import { verify_Token } from '../controllers/token.controller.js';
import * as messages from "../../Art/Messages.js";



// valida si el token es valido
export const verifyToken = async (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).json({ message: "no se ha proporcionado token" });


    try {
        // extraer la informacion de el token
        const decoded = await verify_Token(token);
        req.userId = decoded.id;

        // buscar usuario en la base de datos
        const user = await User.findById(req.userId, { password: 0 });

        // validar si el usuario existe
        if (!user) return res.status(404).json({ message: "usuario no encontrado" });

        // continuar con la siguiente acción si el usuario existe
        next();
    } catch (error) {
        return res.status(401).json({ message: "token inválido" , token: token});
    }
    

};

export const isAdmin = async (req,res,next) => {
    //Busca el usuario en la base de datos
    const user = await User.findById(req.userId);
    //Buscar los roles de el ususario
    const roles = await Role.find({ _id: {$in: user.roles} });
    //console.log(roles);

    //Recorrer roles de ususario
    for(let i =0; i < roles.length; i++){
        if(roles[i].name == "admin"){
                next();
                return;

        }
    }
    
    return res.status(403).json({message: messages.adminRequired});
}

export const isCustomer = async(req,res,next) => {
 //Busca el usuario en la base de datos
 const user = await User.findById(req.userId);
 //Buscar los roles de el ususario
 const roles = await Role.find({ _id: {$in: user.roles} });
 //console.log(roles);

 //Recorrer roles de ususario
 for(let i =0; i < roles.length; i++){
     if(roles[i].name == "customer" || roles[i].name == "admin"){
             next();
             return;

     }
 }
 
 return res.status(403).json({message: messages.customerRequired});
}
