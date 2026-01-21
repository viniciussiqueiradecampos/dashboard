-- ============================================
-- ⚙️ CONFIGURAÇÕES DO USUÁRIO (SETTINGS)
-- ============================================

-- 1. Cria a tabela user_settings
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  currency TEXT DEFAULT 'BRL',
  language TEXT DEFAULT 'pt-BR',
  enabled_menus TEXT[] DEFAULT ARRAY['dashboard', 'transactions', 'goals', 'cards', 'profile', 'settings'],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilita RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Segurança (RLS)
-- Usuários podem ver suas próprias configurações
DROP POLICY IF EXISTS "Users can view their own settings" ON user_settings;
CREATE POLICY "Users can view their own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

-- Usuários podem atualizar suas próprias configurações
DROP POLICY IF EXISTS "Users can update their own settings" ON user_settings;
CREATE POLICY "Users can update their own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Usuários podem inserir suas próprias configurações
DROP POLICY IF EXISTS "Users can insert their own settings" ON user_settings;
CREATE POLICY "Users can insert their own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Funções e Triggers
-- Função para criar settings padrão ao registrar novo usuário
CREATE OR REPLACE FUNCTION public.handle_new_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger disparado após criação de usuário na auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_settings ON auth.users;
CREATE TRIGGER on_auth_user_created_settings
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_settings();

-- Opcional: Inserir configurações para usuários existentes que ainda não têm
INSERT INTO public.user_settings (user_id)
SELECT id FROM public.users
WHERE id NOT IN (SELECT user_id FROM public.user_settings);
