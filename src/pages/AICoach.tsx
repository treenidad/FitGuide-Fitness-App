import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain, Zap, Play, RefreshCw, ChevronDown, ChevronUp,
  CheckCircle, Dumbbell, Clock, Target, Apple, Lightbulb,
  Flame, ArrowRight
} from 'lucide-react';
import { exercises as exerciseDb } from '../data/exercises';
import type { AICoachRequest, AIGeneratedWorkout, Equipment, Difficulty, MuscleGroup } from '../types';
import PageHeader from '../components/PageHeader';

const equipmentOptions: { id: Equipment; label: string; icon: string }[] = [
  { id: 'Bodyweight', label: 'Bodyweight', icon: '🤸' },
  { id: 'Dumbbell', label: 'Dumbbells', icon: '⚖️' },
  { id: 'Barbell', label: 'Barbell', icon: '🏋️' },
  { id: 'Kettlebell', label: 'Kettlebell', icon: '🔔' },
  { id: 'Pull-up Bar', label: 'Pull-up Bar', icon: '🔼' },
  { id: 'Bench', label: 'Bench', icon: '🛋️' },
  { id: 'Cable Machine', label: 'Cable Machine', icon: '📻' },
  { id: 'Resistance Bands', label: 'Resistance Bands', icon: '〰️' },
  { id: 'Dip Bars', label: 'Dip Bars', icon: '✌️' },
  { id: 'Leg Press Machine', label: 'Leg Press', icon: '🦵' },
  { id: 'Lat Pulldown Machine', label: 'Lat Pulldown', icon: '💪' },
];

const goalOptions = [
  { id: 'fat_loss' as const, label: 'Fat Loss', icon: '🔥', description: 'Burn fat & improve conditioning', color: 'from-orange-500 to-red-500' },
  { id: 'muscle_gain' as const, label: 'Muscle Gain', icon: '💪', description: 'Build size & muscle mass', color: 'from-blue-500 to-indigo-500' },
  { id: 'strength' as const, label: 'Strength', icon: '⚡', description: 'Maximize power & lifts', color: 'from-amber-500 to-yellow-500' },
  { id: 'endurance' as const, label: 'Endurance', icon: '🏃', description: 'Improve stamina & cardio', color: 'from-teal-500 to-cyan-500' },
  { id: 'general_fitness' as const, label: 'General Fitness', icon: '🎯', description: 'Overall health & fitness', color: 'from-emerald-500 to-green-500' },
];

const durationOptions = [20, 30, 45, 60, 75, 90];
const experienceLevels: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];

