
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, ClipboardList, Package, 
  Settings, LogOut, Search, Bell, Menu, X, ArrowUpRight,
  TrendingUp, Activity, Clock, ShieldCheck, Hospital
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Donor, BloodRequest } from '../types';

const CHART_DATA = [
  { name: 'Jan', donations: 400, requests: 240 },
  { name: 'Feb', donations: 300, requests: 139 },
  { name: 'Mar', donations: 200, requests: 980 },
  { name: 'Apr', donations: 278, requests: 390 },
  { name: 'May', donations: 189, requests: 480 },
  { name: 'Jun', donations: 239, requests: 380 },
];

interface DashboardViewProps {
  onLogout: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [stats, setStats] = useState({ totalDonors: 0, pendingRequests: 0, successfulDonations: 0, distribution: [] as any[] });

  useEffect(() => {
    const loadData = () => {
      setDonors(dataService.getDonors());
      setRequests(dataService.getRequests());
      setStats(dataService.getStats() as any);
    };
    loadData();
    // Poll for updates in this mock version
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'donors', label: 'Donors', icon: <Users size={20} /> },
    { id: 'requests', label: 'Blood Requests', icon: <ClipboardList size={20} /> },
    { id: 'inventory', label: 'Blood Inventory', icon: <Package size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const statCards = [
    { icon: <Users />, label: 'Total Donors', value: stats.totalDonors, color: 'text-red-600', bg: 'bg-red-50' },
    { icon: <Clock />, label: 'Pending Requests', value: stats.pendingRequests, color: 'text-orange-600', bg: 'bg-orange-50' },
    { icon: <ShieldCheck />, label: 'Total Success', value: stats.successfulDonations, color: 'text-green-600', bg: 'bg-green-50' },
    { icon: <Hospital />, label: 'Hospitals', value: '152', color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className={`bg-white border-r border-slate-100 flex flex-col transition-all duration-300 z-50 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shrink-0">
             <Activity className="text-white" size={18} />
          </div>
          {isSidebarOpen && <span className="font-black text-slate-900 tracking-tight">Admin<span className="text-red-600">Panel</span></span>}
        </div>

        <nav className="flex-grow px-3 py-6 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                activeTab === item.id 
                  ? 'bg-red-50 text-red-600' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
           <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all font-bold text-sm">
             <LogOut size={20} className="shrink-0" />
             {isSidebarOpen && <span>Logout</span>}
           </button>
        </div>
      </aside>

      <main className="flex-grow flex flex-col h-screen overflow-y-auto">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 h-20 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-500">
               {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
             </button>
             <h2 className="text-xl font-black text-slate-900 capitalize">{activeTab}</h2>
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900">Admin User</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Super Admin</p>
             </div>
             <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-400 rounded-xl flex items-center justify-center text-white font-bold">A</div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start mb-4">
                       <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>{stat.icon}</div>
                       <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-green-50 text-green-600 rounded-full">
                          <TrendingUp size={10} /> +5%
                       </div>
                    </div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                    <h3 className="text-xl font-black mb-10">Real-time Performance</h3>
                    <div className="h-80 w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={CHART_DATA}>
                             <defs>
                                <linearGradient id="colorDon" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                             <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                             <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                             <Tooltip />
                             <Area type="monotone" dataKey="donations" stroke="#ef4444" strokeWidth={4} fill="url(#colorDon)" />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                    <h3 className="text-xl font-black mb-10">Live Distribution</h3>
                    <div className="space-y-6">
                       {stats.distribution.map((item, idx) => (
                         <div key={idx}>
                            <div className="flex justify-between items-center mb-2">
                               <span className="text-sm font-bold text-slate-700">{item.group}</span>
                               <span className="text-xs font-bold text-slate-400">{item.percent}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                               <div className="h-full bg-red-600 rounded-full" style={{width: `${item.percent}%`}} />
                            </div>
                         </div>
                       ))}
                       {stats.distribution.length === 0 && <p className="text-sm text-slate-400 italic">Register donors to see distribution...</p>}
                    </div>
                 </div>
              </div>

              <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                 <div className="p-8 flex justify-between items-center border-b border-slate-50">
                    <h3 className="text-xl font-black">Recent Donor Registrations</h3>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full">
                       <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                          <tr>
                             <th className="px-8 py-4 text-left">Donor ID</th>
                             <th className="px-8 py-4 text-left">Name</th>
                             <th className="px-8 py-4 text-left">Blood Group</th>
                             <th className="px-8 py-4 text-left">Location</th>
                             <th className="px-8 py-4 text-left">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {donors.map((donor, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-all">
                               <td className="px-8 py-6 text-sm font-bold text-slate-400">{donor.id}</td>
                               <td className="px-8 py-6 font-bold text-slate-900">{donor.fullName}</td>
                               <td className="px-8 py-6">
                                  <span className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-lg font-black text-xs">{donor.bloodGroup}</span>
                               </td>
                               <td className="px-8 py-6 text-sm text-slate-500">{donor.location}</td>
                               <td className="px-8 py-6 uppercase text-[10px] font-black text-green-600 tracking-widest">{donor.status}</td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
            </>
          )}

          {activeTab === 'requests' && (
             <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50">
                   <h3 className="text-xl font-black">Active Blood Requests</h3>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full">
                      <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                         <tr>
                            <th className="px-8 py-4 text-left">ID</th>
                            <th className="px-8 py-4 text-left">Patient</th>
                            <th className="px-8 py-4 text-left">Group</th>
                            <th className="px-8 py-4 text-left">Hospital</th>
                            <th className="px-8 py-4 text-left">Urgency</th>
                            <th className="px-8 py-4 text-left">Status</th>
                         </tr>
                      </thead>
                      <tbody>
                         {requests.map((req, idx) => (
                           <tr key={idx} className="hover:bg-slate-50 border-b border-slate-50">
                              <td className="px-8 py-6 text-xs text-slate-400">{req.id}</td>
                              <td className="px-8 py-6 font-bold">{req.patientName}</td>
                              <td className="px-8 py-6 font-black text-red-600">{req.bloodGroup}</td>
                              <td className="px-8 py-6 text-sm text-slate-500">{req.hospital}</td>
                              <td className="px-8 py-6">
                                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                   req.urgency === 'emergency' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                                 }`}>
                                    {req.urgency}
                                 </span>
                              </td>
                              <td className="px-8 py-6 text-[10px] font-black uppercase text-slate-400">{req.status}</td>
                           </tr>
                         ))}
                         {requests.length === 0 && (
                           <tr>
                              <td colSpan={6} className="px-8 py-12 text-center text-slate-400 italic">No active blood requests found.</td>
                           </tr>
                         )}
                      </tbody>
                   </table>
                </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardView;
