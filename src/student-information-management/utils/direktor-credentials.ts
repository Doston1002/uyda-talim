export function getFirst4Letters(text: string): string {
  const letters = text
    .toLowerCase()
    .replace(/[''`ʻʼ]/g, '')
    .replace(/[^a-z]/g, '');

  return letters.slice(0, 4);
}

export function buildDirektorEmail(
  region: string,
  district: string,
  schoolNumber: string,
): string {
  const regionPart = getFirst4Letters(region);
  const districtPart = getFirst4Letters(district);
  const numberPart = schoolNumber.replace(/\D/g, '');

  if (!regionPart || !districtPart || !numberPart) {
    return '';
  }

  return `${regionPart}${districtPart}${numberPart}@gmail.com`;
}

export function generatePassword(length = 10): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  return Array.from(array, (x) => chars[x % chars.length]).join('');
}
