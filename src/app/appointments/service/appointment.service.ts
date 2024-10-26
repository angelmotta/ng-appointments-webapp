import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  constructor(private http: HttpClient) {}

  getAppointment(): Observable<any> {
    console.log(
      'getAppointment method called - but HTTP request not yet made!'
    );
    return this.http.get('http://localhost:3000/citas').pipe(
      tap({
        next: () =>
          console.log('HTTP Request executed - this means someone subscribed!'),
      })
      // delay(5000) // simulate network delay xx
    );
  }
}
