import React, { useState } from 'react';
import { activities } from './data/activities';
import { createSession, updateSession } from './data/sessions';
import HomeView from './components/HomeView';
import ActivityView from './components/ActivityView';
import TimerView from './components/TimerView';
import DecisionView from './components/DecisionView';
import HistoryView from './components/HistoryView';

function App() {
  const [view, setView] = useState('home'); // home, activity, timer, decision, history
  const [currentActivity, setCurrentActivity] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);

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
    const session = createSession({
      activityTitle: currentActivity.text,
      activityDurationMinutes: 10,
    });
    setCurrentSessionId(session.id);
    setView('timer');
  };

  const handleTimerComplete = () => {
    if (currentSessionId) {
      updateSession(currentSessionId, { completed: true });
    }
    setView('decision');
  };

  const handleTimerCancel = () => {
    if (currentSessionId) {
      updateSession(currentSessionId, { completed: false });
    }
    setView('home');
    setCurrentActivity(null);
    setCurrentSessionId(null);
  };

  const handleDecision = (stillHungry) => {
    if (currentSessionId) {
      updateSession(currentSessionId, { stillHungry });
    }
    setView('home');
    setCurrentActivity(null);
    setCurrentSessionId(null);
  };

  const handleReset = () => {
    setView('home');
    setCurrentActivity(null);
    setCurrentSessionId(null);
  };

  const handleViewHistory = () => {
    setView('history');
  };

  const handleCloseHistory = () => {
    setView('home');
  };

  return (
    <div className="app-container">
      {view === 'home' && (
        <HomeView onStart={handleStart} onViewHistory={handleViewHistory} />
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
          onCancel={handleTimerCancel}
        />
      )}

      {view === 'decision' && (
        <DecisionView
          onEat={() => handleDecision(true)}
          onSkip={() => handleDecision(false)}
        />
      )}

      {view === 'history' && (
        <HistoryView onClose={handleCloseHistory} />
      )}
    </div>
  );
}

export default App;
