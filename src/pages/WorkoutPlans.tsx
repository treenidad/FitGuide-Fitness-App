import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Dumbbell, Target, Play, Flame, Calendar } from 'lucide-react';
import { workoutPlans } from '../data/workoutPlans';
import type { WorkoutPlan } from '../types';
import PageHeader from '../components/PageHeader';

const difficultyColors = {
  Beginner: 'text-emerald-400 bg-emerald-400/10',
  Intermediate: 'text-amber-400 bg-amber-400/10',
  Advanced: 'text-red-400 bg-red-400/10',
};

const goalIcons: Record<string, string> = {
  'General Fitness': '🎯',
  'Muscle Gain': '💪',
  'Fat Loss': '🔥',
  'Strength': '⚡',
  'Endurance': '🏃',
};

export default function WorkoutPlans() {
  const [selected, setSelected] = useState<WorkoutPlan | null>(null);
  const [filterGoal, setFilterGoal] = useState<string>('All');

  const goals = ['All', 'General Fitness', 'Muscle Gain', 'Fat Loss', 'Strength'];
  const filtered = filterGoal === 'All'
    ? workoutPlans
    : workoutPlans.filter(p => p.goal === filterGoal);

  return (
    <div className="px-4 lg:px-8 py-6 animate-fade-in">
      <PageHeader title="Workout Plans" subtitle="Pre-built programs for every goal" />

      {/* Goal Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {goals.map(g => (
          <button
            key={g}
            onClick={() => setFilterGoal(g)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
              filterGoal === g
                ? 'bg-orange-500 text-white border-transparent'
                : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600'
            }`}
          >
            {goalIcons[g] || ''} {g}
          </button>
        ))}
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(plan => (
          <button
            key={plan.id}
            onClick={() => setSelected(plan)}
            className="card overflow-hidden text-left group hover:border-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={plan.imageUrl}
                alt={plan.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className={`badge ${difficultyColors[plan.difficulty]}`}>{plan.difficulty}</span>
              </div>
              <div className="absolute top-3 right-3 text-2xl">
                {goalIcons[plan.goal] || '🎯'}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-display text-lg font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-xs text-gray-400 mb-3 line-clamp-2">{plan.description}</p>
              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Calendar size={11} />{plan.duration}</span>
                <span className="flex items-center gap-1"><Dumbbell size={11} />{plan.frequency}</span>
                <span className="flex items-center gap-1"><Target size={11} />{plan.goal}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Plan Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-2xl max-h-[85vh] flex flex-col animate-slide-up overflow-hidden">
            {/* Header */}
            <div className="relative h-48 flex-shrink-0">
              <img src={selected.imageUrl} alt={selected.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-900/80 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-100"
              >
                ×
              </button>
              <div className="absolute bottom-4 left-5">
                <span className={`badge ${difficultyColors[selected.difficulty]} mb-2`}>{selected.difficulty}</span>
                <h2 className="font-display text-2xl font-bold text-white">{selected.name}</h2>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-5">
              <p className="text-gray-300 text-sm mb-4">{selected.description}</p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <Calendar size={18} className="mx-auto text-orange-400 mb-1" />
                  <div className="text-sm font-semibold text-white">{selected.duration}</div>
                  <div className="text-xs text-gray-500">Duration</div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <Dumbbell size={18} className="mx-auto text-blue-400 mb-1" />
                  <div className="text-sm font-semibold text-white">{selected.frequency}</div>
                  <div className="text-xs text-gray-500">Frequency</div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <Target size={18} className="mx-auto text-teal-400 mb-1" />
                  <div className="text-sm font-semibold text-white">{selected.goal}</div>
                  <div className="text-xs text-gray-500">Goal</div>
                </div>
              </div>

              {/* Workouts */}
              <h3 className="font-semibold text-white mb-3">Workouts Included</h3>
              <div className="space-y-2 mb-4">
                {selected.workouts.map(w => (
                  <div key={w.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                    <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Flame size={14} className="text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-200">{w.name}</p>
                      <p className="text-xs text-gray-500">{w.exercises.length} exercises • ~{w.estimatedDuration}min</p>
                    </div>
                    <Link
                      to="/active-workout"
                      state={{ workout: w }}
                      className="p-1.5 text-orange-400 hover:bg-orange-500/10 rounded-lg transition-colors"
                      onClick={() => setSelected(null)}
                    >
                      <Play size={14} />
                    </Link>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {selected.tags.map(t => (
                  <span key={t} className="badge bg-gray-800 text-gray-400 border border-gray-700 capitalize">{t.replace(/-/g, ' ')}</span>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-800 flex gap-3">
              <button onClick={() => setSelected(null)} className="btn-secondary flex-1 text-sm">Close</button>
              {selected.workouts[0] && (
                <Link
                  to="/active-workout"
                  state={{ workout: selected.workouts[0] }}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
                  onClick={() => setSelected(null)}
                >
                  <Play size={16} />
                  Start First Workout
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
