import { Guest, GuestModel, ReadGuestsFileError, ReadGuestsFileResultModel, UnparsedMetadata } from '../../models';
import { parseMetadata } from './parse-metadata';
import { readFileContent } from './read-file-content';
import { ReadGuestFileFc } from './read-guest-file.type';

const handleStringRow = (row: string, list: Guest[]): void => {
  list.push(new GuestModel(row.trim()));
};

const handleObjectRow = (row: object, list: Guest[]): void => {
  if (!('name' in row)) {
    return;
  }

  if (typeof row.name !== 'string') {
    return;
  }

  const guestObj: { name: string; metadata: UnparsedMetadata } = row as {
    name: string;
    metadata: UnparsedMetadata;
  };

  const guest = new GuestModel(guestObj.name.trim());
  if (typeof guestObj.metadata === 'object') {
    const meta = parseMetadata(guestObj.metadata);
    if (meta) {
      guest.metadata = meta;
    }
  }

  list.push(guest);
};

const handleArrayRow = (row: unknown[], list: Guest[]): void => {
  row.forEach((el: unknown) => {
    if (!el) {
      return;
    }

    if (typeof el === 'string') {
      handleStringRow(el, list);
    } else if (typeof el === 'object' && !Array.isArray(el)) {
      handleObjectRow(el, list);
    }
  });
};

export const readGuestJsonFile: ReadGuestFileFc = async (file: File): Promise<ReadGuestsFileResultModel> => {
  const content = await readFileContent(file);
  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch (e) {
    return { guests: [], error: ReadGuestsFileError.barJsonFormat };
  }

  if (!Array.isArray(parsed)) {
    return { guests: [], error: ReadGuestsFileError.notAnArray };
  }

  const guests: Guest[][] = [];
  parsed.forEach((row: unknown) => {
    if (!row) {
      return;
    }
    const guestsRow: Guest[] = [];

    if (typeof row === 'string') {
      handleStringRow(row, guestsRow);
    } else if (typeof row === 'object') {
      if (Array.isArray(row)) {
        handleArrayRow(row, guestsRow);
      } else {
        handleObjectRow(row, guestsRow);
      }
    }

    if (guestsRow.length > 0) {
      guests.push(guestsRow);
    }
  });

  if (guests.length > 0) {
    return { guests };
  }

  return { guests, error: ReadGuestsFileError.empty };
};
