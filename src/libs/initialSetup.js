//importar el modelo de datos Role
import Role from "../models/Role";

//exportar funcion para crear roles
export const createRoles = async () =>{
    try{
        //verificar si existen los roles en la base de datos
        const count = await Role.estimatedDocumentCount();

        //si no existen roles, crearlos
        if(count > 0 ) return;

        //Crear roles por defecto envueltos en una promesa
        const values = await Promise.all([
            new Role({name: "user"}).save(),
            new Role({name: "moderator"}).save(),
            new Role({name: "admin"}).save()

        ]);
        console.log(values);
    }catch(error){
        console.error(error);
    }
}
