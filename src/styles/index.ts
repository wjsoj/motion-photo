import { baseCSS, liveBadgeCSS, livePhotoCSS } from './css-content';

export function injectStyles(): void {
  if (typeof document === 'undefined') return;

  const styleId = 'live-photo-styles';
  if (document.getElementById(styleId)) return;

  const styleElement = document.createElement('style');
  styleElement.id = styleId;
  styleElement.textContent = [baseCSS, livePhotoCSS, liveBadgeCSS].join('\n');
  document.head.appendChild(styleElement);
}

export function setThemeVariables(container: HTMLElement, variables: Record<string, string>): void {
  for (const [key, value] of Object.entries(variables)) {
    const cssVar = key.startsWith('--') ? key : `--${key}`;
    container.style.setProperty(cssVar, value);
  }
}

export function applyTheme(container: HTMLElement, variant: 'light' | 'dark' | 'auto'): void {
  container.setAttribute('data-live-theme', variant);
}

export function getThemeVariable(container: HTMLElement, variable: string): string {
  const cssVar = variable.startsWith('--') ? variable : `--${variable}`;
  return getComputedStyle(container).getPropertyValue(cssVar).trim();
}

export function removeStyles(): void {
  if (typeof document === 'undefined') return;

  const styleElement = document.getElementById('live-photo-styles');
  styleElement?.remove();
}

export interface ThemeVariables {
  primary?: string;
  primaryHover?: string;
  badgeBg?: string;
  badgeText?: string;
  badgeSize?: string;
  playPauseSize?: string;
  muteBtnSize?: string;
  transitionDuration?: string;
  [key: string]: string | undefined;
}

export function normalizeThemeVariables(theme: ThemeVariables): Record<string, string> {
  const normalized: Record<string, string> = {};

  for (const [key, value] of Object.entries(theme)) {
    if (value === undefined) continue;

    switch (key) {
      case 'badgeBg':
        normalized['--live-badge-bg'] = value;
        break;
      case 'badgeText':
        normalized['--live-badge-text'] = value;
        break;
      case 'badgeSize':
        normalized['--live-badge-size'] = value;
        break;
      case 'playPauseSize':
        normalized['--live-play-pause-size'] = value;
        break;
      case 'muteBtnSize':
        normalized['--live-mute-btn-size'] = value;
        break;
      case 'transitionDuration':
        normalized['--live-photo-transition-duration'] = value;
        break;
      default: {
        const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        normalized[`--live-photo-${cssVar}`] = value;
      }
    }
  }

  return normalized;
}

interface ThemeConfig {
  variant?: 'light' | 'dark' | 'auto';
  cssVariables?: ThemeVariables;
}

export function applyThemeToContainer(container: HTMLElement, theme: ThemeConfig): void {
  if (theme.variant) {
    applyTheme(container, theme.variant);
  }

  if (theme.cssVariables) {
    const normalizedVars = normalizeThemeVariables(theme.cssVariables);
    setThemeVariables(container, normalizedVars);
  }
}

export default {
  injectStyles,
  setThemeVariables,
  applyTheme,
  getThemeVariable,
  removeStyles,
  applyThemeToContainer,
  normalizeThemeVariables,
};
