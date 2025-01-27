import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageModule } from 'primeng/message'; // Adjust the import path as needed

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  INIT_STATE = "INIT";
  private send$ = new BehaviorSubject<MessageModule>({summary: 'success', detail: this.INIT_STATE, severity: 'success'});
  sendSub = this.send$.asObservable();

  public send(message: MessageModule): void {
    this.send$.next(message);
  }

}
