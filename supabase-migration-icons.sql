-- Migração: atualizar ícones e cores das categorias padrão para SVG temático
-- Execute no SQL Editor do Supabase

UPDATE public.categories SET
  emoji = 'groceries', color = '#2E7D32', bg = 'rgba(46,125,50,.15)'
WHERE id = 'mercado' AND is_default = true;

UPDATE public.categories SET
  emoji = 'fuel', color = '#0277BD', bg = 'rgba(2,119,189,.15)'
WHERE id = 'gasolina' AND is_default = true;

UPDATE public.categories SET
  emoji = 'food', color = '#E65100', bg = 'rgba(230,81,0,.15)'
WHERE id = 'alimentacao' AND is_default = true;

UPDATE public.categories SET
  emoji = 'shopping', color = '#6A1B9A', bg = 'rgba(106,27,154,.15)'
WHERE id = 'compras' AND is_default = true;

UPDATE public.categories SET
  emoji = 'entertainment', color = '#C62828', bg = 'rgba(198,40,40,.15)'
WHERE id = 'lazer' AND is_default = true;
