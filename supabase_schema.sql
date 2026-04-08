-- Drop existing tables if they exist (BE CAREFUL: This deletes all existing data in these tables)
DROP TABLE IF EXISTS donors;
DROP TABLE IF EXISTS blood_requests;

-- Create Donors Table
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

-- Create Blood Requests Table
CREATE TABLE blood_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "patientName" TEXT NOT NULL,
  "bloodGroup" TEXT NOT NULL,
  units INTEGER NOT NULL,
  hospital TEXT NOT NULL,
  urgency TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  "requestedDate" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;

-- Create Policies for Donors (Allow everyone to read and insert)
CREATE POLICY "Enable read access for all users" ON donors FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON donors FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON donors FOR UPDATE USING (true);

-- Create Policies for Blood Requests (Allow everyone to read and insert)
CREATE POLICY "Enable read access for all users" ON blood_requests FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON blood_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON blood_requests FOR UPDATE USING (true);
