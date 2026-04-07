
-- Create Donors Table
CREATE TABLE donors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "fullName" TEXT NOT NULL,
  "bloodGroup" TEXT NOT NULL,
  location TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  "lastDonationDate" DATE,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Create Blood Requests Table
CREATE TABLE blood_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "patientName" TEXT NOT NULL,
  "bloodGroup" TEXT NOT NULL,
  location TEXT NOT NULL,
  hospital TEXT NOT NULL,
  units INTEGER DEFAULT 1,
  urgency TEXT DEFAULT 'urgent',
  status TEXT DEFAULT 'pending',
  "contactPhone" TEXT,
  "requestedDate" TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;

-- Create Policies (Example: Allow anyone to read, but only authenticated to write)
-- Note: For a real app, you'd want more restrictive policies.
CREATE POLICY "Allow public read access for donors" ON donors FOR SELECT USING (true);
CREATE POLICY "Allow public read access for requests" ON blood_requests FOR SELECT USING (true);

CREATE POLICY "Allow public insert for donors" ON donors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert for requests" ON blood_requests FOR INSERT WITH CHECK (true);
