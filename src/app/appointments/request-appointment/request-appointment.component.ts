import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AppointmentRequest } from '../models/appointment.model';
import { AppointmentService } from '../service/appointment.service';
import { SpecialtyService } from '../service/specialty.service';
import { finalize, tap } from 'rxjs';
import { Specialty } from '../models/specialty.model';
import { DialogComponent } from '../../common/dialog/dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-appointment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, DialogComponent],
  templateUrl: './request-appointment.component.html',
  styleUrl: './request-appointment.component.css',
})
export class RequestAppointmentComponent implements OnInit {
  listSpecialties: Specialty[] = [];
  fetchingData: boolean = true;
  hasError: boolean = false;
  errorMessage: string = '';
  requestAppointmentForm: FormGroup<{
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    dni: FormControl<string>;
    specialtyId: FormControl<number | null>;
    appointmentDate: FormControl<string>; // 'YYYY-MM-DD'
    appointmentTime: FormControl<string>; // 'HH:MM'
  }>;
  // Dialog
  showDialog = false;
  dialogMessage = '';
  dialogType: 'success' | 'error' = 'success';

  constructor(
    private appointmentService: AppointmentService,
    private specialtyService: SpecialtyService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Initialize the form with FormBuilder
    this.requestAppointmentForm = this.fb.group({
      firstName: this.fb.control('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      lastName: this.fb.control('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      dni: this.fb.control('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
          Validators.pattern(/^\d+$/), // Only allows digits
        ],
      }),
      specialtyId: this.fb.control<number | null>(null, {
        validators: Validators.required,
      }),
      appointmentDate: this.fb.control<string>('', {
        nonNullable: true,
        validators: Validators.required,
      }),
      appointmentTime: this.fb.control<string>('', {
        nonNullable: true,
        validators: Validators.required,
      }),
    });
  }

  ngOnInit(): void {
    this.specialtyService
      .getSpecialties()
      .pipe(
        tap((data) => console.log(`Fetched specialties: ${data}`)),
        finalize(() => {
          this.fetchingData = false;
        })
      )
      .subscribe({
        next: (data) => {
          this.listSpecialties = data;
          console.log(`data received:`);
          console.log(data);
        },
        error: (e) => {
          console.error(e);
          this.hasError = true;
        },
        complete: () => {
          console.info(`completed call`);
        },
      });
  }

  get firstName() {
    return this.requestAppointmentForm.get('firstName');
  }

  get lastName() {
    return this.requestAppointmentForm.get('lastName');
  }

  get dni() {
    return this.requestAppointmentForm.get('dni');
  }

  get specialtyId() {
    return this.requestAppointmentForm.get('specialtyId');
  }

  get appointmentDate() {
    return this.requestAppointmentForm.get('appointmentDate');
  }

  get appointmentTime() {
    return this.requestAppointmentForm.get('appointmentTime');
  }

  handleSubmit() {
    console.log(this.requestAppointmentForm.value);
    if (!this.requestAppointmentForm.valid) {
      this.dialogMessage = 'Corregir los campos indicados';
      this.dialogType = 'error';
      this.showDialog = true;
      // Mark all controls as touched to show validation errors
      Object.keys(this.requestAppointmentForm.controls).forEach((field) => {
        const control = this.requestAppointmentForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    const requestAppointmentForm = this.requestAppointmentForm.value;
    const datePart = requestAppointmentForm.appointmentDate!;
    const timePart = requestAppointmentForm.appointmentTime!;
    const dateTimeObj = new Date(`${datePart}T${timePart}`);
    // Get user's local time zone offset in minutes
    const offsetMinutes = dateTimeObj.getTimezoneOffset(); // Returns minutes difference from UTC
    // Convert offset to ±HH:MM format
    const offsetHours = Math.abs(Math.floor(offsetMinutes / 60));
    const offsetMins = Math.abs(offsetMinutes % 60);
    const offsetSign = offsetMinutes > 0 ? '-' : '+';
    const formattedOffset = `${offsetSign}${String(offsetHours).padStart(
      2,
      '0'
    )}:${String(offsetMins).padStart(2, '0')}`;

    // Format the final date-time string with the offset
    const appointmentDateTime = `${datePart}T${timePart}:00${formattedOffset}`;

    const requestAppointment: AppointmentRequest = {
      firstName: requestAppointmentForm.firstName!,
      lastName: requestAppointmentForm.lastName!,
      dni: requestAppointmentForm.dni!,
      specialtyId: requestAppointmentForm.specialtyId!,
      appointmentDateTime: appointmentDateTime,
    };
    console.log(`send request appointment`);
    console.log(requestAppointment);

    // Send Request to API
    this.appointmentService.createAppointment(requestAppointment).subscribe({
      next: () => {
        console.log(`Appointment created successfully`);
        this.dialogMessage = 'Cita creada exitosamente =)';
        this.dialogType = 'success';
        this.showDialog = true;
        this.requestAppointmentForm.reset(); // clear form upon successful submission
      },
      error: (error: Error) => {
        console.log(`GG Something went wrong: error creating Appointment`);
        this.dialogMessage = `Error al crear cita =( \n ${error.message}`;
        this.dialogType = 'error';
        this.showDialog = true;
        console.error(error.message);
      },
    });
  }

  closeDialog() {
    this.showDialog = false;
    if (this.dialogType === 'success') {
      this.router.navigate(['/']);
    }
  }
}
