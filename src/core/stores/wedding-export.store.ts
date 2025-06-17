import { inject } from '@angular/core';
import { signalStore, withProps, withMethods } from '@ngrx/signals';
import { WeddingStore } from './wedding.store';
import { WeddingMetadataStore } from './wedding-metadata.store';
import { ExportConfig } from '../models';
import { exportTables } from './export-store-methods/export-tables';

export const WeddingExportStore = signalStore(
  withProps(() => ({
    weddingStore: inject(WeddingStore),
    metadataStore: inject(WeddingMetadataStore),
  })),
  withMethods(({ weddingStore, metadataStore }) => ({
    exportTables(config: ExportConfig): string {
      return exportTables(
        config,
        weddingStore.tables(),
        weddingStore.getAllGuestMap(),
        metadataStore.booleanFormatters(),
      );
    },
  })),
);
