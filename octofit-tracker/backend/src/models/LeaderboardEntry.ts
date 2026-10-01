import mongoose, { Schema, model, type InferSchemaType } from 'mongoose';

const leaderboardEntrySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
    score: { type: Number, required: true, min: 0 },
    rank: { type: Number, min: 1 },
  },
  { timestamps: true },
);

export type LeaderboardEntryDocument = InferSchemaType<typeof leaderboardEntrySchema>;
export const LeaderboardEntry =
  mongoose.models.LeaderboardEntry || model('LeaderboardEntry', leaderboardEntrySchema);
export default LeaderboardEntry;
