
import React, { useState } from 'react';
import { AlertCircle, Heart, Loader2, CheckCircle } from 'lucide-react';
import { dataService } from '../services/dataService';
import { BloodGroup } from '../types';

interface RequestViewProps {
  onComplete: () => void;
}

const RequestView: React.FC<RequestViewProps> = ({ onComplete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: '' as BloodGroup,
    units: '1',
    urgency: 'urgent' as 'emergency' | 'urgent' | 'scheduled',
    hospital: '',
    contactPhone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dataService.saveRequest({
        patientName: formData.patientName,
        bloodGroup: formData.bloodGroup,
        units: parseInt(formData.units),
        hospital: formData.hospital,
        urgency: formData.urgency
      });
      setIsSuccess(true);
      setTimeout(() => onComplete(), 2000);
    } catch (error) {
      alert("Submission failed. Database connection error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-12 rounded-[40px] shadow-2xl text-center max-w-md w-full animate-in zoom-in-95 duration-500">
           <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle size={64} />
           </div>
           <h2 className="text-3xl font-black text-slate-900 mb-4">Request Received</h2>
           <p className="text-slate-500 font-medium">Your request has been saved to the central database. Donors are being notified.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 p-8 sm:p-12 border border-slate-100">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full font-bold text-xs mb-8">
            <AlertCircle size={14} /> Emergency Submission
          </div>
          <h1 className="text-3xl font-serif font-black text-slate-900 mb-8">Blood Request</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Patient Name</label>
              <input 
                type="text" required value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3 focus:bg-white focus:border-red-600 transition-all outline-none" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Blood Group</label>
                <select 
                  required value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value as BloodGroup})}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3 focus:bg-white focus:border-red-600 transition-all outline-none font-bold"
                >
                  <option value="">Select Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Units Needed</label>
                <input 
                  type="number" min="1" required value={formData.units} onChange={e => setFormData({...formData, units: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3 focus:bg-white focus:border-red-600 transition-all outline-none" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hospital/Clinic</label>
              <input 
                type="text" required value={formData.hospital} onChange={e => setFormData({...formData, hospital: e.target.value})}
                placeholder="e.g. Dhaka Medical College Hospital"
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3 focus:bg-white focus:border-red-600 transition-all outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Urgency Level</label>
              <div className="flex flex-wrap gap-4">
                {(['emergency', 'urgent', 'scheduled'] as const).map(level => (
                  <button
                    key={level} type="button"
                    onClick={() => setFormData({...formData, urgency: level})}
                    className={`flex-1 min-w-[100px] py-3 rounded-2xl border-2 transition-all font-bold text-xs capitalize ${
                      formData.urgency === level 
                        ? 'border-red-600 bg-red-50 text-red-600' 
                        : 'border-slate-50 bg-slate-50 text-slate-400'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Contact Number</label>
              <input 
                type="tel" required value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})}
                placeholder="e.g. +880 1711223344"
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3 focus:bg-white focus:border-red-600 transition-all outline-none" 
              />
            </div>

            <button 
              type="submit" disabled={isSubmitting}
              className="w-full py-5 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Heart size={20} fill="currentColor" />}
              {isSubmitting ? "Transmitting to Database..." : "Submit Emergency Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestView;
