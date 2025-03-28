import Ingreso from '../models/Ingreso.js';
import { predict } from './decisionTree.controller.js';
import Meta from '../models/Meta.js';
import User from '../models/User.js';



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

export const getMetasByUsuario = async (req, res) => {
    try {
        const { usuario } = req.params;

        // Buscar ID del usuario por nombre
        const user = await User.findOne({ username: usuario });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Buscar metas con el ID del usuario
        const metas = await Meta.find({ usuario: user._id });

        if (!metas.length) {
            return res.status(404).json({ message: "No se encontraron metas para este usuario" });
        }

        res.status(200).json(metas);
    } catch (error) {
        console.error("Error en getMetasByUsuario:", error);
        res.status(500).json({ message: "Error al obtener las metas" });
    }
};

import User from '../models/User.js';
import Meta from '../models/Meta.js';

export const createMeta = async (req, res) => {
    try {
        const { usuario, meta, consejo } = req.body;

        if (!usuario || !meta || !consejo) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Buscar ID del usuario por su nombre
        const user = await User.findOne({ username: usuario });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Crear meta con el ID del usuario
        const newMeta = new Meta({ usuario: user._id, meta, consejo });
        const savedMeta = await newMeta.save();

        res.status(201).json(savedMeta);
    } catch (error) {
        console.error("Error en createMeta:", error);
        res.status(500).json({ message: "Error al crear la meta" });
    }
};
