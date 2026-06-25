-- ====================================================================
-- SUPABASE SCHEMA UPDATE: MULTI-ROLE AUTH & ORDER TRACKING FOR RAVISH
-- Run these commands in your Supabase SQL Editor (Step-by-step)
-- ====================================================================

-- 1. Add role column to profiles table
-- Roles: 'buyer' (default), 'vendor', 'logistics'
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'buyer' 
CHECK (role IN ('buyer', 'vendor', 'logistics'));

-- 2. Update the profile trigger function to capture role from sign-up user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer'),
    COALESCE(NEW.raw_user_meta_data->>'display_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create the menu_items table for vendors to list their foods
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  image TEXT,
  category TEXT NOT NULL,
  description TEXT,
  vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on menu_items
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid duplication
DROP POLICY IF EXISTS "Anyone can view menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Vendors can insert own menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Vendors can update own menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Vendors can delete own menu items" ON public.menu_items;

-- Add RLS policies for menu_items
CREATE POLICY "Anyone can view menu items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Vendors can insert own menu items" ON public.menu_items FOR INSERT WITH CHECK (auth.uid() = vendor_id);
CREATE POLICY "Vendors can update own menu items" ON public.menu_items FOR UPDATE USING (auth.uid() = vendor_id);
CREATE POLICY "Vendors can delete own menu items" ON public.menu_items FOR DELETE USING (auth.uid() = vendor_id);

-- 4. Update the orders table to support vendor_id, dispatcher_id, and new statuses
-- Add columns to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES auth.users(id);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS dispatcher_id UUID REFERENCES auth.users(id);

-- Update status constraint on orders to support:
-- 'Pending' (placed by buyer)
-- 'Preparing' (accepted by vendor, packaging)
-- 'Ready for Delivery' (marked packaged by vendor)
-- 'Out for Delivery' (claimed by logistics driver)
-- 'Completed' (delivered to buyer)
-- 'Cancelled' (cancelled by buyer/vendor)
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('Pending', 'Preparing', 'Ready for Delivery', 'Out for Delivery', 'Completed', 'Cancelled'));

-- 5. Add vendor_id and text/UUID menu_item_id support to order_items
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES auth.users(id);
-- Change order_items.menu_item_id column to type TEXT to support both UUIDs (vendors) and INTs (fallback)
ALTER TABLE public.order_items ALTER COLUMN menu_item_id TYPE TEXT;

-- 6. Update Row Level Security (RLS) policies on orders
-- Drop old policies to replace them
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can place orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;

-- Policy: Buyers can view their own orders; Vendors can view orders for their shop; 
-- Logistics can view ready/active deliveries.
CREATE POLICY "Select orders based on role" ON public.orders FOR SELECT
USING (
  auth.uid() = user_id OR 
  auth.uid() = vendor_id OR 
  status = 'Ready for Delivery' OR 
  auth.uid() = dispatcher_id
);

-- Policy: Buyers can insert orders
CREATE POLICY "Buyers can place orders" ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Buyers, vendors, or dispatchers can update orders (e.g. status tracking)
CREATE POLICY "Users can update orders" ON public.orders FOR UPDATE
USING (
  auth.uid() = user_id OR 
  auth.uid() = vendor_id OR 
  auth.uid() = dispatcher_id OR
  (status = 'Ready for Delivery' AND dispatcher_id IS NULL) -- Allow logistics to claim
);

-- 7. Update Row Level Security (RLS) policies on order_items
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert own order items" ON public.order_items;

CREATE POLICY "Select order items based on role" ON public.order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id AND (
      orders.user_id = auth.uid() OR 
      orders.vendor_id = auth.uid() OR 
      orders.dispatcher_id = auth.uid() OR 
      orders.status = 'Ready for Delivery'
    )
  )
);

CREATE POLICY "Insert order items" ON public.order_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  )
);

-- ====================================================================
-- 8. Real-time Location Tracking Columns for Logistics Dispatchers
-- ====================================================================
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS dispatcher_lat NUMERIC;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS dispatcher_lng NUMERIC;

