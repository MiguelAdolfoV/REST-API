import { Schema, model } from "mongoose";

const metaSchema = new Schema({
    usuario: {
        type: String,
        required: true
    },
    meta: {
        type: String,
        default: true
    },
    consejo: {
        type: String,
        required: true
    }
},{
    timestamps: true,
    versionKey: false
});

export default model('Meta' ,metaSchema);