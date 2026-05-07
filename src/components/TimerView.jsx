import React, { useState, useEffect, useRef } from 'react';

const AFFIRMATIONS = [
    "It takes 2 minutes for a craving peak to begin subsiding.",
    "You are not your thoughts. Observe them and let them pass.",
    "Boredom is just a lack of attention. Re-focus your mind.",
    "Drink some water. Sometimes thirst disguises itself as hunger.",
    "You're doing great. Just breathe.",
    "This pause builds your self-regulation muscle."
];

export default function TimerView({ duration = 300, onComplete, onCancel }) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [affirmation, setAffirmation] = useState(AFFIRMATIONS[0]);
    const wakeLockRef = useRef(null);

    useEffect(() => {
        const requestWakeLock = async () => {
            if ('wakeLock' in navigator) {
                try {
                    wakeLockRef.current = await navigator.wakeLock.request('screen');
                } catch (err) {
                    console.error(`Wake Lock error: ${err.name}, ${err.message}`);
                }
            }
        };
        requestWakeLock();

        return () => {
            if (wakeLockRef.current) {
                wakeLockRef.current.release().then(() => {
                    wakeLockRef.current = null;
                });
            }
        };
    }, []);

    useEffect(() => {
        const affirmationInterval = setInterval(() => {
            setAffirmation(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
        }, 15000); // Change every 15 seconds

        return () => clearInterval(affirmationInterval);
    }, []);

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
        <div className="view timer-view" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '260px', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '48px' }}>
                <svg width="260" height="260" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
                    <circle className="timer-circle-bg" cx="50" cy="50" r="46" fill="none" strokeWidth="2" />
                    <circle
                        className="timer-circle-progress"
                        cx="50" cy="50" r="46"
                        fill="none"
                        strokeWidth="4"
                        strokeDasharray="289"
                        strokeDashoffset={strokeDashoffset}
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>

                <div className="timer-text">
                    {formatTime(timeLeft)}
                </div>
            </div>

            <h2 style={{ marginBottom: '12px', fontSize: '20px' }}>Stay focused.</h2>
            <p style={{ textAlign: 'center', maxWidth: '80%', marginBottom: '20px', fontStyle: 'italic', opacity: 0.8 }}>
                "{affirmation}"
            </p>

            {/* Clean Editorial Ad Placeholder */}
            <div style={{
                width: '100%',
                maxWidth: '320px',
                height: '80px',
                background: 'var(--mm-bg-surface)',
                border: '1px solid var(--mm-border)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '40px',
                flexDirection: 'column'
            }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--mm-text-muted)', marginBottom: '4px' }}>Sponsored Space</span>
            </div>

            <div style={{ width: '100%' }}>
                <button className="mm-btn secondary" onClick={onCancel} style={{ width: '100%' }}>
                    Cancel Timer
                </button>
            </div>
        </div>
    );
}
