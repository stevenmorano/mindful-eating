import React, { useState, useEffect } from 'react';
import { getSessions } from '../data/sessions';

export default function HistoryView({ onClose }) {
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        setSessions(getSessions() || []);
    }, []);

    // Summary calculations
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.completed);
    const skippedEating = sessions.filter(s => s.stillHungry === false).length;
    const ateAfterPause = sessions.filter(s => s.stillHungry === true).length;
    const completionRate = totalSessions > 0 ? Math.round((completedSessions.length / totalSessions) * 100) : 0;

    // Total mindful minutes (completed sessions only, fallback to 10 if undefined)
    const totalMindfulMinutes = completedSessions.reduce((acc, curr) => {
        return acc + (curr.activityDurationMinutes || 10);
    }, 0);

    // Insights Generation
    let insightMessage = "Keep taking mindful pauses to discover more insights.";
    if (totalSessions > 0) {
        const skipRate = (skippedEating / totalSessions) * 100;
        const lateNightSessions = sessions.filter(s => {
            const date = new Date(s.timestamp);
            const hour = date.getHours();
            return hour >= 21 || hour < 3;
        }).length;

        if (completionRate < 50 && totalSessions > 0) {
            insightMessage = "You’re starting mindful pauses but ending early. Try completing one full 10-minute pause today.";
        } else if (skipRate > 60) {
            insightMessage = "You’ve successfully interrupted most urges. Great awareness.";
        } else if (lateNightSessions > totalSessions / 2) {
            insightMessage = "Most urges happen late at night. This may be boredom rather than hunger.";
        }
    }

    const sortedSessions = [...sessions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const formatDate = (isoString) => {
        try {
            const d = new Date(isoString);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        } catch (e) {
            return 'Unknown Date';
        }
    };

    return (
        <div className="view history-view" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', paddingTop: '10px' }}>
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: '32px',
                        cursor: 'pointer',
                        padding: '0',
                        marginRight: '15px',
                        lineHeight: '1'
                    }}
                    aria-label="Back"
                >
                    ‹
                </button>
                <h2 style={{ fontSize: '24px', margin: 0 }}>History</h2>
            </div>

            <div style={{ flexGrow: 1, overflowY: 'auto', paddingBottom: '20px', WebkitOverflowScrolling: 'touch' }}>
                {totalSessions === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80%', textAlign: 'center' }}>
                        <p style={{ marginBottom: '30px', opacity: 0.9, fontSize: '18px' }}>Start your first mindful pause to begin tracking patterns.</p>
                        <button className="mm-btn secondary" onClick={onClose} style={{ width: '80%' }}>Start a session</button>
                    </div>
                ) : (
                    <>
                        {/* Summary Card */}
                        <div className="mm-card" style={{ marginBottom: '24px' }}>
                            <h3 style={{ marginBottom: '16px', fontSize: '18px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '8px', margin: 0 }}>Summary</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Sessions</div>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalSessions}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mindful Mins</div>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalMindfulMinutes}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Skipped Eating</div>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{skippedEating}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ate After</div>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{ateAfterPause}</div>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <div style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Completion Rate</div>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ minWidth: '45px' }}>{completionRate}%</span>
                                        <div style={{ flexGrow: 1, height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: `${completionRate}%`, height: '100%', background: 'var(--mm-accent-yellow, #FF9F1C)', borderRadius: '4px' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Insights Card */}
                        <div className="mm-card" style={{ marginBottom: '24px', background: 'rgba(255, 255, 255, 0.2)' }}>
                            <h3 style={{ marginBottom: '12px', fontSize: '18px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '8px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>💡</span> Insights
                            </h3>
                            <p style={{ fontSize: '15px', lineHeight: '1.4', margin: 0 }}>
                                {insightMessage}
                            </p>
                        </div>

                        {/* Session List */}
                        <h3 style={{ marginBottom: '16px', fontSize: '18px', margin: 0 }}>Recent Sessions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {sortedSessions.map(session => (
                                <div key={session.id} className="mm-card" style={{ padding: '16px' }}>
                                    <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '6px' }}>{formatDate(session.timestamp)}</div>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>{session.activityTitle || 'Mindful Pause'}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{
                                            fontSize: '13px',
                                            background: 'rgba(0,0,0,0.15)',
                                            padding: '6px 10px',
                                            borderRadius: '12px',
                                            fontWeight: '600'
                                        }}>
                                            {session.stillHungry === false ? '😌 Skipped' :
                                                session.stillHungry === true ? '😋 Ate' :
                                                    '🤔 No decision'}
                                        </div>
                                        {!session.completed && (
                                            <span style={{ fontSize: '12px', color: '#ffb3b3', border: '1px solid rgba(255, 179, 179, 0.5)', borderRadius: '10px', padding: '4px 8px' }}>Ended early</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
