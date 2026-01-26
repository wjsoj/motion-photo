import { LivePhotoConfig } from './types';

export function getDefaultConfig(): LivePhotoConfig {
  return {
    // Playback
    trigger: 'click',
    longPressDelay: 500,
    autoReplay: false,
    replayDelay: 2000,

    // Transitions
    fadeDuration: 300,

    // Audio
    muted: true,
    showMuteButton: 'auto',

    // Video
    loop: true,

    // UI
    showLiveBadge: true,
    liveBadgePosition: 'top-left',
    liveBadgeText: 'LIVE',

    // Callbacks
    onStateChange: undefined,
    onPlay: undefined,
    onPause: undefined,
    onError: undefined,
    onEnded: undefined,
  };
}
