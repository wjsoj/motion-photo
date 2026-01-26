import type {
  ILivePhotoPlayer,
  LivePhotoConfig,
  MotionPhotoInput,
  ParsedMotionPhoto,
  PlayerEvent,
  PlayerState,
} from './types';
import { MotionPhotoParser } from './parser';
import { EventEmitter } from './event-emitter';
import { getDefaultConfig } from './defaults';

type PlayerEvents = {
  stateChange: PlayerState;
  load: ParsedMotionPhoto;
  play: void;
  pause: void;
  error: Error;
  ended: void;
};

export class LivePhotoPlayer implements ILivePhotoPlayer {
  public readonly config: LivePhotoConfig;

  private parser: MotionPhotoParser;
  private emitter: EventEmitter<PlayerEvents>;
  private _state: PlayerState = 'idle';
  private _parsedData: ParsedMotionPhoto | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private autoReplayTimer: number | null = null;

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

  async load(input: MotionPhotoInput): Promise<void> {
    this.setState('parsing');

    try {
      this._parsedData = await this.parser.parse(input);
      this.setState('ready');
      this.emitter.emit('load', this._parsedData);
    } catch (error) {
      this.setState('error');
      this.emitter.emit('error', error as Error);
      throw error;
    }
  }

  play(): void {
    if (!this.videoElement || !this._parsedData?.hasVideo) return;

    this.videoElement.play();
    this.setState('playing');
    this.emitter.emit('play', undefined);
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
  }

  private setupVideoListeners(): void {
    if (!this.videoElement) return;

    this.videoElement.addEventListener('ended', () => {
      if (this.config.autoReplay) {
        this.scheduleAutoReplay();
      } else {
        this.setState('ready');
      }
      this.emitter.emit('ended', undefined);
    });
  }

  private scheduleAutoReplay(): void {
    if (this.autoReplayTimer) clearTimeout(this.autoReplayTimer);

    this.autoReplayTimer = window.setTimeout(() => {
      this.play();
    }, this.config.replayDelay);
  }

  private setState(newState: PlayerState): void {
    if (this._state === newState) return;

    this._state = newState;
    this.emitter.emit('stateChange', newState);
    this.config.onStateChange?.(newState);
  }

  on(event: PlayerEvent, callback: (...args: any[]) => void): void {
    this.emitter.on(event, callback as any);
  }

  off(event: PlayerEvent, callback: (...args: any[]) => void): void {
    this.emitter.off(event, callback as any);
  }

  destroy(): void {
    if (this.autoReplayTimer) clearTimeout(this.autoReplayTimer);

    if (this._parsedData) {
      this.parser.revokeURL(this._parsedData.imageSrc);
      if (this._parsedData.videoSrc) {
        this.parser.revokeURL(this._parsedData.videoSrc);
      }
    }

    this.emitter.clear();

    this._state = 'idle';
    this._parsedData = null;
  }
}
