'use client';

// Assets - files in public/ folder are served at root URL as strings
const parchmentBg = '/themes/the-voyager/parchment_long_texture.png';
const compass = '/themes/the-voyager/vintage_brass_compass.png';
const couplePhoto = '/themes/the-voyager/couple_placeholder.jpg';
// Environment Assets
const woodDesk = '/themes/the-voyager/vintage_desk_wood.jpeg';
const mapFragment = '/themes/the-voyager/vintage_map_fragment.png';
const telescope = '/themes/the-voyager/brass_telescope.png';
const stamps = '/themes/the-voyager/vintage_stamps_set.png';
const vintageMapBg = '/themes/the-voyager/VintageMapBackground.png';
const leatherStraps = '/themes/the-voyager/leather_straps.png';
const waxSeal = '/themes/the-voyager/red_wax_seal_blank.png';

import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../../lib/supabase';
import { useParams } from 'next/navigation';
import { Plane, Users, MapPin, Calendar, Globe } from 'lucide-react';

interface JourneyScrollProps {
    content: {
        adventure?: any;
        story?: any;
        details?: any;
        rsvp?: any;
        thankYou?: any;
        [key: string]: any;
    };
}

const JourneyScroll: React.FC<JourneyScrollProps> = ({ content }) => {
    // Destructure with defaults to prevent crashes
    const {
        adventure = {},
        story = {},
        details = {},
        rsvp = {},
        thankYou = {}
    } = content;

    const { id: weddingId } = useParams(); // Start with trying to get ID from params
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // RSVP Logic
    const [rsvpForm, setRsvpForm] = useState({
        name: '',
        attending: true,
        guestCount: 1
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleRSVPSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!weddingId) {
            console.error("No wedding ID found in params");
            return;
        }

        setStatus('loading');
        try {
            const { error } = await supabase
                .from('guests')
                .insert({
                    wedding_id: weddingId,
                    name: rsvpForm.name,
                    attending: rsvpForm.attending,
                    plus_ones: Math.max(0, rsvpForm.guestCount - 1),
                    email: null,
                    message: null
                });

            if (error) throw error;
            setStatus('success');
            setRsvpForm({ name: '', attending: true, guestCount: 1 });
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };


    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax effects
    const yParallax = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const compassRotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

    // Environment Parallax
    const mapY = useTransform(scrollYProgress, [0, 1], [0, -100]); // Moves slower than scroll (appears further back)
    const strapY = useTransform(scrollYProgress, [0, 1], [0, -60]); // Moves slightly separate
    const telescopeY = useTransform(scrollYProgress, [0, 1], [50, -50]);

    return (
        <div ref={containerRef} className="relative w-full min-h-[250vh] pb-96 perspective-[1000px] overflow-hidden">

            {/* LAYER 0: Wood Desk Background (Fixed Cover) */}
            <div className="absolute inset-0 z-0">
                <img src={woodDesk} alt="" className="w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-black/40 mix-blend-multiply pointer-events-none"></div>
            </div>

            {/* LAYER 1: Full Vintage Map Background (Below Paper) */}
            {/* LAYER 1: Vintage Map "Placed" on Desk */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ y: mapY }}
                className="absolute top-[10%] left-[5%] w-[90%] md:w-[85%] max-w-[1400px] z-0 mix-blend-normal rotate-[-2deg] drop-shadow-2xl"
            >
                <img src={vintageMapBg} alt="World Map" className="w-full h-auto object-cover rounded-sm contrast-125 brightness-110 saturate-125" />
            </motion.div>

            {/* LAYER 3: Decor Elements (Under Parchment) */}
            <motion.div
                style={{ y: strapY }}
                className="absolute top-[65%] -left-[50px] w-64 md:w-96 z-0 mix-blend-multiply opacity-90 pointer-events-none rotate-12"
            >
                <img src={mapFragment} alt="Map Fragment" className="w-full h-auto object-contain drop-shadow-xl" />
            </motion.div>

            {/* Half-Revealing Map (Left Side) - Peeking out under RSVP */}
            <motion.div
                className="absolute top-[80%] -left-[15%] w-[60%] md:w-[45%] z-0 pointer-events-none mix-blend-multiply opacity-85"
                style={{ y: mapY, rotate: -8 }}
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 0.9 }}
                transition={{ duration: 1, delay: 0.5 }}
            >
                <img src={vintageMapBg} alt="Hidden Map" className="w-full h-auto object-cover rounded-r-md shadow-2xl contrast-110 sepia-[0.4]" />
            </motion.div>




            {/* LAYER 2: The Main Scroll Container - Centered */}
            <div className="relative w-full max-w-4xl mx-auto z-10 pt-20 pl-4 pr-4 md:pl-0 md:pr-0">

                {/* Parchment Background Layer - Stacked for Length */}
                <div className="absolute inset-0 z-0 flex flex-col items-center pointer-events-none">
                    {/* Top Scroll - Keep Top Roll, Clip Bottom to remove "rolled up" edge */}
                    <img
                        src={parchmentBg}
                        alt="Background Scroll Top"
                        className="w-full h-auto object-cover z-20 relative"
                        style={{ clipPath: 'inset(0 0 10% 0)' }}
                    />

                    {/* Extension Scroll 1 - Clip BOTH ends to permit a seamless 'middle' */}
                    {/* Negative margin pulls it up to overlap the clipped area of the previous image */}
                    <img
                        src={parchmentBg}
                        alt="Background Scroll Extension"
                        className="w-full h-auto object-cover -mt-[48%] z-10 brightness-95"
                        style={{ clipPath: 'inset(10% 0 10% 0)' }}
                    />

                    {/* Extension Scroll 2 */}
                    <img
                        src={parchmentBg}
                        alt="Background Scroll Extension 2"
                        className="w-full h-auto object-cover -mt-[48%] z-0 brightness-90 relative"
                        style={{ clipPath: 'inset(10% 0 10% 0)' }}
                    />

                    {/* Extension Scroll 3 - More length for mobile */}
                    <img
                        src={parchmentBg}
                        alt="Background Scroll Extension 3"
                        className="w-full h-auto object-cover -mt-[48%] z-0 brightness-90 relative"
                        style={{ clipPath: 'inset(10% 0 10% 0)' }}
                    />

                    {/* Extension Scroll 4 - Even more length */}
                    <img
                        src={parchmentBg}
                        alt="Background Scroll Extension 4"
                        className="w-full h-auto object-cover -mt-[48%] z-0 brightness-90 block relative"
                        style={{ clipPath: 'inset(10% 0 10% 0)' }}
                    />

                    {/* Extension Scroll 5 - Maximum safety length */}
                    <img
                        src={parchmentBg}
                        alt="Background Scroll Extension 5"
                        className="w-full h-auto object-cover -mt-[48%] z-0 brightness-90 block relative"
                        style={{ clipPath: 'inset(10% 0 5% 0)' }}
                    />
                    {/* Bottom Roll Finisher - Optional, just to close it off nicely if needed, 
                         but for now let's just let it fade or end. If we want a bottom roll, we need one last image 
                         clipped only at the top. */}
                    <img
                        src={parchmentBg}
                        alt="Background Scroll Bottom"
                        className="w-full h-auto object-cover -mt-[48%] z-0 brightness-90 block relative"
                        style={{ clipPath: 'inset(10% 0 0 0)' }}
                    />

                </div>

                {/* Content Overlay Grid - Now Relative to flow naturally */}
                <div className="relative z-10 px-8 md:px-24 flex flex-col items-center top-[50px] md:top-[120px]">

                    {/* SECTION 1: THE ADVENTURE BEGINS (HERO) */}
                    <motion.div
                        className="text-center mb-12 w-full max-w-lg mx-auto mt-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <h2 className="font-serif text-3xl md:text-5xl text-[#3d2e20] mb-2 tracking-wide font-bold whitespace-pre-line">
                            {adventure.title || "THE\nADVENTURE\nBEGINS"}
                        </h2>
                        <div className="w-16 h-[2px] bg-[#8a6b4e] mx-auto my-4 opacity-60"></div>
                        <p className="font-serif text-[#5c4d3c] text-sm md:text-base italic mb-1">
                            {adventure.subtitle || "Join us for our Wedding Celebration"}
                        </p>
                        <p className="font-mono text-[#5c4d3c] uppercase tracking-widest text-xs font-bold">
                            {adventure.saveTheDate || "Save the Date - 09.14.24"}
                        </p>
                    </motion.div>

                    {/* ARCHWAY PHOTO */}
                    <motion.div
                        className="relative mb-24 cursor-pointer flex flex-col items-center"
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        onClick={() => setSelectedImage(couplePhoto)}
                    >
                        {/* Photo Container with Arch Mask Effect using Border Radius */}
                        <div className="p-3 bg-white shadow-lg rotate-1 transform hover:rotate-0 transition-transform duration-700 ease-out rounded-t-[100px] rounded-b-md relative">
                            <div className="overflow-hidden rounded-t-[90px] rounded-b-sm w-48 h-64 md:w-64 md:h-80 relative">
                                <img
                                    src={adventure.photo || couplePhoto}
                                    alt="Couple"
                                    className="w-full h-full object-cover sepia-[0.3]"
                                />
                                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-t-[90px] rounded-b-sm pointer-events-none"></div>
                                {/* Quote Overlay */}
                                <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
                                    <p className="font-serif text-[12px] text-white/90 italic drop-shadow-md">{adventure.photoQuote || '"The Beginning"'}</p>
                                </div>
                            </div>
                        </div>
                        {/* Click Hint */}
                        <p className="text-[#8a6b4e] text-xs font-serif italic opacity-70 mt-3">Click photo to zoom</p>

                        {/* Decorative Tape (CSS) */}
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-24 h-8 bg-white/80 rotate-2 shadow-sm border border-white/90"></div>
                    </motion.div>


                    {/* SECTION 2: OUR STORY */}
                    <motion.div
                        className="w-full max-w-2xl mx-auto mb-24 relative"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1 }}
                    >
                        {/* Header */}
                        <div className="flex flex-col items-center justify-center mb-8 md:mb-12">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3d2e20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-80">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            <h3 className="font-serif text-2xl md:text-4xl text-[#3d2e20] tracking-wide font-bold uppercase">
                                {story.title || "Our Story"}
                            </h3>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                            {/* Left Column: Polaroids */}
                            <div className="flex flex-col items-center">
                                <div className="relative w-64 h-64 md:w-72 md:h-72 flex-shrink-0 mb-2">
                                    {/* Photo 1 (Back) */}
                                    <motion.div
                                        className="absolute top-0 left-0 w-40 h-48 md:w-44 md:h-52 bg-white p-2 shadow-lg transform -rotate-6 z-10 cursor-pointer"
                                        whileHover={{ zIndex: 30, scale: 1.05, rotate: 0 }}
                                        onClick={() => setSelectedImage(couplePhoto)}
                                    >
                                        <img src={story.photo1 || couplePhoto} alt="Story 1" className="w-full h-[80%] object-cover sepia-[0.2]" />
                                        <div className="h-[20%] flex items-center justify-center">
                                            <p className="font-serif text-[10px] text-gray-500 italic rotate-1">{story.photo1Caption || "Paris, 2021"}</p>
                                        </div>
                                    </motion.div>

                                    {/* Photo 2 (Front) */}
                                    <motion.div
                                        className="absolute top-8 left-16 md:left-20 w-40 h-48 md:w-44 md:h-52 bg-white p-2 shadow-xl transform rotate-3 z-20 cursor-pointer"
                                        whileHover={{ zIndex: 30, scale: 1.05, rotate: 0 }}
                                        onClick={() => setSelectedImage(couplePhoto)}
                                    >
                                        <img src={story.photo2 || couplePhoto} alt="Story 2" className="w-full h-[80%] object-cover grayscale-[0.3]" />
                                        <div className="h-[20%] flex items-center justify-center">
                                            <p className="font-serif text-[10px] text-gray-800 italic -rotate-1">{story.photo2Caption || '"She said yes!"'}</p>
                                        </div>
                                    </motion.div>
                                </div>
                                <p className="text-[#8a6b4e] text-xs font-serif italic opacity-70 mt-2">Click photos to zoom</p>
                            </div>

                            {/* Right Column: Text - styled as Airmail Postcard */}
                            <div className="relative flex-1 transform rotate-1 transition-transform hover:rotate-0 duration-500">
                                {/* Airmail Border Background */}
                                <div className="absolute inset-0 bg-white shadow-xl rounded-sm z-0"
                                    style={{
                                        backgroundImage: `repeating-linear-gradient(135deg, #e74c3c 0px, #e74c3c 10px, #ffffff 10px, #ffffff 20px, #3498db 20px, #3498db 30px, #ffffff 30px, #ffffff 40px)`
                                    }}
                                >
                                    {/* Inner White Patch for Text */}
                                    <div className="absolute inset-[12px] bg-[#fbfbf8]"></div>
                                </div>

                                {/* Text Content */}
                                <div className="relative z-10 p-8 md:p-12 text-center md:text-left">
                                    {/* Postcard Header */}
                                    <div className="border-b-2 border-dashed border-gray-300 pb-4 mb-6 flex justify-between items-end">
                                        <span className="font-sans text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">Air Mail / Par Avion</span>
                                        <div className="w-16 h-12 border border-gray-300 opacity-30 rounded flex items-center justify-center text-[10px] text-gray-400 font-sans tracking-widest">STAMP</div>
                                    </div>

                                    <div className="font-serif text-[#2a1e10] text-base md:text-lg leading-relaxed space-y-4 font-medium whitespace-pre-line">
                                        <p>
                                            {story.text || "It all began with a shared love for vintage maps and coffee. What started as a chance encounter at a local cafe quickly turned into an adventure of a lifetime.\n\nFrom rainy days in London to sunny beaches in Bali, every moment has been a new discovery. We’ve traveled miles together, but our greatest journey is just beginning."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decor for Story Section */}
                        {/* Compass on Left (Desk) */}
                        <motion.div
                            className="absolute top-1/2 -left-[180px] w-40 h-40 hidden md:block z-0 pointer-events-none"
                            style={{ y: yParallax }}
                        >
                            <img src={compass} alt="Compass" className="w-full h-full object-contain opacity-90 drop-shadow-xl" />
                        </motion.div>

                        {/* REPLACED: Stamps on Right -> Telescope */}
                        <motion.div
                            className="absolute top-[-40px] -right-[60px] w-48 md:w-64 z-20 pointer-events-none rotate-[15deg] drop-shadow-2xl"
                        >
                            <img src={telescope} alt="Telescope" className="w-full h-full object-contain" />
                        </motion.div>

                    </motion.div>

                    {/* SECTION 3: THE DETAILS */}
                    <motion.div
                        className="w-full max-w-4xl mx-auto mb-20 md:mb-24 text-center mt-20 md:mt-32"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        {/* Header */}
                        <div className="flex flex-col items-center justify-center mb-10 md:mb-16">
                            <Calendar className="w-8 h-8 md:w-10 md:h-10 text-[#2a1e10] mb-3 md:mb-4 opacity-100" strokeWidth={1.5} />
                            <h3 className="font-serif text-3xl md:text-6xl text-[#2a1e10] tracking-wide font-bold uppercase mb-3 md:mb-4 drop-shadow-sm">
                                {details.title || "The Details"}
                            </h3>
                            <div className="w-24 md:w-32 h-[2px] bg-[#3d2e20] opacity-80"></div>
                        </div>

                        {/* 3-Column Icons Grid - CLEAN STYLE */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-16 md:mb-24 px-4 w-full max-w-5xl mx-auto">
                            {/* Ceremony */}
                            <div className="flex flex-col items-center text-center">
                                <Plane className="w-12 h-12 md:w-16 md:h-16 text-[#2a1e10] mb-3 md:mb-6 stroke-1.5" />
                                <h4 className="font-serif text-lg md:text-xl font-bold text-[#2a1e10] uppercase tracking-[0.15em] mb-2 md:mb-4">{details.ceremonyTitle || "Ceremony"}</h4>
                                <div className="space-y-1 md:space-y-2 mb-3 md:mb-4">
                                    <p className="font-serif text-base md:text-lg text-[#3d2e20] leading-relaxed font-semibold">{details.ceremonyLocation || "The Old Cathedral"}</p>
                                    <p className="font-serif text-sm md:text-base text-[#2a1e10] italic font-medium">{details.ceremonyAddress || "123 Heritage Lane, Kyoto"}</p>
                                    <p className="font-sans text-xs md:text-sm text-[#5c3d2e] font-bold uppercase tracking-wider pt-1 md:pt-2">{details.ceremonyTime || "14:00 PM"}</p>
                                </div>
                                <button
                                    onClick={() => window.open(details.ceremonyMapLink || 'https://www.google.com/maps', '_blank')}
                                    className="text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#5c3d2e] border-b border-[#5c3d2e]/50 hover:text-[#2a1e10] hover:border-[#2a1e10] transition-colors py-1"
                                >
                                    View Map
                                </button>
                            </div>

                            {/* Reception */}
                            <div className="flex flex-col items-center text-center">
                                <Users className="w-12 h-12 md:w-16 md:h-16 text-[#2a1e10] mb-3 md:mb-6 stroke-1.5" />
                                <h4 className="font-serif text-lg md:text-xl font-bold text-[#2a1e10] uppercase tracking-[0.15em] mb-2 md:mb-4">{details.receptionTitle || "Reception"}</h4>
                                <div className="space-y-1 md:space-y-2 mb-3 md:mb-4">
                                    <p className="font-serif text-base md:text-lg text-[#3d2e20] leading-relaxed font-semibold">{details.receptionLocation || "Traditional Ryokan"}</p>
                                    <p className="font-serif text-sm md:text-base text-[#2a1e10] italic font-medium">{details.receptionAddress || "Gion Ryokan, 456 Tea House Rd"}</p>
                                    <p className="font-sans text-xs md:text-sm text-[#5c3d2e] font-bold uppercase tracking-wider pt-1 md:pt-2">{details.receptionTime || "18:00 PM"}</p>
                                </div>
                                <button
                                    onClick={() => window.open(details.receptionMapLink || 'https://www.google.com/maps', '_blank')}
                                    className="text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#5c3d2e] border-b border-[#5c3d2e]/50 hover:text-[#2a1e10] hover:border-[#2a1e10] transition-colors py-1"
                                >
                                    View Map
                                </button>
                            </div>

                            {/* Hotel */}
                            <div className="flex flex-col items-center text-center">
                                <Globe className="w-12 h-12 md:w-16 md:h-16 text-[#2a1e10] mb-3 md:mb-6 stroke-1.5" />
                                <h4 className="font-serif text-lg md:text-xl font-bold text-[#2a1e10] uppercase tracking-[0.15em] mb-2 md:mb-4">{details.hotelTitle || "Hotel"}</h4>
                                <div className="space-y-1 md:space-y-2 mb-3 md:mb-4">
                                    <p className="font-serif text-base md:text-lg text-[#3d2e20] leading-relaxed font-semibold">{details.hotelLocation || "Four Seasons"}</p>
                                    <p className="font-serif text-sm md:text-base text-[#2a1e10] italic font-medium">{details.hotelAddress || "789 Higashiyama Ward"}</p>
                                    <p className="font-sans text-xs md:text-sm text-[#5c3d2e] font-bold uppercase tracking-wider pt-1 md:pt-2">{details.hotelNote || "Code: LOVE24"}</p>
                                </div>
                                <button
                                    onClick={() => window.open(details.hotelMapLink || 'https://www.google.com/maps', '_blank')}
                                    className="text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#5c3d2e] border-b border-[#5c3d2e]/50 hover:text-[#2a1e10] hover:border-[#2a1e10] transition-colors py-1"
                                >
                                    View Map
                                </button>
                            </div>
                        </div>

                        {/* RSVP Section - Split Layout */}
                        <div className="w-full max-w-5xl mx-auto mt-24 px-4 md:px-8 flex flex-col md:flex-row shadow-none relative z-10 items-start">

                            {/* Left Side: Text & Title */}
                            <div className="w-full md:w-1/2 text-center md:text-left pt-0 md:pt-8 pr-0 md:pr-12 mb-12 md:mb-0">
                                <div className="flex flex-col md:flex-row items-center gap-4 mb-6 justify-center md:justify-start">
                                    <div className="p-2 border-2 border-[#2a1e10] rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2a1e10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M11.5 14H19"></path><path d="M15.5 17H19"></path><path d="m9 17 2-5-3-3"></path></svg>
                                    </div>
                                    <h3 className="font-serif text-5xl text-[#2a1e10] font-bold uppercase tracking-wide">{rsvp.title || "RSVP"}</h3>
                                </div>
                                <p className="font-serif text-[#3d2e20] text-lg leading-relaxed mb-6 italic whitespace-pre-line">
                                    {rsvp.description || '"We would be honored to have you join us on this special day. Please let us know if you can make it."'}
                                </p>
                                <p className="font-serif text-[#5c3d2e] text-sm font-bold uppercase tracking-widest">
                                    {rsvp.deadline || "Kindly reply by June 1st"}
                                </p>
                            </div>

                            {/* Right Side: The Card */}
                            <div className="w-full md:w-1/2 relative">
                                {/* Leather Straps - Repositioned to overlap card */}
                                <div className="absolute -bottom-6 -left-10 w-24 md:w-32 z-20 pointer-events-none transform rotate-[-15deg] drop-shadow-lg">
                                    <img src={leatherStraps} alt="Leather Straps" className="w-full h-full object-contain" />
                                </div>

                                <div className="bg-[#eaddcf] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.2)] rounded-sm border-2 border-[#2a1e10] relative transform rotate-1 md:rotate-2">
                                    <h4 className="font-serif text-xl text-[#3d2e20] font-bold uppercase text-center mb-6 tracking-wider">{rsvp.formTitle || "Confirm Your Seat"}</h4>

                                    <form className="space-y-5" onSubmit={handleRSVPSubmit}>
                                        {/* Guest Name */}
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Guest Name"
                                                value={rsvpForm.name}
                                                onChange={(e) => setRsvpForm(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full bg-[#f4f2e9]/50 border border-[#d6cbb0] p-3 font-serif text-[#3d2e20] focus:outline-none focus:border-[#8a6b4e] rounded-sm placeholder:text-[#3d2e20]/60"
                                                required
                                            />
                                        </div>

                                        {/* Attendance Toggle */}
                                        <div className="flex gap-4 font-serif">
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <div className={`w-4 h-4 rounded-full border border-[#8a6b4e] flex items-center justify-center transition-colors ${rsvpForm.attending ? 'bg-[#5c4033] border-[#5c4033]' : 'bg-transparent'}`}>
                                                    {rsvpForm.attending && <div className="w-1.5 h-1.5 bg-[#f4ebd0] rounded-full" />}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="attending"
                                                    checked={rsvpForm.attending}
                                                    onChange={() => setRsvpForm(prev => ({ ...prev, attending: true }))}
                                                    className="hidden"
                                                />
                                                <span className={`text-[#3d2e20] text-sm uppercase tracking-wider font-bold group-hover:text-[#5c4033] transition-colors`}>Joyfully Accept</span>
                                            </label>

                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <div className={`w-4 h-4 rounded-full border border-[#8a6b4e] flex items-center justify-center transition-colors ${!rsvpForm.attending ? 'bg-[#5c4033] border-[#5c4033]' : 'bg-transparent'}`}>
                                                    {!rsvpForm.attending && <div className="w-1.5 h-1.5 bg-[#f4ebd0] rounded-full" />}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="attending"
                                                    checked={!rsvpForm.attending}
                                                    onChange={() => setRsvpForm(prev => ({ ...prev, attending: false }))}
                                                    className="hidden"
                                                />
                                                <span className={`text-[#3d2e20] text-sm uppercase tracking-wider font-bold group-hover:text-[#5c4033] transition-colors`}>Regretfully Decline</span>
                                            </label>
                                        </div>

                                        {/* Guest Count - Only Show if Attending */}
                                        <AnimatePresence>
                                            {rsvpForm.attending && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <span className="font-serif text-[#3d2e20] text-sm uppercase tracking-wider font-bold whitespace-nowrap">Number of Guests:</span>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max="10"
                                                            value={rsvpForm.guestCount}
                                                            onChange={(e) => setRsvpForm(prev => ({ ...prev, guestCount: parseInt(e.target.value) || 1 }))}
                                                            className="w-16 bg-[#f4f2e9]/50 border border-[#d6cbb0] p-2 font-serif text-[#3d2e20] focus:outline-none focus:border-[#8a6b4e] rounded-sm text-center"
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="pt-4 flex items-center justify-between relative">
                                            <button
                                                type="submit"
                                                disabled={status === 'loading' || status === 'success'}
                                                className="px-8 py-3 bg-[#5c4033] text-[#f4ebd0] font-serif uppercase tracking-widest text-xs font-bold rounded-sm shadow-md hover:bg-[#4a332a] transition-colors disabled:opacity-70"
                                            >
                                                {status === 'loading' ? 'Sending...' : status === 'success' ? 'Sent!' : 'Book Now'}
                                            </button>

                                            {status === 'error' && <p className="text-red-800 text-xs font-serif absolute -bottom-6 left-0">Failed to send.</p>}

                                            {/* Wax Seal */}
                                            <div className="absolute -right-8 -bottom-8 w-20 h-20 drop-shadow-xl transform rotate-12">
                                                <img src={waxSeal} alt="Seal" className="w-full h-full object-contain" />
                                            </div>
                                        </div>
                                    </form>

                                </div>
                            </div>

                        </div>

                    </motion.div>

                    {/* SECTION 4: THANK YOU */}
                    <motion.div
                        className="w-full max-w-lg mx-auto text-center mt-32 mb-32 pb-20"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 border-2 border-[#2a1e10] rounded-full flex items-center justify-center relative opacity-90">
                                <Plane className="w-10 h-10 text-[#2a1e10] transform -rotate-45" strokeWidth={1.5} />
                                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-[8px] font-sans uppercase tracking-widest text-[#2a1e10] font-bold">Air Mail</div>
                                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-[8px] font-sans uppercase tracking-widest text-[#2a1e10] font-bold">Est. 2024</div>
                            </div>
                        </div>

                        <h3 className="font-serif text-4xl text-[#1a120b] font-bold uppercase tracking-widest mb-4 drop-shadow-sm">
                            {thankYou.title || "Thank You"}
                        </h3>
                        <div className="w-24 h-[2px] bg-[#2a1e10] mx-auto mb-6"></div>
                        <p className="font-serif text-[#2a1e10] text-lg md:text-xl italic leading-relaxed whitespace-pre-line font-medium">
                            {thankYou.message || '"The greatest journey is the one that leads us home."'}
                        </p>
                        <p className="font-serif text-[#3d2e20] text-sm mt-4 uppercase tracking-widest font-bold">
                            {thankYou.signOff || "- With Love, The Couple -"}
                        </p>
                    </motion.div>

                </div>
            </div>

            {/* LAYER 4: Overlay Decor Elements (Top of everything) */}
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.8, type: "spring", stiffness: 50 }}
                style={{ y: yParallax, rotate: compassRotate }}
                className="absolute top-[200px] right-[-10px] md:right-[20%] w-32 h-32 md:w-64 md:h-64 z-20 pointer-events-none drop-shadow-2xl"
            >
                <img src={compass} alt="Compass" className="w-full h-full object-contain" />
            </motion.div>

            {/* Stamps - On Paper (Left Side - moved down) */}
            <motion.div
                initial={{ scale: 2, opacity: 0, rotate: 10 }}
                whileInView={{ scale: 1, opacity: 0.95, rotate: -5 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
                className="absolute top-[400px] left-[5%] md:left-[22%] w-[100px] md:w-[160px] z-20 drop-shadow-md pointer-events-none"
            >
                <img src={stamps} alt="Vintage Stamps" className="w-full h-auto" />
            </motion.div>

            {/* Removed Bottom Telescope from here since it's now top right */}

            {/* Lightbox Portal */}
            <AnimatePresence>
                {selectedImage && createPortal(
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, rotate: -5 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0.8, rotate: 5 }}
                            className="relative max-w-4xl max-h-[90vh] bg-white p-4 shadow-2xl rounded-sm"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                        >
                            <img src={selectedImage} alt="Full size" className="max-w-full max-h-[80vh] object-contain" />
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-10 right-0 text-white hover:text-gray-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                            <div className="mt-4 text-center font-serif text-gray-800 italic">
                                "Every journey begins with a single step."
                            </div>
                        </motion.div>
                    </motion.div>,
                    document.body
                )}
            </AnimatePresence>
        </div>
    );
};

export default JourneyScroll;
