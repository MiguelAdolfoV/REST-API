import { Schema, model } from "mongoose";

const ingresoSchema = new Schema({
    usuario: {
        type: String,
        required: true
    },
    tipo: {
        type: Boolean,
        default: true
    },
    cantidad: {
        type: String,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Cantidad', cantidadSchema)