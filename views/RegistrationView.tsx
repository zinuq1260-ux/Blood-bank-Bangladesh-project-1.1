
import React, { useState } from 'react';
import { User, MapPin, Activity, ChevronRight, ChevronLeft, CheckCircle2, Loader2, Phone, Mail, Droplet, Scale, Calendar } from 'lucide-react';
import { dataService } from '../services/dataService';
import { BloodGroup } from '../types';
import { BANGLADESH_DISTRICTS } from '../constants';

interface RegistrationViewProps {
  onComplete: () => void;
}

const RegistrationView: React.FC<RegistrationViewProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    phone: '',
    email: '',
    division: '',
    district: '',
    bloodGroup: '' as BloodGroup,
    weight: '',
    lastDonation: ''
  });

  const nextStep = () => {
    // Basic validation for current step could go here
    setStep(s => Math.min(s + 1, 4));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dataService.saveDonor({
        fullName: formData.fullName,
        bloodGroup: formData.bloodGroup,
        phone: formData.phone,
        location: `${formData.district}, ${formData.division}`,
        lastDonationDate: formData.lastDonation || null,
      });
      onComplete();
    } catch (err) {
      alert("Error connecting to database. Please check your backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { icon: <User size={20} />, label: 'Personal' },
    { icon: <MapPin size={20} />, label: 'Contact' },
    { icon: <Activity size={20} />, label: 'Medical' },
    { icon: <CheckCircle2 size={20} />, label: 'Verify' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-black text-slate-900 mb-4">Donor Registration</h1>
          <p className="text-slate-500 max-w-lg mx-auto">Complete all steps to join our life-saving community.</p>
        </div>

        {/* Progress Tracker */}
        <div className="flex justify-between items-center mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
          {steps.map((s, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                step >= idx + 1 ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-200' : 'bg-white border-slate-200 text-slate-400'
              }`}>
                {s.icon}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                step >= idx + 1 ? 'text-red-600' : 'text-slate-400'
              }`}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 p-8 sm:p-12 border border-slate-100 min-h-[500px] flex flex-col">
          <form onSubmit={handleFinalSubmit} className="flex-grow flex flex-col">
            
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center"><User size={20}/></div>
                   <h3 className="text-2xl font-bold">Personal Details</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                    <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 focus:bg-white focus:border-red-600 transition-all outline-none" placeholder="e.g. Rahul Ahmed" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date of Birth</label>
                    <input type="date" name="dob" required value={formData.dob} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 focus:bg-white focus:border-red-600 transition-all outline-none" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gender</label>
                    <div className="flex gap-4">
                      {['Male', 'Female', 'Other'].map(g => (
                        <button
                          key={g} type="button"
                          onClick={() => setFormData({...formData, gender: g})}
                          className={`flex-1 py-4 rounded-2xl border-2 font-bold transition-all ${
                            formData.gender === g ? 'border-red-600 bg-red-50 text-red-600' : 'border-slate-50 bg-slate-50 text-slate-400'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Details */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Phone size={20}/></div>
                   <h3 className="text-2xl font-bold">Contact Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 focus:bg-white focus:border-red-600 transition-all outline-none" placeholder="+880 1XXX-XXXXXX" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 focus:bg-white focus:border-red-600 transition-all outline-none" placeholder="rahul@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Division</label>
                    <select name="division" required value={formData.division} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 focus:bg-white focus:border-red-600 transition-all outline-none font-bold">
                       <option value="">Select Division</option>
                       {['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'].map(d => (
                         <option key={d} value={d}>{d}</option>
                       ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">District</label>
                    <select 
                      name="district" 
                      required 
                      value={formData.district} 
                      onChange={handleChange} 
                      className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 focus:bg-white focus:border-red-600 transition-all outline-none font-bold"
                    >
                      <option value="">Select District</option>
                      {BANGLADESH_DISTRICTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Medical Info */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center"><Activity size={20}/></div>
                   <h3 className="text-2xl font-bold">Medical Details</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Blood Group</label>
                    <select name="bloodGroup" required value={formData.bloodGroup} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 focus:bg-white focus:border-red-600 transition-all outline-none font-bold text-red-600">
                       <option value="">Select Group</option>
                       {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                         <option key={bg} value={bg}>{bg}</option>
                       ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Weight (kg)</label>
                    <input type="number" name="weight" required value={formData.weight} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 focus:bg-white focus:border-red-600 transition-all outline-none" placeholder="Min 50kg recommended" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last Donation Date (If any)</label>
                    <input type="date" name="lastDonation" value={formData.lastDonation} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 focus:bg-white focus:border-red-600 transition-all outline-none" />
                    <p className="text-[10px] text-slate-400 mt-2 font-medium italic">Leave empty if you are a first-time donor.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Verification Summary */}
            {step === 4 && (
              <div className="space-y-8 animate-in zoom-in-95 duration-500">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">Review & Confirm</h3>
                  <p className="text-slate-500">Please verify your details before submitting.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {[
                     { label: 'Name', value: formData.fullName, icon: <User size={14}/> },
                     { label: 'Blood Group', value: formData.bloodGroup, icon: <Droplet size={14}/>, highlight: true },
                     { label: 'Phone', value: formData.phone, icon: <Phone size={14}/> },
                     { label: 'Location', value: `${formData.district}, ${formData.division}`, icon: <MapPin size={14}/> },
                     { label: 'Weight', value: `${formData.weight} kg`, icon: <Scale size={14}/> },
                     { label: 'Last Donation', value: formData.lastDonation || 'First Time', icon: <Calendar size={14}/> },
                   ].map((item, i) => (
                     <div key={i} className={`p-4 rounded-2xl border flex items-center gap-4 ${item.highlight ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.highlight ? 'bg-red-600 text-white' : 'bg-white text-slate-400'}`}>
                          {item.icon}
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                           <p className={`font-bold ${item.highlight ? 'text-red-600' : 'text-slate-900'}`}>{item.value}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            )}

            <div className="mt-auto pt-12 flex flex-col-reverse sm:flex-row justify-between gap-4">
              {step > 1 && (
                <button type="button" onClick={prevStep} className="px-10 py-5 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                  <ChevronLeft size={20} /> Back
                </button>
              )}
              {step < 4 ? (
                <button 
                  type="button" 
                  onClick={nextStep} 
                  className="sm:ml-auto px-10 py-5 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-2 active:scale-95"
                >
                  Continue <ChevronRight size={20} />
                </button>
              ) : (
                <button 
                  type="submit" disabled={isSubmitting}
                  className="sm:ml-auto px-16 py-5 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all shadow-xl shadow-green-100 disabled:opacity-50 flex items-center gap-3 active:scale-95"
                >
                  {isSubmitting ? <><Loader2 className="animate-spin" size={20} /> Registering...</> : "Confirm & Save"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationView;
