import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { fontAwesomeIcons } from './shared/font-awesome-icons';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ButtonModule, FontAwesomeModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: true
})
export class AppComponent {
  
  faIconLibrary: FaIconLibrary= inject(FaIconLibrary);

  ngOnInit(): void {
    this.initFontAwesomeIcons();
  }
  
  private initFontAwesomeIcons(): void {
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }
}
