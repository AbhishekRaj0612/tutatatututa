/*
  # Create CivicConnect Database Schema

  1. New Tables
    - `profiles` - User profiles with extended information
    - `issues` - Civic issues reported by users
    - `community_posts` - Community discussion posts
    - `tenders` - Government tenders for contractors
    - `bids` - Contractor bids on tenders
    - `feedback` - User feedback on unresolved issues
    - `municipal_officials` - Contact information for officials

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add admin-specific policies
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  user_type text NOT NULL DEFAULT 'user' CHECK (user_type IN ('user', 'admin', 'tender')),
  full_name text,
  phone text,
  address text,
  avatar_url text,
  points integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create issues table
CREATE TABLE IF NOT EXISTS issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('roads', 'utilities', 'environment', 'safety', 'parks', 'other')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
  location text,
  latitude decimal,
  longitude decimal,
  images text[], -- Array of Cloudinary URLs
  assigned_to text,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create community_posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'discussions' CHECK (category IN ('discussions', 'announcements', 'suggestions', 'events')),
  tags text[],
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  is_official boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tenders table
CREATE TABLE IF NOT EXISTS tenders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  posted_by uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  location text NOT NULL,
  estimated_budget_min decimal,
  estimated_budget_max decimal,
  deadline_date date NOT NULL,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'bidding_closed', 'awarded', 'completed')),
  requirements text[],
  awarded_to uuid REFERENCES profiles(id),
  awarded_amount decimal,
  awarded_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bids table
CREATE TABLE IF NOT EXISTS bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id uuid REFERENCES tenders(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount decimal NOT NULL,
  details text NOT NULL,
  timeline text,
  is_selected boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tender_id, user_id)
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  issue_id uuid REFERENCES issues(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('complaint', 'suggestion', 'compliment', 'inquiry')),
  subject text NOT NULL,
  message text NOT NULL,
  contact_email text,
  contact_phone text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'responded', 'closed')),
  admin_response text,
  responded_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create municipal_officials table
CREATE TABLE IF NOT EXISTS municipal_officials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  department text NOT NULL,
  email text,
  phone text,
  whatsapp_number text,
  office_address text,
  office_hours text,
  responsibilities text[],
  avatar_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipal_officials ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Issues policies
CREATE POLICY "Users can read all issues"
  ON issues
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create issues"
  ON issues
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own issues"
  ON issues
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all issues"
  ON issues
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Community posts policies
CREATE POLICY "Users can read all posts"
  ON community_posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create posts"
  ON community_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON community_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Tenders policies
CREATE POLICY "Users can read all tenders"
  ON tenders
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can create tenders"
  ON tenders
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

CREATE POLICY "Admins can update tenders"
  ON tenders
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Bids policies
CREATE POLICY "Contractors can read all bids"
  ON bids
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND user_type IN ('tender', 'admin')
    )
  );

CREATE POLICY "Contractors can create bids"
  ON bids
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND user_type = 'tender'
    )
  );

-- Feedback policies
CREATE POLICY "Users can read own feedback"
  ON feedback
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create feedback"
  ON feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can read all feedback"
  ON feedback
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

CREATE POLICY "Admins can update feedback"
  ON feedback
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Municipal officials policies
CREATE POLICY "Everyone can read municipal officials"
  ON municipal_officials
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage municipal officials"
  ON municipal_officials
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_issues_user_id ON issues(user_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_category ON issues(category);
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON issues(created_at);

CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at);

CREATE INDEX IF NOT EXISTS idx_tenders_status ON tenders(status);
CREATE INDEX IF NOT EXISTS idx_tenders_category ON tenders(category);
CREATE INDEX IF NOT EXISTS idx_tenders_deadline ON tenders(deadline_date);

CREATE INDEX IF NOT EXISTS idx_bids_tender_id ON bids(tender_id);
CREATE INDEX IF NOT EXISTS idx_bids_user_id ON bids(user_id);

CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);

-- Insert sample municipal officials
INSERT INTO municipal_officials (name, title, department, email, phone, whatsapp_number, office_address, office_hours, responsibilities) VALUES
('John Smith', 'City Manager', 'Administration', 'john.smith@city.gov', '+1-555-0101', '+15550101', '123 City Hall, Main St', 'Mon-Fri 9AM-5PM', ARRAY['City operations', 'Budget management', 'Policy implementation']),
('Sarah Johnson', 'Public Works Director', 'Public Works', 'sarah.johnson@city.gov', '+1-555-0102', '+15550102', '456 Works Dept, Industrial Ave', 'Mon-Fri 8AM-4PM', ARRAY['Road maintenance', 'Water systems', 'Waste management']),
('Mike Chen', 'Parks & Recreation Director', 'Parks & Recreation', 'mike.chen@city.gov', '+1-555-0103', '+15550103', '789 Parks Office, Green St', 'Mon-Fri 9AM-5PM', ARRAY['Park maintenance', 'Recreation programs', 'Community events']),
('Emily Davis', 'Environmental Services Manager', 'Environment', 'emily.davis@city.gov', '+1-555-0104', '+15550104', '321 Environmental Center, Eco Blvd', 'Mon-Fri 8AM-4PM', ARRAY['Environmental protection', 'Sustainability programs', 'Waste reduction']),
('David Wilson', 'Public Safety Coordinator', 'Public Safety', 'david.wilson@city.gov', '+1-555-0105', '+15550105', '654 Safety Office, Security St', '24/7 Emergency', ARRAY['Emergency response', 'Safety programs', 'Community policing']);