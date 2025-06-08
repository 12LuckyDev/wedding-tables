import { Guest } from '../../models';

export type ReadGuestFileType = (file: File) => Promise<Guest[][]>;
