import React, { useState, useEffect } from 'react';
import { getActivities, getActivityCategories, categoryMeta } from './data/activities';
import { getActivityId } from './data/activities';
import { getPersonalization, MAX_TIMER_MINUTES, MIN_TIMER_MINUTES } from './data/personalization';
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
  getPersonalizationTestingEnabled,
  setDemoProgressEnabled,
  setDemoSessions,
  setDemoSeenAchievementIds,
  setPersonalizationTestingEnabled,
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
import PersonalizationView from './components/PersonalizationView';

function App() {
  const [view, setView] = useState('home'); // home, activity, timer, decision, history
  const [currentActivity, setCurrentActivity] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [pauseRound, setPauseRound] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentTimerDurationMinutes, setCurrentTimerDurationMinutes] = useState(5);
  const [activitySelectionNotice, setActivitySelectionNotice] = useState('');
  const [achievementQueue, setAchievementQueue] = useState([]);
  const [isDevToolsUnlocked, setIsDevToolsUnlockedState] = useState(() => getDevToolsUnlocked());
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [devToolsPassword, setDevToolsPassword] = useState('');
  const [devToolsError, setDevToolsError] = useState('');
  const [isDemoProgressEnabled, setIsDemoProgressEnabled] = useState(() => getDemoProgressEnabled());
  const [isPersonalizationTestingEnabled, setIsPersonalizationTestingEnabledState] = useState(() => getPersonalizationTestingEnabled());

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
    const personalization = isPersonalizationTestingEnabled ? getPersonalization() : null;
    const allActivities = personalization
      ? [...getActivities(), ...personalization.customActivities]
      : getActivities();
    const categoryActivities = category ? allActivities.filter(activity => activity.category === category) : allActivities;
    const hiddenIds = new Set(personalization?.hiddenActivityIds || []);
    const visibleCategoryActivities = categoryActivities.filter(activity => !hiddenIds.has(getActivityId(activity)));
    const visibleActivities = allActivities.filter(activity => !hiddenIds.has(getActivityId(activity)));
    let activityPool = visibleCategoryActivities;
    let notice = '';

    if (activityPool.length === 0 && categoryActivities.length > 0) {
      activityPool = categoryActivities;
      notice = 'Everything in this category is hidden, so this suggestion is shown as a backup.';
    } else if (activityPool.length === 0) {
      activityPool = visibleActivities.length > 0 ? visibleActivities : allActivities;
      notice = 'That category is unavailable right now, so here is another pause idea.';
    }

    const weightedPool = activityPool.flatMap(activity => {
      const activityId = getActivityId(activity);
      const isFavorite = personalization?.favoriteActivityIds.includes(activityId);
      const weight = isFavorite ? personalization.activityWeights[activityId] || 3 : 1;
      return Array.from({ length: weight }, () => activity);
    });
    const chosenActivity = weightedPool[Math.floor(Math.random() * weightedPool.length)] || null;
    return { activity: chosenActivity, notice };
  };

  const selectRandomActivity = (category) => {
    const { activity, notice } = getRandomActivity(category);
    setCurrentActivity(activity);
    setCurrentTimerDurationMinutes(activity?.defaultDurationMinutes || 5);
    setActivitySelectionNotice(notice);
  };

  const handleStart = (category = null) => {
    setPauseRound(1);
    setCurrentSessionId(null);
    setSelectedCategory(category);
    selectRandomActivity(category);
    setView('activity');
  };

  const handleEmergencyStart = () => {
    setPauseRound(1);
    setSelectedCategory('Emergency');
    setCurrentActivity({ text: "Guided Breathing (4-4-4-4): Inhale 4s, Hold 4s, Exhale 4s, Hold 4s", category: "Emergency" });
    setCurrentTimerDurationMinutes(5);
    setActivitySelectionNotice('');
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
    selectRandomActivity(selectedCategory);
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    selectRandomActivity(category);
  };

  const handleStartTimer = () => {
    const session = createSession({
      activityTitle: currentActivity.text,
      activityCategory: currentActivity.category,
      activityDurationMinutes: currentTimerDurationMinutes,
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
    setCurrentTimerDurationMinutes(5);
    setActivitySelectionNotice('');
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
    setCurrentTimerDurationMinutes(5);
    setActivitySelectionNotice('');
  };

  const handleReset = () => {
    setView('home');
    setCurrentActivity(null);
    setCurrentSessionId(null);
    setPauseRound(1);
    setSelectedCategory(null);
    setCurrentTimerDurationMinutes(5);
    setActivitySelectionNotice('');
  };

  const handleExtendPause = () => {
    if (currentSessionId) {
      updateSession(currentSessionId, { stillHungry: true });
    }
    setCurrentSessionId(null);
    setPauseRound(2);
    selectRandomActivity(selectedCategory);
    setView('activity');
  };

  const handleViewHistory = () => {
    setView('history');
  };

  const handleOpenPersonalization = () => {
    setView('personalization');
  };

  const handleClosePersonalization = () => {
    setView('home');
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
            onOpenPersonalization={handleOpenPersonalization}
            onOpenDevTools={handleOpenDevTools}
            isDevToolsUnlocked={isDevToolsUnlocked}
            isDark={isDark} 
            toggleTheme={toggleTheme} 
        />
      )}

      {view === 'activity' && (
        <ActivityView
          activity={currentActivity}
          categories={isPersonalizationTestingEnabled && getPersonalization().customActivities.length > 0
            ? [...getActivityCategories(), { category: 'Custom', label: 'Mine', count: getPersonalization().customActivities.length }]
            : getActivityCategories()}
          categoryMeta={categoryMeta[currentActivity?.category]}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          onStartTimer={handleStartTimer}
          onNewActivity={handleNewActivity}
            onCancel={handleReset}
          durationMinutes={currentTimerDurationMinutes}
          onDurationChange={(duration) => setCurrentTimerDurationMinutes(Math.min(MAX_TIMER_MINUTES, Math.max(MIN_TIMER_MINUTES, Number(duration) || 5)))}
          canCustomizeTimer={isPersonalizationTestingEnabled}
          selectionNotice={activitySelectionNotice}
          isDevMode={isDevMode}
          isDark={isDark} toggleTheme={toggleTheme}
        />
      )}

      {view === 'timer' && (
        <TimerView
          duration={isDevMode ? 5 : currentTimerDurationMinutes * 60}
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

      {view === 'personalization' && (
        <PersonalizationView
          isEnabled={isPersonalizationTestingEnabled}
          onClose={handleClosePersonalization}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
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
        isPersonalizationTestingEnabled={isPersonalizationTestingEnabled}
        passwordValue={devToolsPassword}
        passwordError={devToolsError}
        isDemoProgressEnabled={isDemoProgressEnabled}
        onPasswordChange={setDevToolsPassword}
        onPasswordSubmit={handleDevToolsPasswordSubmit}
        onClose={handleCloseDevTools}
        onToggleDevMode={() => setIsDevMode(!isDevMode)}
        onTogglePersonalizationTesting={() => {
          const nextEnabled = !isPersonalizationTestingEnabled;
          setPersonalizationTestingEnabled(nextEnabled);
          setIsPersonalizationTestingEnabledState(nextEnabled);
        }}
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
