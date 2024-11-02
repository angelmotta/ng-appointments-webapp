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

@Component({
  selector: 'app-request-appointment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
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
    specialtyId: FormControl<number>;
  }>;

  constructor(
    private appointmentService: AppointmentService,
    private specialtyService: SpecialtyService,
    private fb: FormBuilder
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
      specialtyId: this.fb.control(0, {
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

  // requestAppointmentForm = new FormGroup({
  //   firstName: new FormControl('', {
  //     nonNullable: true,
  //     validators: Validators.required,
  //   }),
  //   lastName: new FormControl('', {
  //     nonNullable: true,
  //     validators: Validators.required,
  //   }),
  //   dni: new FormControl('', {
  //     nonNullable: true,
  //     validators: [
  //       Validators.required,
  //       Validators.minLength(8),
  //       Validators.maxLength(8),
  //       Validators.pattern(/^\d+$/), // Only allows digits
  //     ],
  //   }),
  //   specialtyId: new FormControl(0, {
  //     nonNullable: true,
  //     validators: Validators.required,
  //   }),
  // });

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

  handleSubmit() {
    console.log(this.requestAppointmentForm.value);
    if (!this.requestAppointmentForm.valid) {
      alert('Corregir los campos indicados antes de crear su cita');
    }
    // const requestAppointment = this.getFormPayload();
    const requestAppointment = this.requestAppointmentForm
      .value as AppointmentRequest;
    // Send Request to API
    this.appointmentService.createAppointment(requestAppointment).subscribe({
      next: () => {
        console.log(`Appointment created successfully`);
        this.requestAppointmentForm.reset(); // clear form upon successful submission
        // TODO: show success Dialog
        alert(`Cita creada exitosamente =)`);
      },
      error: (error: Error) => {
        console.log(`Something went wrong: error creating Appointment`);
        console.error(error.message);
        // TODO: show error Dialog
        alert(`Error al crear Cita =(\n${error.message}`);
      },
    });
  }
}
