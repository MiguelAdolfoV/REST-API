import Ingreso from '../models/Ingreso.js';
import Meta from '../models/Meta.js';
import { predict } from './decisionTree.controller.js';
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

// Obtener todas las metas
export const getMetas = async (req, res) => {
    try {
        const metas = await Meta.find();
        res.json(metas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear una nueva meta
export const createMeta = async (req, res) => {
    try {
      const { usuario, meta, consejo } = req.body;
  
      let consejoFinal = consejo;
  
      // Si no se proporciona un consejo, generarlo con IA
      if (!consejoFinal) {
        const prompt = `Un niño ha establecido la siguiente meta financiera: "${meta}". Dame una lista de 4 consejos para ayudarlo a lograrla. Responde solo con la lista de consejos, sin explicaciones adicionales.`;
  
        const model = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });
  
        consejoFinal = await result.response.text();
      }
  
      const newMeta = new Meta({ usuario, meta, consejo: consejoFinal });
      const metaSave = await newMeta.save();
  
      res.status(201).json(metaSave);
    } catch (error) {
      console.error('Error en createMeta con IA:', error);
      res.status(500).json({ message: error.message });
    }
};

// Controladores existentes...
export const getIngreso = async (req, res) => {
    const ingresos = await Ingreso.find();
    res.json(ingresos);
};

export const getIngresoById = async (req, res) => {
    try {
        const ingreso = await Ingreso.findById(req.params.ingresoId);
        if (!ingreso) {
            return res.status(404).json({ message: 'Ingreso no encontrado' });
        }
        res.json(ingreso);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createIngreso = async (req, res) => {
    try {
        const { usuario, tipo, cantidad } = req.body;
        const newIngreso = new Ingreso({ usuario, tipo, cantidad });
        const ingresoSave = await newIngreso.save();
        res.status(201).json(ingresoSave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateIngreso = async (req, res) => {
    try {
        const { usuario, tipo, cantidad } = req.body;
        const updatedIngreso = await Ingreso.findByIdAndUpdate(req.params.ingresoId, { usuario, tipo, cantidad }, { new: true });
        if (!updatedIngreso) {
            return res.status(404).json({ message: 'Ingreso no encontrado' });
        }
        res.json(updatedIngreso);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteIngreso = async (req, res) => {
    try {
        const deletedIngreso = await Ingreso.findByIdAndDelete(req.params.ingresoId);
        if (!deletedIngreso) {
            return res.status(404).json({ message: 'Ingreso no encontrado' });
        }
        res.json({ message: 'Ingreso borrado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getConsejo = async (req, res) => {
    try {
        const { usuario } = req.body;

        const ingresosData = await Ingreso.find({ usuario });

        const totalIngresos = ingresosData
            .filter(entry => entry.tipo === true)
            .reduce((acc, curr) => acc + curr.cantidad, 0);

        const totalEgresos = ingresosData
            .filter(entry => entry.tipo === false)
            .reduce((acc, curr) => acc + curr.cantidad, 0);

        const balance = totalIngresos - totalEgresos;

        const input = {
            "Ingresos Totales": totalIngresos,
            "Egresos Totales": totalEgresos,
            "Balance": balance
        };

        const consejo = predict(input);

        res.status(200).json({ consejo });
    } catch (error) {
        console.error("Error en getConsejo:", error);
        res.status(500).json({ message: "Error al obtener el consejo financiero" });
    }
};
