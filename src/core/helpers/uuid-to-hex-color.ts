export const uuidToHexColor = (uuid?: string): string => {
  if (!uuid) {
    return 'transparent';
  }
  return `#${uuid.slice(0, 6)}`;
};
