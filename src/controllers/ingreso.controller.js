import Ingreso from '../models/Ingreso.js';
import joblib from 'joblib';

// Cargar el modelo entrenado
const loadedModel = joblib.load('../models/financial_advice_model.pkl'); 
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

// Nuevo servicio: getConsejo
export const getConsejo = async (req, res) => {
    try {
        const { usuario } = req.body;
        
        // Obtener todos los ingresos y egresos del usuario
        const ingresosData = await Ingreso.find({ usuario });
        
        // Calcular ingresos totales y egresos totales
        const totalIngresos = ingresosData
            .filter(entry => entry.tipo === true)
            .reduce((acc, curr) => acc + curr.cantidad, 0);

        const totalEgresos = ingresosData
            .filter(entry => entry.tipo === false)
            .reduce((acc, curr) => acc + curr.cantidad, 0);

        const balance = totalIngresos - totalEgresos;

        // Preparar los datos para la IA
        const userData = [[totalIngresos, totalEgresos, balance]];

        // Obtener el consejo de la IA
        const consejo = loadedModel.predict(userData)[0];

        // Enviar el consejo como respuesta
        res.status(200).json({ consejo });
    } catch (error) {
        console.error("Error en getConsejo:", error);
        res.status(500).json({ message: "Error al obtener el consejo financiero" });
    }
};
