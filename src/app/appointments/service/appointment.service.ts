import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  constructor(private http: HttpClient) {}

  getAppointment(): Observable<any> {
    const API_APPOINTMENTS_URL = 'http://localhost:8080/api/appointments';

    console.log(
      'getAppointment service method called - but HTTP request not yet made!'
    );
    return this.http.get(API_APPOINTMENTS_URL).pipe(
      tap({
        next: () =>
          console.log('HTTP Request executed - this means someone subscribed!'),
      })
      // delay(5000) // simulate network delay xx
    );
  }
}