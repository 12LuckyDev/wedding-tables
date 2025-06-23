import { WeddingMetadataStorage } from './storage/wedding-metadata-storage.model';
import { WeddingStorage } from './storage/wedding-storage.model';

export interface Backlog {
  wedding: WeddingStorage;
  weddingMetadata: WeddingMetadataStorage;
}
