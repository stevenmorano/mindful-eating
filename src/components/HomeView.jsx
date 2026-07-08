import React from 'react';

export default function HomeView({ onStart, onEmergency, onViewHistory, isDark, toggleTheme, isDevMode, toggleDevMode }) {
    return (
        <div className="view home-view">
            <div className="view-header">
                <h3 className="logo-text" style={{ textTransform: 'uppercase', fontWeight: '800', letterSpacing: '-0.5px', color: 'var(--mm-error, #ef4444)' }}>STOP! DON'T EAT!</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '10px', color: 'var(--mm-text-muted)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', marginRight: '8px' }}>
                        <input type="checkbox" checked={isDevMode} onChange={toggleDevMode} />
                        DEV MODE
                    </label>
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

            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <h1 style={{ marginBottom: '16px' }}>Experiencing a craving?</h1>
                <p style={{ marginBottom: '60px', maxWidth: '80%' }}>
                    Take a five minute pause before deciding to proceed.
                </p>

                <button type="button" className="main-action-btn" onClick={onStart} aria-label="Start a five minute craving pause">
                    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span style={{ fontSize: '20px', fontWeight: '700' }}>DON'T EAT</span>
                </button>

                <button
                    type="button"
                    onClick={onEmergency}
                    style={{ 
                        marginTop: '30px', 
                        background: 'transparent', 
                        border: '1px solid var(--mm-error, #ef4444)', 
                        color: 'var(--mm-error, #ef4444)', 
                        padding: '10px 20px', 
                        borderRadius: '24px',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    SOS / Intense Craving
                </button>
            </div>
        </div>
    );
}
