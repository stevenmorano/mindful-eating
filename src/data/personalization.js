import { categoryMeta } from './activities';

const PERSONALIZATION_KEY = 'mm-personalization';

export const MAX_CUSTOM_ACTIVITIES = 100;
export const MAX_ACTIVITY_TEXT_LENGTH = 160;
export const MIN_TIMER_MINUTES = 1;
export const MAX_TIMER_MINUTES = 60;
export const TIMER_PRESETS = [2, 5, 10, 15, 20];

const DEFAULT_PERSONALIZATION = {
  customActivities: [],
  hiddenActivityIds: [],
  favoriteActivityIds: [],
  activityWeights: {},
};

function readStoredPersonalization() {
  try {
    const raw = localStorage.getItem(PERSONALIZATION_KEY);
    if (!raw) return DEFAULT_PERSONALIZATION;

    const parsed = JSON.parse(raw);
    return sanitizePersonalization(parsed);
  } catch {
    return DEFAULT_PERSONALIZATION;
  }
}

function writeStoredPersonalization(personalization) {
  try {
    localStorage.setItem(PERSONALIZATION_KEY, JSON.stringify(sanitizePersonalization(personalization)));
  } catch {
    // Keep the pause flow working when storage is unavailable.
  }
}

function normalizeText(text) {
  return typeof text === 'string' ? text.trim().replace(/\s+/g, ' ') : '';
}

function normalizeMinutes(minutes) {
  const parsed = Number(minutes);
  if (!Number.isFinite(parsed)) return 5;
  return Math.min(MAX_TIMER_MINUTES, Math.max(MIN_TIMER_MINUTES, Math.round(parsed)));
}

function uniqueStrings(values, limit = Infinity) {
  if (!Array.isArray(values)) return [];

  return [...new Set(values.filter(value => typeof value === 'string' && value.length > 0))].slice(0, limit);
}

function sanitizeCustomActivity(activity) {
  if (!activity || typeof activity !== 'object') return null;

  const text = normalizeText(activity.text);
  const id = typeof activity.id === 'string' && activity.id.length <= 100 ? activity.id : null;
  const category = typeof activity.category === 'string' && categoryMeta[activity.category]
    ? activity.category
    : 'Custom';
  if (!id || !text || text.length > MAX_ACTIVITY_TEXT_LENGTH) return null;

  return {
    id,
    text,
    category,
    defaultDurationMinutes: normalizeMinutes(activity.defaultDurationMinutes),
    createdAt: typeof activity.createdAt === 'string' ? activity.createdAt : null,
  };
}

export function sanitizePersonalization(value) {
  const source = value && typeof value === 'object' ? value : DEFAULT_PERSONALIZATION;
  const customActivities = (Array.isArray(source.customActivities) ? source.customActivities : [])
    .map(sanitizeCustomActivity)
    .filter(Boolean)
    .slice(0, MAX_CUSTOM_ACTIVITIES);
  const hiddenActivityIds = uniqueStrings(source.hiddenActivityIds, 600);
  const favoriteActivityIds = uniqueStrings(source.favoriteActivityIds, 600);
  const activityWeights = {};

  if (source.activityWeights && typeof source.activityWeights === 'object') {
    Object.entries(source.activityWeights).slice(0, 600).forEach(([id, weight]) => {
      if (typeof id !== 'string' || id.length === 0) return;
      const normalizedWeight = Number(weight);
      if (Number.isFinite(normalizedWeight) && normalizedWeight >= 1 && normalizedWeight <= 5) {
        activityWeights[id] = Math.round(normalizedWeight);
      }
    });
  }

  return { customActivities, hiddenActivityIds, favoriteActivityIds, activityWeights };
}

export function getPersonalization() {
  return readStoredPersonalization();
}

export function savePersonalization(nextPersonalization) {
  const sanitized = sanitizePersonalization(nextPersonalization);
  writeStoredPersonalization(sanitized);
  return sanitized;
}

export function createCustomActivity({ text, category = 'Custom', defaultDurationMinutes = 5 }) {
  const current = getPersonalization();
  const normalizedText = normalizeText(text);

  if (!normalizedText || normalizedText.length > MAX_ACTIVITY_TEXT_LENGTH || current.customActivities.length >= MAX_CUSTOM_ACTIVITIES) {
    return null;
  }

  const activity = {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text: normalizedText,
    category: categoryMeta[category] ? category : 'Custom',
    defaultDurationMinutes: normalizeMinutes(defaultDurationMinutes),
    createdAt: new Date().toISOString(),
  };

  return savePersonalization({ ...current, customActivities: [...current.customActivities, activity] });
}

export function updateCustomActivity(id, updates) {
  const current = getPersonalization();
  const customActivities = current.customActivities.map(activity => {
    if (activity.id !== id) return activity;

    const text = updates.text === undefined ? activity.text : normalizeText(updates.text);
    if (!text || text.length > MAX_ACTIVITY_TEXT_LENGTH) return activity;

    return {
      ...activity,
      text,
      category: updates.category === undefined || !categoryMeta[updates.category]
        ? activity.category
        : updates.category,
      defaultDurationMinutes: updates.defaultDurationMinutes === undefined
        ? activity.defaultDurationMinutes
        : normalizeMinutes(updates.defaultDurationMinutes),
    };
  });

  return savePersonalization({ ...current, customActivities });
}

export function removeCustomActivity(id) {
  const current = getPersonalization();
  const customActivities = current.customActivities.filter(activity => activity.id !== id);
  return savePersonalization({ ...current, customActivities });
}
