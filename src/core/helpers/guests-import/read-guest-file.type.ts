import { ReadGuestsFileResultModel } from '../../models';

export type ReadGuestFileFc = (file: File) => Promise<ReadGuestsFileResultModel>;
