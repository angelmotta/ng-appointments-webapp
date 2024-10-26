import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppointmentsListComponent } from './appointments/appointments-list/appointments-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppointmentsListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'appointments-webapp';
}
