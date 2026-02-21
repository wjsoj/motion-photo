// Player state machine states
export type PlayerState =
  | 'idle' // Initial state
  | 'parsing' // Extracting video from Motion Photo
  | 'ready' // Parsed and ready to play
  | 'playing' // Currently playing video
  | 'paused' // Video paused
  | 'error'; // Error occurred

// Input types
export type MotionPhotoInput =
  | string // URL to Motion Photo
  | File // File object
  | Blob // Blob object
  | { imgSrc: string; videoSrc: string }; // iPhone Live Photo

// Event types
export type PlayerEvent = 'stateChange' | 'load' | 'play' | 'pause' | 'error' | 'ended';

// Badge style types
export type LiveBadgeStyle = 'text' | 'icon' | 'ring' | 'concentric';
export type ThemeVariant = 'light' | 'dark' | 'auto';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type PlayPauseIndicatorStyle = 'icon' | 'ripple' | 'none';

// Badge style configuration
export interface LiveBadgeStyleConfig {
  style: LiveBadgeStyle;
  color?: string;
  backgroundColor?: string;
  size?: BadgeSize;
  animation?: boolean;
}

// Theme configuration
export interface ThemeConfig {
  variant: ThemeVariant;
  cssVariables?: Partial<Record<string, string>>;
}

// Configuration interface with sensible defaults
export interface LivePhotoConfig {
  // Playback trigger
  trigger: 'click' | 'hover' | 'manual';

  // Mobile-specific
  longPressDelay: number;

  // Auto-replay
  autoReplay: boolean;
  replayDelay: number;

  // Auto-play once on load (plays once when ready, then waits for user interaction)
  playOnceOnLoad: boolean;

  // Transitions
  fadeDuration: number;

  // Audio
  muted: boolean;
  showMuteButton: boolean | 'auto';

  // Video
  loop: boolean;

  // UI - Badge
  showLiveBadge: boolean;
  liveBadgePosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  liveBadgeText: string;
  liveBadgeStyle?: LiveBadgeStyleConfig;

  // UI - Theme
  theme?: ThemeConfig;

  // UI - Play/Pause indicator
  showPlayPauseIndicator?: boolean;
  playPauseIndicatorStyle?: PlayPauseIndicatorStyle;

  // UI - Accessibility
  ariaLabel?: string;
  role?: string;

  // Callbacks
  onStateChange?: (state: PlayerState) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onError?: (error: Error) => void;
  onEnded?: () => void;
}

// Parser result
export interface ParsedMotionPhoto {
  imageSrc: string;
  videoSrc: string | null;
  hasVideo: boolean;
}

// Player interface
export interface ILivePhotoPlayer {
  readonly state: PlayerState;
  readonly config: LivePhotoConfig;
  readonly parsedData: ParsedMotionPhoto | null;

  load(input: MotionPhotoInput): Promise<void>;
  play(): void;
  pause(): void;
  toggle(): void;
  mute(isMuted: boolean): void;
  destroy(): void;

  on(event: PlayerEvent, callback: (...args: unknown[]) => void): void;
  off(event: PlayerEvent, callback: (...args: unknown[]) => void): void;
}
