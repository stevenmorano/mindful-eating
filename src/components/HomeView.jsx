import React from 'react';

export default function HomeView({ onStart }) {
    return (
        <div className="view home-view" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '10px' }}>
                <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>↑</span>
                </div>
                <h3 style={{ fontSize: '20px', color: 'white' }}>Mindful Munchies</h3>
            </div>

            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>Feeling a Craving?</h1>
                <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '50px' }}>
                    Press the button before you grab a snack.
                </p>

                <button
                    onClick={onStart}
                    style={{
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        background: 'white',
                        border: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                        cursor: 'pointer',
                        transition: 'transform 0.1s'
                    }}
                    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {/* Simple Fork/Knife Icon */}
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--mm-teal-end)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '10px' }}>
                        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                        <path d="M7 2v20" />
                        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                    </svg>
                    <span style={{ color: 'var(--mm-teal-end)', fontSize: '20px', fontWeight: '700' }}>I'm Hungry</span>
                </button>
            </div>
        </div>
    );
}
