
import React from 'react';
import { Droplets, ChevronRight, Search, Activity } from 'lucide-react';
import { BLOOD_GROUPS, STATS } from '../constants';
import { View } from '../types';

interface LandingViewProps {
  onViewChange: (view: View) => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onViewChange }) => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-10 pb-20 sm:pt-20 sm:pb-32 bg-gradient-to-br from-red-50 via-white to-red-50/30 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-red-600/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-red-600 font-bold text-sm mb-6 border border-red-100">
                <Activity size={16} /> Trusted Life-Saving Platform
              </div>
              <h1 className="text-5xl sm:text-7xl font-serif font-black text-slate-900 leading-[1.1] mb-8">
                Every <span className="text-red-600">Drop</span><br />
                Saves a Life
              </h1>
              <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                Join Bangladesh's most trusted network of donors. We provide professional management, 
                instant matching, and 24/7 support for all blood types across 64 districts.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button 
                  onClick={() => onViewChange('register')}
                  className="w-full sm:w-auto px-10 py-5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-xl shadow-red-200 transition-all active:scale-95 text-lg"
                >
                  Become a Donor
                </button>
                <button 
                  onClick={() => onViewChange('request')}
                  className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-200 hover:border-red-600 hover:text-red-600 text-slate-700 font-bold rounded-2xl transition-all active:scale-95 text-lg"
                >
                  Request Blood
                </button>
              </div>

              <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto lg:mx-0">
                {STATS.map((stat, idx) => (
                  <div key={idx} className="flex flex-col items-center lg:items-start">
                    <span className="text-3xl font-black text-red-600">{stat.value}</span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                {/* Decorative Elements */}
                <div className="absolute inset-0 bg-red-100 rounded-full blur-3xl opacity-50 animate-pulse" />
                <div className="relative z-10 w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-8">
                  <div className="h-full flex flex-col justify-center items-center gap-6">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center animate-pulse-red">
                       <Droplets className="text-red-600" size={48} />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-2">Real-time Donor Match</h3>
                      <p className="text-sm text-slate-500">Analyzing thousands of profiles to find the closest match for you in seconds.</p>
                    </div>
                    <div className="w-full space-y-3">
                       <div className="h-3 w-3/4 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full w-2/3 bg-red-400 rounded-full" />
                       </div>
                       <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full w-1/2 bg-red-400 rounded-full" />
                       </div>
                       <div className="h-3 w-1/2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full w-4/5 bg-red-400 rounded-full" />
                       </div>
                    </div>
                    <div className="flex -space-x-3">
                       {[1,2,3,4,5].map(i => (
                         <img key={i} src={`https://picsum.photos/seed/${i+10}/64`} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="User" />
                       ))}
                       <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white">
                         +50k
                       </div>
                    </div>
                  </div>
                </div>
                {/* Floating tags */}
                <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 z-20 flex items-center gap-3 animate-bounce">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <Search size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Emergency Search</p>
                    <p className="text-sm font-bold text-slate-900">Found 3 Donors Nearby</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blood Group Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-serif font-black text-slate-900 mb-6">
              Available <span className="text-red-600 underline decoration-red-200 decoration-8 underline-offset-4">Blood Groups</span>
            </h2>
            <p className="text-slate-600">Select your blood group to view live availability statistics and connect with active donors in your district.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {BLOOD_GROUPS.map((group, idx) => (
              <div 
                key={idx} 
                onClick={() => onViewChange('request')}
                className="group relative bg-white border-2 border-slate-50 rounded-[32px] p-8 text-center transition-all hover:border-red-600 hover:shadow-2xl hover:shadow-red-100 cursor-pointer active:scale-95"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={20} className="text-red-600" />
                </div>
                <h3 className="text-5xl font-serif font-black text-red-600 mb-4 group-hover:scale-110 transition-transform">{group.type}</h3>
                <div className="space-y-1">
                  <p className="text-xl font-black text-slate-900">{group.count}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Donors</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-red-600 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 italic">"Blood is meant to circulate. Pass it on."</h2>
          <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Every 2 seconds, someone in Bangladesh needs blood. Your small act of kindness can give someone a second chance at life.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button 
              onClick={() => onViewChange('register')}
              className="w-full sm:w-auto px-12 py-5 bg-white text-red-600 font-black rounded-2xl shadow-xl hover:bg-red-50 transition-all active:scale-95 text-lg"
            >
              Start Saving Lives
            </button>
            <button 
              onClick={() => onViewChange('request')}
              className="w-full sm:w-auto px-12 py-5 bg-red-700 text-white font-black rounded-2xl hover:bg-red-800 transition-all active:scale-95 text-lg"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingView;
