import mongoose, { Schema, model } from 'mongoose';
const activitySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    date: { type: String, required: true },
    caloriesBurned: { type: Number, default: 0, min: 0 },
}, { timestamps: true });
export const Activity = mongoose.models.Activity || model('Activity', activitySchema);
export default Activity;
