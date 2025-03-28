import mongoose from 'mongoose';

const MetaSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    meta: { type: String, required: true },
    consejo: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Meta', MetaSchema);
