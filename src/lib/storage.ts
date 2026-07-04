import type { Workout, WorkoutSession, UserProfile } from '../types';
import { sampleWorkoutHistory, defaultProfile, personalRecords as defaultPRs } from '../data/userData';

const KEYS = {
  WORKOUTS: 'fitguide_custom_workouts',
  SESSIONS: 'fitguide_sessions',
  PROFILE: 'fitguide_profile',
  FAVORITES: 'fitguide_favorites',
  PRs: 'fitguide_prs',
  ACTIVE_WORKOUT: 'fitguide_active_workout',
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Custom Workouts ──────────────────────────────────────────────────────
export function getCustomWorkouts(): Workout[] {
  return getItem(KEYS.WORKOUTS, []);
}

export function saveWorkout(workout: Workout): void {
  const workouts = getCustomWorkouts();
  const idx = workouts.findIndex(w => w.id === workout.id);
  if (idx >= 0) workouts[idx] = workout;
  else workouts.push(workout);
  setItem(KEYS.WORKOUTS, workouts);
}

export function deleteWorkout(id: string): void {
  const workouts = getCustomWorkouts().filter(w => w.id !== id);
  setItem(KEYS.WORKOUTS, workouts);
}

// ── Sessions ─────────────────────────────────────────────────────────────
export function getSessions(): WorkoutSession[] {
  return getItem(KEYS.SESSIONS, sampleWorkoutHistory);
}

export function saveSession(session: WorkoutSession): void {
  const sessions = getSessions();
  sessions.unshift(session);
  setItem(KEYS.SESSIONS, sessions);
  
  // Update profile total workouts
  const profile = getProfile();
  profile.totalWorkouts += 1;
  saveProfile(profile);
}

// ── Profile ───────────────────────────────────────────────────────────────
export function getProfile(): UserProfile {
  return getItem(KEYS.PROFILE, defaultProfile);
}

export function saveProfile(profile: UserProfile): void {
  setItem(KEYS.PROFILE, profile);
}

// ── Favorites ─────────────────────────────────────────────────────────────
export function getFavorites(): string[] {
  return getItem(KEYS.FAVORITES, defaultProfile.favoriteExercises);
}

export function toggleFavorite(exerciseId: string): boolean {
  const favs = getFavorites();
  const idx = favs.indexOf(exerciseId);
  if (idx >= 0) {
    favs.splice(idx, 1);
    setItem(KEYS.FAVORITES, favs);
    return false;
  } else {
    favs.push(exerciseId);
    setItem(KEYS.FAVORITES, favs);
    return true;
  }
}

// ── Personal Records ──────────────────────────────────────────────────────
export function getPersonalRecords() {
  return getItem(KEYS.PRs, defaultPRs);
}

export function updatePersonalRecord(exerciseId: string, exerciseName: string, weight: number, reps: number) {
  const prs = getPersonalRecords();
  const idx = prs.findIndex(pr => pr.exerciseId === exerciseId);
  const entry = { exerciseId, exerciseName, weight, reps, achievedAt: new Date().toISOString().split('T')[0] };
  if (idx >= 0) {
    if (weight > prs[idx].weight) prs[idx] = entry;
  } else {
    prs.push(entry);
  }
  setItem(KEYS.PRs, prs);
}

// ── Active Workout ────────────────────────────────────────────────────────
export function saveActiveWorkout(data: unknown): void {
  setItem(KEYS.ACTIVE_WORKOUT, data);
}

export function getActiveWorkout() {
  return getItem(KEYS.ACTIVE_WORKOUT, null);
}

export function clearActiveWorkout(): void {
  localStorage.removeItem(KEYS.ACTIVE_WORKOUT);
}
