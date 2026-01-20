-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create family_members table
create table if not exists family_members (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  role text not null check (role in ('admin', 'member')),
  avatar_url text,
  income numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create bank_accounts table
create table if not exists bank_accounts (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  bank_name text not null,
  balance numeric default 0,
  color text default '#000000',
  type text not null check (type in ('checking', 'investment', 'cash', 'other')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create credit_cards table
create table if not exists credit_cards (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  brand text not null,
  "limit" numeric default 0,
  current_invoice numeric default 0,
  closing_day integer not null,
  due_day integer not null,
  last_4_digits text,
  theme text default 'black',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create goals table
create table if not exists goals (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  target_amount numeric not null,
  current_amount numeric default 0,
  deadline date,
  icon text,
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create transactions table
create table if not exists transactions (
  id uuid default uuid_generate_v4() primary key,
  description text not null,
  amount numeric not null,
  date date not null,
  category text not null,
  type text not null check (type in ('income', 'expense')),
  status text not null check (status in ('pending', 'completed')),
  account_id uuid references bank_accounts(id) on delete set null,
  card_id uuid references credit_cards(id) on delete set null,
  member_id uuid references family_members(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
