import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  type LivePhotoConfig,
  LivePhotoPlayer,
  type MotionPhotoInput,
  type ParsedMotionPhoto,
  type PlayerState,
} from '../core';

function getSrcKey(src: MotionPhotoInput): string {
  if (typeof src === 'string') return src;
  if (src instanceof File) return `file:${src.name}:${src.size}:${src.lastModified}`;
  if (src instanceof Blob) return `blob:${src.size}:${src.type}`;
  return `${src.imgSrc}|${src.videoSrc}`;
}

export function useLivePhoto(options: { src: MotionPhotoInput } & Partial<LivePhotoConfig>) {
  const [state, setState] = useState<PlayerState>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [parsedData, setParsedData] = useState<ParsedMotionPhoto | null>(null);
  const playerRef = useRef<LivePhotoPlayer | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const stableSrcKey = useMemo(() => getSrcKey(options.src), [options.src]);

  const setVideoRef = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el && playerRef.current) {
      playerRef.current.attachVideo(el);
    }
  }, []);

  // Store options in a ref to avoid dependency issues
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // biome-ignore lint/correctness/useExhaustiveDependencies: stableSrcKey is intentionally used to trigger re-initialization when source changes
  useEffect(() => {
    const { src, ...config } = optionsRef.current;
    const player = new LivePhotoPlayer(config);
    playerRef.current = player;

    player.on('stateChange', (newState: unknown) => setState(newState as PlayerState));
    player.on('error', (err: unknown) => setError(err as Error));
    player.on('load', (data: unknown) => setParsedData(data as ParsedMotionPhoto));

    if (videoRef.current) {
      player.attachVideo(videoRef.current);
    }

    player.load(src);

    return () => {
      player.destroy();
      playerRef.current = null;
    };
  }, [stableSrcKey]);

  const play = useCallback(() => playerRef.current?.play(), []);
  const pause = useCallback(() => playerRef.current?.pause(), []);
  const toggle = useCallback(() => playerRef.current?.toggle(), []);
  const mute = useCallback((isMuted: boolean) => playerRef.current?.mute(isMuted), []);

  const handleClick = useCallback(() => {
    if (options.trigger === 'click' || !options.trigger) {
      toggle();
    }
  }, [toggle, options.trigger]);

  const handleHover = useCallback(() => {
    if (options.trigger === 'hover') {
      play();
    }
  }, [play, options.trigger]);

  const handleHoverEnd = useCallback(() => {
    if (options.trigger === 'hover') {
      pause();
    }
  }, [pause, options.trigger]);

  return {
    state,
    error,
    videoRef: setVideoRef,
    parsedData,
    play,
    pause,
    toggle,
    mute,
    handlers: {
      onClick: handleClick,
      onMouseEnter: handleHover,
      onMouseLeave: handleHoverEnd,
    },
  };
}
