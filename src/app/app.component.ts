import { MessageModule } from 'primeng/message';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import {ToastModule} from "primeng/toast";
import { fontAwesomeIcons } from './shared/font-awesome-icons';
import { NavbarComponent } from "./layout/navbar/navbar.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { ToastService } from './layout/toast.service';
import { MessageService } from 'primeng/api';


@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ButtonModule, FontAwesomeModule, NavbarComponent, FooterComponent, ToastModule],
    providers: [MessageService],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: true
})
export class AppComponent {
  
  faIconLibrary: FaIconLibrary= inject(FaIconLibrary);
  isListingView = true;
  toastService: ToastService = inject(ToastService);
  messageService: MessageService = inject(MessageService);

  ngOnInit(): void {
    this.initFontAwesomeIcons();
    this.listenToastService();
  }
  
  private initFontAwesomeIcons(): void {
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }

  private listenToastService(): void {
    this.toastService.sendSub.subscribe({
      next: newMessage => {
        if(newMessage && newMessage !== this.toastService.INIT_STATE) {
          this.messageService.add(newMessage);
        }
      }
    });
  }
}
