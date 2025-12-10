import React from 'react';

export default function ActivityView({ activity, onStartTimer, onNewActivity, onCancel }) {
    if (!activity) return null;

    return (
        <div className="view activity-view" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>↑</span>
                    </div>
                    <h3 style={{ fontSize: '20px', color: 'white' }}>Mindful Munchies</h3>
                </div>
                <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>
                    ↻
                </button>
            </div>

            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '20px', opacity: 0.9 }}>Here's an idea...</h2>

                <div className="mm-card" style={{ width: '100%', marginBottom: '40px', minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '28px', lineHeight: '1.3' }}>{activity.text}</h1>
                </div>

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <button className="mm-btn secondary" onClick={onNewActivity}>
                        Another Idea
                    </button>
                    <button className="mm-btn" onClick={onStartTimer}>
                        Let's Do It!
                    </button>
                </div>
            </div>
        </div>
    );
}
