import { Component, input, InputSignal } from '@angular/core';
import { GroupImportSummaryModel, GroupImportType, Guest } from '../../../../../../core/models';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-group-list',
  imports: [MatListModule, MatIconModule, NgClass],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.scss',
})
export class GroupListComponent {
  public readonly group: InputSignal<GroupImportSummaryModel | Guest[] | undefined> = input<
    GroupImportSummaryModel | Guest[]
  >();
  public readonly groupId: InputSignal<string | null> = input<string | null>(null);

  public get guests(): { id: string; name: string; icon: string; info?: string; notSelected?: boolean }[] {
    const group = this.group();
    if (!group) {
      return [];
    }

    if (Array.isArray(group)) {
      return group.map(({ id, name }) => ({ id, name, icon: 'person_add' }));
    }

    const { newGuests, existingGuests, possibleGroupsGuests, type } = group;

    const list: { id: string; name: string; icon: string; info?: string; notSelected?: boolean }[] = [];
    list.push(...newGuests.map(({ id, name }) => ({ id, name, icon: 'person_add' })));
    list.push(
      ...existingGuests.map(({ id, name }) => ({
        id,
        name,
        icon: type === GroupImportType.newGroup ? 'group_add' : 'group',
        info: type === GroupImportType.newGroup ? '(existing)' : '(existing with group)',
      })),
    );
    list.push(
      ...possibleGroupsGuests.map(({ id, name, groupId }) => {
        const selectedGroupId = this.groupId();
        const groupNotSelected = selectedGroupId !== groupId;
        return {
          id,
          name,
          notSelected: selectedGroupId !== null && groupNotSelected,
          icon: selectedGroupId === null ? 'group' : groupNotSelected ? 'group_off' : 'group_add',
          info:
            selectedGroupId === null
              ? '(existing with group)'
              : groupNotSelected
                ? undefined
                : '(existing with selected group)',
        };
      }),
    );

    return list;
  }
}
