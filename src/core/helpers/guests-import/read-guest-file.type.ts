import { ReadGuestsFileResultModel } from '../../models';

export type ReadGuestFileType = (file: File) => Promise<ReadGuestsFileResultModel>;
