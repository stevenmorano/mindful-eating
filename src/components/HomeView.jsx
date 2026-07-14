import React from 'react';

export default function HomeView({ onStart, onEmergency, onViewHistory, onOpenPersonalization, onOpenDevTools, isDevToolsUnlocked, isDark, toggleTheme }) {
    return (
        <div className="view home-view">
            <div className="view-header">
                <h3 className="logo-text brand-mark">STOP! DON'T EAT!</h3>
                <div className="home-header-actions">
                    <button
                        type="button"
                        className={`icon-btn private-tools-btn ${isDevToolsUnlocked ? 'unlocked' : ''}`}
                        onClick={onOpenDevTools}
                        aria-label={isDevToolsUnlocked ? 'Open private tools' : 'Unlock private tools'}
                        title={isDevToolsUnlocked ? 'Private tools' : 'Unlock private tools'}
                    >
                        {isDevToolsUnlocked ? (
                            <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 11V8a5 5 0 10-10 0v3"/><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M12 15v2"/></svg>
                        ) : (
                            <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V8a5 5 0 0110 0v3"/></svg>
                        )}
                    </button>
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
                    <button type="button" className="header-btn" onClick={onViewHistory}>
                        History
                    </button>
                </div>
            </div>

            <div className="home-main">
                <h1>Experiencing a craving?</h1>
                <p>
                    Take a five minute pause before deciding to proceed.
                </p>

                <button type="button" className="main-action-btn" onClick={() => onStart(null)} aria-label="Start a random five minute craving pause">
                    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>DON'T EAT</span>
                </button>

                <button type="button" className="emergency-pill-btn" onClick={onEmergency}>
                    Emergency Breathing
                </button>
                <button type="button" className="personalization-link" onClick={onOpenPersonalization}>
                    Make this pause yours
                </button>
            </div>
        </div>
    );
}
