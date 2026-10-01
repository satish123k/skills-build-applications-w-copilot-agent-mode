import mongoose from 'mongoose';
import { Activity } from '../models/Activity.js';
import { LeaderboardEntry } from '../models/LeaderboardEntry.js';
import { Team } from '../models/Team.js';
import { User } from '../models/User.js';
import { Workout } from '../models/Workout.js';
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
    try {
        await mongoose.connect(connectionString);
        console.log('Connected to octofit_db');
        await Promise.all([
            User.deleteMany({}),
            Team.deleteMany({}),
            Activity.deleteMany({}),
            LeaderboardEntry.deleteMany({}),
            Workout.deleteMany({}),
        ]);
        const teams = await Team.insertMany([
            { name: 'Trailblazers', sport: 'Cross-country', members: 4, color: '#10b981' },
            { name: 'Velocity', sport: 'Circuit training', members: 3, color: '#f59e0b' },
            { name: 'Summit Striders', sport: 'Running club', members: 5, color: '#8b5cf6' },
        ]);
        const teamMap = Object.fromEntries(teams.map((team) => [team.name, team._id]));
        const users = await User.insertMany([
            { name: 'Ada', email: 'ada@example.com', teamId: teamMap['Trailblazers'], age: 17, goal: 'Improve endurance' },
            { name: 'Lin', email: 'lin@example.com', teamId: teamMap['Velocity'], age: 16, goal: 'Build strength' },
            { name: 'Omar', email: 'omar@example.com', teamId: teamMap['Trailblazers'], age: 18, goal: 'Train for a 5K' },
            { name: 'Priya', email: 'priya@example.com', teamId: teamMap['Summit Striders'], age: 15, goal: 'Stay active' },
        ]);
        const userMap = Object.fromEntries(users.map((user) => [user.name, user._id]));
        await Activity.insertMany([
            { userId: userMap['Ada'], type: 'Run', durationMinutes: 32, date: '2026-10-01', caloriesBurned: 320 },
            { userId: userMap['Lin'], type: 'Strength', durationMinutes: 45, date: '2026-10-01', caloriesBurned: 280 },
            { userId: userMap['Omar'], type: 'Cycling', durationMinutes: 38, date: '2026-10-02', caloriesBurned: 350 },
            { userId: userMap['Priya'], type: 'Mobility', durationMinutes: 20, date: '2026-10-02', caloriesBurned: 110 },
        ]);
        await LeaderboardEntry.insertMany([
            { userId: userMap['Ada'], name: 'Ada', teamId: teamMap['Trailblazers'], score: 980, rank: 1 },
            { userId: userMap['Lin'], name: 'Lin', teamId: teamMap['Velocity'], score: 930, rank: 2 },
            { userId: userMap['Omar'], name: 'Omar', teamId: teamMap['Trailblazers'], score: 902, rank: 3 },
            { userId: userMap['Priya'], name: 'Priya', teamId: teamMap['Summit Striders'], score: 874, rank: 4 },
        ]);
        await Workout.insertMany([
            { name: 'Cardio Blast', difficulty: 'medium', durationMinutes: 25, focusArea: 'Cardio', description: 'Intervals to raise heart rate and boost endurance.' },
            { name: 'Power Circuit', difficulty: 'hard', durationMinutes: 40, focusArea: 'Strength', description: 'A full-body circuit with compound lifts and bodyweight sets.' },
            { name: 'Mobility Reset', difficulty: 'easy', durationMinutes: 18, focusArea: 'Recovery', description: 'Gentle stretching and core mobility for recovery days.' },
        ]);
        console.log('Database seeding complete');
        await mongoose.disconnect();
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seedDatabase();
