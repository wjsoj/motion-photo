import React from 'react';
import { useLivePhoto } from './useLivePhoto';
import type { MotionPhotoInput, LivePhotoConfig, PlayerState } from '../core';

interface LivePhotoProps {
  src: MotionPhotoInput;
  config?: Partial<LivePhotoConfig>;
  className?: string;
  style?: React.CSSProperties;
  children?: (renderProps: RenderProps) => React.ReactNode;
}

interface RenderProps {
  state: PlayerState;
  imgSrc: string;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  handlers: Record<string, (...args: any[]) => void>;
  play: () => void;
  pause: () => void;
}

export function LivePhoto({
  src,
  config,
  className,
  style,
  children,
}: LivePhotoProps) {
  const hook = useLivePhoto({ src, ...config });

  if (children) {
    return (
      <>
        {children({
          state: hook.state,
          imgSrc: hook.parsedData?.imageSrc || '',
          videoRef: hook.videoRef,
          handlers: hook.handlers,
          play: hook.play,
          pause: hook.pause,
        })}
      </>
    );
  }

  return (
    <div
      className={`live-photo ${className || ''}`}
      style={style}
      {...hook.handlers}
    >
      <img
        src={hook.parsedData?.imageSrc}
        alt=""
        style={{ display: 'block' }}
      />
      {hook.parsedData?.hasVideo && (
        <video
          ref={hook.videoRef}
          src={hook.parsedData.videoSrc ?? undefined}
          muted={config?.muted ?? true}
          loop={config?.loop ?? true}
          playsInline
          style={{ display: 'none' }}
        />
      )}
      {config?.showLiveBadge !== false && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            background: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          {config?.liveBadgeText || 'LIVE'}
        </div>
      )}
    </div>
  );
}
