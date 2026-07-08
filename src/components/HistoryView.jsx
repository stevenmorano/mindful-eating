import React, { useState } from 'react';
import { getSessions } from '../data/sessions';

export default function HistoryView({ onClose, isDark, toggleTheme }) {
    const [sessions] = useState(() => getSessions() || []);
    const [showRawLog, setShowRawLog] = useState(false);

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.completed);
    const skippedEating = sessions.filter(s => s.stillHungry === false).length;
    
    // Streak
    const getStreak = () => {
        if (completedSessions.length === 0) return 0;
        const sortedCompleted = [...completedSessions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const today = new Date();
        today.setHours(0,0,0,0);
        let streak = 0;
        let currentDateToCheck = new Date(today);
        
        const mostRecentDate = new Date(sortedCompleted[0].timestamp);
        mostRecentDate.setHours(0,0,0,0);
        
        const diffDays = Math.floor((today - mostRecentDate) / (1000 * 60 * 60 * 24));
        if (diffDays > 1) return 0;
        if (diffDays === 1) currentDateToCheck.setDate(today.getDate() - 1);
        
        const uniqueDates = [...new Set(sortedCompleted.map(s => {
            const d = new Date(s.timestamp);
            d.setHours(0,0,0,0);
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
    };

    const cravingStreak = getStreak();
    
    // New Metrics
    const moneySaved = skippedEating * 3; // $3 average per snack
    
    // Danger Zone
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

    const formatHour = (h) => {
        if (h === null) return '--';
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hr = h % 12 || 12;
        return `${hr} ${ampm}`;
    };

    // Best Distraction
    const activityStats = {};
    sessions.forEach(s => {
        if (!s.activityTitle) return;
        if (!activityStats[s.activityTitle]) {
            activityStats[s.activityTitle] = { total: 0, passed: 0 };
        }
        activityStats[s.activityTitle].total++;
        if (s.stillHungry === false) {
            activityStats[s.activityTitle].passed++;
        }
    });

    let bestActivity = '--';
    let bestRate = -1;
    Object.entries(activityStats).forEach(([title, stats]) => {
        if (stats.total >= 1) { 
            const rate = stats.passed / stats.total;
            if (rate > bestRate) {
                bestRate = rate;
                bestActivity = title;
            }
        }
    });

    // Heatmap Logic (Last 28 Days)
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
            return '#10B981'; // Dark green
        }

        const snacked = daySessions.filter(s => s.completed && s.stillHungry === true).length;
        if (snacked > 0) return '#F59E0B'; // Orange

        return 'var(--mm-error, #ef4444)'; // Red (cancelled)
    };

    // Trophy Logic
    const trophies = [
        {
            id: 'iron_will',
            title: 'Iron Will',
            description: 'Hit a 7-day craving streak.',
            icon: '7',
            unlocked: cravingStreak >= 7
        },
        {
            id: 'master_distraction',
            title: 'Distraction Master',
            description: 'Completed 50 total pauses.',
            icon: '50',
            unlocked: totalSessions >= 50
        },
        {
            id: 'late_night',
            title: 'Night Guardian',
            description: 'Passed 5 cravings after 9 PM.',
            icon: '9P',
            unlocked: sessions.filter(s => {
                const hour = new Date(s.timestamp).getHours();
                return (hour >= 21 || hour < 3) && s.completed && s.stillHungry === false;
            }).length >= 5
        },
        {
            id: 'sos_survivor',
            title: 'SOS Survivor',
            description: 'Defeated urge using Emergency.',
            icon: 'SOS',
            unlocked: sessions.filter(s => s.activityTitle === "Emergency Breathing" && s.completed && s.stillHungry === false).length >= 1
        }
    ];

    const sortedSessions = [...sessions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const formatDate = (isoString) => {
        try {
            const d = new Date(isoString);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' - ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        } catch {
            return 'Unknown Date';
        }
    };

    return (
        <div className="view history-view" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="view-header" style={{ marginBottom: '24px' }}>
                <button type="button" onClick={onClose} className="header-btn" style={{ padding: '0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                    Back
                </button>
                <h3 className="logo-text">Dashboard</h3>
                <div style={{ display: 'flex', alignItems: 'center' }}>
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
            </div>

            <div style={{ flexGrow: 1, overflowY: 'auto', paddingBottom: 0, WebkitOverflowScrolling: 'touch' }}>
                {totalSessions === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80%', textAlign: 'center' }}>
                        <p style={{ marginBottom: '32px', fontSize: '16px', maxWidth: '80%' }}>Your dashboard will populate here once you complete your first pause.</p>
                        <button type="button" className="mm-btn primary-solid" onClick={onClose}>Return Home</button>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                            {/* Hero Card: Streak */}
                            <div style={{ gridColumn: 'span 2', background: 'var(--mm-accent-primary)', color: 'white', padding: '24px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 8px 24px rgba(44, 122, 123, 0.2)' }}>
                                <div>
                                    <div style={{ fontSize: '14px', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Day Streak</div>
                                    <div style={{ fontSize: '42px', fontWeight: '800', lineHeight: '1' }}>{cravingStreak}</div>
                                </div>
                                <div style={{ fontSize: '48px' }}>7</div>
                            </div>

                            {/* Money Saved */}
                            <div style={{ background: 'var(--mm-bg-surface)', border: '1px solid var(--mm-border)', padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ fontSize: '28px', fontWeight: '700', color: '#10B981', lineHeight: '1', marginBottom: '4px' }}>${moneySaved}</div>
                                <div style={{ fontSize: '12px', color: 'var(--mm-text-muted)' }}>Estimated Savings</div>
                            </div>

                            {/* Danger Zone */}
                            <div style={{ background: 'var(--mm-bg-surface)', border: '1px solid var(--mm-border)', padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--mm-error, #ef4444)', lineHeight: '1', marginBottom: '4px' }}>{formatHour(dangerHour)}</div>
                                <div style={{ fontSize: '12px', color: 'var(--mm-text-muted)' }}>Danger Hour</div>
                            </div>

                            {/* Cravings Passed */}
                            <div style={{ background: 'var(--mm-bg-surface)', border: '1px solid var(--mm-border)', padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--mm-text-dark)', lineHeight: '1', marginBottom: '4px' }}>{skippedEating}</div>
                                <div style={{ fontSize: '12px', color: 'var(--mm-text-muted)' }}>Urges Defeated</div>
                            </div>

                            {/* Total Pauses */}
                            <div style={{ background: 'var(--mm-bg-surface)', border: '1px solid var(--mm-border)', padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--mm-text-dark)', lineHeight: '1', marginBottom: '4px' }}>{totalSessions}</div>
                                <div style={{ fontSize: '12px', color: 'var(--mm-text-muted)' }}>Total Pauses</div>
                            </div>

                            {/* Best Distraction */}
                            <div style={{ gridColumn: 'span 2', background: 'var(--mm-bg-surface)', border: '1px solid var(--mm-border)', padding: '20px', borderRadius: '20px' }}>
                                <div style={{ fontSize: '12px', color: 'var(--mm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Top Distraction</div>
                                <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--mm-accent-primary)' }}>{bestActivity}</div>
                            </div>
                            {/* Heatmap */}
                            <div style={{ gridColumn: 'span 2', background: 'var(--mm-bg-surface)', border: '1px solid var(--mm-border)', padding: '20px', borderRadius: '20px' }}>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--mm-text-dark)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Craving Heatmap</span>
                                    <span style={{ fontSize: '12px', fontWeight: 'normal', color: 'var(--mm-text-muted)' }}>Last 28 Days</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                                    {last28Days.map((d, i) => {
                                        const color = getDayColor(d);
                                        const isEmpty = color === 'var(--mm-border)';
                                        return (
                                            <div 
                                                key={i} 
                                                style={{
                                                    aspectRatio: '1/1',
                                                    borderRadius: '6px',
                                                    backgroundColor: isEmpty ? 'transparent' : color,
                                                    border: isEmpty ? '2px solid var(--mm-border)' : 'none',
                                                    opacity: isEmpty ? 0.3 : 1
                                                }} 
                                                title={d.toLocaleDateString()}
                                                aria-label={`${d.toLocaleDateString()}: ${isEmpty ? 'No craving logged' : 'Craving activity logged'}`}
                                            />
                                        );
                                    })}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '10px', color: 'var(--mm-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <div aria-hidden="true" style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#10B981' }}></div> Pass
                                        <div aria-hidden="true" style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#F59E0B', marginLeft: '4px' }}></div> Snack
                                    </div>
                                    <span>Today -&gt;</span>
                                </div>
                            </div>

                            {/* Trophy Case */}
                            <div style={{ gridColumn: 'span 2', marginTop: '16px' }}>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--mm-text-dark)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Trophy Case</div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    {trophies.map(t => (
                                        <div key={t.id} style={{ 
                                            background: 'var(--mm-bg-surface)', 
                                            border: `1px solid ${t.unlocked ? 'var(--mm-accent-primary)' : 'var(--mm-border)'}`, 
                                            padding: '16px 12px', 
                                            borderRadius: '16px',
                                            opacity: t.unlocked ? 1 : 0.6,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            boxShadow: t.unlocked ? '0 4px 12px rgba(44, 122, 123, 0.1)' : 'none'
                                        }}>
                                            <div style={{ fontSize: '32px', marginBottom: '8px', filter: t.unlocked ? 'none' : 'grayscale(100%)' }}>{t.icon}</div>
                                            <div style={{ fontSize: '13px', fontWeight: '700', color: t.unlocked ? 'var(--mm-accent-primary)' : 'var(--mm-text-dark)', marginBottom: '4px' }}>{t.title}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--mm-text-muted)' }}>{t.description}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Raw Log Toggle */}
                        <div style={{ marginTop: '32px' }}>
                            <button
                                type="button"
                                onClick={() => setShowRawLog(!showRawLog)}
                                aria-expanded={showRawLog}
                                aria-controls="raw-session-log"
                                style={{ width: '100%', padding: '16px', background: 'transparent', border: '1px solid var(--mm-border)', borderRadius: '12px', color: 'var(--mm-text-dark)', fontWeight: '600', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                View Raw Log
                                <span style={{ transform: showRawLog ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>v</span>
                            </button>

                            {showRawLog && (
                                <div id="raw-session-log" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px', padding: '0 8px' }}>
                                    {sortedSessions.map(session => (
                                        <div key={session.id} style={{ padding: '16px 0', borderBottom: '1px solid var(--mm-border)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                                                <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--mm-text-dark)' }}>{session.activityTitle || 'Mindful Pause'}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--mm-text-muted)' }}>{formatDate(session.timestamp)}</div>
                                            </div>
                                            
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                {!session.completed ? (
                                                    <span style={{ fontSize: '13px', color: 'var(--mm-error, #ef4444)', fontWeight: '500' }}>Cancelled</span>
                                                ) : (
                                                    <span style={{ 
                                                        fontSize: '13px', 
                                                        fontWeight: '500',
                                                        color: session.stillHungry === false ? 'var(--mm-accent-primary)' : 'var(--mm-text-muted)' 
                                                    }}>
                                                        {session.stillHungry === false ? 'Craving passed' : 
                                                         session.stillHungry === true ? 'Ate mindfully' : 
                                                         'Unresolved'}
                                                    </span>
                                                )}
                                            </div>
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
