import React from 'react';

interface LotusIconProps {
  size?: number;
  opacity?: number;
  spin?: boolean;
}

export const LotusIcon: React.FC<LotusIconProps> = ({
  size = 64,
  opacity = 0.4,
  spin = false
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      style={{ opacity }}
      className={spin ? 'animate-spin-slow' : ''}
    >
      {Array.from({ length: 8 }, (_, t) => (
        <ellipse
          key={t}
          cx="32"
          cy="39"
          rx="6"
          ry="17"
          fill="#d4a050"
          fillOpacity="0.25"
          transform={`rotate(${t * 45} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="6" fill="#d4a050" fillOpacity="0.55" />
      <circle cx="32" cy="32" r="3" fill="#e8c97a" fillOpacity="0.8" />
    </svg>
  );
};
