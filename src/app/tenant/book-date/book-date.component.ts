import { map } from 'rxjs';
import { Component, effect, inject, input, OnDestroy, OnInit } from '@angular/core';
import { Listing } from '../../landlord/model/listing.model';
import { BookingService } from '../service/booking.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ToastService } from '../../layout/toast.service';
import dayjs from 'dayjs';
import { BookedDatesDTOFromClient } from '../model/booking.model';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-date',
  imports: [DatePickerModule, MessageModule, CurrencyPipe, FormsModule],
  templateUrl: './book-date.component.html',
  styleUrl: './book-date.component.scss'
})
export class BookDateComponent implements OnInit , OnDestroy {

  listing = input.required<Listing>();
  listingPublicId = input.required<string>();

  bookingService = inject(BookingService);
  toastService = inject(ToastService);
  authService = inject(AuthService);
  router = inject(Router);

  bookingDates = new Array<Date>();
  totalPrice = 0;

  minDate = new Date();
  bookedDates = new Array<Date>();

  constructor() { 
    this.listenToCheckAvailableDate();
    this.listenToCreateBooking();
  }

  ngOnDestroy(): void {
    this.bookingService.resetCreateBooking();
  }

  ngOnInit(): void {
    this.bookingService.checkAvailability(this.listingPublicId());
  }

  onDateChange(newBookingDate: Array<Date>) {
    this.bookingDates = newBookingDate;
    if(this.validateMakeBooking()){
        const startBookingDateDayjs = dayjs(this.bookingDates[0]);
        const endBookingDateDayjs = dayjs(this.bookingDates[1]);
        this.totalPrice = endBookingDateDayjs.diff(startBookingDateDayjs, 'days') * this.listing().price.value;
    } else {
        this.totalPrice = 0;
    }
  }

  validateMakeBooking() {
    return this.bookingDates.length === 2
    && this.bookingDates[0] !== null
    && this.bookingDates[1] !== null
    && this.bookingDates[0].getDate() !== this.bookingDates[1].getDate()
    && this.authService.isAuthenticated();
  }

  onNewBooking() {
    const newBooking = {
      listingPublicId: this.listingPublicId(),
      startDate: this.bookingDates[0],
      endDate: this.bookingDates[1]
    }
    this.bookingService.create(newBooking);
  }

  private listenToCheckAvailableDate() {
    effect(() => {
        const checkAvailabilityState = this.bookingService.checkAvailabilitySig();
        if(checkAvailabilityState.status === 'OK') {
          this.bookedDates = this.mapBookedDatesToDate(checkAvailabilityState.value!);
        } else if(checkAvailabilityState.status === 'ERROR') {
          this.toastService.send({
            severity: "error", summary :"Error", detail: checkAvailabilityState.error?.message});
          }
    });
  }

  private mapBookedDatesToDate(BookedDatesDTOFromClients: Array<BookedDatesDTOFromClient>) {
    const bookedDates = new Array<Date>();
    for(let bookedDate of BookedDatesDTOFromClients){
      bookedDates.push(...this.getDatesInRange(bookedDate));
    }
    return bookedDates;
  }

  private getDatesInRange(bookedDate: BookedDatesDTOFromClient) {
    const dates = new Array<Date>();
    let currentDate = bookedDate.startDate;
    while(currentDate.isBefore(bookedDate.endDate)){
      dates.push(currentDate.toDate());
      currentDate = currentDate.add(1, 'day');
    }
    return dates;
  }

  private listenToCreateBooking() {
    effect(() => {
      const createBookingState = this.bookingService.createBookingSig();
      if(createBookingState.status === 'OK') {
        this.router.navigate(['/booking']);
        this.toastService.send({
          severity: "success",  detail: "Booking created successfully"});
      } else if(createBookingState.status === 'ERROR') {
        this.toastService.send({
          severity: "error", summary :"Error", detail: createBookingState.error?.message});
      }
    });
  }

  
}
