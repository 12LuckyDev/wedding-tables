import { Guest, GuestModel } from '../../models';
import { readFileContent } from './read-file-content';
import { ReadGuestFileType } from './read-guest-file.type';

export const readGuestTxtFile: ReadGuestFileType = async (file: File): Promise<Guest[][]> => {
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
