-- Run this in your Supabase SQL Editor

create table if not exists digest_configs (
  user_id uuid primary key references auth.users(id) on delete cascade,
  links jsonb default '[]',
  schedule text default 'weekly',
  delivery_time text default '08:00',
  delivery_methods jsonb default '["app"]',
  email_address text default '',
  whatsapp_number text default '',
  summary_style text default 'bullets',
  auto_update boolean default true,
  updated_at timestamptz default now()
);

-- Enable Row Level Security (each user can only see their own data)
alter table digest_configs enable row level security;

create policy "Users can manage their own config"
  on digest_configs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
