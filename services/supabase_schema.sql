-- Drop existing tables if they exist (BE CAREFUL: This deletes all existing data in these tables)
DROP TABLE IF EXISTS visitors;
DROP TABLE IF EXISTS emergency_info;
DROP TABLE IF EXISTS blood_requests;
DROP TABLE IF EXISTS donors;

-- Create Visitors Table1
CREATE TABLE visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "visitedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Donors Table2
CREATE TABLE donors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "fullName" TEXT NOT NULL,
  "bloodGroup" TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  "lastDonationDate" TEXT,
  status TEXT DEFAULT 'active',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Blood Requests Table3
CREATE TABLE blood_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "patientName" TEXT NOT NULL,
  "bloodGroup" TEXT NOT NULL,
  units INTEGER NOT NULL,
  hospital TEXT NOT NULL,
  urgency TEXT NOT NULL,
  "contactPhone" TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  "requestedDate" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Emergency Info Table4
CREATE TABLE emergency_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_info ENABLE ROW LEVEL SECURITY;

-- Create Policies for Visitors (Allow everyone to read and insert)
CREATE POLICY "Enable read access for all users" ON visitors FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON visitors FOR INSERT WITH CHECK (true);

-- Create Policies for Donors (Allow everyone to read and insert)
CREATE POLICY "Enable read access for all users" ON donors FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON donors FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON donors FOR UPDATE USING (true);

-- Create Policies for Blood Requests (Allow everyone to read and insert)
CREATE POLICY "Enable read access for all users" ON blood_requests FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON blood_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON blood_requests FOR UPDATE USING (true);

-- Create Policies for Emergency Info (Allow everyone to read and insert)
CREATE POLICY "Enable read access for all users" ON emergency_info FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON emergency_info FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON emergency_info FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON emergency_info FOR DELETE USING (true);
