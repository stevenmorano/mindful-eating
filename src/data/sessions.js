const STORAGE_KEY = 'mindful_eating_sessions';

export const getSessions = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

export const createSession = (sessionData) => {
    const sessions = getSessions();
    const newSession = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        activityTitle: sessionData.activityTitle,
        activityCategory: sessionData.activityCategory || null,
        activityDurationMinutes: sessionData.activityDurationMinutes,
        pauseRound: sessionData.pauseRound || 1,
        completed: false,
        stillHungry: null,
    };
    sessions.push(newSession);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    return newSession;
};

export const updateSession = (id, updates) => {
    const sessions = getSessions();
    const index = sessions.findIndex(s => s.id === id);
    if (index !== -1) {
        sessions[index] = { ...sessions[index], ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
        return sessions[index];
    }
    return null;
};
