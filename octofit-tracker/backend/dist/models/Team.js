import mongoose, { Schema, model } from 'mongoose';
const teamSchema = new Schema({
    name: { type: String, required: true, unique: true, trim: true },
    sport: { type: String, default: 'Fitness' },
    members: { type: Number, default: 0, min: 0 },
    color: { type: String, default: '#3b82f6' },
}, { timestamps: true });
export const Team = mongoose.models.Team || model('Team', teamSchema);
export default Team;
