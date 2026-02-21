import { onUnmounted, ref, watch } from 'vue';
import {
  type LivePhotoConfig,
  LivePhotoPlayer,
  type MotionPhotoInput,
  type ParsedMotionPhoto,
  type PlayerState,
} from '../core';

interface UseLivePhotoOptions extends Partial<LivePhotoConfig> {
  src: MotionPhotoInput;
}

export function useLivePhoto(options: UseLivePhotoOptions) {
  const state = ref<PlayerState>('idle');
  const error = ref<Error | null>(null);
  const parsedData = ref<ParsedMotionPhoto | null>(null);
  const videoElement = ref<HTMLVideoElement | null>(null);

  const { src, ...config } = options;
  const player = new LivePhotoPlayer(config);

  player.on('stateChange', (newState: unknown) => {
    state.value = newState as PlayerState;
  });
  player.on('error', (err: unknown) => {
    error.value = err as Error;
  });
  player.on('load', (data: unknown) => {
    parsedData.value = data as ParsedMotionPhoto;
  });

  player.load(src);

  watch(videoElement, (video) => {
    if (video) {
      player.attachVideo(video);
    }
  });

  onUnmounted(() => {
    player.destroy();
  });

  function play(): void {
    player.play();
  }

  function pause(): void {
    player.pause();
  }

  function toggle(): void {
    player.toggle();
  }

  function mute(isMuted: boolean): void {
    player.mute(isMuted);
  }

  return {
    state,
    error,
    parsedData,
    videoElement,
    play,
    pause,
    toggle,
    mute,
  };
}
