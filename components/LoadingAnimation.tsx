'use client';

import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

interface LoadingAnimationProps {
  size?: number;
  className?: string;
}

export default function LoadingAnimation({ size = 120, className = '' }: LoadingAnimationProps) {
  const { rive, RiveComponent } = useRive({
    src: '/animations/vault22_logo_animations.riv',
    autoplay: true,
    loop: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    onLoadError: (error) => {
      console.error('Rive animation load error:', error);
    },
    onLoad: () => {
      console.log('Rive animation loaded successfully');
    },
  });

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div style={{ width: size, height: size }}>
        <RiveComponent style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}
