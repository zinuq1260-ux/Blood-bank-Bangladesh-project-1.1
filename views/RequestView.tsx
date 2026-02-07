
import React, { useState } from 'react';
import { AlertCircle, BrainCircuit, Loader2, Heart, CheckCircle2 } from 'lucide-react';
import { getSmartDonorMatch } from '../services/geminiService';
import { dataService } from '../services/dataService';
import { BloodGroup } from '../types';

interface RequestViewProps {
  onComplete: () => void;
}

const RequestView: React.FC<RequestViewProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: '' as BloodGroup,
    units: '1',
    urgency: 'urgent' as 'emergency' | 'urgent' | 'scheduled',
    hospital: '',
    contactPhone: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.saveRequest({
      patientName: formData.patientName,
      bloodGroup: formData.bloodGroup,
      units: parseInt(formData.units),
      hospital: formData.hospital,
      urgency: formData.urgency
    });
    onComplete();
  };

  const handleAiAnalysis = async () => {
    if (!formData.bloodGroup || !formData.hospital) {
      alert("Please fill in basic details like blood group and hospital first.");
      return;
    }
    setIsAnalyzing(true);
    const analysis = await getSmartDonorMatch(formData);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
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

            <div className="grid grid-cols-2 gap-4">
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
              <div className="flex gap-4">
                {(['emergency', 'urgent', 'scheduled'] as const).map(level => (
                  <button
                    key={level} type="button"
                    onClick={() => setFormData({...formData, urgency: level})}
                    className={`flex-1 py-3 rounded-2xl border-2 transition-all font-bold text-xs capitalize ${
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

            <button 
              type="submit"
              className="w-full py-5 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-3"
            >
              <Heart size={20} fill="currentColor" /> Submit Emergency Request
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[40px] p-8 text-white relative overflow-hidden">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-600 rounded-2xl">
                   <BrainCircuit className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold">AI Matching Assistant</h3>
             </div>
             <p className="text-slate-300 text-sm mb-8 leading-relaxed">
               Our AI analyzes historical donation trends to provide real-time recommendations for your request.
             </p>
             
             {!aiAnalysis ? (
               <button 
                 onClick={handleAiAnalysis}
                 disabled={isAnalyzing}
                 className="w-full py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
               >
                 {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : "Get AI Strategy"}
               </button>
             ) : (
               <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                 <h4 className="font-bold mb-3 flex items-center gap-2 text-red-400">
                   <CheckCircle2 size={16} /> Recommended Strategy
                 </h4>
                 <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed italic">
                   "{aiAnalysis}"
                 </div>
                 <button 
                   onClick={() => setAiAnalysis(null)}
                   className="mt-6 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                 >
                   Refresh Analysis
                 </button>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestView;
