
import React, { useState } from 'react';
import { Droplets, Menu, X, Phone, Lock, AlertTriangle } from 'lucide-react';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'search', label: 'Find Donors' },
    { id: 'register', label: 'Become Donor' },
    { id: 'request', label: 'Request Blood' },
  ];

  const handleReport = () => {
    const email = "teamspydonorline@gmail.com";
    const subject = encodeURIComponent("Report/Complaint - BloodBankBD");
    const body = encodeURIComponent("Please describe your issue or report here:\n\n");
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
      <div className="bg-slate-900 text-white text-[12px] py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <a href="tel:01980484770" className="flex items-center gap-1.5 hover:text-red-400 transition-colors font-bold text-red-400">
              <Phone size={18} />
            </a>
            <span>📧 teamspydonorline@gmail.com</span>
          </div>
          <button 
            onClick={() => onViewChange('login')}
            className="flex items-center gap-1 hover:text-red-400 transition-colors"
          >
            <Lock size={12} /> Admin Portal
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onViewChange('home')}>
          <div className="w-10 h-10 bg-red-600 rounded-tr-2xl rounded-bl-2xl rotate-45 flex items-center justify-center -translate-y-1">
            <Droplets className="text-white -rotate-45" size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-none">
              BloodBank<span className="text-red-600">BD</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Save Lives Together</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => onViewChange(link.id as View)}
              className={`text-sm font-semibold transition-colors relative py-2 ${
                currentView === link.id ? 'text-red-600' : 'text-slate-600 hover:text-red-600'
              }`}
            >
              {link.label}
              {currentView === link.id && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-full" />}
            </button>
          ))}
          
          <button 
            onClick={() => onViewChange('register')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-red-200 transition-all active:scale-95"
          >
            Register Now
          </button>
        </div>

        {/* Mobile Menu Btn */}
        <div className="flex items-center gap-4 md:hidden">
          <button className="text-slate-600" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 w-full shadow-xl border-t border-slate-100 py-6 px-4 flex flex-col gap-4 animate-in slide-in-from-top-4">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => { onViewChange(link.id as View); setIsOpen(false); }}
              className={`text-left text-lg font-bold p-3 rounded-lg ${
                currentView === link.id ? 'bg-red-50 text-red-600' : 'text-slate-700'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button 
            onClick={() => { handleReport(); setIsOpen(false); }}
            className="text-left text-lg font-bold p-3 rounded-lg text-orange-600 bg-orange-50"
          >
            Report Issue
          </button>
          <button 
            onClick={() => { onViewChange('login'); setIsOpen(false); }}
            className="text-left text-lg font-bold p-3 rounded-lg text-slate-700 border border-slate-200"
          >
            Admin Login
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
