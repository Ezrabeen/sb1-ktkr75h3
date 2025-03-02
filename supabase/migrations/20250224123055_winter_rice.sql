/*
  # Create transactions table for ReVive platform

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_address` (text, user's wallet address)
      - `product_id` (text, external product ID)
      - `product_details` (jsonb, complete product information)
      - `purchase_amount` (numeric, purchase amount in USD)
      - `reward_amount` (numeric, B3TR tokens awarded)
      - `tx_hash` (text, blockchain transaction hash)
      - `platform` (text, source platform e.g., 'ebay')
      - `status` (text, transaction status)
      - `created_at` (timestamptz, timestamp of transaction)

  2. Security
    - Enable RLS on `transactions` table
    - Add policy for authenticated users to read their own transactions
    - Add policy for authenticated users to insert their own transactions
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_address text NOT NULL,
  product_id text NOT NULL,
  product_details jsonb NOT NULL,
  purchase_amount numeric NOT NULL,
  reward_amount numeric NOT NULL,
  tx_hash text NOT NULL,
  platform text NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'wallet_address' = user_address);

CREATE POLICY "Users can insert own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'wallet_address' = user_address);