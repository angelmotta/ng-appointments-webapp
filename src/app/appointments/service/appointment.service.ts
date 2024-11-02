import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import {
  AppointmentRequest,
  PaginatedAppointments,
} from '../models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  readonly API_APPOINTMENTS = 'http://localhost:8080/api/appointments';
  constructor(private http: HttpClient) {}

  getAppointment(): Observable<PaginatedAppointments> {
    console.log(
      'getAppointment service method called - but HTTP request not yet made!'
    );
    return this.http.get<PaginatedAppointments>(this.API_APPOINTMENTS).pipe(
      tap({
        next: () =>
          console.log('HTTP Request executed - this means someone subscribed!'),
      })
      // delay(5000) // simulate network delay xx
    );
  }

  createAppointment(payload: AppointmentRequest): Observable<void> {
    console.log(
      'createAppointment service method called - but HTTP request not yet made!'
    );
    return this.http.post<void>(this.API_APPOINTMENTS, payload).pipe(
      tap({
        next: () =>
          console.log('HTTP Request executed - this means someone subscribed!'),
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Failed to create appointment:', error);
        console.log(`----`);
        let errorMessage: string;
        switch (error.status) {
          case 400:
            errorMessage = 'Invalid request';
            break;
          case 401:
            errorMessage = 'Unauthorized - please log in again';
            break;
          case 403:
            errorMessage = 'You do not have permission to create appointments';
            break;
          case 500:
            errorMessage = 'Appointment Service error - please try again later';
            break;
          case 0:
            errorMessage = 'Appointment Service is not available';
            break;
          default:
            errorMessage = 'Failed to create appointment';
        }

        // We can access the error response body if the API returns detailed errors
        console.log(error.error);
        // const errorResponse = error.error as ErrorResponse; // Define ErrorResponse interface
        // if (errorResponse?.message) {
        //   errorMessage = errorResponse.message;
        // }

        console.error(`Appointment creation failed: ${errorMessage}`);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
