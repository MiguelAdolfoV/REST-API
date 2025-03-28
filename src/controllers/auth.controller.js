//importar modelos
import User from "../models/User.js";
import Role from "../models/Role.js";

//importar controlador de token
import * as token from "../controllers/token.controller.js"

//importar mensajes
 import * as messages from "../../Art/Messages.js"

 export const signUp = async (req, res) => {
    try {
        // Extraer datos de la petición
        const { username, email, password } = req.body;

        // Verificar si el correo ya está registrado
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "El correo ya está registrado" });
        }

        // Crear nuevo usuario
        const newUser = new User({
            username,
            email,
            password: await User.encryptPassword(password),
        });

        if (req.body.roles) {
            const foundRoles = await Role.find({ name: { $in: req.body.roles } });
            newUser.roles = foundRoles.map(role => role.id);
        } else {
            const role = await Role.findOne({ name: "customer" });
            newUser.roles = [role.id];
        }

        const saveUser = await newUser.save();
        console.log(saveUser);

        // Responder
        res.json(messages.savedUserSimple);
    } catch (error) {
        console.error("Error in signUp:", error);
        res.status(500).json({ message: "Ha ocurrido un error en el servidor" });
    }
};

export const signIn = async (req, res) => {
    try {
        //verificar correo
        const userFound = await User.findOne({ email: req.body.email }).populate("roles");
        if (!userFound) {
            return res.status(400).json({ message: messages.notFoundEmail });
        }
        //verificar contra   
        const matchPasword = await User.comparePassword(req.body.password, userFound.password);
        if (!matchPasword) {
            return res.status(401).json({ message: messages.notFoundPassword });
        }

        const generatedToken = await token.signToken(userFound.id);
        //Usuario encontrado
        //console.log(userFound);
        res.status(200).json({ token: generatedToken, user: userFound });
    } catch (error) {
        console.error("Error in signIn:", error);
        res.status(500).json({ message: "A server error has occurred" });
    }
};
