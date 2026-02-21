import type React from 'react';

export interface LiveBadgeIconProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number;
  color?: string;
}

export function LiveBadgeIcon({
  size = 24,
  color = 'currentColor',
  ...props
}: LiveBadgeIconProps): React.ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="3" fill={color} />
      <circle cx="12" cy="12" r="6" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

export interface PlayIconProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number;
  color?: string;
}

export function PlayIcon({
  size = 24,
  color = 'currentColor',
  ...props
}: PlayIconProps): React.ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export interface PauseIconProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number;
  color?: string;
}

export function PauseIcon({
  size = 24,
  color = 'currentColor',
  ...props
}: PauseIconProps): React.ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  );
}

export interface VolumeIconProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number;
  color?: string;
  muted?: boolean;
}

export function VolumeIcon({
  size = 24,
  color = 'currentColor',
  muted = false,
  ...props
}: VolumeIconProps): React.ReactElement {
  if (muted) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        {...props}
      >
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}

export interface LoadingIconProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number;
  color?: string;
}

export function LoadingIcon({
  size = 24,
  color = 'currentColor',
  ...props
}: LoadingIconProps): React.ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="4" strokeOpacity="0.3" />
      <path d="M12 2C6.48 2 2 6.48 2 12" stroke={color} strokeWidth="4" strokeLinecap="round">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}

export interface ErrorIconProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number;
  color?: string;
}

export function ErrorIcon({
  size = 24,
  color = 'currentColor',
  ...props
}: ErrorIconProps): React.ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  );
}

export interface RetryIconProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number;
  color?: string;
}

export function RetryIcon({
  size = 24,
  color = 'currentColor',
  ...props
}: RetryIconProps): React.ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
    </svg>
  );
}

export interface RingBadgeIconProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number;
  color?: string;
}

export function RingBadgeIcon({
  size = 24,
  color = 'currentColor',
  ...props
}: RingBadgeIconProps): React.ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="8" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="12" cy="12" r="3" fill={color} />
    </svg>
  );
}
