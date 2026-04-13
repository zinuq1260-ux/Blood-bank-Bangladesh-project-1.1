
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export interface Donor {
  id: string;
  fullName: string;
  bloodGroup: BloodGroup;
  phone: string;
  location: string;
  lastDonationDate?: string | null;
  status: 'active' | 'inactive';
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  units: number;
  hospital: string;
  urgency: 'emergency' | 'urgent' | 'scheduled';
  contactPhone: string;
  status: 'pending' | 'finding donor' | 'processing' | 'sorry' | 'donation done' | 'waiting';
  requestedDate: string;
}

export interface EmergencyInfo {
  id: string;
  name: string;
  phone: string;
}

export type View = 'home' | 'register' | 'request' | 'login' | 'dashboard' | 'search';
