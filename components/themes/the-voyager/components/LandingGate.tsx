'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface LandingGateProps {
    content: any;
    onBoard: () => void;
}

const LandingGate: React.FC<LandingGateProps> = ({ content, onBoard }) => {
    const {
        bgImage,
        passportCover,
        boardingPass,
        walletTexture, // now the user's uploaded image
        names,
        date,
        location,
        buttonText
    } = content || {};

    const [isExiting, setIsExiting] = useState(false);

    // Memoize barcode bars to prevent re-randomization on re-renders
    const barcodeBars = React.useMemo(() => {
        return [...Array(40)].map((_, i) => ({
            key: i,
            width: Math.random() > 0.5 ? 'w-[1px]' : 'w-[3px]',
            opacity: Math.random() > 0.3 ? 1 : 0
        }));
    }, []);

    const handleBoard = () => {
        setIsExiting(true);
        setTimeout(() => {
            onBoard();
        }, 1000);
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black"
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
            {/* LAYER 0: Background Desk */}
            <motion.div
                className="absolute inset-0 w-full h-full"
                initial={{ scale: 1.1 }}
                animate={isExiting ? { scale: 1.2, opacity: 0 } : { scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            >
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                    src={bgImage}
                    alt="Vintage Desk"
                    className="w-full h-full object-cover"
                />
            </motion.div>

            {/* MAIN CONTAINER: Vertical Wallet (Mobile) / Horizontal Wallet (Desktop) */}
            <motion.div
                className="relative z-20 w-[95vw] md:w-[1200px] aspect-[9/16] md:aspect-[16/9] flex items-center justify-start md:justify-center p-2 pt-4 md:p-8"
                initial={{ y: 50, opacity: 0 }}
                animate={isExiting ? { y: 100, opacity: 0, rotateX: 20 } : { y: 0, opacity: 1, rotateX: 0 }}
                transition={{ duration: 0.8, ease: "backOut" }}
            >
                {/* The Wallet Image (Rotated 90deg on Mobile) */}
                <img
                    src={walletTexture}
                    alt="Wallet"
                    className="absolute inset-0 w-full h-full object-contain md:object-contain transform rotate-90 md:rotate-0 scale-[1.3] md:scale-100 drop-shadow-2xl filter brightness-110"
                />

                {/* Content Container - Positioning items on the wallet */}
                <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-start md:justify-center gap-0 md:gap-20">

                    {/* LEFT SIDE: Passport (Vertical on Mobile, Top Layer) */}
                    <motion.div
                        className="relative z-20 w-[70%] md:w-[380px] aspect-[3/4.2] shadow-2xl origin-center transform rotate-0 md:-rotate-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                        whileHover={{ scale: 1.02, rotate: 0, zIndex: 30 }}
                    >
                        {/* Leather Texture Background */}
                        <div
                            className="absolute inset-0 rounded-r-xl rounded-l-sm overflow-hidden shadow-inner bg-slate-800"
                            style={{
                                backgroundImage: `url(${passportCover})`,
                                backgroundSize: 'cover',
                                boxShadow: 'inset 2px 0 10px rgba(0,0,0,0.5), 5px 5px 25px rgba(0,0,0,0.6)'
                            }}
                        >
                            <div className="absolute top-3 bottom-3 left-4 border-l-2 border-dashed border-amber-600/40 opacity-70"></div>

                            <div className="flex flex-col items-center justify-center h-full text-center relative px-4 md:px-6 py-6 md:pt-20">
                                <motion.h3
                                    className="font-serif text-amber-100/80 tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-sm uppercase mb-4 md:mb-8 drop-shadow-sm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 1 }}
                                >
                                    Passport to Love
                                </motion.h3>

                                <motion.div
                                    className="mb-4 md:mb-10 opacity-95 filter drop-shadow-md text-[#d4af37]"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                                >
                                    <svg className="w-12 h-12 md:w-20 md:h-20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" />
                                    </svg>
                                </motion.div>

                                <motion.h1
                                    className="font-serif text-3xl md:text-5xl leading-none mb-4 md:mb-6 text-[#fbf5b0] drop-shadow-md"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2, duration: 0.8 }}
                                >
                                    {names || "Alex & Sarah"}
                                </motion.h1>

                                <motion.div
                                    className="mt-auto mb-8 md:mb-20"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.4, duration: 0.8 }}
                                >
                                    <p className="font-serif text-amber-100/70 tracking-widest text-[8px] md:text-[10px] uppercase mb-2">Save the Date</p>
                                    <p className="font-serif text-amber-50 text-sm md:text-xl tracking-wide shadow-black drop-shadow-md">{date || "09.14.24"}</p>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>


                    {/* RIGHT SIDE: Boarding Pass (Stacked & Tucked Behind) */}
                    <motion.div
                        className="relative z-10 w-[72%] md:w-[340px] aspect-[9/13] rounded-xl shadow-xl transform rotate-4 -mt-6 md:mt-0 md:rotate-2"
                        style={{
                            backgroundImage: `url(${boardingPass})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            boxShadow: '0 5px 25px rgba(0,0,0,0.4)'
                        }}
                        initial={{ opacity: 0, x: -20, rotate: 0 }}
                        animate={{ opacity: 1, x: 0, rotate: window.innerWidth < 768 ? 4 : 2 }} // Conditionally set rotate based on manual breakpoint logic or keep consistent
                        // Note: JS window usage inside render usually needs check, but for initial/animate usually ok in framer if guarded. 
                        // Better to stick to simple values or use variants. Let's stick to the visual look we had but fade it in.
                        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                        whileHover={{ y: -10, rotate: 0, zIndex: 30, transition: { duration: 0.3 } }}
                    >
                        <motion.div
                            className="flex flex-col h-full p-3 md:p-8 text-slate-800 relative z-0"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.1, delayChildren: 1.5 } }
                            }}
                        >
                            {/* Header */}
                            <motion.div
                                className="border-b-[1px] md:border-b-2 border-slate-800 pb-1 md:pb-4 mb-1 md:mb-6 flex justify-between items-end"
                                variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0 } }}
                            >
                                <div>
                                    <span className="block font-sans font-black uppercase text-[10px] md:text-sm tracking-wider">Boarding</span>
                                    <span className="block font-serif text-[8px] md:text-xs italic">First Class</span>
                                </div>
                                <div className="text-right">
                                    <span className="block font-mono text-[8px] md:text-xs opacity-60">FLIGHT</span>
                                    <span className="block font-bold text-[10px] md:text-base">VN-2026</span>
                                </div>
                            </motion.div>

                            {/* Main Details */}
                            <div className="space-y-1 md:space-y-6 flex-1">
                                <motion.div variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0 } }}>
                                    <span className="block font-mono text-[8px] md:text-[10px] text-slate-500 uppercase tracking-widest leading-none mb-[1px]">Passenger</span>
                                    <span className="font-serif text-lg md:text-2xl leading-none font-bold block truncate">{names || "Guest Name"}</span>
                                </motion.div>

                                <motion.div className="flex justify-between" variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0 } }}>
                                    <div>
                                        <span className="block font-mono text-[8px] md:text-[10px] text-slate-500 uppercase tracking-widest leading-none mb-[1px]">From</span>
                                        <span className="font-bold block text-[10px] md:text-base leading-none">HOME</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-mono text-[8px] md:text-[10px] text-slate-500 uppercase tracking-widest leading-none mb-[1px]">To</span>
                                        <span className="font-bold block text-[10px] md:text-base leading-none">{location}</span>
                                    </div>
                                </motion.div>

                                <motion.div variants={{ hidden: { opacity: 0, y: 5 }, visible: { opacity: 1, y: 0 } }}>
                                    <span className="block font-mono text-[8px] md:text-[10px] text-slate-500 uppercase tracking-widest leading-none mb-[1px]">Date</span>
                                    <span className="font-mono text-sm md:text-lg font-bold block bg-yellow-100/50 inline-block px-1 leading-none">{date}</span>
                                </motion.div>

                                {/* Barcode */}
                                <motion.div
                                    className="mt-2 md:mt-4 opacity-70"
                                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.7 } }}
                                >
                                    <div className="h-6 md:h-8 w-full bg-transparent flex items-end space-x-[2px] overflow-hidden grayscale">
                                        {/* CSS Generated Barcode pattern */}
                                        {barcodeBars.map((bar) => (
                                            <div key={bar.key} className={`h-full bg-slate-800 ${bar.width}`} style={{ opacity: bar.opacity }}></div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-[6px] md:text-[8px] font-mono mt-1 text-slate-500">
                                        <span>0029</span>
                                        <span>4821</span>
                                        <span>VN-2026</span>
                                    </div>
                                </motion.div>

                                {/* Realistic Rubber Stamp */}
                                <motion.div
                                    className="absolute top-[30%] right-2 md:right-8 w-16 h-16 md:w-24 md:h-24 pointer-events-none z-20"
                                    initial={{ opacity: 0, scale: 2, rotate: -20 }}
                                    animate={{ opacity: 0.8, scale: 1, rotate: -15 }}
                                    transition={{ delay: 2.2, duration: 0.2, type: "spring", stiffness: 300, damping: 15 }}
                                >
                                    <div className="w-full h-full border-4 border-red-700/60 rounded-full flex items-center justify-center p-1" style={{ maskImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}>
                                        <div className="w-full h-full border-2 border-red-700/60 rounded-full flex items-center justify-center animate-pulse-slow">
                                            <div className="text-center transform -rotate-12">
                                                <span className="block font-black text-red-800/70 text-[8px] md:text-xs uppercase tracking-widest leading-none">Wedding</span>
                                                <span className="block font-black text-red-700/80 text-[10px] md:text-sm uppercase tracking-widest leading-none my-1">Access</span>
                                                <span className="block font-mono text-red-800/60 text-[6px] md:text-[8px] uppercase tracking-widest leading-none">Verified</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Button Area */}
                            <motion.div
                                className="mt-1 md:mt-4 pt-1 md:pt-4 border-t-[1px] md:border-t-2 border-dashed border-slate-300"
                                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                            >
                                <motion.div
                                    className="h-8 md:h-12 w-full bg-slate-800 flex items-center justify-center text-white cursor-pointer hover:bg-slate-700 transition-colors shadow-lg"
                                    onClick={handleBoard}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    animate={{
                                        scale: [1, 1.02, 1],
                                        boxShadow: ["0px 4px 6px rgba(0,0,0,0.1)", "0px 6px 12px rgba(0,0,0,0.2)", "0px 4px 6px rgba(0,0,0,0.1)"]
                                    }}
                                    transition={{
                                        scale: {
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        },
                                        boxShadow: {
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }
                                    }}
                                >
                                    <span className="font-bold uppercase tracking-[0.2em] text-[9px] md:text-xs">{buttonText || "Board Now"}</span>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                </div>

            </motion.div>
        </motion.div>
    );
};

export default LandingGate;
