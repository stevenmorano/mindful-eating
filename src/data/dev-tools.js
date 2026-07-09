const DEV_TOOLS_UNLOCK_KEY = 'mm-dev-tools-unlocked';
const QA_DEMO_ENABLED_KEY = 'mm-qa-demo-enabled';
const QA_DEMO_SESSIONS_KEY = 'mm-qa-demo-sessions';
const QA_DEMO_SEEN_KEY = 'mm-qa-demo-seen';
const PASSWORD_HASH = 'c992a75a9bd039974af63511b42aaf837f25a0dce55c6654a359402f6e4327d2';
const PASSWORD_SALT = 'MindfulEating.QA.v1';

function getStorageValue(storage, key, fallback = null) {
    try {
        return storage.getItem(key) ?? fallback;
    } catch {
        return fallback;
    }
}

function setStorageValue(storage, key, value) {
    try {
        storage.setItem(key, value);
    } catch {
        // Ignore storage failures in restrictive/private browsing contexts.
    }
}

function removeStorageValue(storage, key) {
    try {
        storage.removeItem(key);
    } catch {
        // Ignore storage failures in restrictive/private browsing contexts.
    }
}

function toHex(buffer) {
    return Array.from(new Uint8Array(buffer))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

export function getDevToolsUnlocked() {
    return getStorageValue(sessionStorage, DEV_TOOLS_UNLOCK_KEY, 'false') === 'true';
}

export function setDevToolsUnlocked(isUnlocked) {
    setStorageValue(sessionStorage, DEV_TOOLS_UNLOCK_KEY, isUnlocked ? 'true' : 'false');
}

export function getDemoProgressEnabled() {
    return getStorageValue(localStorage, QA_DEMO_ENABLED_KEY, 'false') === 'true';
}

export function setDemoProgressEnabled(isEnabled) {
    setStorageValue(localStorage, QA_DEMO_ENABLED_KEY, isEnabled ? 'true' : 'false');
}

export function clearDemoProgressEnabled() {
    removeStorageValue(localStorage, QA_DEMO_ENABLED_KEY);
}

export function getDemoSessions() {
    try {
        const raw = localStorage.getItem(QA_DEMO_SESSIONS_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function setDemoSessions(sessions) {
    setStorageValue(localStorage, QA_DEMO_SESSIONS_KEY, JSON.stringify(Array.isArray(sessions) ? sessions : []));
}

export function clearDemoSessions() {
    removeStorageValue(localStorage, QA_DEMO_SESSIONS_KEY);
}

export function getDemoSeenAchievementIds() {
    try {
        const raw = localStorage.getItem(QA_DEMO_SEEN_KEY);
        if (!raw) return new Set();
        const parsed = JSON.parse(raw);
        return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
        return new Set();
    }
}

export function setDemoSeenAchievementIds(ids) {
    const nextIds = Array.from(new Set(ids));
    setStorageValue(localStorage, QA_DEMO_SEEN_KEY, JSON.stringify(nextIds));
    return new Set(nextIds);
}

export function clearDemoSeenAchievementIds() {
    removeStorageValue(localStorage, QA_DEMO_SEEN_KEY);
}

export function buildDemoSessions() {
    const now = Date.now();
    const day = 1000 * 60 * 60 * 24;

    return [
        {
            id: 'qa-demo-1',
            timestamp: new Date(now - 5 * day).toISOString(),
            activityTitle: 'Walk around the block',
            activityCategory: 'Movement',
            activityDurationMinutes: 5,
            pauseRound: 1,
            completed: true,
            stillHungry: false,
        },
        {
            id: 'qa-demo-2',
            timestamp: new Date(now - 4 * day).toISOString(),
            activityTitle: 'Word puzzle break',
            activityCategory: 'Mind Engagement',
            activityDurationMinutes: 5,
            pauseRound: 1,
            completed: true,
            stillHungry: false,
        },
        {
            id: 'qa-demo-3',
            timestamp: new Date(now - 3 * day).toISOString(),
            activityTitle: 'Tidy one drawer',
            activityCategory: 'Productive',
            activityDurationMinutes: 5,
            pauseRound: 1,
            completed: true,
            stillHungry: false,
        },
        {
            id: 'qa-demo-4',
            timestamp: new Date(now - 2 * day).toISOString(),
            activityTitle: 'Text a friend',
            activityCategory: 'Social',
            activityDurationMinutes: 5,
            pauseRound: 1,
            completed: true,
            stillHungry: false,
        },
        {
            id: 'qa-demo-5',
            timestamp: new Date(now - day).toISOString(),
            activityTitle: 'Box breathing reset',
            activityCategory: 'Mindfulness',
            activityDurationMinutes: 5,
            pauseRound: 2,
            completed: true,
            stillHungry: false,
        },
        {
            id: 'qa-demo-6',
            timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
            activityTitle: 'Wash your face',
            activityCategory: 'Personal Care',
            activityDurationMinutes: 5,
            pauseRound: 1,
            completed: true,
            stillHungry: true,
        },
    ];
}

export async function verifyDevToolsPassword(input) {
    if (!input) return false;
    if (!window.crypto?.subtle) return false;

    const encoder = new TextEncoder();
    const data = encoder.encode(`${PASSWORD_SALT}::${input.trim()}`);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return toHex(digest) === PASSWORD_HASH;
}
