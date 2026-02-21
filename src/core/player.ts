import { getDefaultConfig } from './defaults';
import { EventEmitter } from './event-emitter';
import { MotionPhotoParser } from './parser';
import type {
  ILivePhotoPlayer,
  LivePhotoConfig,
  MotionPhotoInput,
  ParsedMotionPhoto,
  PlayerEvent,
  PlayerState,
} from './types';

interface PlayerEvents {
  stateChange: PlayerState;
  load: ParsedMotionPhoto;
  play: undefined;
  pause: undefined;
  error: Error;
  ended: undefined;
}

export class LivePhotoPlayer implements ILivePhotoPlayer {
  public readonly config: LivePhotoConfig;

  private parser: MotionPhotoParser;
  private emitter: EventEmitter<PlayerEvents>;
  private _state: PlayerState = 'idle';
  private _parsedData: ParsedMotionPhoto | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private autoReplayTimer: number | null = null;
  private hasPlayedOnce = false;
  private playOnceOnLoadTimer: number | null = null;

  constructor(config: Partial<LivePhotoConfig> = {}) {
    this.config = { ...getDefaultConfig(), ...config };
    this.parser = new MotionPhotoParser();
    this.emitter = new EventEmitter<PlayerEvents>();
  }

  get state(): PlayerState {
    return this._state;
  }

  get parsedData(): ParsedMotionPhoto | null {
    return this._parsedData;
  }

  setDebugLogger(logger: (message: string) => void): void {
    this.parser.setDebugLogger(logger);
  }

  async load(input: MotionPhotoInput): Promise<void> {
    this.setState('parsing');

    try {
      this._parsedData = await this.parser.parse(input);
      this.setState('ready');
      this.emitter.emit('load', this._parsedData);

      // Auto-play once on load if enabled and video is available
      if (this.config.playOnceOnLoad && this._parsedData?.hasVideo && this.videoElement) {
        this.schedulePlayOnceOnLoad();
      }
    } catch (error) {
      this.setState('error');
      this.emitter.emit('error', error as Error);
      throw error;
    }
  }

  play(): void {
    if (!this.videoElement || !this._parsedData?.hasVideo) return;

    if (this.videoElement.readyState >= 2) {
      this.videoElement.play();
      this.setState('playing');
      this.emitter.emit('play', undefined);
      return;
    }

    this.videoElement.addEventListener(
      'canplay',
      () => {
        this.videoElement?.play();
        this.setState('playing');
        this.emitter.emit('play', undefined);
      },
      { once: true }
    );
  }

  pause(): void {
    if (!this.videoElement) return;

    this.videoElement.pause();
    this.setState('paused');
    this.emitter.emit('pause', undefined);
  }

  toggle(): void {
    if (this._state === 'playing') {
      this.pause();
    } else if (this._state === 'ready' || this._state === 'paused') {
      this.play();
    }
  }

  mute(isMuted: boolean): void {
    if (!this.videoElement) return;
    this.videoElement.muted = isMuted;
  }

  attachVideo(video: HTMLVideoElement): void {
    this.videoElement = video;
    this.setupVideoListeners();

    // Auto-play once on load if enabled when video is attached
    // This handles the case where load() was called before video element existed
    if (this.config.playOnceOnLoad && this._parsedData?.hasVideo && !this.hasPlayedOnce) {
      this.schedulePlayOnceOnLoad();
    }
  }

  private setupVideoListeners(): void {
    if (!this.videoElement) return;

    this.videoElement.addEventListener('ended', () => {
      if (this.config.playOnceOnLoad && !this.hasPlayedOnce) {
        this.hasPlayedOnce = true;
        this.setState('ready');
        this.emitter.emit('ended', undefined);
        return;
      }

      if (this.config.autoReplay) {
        this.scheduleAutoReplay();
      } else {
        this.setState('ready');
      }
      this.emitter.emit('ended', undefined);
    });
  }

  private schedulePlayOnceOnLoad(): void {
    if (this.playOnceOnLoadTimer) {
      clearTimeout(this.playOnceOnLoadTimer);
    }

    this.playOnceOnLoadTimer = setTimeout(() => {
      if (this.videoElement && !this.hasPlayedOnce) {
        this.play();
      }
    }, 100) as unknown as number;
  }

  private scheduleAutoReplay(): void {
    if (this.autoReplayTimer) {
      clearTimeout(this.autoReplayTimer);
    }

    this.autoReplayTimer = setTimeout(() => {
      this.play();
    }, this.config.replayDelay) as unknown as number;
  }

  private setState(newState: PlayerState): void {
    if (this._state === newState) return;

    this._state = newState;
    this.emitter.emit('stateChange', newState);
    this.config.onStateChange?.(newState);
  }

  on(event: PlayerEvent, callback: (...args: unknown[]) => void): void {
    this.emitter.on(event, callback as (payload: unknown) => void);
  }

  off(event: PlayerEvent, callback: (...args: unknown[]) => void): void {
    this.emitter.off(event, callback as (payload: unknown) => void);
  }

  destroy(): void {
    if (this.autoReplayTimer) {
      clearTimeout(this.autoReplayTimer);
    }
    if (this.playOnceOnLoadTimer) {
      clearTimeout(this.playOnceOnLoadTimer);
    }

    if (this._parsedData) {
      this.parser.revokeURL(this._parsedData.imageSrc);
      if (this._parsedData.videoSrc) {
        this.parser.revokeURL(this._parsedData.videoSrc);
      }
    }

    this.emitter.clear();
    this._state = 'idle';
    this._parsedData = null;
    this.hasPlayedOnce = false;
  }
}
