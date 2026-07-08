import React from 'react';

export default function ActivityView({ activity, categoryMeta, isSurprise, onStartTimer, onNewActivity, onCancel, isDark, toggleTheme }) {
    if (!activity) return null;

    return (
        <div className="view activity-view">
            <div className="view-header">
                <h3 className="logo-text" style={{ textTransform: 'uppercase', fontWeight: '800', letterSpacing: '-0.5px', color: 'var(--mm-error, #ef4444)' }}>STOP! DON'T EAT!</h3>
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

            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px', fontWeight: '600' }}>
                    Suggested Activity
                </p>
                <span className="activity-category-pill">
                    {isSurprise ? 'Surprise Me' : categoryMeta?.label || activity.category}
                </span>

                <div className="mm-card" style={{ width: '100%', marginTop: '24px', marginBottom: '40px', minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '24px', lineHeight: '1.4', fontWeight: '500' }}>{activity.text}</h2>
                </div>

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button type="button" className="mm-btn primary-solid" onClick={onStartTimer}>
                        Begin 5-Minute Timer
                    </button>
                    <button type="button" className="mm-btn secondary" onClick={onNewActivity}>
                        {isSurprise ? 'Generate another idea' : `Another ${categoryMeta?.label || activity.category} idea`}
                    </button>
                </div>
            </div>
        </div>
    );
}
