import {
  LivePhotoPlayer as CorePlayer,
  type LivePhotoConfig,
  type MotionPhotoInput,
} from '../core';
import { applyThemeToContainer, injectStyles } from '../styles';

const SVG_ICONS = {
  play: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  pause:
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>',
  volume:
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
  muted:
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>',
  error:
    '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
  liveBadge:
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" fill="currentColor"/><circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6"/><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3"/></svg>',
  ringBadge:
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>',
} as const;

export interface LivePhotoPlayerOptions {
  src?: MotionPhotoInput;
  config?: Partial<LivePhotoConfig>;
  onStateChange?: (state: string) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onError?: (error: Error) => void;
  onEnded?: () => void;
}

export class LivePhotoPlayer {
  private core: CorePlayer;
  private container: HTMLElement;
  private imgElement!: HTMLImageElement;
  private videoElement!: HTMLVideoElement;
  private badgeElement!: HTMLElement;
  private muteButton!: HTMLButtonElement;
  private playPauseIndicator!: HTMLElement;
  private loadingOverlay!: HTMLElement;
  private errorOverlay!: HTMLElement;
  private isMuted: boolean;
  private cleanup: Array<() => void> = [];

  constructor(container: string | HTMLElement, options: LivePhotoPlayerOptions = {}) {
    injectStyles();

    const resolvedContainer =
      typeof container === 'string' ? document.querySelector<HTMLElement>(container) : container;

    if (!resolvedContainer) {
      throw new Error(`Container not found: ${container}`);
    }

    this.container = resolvedContainer;

    this.core = new CorePlayer(options.config || {});
    this.isMuted = this.core.config.muted ?? true;

    this.setupContainer();
    this.createElements();
    this.attachListeners();
    this.attachCoreListeners();

    // Apply theme if configured
    if (this.core.config.theme) {
      applyThemeToContainer(this.container, this.core.config.theme);
    }

    // Load source if provided
    if (options.src) {
      this.load(options.src);
    }
  }

  private setupContainer(): void {
    // Ensure container has position relative
    const containerStyle = window.getComputedStyle(this.container);
    if (containerStyle.position === 'static') {
      this.container.style.position = 'relative';
    }

    // Add base class
    this.container.classList.add('live-photo');

    // Add accessibility attributes
    this.container.setAttribute('role', this.core.config.role || 'button');
    this.container.setAttribute('aria-label', this.core.config.ariaLabel || 'Live Photo');
    this.container.setAttribute('tabIndex', '0');
  }

  private createElements(): void {
    // Image element
    this.imgElement = document.createElement('img');
    this.imgElement.className = 'live-photo__img';
    this.imgElement.alt = '';
    this.imgElement.draggable = false;
    this.container.appendChild(this.imgElement);

    // Video element
    this.videoElement = document.createElement('video');
    this.videoElement.className = 'live-photo__video';
    this.videoElement.playsInline = true;
    this.videoElement.muted = this.isMuted;
    this.videoElement.loop = this.core.config.loop ?? true;
    this.container.appendChild(this.videoElement);

    this.core.attachVideo(this.videoElement);

    // Badge element
    this.createBadge();

    // Play/Pause indicator
    this.createPlayPauseIndicator();

    // Mute button
    this.createMuteButton();

    // Loading overlay
    this.createLoadingOverlay();

    // Error overlay
    this.createErrorOverlay();
  }

  private createBadge(): void {
    if (!this.core.config.showLiveBadge) return;

    this.badgeElement = document.createElement('div');
    this.badgeElement.className = this.getBadgeClasses();
    this.badgeElement.setAttribute('aria-hidden', 'true');
    this.badgeElement.style.cursor = 'pointer';

    const handleBadgeClick = (e: Event): void => {
      e.stopPropagation();
      this.core.play();
    };
    this.badgeElement.addEventListener('click', handleBadgeClick);
    this.cleanup.push(() => this.badgeElement.removeEventListener('click', handleBadgeClick));

    const badgeStyle = this.core.config.liveBadgeStyle?.style || 'concentric';

    if (badgeStyle === 'concentric') {
      const rings = document.createElement('span');
      rings.className = 'live-badge__rings';

      for (const ringType of ['inner', 'middle', 'outer']) {
        const ring = document.createElement('span');
        ring.className = `live-badge__ring live-badge__ring--${ringType}`;
        rings.appendChild(ring);
      }
      this.badgeElement.appendChild(rings);
    } else if (badgeStyle === 'icon' || badgeStyle === 'ring') {
      const icon = document.createElement('span');
      icon.className = 'live-badge__icon';
      icon.innerHTML = badgeStyle === 'icon' ? SVG_ICONS.liveBadge : SVG_ICONS.ringBadge;
      this.badgeElement.appendChild(icon);
    }

    if (badgeStyle !== 'icon') {
      const text = document.createElement('span');
      text.className = 'live-badge__text';
      text.textContent = this.core.config.liveBadgeText || 'LIVE';
      this.badgeElement.appendChild(text);
    }

    this.container.appendChild(this.badgeElement);
  }

