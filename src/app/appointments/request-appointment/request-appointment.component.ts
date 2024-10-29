import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-request-appointment',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './request-appointment.component.html',
  styleUrl: './request-appointment.component.css',
})
export class RequestAppointmentComponent {
  requestAppointmentForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    dni: new FormControl(''),
    specialtyId: new FormControl(''),
  });

  handleSubmit() {
    console.log(this.requestAppointmentForm.value);
  }
}
