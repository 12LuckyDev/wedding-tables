import { GroupImportType } from './group-import-type.enum';
import { Guest } from './guest.model';

export interface GroupImportSummaryModel {
  newGuests: Guest[];
  possibleGroupsGuests: Guest[];
  existingGuests: Guest[];
  type: GroupImportType;
  groupIds: string[];
}
