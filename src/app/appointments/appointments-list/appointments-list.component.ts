import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError, delay, EMPTY, finalize, Observable, of, tap } from 'rxjs';
import { AppointmentService } from '../service/appointment.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { PaginatedAppointments } from '../models/appointment.model';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [AsyncPipe, DatePipe, MatTableModule, MatPaginatorModule],
  templateUrl: './appointments-list.component.html',
  styleUrl: './appointments-list.component.css',
})
export class AppointmentsListComponent implements OnInit {
  dataSourceAppointments: PaginatedAppointments | null = null;
  errorMessage: string = '';
  fetchingData: boolean = true;
  displayedColumns: string[] = [
    'id',
    'createdAt',
    'firstName',
    'lastName',
    'dni',
    'specialtyName',
  ];
  pageSize = 5; // Default page size

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    console.log(`ngOnInit Component`);
    this.fetchAppointments(0, this.pageSize);
  }

  fetchAppointments(pageIdx: number, pageSize: number) {
    console.log(
      `fetchAppointments called with pageIdx=${pageIdx} and pageSize=${pageSize}`
    );
    this.fetchingData = true;

    this.appointmentService
      .getAppointment(pageIdx, pageSize)
      .pipe(
        finalize(() => {
          // Runs after success or error (no matter the outcome.)
          this.fetchingData = false;
        })
      )
      .subscribe({
        next: (data) => {
          console.log(`received data from REST API`);
          console.log(data);
          this.dataSourceAppointments = data;
        },
        error: (e) => {
          this.errorMessage = e.message || 'Unknown issue';
        },
        complete: () =>
          console.info(`GET /appointments completed successfully`),
      });
  }

  handlePageEvent(event: PageEvent) {
    this.fetchAppointments(event.pageIndex, event.pageSize);
  }
}
