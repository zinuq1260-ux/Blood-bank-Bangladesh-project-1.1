
import { Donor, BloodRequest, BloodGroup } from '../types';

const DONORS_KEY = 'bbbd_donors';
const REQUESTS_KEY = 'bbbd_requests';

// Initial Mock Data
const INITIAL_DONORS: Donor[] = [
  { id: 'D-50234', fullName: 'Mohammad Rahman', bloodGroup: 'O+', phone: '+880 1712-345678', location: 'Dhaka', status: 'active' },
  { id: 'D-50233', fullName: 'Fatima Ahmed', bloodGroup: 'B+', phone: '+880 1812-345679', location: 'Chittagong', status: 'active' },
  { id: 'D-50232', fullName: 'Abdul Karim', bloodGroup: 'A-', phone: '+880 1912-345680', location: 'Sylhet', status: 'inactive' },
];

export const dataService = {
  getDonors: (): Donor[] => {
    const stored = localStorage.getItem(DONORS_KEY);
    if (!stored) {
      localStorage.setItem(DONORS_KEY, JSON.stringify(INITIAL_DONORS));
      return INITIAL_DONORS;
    }
    return JSON.parse(stored);
  },

  saveDonor: (donorData: Omit<Donor, 'id' | 'status'>): Donor => {
    const donors = dataService.getDonors();
    const newDonor: Donor = {
      ...donorData,
      id: `D-${Math.floor(Math.random() * 90000) + 10000}`,
      status: 'active'
    };
    const updated = [newDonor, ...donors];
    localStorage.setItem(DONORS_KEY, JSON.stringify(updated));
    return newDonor;
  },

  getRequests: (): BloodRequest[] => {
    const stored = localStorage.getItem(REQUESTS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveRequest: (requestData: Omit<BloodRequest, 'id' | 'status' | 'requestedDate'>): BloodRequest => {
    const requests = dataService.getRequests();
    const newRequest: BloodRequest = {
      ...requestData,
      id: `REQ-${Math.floor(Math.random() * 90000) + 10000}`,
      status: 'pending',
      requestedDate: new Date().toISOString()
    };
    const updated = [newRequest, ...requests];
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(updated));
    return newRequest;
  },

  getStats: () => {
    const donors = dataService.getDonors();
    const requests = dataService.getRequests();
    
    // Group distribution
    const distribution = donors.reduce((acc, d) => {
      acc[d.bloodGroup] = (acc[d.bloodGroup] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalDonors: donors.length,
      pendingRequests: requests.filter(r => r.status === 'pending').length,
      successfulDonations: donors.length * 2, // Mock logic
      distribution: Object.entries(distribution).map(([group, count]) => ({
        group,
        percent: Math.round((count / donors.length) * 100)
      }))
    };
  }
};
