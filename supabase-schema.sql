-- Contaí — Schema do Banco de Dados

-- Habilitar UUID
create extension if not exists "uuid-ossp";

-- Settings por usuário
create table if not exists settings (
  user_id uuid references auth.users(id) on delete cascade primary key,
  monthly_limit numeric(10,2) not null default 5000,
  cycle_mode text not null default 'standard' check (cycle_mode in ('standard', 'invoice')),
  invoice_day integer default 1 check (invoice_day between 1 and 28),
  sheets_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Categorias (padrão + personalizadas por usuário)
create table if not exists categories (
  id text not null,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  emoji text not null,
  color text not null,
  bg text not null,
  is_default boolean not null default false,
  display_order integer not null default 0,
  primary key (id, user_id)
);

-- Gastos
create table if not exists expenses (
  id bigint primary key default extract(epoch from now()) * 1000,
  user_id uuid references auth.users(id) on delete cascade not null,
  category_id text not null,
  amount numeric(10,2) not null,
  description text,
  date date not null,
  pay_method text not null default 'credit' check (pay_method in ('credit', 'pix')),
  created_at timestamptz default now()
);

-- Limites por categoria
create table if not exists category_limits (
  user_id uuid references auth.users(id) on delete cascade,
  category_id text not null,
  limit_amount numeric(10,2) not null,
  primary key (user_id, category_id)
);

-- RLS (Row Level Security)
alter table settings enable row level security;
alter table categories enable row level security;
alter table expenses enable row level security;
alter table category_limits enable row level security;

create policy "users see own settings" on settings for all using (auth.uid() = user_id);
create policy "users see own categories" on categories for all using (auth.uid() = user_id);
create policy "users see own expenses" on expenses for all using (auth.uid() = user_id);
create policy "users see own limits" on category_limits for all using (auth.uid() = user_id);

-- Inserir categorias padrão ao criar usuário
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.settings (user_id) values (new.id);

  insert into public.categories (id, user_id, name, emoji, color, bg, is_default, display_order) values
    ('mercado',     new.id, 'Mercado',     'groceries',      '#2E7D32', 'rgba(46,125,50,.15)',   true, 1),
    ('gasolina',    new.id, 'Gasolina',    'fuel',           '#0277BD', 'rgba(2,119,189,.15)',   true, 2),
    ('alimentacao', new.id, 'Alimentação', 'food',           '#E65100', 'rgba(230,81,0,.15)',    true, 3),
    ('compras',     new.id, 'Compras',     'shopping',       '#6A1B9A', 'rgba(106,27,154,.15)',  true, 4),
    ('lazer',       new.id, 'Lazer',       'entertainment',  '#C62828', 'rgba(198,40,40,.15)',   true, 5);

  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
