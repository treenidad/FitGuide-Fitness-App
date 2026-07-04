import type { UserProfile, WorkoutSession, PersonalRecord } from '../types';

export const defaultProfile: UserProfile = {
  id: 'user-1',
  name: 'Alex Johnson',
  age: 28,
  weight: 175,
  height: 71,
  fitnessGoal: 'Build muscle and improve overall fitness',
  experienceLevel: 'Intermediate',
  favoriteExercises: ['bench-press', 'squat', 'deadlift', 'pull-ups'],
  workoutStreak: 7,
  totalWorkouts: 47,
  joinedAt: '2024-01-15',
  avatarUrl: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
};

export const sampleWorkoutHistory: WorkoutSession[] = [
  {
    id: 'ws-1',
    workoutId: 'bfb-day-a',
    workoutName: 'Full Body Day A',
    startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 47 * 60 * 1000).toISOString(),
    duration: 47,
    exercises: [
      { exerciseId: 'squat', sets: [{ setNumber: 1, reps: 8, weight: 135, completedAt: '' }, { setNumber: 2, reps: 8, weight: 145, completedAt: '' }, { setNumber: 3, reps: 7, weight: 155, completedAt: '' }] },
      { exerciseId: 'bench-press', sets: [{ setNumber: 1, reps: 8, weight: 135, completedAt: '' }, { setNumber: 2, reps: 8, weight: 145, completedAt: '' }, { setNumber: 3, reps: 6, weight: 155, completedAt: '' }] },
    ],
    totalVolume: 8760,
    caloriesBurned: 380,
  },
  {
    id: 'ws-2',
    workoutId: 'upper-pull',
    workoutName: 'Pull Day',
    startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 58 * 60 * 1000).toISOString(),
    duration: 58,
    exercises: [
      { exerciseId: 'pull-ups', sets: [{ setNumber: 1, reps: 8, weight: 0, completedAt: '' }, { setNumber: 2, reps: 7, weight: 0, completedAt: '' }, { setNumber: 3, reps: 6, weight: 0, completedAt: '' }] },
      { exerciseId: 'dumbbell-curl', sets: [{ setNumber: 1, reps: 12, weight: 35, completedAt: '' }, { setNumber: 2, reps: 12, weight: 35, completedAt: '' }, { setNumber: 3, reps: 10, weight: 40, completedAt: '' }] },
    ],
    totalVolume: 3570,
    caloriesBurned: 420,
  },
  {
    id: 'ws-3',
    workoutId: 'leg-day-1',
    workoutName: 'Leg Day - Quad Focus',
    startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 65 * 60 * 1000).toISOString(),
    duration: 65,
    exercises: [
      { exerciseId: 'squat', sets: [{ setNumber: 1, reps: 6, weight: 185, completedAt: '' }, { setNumber: 2, reps: 6, weight: 195, completedAt: '' }, { setNumber: 3, reps: 5, weight: 205, completedAt: '' }, { setNumber: 4, reps: 5, weight: 205, completedAt: '' }] },
      { exerciseId: 'leg-press', sets: [{ setNumber: 1, reps: 12, weight: 270, completedAt: '' }, { setNumber: 2, reps: 12, weight: 280, completedAt: '' }, { setNumber: 3, reps: 10, weight: 290, completedAt: '' }] },
    ],
    totalVolume: 11880,
    caloriesBurned: 510,
  },
  {
    id: 'ws-4',
    workoutId: 'hyp-chest',
    workoutName: 'Chest & Triceps',
    startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 62 * 60 * 1000).toISOString(),
    duration: 62,
    exercises: [
      { exerciseId: 'bench-press', sets: [{ setNumber: 1, reps: 10, weight: 155, completedAt: '' }, { setNumber: 2, reps: 8, weight: 165, completedAt: '' }, { setNumber: 3, reps: 8, weight: 165, completedAt: '' }, { setNumber: 4, reps: 7, weight: 175, completedAt: '' }] },
      { exerciseId: 'incline-press', sets: [{ setNumber: 1, reps: 12, weight: 45, completedAt: '' }, { setNumber: 2, reps: 12, weight: 50, completedAt: '' }, { setNumber: 3, reps: 10, weight: 55, completedAt: '' }] },
    ],
    totalVolume: 10270,
    caloriesBurned: 450,
  },
  {
    id: 'ws-5',
    workoutId: 'bfb-day-b',
    workoutName: 'Full Body Day B',
    startedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000 + 52 * 60 * 1000).toISOString(),
    duration: 52,
    exercises: [
      { exerciseId: 'deadlift', sets: [{ setNumber: 1, reps: 5, weight: 225, completedAt: '' }, { setNumber: 2, reps: 5, weight: 245, completedAt: '' }, { setNumber: 3, reps: 4, weight: 265, completedAt: '' }] },
    ],
    totalVolume: 9050,
    caloriesBurned: 400,
  },
  {
    id: 'ws-6',
    workoutId: 'home-upper',
    workoutName: 'Home Upper Body',
    startedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000 + 38 * 60 * 1000).toISOString(),
    duration: 38,
    exercises: [
      { exerciseId: 'push-ups', sets: [{ setNumber: 1, reps: 20, weight: 0, completedAt: '' }, { setNumber: 2, reps: 18, weight: 0, completedAt: '' }, { setNumber: 3, reps: 15, weight: 0, completedAt: '' }] },
    ],
    totalVolume: 0,
    caloriesBurned: 290,
  },
  {
    id: 'ws-7',
    workoutId: 'wl-circuit-1',
    workoutName: 'Fat Burn Circuit A',
    startedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000 + 42 * 60 * 1000).toISOString(),
    duration: 42,
    exercises: [
      { exerciseId: 'burpees', sets: [{ setNumber: 1, reps: 12, weight: 0, completedAt: '' }, { setNumber: 2, reps: 10, weight: 0, completedAt: '' }, { setNumber: 3, reps: 10, weight: 0, completedAt: '' }] },
    ],
    totalVolume: 0,
    caloriesBurned: 480,
  },
];

