-- ============================================
-- SOFT WEST - Database Schema
-- Exécutez ce script dans Supabase SQL Editor
-- ============================================

-- ============ Create Products Table ============
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  emoji VARCHAR(10),
  mood VARCHAR(50),
  badge VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============ Create Indexes ============
CREATE INDEX IF NOT EXISTS idx_products_mood ON products(mood);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- ============ Enable RLS (Row Level Security) ============
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- ============ Create RLS Policies ============

-- Policy 1: Allow public read access
CREATE POLICY "Enable read access for all users"
ON products FOR SELECT
USING (true);

-- Policy 2: Allow authenticated users (admins) to insert
CREATE POLICY "Enable insert for authenticated users"
ON products FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Policy 3: Allow authenticated users (admins) to update
CREATE POLICY "Enable update for authenticated users"
ON products FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Policy 4: Allow authenticated users (admins) to delete
CREATE POLICY "Enable delete for authenticated users"
ON products FOR DELETE
USING (auth.role() = 'authenticated');

-- ============ Insert Sample Data ============
INSERT INTO products (name, category, price, emoji, mood, badge) VALUES
  ('Happy Beam Peluche', 'Peluche', 18.90, '😊', 'happy', NULL),
  ('Happy Beam Porte-clés', 'Porte-clés', 9.90, '😊', 'happy', NULL),
  ('Grumpy Cloud Peluche', 'Peluche', 12.90, '😠', 'grumpy', NULL),
  ('Grumpy Cloud Porte-clés', 'Porte-clés', 9.90, '😠', 'grumpy', NULL),
  ('Overthinker Peluche', 'Peluche', 15.90, '🤔', 'overthink', NULL),
  ('Overthinker Porte-clés', 'Porte-clés', 12.90, '🤔', 'overthink', NULL),
  ('Low Battery Peluche', 'Peluche', 15.90, '😴', 'lowbattery', 'Populaire'),
  ('Low Battery Porte-clés', 'Porte-clés', 9.90, '😴', 'lowbattery', 'Chaud'),
  ('Blind Box Mystery', 'Blind Boxes', 18.90, '🎁', 'all', 'Surprise'),
  ('The Social Battery Collection', 'Books', 24.90, '📚', 'all', 'Limité');

-- ============ Optional: Create Contacts Table ============
-- Décommenter si vous voulez stocker les contacts
/*
CREATE TABLE IF NOT EXISTS contacts (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for all users"
ON contacts FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users"
ON contacts FOR SELECT
USING (auth.role() = 'authenticated');
*/

-- ============ Optional: Create Orders Table ============
-- Décommenter si vous voulez gérer les commandes
/*
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  total_price DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id),
  product_id BIGINT REFERENCES products(id),
  quantity INT,
  price DECIMAL(10, 2)
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id OR auth.role() = 'authenticated');

CREATE POLICY "Users can insert own orders"
ON orders FOR INSERT
WITH CHECK (auth.uid() = user_id);
*/

-- ============ Vérification ============
-- Exécutez ces requêtes pour vérifier :
-- SELECT * FROM products;
-- SELECT * FROM auth.users;
