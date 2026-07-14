import React, { useState } from 'react';

export default function ActivityView({
    activity,
    categories,
    categoryMeta,
    selectedCategory,
    onSelectCategory,
    onStartTimer,
    onNewActivity,
    onCancel,
    durationMinutes,
    onDurationChange,
    canCustomizeTimer,
    selectionNotice,
    isDevMode,
    isDark,
    toggleTheme
}) {
    const [isTimerOptionsOpen, setIsTimerOptionsOpen] = useState(false);
    if (!activity) return null;

    const activeLabel = selectedCategory ? categoryMeta?.label || activity.category : 'Any';

    return (
        <div className="view activity-view">
            <div className="view-header">
                <h3 className="logo-text brand-mark">STOP! DON'T EAT!</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                        type="button"
                        className="icon-btn"
                        onClick={toggleTheme}
                        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                        aria-pressed={isDark}
                    >
                        {isDark ? (
                            <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                        ) : (
                            <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
                        )}
                    </button>
                    <button type="button" onClick={onCancel} className="header-btn" style={{ fontSize: '20px' }} aria-label="Cancel activity selection">
                        X
                    </button>
                </div>
            </div>

            <div className="activity-content">
                <p className="activity-kicker">Suggested Activity</p>
                <span className="activity-category-pill">{activeLabel}</span>

                <div className="mm-card activity-card">
                    <h2>{activity.text}</h2>
                </div>

                {selectionNotice && <p className="activity-selection-notice" role="status">{selectionNotice}</p>}

                {canCustomizeTimer && (
                    <div className="timer-choice-panel" aria-label="Pause length">
                        <button type="button" className="timer-length-summary" onClick={() => setIsTimerOptionsOpen(open => !open)} aria-expanded={isTimerOptionsOpen}>
                            <span>Pause length</span>
                            <strong>{durationMinutes} {durationMinutes === 1 ? 'minute' : 'minutes'}</strong>
                            <em>{isTimerOptionsOpen ? 'Done' : 'Adjust'}</em>
                        </button>
                        {isTimerOptionsOpen && <div className="timer-length-options">
                            <div className="timer-preset-row">
                                {[2, 5, 10, 15, 20].map(minutes => (
                                    <button type="button" key={minutes} className={durationMinutes === minutes ? 'active' : ''} onClick={() => onDurationChange(minutes)} aria-pressed={durationMinutes === minutes}>{minutes} min</button>
                                ))}
                            </div>
                            <label className="timer-custom-input">
                                Custom minutes
                                <input type="number" min="1" max="60" value={durationMinutes} onChange={(event) => onDurationChange(event.target.value)} aria-label="Custom pause length in minutes" />
                            </label>
                        </div>}
                    </div>
                )}

                <div className="activity-actions">
                    <button type="button" className="mm-btn primary-solid" onClick={onStartTimer}>
                        {isDevMode ? 'Begin 5-Second Test Timer' : `Begin ${durationMinutes}-Minute Timer`}
                    </button>
                    <button type="button" className="mm-btn secondary" onClick={onNewActivity}>
                        Generate another idea
                    </button>
                </div>

                <div className="category-chip-panel" aria-label="Activity category filter">
                    <button
                        type="button"
                        className={`category-chip ${!selectedCategory ? 'active' : ''}`}
                        onClick={() => onSelectCategory(null)}
                        aria-pressed={!selectedCategory}
                    >
                        Any
                    </button>
                    {categories.map((item) => (
                        <button
                            type="button"
                            className={`category-chip ${selectedCategory === item.category ? 'active' : ''}`}
                            key={item.category}
                            onClick={() => onSelectCategory(item.category)}
                            aria-pressed={selectedCategory === item.category}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
