import { useState } from 'react';
import { Bell, User, Shield, Trash2, ChevronRight, Volume2, Info } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [units, setUnits] = useState<'imperial' | 'metric'>('imperial');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function handleClearData() {
    const keys = ['fitguide_custom_workouts', 'fitguide_sessions', 'fitguide_profile', 'fitguide_favorites', 'fitguide_prs', 'fitguide_active_workout'];
    keys.forEach(k => localStorage.removeItem(k));
    setShowDeleteConfirm(false);
    window.location.reload();
  }

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-orange-500' : 'bg-gray-700'}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );

  const sections = [
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          iconColor: 'text-orange-400',
          iconBg: 'bg-orange-500/10',
          label: 'Workout Reminders',
          desc: 'Get notified before your scheduled workouts',
          action: <Toggle checked={notifications} onChange={() => setNotifications(!notifications)} />,
        },
        {
          icon: Volume2,
          iconColor: 'text-blue-400',
          iconBg: 'bg-blue-500/10',
          label: 'Timer Sounds',
          desc: 'Audio alerts for rest and workout timers',
          action: <Toggle checked={sound} onChange={() => setSound(!sound)} />,
        },
      ],
    },
    {
      title: 'Units',
      items: [
        {
          icon: User,
          iconColor: 'text-teal-400',
          iconBg: 'bg-teal-500/10',
          label: 'Measurement Units',
          desc: units === 'imperial' ? 'Imperial (lbs, inches)' : 'Metric (kg, cm)',
          action: (
            <div className="flex bg-gray-800 rounded-xl p-0.5">
              {(['imperial', 'metric'] as const).map(u => (
                <button
                  key={u}
                  onClick={() => setUnits(u)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all capitalize ${units === u ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-gray-200'}`}
                >
                  {u}
                </button>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      title: 'Data',
      items: [
        {
          icon: Shield,
          iconColor: 'text-emerald-400',
          iconBg: 'bg-emerald-500/10',
          label: 'Privacy Policy',
          desc: 'Read our privacy policy',
          action: <ChevronRight size={16} className="text-gray-500" />,
        },
        {
          icon: Info,
          iconColor: 'text-blue-400',
          iconBg: 'bg-blue-500/10',
          label: 'About FitGuide',
          desc: 'Version 1.0.0',
          action: <ChevronRight size={16} className="text-gray-500" />,
        },
      ],
    },
    {
      title: 'Danger Zone',
      items: [
        {
          icon: Trash2,
          iconColor: 'text-red-400',
          iconBg: 'bg-red-500/10',
          label: 'Clear All Data',
          desc: 'Remove all workouts, sessions, and progress',
          action: (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-1.5 text-xs font-medium text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors"
            >
              Clear
            </button>
          ),
        },
      ],
    },
  ];

  return (
    <div className="px-4 lg:px-8 py-6 animate-fade-in">
      <PageHeader title="Settings" subtitle="Configure your FitGuide experience" />

      <div className="max-w-2xl space-y-6">
        {sections.map(section => (
          <div key={section.title}>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{section.title}</h2>
            <div className="card divide-y divide-gray-800">
              {section.items.map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-4 p-4">
                    <div className={`w-9 h-9 ${item.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon size={17} className={item.iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-200">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <div className="flex-shrink-0">{item.action}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card p-6 max-w-sm w-full animate-scale-in">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-400" />
            </div>
            <h3 className="font-bold text-white text-center text-lg mb-2">Clear All Data?</h3>
            <p className="text-gray-400 text-sm text-center mb-6">This will permanently remove all your workouts, sessions, and progress. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleClearData} className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors text-sm">
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
