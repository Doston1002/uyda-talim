export function getDisplayFileName(originalname?: string, filename?: string): string {
  if (!originalname && !filename) return 'Fayl';

  const name = originalname || filename || '';

  // Mojibake (latin-1 decoded UTF-8) fix
  if (/[ÐÑÃ]/.test(name)) {
    try {
      const bytes = new Uint8Array(Array.from(name, c => c.charCodeAt(0)));
      const decoded = new TextDecoder('utf-8').decode(bytes);
      if (decoded && !/[ÐÑÃ]/.test(decoded)) return decoded;
    } catch {
      /* fallback to filename */
    }
  }

  if (name && /^[\x20-\x7E\u0400-\u04FF\u0100-\u024F\u1E00-\u1EFF]+$/.test(name)) {
    return name;
  }

  return filename || name || 'Fayl';
}