  private createPlayPauseIndicator(): void {
    if (!this.core.config.showPlayPauseIndicator) return;
    if (this.core.config.playPauseIndicatorStyle === 'none') return;

    this.playPauseIndicator = document.createElement('div');
    this.playPauseIndicator.className = 'live-photo__play-pause';
    if (this.core.config.playPauseIndicatorStyle === 'ripple') {
      this.playPauseIndicator.classList.add('live-photo__play-pause--ripple');
    }
    this.playPauseIndicator.innerHTML = SVG_ICONS.play;
    this.playPauseIndicator.setAttribute('aria-hidden', 'true');
    this.container.appendChild(this.playPauseIndicator);
  }

  private createMuteButton(): void {
    if (this.core.config.showMuteButton === false) return;

    this.muteButton = document.createElement('button');
    this.muteButton.type = 'button';
    this.muteButton.className = 'live-photo__mute-btn';
    this.muteButton.innerHTML = this.isMuted ? SVG_ICONS.muted : SVG_ICONS.volume;
    this.muteButton.setAttribute('aria-label', this.isMuted ? 'Unmute' : 'Mute');
    this.container.appendChild(this.muteButton);

    const handleMuteClick = (e: Event): void => {
      e.stopPropagation();
      this.toggleMute();
    };

    this.muteButton.addEventListener('click', handleMuteClick);
    this.cleanup.push(() => this.muteButton.removeEventListener('click', handleMuteClick));
  }

  private createLoadingOverlay(): void {
    this.loadingOverlay = document.createElement('div');
    this.loadingOverlay.className = 'live-photo__loading';

    const spinner = document.createElement('div');
    spinner.className = 'live-photo__loading-spinner';
    this.loadingOverlay.appendChild(spinner);

    this.container.appendChild(this.loadingOverlay);
  }

  private createErrorOverlay(): void {
    this.errorOverlay = document.createElement('div');
    this.errorOverlay.className = 'live-photo__error';
    this.errorOverlay.style.display = 'none';

    const icon = document.createElement('div');
    icon.className = 'live-photo__error-icon';
    icon.innerHTML = SVG_ICONS.error;
    this.errorOverlay.appendChild(icon);

    const message = document.createElement('span');
    message.className = 'live-photo__error-message';
    message.textContent = 'Failed to load';
    this.errorOverlay.appendChild(message);

    const retryBtn = document.createElement('button');
    retryBtn.className = 'live-photo__error-retry';
    retryBtn.textContent = 'Retry';

    const handleRetry = (): void => this.play();
    retryBtn.addEventListener('click', handleRetry);
    this.cleanup.push(() => retryBtn.removeEventListener('click', handleRetry));

    this.errorOverlay.appendChild(retryBtn);
    this.container.appendChild(this.errorOverlay);
  }

