import { GroupImportSummaryModel } from './group-import-summary.model';
import { Guest } from './guest.model';

export interface GuestImportSummaryModel {
  groups: GroupImportSummaryModel[];
  newSingleGuests: Guest[];
  existingSingleGuests: Guest[];
}
