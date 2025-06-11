import { Guest } from './guest.model';
import { MetadataRegistry } from './metadata.type';
import { ReadGuestsFileError } from './read-guests-file-error.enum';

export interface ReadGuestsFileResultModel {
  guests: Guest[][];
  metadataRegistry?: MetadataRegistry;
  error?: ReadGuestsFileError;
}
