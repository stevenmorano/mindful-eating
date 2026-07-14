import React, { useState } from 'react';
import { getActivities, getActivityCategories, getActivityId } from '../data/activities';
import {
  createCustomActivity,
  getPersonalization,
  MAX_ACTIVITY_TEXT_LENGTH,
  MAX_CUSTOM_ACTIVITIES,
  removeCustomActivity,
  savePersonalization,
  TIMER_PRESETS,
  updateCustomActivity,
} from '../data/personalization';

function Header({ onClose, isDark, toggleTheme }) {
  return (
    <div className="view-header toolkit-header">
      <button type="button" onClick={onClose} className="header-btn dashboard-back-btn">Back</button>
      <h3 className="logo-text">Your Pause Toolkit</h3>
      <button
        type="button"
        className="icon-btn"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        aria-pressed={isDark}
      >
        {isDark ? '☀' : '◐'}
      </button>
    </div>
  );
}

export default function PersonalizationView({ isEnabled, onClose, isDark, toggleTheme }) {
  const [personalization, setPersonalization] = useState(() => getPersonalization());
  const [newActivity, setNewActivity] = useState('');
  const [newActivityDuration, setNewActivityDuration] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState('Movement');
  const [error, setError] = useState('');
  const categories = getActivityCategories();
  const hiddenIds = new Set(personalization.hiddenActivityIds);
  const favoriteIds = new Set(personalization.favoriteActivityIds);
  const categoryActivities = getActivities().filter(activity => activity.category === selectedCategory);

  const persist = (nextPersonalization) => {
    setPersonalization(savePersonalization(nextPersonalization));
  };

  const addActivity = (event) => {
    event.preventDefault();
    const next = createCustomActivity({ text: newActivity, defaultDurationMinutes: newActivityDuration });
    if (!next) {
      setError(`Add a short activity, up to ${MAX_ACTIVITY_TEXT_LENGTH} characters. You can save up to ${MAX_CUSTOM_ACTIVITIES}.`);
      return;
    }

    setPersonalization(next);
    setNewActivity('');
    setNewActivityDuration(5);
    setError('');
  };

  const togglePreference = (activityId, preference) => {
    const currentIds = preference === 'hidden' ? personalization.hiddenActivityIds : personalization.favoriteActivityIds;
    const nextIds = currentIds.includes(activityId)
      ? currentIds.filter(id => id !== activityId)
      : [...currentIds, activityId];
    persist({
      ...personalization,
      [preference === 'hidden' ? 'hiddenActivityIds' : 'favoriteActivityIds']: nextIds,
    });
  };

  const setWeight = (activityId, weight) => {
    persist({
      ...personalization,
      activityWeights: { ...personalization.activityWeights, [activityId]: Number(weight) },
    });
  };

  if (!isEnabled) {
    return (
      <div className="view toolkit-view">
        <Header onClose={onClose} isDark={isDark} toggleTheme={toggleTheme} />
        <div className="toolkit-locked-card mm-card">
          <span className="toolkit-eyebrow">Optional personalization</span>
          <h1>Make each pause feel more like yours.</h1>
          <p>Create your own activity ideas, adjust pause lengths, and shape the suggestions you see. The core pause experience stays free.</p>
          <p className="toolkit-note">For local testing, enable the Personalization toolkit in Private Tools.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view toolkit-view">
      <Header onClose={onClose} isDark={isDark} toggleTheme={toggleTheme} />
      <div className="toolkit-scroll">
        <section className="toolkit-hero">
          <span className="toolkit-eyebrow">Personalization toolkit</span>
          <h1>Your pause, your way.</h1>
          <p>These controls are enabled locally for testing. They will become an optional purchase later.</p>
        </section>

        <section className="toolkit-section mm-card">
          <div className="toolkit-section-heading">
            <div><strong>Add a personal activity</strong><span>{personalization.customActivities.length}/{MAX_CUSTOM_ACTIVITIES} saved</span></div>
          </div>
          <form className="custom-activity-form" onSubmit={addActivity}>
            <label>
              Activity idea
              <input value={newActivity} maxLength={MAX_ACTIVITY_TEXT_LENGTH} onChange={(event) => setNewActivity(event.target.value)} placeholder="e.g. Put on my reset playlist" />
            </label>
            <label>
              Default pause length
              <select value={newActivityDuration} onChange={(event) => setNewActivityDuration(event.target.value)}>
                {TIMER_PRESETS.map(minutes => <option value={minutes} key={minutes}>{minutes} minutes</option>)}
              </select>
            </label>
            {error && <p className="toolkit-error" role="alert">{error}</p>}
            <button type="submit" className="mm-btn primary-solid">Save activity</button>
          </form>
          {personalization.customActivities.length > 0 && (
            <div className="custom-activity-list">
              {personalization.customActivities.map(activity => (
                <div className="custom-activity-row" key={activity.id}>
                  <div><strong>{activity.text}</strong><span>{activity.defaultDurationMinutes} minute default</span></div>
                  <label className="inline-select"><span className="sr-only">Default duration for {activity.text}</span><select value={activity.defaultDurationMinutes} onChange={(event) => setPersonalization(updateCustomActivity(activity.id, { defaultDurationMinutes: event.target.value }))}>{TIMER_PRESETS.map(minutes => <option value={minutes} key={minutes}>{minutes}m</option>)}</select></label>
                  <button type="button" className="toolkit-text-button" onClick={() => setPersonalization(removeCustomActivity(activity.id))}>Remove</button>
                  <div className="preference-actions custom-preference-actions">
                    <button type="button" className={favoriteIds.has(activity.id) ? 'active' : ''} onClick={() => togglePreference(activity.id, 'favorite')} aria-pressed={favoriteIds.has(activity.id)}>{favoriteIds.has(activity.id) ? 'Favorited' : 'Favorite'}</button>
                    <button type="button" className={hiddenIds.has(activity.id) ? 'active muted' : ''} onClick={() => togglePreference(activity.id, 'hidden')} aria-pressed={hiddenIds.has(activity.id)}>{hiddenIds.has(activity.id) ? 'Hidden' : 'Hide'}</button>
                    {favoriteIds.has(activity.id) && <label className="weight-select">Show it<select value={personalization.activityWeights[activity.id] || 3} onChange={(event) => setWeight(activity.id, event.target.value)}><option value="1">Less often</option><option value="3">Normally</option><option value="5">More often</option></select></label>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="toolkit-section mm-card">
          <div className="toolkit-section-heading"><div><strong>Shape your suggestions</strong><span>Favorite ideas appear more often. Hidden ideas are skipped.</span></div></div>
          <label className="activity-category-select">Browse a category<select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>{categories.map(category => <option value={category.category} key={category.category}>{category.label} ({category.count})</option>)}</select></label>
          <div className="preference-list">
            {categoryActivities.map(activity => {
              const activityId = getActivityId(activity);
              const isFavorite = favoriteIds.has(activityId);
              const isHidden = hiddenIds.has(activityId);
              return (
                <div className="preference-row" key={activityId}>
                  <strong>{activity.text}</strong>
                  <div className="preference-actions">
                    <button type="button" className={isFavorite ? 'active' : ''} onClick={() => togglePreference(activityId, 'favorite')} aria-pressed={isFavorite}>{isFavorite ? 'Favorited' : 'Favorite'}</button>
                    <button type="button" className={isHidden ? 'active muted' : ''} onClick={() => togglePreference(activityId, 'hidden')} aria-pressed={isHidden}>{isHidden ? 'Hidden' : 'Hide'}</button>
                  </div>
                  {isFavorite && <label className="weight-select">Show it<select value={personalization.activityWeights[activityId] || 3} onChange={(event) => setWeight(activityId, event.target.value)}><option value="1">Less often</option><option value="3">Normally</option><option value="5">More often</option></select></label>}
                </div>
              );
            })}
          </div>
          <div className="toolkit-summary"><span>{personalization.favoriteActivityIds.length} favorites</span><span>{personalization.hiddenActivityIds.length} hidden</span></div>
        </section>
      </div>
    </div>
  );
}
