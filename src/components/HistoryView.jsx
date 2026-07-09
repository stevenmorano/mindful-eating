import React, { useState } from 'react';
import { categoryMeta } from '../data/activities';
import { getSessions } from '../data/sessions';
import { CATEGORY_TARGETS, getAchievementStats } from '../data/achievements';

function formatHour(hour) {
    if (hour === null) return '--';
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hr = hour % 12 || 12;
    return `${hr} ${ampm}`;
}

function formatDate(isoString) {
    try {
        const d = new Date(isoString);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' - ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } catch {
        return 'Unknown Date';
    }
}

function getClosestAchievements(achievements, limit = 3) {
    return [...achievements]
        .filter(achievement => !achievement.unlocked)
        .sort((a, b) => {
            const aPercent = a.current / a.target;
            const bPercent = b.current / b.target;
            return bPercent - aPercent || a.target - b.target;
        })
        .slice(0, limit);
}

function AchievementCard({ achievement, compact = false }) {
    const percent = Math.round((achievement.current / achievement.target) * 100);
    return (
        <div className={`achievement-card ${achievement.unlocked ? 'unlocked' : ''} ${compact ? 'compact' : ''}`}>
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-body">
                <div className="achievement-title-row">
                    <strong>{achievement.title}</strong>
                    <span>{achievement.current}/{achievement.target}</span>
                </div>
                <p>{achievement.description}</p>
                <div className="achievement-progress" aria-label={`${achievement.title} progress ${achievement.current} of ${achievement.target}`}>
                    <span style={{ width: `${Math.min(percent, 100)}%` }} />
                </div>
            </div>
        </div>
    );
}

function StatCard({ value, label, tone = 'default' }) {
    return (
        <div className={`dash-stat-card ${tone}`}>
            <div>{value}</div>
            <span>{label}</span>
        </div>
    );
}

