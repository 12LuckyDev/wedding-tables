import { Component, inject } from '@angular/core';
import { DIALOG_IMPORTS, DialogFormBaseComponent, FORM_DIALOG_IMPORTS } from '../../../../../../core/abstractions';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MetadataField, MetadataFieldConfig } from '../../../../../../core/models';
import { sentenceCase } from 'change-case';

@Component({
  selector: 'app-counters-dialog',
  imports: [
    DIALOG_IMPORTS,
    FORM_DIALOG_IMPORTS,
    MatCardModule,
    MatListModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatBadgeModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatSelectModule,
  ],
  templateUrl: './counters-dialog.component.html',
  styleUrl: './counters-dialog.component.scss',
})
export class CountersDialogComponent extends DialogFormBaseComponent {
  private readonly _data = inject<{ config: MetadataFieldConfig }>(MAT_DIALOG_DATA);

  public readonly columns: string[] = ['scope', 'label', 'values', 'options'];
  public tempData: unknown[] = [1, 2, 3];

  constructor() {
    super();
    this.addControl('counters', new FormArray([]));
  }

  public get countersControl(): FormArray {
    return this._formGroup.get('counters')! as FormArray;
  }

  public get countersRows() {
    return [...this.countersControl.controls];
  }

  public get values(): MetadataField[] {
    return [...this._data.config.values];
  }

  public getLabelControl(index: number): FormControl | null {
    return this.countersControl.get(`${index}.label`) as FormControl | null;
  }

  public add(): void {
    this.countersControl.push(
      new FormGroup({
        label: new FormControl(sentenceCase(this._data.config.key)),
        values: new FormControl([]),
        scope: new FormGroup({
          table: new FormControl(true),
          global: new FormControl(false),
        }),
      }),
    );
  }
}
