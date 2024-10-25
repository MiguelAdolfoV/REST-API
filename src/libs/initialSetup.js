import Role from "../models/Role.js"

//Funcion para crear roles
export const createRoles = async () =>{
    try{
        //verificar si ya existen los roles
        const count = await Role.estimatedDocumentCount();

        //crear los roles si no existen
        if(count > 0) return;

        const values = await Promise.all([
            new Role({name: "customer"}).save(),
            new Role({name: "admin"}).save()
        ]);
        console.log(values);
    }catch(error){
        console.error(error);
    }
}