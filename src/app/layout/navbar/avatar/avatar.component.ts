import { NgClass } from '@angular/common';
import { Component, InputSignal, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-avatar',
  imports: [NgClass, FontAwesomeModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {

  imageUrl = input<string>();
  avatarSize = input<"avatar-sm" | "avatar-xl">();

}
