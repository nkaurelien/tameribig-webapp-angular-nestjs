import { extname } from 'node:path';

export class ImageHelper {
  static extractExtension(filename: string): string {
    const ext = extname(filename);
    return ext ? ext.slice(1).toLowerCase() : '';
  }

  static isImageMimeType(mimetype: string): boolean {
    return mimetype.startsWith('image/');
  }

  static isAllowedImageType(
    mimetype: string,
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ): boolean {
    return allowedTypes.includes(mimetype);
  }

  static getImageDimensions(
    buffer: Buffer,
  ): { width: number; height: number } | null {
    // PNG signature check
    if (buffer[0] === 0x89 && buffer[1] === 0x50) {
      return {
        width: buffer.readUInt32BE(16),
        height: buffer.readUInt32BE(20),
      };
    }

    // JPEG check
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      let offset = 2;
      while (offset < buffer.length) {
        if (buffer[offset] !== 0xff) break;
        const marker = buffer[offset + 1];
        if (marker === 0xc0 || marker === 0xc2) {
          return {
            height: buffer.readUInt16BE(offset + 5),
            width: buffer.readUInt16BE(offset + 7),
          };
        }
        offset += 2 + buffer.readUInt16BE(offset + 2);
      }
    }

    return null;
  }
}
