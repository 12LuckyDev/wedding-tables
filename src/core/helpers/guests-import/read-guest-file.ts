import { ReadGuestsFileError, ReadGuestsFileResultModel } from '../../models';
import { ReadGuestFileFc } from './read-guest-file.type';
import { readGuestJsonFile } from './read-guest-json-file';
import { readGuestTxtFile } from './read-guest-txt-file';

export const readGuestFile: ReadGuestFileFc = async (file: File): Promise<ReadGuestsFileResultModel> => {
  let fileResult: ReadGuestsFileResultModel;

  switch (file.type) {
    case 'text/plain':
      fileResult = await readGuestTxtFile(file);
      break;
    case 'application/json':
      fileResult = await readGuestJsonFile(file);
      break;
    default:
      fileResult = { guests: [], error: ReadGuestsFileError.badFormat };
  }

  return fileResult;
};