export const personalRecords: PersonalRecord[] = [
  { exerciseId: 'squat', exerciseName: 'Barbell Squat', weight: 225, reps: 5, achievedAt: '2024-11-15' },
  { exerciseId: 'bench-press', exerciseName: 'Bench Press', weight: 185, reps: 3, achievedAt: '2024-11-20' },
  { exerciseId: 'deadlift', exerciseName: 'Deadlift', weight: 275, reps: 3, achievedAt: '2024-11-10' },
  { exerciseId: 'shoulder-press', exerciseName: 'Overhead Press', weight: 115, reps: 5, achievedAt: '2024-10-28' },
  { exerciseId: 'dumbbell-curl', exerciseName: 'Dumbbell Curl', weight: 45, reps: 8, achievedAt: '2024-11-05' },
  { exerciseId: 'pull-ups', exerciseName: 'Pull-Ups', weight: 25, reps: 5, achievedAt: '2024-11-18' },
];

export const weeklyProgress = [
  { week: 'Oct 14', workouts: 4, volume: 32400, calories: 1840 },
  { week: 'Oct 21', workouts: 3, volume: 28900, calories: 1520 },
  { week: 'Oct 28', workouts: 5, volume: 41200, calories: 2340 },
  { week: 'Nov 4', workouts: 4, volume: 38700, calories: 2100 },
  { week: 'Nov 11', workouts: 5, volume: 44500, calories: 2480 },
  { week: 'Nov 18', workouts: 4, volume: 42100, calories: 2290 },
  { week: 'Nov 25', workouts: 3, volume: 35200, calories: 1910 },
  { week: 'Dec 2', workouts: 5, volume: 47800, calories: 2620 },
];

export const strengthProgress = {
  squat: [
    { date: 'Sep', weight: 155 },
    { date: 'Oct', weight: 175 },
    { date: 'Nov', weight: 195 },
    { date: 'Dec', weight: 215 },
    { date: 'Jan', weight: 225 },
  ],
  benchPress: [
    { date: 'Sep', weight: 115 },
    { date: 'Oct', weight: 135 },
    { date: 'Nov', weight: 155 },
    { date: 'Dec', weight: 175 },
    { date: 'Jan', weight: 185 },
  ],
  deadlift: [
    { date: 'Sep', weight: 185 },
    { date: 'Oct', weight: 215 },
    { date: 'Nov', weight: 235 },
    { date: 'Dec', weight: 255 },
    { date: 'Jan', weight: 275 },
  ],
};
