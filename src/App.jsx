import React, { useState } from 'react';
import { activities } from './data/activities';
import HomeView from './components/HomeView';
import ActivityView from './components/ActivityView';
import TimerView from './components/TimerView';
import DecisionView from './components/DecisionView';

function App() {
  const [view, setView] = useState('home'); // home, activity, timer, decision
  const [currentActivity, setCurrentActivity] = useState(null);

  const getRandomActivity = () => {
    const randomIndex = Math.floor(Math.random() * activities.length);
    return activities[randomIndex];
  };

  const handleStart = () => {
    setCurrentActivity(getRandomActivity());
    setView('activity');
  };

  const handleNewActivity = () => {
    setCurrentActivity(getRandomActivity());
  };

  const handleStartTimer = () => {
    setView('timer');
  };

  const handleTimerComplete = () => {
    setView('decision');
  };

  const handleReset = () => {
    setView('home');
    setCurrentActivity(null);
  };

  return (
    <div className="app-container">
      {view === 'home' && (
        <HomeView onStart={handleStart} />
      )}

      {view === 'activity' && (
        <ActivityView
          activity={currentActivity}
          onStartTimer={handleStartTimer}
          onNewActivity={handleNewActivity}
          onCancel={handleReset}
        />
      )}

      {view === 'timer' && (
        <TimerView
          duration={600} // 10 minutes
          onComplete={handleTimerComplete}
          onCancel={handleReset}
        />
      )}

      {view === 'decision' && (
        <DecisionView
          onEat={handleReset}
          onSkip={handleReset}
        />
      )}
    </div>
  );
}

export default App;