function CategoryInsightCard({ completedCategories, categoryInsights, totalCategories }) {
    const varietyPercent = Math.round((completedCategories / totalCategories) * 100);

    return (
        <section className="dashboard-card category-insights-card">
            <div className="dashboard-card-header">
                <strong>Category Insights</strong>
                <span>{completedCategories}/{totalCategories} tried</span>
            </div>

            <div className="category-insight-hero">
                <div
                    className="category-variety-ring"
                    style={{ '--variety-progress': `${varietyPercent}%` }}
                    aria-label={`Category variety progress ${completedCategories} of ${totalCategories}`}
                >
                    <strong>{varietyPercent}%</strong>
                    <span>Variety</span>
                </div>
                <div>
                    <span className="dashboard-card-label">Strongest Pattern</span>
                    <strong className="dashboard-highlight-text">
                        {categoryInsights[0]?.label || 'Try a few categories'}
                    </strong>
                    <p>{categoryInsights[0] ? `${categoryInsights[0].passRate}% pass rate across ${categoryInsights[0].total} pauses.` : 'Your category trends will appear after a few completed pauses.'}</p>
                </div>
            </div>

            {categoryInsights.length > 0 && (
                <div className="category-insight-list">
                    {categoryInsights.slice(0, 3).map(category => (
                        <div className="category-insight-row" key={category.name}>
                            <div>
                                <strong>{category.label}</strong>
                                <span>{category.passed}/{category.total} cravings passed</span>
                            </div>
                            <div className="category-insight-meter" aria-label={`${category.label} pass rate ${category.passRate}%`}>
                                <span style={{ width: `${category.passRate}%` }} />
                            </div>
                            <small>{category.passRate}%</small>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default function HistoryView({ onClose, isDark, toggleTheme }) {
    const [sessions] = useState(() => getSessions() || []);
    const [showRawLog, setShowRawLog] = useState(false);
    const [screen, setScreen] = useState('dashboard');
    const [achievementFilter, setAchievementFilter] = useState('All');

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.completed);
    const passedSessions = sessions.filter(s => s.completed && s.stillHungry === false);
    const skippedEating = passedSessions.length;
    const { achievements, cravingStreak } = getAchievementStats(sessions);
    const moneySaved = skippedEating * 3;

    const hourCounts = {};
    sessions.forEach(s => {
        const hour = new Date(s.timestamp).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    let dangerHour = null;
    let maxCount = 0;
    Object.entries(hourCounts).forEach(([hour, count]) => {
        if (count > maxCount) {
            maxCount = count;
            dangerHour = parseInt(hour, 10);
        }
    });

    const activityStats = {};
    const categoryStats = {};
    sessions.forEach(s => {
        if (s.activityTitle) {
            activityStats[s.activityTitle] = activityStats[s.activityTitle] || { total: 0, passed: 0 };
            activityStats[s.activityTitle].total++;
            if (s.stillHungry === false) activityStats[s.activityTitle].passed++;
        }
        if (s.completed && s.activityCategory && s.activityCategory !== 'Emergency') {
            categoryStats[s.activityCategory] = categoryStats[s.activityCategory] || { total: 0, passed: 0 };
            categoryStats[s.activityCategory].total++;
            if (s.stillHungry === false) categoryStats[s.activityCategory].passed++;
        }
    });

    let bestActivity = '--';
    let bestRate = -1;
    Object.entries(activityStats).forEach(([title, stats]) => {
        const rate = stats.passed / stats.total;
        if (stats.total >= 1 && rate > bestRate) {
            bestRate = rate;
            bestActivity = title;
        }
    });

    let bestCategory = '--';
    let bestCategoryRate = -1;
    Object.entries(categoryStats).forEach(([category, stats]) => {
        const rate = stats.passed / stats.total;
        if (stats.total >= 1 && rate > bestCategoryRate) {
            bestCategoryRate = rate;
            bestCategory = categoryMeta[category]?.label || category;
        }
    });

    const categoryInsights = Object.entries(categoryStats)
        .map(([category, stats]) => ({
            name: category,
            label: categoryMeta[category]?.label || category,
            total: stats.total,
            passed: stats.passed,
            passRate: Math.round((stats.passed / stats.total) * 100),
        }))
        .sort((a, b) => b.passRate - a.passRate || b.total - a.total || a.label.localeCompare(b.label));
    const completedCategories = categoryInsights.length;

    const last28Days = Array.from({ length: 28 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (27 - i));
        return d;
    });

    const getDayColor = (date) => {
        const daySessions = sessions.filter(s => {
            const d = new Date(s.timestamp);
            return d.toLocaleDateString() === date.toLocaleDateString();
        });

        if (daySessions.length === 0) return 'var(--mm-border)';

        const passed = daySessions.filter(s => s.completed && s.stillHungry === false).length;
        if (passed > 0) {
            if (passed === 1) return 'rgba(16, 185, 129, 0.4)';
            if (passed === 2) return 'rgba(16, 185, 129, 0.7)';
            return '#10B981';
        }

        const snacked = daySessions.filter(s => s.completed && s.stillHungry === true).length;
        if (snacked > 0) return '#F59E0B';

        return 'var(--mm-error, #ef4444)';
    };

    const unlockedAchievements = achievements.filter(achievement => achievement.unlocked);
    const nextAchievements = getClosestAchievements(achievements);
    const achievementGroups = ['All', ...new Set(achievements.map(achievement => achievement.group))];
    const visibleAchievements = achievementFilter === 'All'
        ? achievements
        : achievements.filter(achievement => achievement.group === achievementFilter);
    const sortedSessions = [...sessions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const renderHeader = (title, onBack = onClose) => (
        <div className="view-header dashboard-header">
            <button type="button" onClick={onBack} className="header-btn dashboard-back-btn">
                <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                Back
            </button>
            <h3 className="logo-text">{title}</h3>
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
        </div>
    );

    if (screen === 'achievements') {
        return (
            <div className="view history-view">
                {renderHeader('Achievements', () => setScreen('dashboard'))}
                <div className="dashboard-scroll">
                    <section className="achievement-summary-card">
                        <span>Collection</span>
                        <strong>{unlockedAchievements.length}/{achievements.length}</strong>
                        <p>Unlocked achievements</p>
                    </section>

                    <div className="achievement-filter-row" aria-label="Achievement filters">
                        {achievementGroups.map(group => (
                            <button
                                type="button"
                                key={group}
                                className={achievementFilter === group ? 'active' : ''}
                                onClick={() => setAchievementFilter(group)}
                                aria-pressed={achievementFilter === group}
                            >
                                {group}
                            </button>
                        ))}
                    </div>

                    <div className="achievement-list">
                        {visibleAchievements.map(achievement => (
                            <AchievementCard key={achievement.id} achievement={achievement} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="view history-view">
            {renderHeader('Dashboard')}

            <div className="dashboard-scroll">
                {totalSessions === 0 ? (
                    <div className="empty-dashboard">
                        <p>Your dashboard will populate here once you complete your first pause.</p>
                        <button type="button" className="mm-btn primary-solid" onClick={onClose}>Return Home</button>
                    </div>
                ) : (
                    <>
                        <section className="streak-hero-card">
                            <div>
                                <span>Day Streak</span>
                                <strong>{cravingStreak}</strong>
                            </div>
                            <div className="streak-goal">
                                <span>{Math.min(cravingStreak, 7)}/7</span>
                                <small>7-day goal</small>
                            </div>
                        </section>

                        <section className="dashboard-grid">
                            <StatCard value={`$${moneySaved}`} label="Estimated Savings" tone="success" />
                            <StatCard value={formatHour(dangerHour)} label="Danger Hour" tone="danger" />
                            <StatCard value={skippedEating} label="Urges Defeated" />
                            <StatCard value={completedSessions.length} label="Completed Pauses" />
                        </section>

                        <section className="dashboard-card">
                            <span className="dashboard-card-label">Top Distraction</span>
                            <strong className="dashboard-highlight-text">{bestActivity}</strong>
                        </section>

                        <section className="dashboard-card">
                            <span className="dashboard-card-label">Best Category</span>
                            <strong className="dashboard-highlight-text">{bestCategory}</strong>
                        </section>

                        <CategoryInsightCard
                            completedCategories={completedCategories}
                            categoryInsights={categoryInsights}
                            totalCategories={CATEGORY_TARGETS.length}
                        />

                        <section className="dashboard-card">
                            <div className="dashboard-card-header">
                                <strong>Craving Heatmap</strong>
                                <span>Last 28 Days</span>
                            </div>
                            <div className="heatmap-grid">
                                {last28Days.map((d, i) => {
                                    const color = getDayColor(d);
                                    const isEmpty = color === 'var(--mm-border)';
                                    return (
                                        <div
                                            key={i}
                                            style={{ backgroundColor: isEmpty ? 'transparent' : color }}
                                            className={isEmpty ? 'empty' : ''}
                                            title={d.toLocaleDateString()}
                                            aria-label={`${d.toLocaleDateString()}: ${isEmpty ? 'No craving logged' : 'Craving activity logged'}`}
                                        />
                                    );
                                })}
                            </div>
                            <div className="heatmap-legend">
                                <span><i className="pass" /> Pass</span>
                                <span><i className="snack" /> Snack</span>
                                <span>Today -&gt;</span>
                            </div>
                        </section>

                        <section className="dashboard-card next-achievements-card">
                            <div className="dashboard-card-header">
                                <strong>Next Achievements</strong>
                                <button type="button" onClick={() => setScreen('achievements')}>View All</button>
                            </div>
                            <div className="achievement-list compact-list">
                                {nextAchievements.length > 0 ? (
                                    nextAchievements.map(achievement => (
                                        <AchievementCard key={achievement.id} achievement={achievement} compact />
                                    ))
                                ) : (
                                    <p className="all-achievements-unlocked">Every achievement is unlocked. That is a serious run.</p>
                                )}
                            </div>
                        </section>

                        <div className="raw-log-section">
                            <button
                                type="button"
                                onClick={() => setShowRawLog(!showRawLog)}
                                aria-expanded={showRawLog}
                                aria-controls="raw-session-log"
                            >
                                View Raw Log
                                <span style={{ transform: showRawLog ? 'rotate(180deg)' : 'none' }}>v</span>
                            </button>

                            {showRawLog && (
                                <div id="raw-session-log" className="raw-log-list">
                                    {sortedSessions.map(session => (
                                        <div key={session.id}>
                                            <div>
                                                <strong>{session.activityTitle || 'Mindful Pause'}</strong>
                                                <span>{formatDate(session.timestamp)}</span>
                                            </div>
                                            {!session.completed ? (
                                                <small className="danger">Cancelled</small>
                                            ) : (
                                                <small className={session.stillHungry === false ? 'success' : ''}>
                                                    {session.stillHungry === false ? 'Craving passed' :
                                                        session.stillHungry === true ? 'Ate mindfully' :
                                                            'Unresolved'}
                                                </small>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
