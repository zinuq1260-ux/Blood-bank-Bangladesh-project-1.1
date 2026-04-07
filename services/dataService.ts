import { Donor, BloodRequest } from '../types';

/**
 * Backend API URL Configuration
 * Using relative paths as the backend is now integrated into the same server.
 */
const API_URL = '/api'; 

const DONORS_KEY = 'bbbd_donors';
const REQUESTS_KEY = 'bbbd_requests';

/**
 * Helper to safely parse JSON from LocalStorage
 */
const getLocalStorageData = <T>(key: string): T[] => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error(`Error parsing ${key} from LocalStorage:`, error);
    return [];
  }
};

export const dataService = {
  /**
   * Pings the backend to check if the MongoDB connection is alive.
   * Uses a timeout to prevent long-hanging requests.
   */
  checkConnection: async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${API_URL}/health`, { 
        method: 'GET',
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  /**
   * Retrieves all registered donors.
   * Prioritizes API data, falls back to LocalStorage if offline.
   */
  getDonors: async (): Promise<Donor[]> => {
    try {
      const res = await fetch(`${API_URL}/donors`);
      if (!res.ok) throw new Error('Backend API unreachable');
      return await res.json();
    } catch (error) {
      console.warn("API Error - Switching to LocalStorage for Donors");
      return getLocalStorageData<Donor>(DONORS_KEY);
    }
  },

  /**
   * Saves a new donor record.
   * If the API is offline, saves locally to ensure no data loss during emergencies.
   */
  saveDonor: async (donorData: Omit<Donor, 'id' | 'status'>): Promise<Donor> => {
    try {
      const res = await fetch(`${API_URL}/donors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donorData)
      });
      if (!res.ok) throw new Error('Failed to persist to MongoDB');
      return await res.json();
    } catch (error) {
      console.info("API failure - Performing Local Fallback Save for Donor");
      const existingDonors = await dataService.getDonors();
      const newDonor: Donor = {
        ...donorData,
        id: `D-${Math.floor(Math.random() * 90000) + 10000}`,
        status: 'active'
      };
      const updatedList = [newDonor, ...existingDonors];
      localStorage.setItem(DONORS_KEY, JSON.stringify(updatedList));
      return newDonor;
    }
  },

  /**
   * Retrieves all blood requests.
   * Seamlessly handles offline states via LocalStorage.
   */
  getRequests: async (): Promise<BloodRequest[]> => {
    try {
      const res = await fetch(`${API_URL}/requests`);
      if (!res.ok) throw new Error('Backend API unreachable');
      return await res.json();
    } catch (error) {
      console.warn("API Error - Switching to LocalStorage for Requests");
      return getLocalStorageData<BloodRequest>(REQUESTS_KEY);
    }
  },

  /**
   * Submits a blood request to the server or LocalStorage.
   */
  saveRequest: async (requestData: Omit<BloodRequest, 'id' | 'status' | 'requestedDate'>): Promise<BloodRequest> => {
    try {
      const res = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      if (!res.ok) throw new Error('Failed to persist request to MongoDB');
      return await res.json();
    } catch (error) {
      console.info("API failure - Performing Local Fallback Save for Request");
      const existingRequests = await dataService.getRequests();
      const newRequest: BloodRequest = {
        ...requestData,
        id: `REQ-${Math.floor(Math.random() * 90000) + 10000}`,
        status: 'pending',
        requestedDate: new Date().toISOString()
      };
      const updatedList = [newRequest, ...existingRequests];
      localStorage.setItem(REQUESTS_KEY, JSON.stringify(updatedList));
      return newRequest;
    }
  },

  /**
   * Aggregates stats from available data sources for the dashboard.
   */
  getStats: async () => {
    const donors = await dataService.getDonors();
    const requests = await dataService.getRequests();
    
    return {
      totalDonors: donors.length,
      pendingRequests: requests.filter(r => r.status === 'pending').length,
      successfulDonations: Math.floor(donors.length * 1.5 + 5), // Enhanced simulation for demo
    };
  }
};