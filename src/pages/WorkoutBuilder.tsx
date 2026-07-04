import { useState } from 'react';
import {
  Plus, Trash2, GripVertical, Save, Copy, Play,
  Clock, Dumbbell, ChevronDown, ChevronUp, X, Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { exercises } from '../data/exercises';
import { getCustomWorkouts, saveWorkout, deleteWorkout } from '../lib/storage';
import type { Workout, WorkoutExercise } from '../types';
import PageHeader from '../components/PageHeader';

function generateId() {
  return `workout-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function WorkoutBuilder() {
  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>(() => getCustomWorkouts());  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function newWorkout() {
    setEditingWorkout({
      id: generateId(),
      name: 'New Workout',
      description: '',
      exercises: [],
      estimatedDuration: 30,
      difficulty: 'Intermediate',
      category: 'Custom',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
    });
  }

  function handleSave() {
    if (!editingWorkout) return;
    const updated = {
      ...editingWorkout,
      updatedAt: new Date().toISOString(),
      estimatedDuration: Math.max(10, editingWorkout.exercises.length * 8),
    };
    saveWorkout(updated);
    setSavedWorkouts(getCustomWorkouts());
    setEditingWorkout(null);
  }

  function handleDelete(id: string) {
    deleteWorkout(id);
    setSavedWorkouts(getCustomWorkouts());
  }

  function handleDuplicate(w: Workout) {
    const copy: Workout = { ...w, id: generateId(), name: `${w.name} (Copy)`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    saveWorkout(copy);
    setSavedWorkouts(getCustomWorkouts());
  }

  function addExercise(exerciseId: string) {
    if (!editingWorkout) return;
    const newEx: WorkoutExercise = { exerciseId, sets: 3, reps: '10', restTime: 90 };
    setEditingWorkout({ ...editingWorkout, exercises: [...editingWorkout.exercises, newEx] });
    setShowExercisePicker(false);
    setPickerSearch('');
  }

  function removeExercise(idx: number) {
    if (!editingWorkout) return;
    const updated = [...editingWorkout.exercises];
    updated.splice(idx, 1);
    setEditingWorkout({ ...editingWorkout, exercises: updated });
  }

  function updateExercise(idx: number, field: keyof WorkoutExercise, value: string | number) {
    if (!editingWorkout) return;
    const updated = [...editingWorkout.exercises];
    updated[idx] = { ...updated[idx], [field]: field === 'sets' || field === 'restTime' ? Number(value) : value };
    setEditingWorkout({ ...editingWorkout, exercises: updated });
  }

  function moveExercise(idx: number, dir: -1 | 1) {
    if (!editingWorkout) return;
    const updated = [...editingWorkout.exercises];
    const target = idx + dir;
    if (target < 0 || target >= updated.length) return;
    [updated[idx], updated[target]] = [updated[target], updated[idx]];
    setEditingWorkout({ ...editingWorkout, exercises: updated });
  }

  const filteredPicker = exercises.filter(e =>
    !pickerSearch || e.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
    e.primaryMuscles.some(m => m.toLowerCase().includes(pickerSearch.toLowerCase()))
  );

  return (
    <div className="px-4 lg:px-8 py-6 animate-fade-in">
      <PageHeader
        title="Workout Builder"
        subtitle="Create and manage your custom workouts"
        action={
          !editingWorkout ? (
            <button onClick={newWorkout} className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={16} />
              New Workout
            </button>
          ) : undefined
        }
      />

      {/* Editor */}
      {editingWorkout && (
        <div className="card p-5 mb-6 border-orange-500/20 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">
              {savedWorkouts.find(w => w.id === editingWorkout.id) ? 'Edit Workout' : 'New Workout'}
            </h2>
            <button onClick={() => setEditingWorkout(null)} className="text-gray-500 hover:text-gray-300">
              <X size={18} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Workout Name</label>
              <input
                className="input"
                value={editingWorkout.name}
                onChange={e => setEditingWorkout({ ...editingWorkout, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Description</label>
              <input
                className="input"
                placeholder="Optional description..."
                value={editingWorkout.description}
                onChange={e => setEditingWorkout({ ...editingWorkout, description: e.target.value })}
              />
            </div>
          </div>

          {/* Exercise List */}
          <div className="space-y-2 mb-4">
            {editingWorkout.exercises.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-800 rounded-2xl">
                <Dumbbell size={28} className="text-gray-700 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No exercises added yet</p>
                <p className="text-gray-600 text-xs mt-1">Click "Add Exercise" to get started</p>
              </div>
            ) : (
              editingWorkout.exercises.map((we, idx) => {
                const ex = exercises.find(e => e.id === we.exerciseId);
                if (!ex) return null;
                const isExpanded = expandedId === `${editingWorkout.id}-${idx}`;
                return (
                  <div key={`${we.exerciseId}-${idx}`} className="bg-gray-800/60 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3 p-3">
                      <GripVertical size={16} className="text-gray-600 flex-shrink-0" />
                      <img src={ex.imageUrl} alt={ex.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-200 truncate">{ex.name}</p>
                        <p className="text-xs text-gray-500">{we.sets} sets × {we.reps} reps • {we.restTime}s rest</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => moveExercise(idx, -1)} disabled={idx === 0} className="p-1 text-gray-600 hover:text-gray-300 disabled:opacity-30">
                          <ChevronUp size={14} />
                        </button>
                        <button onClick={() => moveExercise(idx, 1)} disabled={idx === editingWorkout.exercises.length - 1} className="p-1 text-gray-600 hover:text-gray-300 disabled:opacity-30">
                          <ChevronDown size={14} />
                        </button>
                        <button onClick={() => setExpandedId(isExpanded ? null : `${editingWorkout.id}-${idx}`)} className="p-1 text-gray-500 hover:text-gray-200">
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        <button onClick={() => removeExercise(idx)} className="p-1 text-gray-600 hover:text-red-400">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="px-4 pb-3 pt-0 border-t border-gray-700/50 grid grid-cols-3 gap-3 mt-0">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Sets</label>
                          <input type="number" min="1" max="10" className="input text-sm py-1.5" value={we.sets} onChange={e => updateExercise(idx, 'sets', e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Reps</label>
                          <input type="text" className="input text-sm py-1.5" value={we.reps} onChange={e => updateExercise(idx, 'reps', e.target.value)} />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Rest (s)</label>
                          <input type="number" min="0" max="600" step="15" className="input text-sm py-1.5" value={we.restTime} onChange={e => updateExercise(idx, 'restTime', e.target.value)} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowExercisePicker(true)}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              Add Exercise
            </button>
            <button onClick={handleSave} className="btn-primary flex items-center gap-2 text-sm">
              <Save size={16} />
              Save Workout
            </button>
            {editingWorkout.exercises.length > 0 && (
              <Link
                to="/active-workout"
                state={{ workout: editingWorkout }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
              >
                <Play size={16} />
                Start Now
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Exercise Picker Modal */}
      {showExercisePicker && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-lg max-h-[80vh] flex flex-col animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h3 className="font-semibold text-white">Add Exercise</h3>
              <button onClick={() => { setShowExercisePicker(false); setPickerSearch(''); }} className="text-gray-500 hover:text-gray-300">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 border-b border-gray-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                <input
                  className="input pl-9 text-sm"
                  placeholder="Search exercises..."
                  value={pickerSearch}
                  onChange={e => setPickerSearch(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              {filteredPicker.map(ex => (
                <button
                  key={ex.id}
                  onClick={() => addExercise(ex.id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors border-b border-gray-800/50 last:border-0 text-left"
                >
                  <img src={ex.imageUrl} alt={ex.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200">{ex.name}</p>
                    <p className="text-xs text-gray-500">{ex.primaryMuscles.join(', ')} • {ex.difficulty}</p>
                  </div>
                  <Plus size={14} className="text-orange-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Saved Workouts */}
      <div>
        <h2 className="font-display text-2xl font-bold text-white mb-4">
          My Workouts
          <span className="text-base font-normal text-gray-500 ml-2">({savedWorkouts.length})</span>
        </h2>
        {savedWorkouts.length === 0 ? (
          <div className="text-center py-16 card">
            <Dumbbell size={48} className="text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No saved workouts yet</p>
            <p className="text-gray-600 text-sm mt-1 mb-4">Create your first workout to get started</p>
            <button onClick={newWorkout} className="btn-primary inline-flex items-center gap-2">
              <Plus size={16} />
              Create Workout
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedWorkouts.map(w => (
              <div key={w.id} className="card p-4 hover:border-gray-700 transition-all">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-100 truncate">{w.name}</h3>
                    {w.description && <p className="text-xs text-gray-500 mt-0.5 truncate">{w.description}</p>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleDuplicate(w)} className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                      <Copy size={13} />
                    </button>
                    <button onClick={() => handleDelete(w.id)} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div className="flex gap-3 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Dumbbell size={11} />{w.exercises.length} exercises</span>
                  <span className="flex items-center gap-1"><Clock size={11} />{w.estimatedDuration}min</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingWorkout(w)}
                    className="flex-1 text-xs py-2 btn-secondary text-center"
                  >
                    Edit
                  </button>
                  <Link
                    to="/active-workout"
                    state={{ workout: w }}
                    className="flex-1 text-xs py-2 btn-primary text-center flex items-center justify-center gap-1"
                  >
                    <Play size={12} />
                    Start
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
