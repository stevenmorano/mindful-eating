import React from 'react';

export default function DevToolsModal({
    isOpen,
    isUnlocked,
    isDevMode,
    passwordValue,
    passwordError,
    isDemoProgressEnabled,
    onPasswordChange,
    onPasswordSubmit,
    onClose,
    onToggleDevMode,
    onLoadDemoProgress,
    onClearDemoProgress,
    onScanAchievements,
    onResetSeenAchievements,
    onReplayAchievementDemo,
    onLock,
}) {
    if (!isOpen) return null;

    return (
        <div className="dev-tools-overlay" role="dialog" aria-modal="true" aria-label="Private tools">
            <button type="button" className="dev-tools-backdrop" onClick={onClose} aria-label="Close private tools" />
            <div className="dev-tools-sheet">
                {!isUnlocked ? (
                    <>
                        <div className="dev-tools-header">
                            <div>
                                <span>Private Tools</span>
                                <strong>Unlock access</strong>
                            </div>
                            <button type="button" className="icon-btn" onClick={onClose} aria-label="Close private tools">
                                <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            </button>
                        </div>

                        <form
                            className="dev-tools-lock-form"
                            onSubmit={(event) => {
                                event.preventDefault();
                                onPasswordSubmit();
                            }}
                        >
                            <label>
                                Password
                                <input
                                    type="password"
                                    value={passwordValue}
                                    onChange={(event) => onPasswordChange(event.target.value)}
                                    autoComplete="current-password"
                                    inputMode="numeric"
                                />
                            </label>
                            {passwordError && <p className="dev-tools-error">{passwordError}</p>}
                            <button type="submit" className="mm-btn primary-solid">Unlock</button>
                        </form>
                    </>
                ) : (
                    <>
                        <div className="dev-tools-header">
                            <div>
                                <span>Private Tools</span>
                                <strong>Unlocked</strong>
                            </div>
                            <div className="dev-tools-header-actions">
                                <button type="button" className="mm-btn secondary dev-tools-lock-btn" onClick={onLock}>
                                    Lock
                                </button>
                                <button type="button" className="icon-btn" onClick={onClose} aria-label="Close private tools">
                                    <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                </button>
                            </div>
                        </div>

                        <div className="dev-tools-section">
                            <div className="dev-tools-row">
                                <div>
                                    <strong>Timer shortcut</strong>
                                    <span>Keep the five-second testing timer available.</span>
                                </div>
                                <button type="button" className={`mm-btn ${isDevMode ? 'primary-solid' : ''}`} onClick={onToggleDevMode}>
                                    {isDevMode ? 'Enabled' : 'Enable'}
                                </button>
                            </div>
                        </div>

                        <div className="dev-tools-section">
                            <div className="dev-tools-row">
                                <div>
                                    <strong>Sample progress</strong>
                                    <span>Load fake sessions so dashboard stats and achievements light up fast.</span>
                                </div>
                                <button type="button" className={`mm-btn ${isDemoProgressEnabled ? 'primary-solid' : ''}`} onClick={onLoadDemoProgress}>
                                    Load
                                </button>
                            </div>
                            <div className="dev-tools-row">
                                <div>
                                    <strong>Clear sample progress</strong>
                                    <span>Remove the demo sessions and return to real data.</span>
                                </div>
                                <button type="button" className="mm-btn secondary" onClick={onClearDemoProgress}>
                                    Clear
                                </button>
                            </div>
                        </div>

                        <div className="dev-tools-section">
                            <div className="dev-tools-row">
                                <div>
                                    <strong>Achievement scan</strong>
                                    <span>Check the current sessions now and queue any new unlocks.</span>
                                </div>
                                <button type="button" className="mm-btn secondary" onClick={onScanAchievements}>
                                    Scan
                                </button>
                            </div>
                            <div className="dev-tools-row">
                                <div>
                                    <strong>Reset seen unlocks</strong>
                                    <span>Replay achievement popups from the current progress set.</span>
                                </div>
                                <button type="button" className="mm-btn secondary" onClick={onResetSeenAchievements}>
                                    Reset
                                </button>
                            </div>
                            <div className="dev-tools-row">
                                <div>
                                    <strong>Popup demo</strong>
                                    <span>Show a scripted popup burst without changing your data.</span>
                                </div>
                                <button type="button" className="mm-btn secondary" onClick={onReplayAchievementDemo}>
                                    Demo
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
