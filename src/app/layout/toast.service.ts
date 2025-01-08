import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageModule } from 'primeng/message'; // Adjust the import path as needed

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  INIT_STATE = "INIT";
  private send$ = new BehaviorSubject<MessageModule>({text: this.INIT_STATE});
  sendSub = this.send$.asObservable();

  public send(message: MessageModule): void {
    this.send$.next(message);
  }

}
