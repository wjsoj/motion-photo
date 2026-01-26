import type { MotionPhotoInput, ParsedMotionPhoto } from './types';

export class MotionPhotoParser {
  async parse(input: MotionPhotoInput): Promise<ParsedMotionPhoto> {
    // iPhone Live Photo format (already split)
    if (typeof input === 'object' && 'imgSrc' in input && 'videoSrc' in input) {
      return {
        imageSrc: input.imgSrc,
        videoSrc: input.videoSrc,
        hasVideo: true,
      };
    }

    // URL (no parsing needed)
    if (typeof input === 'string') {
      return {
        imageSrc: input,
        videoSrc: null,
        hasVideo: false,
      };
    }

    // Parse binary Motion Photo (File or Blob)
    const arrayBuffer = await input.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Search for 'ftyp' header (MP4 marker)
    const videoOffset = this.findVideoOffset(bytes);

    if (videoOffset === -1) {
      // No video found, return image only
      const imageBlob = new Blob([bytes], { type: 'image/jpeg' });
      return {
        imageSrc: URL.createObjectURL(imageBlob),
        videoSrc: null,
        hasVideo: false,
      };
    }

    // Split into image and video
    const imageBlob = new Blob([bytes.slice(0, videoOffset)], { type: 'image/jpeg' });
    const videoBlob = new Blob([bytes.slice(videoOffset)], { type: 'video/mp4' });

    return {
      imageSrc: URL.createObjectURL(imageBlob),
      videoSrc: URL.createObjectURL(videoBlob),
      hasVideo: true,
    };
  }

  private findVideoOffset(bytes: Uint8Array): number {
    // MP4 ftyp header: bytes[i+4] === 0x66 ('f')
    for (let i = 0; i < bytes.length - 8; i++) {
      if (
        bytes[i + 4] === 0x66 && // 'f'
        bytes[i + 5] === 0x74 && // 't'
        bytes[i + 6] === 0x79 && // 'y'
        bytes[i + 7] === 0x70 // 'p'
      ) {
        return i;
      }
    }
    return -1;
  }

  revokeURL(url: string): void {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }
}
