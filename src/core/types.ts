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
export type PlayerEvent =
  | 'stateChange'
  | 'load'
  | 'play'
  | 'pause'
  | 'error'
  | 'ended';

// Configuration interface with sensible defaults
export interface LivePhotoConfig {
  // Playback trigger
  trigger: 'click' | 'hover' | 'manual';

  // Mobile-specific
  longPressDelay: number;

  // Auto-replay
  autoReplay: boolean;
  replayDelay: number;

  // Transitions
  fadeDuration: number;

  // Audio
  muted: boolean;
  showMuteButton: boolean | 'auto';

  // Video
  loop: boolean;

  // UI
  showLiveBadge: boolean;
  liveBadgePosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  liveBadgeText: string;

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

  on(event: PlayerEvent, callback: (...args: any[]) => void): void;
  off(event: PlayerEvent, callback: (...args: any[]) => void): void;
}
