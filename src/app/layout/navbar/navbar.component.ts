import { AuthService } from './../../core/auth/auth.service';
import { faLocation } from '@fortawesome/free-solid-svg-icons';
import { Component, effect, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import { CategoryComponent } from './category/category.component';
import { AvatarComponent } from './avatar/avatar.component';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';
import { DialogService } from 'primeng/dynamicdialog';
import { MenuItem } from 'primeng/api';
import { ToastService } from '../toast.service';
import { User } from '../../core/model/user.model';

@Component({
  selector: 'app-navbar',
  imports: [ButtonModule, FontAwesomeModule, ToolbarModule, AvatarComponent, MenuModule, CategoryComponent],
  providers: [DialogService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  location: string = "Anywhere";
  guest:string = "Add guest";
  dates: string = "Add dates";

  toastService: ToastService = inject(ToastService);
  authService = inject(AuthService);

  login = () => this.authService.login();

  logout = () => this.authService.logout();

  currentMenuItems: MenuItem[]|undefined = [];
  connectedUser: User = {email: this.authService.notConnected}; 

  constructor() {
    effect(() => {
      if(this.authService.fetchUser().status === 'OK'){
      this.connectedUser = this.authService.fetchUser().value!;
      this.currentMenuItems = this.fetchMenu();
      }
   });
  }


  ngOnInit(): void {
    this.authService.fetch(false);
  }

  private fetchMenu(): MenuItem[] {
    if (this.authService.isAuthenticated()) {
      return [
        {
          label: "My properties",
          routerLink: "landlord/properties",
          visible: this.hasToBeLandlord(),
        },
        {
          label: "My booking",
          routerLink: "booking",
        },
        {
          label: "My reservation",
          routerLink: "landlord/reservation",
          visible: this.hasToBeLandlord(),
        },
        {
          label: "Log out",
          command: this.logout
        },
      ]
    } else {
      return [
        {
          label: "Sign up",
          styleClass: "font-bold",
          command: this.login
        },
        {
          label: "Log in",
          command: this.login
        }
      ]
    }
  }

  hasToBeLandlord(): boolean {
    return this.authService.hasAnyAuthority('ROLE_LANDLORD');
  }

}


