import { readFileContent } from './read-file-content';

export const readGuestFile = async (file: File): Promise<string[][]> => {
  const content = await readFileContent(file);
  const splited = content.split('\n');

  const guests: string[][] = [];
  splited.forEach((row) => {
    const guestsRow: string[] = [];
    const questNames = row.trim().split(',');
    questNames.forEach((guestName) => guestsRow.push(guestName.trim()));
    guests.push(guestsRow);
  });

  return guests;
};
