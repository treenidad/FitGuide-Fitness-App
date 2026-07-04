import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ExerciseLibrary from './pages/ExerciseLibrary';
import ExerciseDetail from './pages/ExerciseDetail';
import WorkoutBuilder from './pages/WorkoutBuilder';
import WorkoutPlans from './pages/WorkoutPlans';
import ActiveWorkout from './pages/ActiveWorkout';
import Progress from './pages/Progress';
import AICoach from './pages/AICoach';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/exercises" element={<ExerciseLibrary />} />
          <Route path="/exercises/:id" element={<ExerciseDetail />} />
          <Route path="/workout-builder" element={<WorkoutBuilder />} />
          <Route path="/plans" element={<WorkoutPlans />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/ai-coach" element={<AICoach />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/active-workout" element={<ActiveWorkout />} />
      </Routes>
    </BrowserRouter>
  );
}
