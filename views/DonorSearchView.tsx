
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Droplets, Phone, Calendar, ArrowLeft, Filter } from 'lucide-react';
import { Donor, BloodGroup, View } from '../types';
import { dataService } from '../services/dataService';
import { BLOOD_GROUPS, BANGLADESH_DISTRICTS } from '../constants';

interface DonorSearchViewProps {
  onBack: () => void;
  initialBloodGroup?: string;
  initialLocation?: string;
}

const DonorSearchView: React.FC<DonorSearchViewProps> = ({ onBack, initialBloodGroup, initialLocation }) => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState(initialLocation || '');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup | 'All'>(() => {
    if (initialBloodGroup === 'Any Blood Group' || !initialBloodGroup) return 'All';
    return initialBloodGroup as BloodGroup;
  });

  useEffect(() => {
    const fetchDonors = async () => {
      setLoading(true);
      const allDonors = await dataService.getDonors();
      setDonors(allDonors);
      setLoading(false);
    };
    fetchDonors();
  }, []);

  useEffect(() => {
    if (initialBloodGroup) {
      setSelectedBloodGroup(initialBloodGroup === 'Any Blood Group' ? 'All' : initialBloodGroup as BloodGroup);
    }
    if (initialLocation) {
      setSearchLocation(initialLocation);
    }
  }, [initialBloodGroup, initialLocation]);

  useEffect(() => {
    let result = donors;

    if (selectedBloodGroup !== 'All') {
      result = result.filter(d => d.bloodGroup === selectedBloodGroup);
    }

    if (searchLocation.trim()) {
      const term = searchLocation.toLowerCase();
      result = result.filter(d => 
        d.location.toLowerCase().includes(term)
      );
    }

    setFilteredDonors(result);
  }, [searchLocation, selectedBloodGroup, donors]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-red-600 font-bold transition-colors"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <h1 className="text-xl font-serif font-black text-slate-900">Find Donors</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Search Controls */}
        <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 p-6 md:p-10 mb-10 border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-red-600 focus:bg-white rounded-2xl outline-none transition-all font-medium appearance-none"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                >
                  <option value="">All Locations</option>
                  {BANGLADESH_DISTRICTS.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Blood Group</label>
              <div className="relative">
                <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-red-600 focus:bg-white rounded-2xl outline-none transition-all font-medium appearance-none"
                  value={selectedBloodGroup}
                  onChange={(e) => setSelectedBloodGroup(e.target.value as BloodGroup | 'All')}
                >
                  <option value="All">All Blood Groups</option>
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg.type} value={bg.type}>{bg.type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-end">
              <div className="w-full p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center">
                  <Filter size={20} />
                </div>
                <div>
                  <p className="text-xs text-red-600 font-bold uppercase">Results Found</p>
                  <p className="text-lg font-black text-slate-900">{filteredDonors.length} Donors</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-red-100 border-t-red-600 rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Searching donor database...</p>
          </div>
        ) : filteredDonors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonors.map((donor) => (
              <div 
                key={donor.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-red-50 transition-all group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 font-serif text-2xl font-black group-hover:bg-red-600 group-hover:text-white transition-colors">
                      {donor.bloodGroup}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{donor.fullName}</h3>
                      <div className="flex items-center gap-1 text-slate-400 text-sm">
                        <MapPin size={14} />
                        <span>{donor.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    donor.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {donor.status}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Last Donation</span>
                    <span className="font-bold text-slate-700">{donor.lastDonationDate || 'Never'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Availability</span>
                    <span className="font-bold text-green-600">Immediate</span>
                  </div>
                </div>

                <button 
                  onClick={() => window.location.href = `tel:${donor.phone}`}
                  className="w-full py-4 bg-slate-900 hover:bg-red-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Phone size={18} /> Call Donor
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[32px] p-20 text-center border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-serif font-black text-slate-900 mb-2">No Donors Found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              We couldn't find any donors matching your criteria. Try searching in a nearby area or for a different blood group.
            </p>
            <button 
              onClick={() => { setSearchLocation(''); setSelectedBloodGroup('All'); }}
              className="mt-8 px-8 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorSearchView;
