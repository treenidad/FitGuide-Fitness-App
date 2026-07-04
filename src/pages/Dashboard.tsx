import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame, Dumbbell, TrendingUp, Clock, ChevronRight,
  Award, Zap, Calendar, Target
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { getProfile, getSessions, getPersonalRecords } from '../lib/storage';
import { exercises } from '../data/exercises';
import { weeklyProgress } from '../data/userData';
import ExerciseCard from '../components/ExerciseCard';

export default function Dashboard() {
  const [profile] = useState(() => getProfile());
  const [sessions] = useState(() => getSessions());
  const [prs] = useState(() => getPersonalRecords());

  const recentSessions = sessions.slice(0, 5);
  const totalCalories = sessions.slice(0, 7).reduce((sum, s) => sum + s.caloriesBurned, 0);
  const totalMinutes = sessions.slice(0, 7).reduce((sum, s) => sum + s.duration, 0);
  const favoriteExs = exercises.filter(e => profile.favoriteExercises.includes(e.id)).slice(0, 4);

  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  const stats = [
    { icon: Flame, label: 'Calories Burned', value: totalCalories.toLocaleString(), sub: 'this week', color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { icon: Dumbbell, label: 'Workouts Done', value: profile.totalWorkouts, sub: 'all time', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: Clock, label: 'Time Trained', value: `${totalMinutes}m`, sub: 'this week', color: 'text-teal-400', bg: 'bg-teal-500/10' },
    { icon: Award, label: 'Current Streak', value: `${profile.workoutStreak}d`, sub: 'keep going!', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="px-4 lg:px-8 py-6 animate-fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden card p-6 mb-6 bg-gradient-to-br from-orange-500/20 via-gray-900 to-gray-900 border-orange-500/20">
        <div className="relative z-10">
          <p className="text-orange-400 font-medium text-sm mb-1">{greeting}, {profile.name.split(' ')[0]} 👋</p>
          <h1 className="font-display text-3xl font-bold text-white mb-3">
            Ready to crush it today?
          </h1>
          <p className="text-gray-400 text-sm mb-5 max-w-md">
            You've been on a <span className="text-orange-400 font-semibold">{profile.workoutStreak}-day streak</span>. Keep the momentum going!
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/active-workout" className="btn-primary inline-flex items-center gap-2">
              <Zap size={16} />
              Start Workout
            </Link>
            <Link to="/ai-coach" className="btn-secondary inline-flex items-center gap-2">
              <Target size={16} />
              AI Coach
            </Link>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-48 bg-gradient-to-l from-orange-500/5 to-transparent" />
        <Dumbbell className="absolute right-6 top-1/2 -translate-y-1/2 text-orange-500/10" size={96} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className="card p-4">
            <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <div className="font-display text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
            <div className="text-xs text-gray-400 mt-1 font-medium">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6 mb-6">
        {/* Weekly Volume Chart */}
        <div className="lg:col-span-3 card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-white">Weekly Volume</h2>
              <p className="text-xs text-gray-500">Training load over time</p>
            </div>
            <TrendingUp size={18} className="text-orange-400" />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weeklyProgress} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 12, color: '#f9fafb' }}
                formatter={(v) => [`${(Number(v) / 1000).toFixed(1)}k lbs`, 'Volume']}
              />
              <Area type="monotone" dataKey="volume" stroke="#f97316" strokeWidth={2} fill="url(#volGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Workouts */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Recent Activity</h2>
            <Link to="/progress" className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-0.5">
              See all <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentSessions.slice(0, 4).map(session => (
              <div key={session.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors">
                <div className="w-9 h-9 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Dumbbell size={16} className="text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">{session.workoutName}</p>
                  <p className="text-xs text-gray-500">{session.duration}min • {session.caloriesBurned} cal</p>
                </div>
                <Calendar size={13} className="text-gray-600 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Personal Records */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Personal Records</h2>
            <Award size={18} className="text-amber-400" />
          </div>
          <div className="space-y-2">
            {prs.slice(0, 5).map(pr => (
              <div key={pr.exerciseId} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <span className="text-sm text-gray-300">{pr.exerciseName}</span>
                <div className="text-right">
                  <span className="text-sm font-bold text-orange-400">{pr.weight} lbs</span>
                  <span className="text-xs text-gray-600 ml-1">× {pr.reps}</span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/progress" className="mt-4 text-xs text-orange-400 hover:text-orange-300 flex items-center gap-0.5">
            View all records <ChevronRight size={12} />
          </Link>
        </div>

        {/* Workout Streak */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Workout Streak</h2>
            <Flame size={18} className="text-orange-400" />
          </div>
          <div className="text-center py-4">
            <div className="font-display text-6xl font-bold text-gradient mb-1">{profile.workoutStreak}</div>
            <div className="text-gray-400 text-sm">consecutive days</div>
            <div className="flex justify-center gap-1.5 mt-5">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    i < profile.workoutStreak % 7 || profile.workoutStreak >= 7
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-800 text-gray-600'
                  }`}
                >
                  <Flame size={14} />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">This week's training days</p>
          </div>
        </div>

        {/* Favorite Exercises */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Favorites</h2>
            <Link to="/exercises" className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-0.5">
              Browse <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {favoriteExs.map(ex => (
              <Link key={ex.id} to={`/exercises/${ex.id}`}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-800 transition-colors"
              >
                <img
                  src={ex.imageUrl}
                  alt={ex.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">{ex.name}</p>
                  <p className="text-xs text-gray-500">{ex.primaryMuscles.join(', ')}</p>
                </div>
                <ChevronRight size={14} className="text-gray-600" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick exercises */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Featured Exercises</h2>
          <Link to="/exercises" className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-0.5">
            View all <ChevronRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {exercises.filter(e => ['bench-press', 'squat', 'deadlift', 'pull-ups'].includes(e.id)).map(ex => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>
      </div>
    </div>
  );
}
