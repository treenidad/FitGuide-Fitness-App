import type { Exercise } from '../types';
import { Link } from 'react-router-dom';
import { Heart, Star, Zap } from 'lucide-react';
import { toggleFavorite, getFavorites } from '../lib/storage';
import { useState } from 'react';

interface ExerciseCardProps {
  exercise: Exercise;
  compact?: boolean;
}

const difficultyColors = {
  Beginner: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Intermediate: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Advanced: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const categoryColors: Record<string, string> = {
  Strength: 'text-blue-400',
  Cardio: 'text-orange-400',
  Flexibility: 'text-purple-400',
  Mobility: 'text-teal-400',
  Calisthenics: 'text-yellow-400',
};

export default function ExerciseCard({ exercise, compact = false }: ExerciseCardProps) {
  const [isFav, setIsFav] = useState(() => getFavorites().includes(exercise.id));

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    const newState = toggleFavorite(exercise.id);
    setIsFav(newState);
  };

  return (
    <Link to={`/exercises/${exercise.id}`} className="block group">
      <div className="card overflow-hidden hover:border-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20">
        {/* Image */}
        {!compact && (
          <div className="relative h-44 overflow-hidden bg-gray-800">
            <img
              src={exercise.imageUrl}
              alt={exercise.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
            <button
              onClick={handleFav}
              className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-gray-900/80 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-gray-800"
            >
              <Heart
                size={15}
                className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'}
              />
            </button>
            <div className="absolute bottom-3 left-3">
              <span className={`badge border ${difficultyColors[exercise.difficulty]}`}>
                {exercise.difficulty}
              </span>
            </div>
          </div>
        )}

        {/* Body */}
        <div className={compact ? 'p-3' : 'p-4'}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-gray-100 truncate ${compact ? 'text-sm' : 'text-base'}`}>
                {exercise.name}
              </h3>
              <span className={`text-xs font-medium ${categoryColors[exercise.category] || 'text-gray-400'}`}>
                {exercise.category}
              </span>
            </div>
            {compact && (
              <button onClick={handleFav} className="flex-shrink-0 p-1">
                <Heart
                  size={14}
                  className={isFav ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                />
              </button>
            )}
          </div>

          {!compact && (
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{exercise.description}</p>
          )}

          <div className="flex flex-wrap gap-1.5">
            {exercise.primaryMuscles.slice(0, 2).map(m => (
              <span key={m} className="badge bg-gray-800 text-gray-400 border border-gray-700">
                {m}
              </span>
            ))}
            {!compact && exercise.equipment.slice(0, 1).map(e => (
              <span key={e} className="badge bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <Zap size={10} className="mr-0.5" />{e}
              </span>
            ))}
          </div>

          {!compact && (
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-800">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                {exercise.recommendedSets} sets × {exercise.recommendedReps} reps
              </span>
              <span className="text-xs text-gray-600">•</span>
              <span className="text-xs text-gray-500">{exercise.restTime}s rest</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
