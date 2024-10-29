import { Routes } from '@angular/router';
import { AppointmentsListComponent } from './appointments/appointments-list/appointments-list.component';
import { RequestAppointmentComponent } from './appointments/request-appointment/request-appointment.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Bienestar citas',
    component: AppointmentsListComponent,
  },
  {
    path: 'cita',
    title: 'Crear cita',
    component: RequestAppointmentComponent,
  },
];
