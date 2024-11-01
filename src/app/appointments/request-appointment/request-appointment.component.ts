import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AppointmentRequest } from '../models/appointment.model';

@Component({
  selector: 'app-request-appointment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './request-appointment.component.html',
  styleUrl: './request-appointment.component.css',
})
export class RequestAppointmentComponent {
  requestAppointmentForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    dni: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(8),
      Validators.pattern(/^\d+$/), // Only allows digits
    ]),
    specialtyId: new FormControl('', Validators.required),
  });

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

  private getFormPayload(): AppointmentRequest {
    const { firstName, lastName, dni, specialtyId } =
      this.requestAppointmentForm.value;
    return {
      firstName: firstName as string,
      lastName: lastName as string,
      dni: dni as string,
      specialtyId: Number(specialtyId),
    };
  }

  handleSubmit() {
    console.log(this.requestAppointmentForm.value);
    if (!this.requestAppointmentForm.valid) {
      alert('Corregir los campos indicados antes de crear su cita');
    }
    const requestAppointment = this.getFormPayload();

    // TODO: send data to the server
    // If data was sent reset the form
    this.requestAppointmentForm.reset();
  }
}
