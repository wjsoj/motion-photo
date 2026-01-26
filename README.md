# Motion Photo

Headless Motion Photo & Live Photo library for React, Vue, and vanilla JS.

## Features

- 📸 **Google/Samsung Motion Photos** - Parse embedded video from Motion Photo files
- 🍎 **iPhone Live Photos** - Support for separate image + video format
- 🎯 **Headless Architecture** - Framework-agnostic core with framework adapters
- ⚛️ **React Support** - Hook and component included
- 💚 **Vue Support** - Composable included
- 📦 **Vanilla JS** - Class-based API for any environment
- 🎨 **Customizable** - Sensible defaults with full configuration options
- 🚀 **Lightweight** - Tree-shakeable, minimal dependencies

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
  trigger: 'click' | 'hover' | 'manual'; // Default: 'click'

  // Mobile-specific
  longPressDelay: number; // Default: 500 (ms)

  // Auto-replay
  autoReplay: boolean; // Default: false
  replayDelay: number; // Default: 2000 (ms)

  // Transitions
  fadeDuration: number; // Default: 300 (ms)

  // Audio
  muted: boolean; // Default: true
  showMuteButton: boolean | 'auto'; // Default: 'auto'

  // Video
  loop: boolean; // Default: true

  // UI
  showLiveBadge: boolean; // Default: true
  liveBadgePosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  liveBadgeText: string; // Default: 'LIVE'

  // Callbacks
  onStateChange?: (state: PlayerState) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onError?: (error: Error) => void;
  onEnded?: () => void;
}
```

## License

MIT
