export interface Appointment {
  id: number;
  firstName: string;
  lastName: string;
  dni: string;
  specialtyId: number;
  specialtyName: string;
  appointmentDateTime: Date;
  createdAt: Date;
}

export interface PaginatedAppointments {
  data: Appointment[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface AppointmentRequest {
  firstName: string;
  lastName: string;
  dni: string;
  specialtyId: number;
  appointmentDateTime: string;
}
