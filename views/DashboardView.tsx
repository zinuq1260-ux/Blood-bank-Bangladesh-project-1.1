
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, ClipboardList, Package, 
  LogOut, Menu, X, Activity, Clock, ShieldCheck, Hospital, Loader2, Database, Wifi, WifiOff, Phone, Trash2, Edit2, Plus
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { Donor, BloodRequest, EmergencyInfo } from '../types';

const DashboardView: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isDbOnline, setIsDbOnline] = useState(false);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [stats, setStats] = useState({ totalDonors: 0, pendingRequests: 0, successfulDonations: 0, totalVisitors: 0 });
  
  // Emergency Contacts State
  const [contacts, setContacts] = useState<EmergencyInfo[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Check if MongoDB Backend is reachable
      const online = await dataService.checkConnection();
      setIsDbOnline(online);

      const [donorList, requestList, emergencyList, dashboardStats] = await Promise.all([
        dataService.getDonors(),
        dataService.getRequests(),
        dataService.getEmergencyContacts(),
        dataService.getStats()
      ]);
      
      setDonors(donorList || []);
      setRequests(requestList || []);
      setContacts(emergencyList || []);
      setStats(dashboardStats || { totalDonors: 0, pendingRequests: 0, successfulDonations: 0, totalVisitors: 0 });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    try {
      if (editingId) {
        await dataService.updateEmergencyContact(editingId, { name, phone });
      } else {
        await dataService.saveEmergencyContact({ name, phone });
      }
      setName('');
      setPhone('');
      setEditingId(null);
      loadData(); // Refresh list
    } catch (error) {
      console.error("Failed to save emergency contact:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dataService.deleteEmergencyContact(id);
      loadData(); // Refresh list
    } catch (error) {
      console.error("Failed to delete emergency contact:", error);
    }
  };

  const handleEdit = (contact: EmergencyInfo) => {
    setName(contact.name);
    setPhone(contact.phone);
    setEditingId(contact.id);
  };

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'donors', label: 'Donors', icon: <Users size={20} /> },
    { id: 'requests', label: 'Blood Requests', icon: <ClipboardList size={20} /> },
    { id: 'emergency', label: 'Emergency Contacts', icon: <Phone size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-slate-900 flex flex-col transition-all duration-300 z-50 fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'} md:relative md:translate-x-0 ${isSidebarOpen ? 'md:w-64' : 'md:w-20'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shrink-0">
             <Activity className="text-white" size={18} />
          </div>
          {isSidebarOpen && <span className="font-black text-white tracking-tight">Admin<span className="text-red-500">Panel</span></span>}
        </div>
        
        <nav className="flex-grow px-3 py-6 space-y-2">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); if (window.innerWidth < 768) setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              {item.icon} {isSidebarOpen && item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
           <div className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 ${isDbOnline ? 'text-green-400' : 'text-orange-400'}`}>
             {isDbOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
             {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-widest">{isDbOnline ? 'Supabase Connected' : 'Local Fallback'}</span>}
           </div>
           <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 font-bold text-sm hover:bg-red-500/10 transition-all">
             <LogOut size={20} /> {isSidebarOpen && "Logout"}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col h-screen overflow-y-auto">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-500">
               {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
             </button>
             <h2 className="text-xl font-black text-slate-900 capitalize">{activeTab}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${isDbOnline ? 'border-green-100 bg-green-50 text-green-600' : 'border-orange-100 bg-orange-50 text-orange-600'}`}>
              <Database size={12} /> {isDbOnline ? 'DB: Supabase Cloud' : 'DB: Local Mock'}
            </div>
            <button 
              disabled={isLoading} onClick={loadData}
              className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'Syncing...' : 'Sync Database'}
            </button>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Visitors', value: stats.totalVisitors || 0, color: 'text-blue-600', icon: <Activity /> },
                  { label: 'Total Donors', value: stats.totalDonors, color: 'text-red-600', icon: <Users /> },
                  { label: 'Pending Requests', value: stats.pendingRequests, color: 'text-orange-600', icon: <Clock /> },
                  { label: 'Success Cases', value: stats.successfulDonations, color: 'text-green-600', icon: <ShieldCheck /> },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                    <div className={`p-4 w-fit rounded-2xl mb-6 bg-slate-50 ${stat.color} group-hover:scale-110 transition-transform`}>{stat.icon}</div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                    <h3 className="text-4xl font-black text-slate-900">{stat.value}</h3>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xl font-black">Recent Activity</h3>
                   <div className="text-xs font-bold text-slate-400">Real-time Stream</div>
                </div>
                <div className="space-y-4">
                   {donors.slice(0, 5).map((d, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-black">{d.bloodGroup}</div>
                           <div>
                              <p className="font-bold text-slate-900">{d.fullName} registered as a donor</p>
                              <p className="text-xs text-slate-400">{d.location}</p>
                           </div>
                        </div>
                        <div className="text-[10px] font-black text-green-500 bg-green-50 px-3 py-1 rounded-full uppercase">Verified</div>
                     </div>
                   ))}
                   {donors.length === 0 && <p className="text-center py-12 text-slate-400 font-medium">No activity data found in database.</p>}
                </div>
              </div>
            </>
          )}

          {activeTab === 'donors' && (
            <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full">
                     <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase">
                        <tr>
                           <th className="px-8 py-5 text-left">ID</th>
                           <th className="px-8 py-5 text-left">Donor Name</th>
                           <th className="px-8 py-5 text-left">Phone</th>
                           <th className="px-8 py-5 text-left">Blood Group</th>
                           <th className="px-8 py-5 text-left">Location</th>
                           <th className="px-8 py-5 text-left">Last Donation</th>
                           <th className="px-8 py-5 text-left">Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {donors.map((donor, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                             <td className="px-8 py-6 text-sm font-bold text-slate-400">{donor.id}</td>
                             <td className="px-8 py-6 font-bold text-slate-900">{donor.fullName}</td>
                             <td className="px-8 py-6 text-sm text-slate-500 font-medium">{donor.phone}</td>
                             <td className="px-8 py-6"><span className="px-4 py-1.5 bg-red-50 text-red-600 rounded-xl font-black text-xs border border-red-100">{donor.bloodGroup}</span></td>
                             <td className="px-8 py-6 text-sm text-slate-500 font-medium">{donor.location}</td>
                             <td className="px-8 py-6 text-sm text-slate-500 font-medium">{donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : 'N/A'}</td>
                             <td className="px-8 py-6">
                                <span className="flex items-center gap-2 text-green-600 text-xs font-bold">
                                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Active
                                </span>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
                  {donors.length === 0 && (
                    <div className="text-center py-24">
                       <Database className="mx-auto text-slate-200 mb-4" size={48} />
                       <p className="text-slate-400 font-bold">The Donor list is empty. Connect to MongoDB to sync data.</p>
                    </div>
                  )}
               </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full">
                     <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase">
                        <tr>
                           <th className="px-8 py-5 text-left">ID</th>
                           <th className="px-8 py-5 text-left">Patient Name</th>
                           <th className="px-8 py-5 text-left">Blood Group</th>
                           <th className="px-8 py-5 text-left">Units</th>
                           <th className="px-8 py-5 text-left">Hospital</th>
                           <th className="px-8 py-5 text-left">Contact Phone</th>
                           <th className="px-8 py-5 text-left">Urgency</th>
                           <th className="px-8 py-5 text-left">Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50">
                        {requests.map((req, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                             <td className="px-8 py-6 text-sm font-bold text-slate-400">{req.id}</td>
                             <td className="px-8 py-6 font-bold text-slate-900">{req.patientName}</td>
                             <td className="px-8 py-6"><span className="px-4 py-1.5 bg-red-50 text-red-600 rounded-xl font-black text-xs border border-red-100">{req.bloodGroup}</span></td>
                             <td className="px-8 py-6 text-sm text-slate-500 font-medium">{req.units}</td>
                             <td className="px-8 py-6 text-sm text-slate-500 font-medium">{req.hospital}</td>
                             <td className="px-8 py-6 text-sm text-slate-500 font-medium">{req.contactPhone}</td>
                             <td className="px-8 py-6 text-sm text-slate-500 font-medium capitalize">{req.urgency}</td>
                             <td className="px-8 py-6">
                                <select 
                                  value={req.status}
                                  onChange={async (e) => {
                                    await dataService.updateRequestStatus(req.id, e.target.value as any);
                                    loadData();
                                  }}
                                  className="px-4 py-1.5 rounded-xl font-black text-xs border bg-slate-50 outline-none cursor-pointer"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="waiting">Waiting</option>
                                  <option value="finding donor">Finding Donor</option>
                                  <option value="processing">Processing</option>
                                  <option value="sorry">Sorry</option>
                                  <option value="donation done">Donation Done</option>
                                </select>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
                  {requests.length === 0 && (
                    <div className="text-center py-24">
                       <ClipboardList className="mx-auto text-slate-200 mb-4" size={48} />
                       <p className="text-slate-400 font-bold">No blood requests found in database.</p>
                    </div>
                  )}
               </div>
            </div>
          )}

          {activeTab === 'emergency' && (
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleAddOrUpdate} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="p-3 rounded-lg border border-slate-200 outline-none focus:border-red-600"
                    required
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    className="p-3 rounded-lg border border-slate-200 outline-none focus:border-red-600"
                    required
                  />
                </div>
                <button type="submit" className="mt-4 w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                  <Plus size={20} /> {editingId ? 'Update Contact' : 'Add Contact'}
                </button>
              </form>

              <div className="space-y-4">
                {contacts.map(contact => (
                  <div key={contact.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{contact.name}</p>
                      <a href={`tel:${contact.phone}`} className="text-red-600 flex items-center gap-1 text-sm font-semibold">
                        <Phone size={14} /> {contact.phone}
                      </a>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(contact)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(contact.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardView;
