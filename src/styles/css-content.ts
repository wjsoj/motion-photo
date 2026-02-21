/**
 * Motion Photo - Modern Glassmorphism CSS System
 * Clean, minimal design with translucent backgrounds
 */

export const baseCSS = /* css */ `
:root {
  /* Base - Transparent by default */
  --mp-bg-primary: transparent;
  --mp-bg-secondary: rgba(0, 0, 0, 0.02);
  --mp-bg-tertiary: rgba(0, 0, 0, 0.04);
  --mp-bg-elevated: rgba(255, 255, 255, 0.1);

  /* Accent - Modern blue */
  --mp-accent: #007aff;
  --mp-accent-hover: #0a84ff;
  --mp-accent-muted: rgba(0, 122, 255, 0.12);

  /* Text */
  --mp-text-primary: #ffffff;
  --mp-text-secondary: rgba(255, 255, 255, 0.7);
  --mp-text-muted: rgba(255, 255, 255, 0.5);

  /* Border - subtle */
  --mp-border: rgba(255, 255, 255, 0.1);
  --mp-border-light: rgba(255, 255, 255, 0.15);

  /* Status */
  --mp-success: #34c759;
  --mp-error: #ff3b30;
  --mp-warning: #ff9500;

  /* Live Photo Component Variables - Glassmorphism */
  --live-photo-bg: transparent;
  --live-photo-primary: #007aff;
  --live-photo-primary-hover: #0a84ff;

  /* Badge - glassmorphism */
  --live-badge-bg: rgba(255, 255, 255, 0.15);
  --live-badge-text: #ffffff;
  --live-badge-size: 18px;
  --live-badge-font-size: 10px;
  --live-badge-padding-x: 10px;
  --live-badge-padding-y: 5px;
  --live-badge-backdrop-blur: 12px;
  --live-badge-border: 1px solid rgba(255, 255, 255, 0.2);

  /* Ring */
  --live-ring-color: #ffffff;
  --live-ring-width: 1.5px;
  --live-ring-size: 4px;
  --live-ring-gap: 3px;

  /* Animation */
  --live-photo-transition-duration: 0.25s;
  --live-photo-pulse-duration: 2s;
  --live-photo-ripple-duration: 0.5s;

  /* Container - larger radius */
  --live-photo-border-radius: 16px;
  --live-photo-cursor: pointer;

  /* Play/Pause - glassmorphism */
  --live-play-pause-size: 52px;
  --live-play-pause-bg: rgba(255, 255, 255, 0.15);
  --live-play-pause-color: #ffffff;
  --live-play-pause-backdrop-blur: 16px;
  --live-play-pause-border: 1px solid rgba(255, 255, 255, 0.25);

  /* Mute - glassmorphism */
  --live-mute-btn-size: 36px;
  --live-mute-btn-bg: rgba(255, 255, 255, 0.15);
  --live-mute-btn-color: #ffffff;
  --live-mute-btn-hover-bg: rgba(255, 255, 255, 0.25);
  --live-mute-btn-backdrop-blur: 12px;
  --live-mute-btn-border: 1px solid rgba(255, 255, 255, 0.2);

  /* Loading - glassmorphism */
  --live-loading-spinner-size: 36px;
  --live-loading-spinner-color: #ffffff;
  --live-loading-bg: rgba(0, 0, 0, 0.3);
  --live-loading-backdrop-blur: 8px;

  /* Error - glassmorphism */
  --live-error-bg: rgba(255, 59, 48, 0.85);
  --live-error-text: #ffffff;
  --live-error-icon-size: 32px;
  --live-error-backdrop-blur: 12px;

  /* Z-index */
  --live-z-index-base: 1;
  --live-z-index-badge: 10;
  --live-z-index-controls: 20;
  --live-z-index-overlay: 30;
  --live-z-index-tooltip: 40;
}

/* Light theme - glassmorphism on light */
[data-live-theme='light'] {
  --mp-bg-elevated: rgba(255, 255, 255, 0.6);
  --mp-border: rgba(255, 255, 255, 0.8);
  --mp-text-primary: #1a1a1a;
  --mp-text-secondary: rgba(0, 0, 0, 0.6);
  --mp-text-muted: rgba(0, 0, 0, 0.4);

  --live-badge-bg: rgba(255, 255, 255, 0.6);
  --live-badge-text: #1a1a1a;
  --live-badge-border: 1px solid rgba(255, 255, 255, 0.8);
  --live-ring-color: #1a1a1a;
  --live-play-pause-bg: rgba(255, 255, 255, 0.6);
  --live-play-pause-color: #1a1a1a;
  --live-play-pause-border: 1px solid rgba(255, 255, 255, 0.8);
  --live-mute-btn-bg: rgba(255, 255, 255, 0.6);
  --live-mute-btn-color: #1a1a1a;
  --live-mute-btn-hover-bg: rgba(255, 255, 255, 0.8);
  --live-mute-btn-border: 1px solid rgba(255, 255, 255, 0.8);
  --live-loading-bg: rgba(255, 255, 255, 0.5);
  --live-loading-spinner-color: #1a1a1a;
}

/* Dark theme - glassmorphism on dark */
[data-live-theme='dark'] {
  --live-badge-bg: rgba(0, 0, 0, 0.25);
  --live-badge-border: 1px solid rgba(255, 255, 255, 0.1);
  --live-play-pause-bg: rgba(0, 0, 0, 0.25);
  --live-play-pause-border: 1px solid rgba(255, 255, 255, 0.15);
  --live-mute-btn-bg: rgba(0, 0, 0, 0.25);
  --live-mute-btn-hover-bg: rgba(0, 0, 0, 0.35);
  --live-mute-btn-border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Auto theme - follow system */
@media (prefers-color-scheme: dark) {
  [data-live-theme='auto'] {
    --live-badge-bg: rgba(0, 0, 0, 0.25);
    --live-badge-border: 1px solid rgba(255, 255, 255, 0.1);
    --live-play-pause-bg: rgba(0, 0, 0, 0.25);
    --live-play-pause-border: 1px solid rgba(255, 255, 255, 0.15);
    --live-mute-btn-bg: rgba(0, 0, 0, 0.25);
    --live-mute-btn-hover-bg: rgba(0, 0, 0, 0.35);
    --live-mute-btn-border: 1px solid rgba(255, 255, 255, 0.1);
  }
}

@media (prefers-color-scheme: light) {
  [data-live-theme='auto'] {
    --live-badge-bg: rgba(255, 255, 255, 0.6);
    --live-badge-text: #1a1a1a;
    --live-badge-border: 1px solid rgba(255, 255, 255, 0.8);
    --live-ring-color: #1a1a1a;
    --live-play-pause-bg: rgba(255, 255, 255, 0.6);
    --live-play-pause-color: #1a1a1a;
    --live-play-pause-border: 1px solid rgba(255, 255, 255, 0.8);
    --live-mute-btn-bg: rgba(255, 255, 255, 0.6);
    --live-mute-btn-color: #1a1a1a;
    --live-mute-btn-hover-bg: rgba(255, 255, 255, 0.8);
    --live-mute-btn-border: 1px solid rgba(255, 255, 255, 0.8);
  }
}
`;

