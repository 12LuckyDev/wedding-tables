import { GroupImportSummaryModel, Guest, GuestImportSummaryModel, Wedding } from '../../../models';
import { buildColor } from '../../../helpers';

const assingExistingGuestsToGroup = (guestMap: Map<string, Guest>, groupId: string, possibleGroupsGuests: Guest[]) => {
  possibleGroupsGuests.forEach(({ id }) => {
    const guest = guestMap.get(id);
    if (!guest) {
      return;
    }
    guestMap.set(id, { ...guest, groupId, color: buildColor(groupId) });
  });
};

export const importGuest = (oldState: Wedding, { groups, newSingleGuests }: GuestImportSummaryModel): Wedding => {
  const { _allGuests: oldAllGuest, guestIds: oldGuestIds } = oldState;
  const newGuest = [...newSingleGuests];
  const newAllGuests = new Map(oldAllGuest);

  groups.forEach(({ groupIds, newGuests, existingGuests }: GroupImportSummaryModel) => {
    const [groupId] = groupIds;
    newGuests.forEach((g) => newGuest.push({ ...g, groupId, color: buildColor(groupId) }));
    if (groupId) {
      assingExistingGuestsToGroup(newAllGuests, groupId, existingGuests);
    }
  });

  newGuest.forEach((guest) => newAllGuests.set(guest.id, guest));
  const guestIds = [...oldGuestIds, ...newGuest.map(({ id }) => id)];
  return { ...oldState, guestIds, _allGuests: newAllGuests };
};
