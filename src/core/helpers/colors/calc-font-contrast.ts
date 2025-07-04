export const calcFontContrast = (hexcolor: string): string => {
  if (hexcolor === '#ffffff') {
    return '#000000';
  }

  const cleanHex = hexcolor.replace('#', '');

  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? '#000000' : '#ffffff';
};
