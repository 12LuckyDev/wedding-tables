import { Component, input } from '@angular/core';
import { Guest } from '../../../../core/models';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-guest-list-item',
  imports: [MatIconModule],
  templateUrl: './guest-list-item.component.html',
  styleUrl: './guest-list-item.component.scss',
})
export class GuestListItemComponent {
  public readonly guest = input<Guest>();
}
