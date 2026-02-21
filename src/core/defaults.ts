import type { LivePhotoConfig } from './types';

export function getDefaultConfig(): LivePhotoConfig {
  return {
    trigger: 'manual',
    longPressDelay: 500,
    autoReplay: false,
    replayDelay: 2000,
    playOnceOnLoad: true,
    fadeDuration: 300,
    muted: true,
    showMuteButton: 'auto',
    loop: false,
    showLiveBadge: true,
    liveBadgePosition: 'top-left',
    liveBadgeText: 'LIVE',
    liveBadgeStyle: {
      style: 'concentric',
      size: 'md',
      animation: true,
    },
    theme: {
      variant: 'auto',
    },
    showPlayPauseIndicator: false,
    playPauseIndicatorStyle: 'icon',
    ariaLabel: 'Live Photo',
    role: 'button',
  };
}
