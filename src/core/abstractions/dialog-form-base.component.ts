import { Component } from '@angular/core';
import { DialogBaseComponent } from './dialog-base.component';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

export const FORM_DIALOG_IMPORTS = [ReactiveFormsModule, MatFormFieldModule];

@Component({ template: '' })
export abstract class DialogFormBaseComponent extends DialogBaseComponent {
  protected _formGroup: FormGroup = new FormGroup({});

  public get formGroup(): FormGroup {
    return this._formGroup;
  }

  public get isValid(): boolean {
    return this._formGroup.valid;
  }

  protected addControl(key: string, control: AbstractControl): void {
    this._formGroup.addControl(key, control);
  }
}
