import React from 'react';

interface XebiaLogoProps {
  className?: string;
  textColor?: string;
  height?: number;
  iconOnly?: boolean;
  variant?: 'wordmark' | 'square-icon' | 'badge' | 'pebble';
  onClick?: () => void;
}

export default function XebiaLogo({
  className = '',
  textColor = '#FFFFFF',
  height = 42,
  iconOnly = false,
  variant = 'pebble',
  onClick
}: XebiaLogoProps) {
  // Organic high-fidelity pebble path representing the logo container from the image
  const pebblePath = "M 32 90 C 25 45, 62 12, 115 15 C 175 18, 212 42, 208 95 C 204 145, 168 168, 110 162 C 55 156, 38 135, 32 90 Z";

  // High-fidelity slanted "X" path from official logo
  const xPath = "M 10 18 L 18 10 L 32 21 L 46 10 L 54 18 L 43 29 L 54 40 L 46 48 L 32 37 L 18 48 L 10 40 L 21 29 Z";

  if (iconOnly) {
    return (
      <svg
        onClick={onClick}
        className={`inline-block shrink-0 ${className} select-none`}
        style={{ height: `${height}px`, width: `${height * 1.15}px`, cursor: onClick ? 'pointer' : 'default' }}
        viewBox="10 10 110 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        id="xebia-logo-icon-only"
      >
        <path
          d="M 15 55 C 12 28, 35 8, 65 10 C 95 12, 110 28, 108 58 C 106 88, 88 102, 58 98 C 28 94, 18 82, 15 55 Z"
          fill="#681D5F"
        />
        <g transform="translate(30, 27) scale(0.9)">
          <path
            d={xPath}
            fill="#FFFFFF"
          />
        </g>
      </svg>
    );
  }

  return (
    <svg
      onClick={onClick}
      className={`inline-block shrink-0 ${className} select-none`}
      style={{ height: `${height}px`, width: `${height * 1.22}px`, cursor: onClick ? 'pointer' : 'default' }}
      viewBox="20 10 200 162"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      id="xebia-logo-pebble"
    >
      <path
        d={pebblePath}
        fill="#681D5F"
      />
      <g transform="translate(52, 66) scale(0.66)">
        <path
          d={xPath}
          fill="#FFFFFF"
        />
        <path
          d="M 80 20 C 73.37 20 68 25.37 68 32 C 68 38.63 73.37 44 80 44 C 85.3 44 89.7 40.5 91.2 35.5 L 85.3 35.5 C 84.2 37.5 82.3 38.8 80 38.8 C 76.2 38.8 73.2 35.8 73.2 32 L 91.8 32 C 91.9 31.5 92 30.8 92 30 C 92 24.5 86.5 20 80 20 Z M 73.3 27.2 C 74.5 24.5 77.1 22.8 80 22.8 C 84.4 22.8 86.6 25.6 86.8 27.2 L 73.3 27.2 Z"
          fill="#FFFFFF"
        />
        <path
          d="M 98 4 L 103.2 4 L 103.2 21.5 C 105.5 20.5 108.5 20 111.5 20 C 117.5 20 123 25 123 32 C 123 39 117.5 44 111.5 44 C 108.5 44 105.5 43.5 103.2 42.5 L 103.2 44 L 98 44 Z M 110.5 24.8 C 106.5 24.8 103.2 28 103.2 32 C 103.2 36 106.5 39.2 110.5 39.2 C 114.5 39.2 117.8 36 117.8 32 C 117.8 28 114.5 24.8 110.5 24.8 Z"
          fill="#FFFFFF"
        />
        <path
          d="M 129 20 H 134.5 V 44 H 129 Z M 129 8 H 134.5 V 13.5 H 129 Z"
          fill="#FFFFFF"
        />
        <path
          d="M 159.8 20 L 159.8 21.5 C 157.5 20.5 154.5 20 151.5 20 C 145.5 20 140 25 140 32 C 140 39 145.5 44 151.5 44 C 154.5 44 157.5 43.5 159.8 42.5 L 159.8 44 L 165 44 L 165 20 Z M 152.5 24.8 C 156.5 24.8 159.8 28 159.8 32 C 159.8 36 156.5 39.2 152.5 39.2 C 148.5 39.2 145.2 36 145.2 32 C 145.2 28 148.5 24.8 152.5 24.8 Z"
          fill="#FFFFFF"
        />
      </g>
    </svg>
  );
}
