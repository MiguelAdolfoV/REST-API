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
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Ingreso', ingresoSchema);
