import { Component, computed, inject, Signal } from '@angular/core';
import { WeddingStore } from '../../../../../core/stores';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ExportConfig, MetadataFieldConfig, Table } from '../../../../../core/models';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { saveAs } from 'file-saver';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BooleanFormatterDialogComponent } from './boolean-formatter-dialog/boolean-formatter-dialog.component';
import { WeddingMetadataStore } from '../../../../../core/stores/wedding-metadata.store';
import { DIALOG_IMPORTS, DialogFormBaseComponent, FORM_DIALOG_IMPORTS } from '../../../../../core/abstractions';

@Component({
  selector: 'app-export-dialog',
  imports: [
    DIALOG_IMPORTS,
    FORM_DIALOG_IMPORTS,
    MatSlideToggleModule,
    MatCardModule,
    MatListModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
  ],
  templateUrl: './export-dialog.component.html',
  styleUrl: './export-dialog.component.scss',
})
export class ExportDialogComponent extends DialogFormBaseComponent {
  private readonly _weddingStore = inject(WeddingStore);
  private readonly _weddingMetadataStore = inject(WeddingMetadataStore);
  private readonly _dialog = inject(MatDialog);

  public readonly allGuestCount: Signal<number> = this._weddingStore.allGuestCount;
  public readonly seatedCount: Signal<number> = computed(() => this._weddingStore.guests().length);
  public readonly tables: Signal<Table[]> = this._weddingStore.tables;

  public readonly columns: string[] = ['key', 'hidden', 'label', 'formatter'];
  private _metadataConfig!: Map<string, MetadataFieldConfig>;

  constructor() {
    super();
    this._formGroup = new FormGroup({
      anonymize: new FormControl(false),
    });

    this.setMetaForm();
  }

  public get hasMetadata(): boolean {
    return this._metadataConfig.size > 0;
  }

  public get metaRows(): MetadataFieldConfig[] {
    return [...this._metadataConfig.values()];
  }

  public getLabelControl(key: string): FormControl | null {
    return this._formGroup.get(`meta.${key}.label`) as FormControl | null;
  }

  public getHiddenControl(key: string): FormControl | null {
    return this._formGroup.get(`meta.${key}.hidden`) as FormControl | null;
  }

  private setMetaForm(): void {
    this._metadataConfig = this._weddingStore.collectMedatada();
    if (this._metadataConfig.size === 0) {
      return;
    }

    const showMetadataControl = new FormControl(true);
    const saveMetaConfigControl = new FormControl(false);
    this._formGroup.addControl('showMetadata', showMetadataControl);
    this._formGroup.addControl('saveMetaConfig', saveMetaConfigControl);

    showMetadataControl.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((showMetadata) => {
      if (showMetadata) {
        saveMetaConfigControl.enable();
      } else {
        saveMetaConfigControl.setValue(false);
        saveMetaConfigControl.disable();
      }
    });

    const metaForm = new FormGroup({});
    this._formGroup.addControl('meta', metaForm);

    this._metadataConfig.forEach((metaConfig, metaName) => {
      const metaGroup: FormGroup<{
        hidden: FormControl<boolean | null>;
        label: FormControl<string | null>;
        formatterId?: FormControl<string | null>;
      }> = new FormGroup({
        hidden: new FormControl(metaConfig.hidden),
        label: new FormControl(metaConfig.label),
      });

      if (metaConfig.types.size === 1 && metaConfig.types.has('boolean')) {
        metaGroup.addControl(
          'formatterId',
          new FormControl(this._weddingMetadataStore.booleanFormatters()[0].id ?? null),
        );
      }
      metaForm.addControl(metaName, metaGroup);
    });
  }

  private applyFormToConfig(): void {
    this._metadataConfig.forEach((config, key) => {
      const keyGroup = this._formGroup.get(`meta.${key}`);
      if (keyGroup) {
        const keyRawValue = keyGroup.getRawValue();
        config.hidden = keyRawValue.hidden;
        config.label = keyRawValue.label;
      }
    });
  }

  public onFormater({ key }: MetadataFieldConfig): void {
    const formatterIdControl = this._formGroup.get(`meta.${key}.formatterId`);
    if (!formatterIdControl) {
      return;
    }

    const dialogRef = this._dialog.open(BooleanFormatterDialogComponent, {
      minWidth: 0,
      maxWidth: '100%',
      width: '45vw',
      autoFocus: '#accept',
      data: { formatterId: formatterIdControl.value },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((value?: string | null) => {
        if (value !== undefined) {
          formatterIdControl.setValue(value);
        }
      });
  }

  public override accept(): void {
    this.applyFormToConfig();
    const { anonymize, showMetadata } = this._formGroup.getRawValue();

    const config: ExportConfig = { anonymize, showMetadata, metadataConfig: this._metadataConfig };
    const content = this._weddingStore.exportTables(config);
    saveAs(new Blob([content]), 'tables.txt');
    this.close();
  }
}
