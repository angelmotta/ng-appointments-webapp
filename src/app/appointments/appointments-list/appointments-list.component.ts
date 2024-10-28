import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError, delay, EMPTY, finalize, Observable, of, tap } from 'rxjs';
import { AppointmentService } from '../service/appointment.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { PaginatedAppointments } from '../models/appointment.model';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [AsyncPipe, DatePipe],
  templateUrl: './appointments-list.component.html',
  styleUrl: './appointments-list.component.css',
})
export class AppointmentsListComponent implements OnInit {
  appointments$!: Observable<PaginatedAppointments>;
  error$!: Observable<{ error: string } | null>; // To handle and store error messages
  fetchingData: boolean = true;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    console.log(`ngOnInit Component`);

    this.error$ = of(null);

    this.appointments$ = this.appointmentService.getAppointment().pipe(
      tap({
        next: (data) => console.log('Received user:', data),
        error: (error) => console.error('Error fetching data (tap):', error),
        complete: () => console.log('Data stream completed'),
      }),
      catchError((err) => {
        console.error('CatchError fetching data:', err);
        let errorMessage = 'An unknown error occurred';
        // check status code
        if (err.status === 401) {
          errorMessage = 'Unauthorized request. Please login.';
        } else if (err.status === 404) {
          errorMessage = 'Resource not found.';
        } else if (err.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (err.name === 'HttpErrorResponse' && err.status === 0) {
          errorMessage =
            'Network error (Appointment Service is not available).';
        }
        this.error$ = of({ error: errorMessage });
        return EMPTY; // Return an empty observable to stop further processing
        // this.error$ = of(err);
        // return EMPTY; // Return an empty observable to stop further processing
      }),
      finalize(() => {
        this.fetchingData = false; // Stop loading spinner when the observable completes
        console.log('Observable completed');
      })
    );
  }
}
