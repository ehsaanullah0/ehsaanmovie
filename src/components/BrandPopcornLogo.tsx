import React from 'react';
import { BrandClapperboardLogo } from './BrandClapperboardLogo';

interface BrandPopcornLogoProps {
  className?: string;
  size?: number;
  variant?: 'app-icon' | 'badge' | 'minimal';
}

/**
 * Re-exported as BrandPopcornLogo for backward compatibility across all modules,
 * rendering the official new Minimalist Cinematic Clapperboard Icon logo.
 */
export const BrandPopcornLogo: React.FC<BrandPopcornLogoProps> = ({
  className = '',
  size = 36,
  variant = 'app-icon',
}) => {
  return (
    <BrandClapperboardLogo
      className={className}
      size={size}
      variant={variant}
    />
  );
};

export { BrandClapperboardLogo };
export default BrandPopcornLogo;
