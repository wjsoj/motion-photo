import { ref, watch, onUnmounted } from 'vue';
import {
  LivePhotoPlayer,
  LivePhotoConfig,
  MotionPhotoInput,
  PlayerState,
  ParsedMotionPhoto,
} from '../core';

export function useLivePhoto(options: {
  src: MotionPhotoInput;
} & Partial<LivePhotoConfig>) {
  const state = ref<PlayerState>('idle');
  const error = ref<Error | null>(null);
  const parsedData = ref<ParsedMotionPhoto | null>(null);
  const videoElement = ref<HTMLVideoElement | null>(null);

  const { src, ...config } = options;
  const player = new LivePhotoPlayer(config);

  player.on('stateChange', (newState) => (state.value = newState));
  player.on('error', (err) => (error.value = err));
  player.on('load', (data) => (parsedData.value = data));

  player.load(src);

  watch(videoElement, (video: HTMLVideoElement | null) => {
    if (video) player.attachVideo(video);
  });

  onUnmounted(() => {
    player.destroy();
  });

  return {
    state,
    error,
    parsedData,
    videoElement,
    play: () => player.play(),
    pause: () => player.pause(),
    toggle: () => player.toggle(),
    mute: (isMuted: boolean) => player.mute(isMuted),
  };
}
