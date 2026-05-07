import React, { useState, useEffect } from 'react';
import { getActivities, getRandomSnack } from './data/activities';
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

  // Dev mode state
  const [isDevMode, setIsDevMode] = useState(() => {
    return localStorage.getItem('mm-dev-mode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('mm-dev-mode', isDevMode);
  }, [isDevMode]);

  // Theme state
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('mm-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('mm-theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.body.classList.add('dark-theme'); // for outer body if needed
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const getRandomActivity = () => {
    const allActivities = getActivities();
    const randomIndex = Math.floor(Math.random() * allActivities.length);
    return allActivities[randomIndex];
  };

  const handleStart = () => {
    setCurrentActivity(getRandomActivity());
    setView('activity');
  };

  const handleEmergencyStart = () => {
    setCurrentActivity({ text: "Guided Breathing (4-4-4-4): Inhale 4s, Hold 4s, Exhale 4s, Hold 4s", category: "Emergency" });
    const session = createSession({
      activityTitle: "Emergency Breathing",
      activityDurationMinutes: 5,
    });
    setCurrentSessionId(session.id);
    setView('timer');
  };

  const handleNewActivity = () => {
    setCurrentActivity(getRandomActivity());
  };

  const handleStartTimer = () => {
    const session = createSession({
      activityTitle: currentActivity.text,
      activityDurationMinutes: 5,
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
    <div className={`app-container ${isDark ? 'dark' : ''}`}>
      {view === 'home' && (
        <HomeView 
            onStart={handleStart} 
            onEmergency={handleEmergencyStart}
            onViewHistory={handleViewHistory} 
            isDark={isDark} 
            toggleTheme={toggleTheme} 
            isDevMode={isDevMode}
            toggleDevMode={() => setIsDevMode(!isDevMode)}
        />
      )}

      {view === 'activity' && (
        <ActivityView
          activity={currentActivity}
          onStartTimer={handleStartTimer}
          onNewActivity={handleNewActivity}
          onCancel={handleReset}
          isDark={isDark} toggleTheme={toggleTheme}
        />
      )}

      {view === 'timer' && (
        <TimerView
          duration={isDevMode ? 5 : 300} // 5 seconds in dev mode, 5 minutes normally
          onComplete={handleTimerComplete}
          onCancel={handleTimerCancel}
        />
      )}

      {view === 'decision' && (
        <DecisionView
          onEat={() => handleDecision(true)}
          onSkip={() => handleDecision(false)}
          onExtend={handleStart}
        />
      )}

      {view === 'history' && (
        <HistoryView onClose={handleCloseHistory} isDark={isDark} toggleTheme={toggleTheme} />
      )}
    </div>
  );
}

export default App;
