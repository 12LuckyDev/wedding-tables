import { Component } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'wedding-tables';
  constructor(private _matIconRegistry: MatIconRegistry) {
    this._matIconRegistry.registerFontClassAlias('material-symbols', 'material-symbols-outlined');
  }
}
