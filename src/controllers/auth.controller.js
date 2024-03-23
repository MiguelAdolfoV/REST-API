//importar modelo de datos USE
import { response } from "express";
import User from "../models/User";
import Role from "../models/Role";
import { signToken,verifyToken } from "./token.controller";

//exportar las funciones de singup y singin
export const singup = async (req, res) => {
  //Extraer datos de la peticion
  const { username, email, password } = req.body;

  //crear nuevo usuario
  const newUser = new User({
    username,
    email,
    password: await User.encryptPassword(password),
  });


  //condicional para asignar roles, si no se envia rol se asigna usuario
  if (req.body.roles) {
    const foundRoles = await Role.find({ name: { $in: req.body.roles } });
    newUser.roles = foundRoles.map((role) => role.id);
  } else {
    const role = await Role.findOne({ name: "user" });
    newUser.roles = [role.id];
  }

  //Guardar usuario en la base de datos
  const saveUser = await newUser.save();
  console.log(newUser);

  //responder al cliente
  res.json(singup);
};

export const signin = async (req, res) => {
  //buscar usuario por correo
  const userFound = await User.findOne({email: req.body.email}).populate("roles");
  //si no se encuentra el usuario, enviar mensaje de error
  if(!userFound) return res.status(400).json({message: "usuariono encontrado"});
  //verifcar contra
  const matchPassword = await User.comparePassword(req.body.password, userFound.password);
 // const matchPassword = await userFound.comparePassword(req.body.password);

  //error si no coincide
  if(!matchPassword) return res.status(401).json({token: null, message: "contraseña incorrecta"});

  //generar token
  const token = await signToken(userFound.id);
    
  // responder con el token
  res.json({ token });

};
