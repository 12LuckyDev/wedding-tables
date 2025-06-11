import { GroupImportSummaryModel, GroupImportType, Guest, GuestImportSummaryModel } from '../../models';
import { readGuestFile } from './read-guest-file';
import { v4 as uuidv4 } from 'uuid';

export const guestsImport = async (file: File, guests: Guest[]): Promise<GuestImportSummaryModel> => {
  const summary: GuestImportSummaryModel = { groups: [], newSingleGuests: [], existingSingleGuests: [] };

  const { guests: newGuests, error } = await readGuestFile(file);

  if (error) {
    summary.error = error;
    return summary;
  }

  newGuests.forEach((guestsRow: Guest[]) => {
    if (guestsRow.length === 1) {
      const existed = guests.find(({ name }) => name === guestsRow[0].name);
      if (existed) {
        summary.existingSingleGuests.push(existed);
      } else {
        summary.newSingleGuests.push(guestsRow[0]);
      }
      return;
    }

    const newGuests: Guest[] = [];
    const existingGuests: Guest[] = [];
    const possibleGroupsGuests: Guest[] = [];

    guestsRow.forEach((guest) => {
      const existed = guests.find(({ name }) => name === guest.name);
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

    const groupSummary: GroupImportSummaryModel = {
      newGuests,
      existingGuests,
      possibleGroupsGuests,
      type,
      groupIds: possibleGroups,
    };

    summary.groups.push(groupSummary);
  });

  return summary;
};
