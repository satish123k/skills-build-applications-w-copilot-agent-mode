import mongoose, { Schema, model } from 'mongoose';
const workoutSchema = new Schema({
    name: { type: String, required: true, unique: true, trim: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    durationMinutes: { type: Number, required: true, min: 10 },
    focusArea: { type: String, default: 'Full body' },
    description: { type: String, default: 'A balanced training session.' },
}, { timestamps: true });
export const Workout = mongoose.models.Workout || model('Workout', workoutSchema);
export default Workout;
