'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FlightTransitionProps {
    onComplete: () => void;
    names?: string;
}

const FlightTransition: React.FC<FlightTransitionProps> = ({ onComplete, names = "Alex & Sarah" }) => {
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        // Trigger completion after animation
        const timer = setTimeout(() => {
            onComplete();
        }, 5000); // 5 seconds total duration

        const textTimer = setTimeout(() => {
            setShowText(true);
        }, 1000);

        return () => {
            clearTimeout(timer);
            clearTimeout(textTimer);
        }
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-50 overflow-hidden bg-sky-100 flex items-center justify-center font-serif text-slate-800"
            exit={{ opacity: 0 }}
        >
            {/* Background Clouds (CSS/SVG) */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Cloud 1 */}
                <motion.div
                    className="absolute top-20 left-[-100px] text-white opacity-80"
                    animate={{ x: "120vw" }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                >
                    <svg width="200" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M18.5,10.2c-0.6-2.5-2.8-4.2-5.5-4.2c-2,0-3.8,1-4.8,2.5c-0.2-0.1-0.5-0.1-0.7-0.1C4.4,8.4,2,10.8,2,13.8c0,3,2.4,5.4,5.5,5.4h11c2.5,0,4.5-2,4.5-4.5C23,12.2,21,10.2,18.5,10.2z" /></svg>
                </motion.div>
                {/* Cloud 2 */}
                <motion.div
                    className="absolute bottom-40 left-[-200px] text-white opacity-60 scale-150"
                    animate={{ x: "120vw" }}
                    transition={{ duration: 35, repeat: Infinity, ease: "linear", delay: 2 }}
                >
                    <svg width="200" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M18.5,10.2c-0.6-2.5-2.8-4.2-5.5-4.2c-2,0-3.8,1-4.8,2.5c-0.2-0.1-0.5-0.1-0.7-0.1C4.4,8.4,2,10.8,2,13.8c0,3,2.4,5.4,5.5,5.4h11c2.5,0,4.5-2,4.5-4.5C23,12.2,21,10.2,18.5,10.2z" /></svg>
                </motion.div>
            </div>

            {/* Content Container */}
            <div className="text-center z-10 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={showText ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 1 }}
                >
                    <p className="tracking-[0.3em] uppercase text-sm md:text-base mb-4 text-sky-800">Welcome to the Celebration of</p>
                    <h1 className="text-4xl md:text-7xl font-bold text-sky-900 drop-shadow-sm mb-8">{names}</h1>

                    {/* Pulsing Hearts */}
                    <div className="flex justify-center space-x-4">
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                            <svg className="w-8 h-8 text-rose-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* The Plane flying across */}
            <motion.div
                className="absolute z-20 text-slate-800"
                initial={{ x: "-10vw", y: "50vh", rotate: -10, scale: 0.5 }}
                animate={{ x: "110vw", y: "40vh", rotate: 0, scale: 1 }}
                transition={{ duration: 4, ease: "easeInOut", delay: 0.5 }}
            >
                <div className="relative">
                    {/* Banner trailing behind plane? Optional. Let's start simple. */}
                    <svg className="w-24 h-24 md:w-32 md:h-32 transform rotate-45" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21,16V14L13,9V3.5C13,2.67,12.33,2,11.5,2S10,2.67,10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z" />
                    </svg>
                    {/* Streamer trail */}
                    <motion.div
                        className="absolute top-1/2 right-full h-[2px] bg-white/40 w-[200px] origin-right"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 2 }}
                    />
                </div>
            </motion.div>

        </motion.div>
    );
};

export default FlightTransition;
