import { move } from '@12luckydev/utils';
import { Wedding } from '../../../models';

export const moveGuestInList = (oldState: Wedding, from: number, to: number): Wedding => {
  const { guestIds } = oldState;
  return { ...oldState, guestIds: move(guestIds, from, to) };
};
