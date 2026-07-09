import { getDemoProgressEnabled, getDemoSessions } from './dev-tools';

const STORAGE_KEY = 'mindful_eating_sessions';

function readStoredSessions(key) {
    const data = localStorage.getItem(key);
    if (!data) return [];

    try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeStoredSessions(key, sessions) {
    localStorage.setItem(key, JSON.stringify(sessions));
}

export const getSessions = () => {
    const sessions = readStoredSessions(STORAGE_KEY);
    if (!getDemoProgressEnabled()) return sessions;

    return [...sessions, ...getDemoSessions()];
};

export const getRealSessions = () => readStoredSessions(STORAGE_KEY);

export const createSession = (sessionData) => {
    const sessions = readStoredSessions(STORAGE_KEY);
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
    writeStoredSessions(STORAGE_KEY, sessions);
    return newSession;
};

export const updateSession = (id, updates) => {
    const sessions = readStoredSessions(STORAGE_KEY);
    const index = sessions.findIndex(s => s.id === id);
    if (index !== -1) {
        sessions[index] = { ...sessions[index], ...updates };
        writeStoredSessions(STORAGE_KEY, sessions);
        return sessions[index];
    }
    return null;
};
