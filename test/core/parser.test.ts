import { describe, it, expect, beforeEach } from 'bun:test';
import { MotionPhotoParser } from '../../src/core/parser';

describe('MotionPhotoParser', () => {
  let parser: MotionPhotoParser;

  beforeEach(() => {
    parser = new MotionPhotoParser();
  });

  it('should detect video offset in Motion Photo binary', async () => {
    // Create fake Motion Photo: [JPEG data][ftyp header][MP4 data]
    const jpegData = new Uint8Array(100).fill(0xff);
    const ftypHeader = new Uint8Array([0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70]);
    const mp4Data = new Uint8Array(50).fill(0x00);

    const combined = new Uint8Array(
      jpegData.length + ftypHeader.length + mp4Data.length
    );
    combined.set(jpegData, 0);
    combined.set(ftypHeader, jpegData.length);
    combined.set(mp4Data, jpegData.length + ftypHeader.length);

    const blob = new Blob([combined], { type: 'image/jpeg' });
    const result = await parser.parse(blob);

    expect(result.hasVideo).toBe(true);
    expect(result.videoSrc).toBeTruthy();
    expect(result.imageSrc).toBeTruthy();
  });

  it('should handle iPhone Live Photo format', async () => {
    const input = {
      imgSrc: 'https://example.com/photo.jpg',
      videoSrc: 'https://example.com/video.mov',
    };

    const result = await parser.parse(input);

    expect(result.hasVideo).toBe(true);
    expect(result.imageSrc).toBe(input.imgSrc);
    expect(result.videoSrc).toBe(input.videoSrc);
  });

  it('should handle URL input (no video)', async () => {
    const result = await parser.parse('https://example.com/photo.jpg');

    expect(result.hasVideo).toBe(false);
    expect(result.imageSrc).toBe('https://example.com/photo.jpg');
    expect(result.videoSrc).toBeNull();
  });
});
