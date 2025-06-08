import { mappify } from '@12luckydev/utils';
import { GroupImportType, GuestImportSummaryModel, Wedding } from '../../models';
import { buildColor } from '../../helpers';

export const importGuest = (oldState: Wedding, { groups, newSingleGuests }: GuestImportSummaryModel): Wedding => {
  const { _allGuests: oldAllGuest, guestIds: oldGuestIds } = oldState;
  const newGuest = [...newSingleGuests];

  groups.forEach((group) => {
    switch (group.type) {
      case GroupImportType.newGroup:
      case GroupImportType.existingGroup: //TODO add group to existing guests
        const [groupId] = group.groupIds;
        group.newGuests.forEach((g) => newGuest.push({ ...g, groupId, color: buildColor(groupId) }));
        break;
      case GroupImportType.manyGroups:
        //TODO
        break;
    }
  });

  const allGuests = mappify([...oldAllGuest.values(), ...newGuest], 'id');
  const guestIds = [...oldGuestIds, ...newGuest.map(({ id }) => id)];
  return { ...oldState, guestIds, _allGuests: allGuests };
};
