import React from 'react';

interface XebiaLogoProps {
  className?: string;
  textColor?: string;
  height?: number;
  iconOnly?: boolean;
  variant?: 'wordmark' | 'square-icon' | 'badge';
}

export default function XebiaLogo({
  className = '',
  textColor = '#831B84',
  height = 24,
  iconOnly = false,
  variant = 'wordmark'
}: XebiaLogoProps) {
  const isWhite = textColor === '#FFFFFF' || textColor === 'white' || textColor?.toLowerCase() === '#fff';

  // Apply CSS filters to achieve white color variant if requested on dark background
  const filterStyle = isWhite ? { filter: 'brightness(0) invert(1)' } : undefined;

  if (variant === 'square-icon') {
    return (
      <div 
        className={`flex items-center justify-center rounded-xl overflow-hidden shrink-0 bg-[#831B84] ${className}`}
        style={{ width: height, height: height }}
      >
        <img 
          src="https://xebia-enterprise-lms.vercel.app/assets/logo-purple-BChHg7OV.png"
          alt="Xebia Icon"
          className="h-[60%] w-[60%] object-contain"
          style={{ filter: 'brightness(0) invert(1)' }}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  if (iconOnly) {
    // Elegant crop to isolate the iconic "X" logo mark on the left
    return (
      <div 
        className={`inline-block relative overflow-hidden shrink-0 ${className}`} 
        style={{ width: `${height * 1.1}px`, height: `${height}px` }}
      >
        <img 
          src="https://xebia-enterprise-lms.vercel.app/assets/logo-purple-BChHg7OV.png"
          alt="Xebia Icon Only"
          className="absolute left-0 top-0 h-full max-w-none"
          style={{ 
            width: `${height * 3.4}px`, 
            objectFit: 'cover', 
            objectPosition: 'left center',
            ...filterStyle
          }}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <img 
      src="https://xebia-enterprise-lms.vercel.app/assets/logo-purple-BChHg7OV.png"
      alt="Xebia Logo"
      className={`inline-block shrink-0 object-contain ${className}`}
      style={{ 
        height: `${height}px`, 
        width: 'auto',
        ...filterStyle 
      }}
      referrerPolicy="no-referrer"
    />
  );
}

