import type { MotionPhotoInput, ParsedMotionPhoto } from './types';

function formatBytes(bytes: number): string {
  const KB = 1024;
  const MB = KB * 1024;

  if (bytes < KB) return `${bytes} B`;
  if (bytes < MB) return `${(bytes / KB).toFixed(1)} KB`;
  return `${(bytes / MB).toFixed(1)} MB`;
}

export class MotionPhotoParser {
  private debugLog: ((message: string) => void) | null = null;

  setDebugLogger(logger: (message: string) => void): void {
    this.debugLog = logger;
  }

  private log(message: string): void {
    this.debugLog?.(message);
  }

  async parse(input: MotionPhotoInput): Promise<ParsedMotionPhoto> {
    // iPhone Live Photo format (already split)
    if (typeof input === 'object' && 'imgSrc' in input && 'videoSrc' in input) {
      this.log('Input is iPhone Live Photo format (pre-split)');
      return {
        imageSrc: input.imgSrc,
        videoSrc: input.videoSrc,
        hasVideo: true,
      };
    }

    // URL (no parsing needed)
    if (typeof input === 'string') {
      this.log(`Input is URL: ${input}`);
      return {
        imageSrc: input,
        videoSrc: null,
        hasVideo: false,
      };
    }

    // Parse binary Motion Photo (File or Blob)
    this.log(
      `Parsing binary file: ${input instanceof File ? input.name : 'Blob'}, size: ${input.size} bytes`
    );

    const arrayBuffer = await input.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    this.log(`ArrayBuffer size: ${bytes.length} bytes`);

    // METHOD 1: Try XMP metadata approach (Google's official way)
    const microVideoOffset = this.parseMicroVideoOffsetFromXMP(bytes);

    if (microVideoOffset !== null && microVideoOffset > 0) {
      this.log(
        `Found MicroVideoOffset in XMP: ${microVideoOffset} (video size: ${formatBytes(microVideoOffset)})`
      );

      const splitIndex = input.size - microVideoOffset;
      this.log(
        `Split index: ${splitIndex} (image ends at ${splitIndex}, video starts at ${splitIndex})`
      );

      if (splitIndex > 0 && splitIndex < input.size) {
        const imageBlob = input.slice(0, splitIndex, 'image/jpeg');
        const videoBlob = input.slice(splitIndex, input.size, 'video/mp4');

        this.log(`Created image blob: ${imageBlob.size} bytes`);
        this.log(`Created video blob: ${videoBlob.size} bytes`);

        return {
          imageSrc: URL.createObjectURL(imageBlob),
          videoSrc: URL.createObjectURL(videoBlob),
          hasVideo: true,
        };
      }
      this.log(`Invalid MicroVideoOffset: splitIndex=${splitIndex}, fileSize=${input.size}`);
    } else {
      this.log('No MicroVideoOffset found in XMP metadata');
    }

    // METHOD 2: Fallback to searching for ftyp marker (less reliable)
    this.log('Trying fallback method: searching for ftyp marker...');
    const ftypOffset = this.findVideoOffset(bytes);

    if (ftypOffset === -1) {
      this.log('No ftyp marker found - this is a static image');
      const imageBlob = new Blob([bytes], { type: 'image/jpeg' });
      return {
        imageSrc: URL.createObjectURL(imageBlob),
        videoSrc: null,
        hasVideo: false,
      };
    }

    this.log(`Found ftyp marker at offset: ${ftypOffset} (0x${ftypOffset.toString(16)})`);

    // Search backwards for JPEG end marker
    let splitPoint = ftypOffset;
    for (let i = ftypOffset - 1; i >= Math.max(0, ftypOffset - 100); i--) {
      if (bytes[i] === 0xd9 && i > 0 && bytes[i - 1] === 0xff) {
        splitPoint = i + 1;
        this.log(`Found JPEG end marker at: ${i}, split point: ${splitPoint}`);
        break;
      }
    }

    const imageBlob = new Blob([bytes.slice(0, splitPoint)], { type: 'image/jpeg' });
    const videoBlob = new Blob([bytes.slice(splitPoint)], { type: 'video/mp4' });

    this.log(`Created image blob: ${imageBlob.size} bytes`);
    this.log(`Created video blob: ${videoBlob.size} bytes`);

    return {
      imageSrc: URL.createObjectURL(imageBlob),
      videoSrc: URL.createObjectURL(videoBlob),
      hasVideo: true,
    };
  }

