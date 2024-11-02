import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Specialty } from '../models/specialty.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SpecialtyService {
  private readonly API_SPECIALTIES = 'http://localhost:8080/api/specialties';

  constructor(private http: HttpClient) {}

  getSpecialties(): Observable<Specialty[]> {
    return this.http.get<Specialty[]>(this.API_SPECIALTIES).pipe(
      tap({
        next: () => console.log(`HTTP GET specialties executed`),
      })
    );
  }
}
