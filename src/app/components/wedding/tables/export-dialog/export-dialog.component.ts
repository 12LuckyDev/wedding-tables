import { Component, computed, inject, Signal } from '@angular/core';
import { WeddingStore } from '../../../../../core/stores';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ExportConfig, MetadataFieldConfig, Table } from '../../../../../core/models';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { saveAs } from 'file-saver';

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
  ],
  templateUrl: './export-dialog.component.html',
  styleUrl: './export-dialog.component.scss',
})
export class ExportDialogComponent {
  private readonly _dialogRef = inject(MatDialogRef<ExportDialogComponent>);
  private readonly _weddingStore = inject(WeddingStore);

  public readonly allGuestCount: Signal<number> = this._weddingStore.allGuestCount;
  public readonly seatedCount: Signal<number> = computed(() => this._weddingStore.guests().length);
  public readonly tables: Signal<Table[]> = this._weddingStore.tables;

  private _metaKeys: string[] = [];
  public readonly columns: string[] = ['key', 'name'];
  private _exportForm: FormGroup;
  private _metadataConfig!: Map<string, MetadataFieldConfig>;

  constructor() {
    // TODO - hide metadata related if no metadata
    this._exportForm = new FormGroup({
      anonymize: new FormControl(false),
      showMetadata: new FormControl(true),
      saveMetaConfig: new FormControl(false),
    });

    this.setMetaForm();
  }

  public get exportForm(): FormGroup {
    return this._exportForm;
  }

  public get isValid(): boolean {
    return this._exportForm.valid;
  }

  public get metaKeys(): string[] {
    return this._metaKeys;
  }

  public nameHasRequiredError(key: string): boolean {
    return this._exportForm.get(`meta.${key}.name`)?.hasError('required') ?? false;
  }

  private setMetaForm(): void {
    this._metadataConfig = this._weddingStore.collectMedatada();
    if (this._metadataConfig.size === 0) {
      return;
    }
    const metaForm = new FormGroup({});
    this._exportForm.addControl('meta', metaForm);

    this._metadataConfig.forEach((metaConfig, metaName) => {
      this._metaKeys.push(metaName);
      metaForm.addControl(
        metaName,
        new FormGroup({
          hidden: new FormControl(metaConfig.hidden),
          name: new FormControl(metaConfig.name, [Validators.required]),
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
        config.name = keyRawValue.name;
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
