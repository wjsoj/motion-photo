import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { MotionPhotoInput, PlayerState } from '../core';
import { applyThemeToContainer, injectStyles } from '../styles';
import { ErrorIcon, LiveBadgeIcon, PauseIcon, PlayIcon, RingBadgeIcon, VolumeIcon } from './icons';
import type { ReactLivePhotoConfig } from './types';
import { useLivePhoto } from './useLivePhoto';

interface LivePhotoProps {
  src: MotionPhotoInput;
  config?: Partial<ReactLivePhotoConfig>;
  className?: string;
  style?: React.CSSProperties;
  children?: (renderProps: RenderProps) => React.ReactNode;
}

interface RenderProps {
  state: PlayerState;
  imgSrc: string;
  videoRef: (el: HTMLVideoElement | null) => void;
  handlers: Record<string, (...args: unknown[]) => void>;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  mute: (isMuted: boolean) => void;
  error: Error | null;
}

function DefaultLoadingComponent(): React.ReactElement {
  return (
    <div className="live-photo__loading">
      <div className="live-photo__loading-spinner" />
    </div>
  );
}

interface DefaultErrorProps {
  error: Error;
  retry?: () => void;
}

function DefaultErrorComponent({ error, retry }: DefaultErrorProps): React.ReactElement {
  return (
    <div className="live-photo__error">
      <div className="live-photo__error-icon">
        <ErrorIcon size={32} />
      </div>
      <span className="live-photo__error-message">{error.message || 'Failed to load'}</span>
      {retry && (
        <button className="live-photo__error-retry" onClick={retry} type="button">
          Retry
        </button>
      )}
    </div>
  );
}

