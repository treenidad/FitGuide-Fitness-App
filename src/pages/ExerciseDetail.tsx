import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft, Heart, Play, Check, AlertTriangle,
  Dumbbell, Target, Clock, Flame, ChevronRight,
  Star, Shield, Repeat2
} from 'lucide-react';
import { exercises } from '../data/exercises';
import { toggleFavorite, getFavorites } from '../lib/storage';
import ExerciseCard from '../components/ExerciseCard';

const difficultyColors = {
  Beginner: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Intermediate: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Advanced: 'text-red-400 bg-red-400/10 border-red-400/20',
};

export default function ExerciseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const exercise = exercises.find(e => e.id === id);
  const [isFav, setIsFav] = useState(() => exercise ? getFavorites().includes(exercise.id) : false);
  const [activeTab, setActiveTab] = useState<'instructions' | 'mistakes' | 'safety' | 'variations'>('instructions');

  if (!exercise) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400">Exercise not found</p>
        <Link to="/exercises" className="btn-primary mt-4 inline-block">Back to Library</Link>
      </div>
    );
  }

  const related = exercises
    .filter(e => e.id !== exercise.id && (
      e.primaryMuscles.some(m => exercise.primaryMuscles.includes(m)) ||
      e.category === exercise.category
    ))
    .slice(0, 4);

  const handleFav = () => {
    const newState = toggleFavorite(exercise.id);
    setIsFav(newState);
  };

  const tabs = [
    { id: 'instructions', label: 'How To', icon: Check },
    { id: 'mistakes', label: 'Mistakes', icon: AlertTriangle },
    { id: 'safety', label: 'Safety', icon: Shield },
    { id: 'variations', label: 'Variations', icon: Repeat2 },
  ] as const;

  return (
    <div className="animate-fade-in">
      {/* Back nav */}
      <div className="px-4 lg:px-8 pt-5 pb-2">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors text-sm">
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Hero Image */}
      <div className="relative h-72 lg:h-96 overflow-hidden">
        <img
          src={exercise.imageUrl}
          alt={exercise.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
        
        {/* Actions overlay */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleFav}
            className="w-10 h-10 rounded-xl bg-gray-900/80 backdrop-blur-sm border border-gray-700 flex items-center justify-center transition-colors hover:bg-gray-800"
          >
            <Heart size={18} className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
          </button>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 lg:px-8 pb-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`badge border ${difficultyColors[exercise.difficulty]}`}>
              {exercise.difficulty}
            </span>
            <span className="badge bg-gray-800/80 text-gray-300 border border-gray-700">
              {exercise.category}
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold text-white">{exercise.name}</h1>
          <p className="text-gray-300 text-sm mt-1.5 max-w-2xl line-clamp-2">{exercise.description}</p>
        </div>
      </div>

      <div className="px-4 lg:px-8 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="card p-4 text-center">
            <Target size={20} className="mx-auto text-orange-400 mb-2" />
            <div className="text-sm font-semibold text-white">{exercise.recommendedSets} Sets</div>
            <div className="text-xs text-gray-500">Recommended</div>
          </div>
          <div className="card p-4 text-center">
            <Repeat2 size={20} className="mx-auto text-blue-400 mb-2" />
            <div className="text-sm font-semibold text-white">{exercise.recommendedReps} Reps</div>
            <div className="text-xs text-gray-500">Per set</div>
          </div>
          <div className="card p-4 text-center">
            <Clock size={20} className="mx-auto text-teal-400 mb-2" />
            <div className="text-sm font-semibold text-white">{exercise.restTime}s Rest</div>
            <div className="text-xs text-gray-500">Between sets</div>
          </div>
          <div className="card p-4 text-center">
            <Flame size={20} className="mx-auto text-red-400 mb-2" />
            <div className="text-sm font-semibold text-white">{exercise.caloriesPerMinute} cal/min</div>
            <div className="text-xs text-gray-500">Calorie burn</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex border-b border-gray-800 mb-5 gap-0 overflow-x-auto">
              {tabs.map(({ id: tabId, label, icon: Icon }) => (
                <button
                  key={tabId}
                  onClick={() => setActiveTab(tabId)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tabId
                      ? 'border-orange-500 text-orange-400'
                      : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
              {activeTab === 'instructions' && (
                <ol className="space-y-3">
                  {exercise.instructions.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-gray-300 text-sm leading-relaxed pt-0.5">{step}</p>
                    </li>
                  ))}
                </ol>
              )}

              {activeTab === 'mistakes' && (
                <ul className="space-y-3">
                  {exercise.commonMistakes.map((m, i) => (
                    <li key={i} className="flex gap-3 p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                      <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300 text-sm">{m}</p>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'safety' && (
                <ul className="space-y-3">
                  {exercise.safetyTips.map((tip, i) => (
                    <li key={i} className="flex gap-3 p-3 bg-teal-500/5 border border-teal-500/20 rounded-xl">
                      <Shield size={16} className="text-teal-400 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300 text-sm">{tip}</p>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'variations' && (
                <ul className="space-y-2">
                  {exercise.variations.map((v, i) => (
                    <li key={i} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors">
                      <ChevronRight size={14} className="text-orange-400 flex-shrink-0" />
                      <span className="text-gray-200 text-sm">{v}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Video Placeholder */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <Play size={16} className="text-orange-400" />
                Exercise Demo
              </h3>
              <div className="aspect-video bg-gray-800 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-700">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-orange-500/30">
                    <Play size={28} className="text-orange-400 ml-1" />
                  </div>
                  <p className="text-gray-400 text-sm font-medium">Watch {exercise.name}</p>
                  <p className="text-gray-600 text-xs mt-1">Demonstration video</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-4">
            {/* Muscles */}
            <div className="card p-4">
              <h3 className="font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <Target size={16} className="text-orange-400" />
                Muscles Targeted
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-medium">Primary</p>
                  <div className="flex flex-wrap gap-1.5">
                    {exercise.primaryMuscles.map(m => (
                      <span key={m} className="badge bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
                {exercise.secondaryMuscles.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2 font-medium">Secondary</p>
                    <div className="flex flex-wrap gap-1.5">
                      {exercise.secondaryMuscles.map(m => (
                        <span key={m} className="badge bg-gray-800 text-gray-400 border border-gray-700">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Equipment */}
            <div className="card p-4">
              <h3 className="font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <Dumbbell size={16} className="text-blue-400" />
                Equipment Needed
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {exercise.equipment.map(e => (
                  <span key={e} className="badge bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {e}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="card p-4">
              <h3 className="font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <Star size={16} className="text-amber-400" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {exercise.tags.map(t => (
                  <span key={t} className="badge bg-gray-800 text-gray-400 border border-gray-700 capitalize">
                    {t.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link to="/workout-builder" className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-sm">
              <Dumbbell size={16} />
              Add to Workout
            </Link>
          </div>
        </div>

        {/* Related Exercises */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-white mb-4">Related Exercises</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(ex => (
                <ExerciseCard key={ex.id} exercise={ex} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
