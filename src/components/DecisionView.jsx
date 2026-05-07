import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { getRandomSnack } from '../data/activities';

export default function DecisionView({ onEat, onSkip, onExtend }) {
    const [step, setStep] = useState('decision'); // 'decision' | 'extend' | 'snack'
    const [snackSuggestion, setSnackSuggestion] = useState(null);

    const handlePassed = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
        setTimeout(onSkip, 1500);
    };

    const handleStillHungry = () => {
        setStep('extend');
    };

    const handleReallyEat = () => {
        setSnackSuggestion(getRandomSnack());
        setStep('snack');
    };

    if (step === 'snack' && snackSuggestion) {
        return (
            <div className="view decision-view" style={{ justifyContent: 'center', textAlign: 'center', alignItems: 'center' }}>
                <div style={{ marginBottom: '40px', width: '100%' }}>
                    <h1 style={{ marginBottom: '16px' }}>Mindful Snack Time</h1>
                    <p style={{ fontSize: '16px' }}>Since you're still hungry after pausing, choose something nourishing.</p>
                </div>
                
                <div style={{ background: 'var(--mm-bg-surface)', border: '1px solid var(--mm-border)', padding: '32px', borderRadius: '16px', marginBottom: '40px', width: '100%', maxWidth: '400px' }}>
                    <h3 style={{ marginBottom: '8px', color: 'var(--mm-primary)' }}>{snackSuggestion.category}</h3>
                    <h2>{snackSuggestion.text}</h2>
                </div>

                <button className="mm-btn primary-solid" onClick={onEat} style={{ width: '100%', maxWidth: '300px' }}>
                    Done
                </button>
            </div>
        );
    }

    if (step === 'extend') {
        return (
            <div className="view decision-view" style={{ justifyContent: 'center', textAlign: 'center', alignItems: 'center' }}>
                <div style={{ marginBottom: '60px', width: '100%' }}>
                    <h1 style={{ marginBottom: '16px' }}>Still Hungry?</h1>
                    <p style={{ fontSize: '16px', maxWidth: '80%', margin: '0 auto' }}>Before we grab a snack, let's try one more distraction. Often cravings pass after 10 minutes.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '400px' }}>
                    <div style={{ background: 'var(--mm-bg-surface)', border: '1px solid var(--mm-border)', padding: '24px', borderRadius: '16px' }}>
                        <button className="mm-btn primary-solid" onClick={onExtend} style={{ width: '100%', marginBottom: '12px' }}>
                            Try another 5-min pause
                        </button>
                        <p style={{ fontSize: '13px' }}>
                            A little more time might be all you need.
                        </p>
                    </div>

                    <div style={{ padding: '0 24px' }}>
                        <button className="mm-btn" onClick={handleReallyEat} style={{ width: '100%', marginBottom: '12px', borderColor: 'transparent', boxShadow: 'var(--shadow-sm)' }}>
                            No, I really need to eat
                        </button>
                        <p style={{ fontSize: '13px' }}>
                            Okay, let's choose a mindful option.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="view decision-view" style={{ justifyContent: 'center', textAlign: 'center', alignItems: 'center' }}>
            <div style={{ marginBottom: '60px' }}>
                <h1 style={{ marginBottom: '16px' }}>How do you feel now?</h1>
                <p style={{ fontSize: '16px' }}>Check in with yourself. Has the urge subsided?</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
                <div style={{ background: 'var(--mm-bg-surface)', border: '1px solid var(--mm-border)', padding: '24px', borderRadius: '16px' }}>
                    <button className="mm-btn primary-solid" onClick={handlePassed} style={{ width: '100%', marginBottom: '12px' }}>
                        The craving passed!
                    </button>
                    <p style={{ fontSize: '13px' }}>
                        Excellent work acknowledging and observing the urge.
                    </p>
                </div>

                <div style={{ padding: '0 24px' }}>
                    <button className="mm-btn" onClick={handleStillHungry} style={{ width: '100%', marginBottom: '12px', borderColor: 'transparent', boxShadow: 'var(--shadow-sm)' }}>
                        I still want to eat
                    </button>
                    <p style={{ fontSize: '13px' }}>
                        That's okay. Let's find a mindful option.
                    </p>
                </div>
            </div>
        </div>
    );
}
