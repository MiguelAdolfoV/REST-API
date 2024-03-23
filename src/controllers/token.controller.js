

// Variables de entorno 
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

//const ONE_MINUTE = 60 * 1000;
const SECRET = process.env.SECRET;

export const signToken = async (id) => {
  try {
      const payload = {
          id,
          // exp: Math.floor(Date.now() / 1000) + ONE_MINUTE, // Expresado en segundos
      };

      const token = jwt.sign(payload, SECRET);
      return token;
  } catch (error) {
      throw new Error(error.message);
  }
};

  // Función para verificar el token
export const verify_Token = async (token) => {
  try {
    const decodedToken = jwt.verify(token, SECRET);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
  