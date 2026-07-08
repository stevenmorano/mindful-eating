import React from 'react';

const iconPaths = {
    surprise: (
        <>
            <path d="M16 3h5v5" />
            <path d="M4 20 21 3" />
            <path d="M21 16v5h-5" />
            <path d="M15 15l6 6" />
            <path d="M4 4l5 5" />
        </>
    ),
    movement: (
        <>
            <path d="M13 3 4 14h7l-1 7 9-11h-7l1-7z" />
        </>
    ),
    mind: (
        <>
            <path d="M9 3a4 4 0 0 0-4 4v1.2A5 5 0 0 0 6 18h3" />
            <path d="M15 3a4 4 0 0 1 4 4v1.2A5 5 0 0 1 18 18h-3" />
            <path d="M9 12h6" />
            <path d="M12 9v6" />
        </>
    ),
    productive: (
        <>
            <path d="M8 7h10" />
            <path d="M8 12h10" />
            <path d="M8 17h10" />
            <path d="m3 7 1 1 2-2" />
            <path d="m3 12 1 1 2-2" />
            <path d="m3 17 1 1 2-2" />
        </>
    ),
    mindfulness: (
        <>
            <path d="M12 3a7 7 0 0 0 7 7 7 7 0 1 1-7-7z" />
        </>
    ),
    creative: (
        <>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
        </>
    ),
    social: (
        <>
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </>
    ),
    growth: (
        <>
            <path d="M3 17 9 11l4 4 8-8" />
            <path d="M14 7h7v7" />
        </>
    ),
    care: (
        <>
            <path d="M12 21s-7-4.4-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.6-7 11-7 11z" />
        </>
    ),
    environment: (
        <>
            <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 12-9h4v4c0 8-4 12-9 12z" />
            <path d="M4 20c4-5 8-7 14-10" />
        </>
    ),
    custom: (
        <>
            <path d="M12 3v18" />
            <path d="M3 12h18" />
            <path d="m5 5 14 14" />
            <path d="m19 5-14 14" />
        </>
    ),
};

function CategoryIcon({ name }) {
    return (
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {iconPaths[name] || iconPaths.custom}
        </svg>
    );
}

export default function HomeView({ onStart, onEmergency, onViewHistory, categories, isDark, toggleTheme, isDevMode, toggleDevMode }) {
    return (
        <div className="view home-view">
            <div className="view-header home-header">
                <h3 className="logo-text brand-mark">STOP! DON'T EAT!</h3>
                <div className="home-header-actions">
                    <label className="dev-toggle">
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

            <div className="home-content">
                <section className="home-hero" aria-labelledby="home-title">
                    <p className="home-kicker">Five minute pause</p>
                    <h1 id="home-title">Experiencing a craving?</h1>
                    <p>Choose a pause that fits this moment, or let the app surprise you.</p>
                </section>

                <section className="pause-picker" aria-labelledby="pause-picker-title">
                    <div className="section-heading">
                        <h2 id="pause-picker-title">Choose your pause</h2>
                        <span>5 min</span>
                    </div>

                    <div className="category-grid">
                        <button type="button" className="category-tile surprise-tile" onClick={() => onStart(null)}>
                            <span className="category-icon">
                                <CategoryIcon name="surprise" />
                            </span>
                            <span>
                                <strong>Surprise Me</strong>
                                <small>All categories</small>
                            </span>
                        </button>

                        {categories.map((item) => (
                            <button
                                type="button"
                                className="category-tile"
                                key={item.category}
                                onClick={() => onStart(item.category)}
                                aria-label={`Start a ${item.category} pause`}
                            >
                                <span className="category-icon">
                                    <CategoryIcon name={item.icon} />
                                </span>
                                <span>
                                    <strong>{item.label}</strong>
                                    <small>{item.count} ideas</small>
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                <button type="button" className="emergency-btn" onClick={onEmergency}>
                    <span className="category-icon">
                        <CategoryIcon name="mindfulness" />
                    </span>
                    <span>
                        <strong>Emergency Breathing</strong>
                        <small>Guided box breathing for intense cravings</small>
                    </span>
                </button>
            </div>
        </div>
    );
}
