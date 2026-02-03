import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-stone-900/60 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl ${className}`}>
      {children}
    </div>
  );
};


