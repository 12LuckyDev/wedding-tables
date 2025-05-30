import { Guest } from './guest.model';

export interface GuestDragData {
  guest: Guest;
  tableNumber: number | null;
  chairIndex: number | null;
}
