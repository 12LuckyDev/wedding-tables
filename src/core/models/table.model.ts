import { Guest } from './guest.model';

export interface Table {
  number: number;
  size: number;
  chairs: (Guest | null)[];
}
