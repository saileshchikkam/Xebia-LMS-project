import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface XebiaLiveBackgroundProps {
  className?: string;
  variant?: 'dark' | 'light' | 'subtle';
  interactive?: boolean;
}

export default function XebiaLiveBackground({
  className = '',
  variant = 'dark',
  interactive = true
}: XebiaLiveBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized mouse positions (-0.5 to 0.5)
      setMousePosition({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  // Determine styles based on variant
  const bgClass = variant === 'dark' 
    ? 'bg-gradient-to-br from-[#09080E] via-[#1A0E1F] to-[#040106]' 
    : variant === 'subtle' 
    ? 'bg-transparent'
    : 'bg-gradient-to-br from-purple-50/20 via-slate-50/30 to-slate-100/40';

  return (
    <div className={`absolute inset-0 overflow-hidden select-none pointer-events-none z-0 ${bgClass} ${className}`}>
      
      {/* Dynamic Ambient Background Glows */}
      <motion.div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] mix-blend-screen opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(203,46,186,0.35) 0%, rgba(203,46,186,0.05) 70%, rgba(0,0,0,0) 100%)',
          top: '10%',
          right: '5%',
        }}
        animate={interactive ? {
          x: mousePosition.x * 50,
          y: mousePosition.y * 50,
        } : {}}
        transition={{ type: 'spring', stiffness: 40, damping: 15 }}
      />

      <motion.div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[140px] mix-blend-screen opacity-35 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(203,46,186,0.2) 0%, rgba(203,46,186,0.02) 80%, rgba(0,0,0,0) 100%)',
          bottom: '-10%',
          left: '5%',
        }}
        animate={interactive ? {
          x: mousePosition.x * -60,
          y: mousePosition.y * -60,
        } : {}}
        transition={{ type: 'spring', stiffness: 40, damping: 15 }}
      />

      {/* Grid Pattern overlays for depth */}
      <div 
        className={`absolute inset-0 opacity-[0.06] ${variant === 'dark' ? 'bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,#cb2eba_1px,transparent_1px),linear-gradient(to_bottom,#cb2eba_1px,transparent_1px)]'} bg-[size:4rem_4rem]`}
        style={{
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 60%, transparent 100%)'
        }}
      />

      {/* Futuristic Curved Ribbon Path Animations */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient-neon-pink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#681D5F" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#D946EF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#681D5F" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="gradient-neon-blue" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#681D5F" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="gradient-orange-red" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#681D5F" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#EF4444" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6D1563" stopOpacity="0" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Curved Path 1 (Pink Wave) */}
        <motion.path
          d="M -100 400 Q 300 150 700 500 T 1600 200"
          fill="none"
          stroke="url(#gradient-neon-pink)"
          strokeWidth="3.5"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0.3 }}
          animate={{ 
            pathLength: [0.9, 1.1, 0.9],
            pathOffset: [0, 1, 2],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />

        {/* Curved Path 2 (Blue/Purple Wave) */}
        <motion.path
          d="M 100 600 Q 500 200 1000 550 T 1800 350"
          fill="none"
          stroke="url(#gradient-neon-blue)"
          strokeWidth="2.5"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0.2 }}
          animate={{ 
            pathLength: [0.8, 1, 0.8],
            pathOffset: [0, -1, -2],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 22, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />

        {/* Curved Path 3 (Orange/Red Accent) */}
        <motion.path
          d="M -50 250 Q 400 450 900 100 T 1700 450"
          fill="none"
          stroke="url(#gradient-orange-red)"
          strokeWidth="4"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0.2 }}
          animate={{ 
            pathLength: [0.9, 1.2, 0.9],
            pathOffset: [0, 1.5, 3],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />

        {/* Decorative Floating Dots / Tech Constellations */}
        <g fill={variant === 'dark' ? '#ffffff' : '#cb2eba'} opacity="0.15">
          <circle cx="15%" cy="25%" r="1.5" />
          <circle cx="45%" cy="75%" r="2" />
          <circle cx="75%" cy="35%" r="1" />
          <circle cx="85%" cy="80%" r="2.5" />
          <circle cx="30%" cy="45%" r="1.5" />
          <circle cx="60%" cy="15%" r="2" />
        </g>
      </svg>

      {/* Floating Animated Digital Sparkles */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${variant === 'dark' ? 'bg-white' : 'bg-[#681D5F]'}`}
            style={{
              top: `${20 + (i * 12)}%`,
              left: `${15 + (i * 15) + (Math.sin(i) * 5)}%`,
              opacity: 0.3,
              boxShadow: variant === 'dark' ? '0 0 10px rgba(255,255,255,0.8)' : '0 0 10px rgba(203,46,186,0.8)'
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

    </div>
  );
}
