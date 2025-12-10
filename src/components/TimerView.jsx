import React, { useState, useEffect } from 'react';

export default function TimerView({ duration = 600, onComplete, onCancel }) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (timeLeft <= 0) {
            onComplete();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onComplete]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const progress = ((duration - timeLeft) / duration) * 100;
    const strokeDashoffset = 283 - (283 * progress) / 100;

    return (
        <div className="view timer-view" style={{ padding: '40px 20px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h2 style={{ marginBottom: '40px', fontSize: '28px' }}>Take a Break</h2>

            <div style={{ position: 'relative', width: '250px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '60px' }}>
                {/* SVG Circle Progress */}
                <svg width="250" height="250" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
                    <circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke="white"
                        strokeWidth="6"
                        strokeDasharray="283"
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>

                <div style={{ fontSize: '60px', fontWeight: '200', fontVariantNumeric: 'tabular-nums' }}>
                    {formatTime(timeLeft)}
                </div>
            </div>

            <p style={{ textAlign: 'center', maxWidth: '80%', marginBottom: '40px' }}>
                Focus on your activity. Allow the craving to pass.
            </p>

            <div style={{ width: '100%' }}>
                <button className="mm-btn secondary" onClick={onCancel} style={{ width: '100%' }}>
                    Stop Timer
                </button>
            </div>
        </div>
    );
}
