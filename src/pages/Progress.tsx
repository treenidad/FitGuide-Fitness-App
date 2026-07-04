import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar
} from 'recharts';
import { TrendingUp, Award, Calendar, Dumbbell, Flame, Clock } from 'lucide-react';
import { getSessions, getPersonalRecords } from '../lib/storage';
import { weeklyProgress, strengthProgress } from '../data/userData';
import { exercises } from '../data/exercises';
import PageHeader from '../components/PageHeader';

const TooltipStyle = {
  contentStyle: { background: '#111827', border: '1px solid #374151', borderRadius: 12, color: '#f9fafb', fontSize: 12 },
};

export default function Progress() {
  const [sessions] = useState(() => getSessions());
  const [prs] = useState(() => getPersonalRecords());
  const [strengthTab, setStrengthTab] = useState<'squat' | 'benchPress' | 'deadlift'>('squat');

  const totalCalories = sessions.reduce((s, session) => s + session.caloriesBurned, 0);
  const totalMinutes = sessions.reduce((s, session) => s + session.duration, 0);
  const avgDuration = sessions.length ? Math.round(totalMinutes / sessions.length) : 0;
  const totalVolume = sessions.reduce((s, session) => s + session.totalVolume, 0);

  const weeklyWorkouts = weeklyProgress.map(w => ({ week: w.week, workouts: w.workouts }));

  const tabs = [
    { id: 'squat' as const, label: 'Squat' },
    { id: 'benchPress' as const, label: 'Bench Press' },
    { id: 'deadlift' as const, label: 'Deadlift' },
  ];

  return (
    <div className="px-4 lg:px-8 py-6 animate-fade-in">
      <PageHeader title="Progress" subtitle="Track your fitness journey" />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { icon: Calendar, label: 'Total Workouts', value: sessions.length, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { icon: Flame, label: 'Total Calories', value: totalCalories.toLocaleString(), color: 'text-red-400', bg: 'bg-red-500/10' },
          { icon: Clock, label: 'Hours Trained', value: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { icon: Dumbbell, label: 'Total Volume', value: `${(totalVolume / 1000).toFixed(1)}k lbs`, color: 'text-teal-400', bg: 'bg-teal-500/10' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="card p-4">
            <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <div className="font-display text-xl font-bold text-white">{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly Frequency */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-white">Weekly Frequency</h2>
              <p className="text-xs text-gray-500">Workouts per week</p>
            </div>
            <Calendar size={18} className="text-orange-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyWorkouts} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 10 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
              <Tooltip {...TooltipStyle} formatter={(v) => [v, 'Workouts']} />
              <Bar dataKey="workouts" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Calorie Burn */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-white">Calorie Burn</h2>
              <p className="text-xs text-gray-500">Weekly calories burned</p>
            </div>
            <Flame size={18} className="text-red-400" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyProgress} margin={{ left: -20 }}>
              <defs>
                <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 10 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} />
              <Tooltip {...TooltipStyle} formatter={(v) => [v, 'Calories']} />
              <Area type="monotone" dataKey="calories" stroke="#ef4444" strokeWidth={2} fill="url(#calGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strength Progress */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-white">Strength Progress</h2>
            <p className="text-xs text-gray-500">1RM estimates over time</p>
          </div>
          <TrendingUp size={18} className="text-teal-400" />
        </div>
        <div className="flex gap-2 mb-4">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setStrengthTab(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                strengthTab === t.id
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={strengthProgress[strengthTab]} margin={{ left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
            <Tooltip {...TooltipStyle} formatter={(v) => [`${v} lbs`, 'Weight']} />
            <Line type="monotone" dataKey="weight" stroke="#f97316" strokeWidth={2.5} dot={{ fill: '#f97316', r: 4 }} activeDot={{ r: 6, fill: '#fb923c' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Personal Records */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Personal Records</h2>
            <Award size={18} className="text-amber-400" />
          </div>
          <div className="space-y-3">
            {prs.map(pr => (
              <div key={pr.exerciseId} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award size={14} className="text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-200">{pr.exerciseName}</p>
                  <p className="text-xs text-gray-500">{new Date(pr.achievedAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-amber-400">{pr.weight} lbs</span>
                  <span className="text-xs text-gray-500 block">× {pr.reps} reps</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Workout Log</h2>
            <Calendar size={18} className="text-blue-400" />
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {sessions.slice(0, 10).map(session => (
              <div key={session.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Dumbbell size={14} className="text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">{session.workoutName}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(session.startedAt).toLocaleDateString()} • {session.duration}min
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-medium text-orange-400">{session.caloriesBurned} cal</span>
                  {session.totalVolume > 0 && (
                    <span className="text-xs text-gray-600 block">{(session.totalVolume / 1000).toFixed(1)}k lbs</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
