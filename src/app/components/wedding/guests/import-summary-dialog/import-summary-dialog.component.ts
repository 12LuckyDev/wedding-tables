import { Component, inject } from '@angular/core';
import { GroupImportSummaryModel, GroupImportType, Guest, GuestImportSummaryModel } from '../../../../../core/models';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { NgTemplateOutlet } from '@angular/common';
import { WeddingStore } from '../../../../../core/stores';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-import-summary-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    NgTemplateOutlet,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './import-summary-dialog.component.html',
  styleUrl: './import-summary-dialog.component.scss',
})
export class ImportSummaryDialogComponent {
  private readonly _weddingStore = inject(WeddingStore);
  private readonly _dialogRef = inject(MatDialogRef<ImportSummaryDialogComponent>);
  public readonly data = inject<{ guestsToImport: GuestImportSummaryModel }>(MAT_DIALOG_DATA);

  private _groupsForm: FormGroup;
  private _groupsOptions: Map<number, { id: string; label: string }[]> = new Map<
    number,
    { id: string; label: string }[]
  >();

  constructor() {
    this._groupsForm = new FormGroup({});
    const { groups } = this.data.guestsToImport;

    groups.forEach(({ type, groupIds, possibleGroupsGuests }, index) => {
      if (type === GroupImportType.manyGroups) {
        this._groupsForm.addControl(index.toString(), new FormControl(null, [Validators.required]));
        const options = groupIds.map((id) => ({
          id,
          label: possibleGroupsGuests
            .filter(({ groupId }) => groupId === id)
            .map(({ name }) => name)
            .join(', '),
        }));
        options.push({ id: uuidv4(), label: 'Add to new group' });
        this._groupsOptions.set(index, options);
      }
    });
  }

  public get newSingleGuests(): Guest[] {
    return this.data.guestsToImport.newSingleGuests;
  }

  public get groups(): GroupImportSummaryModel[] {
    return this.data.guestsToImport.groups;
  }

  public get groupsForm(): FormGroup {
    return this._groupsForm;
  }

  public get isValid(): boolean {
    return this._groupsForm.valid;
  }

  public getGroupTitle(group: GroupImportSummaryModel): string {
    switch (group.type) {
      case GroupImportType.newGroup:
        return 'New Group';
      case GroupImportType.existingGroup:
        return 'Added to existing group';
      case GroupImportType.manyGroups:
        return 'Can be added to many groups';
    }
  }

  // TODO write guest without group and combinated guests groups
  public getGroupSubtitle(group: GroupImportSummaryModel): string | null {
    if (group.type === GroupImportType.newGroup) {
      return null;
    }
    const compatible: string[] = group.possibleGroupsGuests.map(({ name }) => name);

    return `Compatible with: ${compatible.join(', ')}`;
  }

  public getGroupOptions(index: number): { id: string; label: string }[] | null {
    return this._groupsOptions.get(index) ?? null;
  }

  public accept(): void {
    const { groups, ...rest } = this.data.guestsToImport;
    const result = {
      ...rest,
      groups: groups.map((group, i) => {
        const control = this._groupsForm.get(i.toString());
        if (control) {
          return { ...group, groupIds: [control.value] };
        }
        return group;
      }),
    };

    console.log(result);
    this._weddingStore.importGuests(result);
    this._dialogRef.close();
  }

  public cancel(): void {
    this._dialogRef.close();
  }
}
