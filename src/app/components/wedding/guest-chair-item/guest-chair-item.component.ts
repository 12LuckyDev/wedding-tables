import { Component, effect, HostBinding, input } from '@angular/core';
import { Guest } from '../../../../core/models';

@Component({
  selector: 'app-guest-chair-item',
  imports: [],
  templateUrl: './guest-chair-item.component.html',
  styleUrl: './guest-chair-item.component.scss',
})
export class GuestChairItemComponent {
  @HostBinding('style.color') hostColor!: string;
  @HostBinding('style.background') hostBackground!: string;

  public readonly guest = input<Guest>();

  constructor() {
    effect(() => {
      const color = this.guest()?.color;
      if (color) {
        this.hostColor = color.color;
        this.hostBackground = color.backgroundColor;
      }
    });
  }
}
