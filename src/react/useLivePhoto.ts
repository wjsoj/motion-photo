import { useEffect, useRef, useState, useCallback } from 'react';
import {
  LivePhotoPlayer,
  LivePhotoConfig,
  MotionPhotoInput,
  PlayerState,
} from '../core';

export interface UseLivePhotoOptions extends Partial<LivePhotoConfig> {
  src: MotionPhotoInput;
}

export function useLivePhoto(options: UseLivePhotoOptions) {
  const [state, setState] = useState<PlayerState>('idle');
  const [error, setError] = useState<Error | null>(null);
  const playerRef = useRef<LivePhotoPlayer | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const { src, ...config } = options;
    const player = new LivePhotoPlayer(config);
    playerRef.current = player;

    player.on('stateChange', (newState) => setState(newState));
    player.on('error', (err) => setError(err));

    player.load(src);

    return () => {
      player.destroy();
    };
  }, [options.src]);

  useEffect(() => {
    if (videoRef.current && playerRef.current) {
      playerRef.current.attachVideo(videoRef.current);
    }
  }, [videoRef.current]);

  const play = useCallback(() => playerRef.current?.play(), []);
  const pause = useCallback(() => playerRef.current?.pause(), []);
  const toggle = useCallback(() => playerRef.current?.toggle(), []);
  const mute = useCallback(
    (isMuted: boolean) => playerRef.current?.mute(isMuted),
    []
  );

  const handleClick = useCallback(() => {
    if (options.trigger === 'click') {
      toggle();
    }
  }, [options.trigger, toggle]);

  const handleHover = useCallback(() => {
    if (options.trigger === 'hover') {
      play();
    }
  }, [options.trigger, play]);

  const handleHoverEnd = useCallback(() => {
    if (options.trigger === 'hover') {
      pause();
    }
  }, [options.trigger, pause]);

  return {
    state,
    error,
    videoRef,
    parsedData: playerRef.current?.parsedData,
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
