export const uuidToHexColor = (uuid?: string | null): string => {
  if (!uuid) {
    return '#ffffff';
  }
  return `#${uuid.slice(0, 6)}`;
};
