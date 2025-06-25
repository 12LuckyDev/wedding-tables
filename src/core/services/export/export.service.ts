import { inject, Injectable } from '@angular/core';
import { WeddingMetadataStore, WeddingStore } from '../../stores';
import { buildExportedContent } from './build-exported-content';
import { ExportConfig, MetadataField, MetadataFieldConfig, MetadataFieldConfigModel } from '../../models';
import { saveAs } from 'file-saver-es';

@Injectable({ providedIn: 'root' })
export class ExportService {
  private readonly _weddingStore = inject(WeddingStore);
  private readonly _metadataStore = inject(WeddingMetadataStore);

  public exportTablesData(config: ExportConfig): void {
    const content = buildExportedContent(
      config,
      this._weddingStore.tables(),
      this._weddingStore.getAllGuestMap(),
      this._metadataStore.booleanFormatters(),
    );
    saveAs(new Blob([content]), 'tables.txt');
  }

  public collectMedatada(): Map<string, MetadataFieldConfig> {
    const guestIds = this._weddingStore.guestIds();
    const allGuests = this._weddingStore.getAllGuestMap();
    const allGuestIds = [...allGuests.keys()];
    const assignedGuests = allGuestIds.filter((id) => !guestIds.includes(id)).map((id) => allGuests.get(id)!);

    const map = new Map<string, MetadataFieldConfig>();
    assignedGuests.forEach(({ metadata }) => {
      if (!metadata) {
        return;
      }

      for (const key in metadata) {
        const value: MetadataField = metadata[key];

        if (!map.has(key)) {
          map.set(key, new MetadataFieldConfigModel(key, value));
          continue;
        }

        const fieldConfig = map.get(key)!;
        fieldConfig.addValue(value);
      }
    });

    return map;
  }
}