export function LivePhoto({ src, config, className, style, children }: LivePhotoProps) {
  const hook = useLivePhoto({ src, ...config });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(config?.muted ?? true);

  useEffect(() => {
    injectStyles();
  }, []);

  useEffect(() => {
    if (containerRef.current && config?.theme) {
      applyThemeToContainer(containerRef.current, config.theme);
    }
  }, [config?.theme]);

  function handleMuteToggle(): void {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    hook.mute(newMuted);
  }

  function handleRetry(): void {
    hook.play();
  }

  const badgeClasses = useMemo(() => {
    const badgeStyle = config?.liveBadgeStyle;
    const classes = ['live-badge'];
    classes.push(`live-badge--${config?.liveBadgePosition || 'top-left'}`);
    classes.push(`live-badge--${badgeStyle?.size || 'md'}`);
    classes.push(`live-badge--${badgeStyle?.style || 'concentric'}`);
    if (badgeStyle?.animation !== false) {
      classes.push('live-badge--animated');
    }
    return classes.join(' ');
  }, [config?.liveBadgePosition, config?.liveBadgeStyle]);

  const containerClasses = useMemo(() => {
    const classes = ['live-photo'];
    if (className) classes.push(className);
    if (hook.state === 'playing') classes.push('live-photo--playing');
    if (hook.state === 'paused') classes.push('live-photo--paused');
    if (hook.state === 'ready') classes.push('live-photo--ready');
    if (hook.state === 'parsing') classes.push('live-photo--loading');
    if (hook.state === 'error') classes.push('live-photo--error');
    return classes.join(' ');
  }, [hook.state, className]);

  const showMuteButton =
    config?.showMuteButton === 'auto'
      ? hook.parsedData?.hasVideo && hook.parsedData?.videoSrc
      : config?.showMuteButton;

  function renderBadge(): React.ReactNode {
    if (!config?.showLiveBadge || !hook.parsedData?.hasVideo) return null;

    const badgeStyle = config?.liveBadgeStyle?.style || 'concentric';
    const badgeSize = config?.liveBadgeStyle?.size || 'md';
    const iconSize = badgeSize === 'sm' ? 16 : badgeSize === 'lg' ? 24 : 20;

    function handleBadgeClick(e: React.MouseEvent): void {
      e.stopPropagation();
      hook.play();
    }

    return (
      <button
        type="button"
        className={badgeClasses}
        onClick={handleBadgeClick}
        style={{ cursor: 'pointer' }}
        aria-label="Play live photo"
      >
        {badgeStyle === 'concentric' && (
          <span className="live-badge__rings">
            <span className="live-badge__ring live-badge__ring--inner" />
            <span className="live-badge__ring live-badge__ring--middle" />
            <span className="live-badge__ring live-badge__ring--outer" />
          </span>
        )}
        {badgeStyle === 'icon' && (
          <span className="live-badge__icon">
            <LiveBadgeIcon size={iconSize} />
          </span>
        )}
        {badgeStyle === 'ring' && (
          <span className="live-badge__icon">
            <RingBadgeIcon size={iconSize} />
          </span>
        )}
        {badgeStyle !== 'icon' && (
          <span className="live-badge__text">{config?.liveBadgeText || 'LIVE'}</span>
        )}
      </button>
    );
  }

  function renderLoading(): React.ReactNode {
    const customLoading = config?.components?.loading;
    if (!customLoading) return <DefaultLoadingComponent />;

    if (typeof customLoading === 'function') {
      const Comp = customLoading as React.ComponentType<{ progress?: number }>;
      return <Comp progress={undefined} />;
    }
    if (typeof customLoading === 'string') {
      return React.createElement(customLoading, { progress: undefined });
    }
    if ('render' in customLoading) {
      return customLoading.render({ progress: undefined });
    }
    return <DefaultLoadingComponent />;
  }

  function renderError(): React.ReactNode {
    const customError = config?.components?.error;
    const errorValue = hook.error ?? new Error('Unknown error');

    if (!customError) return <DefaultErrorComponent error={errorValue} retry={handleRetry} />;

    if (typeof customError === 'function') {
      const Comp = customError as React.ComponentType<{ error: Error; retry?: () => void }>;
      return <Comp error={errorValue} retry={handleRetry} />;
    }
    if (typeof customError === 'string') {
      return React.createElement(customError, { error: errorValue, retry: handleRetry });
    }
    if ('render' in customError) {
      return customError.render({ error: errorValue, retry: handleRetry });
    }
    return <DefaultErrorComponent error={errorValue} retry={handleRetry} />;
  }

  function renderPlayPauseIndicator(): React.ReactNode {
    if (!config?.showPlayPauseIndicator || config?.playPauseIndicatorStyle === 'none') {
      return null;
    }

    const isPlaying = hook.state === 'playing';
    const rippleClass =
      config?.playPauseIndicatorStyle === 'ripple' ? 'live-photo__play-pause--ripple' : '';

    return (
      <div className={`live-photo__play-pause ${rippleClass}`}>
        {isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
      </div>
    );
  }

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
          toggle: hook.toggle,
          mute: hook.mute,
          error: hook.error,
        })}
      </>
    );
  }

  const muteButtonVisible =
    hook.state === 'playing' || hook.state === 'paused' ? 'live-photo__mute-btn--visible' : '';

  return (
    <div ref={containerRef} className={containerClasses} style={style} {...hook.handlers}>
      {hook.parsedData?.imageSrc && (
        <img
          className="live-photo__img"
          src={hook.parsedData.imageSrc}
          alt={config?.ariaLabel || 'Live Photo'}
          draggable={false}
        />
      )}

      {hook.parsedData?.hasVideo && hook.parsedData.videoSrc && (
        <video
          ref={hook.videoRef}
          className="live-photo__video"
          src={hook.parsedData.videoSrc}
          muted={isMuted}
          loop={config?.loop ?? false}
          playsInline
        />
      )}

      {renderBadge()}
      {renderPlayPauseIndicator()}

      {showMuteButton && hook.parsedData?.hasVideo && (
        <button
          type="button"
          className={`live-photo__mute-btn ${muteButtonVisible}`}
          onClick={(e) => {
            e.stopPropagation();
            handleMuteToggle();
          }}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          <VolumeIcon size={20} muted={isMuted} />
        </button>
      )}

      {hook.state === 'parsing' && renderLoading()}
      {hook.state === 'error' && renderError()}
    </div>
  );
}

export default LivePhoto;
