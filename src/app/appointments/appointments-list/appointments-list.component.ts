import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { AppointmentService } from '../service/appointment.service';
import { DatePipe } from '@angular/common';
import { PaginatedAppointments } from '../models/appointment.model';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [DatePipe, MatTableModule, MatPaginatorModule],
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
    'appointmentDateTime',
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
          // Runs after request is done (no matter the outcome) whether it's success or error
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
