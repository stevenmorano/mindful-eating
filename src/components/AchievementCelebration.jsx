import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function AchievementCelebration({ achievement, total, onDismiss }) {
    const onDismissRef = useRef(onDismiss);

    useEffect(() => {
        onDismissRef.current = onDismiss;
    }, [onDismiss]);

    useEffect(() => {
        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!reduceMotion) {
            confetti({
                particleCount: 110,
                spread: 72,
                startVelocity: 28,
                origin: { y: 0.66 },
                scalar: 0.9,
                colors: ['#4A6C6F', '#10B981', '#F59E0B', '#FFFFFF'],
            });
        }

        const timeout = window.setTimeout(() => onDismissRef.current(), reduceMotion ? 1800 : 2600);
        return () => window.clearTimeout(timeout);
    }, [achievement.id]);

    return (
        <div className="achievement-celebration" role="status" aria-live="assertive" aria-label={`${achievement.title} unlocked`}>
            <button
                type="button"
                className="achievement-celebration-backdrop"
                onClick={onDismiss}
                aria-label="Dismiss achievement celebration"
            />
            <div className="achievement-celebration-card" role="dialog" aria-modal="false">
                <div className="achievement-celebration-badges">
                    <span className="achievement-celebration-kicker">Achievement unlocked</span>
                    {total > 1 && (
                        <span className="achievement-celebration-count">
                            {total - 1} more queued
                        </span>
                    )}
                </div>
                <div className="achievement-celebration-icon">{achievement.icon}</div>
                <h2>{achievement.title}</h2>
                <p>{achievement.description}</p>
                <div className="achievement-celebration-footer">
                    <span>{achievement.group}</span>
                    <button type="button" className="mm-btn primary-solid achievement-celebration-dismiss" onClick={onDismiss}>
                        Nice
                    </button>
                </div>
            </div>
        </div>
    );
}