  private attachListeners(): void {
    const handleKeydown = (e: KeyboardEvent): void => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.core.toggle();
      }
    };
    this.container.addEventListener('keydown', handleKeydown);
    this.cleanup.push(() => this.container.removeEventListener('keydown', handleKeydown));

    if (this.core.config.trigger === 'hover') {
      const handleMouseEnter = (): void => this.core.play();
      const handleMouseLeave = (): void => this.core.pause();

      this.container.addEventListener('mouseenter', handleMouseEnter);
      this.container.addEventListener('mouseleave', handleMouseLeave);

      this.cleanup.push(() => {
        this.container.removeEventListener('mouseenter', handleMouseEnter);
        this.container.removeEventListener('mouseleave', handleMouseLeave);
      });
    }
  }

  private attachCoreListeners(): void {
    this.core.on('stateChange', (state: unknown) => {
      const stateStr = state as string;
      this.updateStateClasses(stateStr);
      if (this.playPauseIndicator) {
        this.updatePlayPauseIndicator(stateStr);
      }
      if (this.muteButton) {
        this.updateMuteButtonVisibility();
      }
      if (this.loadingOverlay) {
        this.loadingOverlay.style.display = stateStr === 'parsing' ? 'flex' : 'none';
      }
      if (this.errorOverlay) {
        this.errorOverlay.style.display = stateStr === 'error' ? 'flex' : 'none';
      }
    });

    this.core.on('error', (error: unknown) => {
      const message = this.errorOverlay.querySelector('.live-photo__error-message');
      if (message) {
        const err = error as Error;
        message.textContent = err.message || 'Failed to load';
      }
    });
  }

  private updateStateClasses(state: string): void {
    const stateClasses = [
      'live-photo--playing',
      'live-photo--paused',
      'live-photo--ready',
      'live-photo--loading',
      'live-photo--error',
    ];
    this.container.classList.remove(...stateClasses);

    const stateClassMap: Record<string, string> = {
      playing: 'live-photo--playing',
      paused: 'live-photo--paused',
      ready: 'live-photo--ready',
      parsing: 'live-photo--loading',
      error: 'live-photo--error',
    };

    const stateClass = stateClassMap[state];
    if (stateClass) {
      this.container.classList.add(stateClass);
    }
  }

  private updatePlayPauseIndicator(state: string): void {
    if (!this.playPauseIndicator) return;

    if (state === 'playing') {
      this.playPauseIndicator.innerHTML = SVG_ICONS.pause;
    } else {
      this.playPauseIndicator.innerHTML = SVG_ICONS.play;
    }
  }

  private updateMuteButtonVisibility(): void {
    if (!this.muteButton) return;

    const state = this.core.state;
    const isVisible = state === 'playing' || state === 'paused';

    if (isVisible) {
      this.muteButton.classList.add('live-photo__mute-btn--visible');
    } else {
      this.muteButton.classList.remove('live-photo__mute-btn--visible');
    }
  }

  private getBadgeClasses(): string {
    const classes = ['live-badge'];
    const position = this.core.config.liveBadgePosition || 'top-left';
    const badgeStyle = this.core.config.liveBadgeStyle;
    const size = badgeStyle?.size || 'md';
    const style = badgeStyle?.style || 'concentric';
    const animation = badgeStyle?.animation !== false;

    classes.push(`live-badge--${position}`);
    classes.push(`live-badge--${size}`);
    classes.push(`live-badge--${style}`);
    if (animation) classes.push('live-badge--animated');

    return classes.join(' ');
  }

  async load(src: MotionPhotoInput): Promise<void> {
    await this.core.load(src);

    if (this.core.parsedData) {
      this.imgElement.src = this.core.parsedData.imageSrc;
      this.videoElement.src = this.core.parsedData.videoSrc || '';

      // Update badge visibility based on video availability
      if (this.badgeElement) {
        this.badgeElement.style.display = this.core.parsedData.hasVideo ? 'flex' : 'none';
      }

      // Update mute button visibility
      if (this.muteButton) {
        const show =
          this.core.config.showMuteButton === 'auto'
            ? this.core.parsedData.hasVideo && !!this.core.parsedData.videoSrc
            : this.core.config.showMuteButton;
        this.muteButton.style.display = show ? 'flex' : 'none';
      }
    }
  }

  play(): void {
    this.core.play();
    this.updateVideoVisibility();
  }

  pause(): void {
    this.core.pause();
    this.updateVideoVisibility();
  }

  toggle(): void {
    this.core.toggle();
    this.updateVideoVisibility();
  }

  private updateVideoVisibility(): void {
    const isPlaying = this.core.state === 'playing';
    this.videoElement.style.opacity = isPlaying ? '1' : '0';
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
    this.videoElement.muted = this.isMuted;

    if (this.muteButton) {
      this.muteButton.innerHTML = this.isMuted ? SVG_ICONS.muted : SVG_ICONS.volume;
      this.muteButton.setAttribute('aria-label', this.isMuted ? 'Unmute' : 'Mute');
    }

    this.core.mute(this.isMuted);
  }

  mute(isMuted: boolean): void {
    this.isMuted = isMuted;
    this.videoElement.muted = isMuted;

    if (this.muteButton) {
      this.muteButton.innerHTML = isMuted ? SVG_ICONS.muted : SVG_ICONS.volume;
      this.muteButton.setAttribute('aria-label', isMuted ? 'Unmute' : 'Mute');
    }

    this.core.mute(isMuted);
  }

  destroy(): void {
    for (const fn of this.cleanup) {
      fn();
    }
    this.cleanup = [];

    this.core.destroy();

    this.imgElement.remove();
    this.videoElement.remove();
    this.badgeElement?.remove();
    this.muteButton?.remove();
    this.playPauseIndicator?.remove();
    this.loadingOverlay?.remove();
    this.errorOverlay?.remove();
  }

  on(event: string, callback: (...args: unknown[]) => void): void {
    this.core.on(event as Parameters<typeof this.core.on>[0], callback);
  }

  off(event: string, callback: (...args: unknown[]) => void): void {
    this.core.off(event as Parameters<typeof this.core.off>[0], callback);
  }

  get state() {
    return this.core.state;
  }

  get parsedData() {
    return this.core.parsedData;
  }

  setDebugLogger(logger: (message: string) => void): void {
    this.core.setDebugLogger(logger);
  }
}

export default LivePhotoPlayer;
