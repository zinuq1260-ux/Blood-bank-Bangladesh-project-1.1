
import React from 'react';
import { Droplets, Facebook, Twitter, Instagram, Linkedin, Phone } from 'lucide-react';
import { View } from '../types';

interface FooterProps {
  onViewChange: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ onViewChange }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-12 mb-8">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-red-600 rounded-tr-xl rounded-bl-xl rotate-45 flex items-center justify-center">
              <Droplets className="text-white -rotate-45" size={18} />
            </div>
            <h2 className="text-xl font-black text-white">BloodBank<span className="text-red-500">BD</span></h2>
          </div>
          <p className="text-sm leading-relaxed mb-6">
            Bangladesh's premier digital blood donation network connecting thousands of donors with people in need 24/7.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-red-500 transition-colors"><Facebook size={20} /></a>
            <a href="#" className="hover:text-red-500 transition-colors"><Twitter size={20} /></a>
            <a href="#" className="hover:text-red-500 transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-red-500 transition-colors"><Linkedin size={20} /></a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Quick Links</h3>
          <ul className="flex flex-col gap-4 text-sm">
            <li><button onClick={() => onViewChange('home')} className="hover:text-red-500">Home</button></li>
            <li><button onClick={() => onViewChange('search')} className="hover:text-red-500">Find Donors</button></li>
            <li><button onClick={() => onViewChange('register')} className="hover:text-red-500">Become a Donor</button></li>
            <li><button onClick={() => onViewChange('request')} className="hover:text-red-500">Request Blood</button></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Support</h3>
          <ul className="flex flex-col gap-4 text-sm">
            <li><a href="#" className="hover:text-red-500">FAQ</a></li>
            <li><a href="#" className="hover:text-red-500">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-red-500">Terms of Service</a></li>
            <li><a href="#" className="hover:text-red-500">Contact Support</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Contact Us</h3>
          <ul className="flex flex-col gap-4 text-sm">
            <li>Uttara-7, Dhaka, Bangladesh</li>
            <li>
              <a href="tel:01980484770" className="text-red-400 font-bold hover:text-red-300 transition-colors">
                <Phone size={18} />
              </a>
            </li>
            <li>Email: teamspydonorline@gmail.com</li>
            <li>
              <button onClick={() => window.dispatchEvent(new CustomEvent('open-emergency-modal'))} className="text-red-500 font-bold hover:text-red-400 transition-colors underline">
                Emergency Information
              </button>
            </li>
            <li className="pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-500 block mb-1">Developers:</span>
              Golam Rabbi Ahosan Zinuq (01402552295)<br />
              Mirajul islam Mehedi (01980-484770)
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
        <p>© 2026 BloodBankBD. All rights reserved.</p>
        <p className="mt-4 md:mt-0 font-medium">Developed by <span className="text-slate-300">(Team Spy)</span></p>
      </div>
    </footer>
  );
};

export default Footer;
