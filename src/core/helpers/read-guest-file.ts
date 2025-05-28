import { Guest, GuestModel } from '../models';
import { readFileContent } from './read-file-content';

export const readGuestFile = async (file: File): Promise<Guest[][]> => {
  const content = await readFileContent(file);
  const splited = content.split('\n');

  const guests: Guest[][] = [];
  splited.forEach((row) => {
    const rowGuests: Guest[] = [];
    const questNames = row.trim().split(',');
    questNames.forEach((guestName) => {
      const formated = guestName.trim();
      rowGuests.push(new GuestModel(formated));
    });
    guests.push(rowGuests);
  });

  return guests;
};