function generateWorkout(req: AICoachRequest): AIGeneratedWorkout {
  // Filter eligible exercises based on available equipment and experience
  let eligible = exerciseDb.filter(ex => {
    const hasEquipment = ex.equipment.some(e => req.equipment.includes(e)) || ex.equipment.includes('Bodyweight');
    const levelOk = req.experienceLevel === 'Advanced' ? true
      : req.experienceLevel === 'Intermediate' ? ex.difficulty !== 'Advanced'
      : ex.difficulty === 'Beginner';
    return hasEquipment && levelOk;
  });

  // Goal-based exercise selection
  let selectedExercises = [];
  const numExercises = Math.max(4, Math.min(8, Math.floor(req.duration / 8)));
  
  if (req.goal === 'fat_loss' || req.goal === 'endurance') {
    // Prioritize cardio and compound movements with short rest
    const cardio = eligible.filter(e => e.category === 'Cardio' || e.tags.includes('plyometric'));
    const compound = eligible.filter(e => e.tags.includes('compound') && !cardio.includes(e));
    selectedExercises = [...cardio.slice(0, Math.ceil(numExercises * 0.4)), ...compound.slice(0, numExercises)].slice(0, numExercises);
  } else if (req.goal === 'muscle_gain') {
    // Prioritize compound + isolation splits
    const compound = eligible.filter(e => e.tags.includes('compound'));
    const isolation = eligible.filter(e => !e.tags.includes('compound'));
    selectedExercises = [...compound.slice(0, Math.ceil(numExercises * 0.6)), ...isolation.slice(0, numExercises)].slice(0, numExercises);
  } else if (req.goal === 'strength') {
    // Prioritize compound heavy movements
    const bigLifts = eligible.filter(e => ['squat', 'deadlift', 'bench-press', 'shoulder-press', 'bent-over-row'].includes(e.id));
    const other = eligible.filter(e => e.tags.includes('compound') && !bigLifts.includes(e));
    selectedExercises = [...bigLifts.slice(0, 3), ...other.slice(0, numExercises)].slice(0, numExercises);
  } else {
    // General balanced selection
    const categories = ['Strength', 'Cardio', 'Calisthenics'];
    for (const cat of categories) {
      const catExs = eligible.filter(e => e.category === cat);
      selectedExercises.push(...catExs.slice(0, Math.ceil(numExercises / 3)));
    }
    selectedExercises = selectedExercises.slice(0, numExercises);
  }

  // Ensure we have enough exercises
  if (selectedExercises.length < numExercises) {
    const remaining = eligible.filter(e => !selectedExercises.includes(e));
    selectedExercises.push(...remaining.slice(0, numExercises - selectedExercises.length));
  }

  // Build exercise parameters based on goal
  const getParams = (goal: string) => {
    if (goal === 'fat_loss') return { sets: 3, reps: '12-15', rest: 45 };
    if (goal === 'muscle_gain') return { sets: 4, reps: '8-12', rest: 90 };
    if (goal === 'strength') return { sets: 5, reps: '3-5', rest: 180 };
    if (goal === 'endurance') return { sets: 3, reps: '15-20', rest: 30 };
    return { sets: 3, reps: '10-12', rest: 60 };
  };

  const { sets, reps, rest } = getParams(req.goal);
  const workoutExercises = selectedExercises.map(ex => ({
    exerciseId: ex.id,
    sets,
    reps,
    restTime: rest,
  }));

  // Generate tips
  const goalTips: Record<string, string[]> = {
    fat_loss: [
      'Keep rest periods short (30-60s) to maintain elevated heart rate',
      'Focus on compound movements for maximum calorie burn',
      'Consider supersets to increase workout density',
      'Prioritize progressive overload to preserve muscle while cutting',
    ],
    muscle_gain: [
      'Focus on the mind-muscle connection for each rep',
      'Track your weights and aim to progressively overload each week',
      'Consume 0.8-1g of protein per lb of bodyweight daily',
      'Get 7-9 hours of sleep for optimal recovery and growth',
    ],
    strength: [
      'Rest fully between heavy sets (3-5 minutes)',
      'Prioritize technique over weight — form is everything',
      'Deload every 4-6 weeks to prevent overtraining',
      'Track all lifts to ensure consistent progressive overload',
    ],
    endurance: [
      'Keep intensity moderate — you should be able to hold a conversation',
      'Gradually increase workout volume by 10% per week',
      'Stay well hydrated throughout your session',
      'Incorporate variety to prevent adaptation plateaus',
    ],
    general_fitness: [
      'Consistency beats perfection — show up even on low-energy days',
      'Mix strength and cardio across the week for balanced fitness',
      'Listen to your body and rest when needed',
      'Have fun — enjoy the variety in your training',
    ],
  };

  const warmup = [
    '5 minutes light cardio (jogging, jumping jacks, or jump rope)',
    'Hip circles — 10 each direction',
    'Arm circles — 10 forward and backward',
    'Bodyweight squats — 15 reps',
    'Shoulder dislocations with a band or towel — 10 reps',
  ];

  const cooldown = [
    'Light 5-minute walk or slow march in place',
    'Hip flexor stretch — 30 seconds per side',
    'Chest doorway stretch — 30 seconds',
    'Seated hamstring stretch — 30 seconds per side',
    'Child\'s pose — 60 seconds',
  ];

  const nutrition: Record<string, string[]> = {
    fat_loss: [
      'Pre-workout: Light meal 1-2 hours before (banana + protein shake)',
      'Post-workout: Protein-rich meal within 30-60 minutes',
      'Aim for a caloric deficit of 300-500 calories per day',
    ],
    muscle_gain: [
      'Pre-workout: Complex carbs + protein 1-2 hours before',
      'Post-workout: High-protein meal with fast carbs within 45 minutes',
      'Aim for a caloric surplus of 200-300 calories per day',
    ],
    strength: [
      'Pre-workout: Substantial meal 2-3 hours before training',
      'Intra-workout: Consider BCAAs or carbohydrates for sessions over 60 min',
      'Post-workout: Complete protein and carbohydrates within 60 minutes',
    ],
    endurance: [
      'Pre-workout: Carb-focused meal 1-2 hours before',
      'During: Hydrate every 15-20 minutes; electrolytes for sessions over 60 min',
      'Post-workout: Carb + protein combo to replenish glycogen',
    ],
    general_fitness: [
      'Pre-workout: Light snack 30-60 minutes before if needed',
      'Post-workout: Balanced meal with protein, carbs, and vegetables',
      'Focus on whole foods and adequate protein (0.7g per lb bodyweight)',
    ],
  };

  const goalLabels: Record<string, string> = {
    fat_loss: 'Fat Loss',
    muscle_gain: 'Muscle Building',
    strength: 'Strength Training',
    endurance: 'Endurance',
    general_fitness: 'General Fitness',
  };

  return {
    name: `AI ${goalLabels[req.goal]} Workout`,
    description: `Personalized ${req.experienceLevel.toLowerCase()} ${goalLabels[req.goal].toLowerCase()} workout generated for your available equipment and ${req.duration}-minute time slot.`,
    exercises: workoutExercises,
    estimatedDuration: req.duration,
    difficulty: req.experienceLevel,
    tips: goalTips[req.goal] || goalTips.general_fitness,
    warmup,
    cooldown,
    nutrition: nutrition[req.goal] || nutrition.general_fitness,
  };
}

