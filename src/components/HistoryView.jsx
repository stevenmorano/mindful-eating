import React, { useState } from 'react';
import { categoryMeta } from '../data/activities';
import { getSessions } from '../data/sessions';

const CATEGORY_TARGETS = [
    ['Movement', 'Move Your Mood', 'Body Reset'],
    ['Mind Engagement', 'Mind Game', 'Brain Saver'],
    ['Productive', 'Tiny Tidy', 'Clean Slate'],
    ['Mindfulness', 'Calm Choice', 'Grounded'],
    ['Creative', 'Creative Detour', 'Maker Mode'],
    ['Social', 'Reach Out', 'Connection Wins'],
    ['Self-Improvement', 'Level Up', 'Better Me Builder'],
    ['Personal Care', 'Care Check', 'Self-Care Streak'],
    ['Environment', 'Room Shift', 'Environment Architect'],
];

const clampProgress = (value, target) => Math.min(value, target);

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

function getStreak(completedSessions) {
    if (completedSessions.length === 0) return 0;
    const sortedCompleted = [...completedSessions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let currentDateToCheck = new Date(today);

    const mostRecentDate = new Date(sortedCompleted[0].timestamp);
    mostRecentDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today - mostRecentDate) / (1000 * 60 * 60 * 24));
    if (diffDays > 1) return 0;
    if (diffDays === 1) currentDateToCheck.setDate(today.getDate() - 1);

    const uniqueDates = [...new Set(sortedCompleted.map(s => {
        const d = new Date(s.timestamp);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
    }))];

    let currentExpectedDate = currentDateToCheck.getTime();
    for (let timestamp of uniqueDates) {
        if (timestamp === currentExpectedDate) {
            streak++;
            currentExpectedDate -= (1000 * 60 * 60 * 24);
        } else if (timestamp < currentExpectedDate) {
            break;
        }
    }
    return streak;
}

function buildAchievement(id, group, title, description, current, target, icon) {
    const progress = clampProgress(current, target);
    return {
        id,
        group,
        title,
        description,
        current: progress,
        target,
        icon,
        unlocked: progress >= target,
    };
}

