import { Component, inject } from '@angular/core';
import { DIALOG_IMPORTS, DialogFormBaseComponent, FORM_DIALOG_IMPORTS } from '../../../../../../core/abstractions';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MetadataCounter, MetadataField, MetadataFieldConfig } from '../../../../../../core/models';
import { sentenceCase } from 'change-case';

function createScopeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const { table, global } = control.value;

    return table || global ? null : { anyScopeRequired: true };
  };
}

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
  // TODO pass booleanFormater if type is boolean
  // TODO usage of counters

  public readonly columns: string[] = ['scope', 'label', 'values', 'options'];

  constructor() {
    super();
    this.addControl('counters', new FormArray([]));
    this.assignCountersToForm();
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

  private assignCountersToForm(): void {
    const { counters } = this._data.config;
    counters.forEach((counter) => this.add(counter));
  }

  public getLabelControl(index: number): FormControl | null {
    return this.countersControl.get(`${index}.label`) as FormControl | null;
  }

  public hasScopeError(index: number): boolean {
    const control = this.countersControl.get(`${index}.scope`) as FormGroup;
    return control?.hasError('anyScopeRequired') ?? false;
  }

  public add(counter?: MetadataCounter): void {
    this.countersControl.push(
      new FormGroup({
        label: new FormControl(counter?.label ?? sentenceCase(this._data.config.key)),
        values: new FormControl(counter?.values ?? []),
        scope: new FormGroup(
          {
            table: new FormControl(counter?.scope.table ?? true),
            global: new FormControl(counter?.scope.global ?? false),
          },
          [createScopeValidator()],
        ),
      }),
    );
  }

  public delete(index: number): void {
    this.countersControl.removeAt(index);
  }

  public override accept(): void {
    const counters: MetadataCounter[] = this.countersControl.value;
    this.close(counters);
  }
}
