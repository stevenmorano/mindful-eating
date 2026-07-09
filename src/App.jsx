import React, { useState, useEffect } from 'react';
import { getActivities, getActivityCategories, categoryMeta } from './data/activities';
import { createSession, updateSession, getRealSessions, getSessions } from './data/sessions';
import {
  getAchievementStats,
  getNewlyUnlockedAchievements,
  loadSeenAchievementIds,
  saveSeenAchievementIds,
  seedSeenAchievementIdsFromSessions,
} from './data/achievements';
import {
  buildDemoSessions,
  clearDemoProgressEnabled,
  clearDemoSessions,
  getDemoProgressEnabled,
  getDevToolsUnlocked,
  clearDemoSeenAchievementIds,
  getDemoSeenAchievementIds,
  setDemoProgressEnabled,
  setDemoSessions,
  setDemoSeenAchievementIds,
  setDevToolsUnlocked,
  verifyDevToolsPassword,
} from './data/dev-tools';
import HomeView from './components/HomeView';
import ActivityView from './components/ActivityView';
import TimerView from './components/TimerView';
import DecisionView from './components/DecisionView';
import HistoryView from './components/HistoryView';
import AchievementCelebration from './components/AchievementCelebration';
import DevToolsModal from './components/DevToolsModal';

function App() {
  const [view, setView] = useState('home'); // home, activity, timer, decision, history
  const [currentActivity, setCurrentActivity] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [pauseRound, setPauseRound] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [achievementQueue, setAchievementQueue] = useState([]);
  const [isDevToolsUnlocked, setIsDevToolsUnlockedState] = useState(() => getDevToolsUnlocked());
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [devToolsPassword, setDevToolsPassword] = useState('');
  const [devToolsError, setDevToolsError] = useState('');
  const [isDemoProgressEnabled, setIsDemoProgressEnabled] = useState(() => getDemoProgressEnabled());

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

  useEffect(() => {
    setDevToolsUnlocked(isDevToolsUnlocked);
  }, [isDevToolsUnlocked]);

  useEffect(() => {
    setDemoProgressEnabled(isDemoProgressEnabled);
  }, [isDemoProgressEnabled]);

  useEffect(() => {
    const seenAchievementIds = loadSeenAchievementIds();
    if (seenAchievementIds.size === 0) {
      seedSeenAchievementIdsFromSessions(getRealSessions());
    }
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  const queueAchievementCelebrations = (achievements = null, useDemoSeenStore = isDemoProgressEnabled) => {
    const sessions = getSessions();
    const seenIds = useDemoSeenStore ? getDemoSeenAchievementIds() : loadSeenAchievementIds();
    const newUnlocks = achievements || getNewlyUnlockedAchievements(sessions, seenIds);

    if (newUnlocks.length === 0) {
      return;
    }

    newUnlocks.forEach(achievement => seenIds.add(achievement.id));
    if (useDemoSeenStore) {
      setDemoSeenAchievementIds(seenIds);
    } else {
      saveSeenAchievementIds(seenIds);
    }
    setAchievementQueue(currentQueue => [...currentQueue, ...newUnlocks]);
  };

  const handleOpenDevTools = () => {
    setDevToolsError('');
    setIsDevToolsOpen(true);
  };

  const handleCloseDevTools = () => {
    setIsDevToolsOpen(false);
    setDevToolsPassword('');
    setDevToolsError('');
  };

  const handleDevToolsPasswordSubmit = async () => {
    const isValid = await verifyDevToolsPassword(devToolsPassword);
    if (!isValid) {
      setDevToolsError('That password did not unlock the private tools.');
      return;
    }

    setIsDevToolsUnlockedState(true);
    setDevToolsPassword('');
    setDevToolsError('');
  };

  const handleLockDevTools = () => {
    setIsDevToolsUnlockedState(false);
    setIsDevToolsOpen(false);
    setDevToolsPassword('');
    setDevToolsError('');
  };

  const handleLoadDemoProgress = () => {
    setDemoSessions(buildDemoSessions());
    setDemoProgressEnabled(true);
    setIsDemoProgressEnabled(true);
    clearDemoSeenAchievementIds();
    queueAchievementCelebrations(null, true);
  };

  const handleClearDemoProgress = () => {
    clearDemoSessions();
    clearDemoProgressEnabled();
    clearDemoSeenAchievementIds();
    setIsDemoProgressEnabled(false);
  };

  const handleScanAchievements = () => {
    queueAchievementCelebrations();
  };

  const handleResetSeenAchievements = () => {
    if (isDemoProgressEnabled) {
      setDemoSeenAchievementIds(new Set());
      return;
    }

    seedSeenAchievementIdsFromSessions(getRealSessions());
  };

  const handleReplayAchievementDemo = () => {
    const stats = getAchievementStats(getSessions());
    const demoBurst = stats.achievements.filter(achievement =>
      ['first_pause', 'three_pauses', 'five_wins', 'first_savings', 'sampler', 'second_thought', 'double_pause_win', 'no_shame_snack'].includes(achievement.id)
    );

    if (demoBurst.length === 0) return;
    setAchievementQueue(currentQueue => [...currentQueue, ...demoBurst]);
  };

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

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setCurrentActivity(getRandomActivity(category));
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
    queueAchievementCelebrations();
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
            onOpenDevTools={handleOpenDevTools}
            isDevToolsUnlocked={isDevToolsUnlocked}
            isDark={isDark} 
            toggleTheme={toggleTheme} 
        />
      )}

      {view === 'activity' && (
        <ActivityView
          activity={currentActivity}
          categories={getActivityCategories()}
          categoryMeta={categoryMeta[currentActivity?.category]}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
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

      {achievementQueue.length > 0 && (
        <AchievementCelebration
          achievement={achievementQueue[0]}
          total={achievementQueue.length}
          onDismiss={() => setAchievementQueue(currentQueue => currentQueue.slice(1))}
        />
      )}

      <DevToolsModal
        isOpen={isDevToolsOpen}
        isUnlocked={isDevToolsUnlocked}
        isDevMode={isDevMode}
        passwordValue={devToolsPassword}
        passwordError={devToolsError}
        isDemoProgressEnabled={isDemoProgressEnabled}
        onPasswordChange={setDevToolsPassword}
        onPasswordSubmit={handleDevToolsPasswordSubmit}
        onClose={handleCloseDevTools}
        onToggleDevMode={() => setIsDevMode(!isDevMode)}
        onLoadDemoProgress={handleLoadDemoProgress}
        onClearDemoProgress={handleClearDemoProgress}
        onScanAchievements={handleScanAchievements}
        onResetSeenAchievements={handleResetSeenAchievements}
        onReplayAchievementDemo={handleReplayAchievementDemo}
        onLock={handleLockDevTools}
      />
    </div>
  );
}

export default App;
