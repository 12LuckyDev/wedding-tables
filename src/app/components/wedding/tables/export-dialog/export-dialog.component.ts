import { Component, computed, effect, inject, Signal } from '@angular/core';
import { WeddingExportStore, WeddingMetadataStore, WeddingStore } from '../../../../../core/stores';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import {
  BooleanFormatter,
  ExportConfig,
  MetadataCounter,
  MetadataFieldConfig,
  Table,
} from '../../../../../core/models';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { saveAs } from 'file-saver';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BooleanFormatterDialogComponent } from './boolean-formatter-dialog/boolean-formatter-dialog.component';
import { DIALOG_IMPORTS, DialogFormBaseComponent, FORM_DIALOG_IMPORTS } from '../../../../../core/abstractions';
import { DialogService } from '../../../../../core/services/dialog.service';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CountersDialogComponent } from './counters-dialog/counters-dialog.component';

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
    MatBadgeModule,
    MatTooltipModule,
  ],
  providers: [WeddingExportStore],
  templateUrl: './export-dialog.component.html',
  styleUrl: './export-dialog.component.scss',
})
export class ExportDialogComponent extends DialogFormBaseComponent {
  private readonly _weddingStore = inject(WeddingStore);
  private readonly _weddingExportStore = inject(WeddingExportStore);
  private readonly _weddingMetadataStore = inject(WeddingMetadataStore);
  private readonly _dialogService = inject(DialogService);

  public readonly booleanFormatters: Signal<BooleanFormatter[]> = this._weddingMetadataStore.booleanFormatters;
  public readonly allGuestCount: Signal<number> = this._weddingStore.allGuestCount;
  public readonly seatedCount: Signal<number> = computed(() => this._weddingStore.guests().length);
  public readonly tables: Signal<Table[]> = this._weddingStore.tables;

  public readonly columns: string[] = ['key', 'label', 'options'];
  private _metadataConfig!: Map<string, MetadataFieldConfig>;

  constructor() {
    super();
    this._formGroup = new FormGroup({
      anonymize: new FormControl(false),
    });

    this.setMetaForm();

    effect(() => {
      const booleanFormatters = this.booleanFormatters();
      const meta = this._formGroup.get('meta') as FormGroup | null;
      if (meta === null) {
        return;
      }

      this.metaRows.forEach(({ key }) => {
        const formatterControl = meta.get(`${key}.formatterId`);
        if (!formatterControl) {
          return;
        }

        if (formatterControl.value !== null && !booleanFormatters.find(({ id }) => id === formatterControl.value)) {
          formatterControl.setValue(null);
        }
      });
    });
  }

  public get hasMetadata(): boolean {
    return this._metadataConfig.size > 0;
  }

  public get metaRows(): MetadataFieldConfig[] {
    return [...this._metadataConfig.values()];
  }

  public getFormatterTooltip(key: string): string | null {
    const control = this._formGroup.get(`meta.${key}.formatterId`);
    const formatter = control ? this.booleanFormatters().find(({ id }) => id === control.value) : null;
    return formatter ? `${formatter.trueLabel} / ${formatter.falseLabel}` : null;
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
    this.addControl('showMetadata', showMetadataControl);
    this.addControl('saveMetaConfig', saveMetaConfigControl);

    showMetadataControl.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((showMetadata) => {
      if (showMetadata) {
        saveMetaConfigControl.enable();
      } else {
        saveMetaConfigControl.setValue(false);
        saveMetaConfigControl.disable();
      }
    });

    const metaForm = new FormGroup({});
    this.addControl('meta', metaForm);

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
          new FormControl(this._weddingMetadataStore.booleanFormatters()[0].id ?? null, [Validators.required]),
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
        if (keyRawValue.formatterId) {
          config.formatterId = keyRawValue.formatterId;
        }
      }
    });
  }

  public onCounters(config: MetadataFieldConfig): void {
    this._dialogService
      .openMedium<{ config: MetadataFieldConfig }, MetadataCounter[] | undefined>(CountersDialogComponent, { config })
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((newCounters?: MetadataCounter[]) => {
        if (newCounters) {
          config.counters = newCounters;
        }
      });
  }

  public onFormater({ key }: MetadataFieldConfig): void {
    const formatterIdControl = this._formGroup.get(`meta.${key}.formatterId`);
    if (!formatterIdControl) {
      return;
    }

    this._dialogService
      .openSmall<{ formatterId: string | null }, string | null>(BooleanFormatterDialogComponent, {
        formatterId: formatterIdControl.value,
      })
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
    const content = this._weddingExportStore.exportTables(config);
    saveAs(new Blob([content]), 'tables.txt');
    this.close();
  }
}
