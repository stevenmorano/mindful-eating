import React, { useState, useEffect } from 'react';
import { getActivities, getActivityCategories, categoryMeta } from './data/activities';
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
  const [pauseRound, setPauseRound] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const getRandomActivity = (category = null) => {
    const allActivities = getActivities();
    const availableActivities = category
      ? allActivities.filter(activity => activity.category === category)
      : allActivities;
    const activityPool = availableActivities.length > 0 ? availableActivities : allActivities;
    const randomIndex = Math.floor(Math.random() * activityPool.length);
    return activityPool[randomIndex];
  };

  const handleStart = (category = null) => {
    setPauseRound(1);
    setCurrentSessionId(null);
    setSelectedCategory(category);
    setCurrentActivity(getRandomActivity(category));
    setView('activity');
  };

  const handleEmergencyStart = () => {
    setPauseRound(1);
    setSelectedCategory('Emergency');
    setCurrentActivity({ text: "Guided Breathing (4-4-4-4): Inhale 4s, Hold 4s, Exhale 4s, Hold 4s", category: "Emergency" });
    const session = createSession({
      activityTitle: "Emergency Breathing",
      activityCategory: "Emergency",
      activityDurationMinutes: 5,
      pauseRound: 1,
    });
    setCurrentSessionId(session.id);
    setView('timer');
  };

  const handleNewActivity = () => {
    setCurrentActivity(getRandomActivity(selectedCategory));
  };

  const handleStartTimer = () => {
    const session = createSession({
      activityTitle: currentActivity.text,
      activityCategory: currentActivity.category,
      activityDurationMinutes: 5,
      pauseRound,
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
    setPauseRound(1);
    setSelectedCategory(null);
  };

  const handleDecision = (stillHungry) => {
    if (currentSessionId) {
      updateSession(currentSessionId, { stillHungry });
    }
    setView('home');
    setCurrentActivity(null);
    setCurrentSessionId(null);
    setPauseRound(1);
    setSelectedCategory(null);
  };

  const handleReset = () => {
    setView('home');
    setCurrentActivity(null);
    setCurrentSessionId(null);
    setPauseRound(1);
    setSelectedCategory(null);
  };

  const handleExtendPause = () => {
    if (currentSessionId) {
      updateSession(currentSessionId, { stillHungry: true });
    }
    setCurrentSessionId(null);
    setPauseRound(2);
    setCurrentActivity(getRandomActivity(selectedCategory));
    setView('activity');
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
            categories={getActivityCategories()}
            isDark={isDark} 
            toggleTheme={toggleTheme} 
            isDevMode={isDevMode}
            toggleDevMode={() => setIsDevMode(!isDevMode)}
        />
      )}

      {view === 'activity' && (
        <ActivityView
          activity={currentActivity}
          categoryMeta={categoryMeta[currentActivity?.category]}
          isSurprise={!selectedCategory}
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
          onExtend={handleExtendPause}
          canEatSnack={pauseRound >= 2}
        />
      )}

      {view === 'history' && (
        <HistoryView onClose={handleCloseHistory} isDark={isDark} toggleTheme={toggleTheme} />
      )}
    </div>
  );
}

export default App;
