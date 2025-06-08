import { Guest, GuestModel } from '../../models';
import { readFileContent } from './read-file-content';

export const readGuestTxtFile = async (file: File): Promise<Guest[][]> => {
  const content = await readFileContent(file);
  const splited = content.split('\n');

  const guests: Guest[][] = [];
  splited.forEach((row) => {
    const guestsRow: Guest[] = [];
    const questNames = row.trim().split(',');
    questNames.forEach((guestName) => guestsRow.push(new GuestModel(guestName.trim())));
    guests.push(guestsRow);
  });

  return guests;
};
