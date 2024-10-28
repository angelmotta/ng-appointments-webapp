export interface Appointment {
  id: number;
  firstName: string;
  lastName: string;
  dni: string;
  specialtyId: number;
  specialtyName: string;
}

export interface PaginatedAppointments {
  data: Appointment[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}