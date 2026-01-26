import { LivePhotoPlayer as CorePlayer, LivePhotoConfig, MotionPhotoInput } from '../core';

export class LivePhotoPlayer {
  private core: CorePlayer;
  private container: HTMLElement;
  private imgElement!: HTMLImageElement;
  private videoElement!: HTMLVideoElement;
  private liveBadge!: HTMLElement;

  constructor(container: string | HTMLElement, config: Partial<LivePhotoConfig> = {}) {
    this.container =
      typeof container === 'string' ? document.querySelector(container)! : container;

    this.core = new CorePlayer(config);
    this.createElements();
    this.attachListeners();
  }

  private createElements(): void {
    this.imgElement = document.createElement('img');
    this.container.appendChild(this.imgElement);

    this.videoElement = document.createElement('video');
    this.videoElement.playsInline = true;
    this.videoElement.style.display = 'none';
    this.container.appendChild(this.videoElement);

    this.liveBadge = document.createElement('div');
    this.liveBadge.className = 'live-photo-badge';
    this.liveBadge.textContent = 'LIVE';
    this.liveBadge.style.cssText = `
      position: absolute;
      top: 8px;
      left: 8px;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    `;
    this.container.appendChild(this.liveBadge);

    this.core.attachVideo(this.videoElement);
  }

  private attachListeners(): void {
    this.container.addEventListener('click', () => this.core.toggle());

    if (this.core.config.trigger === 'hover') {
      this.container.addEventListener('mouseenter', () => this.core.play());
      this.container.addEventListener('mouseleave', () => this.core.pause());
    }
  }

  async load(src: MotionPhotoInput): Promise<void> {
    await this.core.load(src);

    if (this.core.parsedData) {
      this.imgElement.src = this.core.parsedData.imageSrc;
      this.videoElement.src = this.core.parsedData.videoSrc || '';
    }
  }

  play(): void {
    this.core.play();
  }

  pause(): void {
    this.core.pause();
  }

  toggle(): void {
    this.core.toggle();
  }

  mute(isMuted: boolean): void {
    this.core.mute(isMuted);
  }

  destroy(): void {
    this.core.destroy();
  }

  get state() {
    return this.core.state;
  }
}
