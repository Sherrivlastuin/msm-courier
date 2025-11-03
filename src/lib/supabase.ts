import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Shipment = {
  id: string;
  tracking_id: string;
  status: 'Processing' | 'In Transit' | 'Pending' | 'Custom clearance' | 'On hold' | 'Missing' | 'Delivered';
  shipping_speed: 'Local' | 'Standard' | 'Express' | 'International' | 'Offshore';
  sender_name: string;
  sender_email: string;
  sender_phone: string;
  sender_address: string;
  sender_city: string;
  sender_country: string;
  recipient_name: string;
  recipient_email: string;
  recipient_phone: string;
  recipient_address: string;
  recipient_city: string;
  recipient_country: string;
  package_description: string;
  package_weight: number;
  package_quantity: number;
  notes: string;
  created_at: string;
  updated_at: string;
  estimated_delivery: string | null;
};
