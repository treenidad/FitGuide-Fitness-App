export type Category = 'Strength' | 'Cardio' | 'Flexibility' | 'Mobility' | 'Calisthenics';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type MuscleGroup = 
  | 'Chest' | 'Back' | 'Shoulders' | 'Biceps' | 'Triceps' 
  | 'Forearms' | 'Core' | 'Glutes' | 'Quadriceps' | 'Hamstrings' 
  | 'Calves' | 'Hip Flexors' | 'Full Body' | 'Lats' | 'Traps';

export type Equipment = 
  | 'Barbell' | 'Dumbbell' | 'Kettlebell' | 'Cable Machine' 
  | 'Pull-up Bar' | 'Bench' | 'Dip Bars' | 'Resistance Bands'
  | 'Bodyweight' | 'Leg Press Machine' | 'Lat Pulldown Machine' | 'Mat';

export interface Exercise {
  id: string;
  name: string;
  category: Category;
  equipment: Equipment[];
  difficulty: Difficulty;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  imageUrl: string;
  videoUrl: string;
  description: string;
  instructions: string[];
  commonMistakes: string[];
  safetyTips: string[];
  variations: string[];
  recommendedSets: number;
  recommendedReps: string;
  restTime: number; // seconds
  caloriesPerMinute: number;
  tags: string[];
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: string;
  weight?: number;
  restTime: number;
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: WorkoutExercise[];
  estimatedDuration: number; // minutes
  difficulty: Difficulty;
  category: string;
  createdAt: string;
  updatedAt: string;
  isPlan?: boolean;
  planId?: string;
  imageUrl?: string;
  tags: string[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: string; // e.g. "8 weeks"
  frequency: string; // e.g. "4x per week"
  difficulty: Difficulty;
  goal: string;
  workouts: Workout[];
  imageUrl: string;
  tags: string[];
}

export interface CompletedSet {
  setNumber: number;
  reps: number;
  weight: number;
  completedAt: string;
}

export interface CompletedExercise {
  exerciseId: string;
  sets: CompletedSet[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  workoutName: string;
  startedAt: string;
  completedAt?: string;
  duration: number; // minutes
  exercises: CompletedExercise[];
  totalVolume: number;
  caloriesBurned: number;
  notes?: string;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  achievedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  fitnessGoal: string;
  experienceLevel: Difficulty;
  favoriteExercises: string[];
  workoutStreak: number;
  totalWorkouts: number;
  joinedAt: string;
  avatarUrl?: string;
}

export interface AICoachRequest {
  equipment: Equipment[];
  goal: 'fat_loss' | 'muscle_gain' | 'strength' | 'endurance' | 'general_fitness';
  duration: number; // minutes
  experienceLevel: Difficulty;
  muscleGroups?: MuscleGroup[];
  excludeExercises?: string[];
}

export interface AIGeneratedWorkout {
  name: string;
  description: string;
  exercises: WorkoutExercise[];
  estimatedDuration: number;
  difficulty: Difficulty;
  tips: string[];
  warmup: string[];
  cooldown: string[];
  nutrition: string[];
}
