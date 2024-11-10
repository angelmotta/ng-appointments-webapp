import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AppointmentsListComponent } from './appointments/appointments-list/appointments-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    AppointmentsListComponent,
    MatToolbarModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'appointments-webapp';

  onCreateAppointment() {
    console.log('Create appointment clicked');
    // routerLink="/cita"
  }
}
