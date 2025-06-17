import { Component, inject } from '@angular/core';
import { GroupImportSummaryModel, GroupImportType, Guest, GuestImportSummaryModel } from '../../../../../core/models';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { WeddingStore } from '../../../../../core/stores';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { GroupListComponent } from './group-list/group-list.component';
import { DIALOG_IMPORTS, DialogFormBaseComponent, FORM_DIALOG_IMPORTS } from '../../../../../core/abstractions';

@Component({
  selector: 'app-import-summary-dialog',
  imports: [
    DIALOG_IMPORTS,
    FORM_DIALOG_IMPORTS,
    MatCardModule,
    MatDividerModule,
    MatSelectModule,
    MatInputModule,
    GroupListComponent,
  ],
  templateUrl: './import-summary-dialog.component.html',
  styleUrl: './import-summary-dialog.component.scss',
})
export class ImportSummaryDialogComponent extends DialogFormBaseComponent {
  private readonly _weddingStore = inject(WeddingStore);
  public readonly data = inject<{ guestsToImport: GuestImportSummaryModel }>(MAT_DIALOG_DATA);

  private _groupsOptions: Map<number, { id: string; label: string }[]> = new Map<
    number,
    { id: string; label: string }[]
  >();

  constructor() {
    super();
    this._formGroup = new FormGroup({});
    const { groups } = this.data.guestsToImport;

    groups.forEach(({ type, groupIds, possibleGroupsGuests }, index) => {
      if (type === GroupImportType.manyGroups) {
        this._formGroup.addControl(index.toString(), new FormControl(null, [Validators.required]));
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

  public getSelectedGroupId(index: number): string | null {
    return this._formGroup.get(index.toString())?.value ?? null;
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

  public getGroupSubtitle({ type }: GroupImportSummaryModel): string {
    switch (type) {
      case GroupImportType.newGroup:
        return 'They will be added without a group';
      case GroupImportType.existingGroup:
        return `Added to existing group`;
      case GroupImportType.manyGroups:
        return 'Please select one group';
    }
  }

  public getGroupOptions(index: number): { id: string; label: string }[] | null {
    return this._groupsOptions.get(index) ?? null;
  }

  public override accept(): void {
    const { groups, ...rest } = this.data.guestsToImport;
    const result = {
      ...rest,
      groups: groups.map((group, i) => {
        const control = this._formGroup.get(i.toString());
        if (control) {
          return { ...group, groupIds: [control.value] };
        }
        return group;
      }),
    };

    this._weddingStore.importGuests(result);
    this.close();
  }
}
