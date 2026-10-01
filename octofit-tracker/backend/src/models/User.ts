import mongoose, { Schema, model, type InferSchemaType } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    age: { type: Number, min: 10, max: 100 },
    goal: { type: String, default: 'Build consistency' },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema>;
export const User = mongoose.models.User || model('User', userSchema);
export default User;
