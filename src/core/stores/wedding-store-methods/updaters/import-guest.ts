import { GroupImportSummaryModel, Guest, GuestImportSummaryModel, Wedding } from '../../../models';
import { buildColor } from '../../../helpers';
import { mappify } from '@12luckydev/utils';
import { moveAllGuestOutOfTable } from '../helpers/move-all-guests-out-of-table';

export const importGuest = (oldState: Wedding, summary: GuestImportSummaryModel): Wedding => {
  return summary.replace ? importAndReplaceGuest(oldState, summary) : importAndAddGuest(oldState, summary);
};

const importAndReplaceGuest = (oldState: Wedding, { groups, newSingleGuests }: GuestImportSummaryModel): Wedding => {
  const allNewGuests = [...newSingleGuests];

  groups.forEach(({ groupIds, newGuests }: GroupImportSummaryModel) => {
    const [groupId] = groupIds;
    newGuests.forEach((g) => allNewGuests.push({ ...g, groupId, color: buildColor(groupId) }));
  });

  const _allGuests = mappify(allNewGuests, 'id');
  const [tables] = moveAllGuestOutOfTable(oldState.tables);
  return { ...oldState, tables, guestIds: [..._allGuests.keys()], _allGuests };
};

const importAndAddGuest = (oldState: Wedding, { groups, newSingleGuests }: GuestImportSummaryModel): Wedding => {
  const { _allGuests: oldAllGuest, guestIds: oldGuestIds } = oldState;
  const allNewGuests = [...newSingleGuests];
  const newGuestMap = new Map(oldAllGuest);

  groups.forEach(({ groupIds, newGuests, existingGuests }: GroupImportSummaryModel) => {
    const [groupId] = groupIds;
    newGuests.forEach((g) => allNewGuests.push({ ...g, groupId, color: buildColor(groupId) }));
    if (groupId) {
      assingExistingGuestsToGroup(newGuestMap, groupId, existingGuests);
    }
  });

  allNewGuests.forEach((guest) => newGuestMap.set(guest.id, guest));
  const guestIds = [...oldGuestIds, ...allNewGuests.map(({ id }) => id)];
  return { ...oldState, guestIds, _allGuests: newGuestMap };
};

const assingExistingGuestsToGroup = (guestMap: Map<string, Guest>, groupId: string, possibleGroupsGuests: Guest[]) => {
  possibleGroupsGuests.forEach(({ id }) => {
    const guest = guestMap.get(id);
    if (!guest) {
      return;
    }
    guestMap.set(id, { ...guest, groupId, color: buildColor(groupId) });
  });
};
