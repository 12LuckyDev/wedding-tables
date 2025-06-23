import { GroupImportSummaryModel } from './group-import-summary.model';
import { Guest } from './guest.model';
import { ReadGuestsFileError } from './read-guests-file-error.enum';

export class GuestImportSummaryModel {
  replace: boolean;
  groups: GroupImportSummaryModel[] = [];
  newSingleGuests: Guest[] = [];
  existingSingleGuests: Guest[] = [];
  error?: ReadGuestsFileError;

  constructor(replace: boolean) {
    this.replace = replace;
  }
}
