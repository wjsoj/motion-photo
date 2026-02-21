import type { LivePhotoConfig, MotionPhotoInput } from '../core';

type CustomComponent<T> = React.ComponentType<T> | string;

interface RenderPropComponent<T> {
  render: (props: T) => React.ReactNode;
}

export type LoadingComponent =
  | CustomComponent<{ progress?: number }>
  | RenderPropComponent<{ progress?: number }>;
export type ErrorComponent =
  | CustomComponent<{ error: Error; retry?: () => void }>
  | RenderPropComponent<{ error: Error; retry?: () => void }>;

export interface ReactLivePhotoConfig extends LivePhotoConfig {
  components?: {
    loading?: LoadingComponent;
    error?: ErrorComponent;
  };
}

export interface UseLivePhotoOptions extends Partial<ReactLivePhotoConfig> {
  src: MotionPhotoInput;
}