export const livePhotoCSS = /* css */ `
/* Container - modern glassmorphism */
.live-photo {
  position: relative;
  display: grid;
  width: 100%;
  max-width: 100%;
  cursor: var(--live-photo-cursor);
  border-radius: var(--live-photo-border-radius);
  overflow: hidden;
  background: var(--live-photo-bg, transparent);
  line-height: 0;
}

.live-photo:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.4);
}

.live-photo:focus:not(:focus-visible) {
  box-shadow: none;
}

/* Image */
.live-photo__img {
  display: block;
  width: 100%;
  height: auto;
  min-height: 100%;
  object-fit: cover;
  grid-area: 1 / 1;
  align-self: stretch;
  transition: opacity var(--live-photo-transition-duration) ease;
}

/* Video overlay */
.live-photo__video {
  grid-area: 1 / 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity var(--live-photo-transition-duration) ease;
  pointer-events: none;
}

.live-photo--playing .live-photo__video {
  opacity: 1;
}

/* Play/Pause indicator - glassmorphism */
.live-photo__play-pause {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: var(--live-play-pause-size);
  height: var(--live-play-pause-size);
  background: var(--live-play-pause-bg);
  backdrop-filter: blur(var(--live-play-pause-backdrop-blur, 16px));
  -webkit-backdrop-filter: blur(var(--live-play-pause-backdrop-blur, 16px));
  border: var(--live-play-pause-border, none);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--live-play-pause-color);
  opacity: 0;
  transition: opacity var(--live-photo-transition-duration) ease,
              transform var(--live-photo-transition-duration) ease;
  pointer-events: none;
  z-index: var(--live-z-index-controls);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.live-photo--paused .live-photo__play-pause,
.live-photo--ready .live-photo__play-pause {
  opacity: 1;
}

.live-photo--playing .live-photo__play-pause {
  opacity: 0;
}

.live-photo__play-pause svg {
  width: 40%;
  height: 40%;
}

/* Play/Pause ripple */
.live-photo__play-pause--ripple::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--live-play-pause-bg);
  opacity: 0;
}

.live-photo--playing .live-photo__play-pause--ripple::before {
  animation: live-play-ripple var(--live-photo-ripple-duration) ease-out;
}

@keyframes live-play-ripple {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.4;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.4);
    opacity: 0;
  }
}

/* Mute button - glassmorphism */
.live-photo__mute-btn {
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: var(--live-mute-btn-size);
  height: var(--live-mute-btn-size);
  background: var(--live-mute-btn-bg);
  backdrop-filter: blur(var(--live-mute-btn-backdrop-blur, 12px));
  -webkit-backdrop-filter: blur(var(--live-mute-btn-backdrop-blur, 12px));
  border: var(--live-mute-btn-border, none);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--live-mute-btn-color);
  cursor: pointer;
  opacity: 0;
  transform: scale(0.9);
  transition: all var(--live-photo-transition-duration) ease;
  z-index: var(--live-z-index-controls);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.live-photo:hover .live-photo__mute-btn,
.live-photo:focus-within .live-photo__mute-btn,
.live-photo__mute-btn--visible {
  opacity: 1;
  transform: scale(1);
}

.live-photo__mute-btn:hover {
  background: var(--live-mute-btn-hover-bg);
  transform: scale(1.05);
}

.live-photo__mute-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.5), 0 2px 8px rgba(0, 0, 0, 0.12);
}

.live-photo__mute-btn svg {
  width: 55%;
  height: 55%;
  fill: currentColor;
}

/* Loading overlay - glassmorphism */
.live-photo__loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--live-loading-bg);
  backdrop-filter: blur(var(--live-loading-backdrop-blur, 8px));
  -webkit-backdrop-filter: blur(var(--live-loading-backdrop-blur, 8px));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--live-z-index-overlay);
}

.live-photo__loading-spinner {
  width: var(--live-loading-spinner-size);
  height: var(--live-loading-spinner-size);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: var(--live-loading-spinner-color);
  border-radius: 50%;
  animation: live-loading-spin 0.8s linear infinite;
}

@keyframes live-loading-spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error overlay - glassmorphism */
.live-photo__error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--live-error-bg);
  backdrop-filter: blur(var(--live-error-backdrop-blur, 12px));
  -webkit-backdrop-filter: blur(var(--live-error-backdrop-blur, 12px));
  color: var(--live-error-text);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  text-align: center;
  z-index: var(--live-z-index-overlay);
}

.live-photo__error-icon {
  width: var(--live-error-icon-size);
  height: var(--live-error-icon-size);
}

.live-photo__error-icon svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.live-photo__error-message {
  font-size: 14px;
  font-weight: 500;
}

.live-photo__error-retry {
  margin-top: 10px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  color: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--live-photo-transition-duration) ease;
}

.live-photo__error-retry:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.02);
}

/* State classes */
.live-photo--loading {
  pointer-events: none;
}

.live-photo--error {
  cursor: not-allowed;
}

/* Touch devices */
@media (hover: none) and (pointer: coarse) {
  .live-photo__mute-btn {
    opacity: 1;
    transform: scale(1);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .live-photo__video,
  .live-photo__play-pause,
  .live-photo__mute-btn,
  .live-badge,
  .live-badge__ring {
    transition: none;
    animation: none;
  }
}
`;

