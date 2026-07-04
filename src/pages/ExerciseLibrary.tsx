import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { exercises } from '../data/exercises';
import ExerciseCard from '../components/ExerciseCard';
import PageHeader from '../components/PageHeader';
import type { Category, Difficulty, Equipment, MuscleGroup } from '../types';

const categories: Category[] = ['Strength', 'Cardio', 'Flexibility', 'Mobility', 'Calisthenics'];
const difficulties: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];
const equipmentOptions: Equipment[] = ['Barbell', 'Dumbbell', 'Kettlebell', 'Cable Machine', 'Pull-up Bar', 'Bench', 'Dip Bars', 'Resistance Bands', 'Bodyweight', 'Leg Press Machine', 'Lat Pulldown Machine', 'Mat'];
const muscleOptions: MuscleGroup[] = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Forearms', 'Core', 'Glutes', 'Quadriceps', 'Hamstrings', 'Calves'];

export default function ExerciseLibrary() {
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);
  const [selectedMuscles, setSelectedMuscles] = useState<MuscleGroup[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  function toggle<T>(arr: T[], setArr: (v: T[]) => void, val: T) {
    if (arr.includes(val)) setArr(arr.filter(x => x !== val));
    else setArr([...arr, val]);
  }

  const filtered = useMemo(() => {
    return exercises.filter(ex => {
      if (query && !ex.name.toLowerCase().includes(query.toLowerCase()) &&
          !ex.description.toLowerCase().includes(query.toLowerCase()) &&
          !ex.primaryMuscles.some(m => m.toLowerCase().includes(query.toLowerCase())) &&
          !ex.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))) return false;
      if (selectedCategories.length && !selectedCategories.includes(ex.category)) return false;
      if (selectedDifficulties.length && !selectedDifficulties.includes(ex.difficulty)) return false;
      if (selectedEquipment.length && !selectedEquipment.some(eq => ex.equipment.includes(eq))) return false;
      if (selectedMuscles.length && !selectedMuscles.some(m => ex.primaryMuscles.includes(m) || ex.secondaryMuscles.includes(m))) return false;
      return true;
    });
  }, [query, selectedCategories, selectedDifficulties, selectedEquipment, selectedMuscles]);

  const hasFilters = selectedCategories.length + selectedDifficulties.length + selectedEquipment.length + selectedMuscles.length > 0;

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setSelectedEquipment([]);
    setSelectedMuscles([]);
  };

  const FilterChip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
        active
          ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
          : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="px-4 lg:px-8 py-6 animate-fade-in">
      <PageHeader
        title="Exercise Library"
        subtitle={`${exercises.length} exercises • ${filtered.length} shown`}
      />

      {/* Search + Filter Toggle */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search exercises, muscles, tags..."
            className="input pl-10"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
            hasFilters || showFilters
              ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
              : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600'
          }`}
        >
          <SlidersHorizontal size={16} />
          Filters
          {hasFilters && (
            <span className="w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
              {selectedCategories.length + selectedDifficulties.length + selectedEquipment.length + selectedMuscles.length}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="card p-4 mb-5 space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-gray-200">Filters</h3>
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1">
                <X size={12} /> Clear all
              </button>
            )}
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Category</p>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <FilterChip key={c} label={c} active={selectedCategories.includes(c)} onClick={() => toggle(selectedCategories, setSelectedCategories, c)} />
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Difficulty</p>
            <div className="flex flex-wrap gap-2">
              {difficulties.map(d => (
                <FilterChip key={d} label={d} active={selectedDifficulties.includes(d)} onClick={() => toggle(selectedDifficulties, setSelectedDifficulties, d)} />
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Equipment</p>
            <div className="flex flex-wrap gap-2">
              {equipmentOptions.map(e => (
                <FilterChip key={e} label={e} active={selectedEquipment.includes(e)} onClick={() => toggle(selectedEquipment, setSelectedEquipment, e)} />
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Muscle Group</p>
            <div className="flex flex-wrap gap-2">
              {muscleOptions.map(m => (
                <FilterChip key={m} label={m} active={selectedMuscles.includes(m)} onClick={() => toggle(selectedMuscles, setSelectedMuscles, m)} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Quick Tabs */}
      {!showFilters && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          <button
            onClick={() => setSelectedCategories([])}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
              selectedCategories.length === 0
                ? 'bg-orange-500 text-white border-transparent'
                : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600'
            }`}
          >
            All ({exercises.length})
          </button>
          {categories.map(c => {
            const count = exercises.filter(e => e.category === c).length;
            return (
              <button
                key={c}
                onClick={() => setSelectedCategories(selectedCategories.includes(c) ? selectedCategories.filter(x => x !== c) : [c])}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
                  selectedCategories.includes(c)
                    ? 'bg-orange-500 text-white border-transparent'
                    : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600'
                }`}
              >
                {c} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Search size={40} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No exercises found</p>
          <p className="text-gray-600 text-sm mt-1">Try adjusting your search or filters</p>
          <button onClick={() => { setQuery(''); clearFilters(); }} className="btn-secondary mt-4 text-sm">
            Reset Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(ex => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>
      )}
    </div>
  );
}
