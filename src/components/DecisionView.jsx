import React from 'react';

export default function DecisionView({ onEat, onSkip }) {
    return (
        <div className="view decision-view" style={{ padding: '40px 20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px' }}>Time's Up</h1>
                <p style={{ fontSize: '20px', marginTop: '10px' }}>Are you still truly hungry?</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                <button className="mm-btn" onClick={onEat}>
                    Yes, I'm Hungry
                </button>
                <p style={{ fontSize: '14px', margin: '0', opacity: 0.8 }}>
                    Eat slowly and savor every bite.
                </p>

                <div style={{ height: '20px' }}></div>

                <button className="mm-btn secondary" onClick={onSkip}>
                    No, The Craving Passed
                </button>
                <p style={{ fontSize: '14px', margin: '0', opacity: 0.8 }}>
                    Great job listening to your body!
                </p>
            </div>
        </div>
    );
}