function getAchievementStats(sessions, completedSessions, passedSessions, cravingStreak) {
    const categoryCounts = {};
    const passedCategoryCounts = {};
    completedSessions.forEach((session) => {
        const category = session.activityCategory;
        if (!category || category === 'Emergency') return;
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        if (session.stillHungry === false) {
            passedCategoryCounts[category] = (passedCategoryCounts[category] || 0) + 1;
        }
    });

    const completedCategories = Object.keys(categoryCounts).length;
    const categoriesWithThree = CATEGORY_TARGETS.filter(([category]) => (categoryCounts[category] || 0) >= 3).length;
    const categoriesWithTen = CATEGORY_TARGETS.filter(([category]) => (categoryCounts[category] || 0) >= 10).length;
    const secondPauseWins = completedSessions.filter(session => session.pauseRound >= 2 && session.stillHungry === false).length;
    const emergencySessions = sessions.filter(session => session.activityCategory === 'Emergency' || session.activityTitle === 'Emergency Breathing');
    const emergencyWins = emergencySessions.filter(session => session.completed && session.stillHungry === false).length;
    const snackSessions = completedSessions.filter(session => session.stillHungry === true).length;
    const randomSessions = completedSessions.filter(session => !session.activityCategory).length;
    const lateNightPassed = passedSessions.filter(session => {
        const hour = new Date(session.timestamp).getHours();
        return hour >= 21 || hour < 3;
    }).length;
    const morningPauses = completedSessions.filter(session => new Date(session.timestamp).getHours() < 10).length;
    const afternoonPauses = completedSessions.filter(session => {
        const hour = new Date(session.timestamp).getHours();
        return hour >= 12 && hour < 17;
    }).length;
    const weekendPauses = completedSessions.filter(session => {
        const day = new Date(session.timestamp).getDay();
        return day === 0 || day === 6;
    }).length;

    const achievements = [
        buildAchievement('first_pause', 'Core', 'First Pause', 'Complete your first pause.', completedSessions.length, 1, '1'),
        buildAchievement('three_pauses', 'Core', 'Three Pauses', 'Complete 3 total pauses.', completedSessions.length, 3, '3'),
        buildAchievement('ten_pauses', 'Core', 'Ten Pauses', 'Complete 10 total pauses.', completedSessions.length, 10, '10'),
        buildAchievement('fifty_pauses', 'Core', 'Distraction Master', 'Complete 50 total pauses.', completedSessions.length, 50, '50'),
        buildAchievement('century_pause', 'Core', 'Century Pause', 'Complete 100 total pauses.', completedSessions.length, 100, '100'),
        buildAchievement('iron_will', 'Streaks', 'Iron Will', 'Hit a 7-day craving streak.', cravingStreak, 7, '7'),
        buildAchievement('steady_flame', 'Streaks', 'Steady Flame', 'Hit a 14-day craving streak.', cravingStreak, 14, '14'),
        buildAchievement('momentum_builder', 'Streaks', 'Momentum Builder', 'Hit a 30-day craving streak.', cravingStreak, 30, '30'),
        buildAchievement('urge_defeated', 'Cravings', 'Urge Defeated', 'Pass one craving.', passedSessions.length, 1, 'P'),
        buildAchievement('five_wins', 'Cravings', 'Five Wins', 'Pass 5 cravings.', passedSessions.length, 5, '5'),
        buildAchievement('twenty_wins', 'Cravings', 'Twenty Wins', 'Pass 20 cravings.', passedSessions.length, 20, '20'),
        buildAchievement('craving_veteran', 'Cravings', 'Craving Veteran', 'Pass 50 cravings.', passedSessions.length, 50, '50'),
        buildAchievement('second_thought', 'Cravings', 'Second Thought', 'Complete the second-pause rule.', completedSessions.filter(session => session.pauseRound >= 2).length, 1, '2'),
        buildAchievement('double_pause_win', 'Cravings', 'Double Pause Win', 'Finish a second pause and skip the snack.', secondPauseWins, 1, '2X'),
        buildAchievement('sampler', 'Variety', 'Sampler', 'Complete pauses in 3 different categories.', completedCategories, 3, '3C'),
        buildAchievement('well_rounded', 'Variety', 'Well-Rounded', 'Complete one pause in every category.', completedCategories, CATEGORY_TARGETS.length, 'ALL'),
        buildAchievement('category_explorer', 'Variety', 'Category Explorer', 'Complete 3 pauses in every category.', categoriesWithThree, CATEGORY_TARGETS.length, 'EX'),
        buildAchievement('full_toolkit', 'Variety', 'Full Toolkit', 'Complete 10 pauses in every category.', categoriesWithTen, CATEGORY_TARGETS.length, 'KIT'),
        buildAchievement('surprise_me', 'Variety', 'Surprise Me', 'Complete 5 random Any pauses.', randomSessions, 5, '?'),
        buildAchievement('open_mind', 'Variety', 'Open Mind', 'Complete 20 random Any pauses.', randomSessions, 20, '20'),
        buildAchievement('morning_reset', 'Timing', 'Morning Reset', 'Complete 5 pauses before 10 AM.', morningPauses, 5, 'AM'),
        buildAchievement('afternoon_save', 'Timing', 'Afternoon Save', 'Complete 5 pauses between noon and 5 PM.', afternoonPauses, 5, 'PM'),
        buildAchievement('night_guardian', 'Timing', 'Night Guardian', 'Pass 5 cravings after 9 PM.', lateNightPassed, 5, '9P'),
        buildAchievement('weekend_warrior', 'Timing', 'Weekend Warrior', 'Complete 5 pauses on weekends.', weekendPauses, 5, 'WE'),
        buildAchievement('emergency_reset', 'Emergency', 'Emergency Reset', 'Use Emergency Breathing once.', emergencySessions.length, 1, 'SOS'),
        buildAchievement('breathe_through_it', 'Emergency', 'Breathe Through It', 'Use Emergency Breathing 5 times.', emergencySessions.length, 5, '5'),
        buildAchievement('still_here', 'Emergency', 'Still Here', 'Complete Emergency Breathing and skip eating.', emergencyWins, 1, 'BR'),
        buildAchievement('no_shame_snack', 'Snacks', 'No Shame Snack', 'Unlock a mindful snack after two pauses.', snackSessions, 1, 'SN'),
        buildAchievement('snack_with_intention', 'Snacks', 'Snack With Intention', 'Choose 5 mindful snacks.', snackSessions, 5, '5'),
        buildAchievement('nourished_not_numb', 'Snacks', 'Nourished Not Numb', 'Choose 20 mindful snacks.', snackSessions, 20, '20'),
        buildAchievement('first_savings', 'Savings', 'First $3 Saved', 'Pass one craving.', passedSessions.length * 3, 3, '$3'),
        buildAchievement('snack_budget_saver', 'Savings', 'Snack Budget Saver', 'Save an estimated $15.', passedSessions.length * 3, 15, '$15'),
        buildAchievement('wallet_wins', 'Savings', 'Wallet Wins', 'Save an estimated $50.', passedSessions.length * 3, 50, '$50'),
        buildAchievement('big_saver', 'Savings', 'Big Saver', 'Save an estimated $100.', passedSessions.length * 3, 100, '$100'),
    ];

    CATEGORY_TARGETS.forEach(([category, firstTitle, secondTitle]) => {
        const label = categoryMeta[category]?.label || category;
        const count = categoryCounts[category] || 0;
        const passedCount = passedCategoryCounts[category] || 0;
        achievements.push(buildAchievement(`${category}_5`, 'Categories', firstTitle, `Complete 5 ${label} pauses.`, count, 5, label.slice(0, 2).toUpperCase()));
        achievements.push(buildAchievement(`${category}_20`, 'Categories', secondTitle, `Complete 20 ${label} pauses.`, count, 20, '20'));
        achievements.push(buildAchievement(`${category}_passed_5`, 'Category Wins', `${label} Wins`, `Pass 5 cravings after ${label} pauses.`, passedCount, 5, 'W'));
    });

    return achievements;
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

export default function HistoryView({ onClose, isDark, toggleTheme }) {
    const [sessions] = useState(() => getSessions() || []);
    const [showRawLog, setShowRawLog] = useState(false);
    const [screen, setScreen] = useState('dashboard');
    const [achievementFilter, setAchievementFilter] = useState('All');

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.completed);
    const passedSessions = sessions.filter(s => s.completed && s.stillHungry === false);
    const skippedEating = passedSessions.length;
    const cravingStreak = getStreak(completedSessions);
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
        if (s.activityCategory && s.activityCategory !== 'Emergency') {
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

    const achievements = getAchievementStats(sessions, completedSessions, passedSessions, cravingStreak);
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
