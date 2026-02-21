# Motion Photo

Headless Motion Photo & Live Photo library for React, Vue, and vanilla JavaScript.

<p>
  <a href="https://www.npmjs.com/package/motion-photo">
    <img src="https://img.shields.io/npm/v/motion-photo.svg" alt="npm version" />
  </a>
  <a href="https://bundlephobia.com/package/motion-photo">
    <img src="https://img.shields.io/bundlephobia/minzip/motion-photo" alt="bundle size" />
  </a>
  <a href="https://github.com/wjsoj/motion-photo/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/motion-photo.svg" alt="license" />
  </a>
</p>

## Demo

Try the live demo at: **https://wjsoj.github.io/motion-photo/**

To run the demo locally:

```bash
npm run demo
# or
bun run demo
```

Then open http://localhost:8080 and upload your motion photo files!

## Features

- **Google/Samsung Motion Photos** - Parse embedded video from Motion Photo files (XMP metadata based extraction)
- **iPhone Live Photos** - Support for separate image + video format (pre-split)
- **Headless Architecture** - Framework-agnostic core with framework adapters
- **React Support** - Hook and component included
- **Vue Support** - Composable included
- **Vanilla JavaScript** - Class-based API for any environment
- **Fully Customizable** - Sensible defaults with full configuration options
- **Lightweight** - Tree-shakeable, minimal dependencies

## Installation

```bash
bun add motion-photo
# or
npm install motion-photo
# or
yarn add motion-photo
# or
pnpm add motion-photo
```

## React Usage

```tsx
import { LivePhoto } from 'motion-photo/react';

function App() {
  return (
    <LivePhoto
      src="./motion-photo.jpg"
      config={{
        trigger: 'click',
        showLiveBadge: true,
      }}
    />
  );
}
```

### Using the Hook

```tsx
import { useLivePhoto } from 'motion-photo/react';

function CustomLivePhoto({ src }) {
  const { state, videoRef, parsedData, play, pause } = useLivePhoto({
    src,
    trigger: 'click',
  });

  return (
    <div onClick={() => (state === 'playing' ? pause() : play())}>
      <img src={parsedData?.imageSrc} alt="" />
      <video ref={videoRef} src={parsedData?.videoSrc} muted loop playsInline />
    </div>
  );
}
```

## Vue Usage

```vue
<script setup>
import { useLivePhoto } from 'motion-photo/vue';

const props = defineProps(['src']);

const { state, videoElement, parsedData, toggle } = useLivePhoto({
  src: props.src,
  trigger: 'click',
});
</script>

<template>
  <div @click="toggle">
    <img :src="parsedData?.imageSrc" alt="" />
    <video ref="videoElement" :src="parsedData?.videoSrc" muted loop playsInline />
  </div>
</template>
```

## Vanilla JS Usage

```html
<div id="my-live-photo"></div>

<script type="module">
  import { LivePhotoPlayer } from 'motion-photo/vanilla';

  const player = new LivePhotoPlayer('#my-live-photo', {
    trigger: 'click',
    showLiveBadge: true,
  });

  player.load('./motion-photo.jpg');
</script>
```

## Configuration Options

```typescript
interface LivePhotoConfig {
  // Playback trigger
  trigger: 'click' | 'hover' | 'manual'; // Default: 'manual'

  // Mobile-specific
  longPressDelay: number; // Default: 500 (ms)

  // Auto-replay
  autoReplay: boolean; // Default: false
  replayDelay: number; // Default: 2000 (ms)

  // Auto-play once on load
  playOnceOnLoad: boolean; // Default: true

  // Transitions
  fadeDuration: number; // Default: 300 (ms)

  // Audio
  muted: boolean; // Default: true
  showMuteButton: boolean | 'auto'; // Default: 'auto'

  // Video
  loop: boolean; // Default: false

  // UI - Badge
  showLiveBadge: boolean; // Default: true
  liveBadgePosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'; // Default: 'top-left'
  liveBadgeText: string; // Default: 'LIVE'
  liveBadgeStyle?: LiveBadgeStyleConfig;

  // UI - Theme
  theme?: ThemeConfig;

  // UI - Play/Pause indicator
  showPlayPauseIndicator?: boolean; // Default: false
  playPauseIndicatorStyle?: 'icon' | 'ripple' | 'none'; // Default: 'icon'

  // UI - Accessibility
  ariaLabel?: string; // Default: 'Live Photo'
  role?: string; // Default: 'button'

  // Callbacks
  onStateChange?: (state: PlayerState) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onError?: (error: Error) => void;
  onEnded?: () => void;
}
```

## TypeScript Types

### MotionPhotoInput

The `src` prop accepts the following types:

```typescript
// URL string (static image, no video)
type MotionPhotoInput = 
  | string                    // URL like './photo.jpg'
  | File                      // File object from input
  | Blob                      // Blob object
  | { imgSrc: string; videoSrc: string };  // iPhone Live Photo (pre-split format)
```

### PlayerState

```typescript
type PlayerState = 
  | 'idle'      // Initial state
  | 'parsing'   // Extracting video from Motion Photo
  | 'ready'     // Parsed and ready to play
  | 'playing'   // Currently playing video
  | 'paused'    // Video paused
  | 'error';    // Error occurred
```

### ParsedMotionPhoto

```typescript
interface ParsedMotionPhoto {
  imageSrc: string;      // Blob URL for the static image
  videoSrc: string | null;  // Blob URL for the video (null if no video)
  hasVideo: boolean;     // Whether video was found
}
```

## API Reference

### React

#### `<LivePhoto />` Component

```tsx
import { LivePhoto } from 'motion-photo/react';

<LivePhoto
  src="./motion-photo.jpg"
  config={{
    trigger: 'click',
    showLiveBadge: true,
    // ...other options
  }}
  className="my-live-photo"
  style={{ width: 300 }}
/>
```

#### `useLivePhoto` Hook

```tsx
import { useLivePhoto } from 'motion-photo/react';

const {
  state,           // PlayerState
  error,           // Error | null
  videoRef,        // (el: HTMLVideoElement | null) => void
  parsedData,      // ParsedMotionPhoto | null
  play,            // () => void
  pause,           // () => void
  toggle,          // () => void
  mute,            // (isMuted: boolean) => void
  handlers,        // { onClick, onMouseEnter, onMouseLeave }
} = useLivePhoto({ src, ...config });
```

### Vue

#### `useLivePhoto` Composable

```typescript
import { useLivePhoto } from 'motion-photo/vue';

const {
  state,           // Ref<PlayerState>
  error,           // Ref<Error | null>
  videoElement,    // Ref<HTMLVideoElement | null>
  parsedData,      // Ref<ParsedMotionPhoto | null>
  play,            // () => void
  pause,           // () => void
  toggle,          // () => void
  mute,            // (isMuted: boolean) => void
} = useLivePhoto({ src, ...config });
```

### Vanilla JavaScript

#### `LivePhotoPlayer` Class

```typescript
import { LivePhotoPlayer } from 'motion-photo/vanilla';

const player = new LivePhotoPlayer('#container', {
  trigger: 'click',
  showLiveBadge: true,
  // ...other options
});

// Load a motion photo
await player.load('./motion-photo.jpg');

// Control playback
player.play();
player.pause();
player.toggle();

// Event handling
player.on('stateChange', (state) => console.log(state));
player.on('play', () => console.log('playing'));
player.on('pause', () => console.log('paused'));
player.on('ended', () => console.log('ended'));
player.on('error', (err) => console.error(err));

// Cleanup
player.destroy();
```

## License

MIT
