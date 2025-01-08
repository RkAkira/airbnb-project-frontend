import { faLocation } from '@fortawesome/free-solid-svg-icons';
import { Component, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonModule } from 'primeng/button';
import { CategoryComponent } from './category/category.component';
import { AvatarComponent } from './avatar/avatar.component';
import { ToolbarModule } from 'primeng/toolbar';
import { Menu, MenuModule } from 'primeng/menu';
import { DialogService } from 'primeng/dynamicdialog';
import { MenuItem } from 'primeng/api';
import { ToastService } from '../toast.service';

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

  // login() => this.authService.login();
  // logout() => this.authService.logout();

  currentMenuItems: MenuItem[]|undefined = []

  ngOnInit(): void {
    this.currentMenuItems = this.fetchMenu();
    this.toastService.send({severity: "info" ,text: "Navbar loaded"});
  }

  private fetchMenu() {
    return [
      {
        label:"Sign up",
        styleClass: "font-bold"
      },
      {
        label:"Log in",
      }
    ]
  }

}


