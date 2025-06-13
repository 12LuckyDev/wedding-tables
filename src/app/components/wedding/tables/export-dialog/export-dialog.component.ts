import { Component, computed, DestroyRef, inject, Signal } from '@angular/core';
import { WeddingStore } from '../../../../../core/stores';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ExportConfig, MetadataFieldConfig, Table } from '../../../../../core/models';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { saveAs } from 'file-saver';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-export-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatCardModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './export-dialog.component.html',
  styleUrl: './export-dialog.component.scss',
})
export class ExportDialogComponent {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _dialogRef = inject(MatDialogRef<ExportDialogComponent>);
  private readonly _weddingStore = inject(WeddingStore);

  public readonly allGuestCount: Signal<number> = this._weddingStore.allGuestCount;
  public readonly seatedCount: Signal<number> = computed(() => this._weddingStore.guests().length);
  public readonly tables: Signal<Table[]> = this._weddingStore.tables;

  private _metaKeys: string[] = [];
  public readonly columns: string[] = ['key', 'hidden', 'label'];
  private _exportForm: FormGroup;
  private _metadataConfig!: Map<string, MetadataFieldConfig>;

  constructor() {
    this._exportForm = new FormGroup({
      anonymize: new FormControl(false),
    });

    this.setMetaForm();
  }

  public get exportForm(): FormGroup {
    return this._exportForm;
  }

  public get isValid(): boolean {
    return this._exportForm.valid;
  }

  public get hasMetadata(): boolean {
    return this._metaKeys.length > 0;
  }

  public get metaKeys(): string[] {
    return this._metaKeys;
  }

  public getLabelControl(key: string): FormControl | null {
    return this._exportForm.get(`meta.${key}.label`) as FormControl | null;
  }

  public getHiddenControl(key: string): FormControl | null {
    return this._exportForm.get(`meta.${key}.hidden`) as FormControl | null;
  }

  private setMetaForm(): void {
    this._metadataConfig = this._weddingStore.collectMedatada();
    if (this._metadataConfig.size === 0) {
      return;
    }

    const showMetadataControl = new FormControl(true);
    const saveMetaConfigControl = new FormControl(false);
    this._exportForm.addControl('showMetadata', showMetadataControl);
    this._exportForm.addControl('saveMetaConfig', saveMetaConfigControl);
    showMetadataControl.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((showMetadata) => {
      if (showMetadata) {
        saveMetaConfigControl.enable();
      } else {
        saveMetaConfigControl.setValue(false);
        saveMetaConfigControl.disable();
      }
    });

    const metaForm = new FormGroup({});
    this._exportForm.addControl('meta', metaForm);

    this._metadataConfig.forEach((metaConfig, metaName) => {
      this._metaKeys.push(metaName);
      metaForm.addControl(
        metaName,
        new FormGroup({
          hidden: new FormControl(metaConfig.hidden),
          label: new FormControl(metaConfig.label),
        }),
      );
    });
  }

  private applyFormToConfig(): void {
    this._metadataConfig.forEach((config, key) => {
      const keyGroup = this._exportForm.get(`meta.${key}`);
      if (keyGroup) {
        const keyRawValue = keyGroup.getRawValue();
        config.hidden = keyRawValue.hidden;
        config.label = keyRawValue.label;
      }
    });
  }

  public accept(): void {
    this.applyFormToConfig();
    const { anonymize, showMetadata } = this._exportForm.getRawValue();

    const config: ExportConfig = { anonymize, showMetadata, metadataConfig: this._metadataConfig };
    const content = this._weddingStore.exportTables(config);
    saveAs(new Blob([content]), 'tables.txt');
    this._dialogRef.close();
  }

  public cancel(): void {
    this._dialogRef.close();
  }
}
