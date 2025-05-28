import { Component, inject } from '@angular/core';
import { GroupImportSummaryModel, GroupImportType, Guest, GuestImportSummaryModel } from '../../../../../core/models';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-import-summary-dialog',
  imports: [MatButtonModule, MatDialogModule, MatCardModule, MatDividerModule, MatListModule, NgTemplateOutlet],
  templateUrl: './import-summary-dialog.component.html',
  styleUrl: './import-summary-dialog.component.scss',
})
export class ImportSummaryDialogComponent {
  private readonly _dialogRef = inject(MatDialogRef<ImportSummaryDialogComponent>);
  public readonly data = inject<{ guestsToImport: GuestImportSummaryModel }>(MAT_DIALOG_DATA);

  public get newSingleGuests(): Guest[] {
    return this.data.guestsToImport.newSingleGuests;
  }

  public get groups(): GroupImportSummaryModel[] {
    return this.data.guestsToImport.groups;
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

  public getGroupSubtitle(group: GroupImportSummaryModel): string | null {
    if (group.type === GroupImportType.newGroup) {
      return null;
    }
    const compatible: string[] = group.possibleGroupsGuests.map(({ name }) => name);

    return `Compatible with: ${compatible.join(', ')}`;
  }

  public getGroupOptions({ groupIds, possibleGroupsGuests }: GroupImportSummaryModel): { id: string; label: string }[] {
    return groupIds.map((id) => ({
      id,
      label: possibleGroupsGuests
        .filter((g) => g.groupId === id)
        .map(({ name }) => name)
        .join(', '),
    }));
  }

  public accept(): void {
    this._dialogRef.close();
  }

  public cancel(): void {
    this._dialogRef.close();
  }
}
