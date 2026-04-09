-- Tabella signups per Tellio
-- Esegui questo SQL nella Supabase SQL Editor

create table if not exists public.signups (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  cognome text not null,
  numero_albo text not null,
  foro text not null,
  email text not null,
  telefono text not null,
  area_competenza text not null check (area_competenza in ('penale', 'civile', 'entrambe')),
  interesse text not null check (interesse in ('cerco_sostituto', 'cerco_collaborazioni', 'entrambi')),
  stato_verifica text not null default 'pending' check (stato_verifica in ('pending', 'verified', 'rejected')),
  created_at timestamptz default now() not null
);

-- Indici per evitare duplicati
create unique index if not exists signups_email_idx on public.signups (email);

-- RLS: abilita Row Level Security
alter table public.signups enable row level security;

-- Policy: chiunque (anon) può inserire, nessuno può leggere/aggiornare/cancellare via client
create policy "Allow anonymous inserts" on public.signups
  for insert
  to anon
  with check (true);

-- Nessuna policy per select/update/delete = nessun accesso client
-- Gestisci lettura e aggiornamento solo lato server/dashboard Supabase