export default function AICoach() {
  const [equipment, setEquipment] = useState<Equipment[]>(['Bodyweight']);
  const [goal, setGoal] = useState<AICoachRequest['goal']>('general_fitness');
  const [duration, setDuration] = useState(45);
  const [experience, setExperience] = useState<Difficulty>('Intermediate');
  const [generatedWorkout, setGeneratedWorkout] = useState<AIGeneratedWorkout | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('exercises');

  function toggleEquipment(eq: Equipment) {
    setEquipment(prev =>
      prev.includes(eq) ? prev.filter(e => e !== eq) : [...prev, eq]
    );
  }

  function generate() {
    setIsGenerating(true);
    setGeneratedWorkout(null);
    // Simulate AI "thinking"
    setTimeout(() => {
      const workout = generateWorkout({ equipment, goal, duration, experienceLevel: experience });
      setGeneratedWorkout(workout);
      setIsGenerating(false);
      setExpandedSection('exercises');
    }, 1500);
  }

  const selectedGoal = goalOptions.find(g => g.id === goal);

  return (
    <div className="px-4 lg:px-8 py-6 animate-fade-in">
      <PageHeader
        title="AI Workout Coach"
        subtitle="Get a personalized workout tailored to you"
      />

      {/* Intro Banner */}
      <div className="card p-5 mb-6 bg-gradient-to-br from-orange-500/10 to-gray-900 border-orange-500/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-orange-500/30">
            <Brain size={24} className="text-orange-400" />
          </div>
          <div>
            <h2 className="font-semibold text-white mb-1">Your Personal AI Coach</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tell me your available equipment, fitness goal, and how long you have — 
              I'll generate a personalized workout routine optimized for your needs.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-5">
          {/* Goal Selection */}
          <div className="card p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Target size={16} className="text-orange-400" />
              Fitness Goal
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {goalOptions.map(g => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    goal === g.id
                      ? 'border-orange-500/50 bg-orange-500/10'
                      : 'border-gray-800 bg-gray-800/40 hover:border-gray-700'
                  }`}
                >
                  <span className="text-xl flex-shrink-0">{g.icon}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${goal === g.id ? 'text-orange-400' : 'text-gray-200'}`}>{g.label}</p>
                    <p className="text-xs text-gray-500">{g.description}</p>
                  </div>
                  {goal === g.id && <CheckCircle size={16} className="text-orange-400 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="card p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Clock size={16} className="text-blue-400" />
              Workout Duration: <span className="text-orange-400">{duration} minutes</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {durationOptions.map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    duration === d
                      ? 'bg-orange-500 text-white border-transparent'
                      : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {d}m
                </button>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="card p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Zap size={16} className="text-amber-400" />
              Experience Level
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {experienceLevels.map(level => (
                <button
                  key={level}
                  onClick={() => setExperience(level)}
                  className={`py-3 rounded-xl text-sm font-medium border transition-all ${
                    experience === level
                      ? 'bg-orange-500 text-white border-transparent'
                      : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Equipment */}
          <div className="card p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Dumbbell size={16} className="text-teal-400" />
              Available Equipment
              <span className="text-xs text-gray-500 font-normal ml-auto">{equipment.length} selected</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {equipmentOptions.map(eq => (
                <button
                  key={eq.id}
                  onClick={() => toggleEquipment(eq.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-sm transition-all ${
                    equipment.includes(eq.id)
                      ? 'border-orange-500/50 bg-orange-500/10 text-orange-400'
                      : 'border-gray-700 bg-gray-800/40 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <span>{eq.icon}</span>
                  <span className="text-xs font-medium">{eq.label}</span>
                  {equipment.includes(eq.id) && <CheckCircle size={12} className="ml-auto flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generate}
            disabled={isGenerating || equipment.length === 0}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-base transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                Generating your workout...
              </>
            ) : (
              <>
                <Brain size={20} />
                Generate My Workout
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>

        {/* Generated Workout Panel */}
        <div>
          {isGenerating && (
            <div className="card p-8 text-center animate-fade-in">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/30">
                <Brain size={28} className="text-orange-400 animate-pulse" />
              </div>
              <h3 className="font-semibold text-white mb-2">AI is thinking...</h3>
              <p className="text-gray-400 text-sm">Analyzing your equipment and goals to create the perfect workout.</p>
              <div className="flex justify-center gap-1 mt-4">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {!isGenerating && !generatedWorkout && (
            <div className="card p-8 text-center h-full flex flex-col items-center justify-center min-h-64">
              <Zap size={40} className="text-gray-700 mb-4" />
              <h3 className="font-semibold text-gray-400 mb-1">Ready to create your workout</h3>
              <p className="text-gray-600 text-sm">Configure your preferences and hit "Generate"</p>
            </div>
          )}

          {!isGenerating && generatedWorkout && (
            <div className="space-y-4 animate-slide-up">
              {/* Workout Header */}
              <div className="card p-5 bg-gradient-to-br from-orange-500/10 to-gray-900 border-orange-500/20">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="font-display text-2xl font-bold text-white">{generatedWorkout.name}</h2>
                  <span className="badge bg-orange-500/10 text-orange-400 border border-orange-500/20 whitespace-nowrap flex-shrink-0">
                    AI Generated
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{generatedWorkout.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Clock size={12} className="text-orange-400" />{generatedWorkout.estimatedDuration}min</span>
                  <span className="flex items-center gap-1"><Dumbbell size={12} className="text-blue-400" />{generatedWorkout.exercises.length} exercises</span>
                  <span className="flex items-center gap-1"><Zap size={12} className="text-amber-400" />{generatedWorkout.difficulty}</span>
                </div>
                <div className="flex gap-3 mt-4">
                  <Link
                    to="/active-workout"
                    state={{ workout: { id: `ai-${Date.now()}`, name: generatedWorkout.name, description: generatedWorkout.description, exercises: generatedWorkout.exercises, estimatedDuration: generatedWorkout.estimatedDuration, difficulty: generatedWorkout.difficulty, category: 'AI Generated', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: [] } }}
                    className="btn-primary flex items-center gap-2 text-sm flex-1 justify-center"
                  >
                    <Play size={16} />
                    Start Workout
                  </Link>
                  <button onClick={generate} className="btn-secondary flex items-center gap-2 text-sm">
                    <RefreshCw size={14} />
                    Regenerate
                  </button>
                </div>
              </div>

              {/* Exercises */}
              <div className="card overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'exercises' ? null : 'exercises')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
                >
                  <span className="font-semibold text-white flex items-center gap-2">
                    <Dumbbell size={16} className="text-orange-400" />
                    Exercises ({generatedWorkout.exercises.length})
                  </span>
                  {expandedSection === 'exercises' ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>
                {expandedSection === 'exercises' && (
                  <div className="px-4 pb-4 space-y-2">
                    {generatedWorkout.exercises.map((we, i) => {
                      const ex = exerciseDb.find(e => e.id === we.exerciseId);
                      if (!ex) return null;
                      return (
                        <div key={we.exerciseId} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                          <span className="text-xs text-gray-500 w-5 text-center">{i + 1}</span>
                          <img src={ex.imageUrl} alt={ex.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-200 truncate">{ex.name}</p>
                            <p className="text-xs text-gray-500">{ex.primaryMuscles.join(', ')}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs font-medium text-orange-400">{we.sets} × {we.reps}</p>
                            <p className="text-xs text-gray-600">{we.restTime}s rest</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Coach Tips */}
              <div className="card overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'tips' ? null : 'tips')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
                >
                  <span className="font-semibold text-white flex items-center gap-2">
                    <Lightbulb size={16} className="text-amber-400" />
                    Coach Tips
                  </span>
                  {expandedSection === 'tips' ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>
                {expandedSection === 'tips' && (
                  <div className="px-4 pb-4 space-y-2">
                    {generatedWorkout.tips.map((tip, i) => (
                      <div key={i} className="flex gap-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                        <Lightbulb size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-300 text-sm">{tip}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Warmup */}
              <div className="card overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'warmup' ? null : 'warmup')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
                >
                  <span className="font-semibold text-white flex items-center gap-2">
                    <Flame size={16} className="text-red-400" />
                    Warmup Protocol
                  </span>
                  {expandedSection === 'warmup' ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>
                {expandedSection === 'warmup' && (
                  <div className="px-4 pb-4 space-y-2">
                    {generatedWorkout.warmup.map((step, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <span className="w-5 h-5 bg-red-500/20 rounded-full text-xs text-red-400 flex items-center justify-center flex-shrink-0">{i + 1}</span>
                        <p className="text-gray-300 text-sm">{step}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Nutrition */}
              <div className="card overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'nutrition' ? null : 'nutrition')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
                >
                  <span className="font-semibold text-white flex items-center gap-2">
                    <Apple size={16} className="text-green-400" />
                    Nutrition Guide
                  </span>
                  {expandedSection === 'nutrition' ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>
                {expandedSection === 'nutrition' && (
                  <div className="px-4 pb-4 space-y-2">
                    {generatedWorkout.nutrition.map((n, i) => (
                      <div key={i} className="flex gap-3 p-3 bg-green-500/5 border border-green-500/20 rounded-xl">
                        <Apple size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-300 text-sm">{n}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
