import { inject, Injectable } from '@angular/core';
import { WeddingMetadataStore, WeddingStore } from '../stores';
import { saveAs } from 'file-saver-es';
import selectFiles from 'select-files';
import { readFileContent } from '../helpers/guests-import/read-file-content';
import { Backlog, WeddingMetadataStorage, WeddingStorage } from '../models';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class BacklogService {
  private readonly _toastService = inject(ToastService);
  private readonly _weddingStore = inject(WeddingStore);
  private readonly _weddingMetadataStore = inject(WeddingMetadataStore);

  public exportBacklog(): void {
    const weddingMetadata: WeddingMetadataStorage = this._weddingMetadataStore.exportBacklog();
    const wedding: WeddingStorage = this._weddingStore.exportBacklog();
    const backlog: Backlog = { weddingMetadata, wedding };
    saveAs(new Blob([JSON.stringify(backlog)]), 'backlog.json');
  }

  public async importBacklog(): Promise<void> {
    const files: FileList | null = await selectFiles();
    const file: File | null = files?.[0] ?? null;

    if (!file) {
      return;
    }

    try {
      const content = await readFileContent(file);
      console.log(content);
      // TODO validate format
      const { wedding, weddingMetadata }: Backlog = JSON.parse(content);
      this._weddingMetadataStore.importBacklog(weddingMetadata);
      this._weddingStore.importBacklog(wedding);
    } catch (e) {
      this._toastService.open('BAD FILE FORMAT');
    }
  }
}
