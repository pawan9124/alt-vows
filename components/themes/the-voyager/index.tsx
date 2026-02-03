'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Component Imports
import LandingGate from './components/LandingGate';
import JourneyScroll from './components/JourneyScroll';
import FlightTransition from './components/FlightTransition';

// Defines the props structure
interface TheVoyagerProps {
    content: any;
    weddingId?: string;
    onContentChange?: (section: string, field: string, value: any) => void;
}

const TheVoyager: React.FC<TheVoyagerProps> = ({ content, onContentChange }) => {
    const [hasBoarded, setHasBoarded] = useState(false);
    const [isInTransition, setIsInTransition] = useState(false);

    const handleBoard = () => {
        setHasBoarded(true);
        setIsInTransition(true);
    };

    const handleTransitionComplete = () => {
        setIsInTransition(false);
    };

    return (
        <div className="relative w-full min-h-screen bg-stone-900 overflow-hidden font-sans text-stone-200">
            <AnimatePresence>
                {!hasBoarded && (
                    <LandingGate
                        content={content.hero}
                        onBoard={handleBoard}
                    />
                )}
            </AnimatePresence>

            {/* FLIGHT TRANSITION ANIMATION */}
            <AnimatePresence>
                {isInTransition && (
                    <FlightTransition
                        onComplete={handleTransitionComplete}
                        names={content.hero?.names}
                    />
                )}
            </AnimatePresence>

            {/* MAIN CONTENT REVEALED AFTER FLIGHT */}
            {hasBoarded && !isInTransition && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="relative z-10 w-full"
                >
                    <JourneyScroll content={content} />
                </motion.div>
            )}
        </div>
    );
};

import { theVoyagerConfig } from './config';

export const TheVoyagerThemePkg = {
    component: TheVoyager,
    config: theVoyagerConfig
};

export default TheVoyagerThemePkg;
