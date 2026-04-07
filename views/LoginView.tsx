
import React, { useState } from 'react';
import { Lock, User, ChevronRight, Droplets } from 'lucide-react';

interface LoginViewProps {
  onLogin: (user: string) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Demo logic
    setTimeout(() => {
      if (username === 'superadmin' && password === 'bloodbank2026') {
        onLogin(username);
      } else {
        alert("Invalid credentials. Please try again.");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-red-600 p-12 text-white flex flex-col justify-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M0 0 L100 0 L100 100 L0 100 Z" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="5,5" />
              </svg>
           </div>
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                   <Droplets className="text-red-600" size={28} />
                </div>
                <h1 className="text-2xl font-black">BloodBank<span className="text-red-200">BD</span></h1>
              </div>
              <h2 className="text-4xl font-serif font-black mb-6 leading-tight">Admin Portal Secure Access</h2>
              <p className="text-red-100 mb-10 leading-relaxed max-w-sm">
                Securely manage donors, monitor real-time requests, and coordinate emergency responses across the country.
              </p>
              <div className="space-y-4">
                {['Secure Encryption', 'Real-time Monitoring', 'Complete Audit Logs'].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-bold bg-white/10 p-4 rounded-2xl border border-white/10">
                    <div className="w-2 h-2 bg-white rounded-full" /> {f}
                  </div>
                ))}
              </div>
           </div>
        </div>

        <div className="p-12 sm:p-20 flex flex-col justify-center">
          <div className="mb-12">
            <h3 className="text-3xl font-black text-slate-900 mb-2">Welcome Back</h3>
            <p className="text-slate-500 font-medium">Please enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Username</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" required value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-14 pr-6 py-4 focus:bg-white focus:border-red-600 transition-all outline-none" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-14 pr-6 py-4 focus:bg-white focus:border-red-600 transition-all outline-none" 
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
               <label className="flex items-center gap-2 text-sm font-bold text-slate-500 cursor-pointer">
                 <input type="checkbox" className="w-4 h-4 rounded text-red-600 border-slate-200" /> Remember Me
               </label>
               <button type="button" className="text-sm font-bold text-red-600">Forgot Password?</button>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full py-5 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Login to Dashboard"} <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
