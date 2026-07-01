-- Drop existing tables to recreate them with the proper V2 schemas
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS contracts;

-- Invoices Table V2
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  company TEXT DEFAULT '',
  country TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  project_reference TEXT DEFAULT '',
  purchase_order TEXT DEFAULT '',
  currency TEXT DEFAULT 'USD',
  payment_method TEXT DEFAULT 'Wise',
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  payment_status TEXT DEFAULT 'Pending', -- 'Paid', 'Pending', 'Overdue', 'Cancelled'
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  milestones JSONB NOT NULL DEFAULT '[]'::jsonb,
  payment_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  tax NUMERIC DEFAULT 0,
  amount_paid NUMERIC DEFAULT 0,
  remaining_balance NUMERIC DEFAULT 0,
  total_due NUMERIC DEFAULT 0,
  notes TEXT DEFAULT '',
  signature_url TEXT DEFAULT '',
  stamp_url TEXT DEFAULT '',
  verification_code TEXT NOT NULL UNIQUE,
  file_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Contracts Table V2
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  company TEXT DEFAULT '',
  project TEXT DEFAULT '',
  status TEXT DEFAULT 'Draft', -- 'Draft', 'Sent', 'Signed', 'Expired'
  issue_date DATE NOT NULL,
  scope_of_work TEXT DEFAULT '',
  milestones JSONB NOT NULL DEFAULT '[]'::jsonb,
  deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
  payment_schedule JSONB NOT NULL DEFAULT '[]'::jsonb,
  governing_law TEXT DEFAULT 'United Kingdom',
  notes TEXT DEFAULT '',
  file_url TEXT DEFAULT '',
  signature_url TEXT DEFAULT '',
  stamp_url TEXT DEFAULT '',
  verification_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Allow anonymous select for invoice verification page
CREATE POLICY "Allow public select for verification by code" ON invoices
  FOR SELECT USING (true);

CREATE POLICY "Allow public select for contracts verification" ON contracts
  FOR SELECT USING (true);

-- Allow all admin operations (using service role key on serverside API routes)
-- Supabase automatically allows full access with service_role bypass.

-- Create storage bucket if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;
