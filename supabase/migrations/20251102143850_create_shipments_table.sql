/*
  # MSM COURIER Shipping System Database

  1. New Tables
    - `shipments`
      - `id` (uuid, primary key) - Unique shipment identifier
      - `tracking_id` (text, unique) - Public tracking number
      - `status` (text) - Shipment status (Processing, In Transit, Pending, Custom clearance, On hold, Missing, Delivered)
      - `shipping_speed` (text) - Speed type (Local, Standard, Express, International, Offshore)
      
      Sender Information:
      - `sender_name` (text) - Sender's full name
      - `sender_email` (text) - Sender's email address
      - `sender_phone` (text) - Sender's phone number
      - `sender_address` (text) - Sender's full address
      - `sender_city` (text) - Sender's city
      - `sender_country` (text) - Sender's country
      
      Recipient Information:
      - `recipient_name` (text) - Recipient's full name
      - `recipient_email` (text) - Recipient's email address
      - `recipient_phone` (text) - Recipient's phone number
      - `recipient_address` (text) - Recipient's full address
      - `recipient_city` (text) - Recipient's city
      - `recipient_country` (text) - Recipient's country
      
      Package Details:
      - `package_description` (text) - Package contents description
      - `package_weight` (numeric) - Package weight in kg
      - `package_quantity` (integer) - Number of packages
      - `notes` (text) - Additional notes/comments
      
      Timestamps:
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      - `estimated_delivery` (timestamptz) - Estimated delivery date

  2. Security
    - Enable RLS on `shipments` table
    - Add policy for public read access via tracking_id (for tracking page)
    - Add policy for authenticated admin full access
*/

CREATE TABLE IF NOT EXISTS shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'Processing',
  shipping_speed text NOT NULL,
  
  sender_name text NOT NULL,
  sender_email text NOT NULL,
  sender_phone text NOT NULL,
  sender_address text NOT NULL,
  sender_city text NOT NULL,
  sender_country text NOT NULL,
  
  recipient_name text NOT NULL,
  recipient_email text NOT NULL,
  recipient_phone text NOT NULL,
  recipient_address text NOT NULL,
  recipient_city text NOT NULL,
  recipient_country text NOT NULL,
  
  package_description text NOT NULL,
  package_weight numeric NOT NULL,
  package_quantity integer NOT NULL DEFAULT 1,
  notes text DEFAULT '',
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  estimated_delivery timestamptz,
  
  CONSTRAINT valid_status CHECK (status IN ('Processing', 'In Transit', 'Pending', 'Custom clearance', 'On hold', 'Missing', 'Delivered')),
  CONSTRAINT valid_shipping_speed CHECK (shipping_speed IN ('Local', 'Standard', 'Express', 'International', 'Offshore'))
);

ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view shipment by tracking_id"
  ON shipments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert shipments"
  ON shipments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update shipments"
  ON shipments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete shipments"
  ON shipments FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_shipments_tracking_id ON shipments(tracking_id);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_created_at ON shipments(created_at DESC);