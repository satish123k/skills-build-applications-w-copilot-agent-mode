import express from 'express';
import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import database from './config/database.js';
import { Activity } from './models/Activity.js';
import { LeaderboardEntry } from './models/LeaderboardEntry.js';
import { Team } from './models/Team.js';
import { User } from './models/User.js';
import { Workout } from './models/Workout.js';

const app = express();
const port = Number(process.env.PORT ?? 8000);
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`;

const fallbackUsers = [
  { id: 1, name: 'Ada', email: 'ada@example.com', teamId: 1 },
  { id: 2, name: 'Lin', email: 'lin@example.com', teamId: 2 },
];

const fallbackTeams = [
  { id: 1, name: 'Trailblazers', members: 2 },
  { id: 2, name: 'Velocity', members: 1 },
];

const fallbackActivities = [
  { id: 1, type: 'Run', durationMinutes: 30, userId: 1, date: '2026-10-01' },
  { id: 2, type: 'Strength', durationMinutes: 45, userId: 2, date: '2026-10-01' },
];

const fallbackLeaderboard = [
  { id: 1, userId: 1, name: 'Ada', score: 980 },
  { id: 2, userId: 2, name: 'Lin', score: 910 },
];

const fallbackWorkouts = [
  { id: 1, name: 'Cardio Blast', difficulty: 'medium', durationMinutes: 25 },
  { id: 2, name: 'Power Circuit', difficulty: 'hard', durationMinutes: 40 },
];

app.use(express.json());

app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    response.sendStatus(204);
    return;
  }

  next();
});

const getModelData = async <T>(Model: any, fallbackData: T[]): Promise<T[]> => {
  if (mongoose.connection.readyState !== 1) {
    return fallbackData;
  }

  try {
    return (await Model.find({}).lean()) as T[];
  } catch {
    return fallbackData;
  }
};

const createResource = <T>(items: T[], payload: Partial<T>): T => ({
  ...(payload as T),
  id: items.length ? Math.max(...items.map((item) => Number((item as { id?: number }).id ?? 0))) + 1 : 1,
}) as T;

app.get('/api', (_request: Request, response: Response) => {
  response.json({
    status: 'ok',
    apiBaseUrl,
    routes: ['/api/users/', '/api/teams/', '/api/activities/', '/api/leaderboard/', '/api/workouts/'],
  });
});

app.get('/api/health', (_request: Request, response: Response) => {
  response.json({
    status: 'ok',
    database: database.readyState === 1 ? 'connected' : 'disconnected',
    apiBaseUrl,
  });
});

app.get('/api/users/', async (_request: Request, response: Response) => {
  const users = await getModelData(User, fallbackUsers);
  response.json(users);
});

app.post('/api/users/', async (request: Request, response: Response) => {
  if (mongoose.connection.readyState === 1) {
    const created = await User.create(request.body ?? {});
    response.status(201).json(created);
    return;
  }

  const createdUser = createResource(fallbackUsers, request.body ?? {});
  fallbackUsers.push(createdUser);
  response.status(201).json(createdUser);
});

app.get('/api/teams/', async (_request: Request, response: Response) => {
  const teams = await getModelData(Team, fallbackTeams);
  response.json(teams);
});

app.post('/api/teams/', async (request: Request, response: Response) => {
  if (mongoose.connection.readyState === 1) {
    const created = await Team.create(request.body ?? {});
    response.status(201).json(created);
    return;
  }

  const createdTeam = createResource(fallbackTeams, request.body ?? {});
  fallbackTeams.push(createdTeam);
  response.status(201).json(createdTeam);
});

app.get('/api/activities/', async (_request: Request, response: Response) => {
  const activities = await getModelData(Activity, fallbackActivities);
  response.json(activities);
});

app.post('/api/activities/', async (request: Request, response: Response) => {
  if (mongoose.connection.readyState === 1) {
    const created = await Activity.create(request.body ?? {});
    response.status(201).json(created);
    return;
  }

  const createdActivity = createResource(fallbackActivities, request.body ?? {});
  fallbackActivities.push(createdActivity);
  response.status(201).json(createdActivity);
});

app.get('/api/leaderboard/', async (_request: Request, response: Response) => {
  const leaderboard = await getModelData(LeaderboardEntry, fallbackLeaderboard);
  response.json(leaderboard);
});

app.post('/api/leaderboard/', async (request: Request, response: Response) => {
  if (mongoose.connection.readyState === 1) {
    const created = await LeaderboardEntry.create(request.body ?? {});
    response.status(201).json(created);
    return;
  }

  const createdLeaderboardEntry = createResource(fallbackLeaderboard, request.body ?? {});
  fallbackLeaderboard.push(createdLeaderboardEntry);
  response.status(201).json(createdLeaderboardEntry);
});

app.get('/api/workouts/', async (_request: Request, response: Response) => {
  const workouts = await getModelData(Workout, fallbackWorkouts);
  response.json(workouts);
});

app.post('/api/workouts/', async (request: Request, response: Response) => {
  if (mongoose.connection.readyState === 1) {
    const created = await Workout.create(request.body ?? {});
    response.status(201).json(created);
    return;
  }

  const createdWorkout = createResource(fallbackWorkouts, request.body ?? {});
  fallbackWorkouts.push(createdWorkout);
  response.status(201).json(createdWorkout);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`OctoFit API listening on port ${port}`);
  console.log(`API base URL: ${apiBaseUrl}`);
});

export { apiBaseUrl, database, fallbackUsers, fallbackTeams, fallbackActivities, fallbackLeaderboard, fallbackWorkouts };