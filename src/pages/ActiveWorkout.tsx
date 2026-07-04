import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Play, Pause, SkipForward, CheckCircle, X, Clock,
  Dumbbell, ChevronLeft, ChevronRight, Flame, Trophy
} from 'lucide-react';
import { exercises as exerciseDb } from '../data/exercises';
import { saveSession } from '../lib/storage';
import type { Workout, WorkoutSession, CompletedSet, CompletedExercise } from '../types';
import { workoutPlans } from '../data/workoutPlans';

export default function ActiveWorkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const workout: Workout = location.state?.workout ?? workoutPlans[0].workouts[0];

  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [completedSets, setCompletedSets] = useState<Record<string, CompletedSet[]>>({});
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [totalTime, setTotalTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const restIntervalRef = useRef<number | null>(null);

  const currentExerciseData = workout.exercises[currentExIdx];
  const currentExercise = exerciseDb.find(e => e.id === currentExerciseData?.exerciseId);
  const totalExercises = workout.exercises.length;
  const completedExercises = Object.keys(completedSets).length;

  // Total timer
  useEffect(() => {
    intervalRef.current = window.setInterval(() => setTotalTime(t => t + 1), 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Rest timer
  useEffect(() => {
    if (restTimer !== null && restTimer > 0) {
      restIntervalRef.current = window.setInterval(() => {
        setRestTimer(t => {
          if (t === null || t <= 1) {
            clearInterval(restIntervalRef.current!);
            setIsResting(false);
            return null;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (restIntervalRef.current) clearInterval(restIntervalRef.current!); };
  }, [restTimer, isResting]);

  function formatTime(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  function completeSet() {
    if (!currentExercise || !currentExerciseData) return;
    const completedSet: CompletedSet = {
      setNumber: currentSet,
      reps: parseInt(reps) || parseInt(currentExerciseData.reps) || 10,
      weight: parseFloat(weight) || 0,
      completedAt: new Date().toISOString(),
    };
    const key = currentExerciseData.exerciseId;
    const existing = completedSets[key] || [];
    const newSets = { ...completedSets, [key]: [...existing, completedSet] };
    setCompletedSets(newSets);
    setWeight('');
    setReps('');

    if (currentSet < currentExerciseData.sets) {
      setCurrentSet(s => s + 1);
      setRestTimer(currentExerciseData.restTime);
      setIsResting(true);
    } else {
      // Exercise done
      if (currentExIdx < totalExercises - 1) {
        setCurrentExIdx(i => i + 1);
        setCurrentSet(1);
        setRestTimer(currentExerciseData.restTime);
        setIsResting(true);
      } else {
        finishWorkout(newSets);
      }
    }
  }

  function skipRest() {
    if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    setRestTimer(null);
    setIsResting(false);
  }

  function finishWorkout(sets = completedSets) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const sessionExercises: CompletedExercise[] = Object.entries(sets).map(([exerciseId, s]) => ({
      exerciseId,
      sets: s,
    }));
    const totalVolume = Object.values(sets).flat().reduce((sum, s) => sum + s.weight * s.reps, 0);
    const session: WorkoutSession = {
      id: `session-${Date.now()}`,
      workoutId: workout.id,
      workoutName: workout.name,
      startedAt: new Date(Date.now() - totalTime * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      duration: Math.ceil(totalTime / 60),
      exercises: sessionExercises,
      totalVolume,
      caloriesBurned: Math.round(totalTime / 60 * 8),
    };
    saveSession(session);
    setFinished(true);
  }

  // Finished screen
  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 animate-fade-in">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg glow-orange">
            <Trophy size={40} className="text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-2">Workout Complete!</h1>
          <p className="text-gray-400 mb-6">You crushed it! Here's your summary.</p>
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="card p-4 text-center">
              <Clock size={20} className="mx-auto text-orange-400 mb-2" />
              <div className="font-bold text-white">{formatTime(totalTime)}</div>
              <div className="text-xs text-gray-500">Duration</div>
            </div>
            <div className="card p-4 text-center">
              <CheckCircle size={20} className="mx-auto text-emerald-400 mb-2" />
              <div className="font-bold text-white">{Object.keys(completedSets).length}</div>
              <div className="text-xs text-gray-500">Exercises</div>
            </div>
            <div className="card p-4 text-center">
              <Flame size={20} className="mx-auto text-red-400 mb-2" />
              <div className="font-bold text-white">{Math.round(totalTime / 60 * 8)}</div>
              <div className="text-xs text-gray-500">Calories</div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link to="/" className="btn-primary w-full py-3">Back to Dashboard</Link>
            <Link to="/progress" className="btn-secondary w-full py-3">View Progress</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 lg:px-8 py-4 border-b border-gray-800">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-gray-200 text-sm">
          <X size={18} />
          <span className="hidden sm:inline">Exit</span>
        </button>
        <div className="text-center">
          <h1 className="font-semibold text-white text-sm">{workout.name}</h1>
          <p className="text-xs text-gray-500">{completedExercises}/{totalExercises} exercises</p>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-orange-400" />
          <span className="text-orange-400 font-mono font-semibold text-sm">{formatTime(totalTime)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
          style={{ width: `${(currentExIdx / totalExercises) * 100}%` }}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Rest Timer Overlay */}
        {isResting && restTimer !== null && (
          <div className="flex flex-col items-center justify-center p-8 py-12 animate-fade-in">
            <p className="text-gray-400 text-sm mb-2 font-medium uppercase tracking-wide">Rest Time</p>
            <div className="font-display text-8xl font-bold text-gradient mb-4">{restTimer}</div>
            <p className="text-gray-500 text-sm mb-6">Next: {exerciseDb.find(e => e.id === workout.exercises[currentExIdx]?.exerciseId)?.name}</p>
            <button onClick={skipRest} className="btn-secondary flex items-center gap-2">
              <SkipForward size={16} />
              Skip Rest
            </button>
          </div>
        )}

        {/* Active Exercise */}
        {!isResting && currentExercise && currentExerciseData && (
          <div className="px-4 lg:px-8 py-6">
            {/* Exercise Nav */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => { if (currentExIdx > 0) { setCurrentExIdx(i => i - 1); setCurrentSet(1); } }}
                disabled={currentExIdx === 0}
                className="p-2 text-gray-500 hover:text-gray-300 disabled:opacity-30"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-gray-400 font-medium">
                Exercise {currentExIdx + 1} of {totalExercises}
              </span>
              <button
                onClick={() => { if (currentExIdx < totalExercises - 1) { setCurrentExIdx(i => i + 1); setCurrentSet(1); } }}
                className="p-2 text-gray-500 hover:text-gray-300"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Exercise Image */}
            <div className="relative h-56 rounded-2xl overflow-hidden mb-6 bg-gray-800">
              <img
                src={currentExercise.imageUrl}
                alt={currentExercise.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h2 className="font-display text-2xl font-bold text-white">{currentExercise.name}</h2>
                <p className="text-gray-300 text-sm">{currentExercise.primaryMuscles.join(', ')}</p>
              </div>
            </div>

            {/* Set Tracker */}
            <div className="card p-5 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">
                  Set {currentSet} of {currentExerciseData.sets}
                </h3>
                <span className="text-sm text-gray-400">{currentExerciseData.reps} reps target</span>
              </div>

              {/* Previous sets */}
              {completedSets[currentExerciseData.exerciseId]?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Completed sets:</p>
                  <div className="flex gap-2 flex-wrap">
                    {completedSets[currentExerciseData.exerciseId].map((s, i) => (
                      <div key={i} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400">
                        {s.weight > 0 ? `${s.weight}lbs × ` : ''}{s.reps} reps
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Weight (lbs)</label>
                  <input
                    type="number"
                    className="input text-center text-lg font-bold"
                    placeholder="0"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Reps</label>
                  <input
                    type="number"
                    className="input text-center text-lg font-bold"
                    placeholder={currentExerciseData.reps}
                    value={reps}
                    onChange={e => setReps(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={completeSet}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-lg"
              >
                <CheckCircle size={20} />
                Complete Set {currentSet}
              </button>
            </div>

            {/* Exercise Queue */}
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Up Next</p>
              <div className="space-y-2">
                {workout.exercises.slice(currentExIdx + 1, currentExIdx + 3).map((we, i) => {
                  const ex = exerciseDb.find(e => e.id === we.exerciseId);
                  if (!ex) return null;
                  return (
                    <div key={we.exerciseId} className="flex items-center gap-3 p-3 bg-gray-800/40 rounded-xl">
                      <span className="text-xs text-gray-600 w-4">{currentExIdx + 2 + i}</span>
                      <img src={ex.imageUrl} alt={ex.name} className="w-8 h-8 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-400">{ex.name}</p>
                        <p className="text-xs text-gray-600">{we.sets}×{we.reps}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Finish */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => finishWorkout()}
          className="w-full py-3 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-xl transition-colors"
        >
          Finish Workout Early
        </button>
      </div>
    </div>
  );
}
