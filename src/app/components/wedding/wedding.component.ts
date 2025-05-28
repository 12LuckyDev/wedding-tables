import { Component } from '@angular/core';
import { TablesComponent } from './tables/tables.component';
import { WeddingStore } from './wedding.store';
import { MatSidenavModule } from '@angular/material/sidenav';
import { GuestsComponent } from './guests/guests.component';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { WeddingService } from './weddings.service';

@Component({
  selector: 'app-wedding',
  imports: [TablesComponent, GuestsComponent, MatSidenavModule, CdkDropListGroup],
  providers: [WeddingStore, WeddingService],
  templateUrl: './wedding.component.html',
  styleUrl: './wedding.component.scss',
})
export class WeddingComponent {}