  private parseMicroVideoOffsetFromXMP(bytes: Uint8Array): number | null {
    this.log('Searching for video offset in XMP metadata...');

    const xmpStart = this.findXMPStart(bytes);
    if (xmpStart === -1) {
      this.log('No XMP metadata found');
      return null;
    }

    this.log(`Found XMP at offset: ${xmpStart}`);

    const xmpEnd = Math.min(xmpStart + 65536, bytes.length);
    const xmpBytes = bytes.slice(xmpStart, xmpEnd);
    const xmpText = new TextDecoder('utf-8').decode(xmpBytes);

    this.log(`XMP text length: ${xmpText.length} characters`);
    this.log(`XMP snippet (first 500 chars):\n${xmpText.substring(0, 500)}`);

    // Try Item:Length patterns first (V2 format)
    this.log('Searching for Item:Length patterns in XMP...');
    const hasItemLength = xmpText.includes('Item:Length');
    this.log(`XMP contains "Item:Length": ${hasItemLength}`);

    if (hasItemLength) {
      const linesWithLength = xmpText.split('\n').filter((line) => line.includes('Item:Length'));
      this.log(`Found ${linesWithLength.length} lines with "Item:Length":`);
      for (const line of linesWithLength.slice(0, 5)) {
        this.log(`  ${line.trim()}`);
      }
    }

    const itemLengthMatches = Array.from(xmpText.matchAll(/Item:Length\s*=\s*"(\d+)"/g));
    this.log(`matchAll result: found ${itemLengthMatches.length} matches`);

    if (itemLengthMatches.length > 0) {
      const allLengths = itemLengthMatches.map((m) => Number.parseInt(m[1], 10));
      const maxLength = Math.max(...allLengths);
      this.log(
        `Found ${itemLengthMatches.length} Item:Length values, max is ${maxLength} (${formatBytes(maxLength)})`
      );
      this.log(`All lengths: ${allLengths.join(', ')}`);
      this.log(`Using largest Item:Length as video size: ${maxLength}`);

      // Video should be at least 100KB to be real motion video
      if (maxLength > 100000) {
        return maxLength;
      }
      this.log(`Largest Item:Length (${maxLength}) is too small, may not be main video`);
    }

    // Try other patterns
    const patterns = [
      /GCamera:MicroVideoOffset="(\d+)"/,
      /GCamera:MicroVideoOffset=(\d+)(?:\s|>|")/,
      /GCamera:MotionPhoto=(\d+)/,
      /MicroVideoOffset="(\d+)"/,
      /MicroVideoOffset=(\d+)(?:\s|>|")/,
      /MotionPhotoVideoOffset="(\d+)"/,
      /MotionPhotoVideoOffset=(\d+)(?:\s|>|")/,
      /VideoSize="(\d+)"/,
      /VideoSize=(\d+)(?:\s|>")/,
      /VideoLength="(\d+)"/,
      /VideoLength=(\d+)(?:\s|>")/,
    ];

    for (const pattern of patterns) {
      const match = xmpText.match(pattern);
      if (match) {
        const offset = Number.parseInt(match[1], 10);
        this.log(`Match found with pattern: ${pattern}`);
        this.log(`Video offset/size value: ${offset} (${formatBytes(offset)})`);
        return offset;
      }
    }

    this.log('No suitable video offset found in XMP, trying alternative approach...');
    return null;
  }

  private findXMPStart(bytes: Uint8Array): number {
    // XMP typically starts with: http://ns.adobe.com/xap/1.0/
    // We'll search for this signature in the first 100KB
    const signature = 'http://ns.adobe.com/xap/1.0/';
    const signatureBytes = new TextEncoder().encode(signature);
    const searchLimit = Math.min(bytes.length, 102400);

    for (let i = 0; i < searchLimit - signatureBytes.length; i++) {
      let match = true;
      for (let j = 0; j < signatureBytes.length; j++) {
        if (bytes[i + j] !== signatureBytes[j]) {
          match = false;
          break;
        }
      }
      if (match) {
        return i;
      }
    }

    return -1;
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
