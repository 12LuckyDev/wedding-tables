import { Component } from '@angular/core';
import { TablesComponent } from './tables/tables.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { GuestsComponent } from './guests/guests.component';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-wedding',
  imports: [TablesComponent, GuestsComponent, MatSidenavModule, CdkDropListGroup],
  templateUrl: './wedding.component.html',
  styleUrl: './wedding.component.scss',
})
export class WeddingComponent {}
