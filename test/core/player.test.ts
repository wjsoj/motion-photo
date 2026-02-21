import { beforeEach, describe, expect, it } from 'bun:test';
import { Window } from 'happy-dom';
import { LivePhotoPlayer } from '../../src/core/player';

describe('LivePhotoPlayer', () => {
  let player: LivePhotoPlayer;

  beforeEach(() => {
    // Setup DOM
    const window = new Window();
    globalThis.document = window.document;

    player = new LivePhotoPlayer();
  });

  it('should initialize in idle state', () => {
    expect(player.state).toBe('idle');
  });

  it('should load and parse Motion Photo', async () => {
    const fakeBlob = new Blob([new Uint8Array(100)], { type: 'image/jpeg' });
    await player.load(fakeBlob);

    expect(player.state).toBe('ready');
    expect(player.parsedData).toBeTruthy();
  });

  it('should attach video element', () => {
    const video = document.createElement('video');
    player.attachVideo(video);
    // Should not throw
    expect(true).toBe(true);
  });

  it('should handle state transitions', async () => {
    const video = document.createElement('video');
    player.attachVideo(video);

    const states: string[] = [];
    player.on('stateChange', (state) => states.push(state));

    // Create fake Motion Photo with video
    const jpegData = new Uint8Array(100).fill(0xff);
    const ftypHeader = new Uint8Array([0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70]);
    const mp4Data = new Uint8Array(50).fill(0x00);
    const combined = new Uint8Array(jpegData.length + ftypHeader.length + mp4Data.length);
    combined.set(jpegData, 0);
    combined.set(ftypHeader, jpegData.length);
    combined.set(mp4Data, jpegData.length + ftypHeader.length);
    const blob = new Blob([combined], { type: 'image/jpeg' });

    await player.load(blob);
    expect(states).toContain('parsing');
    expect(states).toContain('ready');
  });
});
