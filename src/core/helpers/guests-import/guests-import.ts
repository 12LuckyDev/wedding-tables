import {
  GroupImportSummaryModel,
  GroupImportType,
  Guest,
  GuestImportSummaryModel,
  ReadGuestsFileError,
} from '../../models';
import { readGuestFile } from './read-guest-file';
import { v4 as uuidv4 } from 'uuid';

export const guestsImport = async (
  file: File,
  allGuest: Guest[],
  replace: boolean,
): Promise<GuestImportSummaryModel> => {
  const findGuest = (guest: Guest): Guest | null => {
    if (replace) {
      return null;
    }
    return allGuest.find(({ name }) => name === guest.name) ?? null;
  };

  const summary = new GuestImportSummaryModel(replace);

  const { guests: newGuests, error } = await readGuestFile(file);

  if (error) {
    summary.error = error;
    return summary;
  }

  newGuests.forEach((guestsRow: Guest[]) => {
    if (guestsRow.length === 1) {
      const existed = findGuest(guestsRow[0]);
      if (existed) {
        summary.existingSingleGuests.push(existed);
      } else {
        summary.newSingleGuests.push(guestsRow[0]);
      }
      return;
    }

    buildGuestGroupImport(guestsRow, findGuest, (groupSummary) => summary.groups.push(groupSummary));
  });

  if (summary.groups.length === 0 && summary.newSingleGuests.length === 0) {
    summary.error = ReadGuestsFileError.nothingToImport;
  }

  return summary;
};

const buildGuestGroupImport = (
  guestsRow: Guest[],
  findGuest: (guest: Guest) => Guest | null,
  addGroup: (group: GroupImportSummaryModel) => void,
) => {
  const newGuests: Guest[] = [];
  const existingGuests: Guest[] = [];
  const possibleGroupsGuests: Guest[] = [];

  guestsRow.forEach((guest) => {
    const existed = findGuest(guest);
    if (!existed) {
      newGuests.push(guest);
      return;
    }

    if (existed.groupId) {
      possibleGroupsGuests.push(existed);
    } else {
      existingGuests.push(existed);
    }
  });

  const possibleGroups: string[] = possibleGroupsGuests
    .map(({ groupId }) => groupId)
    .filter((groupId) => !!groupId) as string[];

  let type: GroupImportType;
  if (possibleGroups.length > 0) {
    type = possibleGroups.length > 1 ? GroupImportType.manyGroups : GroupImportType.existingGroup;
  } else {
    possibleGroups.push(uuidv4());
    type = GroupImportType.newGroup;
  }

  if (newGuests.length > 0) {
    addGroup({
      newGuests,
      existingGuests,
      possibleGroupsGuests,
      type,
      groupIds: possibleGroups,
    });
  }
};
