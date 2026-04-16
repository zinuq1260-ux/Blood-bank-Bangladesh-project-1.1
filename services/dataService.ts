import { Donor, BloodRequest, EmergencyInfo } from '../types';
import { supabase } from '../lib/supabase';

// LocalStorage keys
const DONORS_KEY = 'bbbd_donors';
const REQUESTS_KEY = 'bbbd_requests';
const EMERGENCY_KEY = 'bbbd_emergency_contacts';

// Helper to safely parse JSON from LocalStorage
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
  // Check if Supabase connection is alive
  checkConnection: async (): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('donors').select('id').limit(1);
      return !error;
    } catch (error) {
      return false;
    }
  },
  // Get all donors (Supabase with LocalStorage fallback)
  getDonors: async (): Promise<Donor[]> => {
    if (!supabase) {
      console.warn("Supabase not configured - Switching to LocalStorage for Donors");
      return getLocalStorageData<Donor>(DONORS_KEY);
    }
    try {
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn("API Error - Switching to LocalStorage for Donors");
      return getLocalStorageData<Donor>(DONORS_KEY);
    }
  },

  // Save new donor record
  saveDonor: async (donorData: Omit<Donor, 'id' | 'status'>): Promise<Donor> => {
    if (!supabase) {
      return dataService._saveDonorLocally(donorData);
    }
    try {
      const { data, error } = await supabase
        .from('donors')
        .insert([donorData])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.info("API failure - Performing Local Fallback Save for Donor");
      return dataService._saveDonorLocally(donorData);
    }
  },

  _saveDonorLocally: async (donorData: Omit<Donor, 'id' | 'status'>): Promise<Donor> => {
    const existingDonors = await dataService.getDonors();
    const newDonor: Donor = {
      ...donorData,
      id: `D-${Math.floor(Math.random() * 90000) + 10000}`,
      status: 'active'
    };
    const updatedList = [newDonor, ...existingDonors];
    localStorage.setItem(DONORS_KEY, JSON.stringify(updatedList));
    return newDonor;
  },

  // Get all blood requests
  getRequests: async (): Promise<BloodRequest[]> => {
    if (!supabase) {
      console.warn("Supabase not configured - Switching to LocalStorage for Requests");
      return getLocalStorageData<BloodRequest>(REQUESTS_KEY);
    }
    try {
      const { data, error } = await supabase
        .from('blood_requests')
        .select('*')
        .order('requestedDate', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn("API Error - Switching to LocalStorage for Requests");
      return getLocalStorageData<BloodRequest>(REQUESTS_KEY);
    }
  },

  // Submit blood request
  saveRequest: async (requestData: Omit<BloodRequest, 'id' | 'status' | 'requestedDate'>): Promise<BloodRequest> => {
    if (!supabase) {
      return dataService._saveRequestLocally(requestData);
    }
    try {
      const { data, error } = await supabase
        .from('blood_requests')
        .insert([requestData])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.info("API failure - Performing Local Fallback Save for Request");
      return dataService._saveRequestLocally(requestData);
    }
  },

  _saveRequestLocally: async (requestData: Omit<BloodRequest, 'id' | 'status' | 'requestedDate'>): Promise<BloodRequest> => {
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
  },

  // Update request status
  updateRequestStatus: async (id: string, status: 'pending' | 'finding donor' | 'processing' | 'sorry' | 'donation done' | 'waiting'): Promise<void> => {
    if (!supabase) {
      const requests = getLocalStorageData<BloodRequest>(REQUESTS_KEY);
      const updatedRequests = requests.map(r => r.id === id ? { ...r, status } : r);
      localStorage.setItem(REQUESTS_KEY, JSON.stringify(updatedRequests));
      return;
    }
    try {
      const { error } = await supabase
        .from('blood_requests')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("API Error - Could not update request status:", error);
      throw error;
    }
  },

  // Get emergency contacts
  getEmergencyContacts: async (): Promise<EmergencyInfo[]> => {
    if (!supabase) {
      return getLocalStorageData<EmergencyInfo>(EMERGENCY_KEY);
    }
    try {
      const { data, error } = await supabase
        .from('emergency_info')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn("API Error - Switching to LocalStorage for Emergency Contacts");
      return getLocalStorageData<EmergencyInfo>(EMERGENCY_KEY);
    }
  },

  // Save emergency contact
  saveEmergencyContact: async (contactData: Omit<EmergencyInfo, 'id'>): Promise<EmergencyInfo> => {
    if (!supabase) {
      const contacts = getLocalStorageData<EmergencyInfo>(EMERGENCY_KEY);
      const newContact: EmergencyInfo = {
        ...contactData,
        id: Date.now().toString()
      };
      localStorage.setItem(EMERGENCY_KEY, JSON.stringify([...contacts, newContact]));
      return newContact;
    }
    try {
      const { data, error } = await supabase
        .from('emergency_info')
        .insert([contactData])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error("Failed to save emergency contact:", error);
      throw error;
    }
  },

  // Update emergency contact
  updateEmergencyContact: async (id: string, contactData: Omit<EmergencyInfo, 'id'>): Promise<void> => {
    if (!supabase) {
      const contacts = getLocalStorageData<EmergencyInfo>(EMERGENCY_KEY);
      const updated = contacts.map(c => c.id === id ? { ...c, ...contactData } : c);
      localStorage.setItem(EMERGENCY_KEY, JSON.stringify(updated));
      return;
    }
    try {
      const { error } = await supabase
        .from('emergency_info')
        .update(contactData)
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Failed to update emergency contact:", error);
      throw error;
    }
  },

  // Delete emergency contact
  deleteEmergencyContact: async (id: string): Promise<void> => {
    if (!supabase) {
      const contacts = getLocalStorageData<EmergencyInfo>(EMERGENCY_KEY);
      localStorage.setItem(EMERGENCY_KEY, JSON.stringify(contacts.filter(c => c.id !== id)));
      return;
    }
    try {
      const { error } = await supabase
        .from('emergency_info')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error("Failed to delete emergency contact:", error);
      throw error;
    }
  },

  // Aggregate stats for dashboard
  getStats: async () => {
    const donors = await dataService.getDonors();
    const requests = await dataService.getRequests();
    const totalVisitors = await dataService.getVisitorCount();
    
    const bloodGroupCounts = donors.reduce((acc, donor) => {
      acc[donor.bloodGroup] = (acc[donor.bloodGroup] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalDonors: donors.length,
      pendingRequests: requests.filter(r => r.status === 'pending').length,
      successfulDonations: requests.filter(r => r.status === 'donation done').length,
      totalVisitors,
      bloodGroupCounts
    };
  },

  // Record site visit
  recordVisit: async (): Promise<void> => {
    if (!supabase) {
      const currentCount = parseInt(localStorage.getItem('bbbd_visitors') || '0', 10);
      localStorage.setItem('bbbd_visitors', (currentCount + 1).toString());
      return;
    }
    try {
      await supabase.from('visitors').insert([{}]);
    } catch (error) {
      console.error("Failed to record visit:", error);
    }
  },

  // Get total visitor count
  getVisitorCount: async (): Promise<number> => {
    if (!supabase) {
      return parseInt(localStorage.getItem('bbbd_visitors') || '0', 10);
    }
    try {
      const { count, error } = await supabase
        .from('visitors')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error("Failed to get visitor count:", error);
      return parseInt(localStorage.getItem('bbbd_visitors') || '0', 10);
    }
  }
};
