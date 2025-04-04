import { map } from 'rxjs';
import { BookedDatesDTOFromClient, BookedDatesDTOFromServer, CreateBooking } from './../model/booking.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { State } from '../../core/model/state.model';
import { environment } from '../../../environments/environment';
import dayjs from 'dayjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private http = inject(HttpClient);
  private createBooking$: WritableSignal<State<boolean>> = signal(State.Builder<boolean>().forInit());
  createBookingSig = computed(() => this.createBooking$());

  private checkAvailability$: WritableSignal<State<Array<BookedDatesDTOFromClient>>> = signal(State.Builder<Array<BookedDatesDTOFromClient>>().forInit());
  checkAvailabilitySig = computed(() => this.checkAvailability$());

  create(newBooking: CreateBooking) {
    this.http.post<boolean>(`${environment.API_URL}/booking/create`, newBooking)
    .subscribe({
      next: created => this.createBooking$.set(State.Builder<boolean>().forSuccess(created)),
      error: error => this.createBooking$.set(State.Builder<boolean>().forError(error))
    });
  }

  checkAvailability(publicId: string) {
    const params = new HttpParams().set("listingPublicId", publicId);
    this.http.get<Array<BookedDatesDTOFromServer>>(`${environment.API_URL}/booking/check-availability`, {params}).pipe(
      map(this.mapDateToDayjs())
    ).subscribe(
      {
        next: dates => {console.log('here'), this.checkAvailability$.set(State.Builder<Array<BookedDatesDTOFromClient>>().forSuccess(dates))},
        error: error => {console.log('no, here'),this.checkAvailability$.set(State.Builder<Array<BookedDatesDTOFromClient>>().forError(error))}
      }
    )
  }

  private mapDateToDayjs = () => {
    return (bookedDates: Array<BookedDatesDTOFromServer>): Array<BookedDatesDTOFromClient> => {
      return bookedDates.map(reservedDate => this.convertDateToDayjs(reservedDate));
    }
  }

  private convertDateToDayjs<T extends BookedDatesDTOFromServer>(dto: T): BookedDatesDTOFromClient {
    return {
      startDate: dayjs(dto.startDate),
      endDate: dayjs(dto.endDate)
    }
  }

  resetCreateBooking() {
    this.createBooking$.set(State.Builder<boolean>().forInit());
  }

  constructor() { }
}
