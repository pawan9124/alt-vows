'use client';

import React, { useEffect, useState } from 'react';

interface ConfettiSuccessProps {
    slug: string;
    onDismiss: () => void;
}

// Lightweight CSS-only confetti + celebration message
export const ConfettiSuccess: React.FC<ConfettiSuccessProps> = ({ slug, onDismiss }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onDismiss();
        }, 6000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    if (!visible) return null;

    // Generate confetti pieces
    const confettiColors = ['#d4af37', '#f5d060', '#e02e2e', '#00f0ff', '#a855f7', '#22c55e', '#f472b6'];
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        color: confettiColors[i % confettiColors.length],
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2}s`,
        duration: `${2 + Math.random() * 2}s`,
        size: `${6 + Math.random() * 6}px`,
        rotation: `${Math.random() * 360}deg`,
    }));

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-auto"
            onClick={onDismiss}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Confetti */}
            {confettiPieces.map((piece) => (
                <div
                    key={piece.id}
                    className="absolute top-0 pointer-events-none"
                    style={{
                        left: piece.left,
                        width: piece.size,
                        height: piece.size,
                        backgroundColor: piece.color,
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                        animation: `confettiFall ${piece.duration} ease-in ${piece.delay} forwards`,
                        transform: `rotate(${piece.rotation})`,
                    }}
                />
            ))}

            {/* Message */}
            <div className="relative z-10 text-center px-8 py-10 bg-[#111] border border-white/10 rounded-2xl max-w-md mx-4 shadow-2xl"
                style={{
                    animation: 'celebrationPop 0.5s ease-out',
                }}
            >
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    Your site is live!
                </h2>
                <p className="text-white/50 text-sm mb-6">
                    Guests can now visit your wedding site at:
                </p>
                <div className="bg-black/50 rounded-lg px-4 py-3 border border-white/10 mb-6">
                    <code className="text-yellow-400 text-sm">
                        {typeof window !== 'undefined' ? window.location.origin : ''}/s/{slug}
                    </code>
                </div>
                <button
                    onClick={onDismiss}
                    className="px-6 py-2.5 bg-yellow-600 hover:bg-yellow-500 text-black font-bold text-sm rounded-lg transition-all uppercase tracking-wide"
                >
                    Got it!
                </button>
            </div>

            {/* Keyframes */}
            <style jsx>{`
                @keyframes confettiFall {
                    0% {
                        transform: translateY(-20px) rotate(0deg) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg) scale(0.3);
                        opacity: 0;
                    }
                }
                @keyframes celebrationPop {
                    0% {
                        transform: scale(0.8);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1.05);
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};
