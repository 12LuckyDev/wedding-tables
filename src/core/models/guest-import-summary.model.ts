import { GroupImportSummaryModel } from './group-import-summary.model';
import { Guest } from './guest.model';
import { ReadGuestsFileError } from './read-guests-file-error.enum';

export interface GuestImportSummaryModel {
  groups: GroupImportSummaryModel[];
  newSingleGuests: Guest[];
  existingSingleGuests: Guest[];
  error?: ReadGuestsFileError;
}
