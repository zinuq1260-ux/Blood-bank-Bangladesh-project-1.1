
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export interface Donor {
  id: string;
  fullName: string;
  bloodGroup: BloodGroup;
  phone: string;
  location: string;
  lastDonationDate?: string;
  status: 'active' | 'inactive';
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  units: number;
  hospital: string;
  urgency: 'emergency' | 'urgent' | 'scheduled';
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  requestedDate: string;
}

export type View = 'home' | 'register' | 'request' | 'login' | 'dashboard';