export const liveBadgeCSS = /* css */ `
/* Base badge - glassmorphism */
.live-badge {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: var(--live-badge-padding-y) var(--live-badge-padding-x);
  border-radius: 20px;
  background: var(--live-badge-bg);
  backdrop-filter: blur(var(--live-badge-backdrop-blur, 12px));
  -webkit-backdrop-filter: blur(var(--live-badge-backdrop-blur, 12px));
  border: var(--live-badge-border, none);
  color: var(--live-badge-text);
  font-size: var(--live-badge-font-size);
  font-weight: 500;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  pointer-events: auto;
  user-select: none;
  z-index: var(--live-z-index-badge);
  transition: all var(--live-photo-transition-duration) ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.live-badge:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* Positions */
.live-badge--top-left { top: 12px; left: 12px; }
.live-badge--top-right { top: 12px; right: 12px; }
.live-badge--bottom-left { bottom: 12px; left: 12px; }
.live-badge--bottom-right { bottom: 12px; right: 12px; }

/* Sizes */
.live-badge--sm {
  --live-badge-size: 16px;
  --live-badge-font-size: 9px;
  --live-badge-padding-x: 8px;
  --live-badge-padding-y: 4px;
}

.live-badge--md {
  --live-badge-size: 20px;
  --live-badge-font-size: 10px;
  --live-badge-padding-x: 10px;
  --live-badge-padding-y: 5px;
}

.live-badge--lg {
  --live-badge-size: 24px;
  --live-badge-font-size: 11px;
  --live-badge-padding-x: 12px;
  --live-badge-padding-y: 6px;
}

/* Style: text only */
.live-badge--text .live-badge__icon,
.live-badge--text .live-badge__rings {
  display: none;
}

/* Style: icon only - circular glassmorphism */
.live-badge--icon .live-badge__text {
  display: none;
}

.live-badge--icon {
  padding: 0;
  width: calc(var(--live-badge-size) + 12px);
  height: calc(var(--live-badge-size) + 12px);
  border-radius: 50%;
}

/* Icon-only: enlarge the icon to match badge size */
.live-badge--icon .live-badge__icon {
  width: var(--live-badge-size);
  height: var(--live-badge-size);
}

.live-badge--icon .live-badge__icon svg {
  width: calc(var(--live-badge-size) * 1.3);
  height: calc(var(--live-badge-size) * 1.3);
}

/* Style: ring */
.live-badge--ring {
  position: relative;
  padding-left: calc(var(--live-badge-padding-x) + var(--live-badge-size) + var(--live-ring-gap));
}

.live-badge--ring .live-badge__icon {
  position: absolute;
  top: 50%;
  left: var(--live-badge-padding-x);
  transform: translateY(-50%);
  width: var(--live-badge-size);
  height: var(--live-badge-size);
  flex-shrink: 0;
}

.live-badge--ring .live-badge__rings {
  position: absolute;
  top: 50%;
  left: var(--live-badge-padding-x);
  transform: translateY(-50%);
  width: var(--live-badge-size);
  height: var(--live-badge-size);
}

.live-badge--ring .live-badge__ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-sizing: border-box;
}

.live-badge--ring .live-badge__ring--inner {
  width: 40%;
  height: 40%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--live-ring-color);
  opacity: 1;
}

.live-badge--ring .live-badge__ring--middle,
.live-badge--ring .live-badge__ring--outer {
  border: var(--live-ring-width) solid var(--live-ring-color);
  opacity: 0;
}

.live-badge--ring.live-badge--animated .live-badge__ring--middle {
  animation: live-badge-ring-wave 1.5s ease-out infinite;
}

.live-badge--ring.live-badge--animated .live-badge__ring--outer {
  animation: live-badge-ring-wave 1.5s ease-out infinite;
  animation-delay: 0.5s;
}

@keyframes live-badge-ring-wave {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 0.15;
  }
  100% {
    opacity: 0;
    transform: scale(1.1);
  }
}

/* Style: concentric */
.live-badge--concentric {
  position: relative;
  padding-left: calc(var(--live-badge-padding-x) + var(--live-badge-size) + var(--live-ring-gap));
}

.live-badge--concentric .live-badge__rings {
  position: absolute;
  top: 50%;
  left: var(--live-badge-padding-x);
  transform: translateY(-50%);
  width: var(--live-badge-size);
  height: var(--live-badge-size);
}

.live-badge__ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: var(--live-ring-width) solid var(--live-ring-color);
  border-radius: 50%;
  box-sizing: border-box;
  opacity: 0;
}

.live-badge__ring--inner {
  width: calc(50% - var(--live-ring-gap));
  height: calc(50% - var(--live-ring-gap));
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 1;
  background: var(--live-ring-color);
}

.live-badge--concentric.live-badge--animated .live-badge__ring--outer {
  animation: live-badge-concentric-pulse var(--live-photo-pulse-duration) ease-out infinite;
}

.live-badge--concentric.live-badge--animated .live-badge__ring--middle {
  animation: live-badge-concentric-pulse var(--live-photo-pulse-duration) ease-out infinite;
  animation-delay: calc(var(--live-photo-pulse-duration) / 3);
}

@keyframes live-badge-concentric-pulse {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 0.15;
  }
  100% {
    opacity: 0;
    transform: scale(1.1);
  }
}

/* Badge icon */
.live-badge__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
}

.live-badge__icon svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

/* Text hide for icon-only */
.live-badge--icon .live-badge__text {
  display: none;
}
`;
