import { Guest, GuestModel, ReadGuestsFileError, ReadGuestsFileResultModel } from '../../models';
import { readFileContent } from './read-file-content';
import { ReadGuestFileType } from './read-guest-file.type';

export const readGuestTxtFile: ReadGuestFileType = async (file: File): Promise<ReadGuestsFileResultModel> => {
  const content = await readFileContent(file);
  const splited = content.split('\n');

  const guests: Guest[][] = [];
  splited.forEach((row) => {
    const guestsRow: Guest[] = [];
    const questNames = row.trim().split(',');
    questNames.forEach((guestName) => {
      const name = guestName.trim();
      if (!!name) {
        guestsRow.push(new GuestModel(name));
      }
    });

    if (guestsRow.length > 0) {
      guests.push(guestsRow);
    }
  });

  if (guests.length > 0) {
    return { guests };
  }

  return { guests, error: ReadGuestsFileError.empty };
};
