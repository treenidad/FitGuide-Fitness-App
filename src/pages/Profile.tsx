import { useState } from 'react';
import { User, Edit3, Save, Target, Dumbbell, Award, TrendingUp } from 'lucide-react';
import { getProfile, saveProfile } from '../lib/storage';
import { getSessions, getPersonalRecords } from '../lib/storage';
import type { UserProfile } from '../types';
import PageHeader from '../components/PageHeader';

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>(() => getProfile());
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...profile });
  const sessions = getSessions();
  const prs = getPersonalRecords();

  function handleSave() {
    saveProfile(form);
    setProfile(form);
    setEditing(false);
  }

  const bmi = ((form.weight / (form.height * form.height)) * 703).toFixed(1);
  const bmiCategory = parseFloat(bmi) < 18.5 ? 'Underweight'
    : parseFloat(bmi) < 25 ? 'Normal'
    : parseFloat(bmi) < 30 ? 'Overweight'
    : 'Obese';
  const bmiColor = parseFloat(bmi) < 18.5 ? 'text-blue-400'
    : parseFloat(bmi) < 25 ? 'text-emerald-400'
    : parseFloat(bmi) < 30 ? 'text-amber-400'
    : 'text-red-400';

  return (
    <div className="px-4 lg:px-8 py-6 animate-fade-in">
      <PageHeader
        title="Profile"
        subtitle="Your fitness profile and stats"
        action={
          <button
            onClick={() => editing ? handleSave() : setEditing(true)}
            className={`flex items-center gap-2 text-sm ${editing ? 'btn-primary' : 'btn-secondary'}`}
          >
            {editing ? <Save size={15} /> : <Edit3 size={15} />}
            {editing ? 'Save' : 'Edit Profile'}
          </button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card p-6 text-center">
            <div className="relative inline-block mb-4">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-orange-500/30"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-orange-500/20 border-2 border-orange-500/30 flex items-center justify-center mx-auto">
                  <User size={40} className="text-orange-400" />
                </div>
              )}
            </div>
            {editing ? (
              <div className="space-y-3 text-left">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Name</label>
                  <input className="input text-sm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Age</label>
                    <input type="number" className="input text-sm" value={form.age} onChange={e => setForm({ ...form, age: +e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Weight (lbs)</label>
                    <input type="number" className="input text-sm" value={form.weight} onChange={e => setForm({ ...form, weight: +e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Height (inches)</label>
                  <input type="number" className="input text-sm" value={form.height} onChange={e => setForm({ ...form, height: +e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Fitness Goal</label>
                  <input className="input text-sm" value={form.fitnessGoal} onChange={e => setForm({ ...form, fitnessGoal: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Experience Level</label>
                  <select className="input text-sm" value={form.experienceLevel} onChange={e => setForm({ ...form, experienceLevel: e.target.value as UserProfile['experienceLevel'] })}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
            ) : (
              <>
                <h2 className="font-display text-2xl font-bold text-white">{profile.name}</h2>
                <p className="text-orange-400 text-sm font-medium mt-0.5">{profile.experienceLevel}</p>
                <p className="text-gray-400 text-xs mt-2">{profile.fitnessGoal}</p>
                <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-gray-800">
                  <div>
                    <p className="text-xl font-bold text-white">{profile.weight} lbs</p>
                    <p className="text-xs text-gray-500">Weight</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{Math.floor(profile.height / 12)}'{profile.height % 12}"</p>
                    <p className="text-xs text-gray-500">Height</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* BMI Card */}
          {!editing && (
            <div className="card p-4 mt-4">
              <h3 className="text-sm font-semibold text-white mb-3">Body Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">BMI</span>
                  <span className={`text-sm font-semibold ${bmiColor}`}>{bmi} ({bmiCategory})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Age</span>
                  <span className="text-sm text-gray-200">{profile.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Member Since</span>
                  <span className="text-sm text-gray-200">{new Date(profile.joinedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Dumbbell, label: 'Total Workouts', value: profile.totalWorkouts, color: 'text-orange-400', bg: 'bg-orange-500/10' },
              { icon: TrendingUp, label: 'Workout Streak', value: `${profile.workoutStreak} days`, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { icon: Award, label: 'Personal Records', value: prs.length, color: 'text-teal-400', bg: 'bg-teal-500/10' },
              { icon: Target, label: 'Total Sessions', value: sessions.length, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="card p-4">
                <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon size={18} className={color} />
                </div>
                <div className="font-display text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Personal Records */}
          <div className="card p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Award size={16} className="text-amber-400" />
              Personal Records
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {prs.map(pr => (
                <div key={pr.exerciseId} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-200">{pr.exerciseName}</p>
                    <p className="text-xs text-gray-500">{pr.achievedAt}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-400">{pr.weight}lbs</p>
                    <p className="text-xs text-gray-500">×{pr.reps}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
