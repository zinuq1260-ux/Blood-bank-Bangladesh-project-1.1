
import React from 'react';
import { Droplets, Users, Heart, Hospital, Activity, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { BloodGroup } from './types';

export const BLOOD_GROUPS: { type: BloodGroup; count: number }[] = [
  { type: 'A+', count: 12543 },
  { type: 'A-', count: 1287 },
  { type: 'B+', count: 15321 },
  { type: 'B-', count: 982 },
  { type: 'O+', count: 18765 },
  { type: 'O-', count: 856 },
  { type: 'AB+', count: 3421 },
  { type: 'AB-', count: 423 },
];

export const STATS = [
  { icon: <Users size={24} />, label: 'Active Donors', value: '50K+' },
  { icon: <Heart size={24} />, label: 'Lives Saved', value: '25K+' },
  { icon: <MapPin size={24} />, label: 'Districts', value: '64' },
];

export const DASHBOARD_STATS = [
  { icon: <Users />, label: 'Total Donors', value: '50,234', change: '+12.5%', color: 'text-red-600', bg: 'bg-red-50' },
  { icon: <Clock />, label: 'Pending Requests', value: '24', change: '-3 from yesterday', color: 'text-orange-600', bg: 'bg-orange-50' },
  { icon: <ShieldCheck />, label: 'Successful Donations', value: '25,123', change: '+8.3%', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: <Hospital />, label: 'Partner Hospitals', value: '152', change: '+5 new', color: 'text-blue-600', bg: 'bg-blue-50' },
];

export const BANGLADESH_DISTRICTS = [
  'Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh',
  'Gazipur', 'Narayanganj', 'Cumilla', 'Bogura', 'Cox\'s Bazar', 'Feni', 'Noakhali', 'Brahmanbaria',
  'Tangail', 'Narsingdi', 'Manikganj', 'Munshiganj', 'Faridpur', 'Gopalganj', 'Madaripur', 'Shariatpur',
  'Kishoreganj', 'Netrokona', 'Sherpur', 'Jamalpur', 'Chandpur', 'Lakshmipur', 'Rangamati', 'Khagrachhari',
  'Bandarban', 'Bagerhat', 'Chuadanga', 'Jashore', 'Jhenaidah', 'Magura', 'Meherpur', 'Narail', 'Satkhira',
  'Kushtia', 'Joypurhat', 'Naogaon', 'Natore', 'Pabna', 'Sirajganj', 'Chapai Nawabganj', 'Dinajpur',
  'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Thakurgaon', 'Habiganj', 'Moulvibazar',
  'Sunamganj', 'Barguna', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur'
].sort();
