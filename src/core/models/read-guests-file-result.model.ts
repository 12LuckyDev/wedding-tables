import { Guest } from './guest.model';
import { ReadGuestsFileError } from './read-guests-file-error.enum';

export interface ReadGuestsFileResultModel {
  guests: Guest[][];
  error?: ReadGuestsFileError;
}
