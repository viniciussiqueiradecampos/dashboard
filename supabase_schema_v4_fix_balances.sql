-- ============================================
-- 🔄 CORREÇÃO TRIGGER: SALDO APENAS COM TRANSAÇÕES CONCLUÍDAS
-- ============================================

CREATE OR REPLACE FUNCTION public.update_balances()
RETURNS TRIGGER AS $$
BEGIN
  -- ==========================================
  -- 1. INSERT
  -- ==========================================
  IF (TG_OP = 'INSERT') THEN
    -- Só atualiza saldo se status for COMPLETED
    IF NEW.status = 'COMPLETED' THEN
      -- Conta Bancária (Balance)
      IF NEW.account_id IS NOT NULL THEN
        IF NEW.type = 'INCOME' THEN
          UPDATE public.accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
        ELSIF NEW.type = 'EXPENSE' THEN
          UPDATE public.accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
        END IF;
      END IF;

      -- Cartão de Crédito (Current Bill)
      IF NEW.card_id IS NOT NULL THEN
        IF NEW.type = 'EXPENSE' THEN
          UPDATE public.accounts SET current_bill = current_bill + NEW.amount WHERE id = NEW.card_id;
        ELSIF NEW.type = 'INCOME' THEN
          UPDATE public.accounts SET current_bill = current_bill - NEW.amount WHERE id = NEW.card_id;
        END IF;
      END IF;
    END IF;

  -- ==========================================
  -- 2. DELETE
  -- ==========================================
  ELSIF (TG_OP = 'DELETE') THEN
    -- Só reverte saldo se a transação deletada estava COMPLETED
    IF OLD.status = 'COMPLETED' THEN
      -- Conta Bancária
      IF OLD.account_id IS NOT NULL THEN
        IF OLD.type = 'INCOME' THEN
          UPDATE public.accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id;
        ELSIF OLD.type = 'EXPENSE' THEN
          UPDATE public.accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
        END IF;
      END IF;

      -- Cartão de Crédito
      IF OLD.card_id IS NOT NULL THEN
        IF OLD.type = 'EXPENSE' THEN
          UPDATE public.accounts SET current_bill = current_bill - OLD.amount WHERE id = OLD.card_id;
        ELSIF OLD.type = 'INCOME' THEN
          UPDATE public.accounts SET current_bill = current_bill + OLD.amount WHERE id = OLD.card_id;
        END IF;
      END IF;
    END IF;

  -- ==========================================
  -- 3. UPDATE
  -- ==========================================
  ELSIF (TG_OP = 'UPDATE') THEN
    -- A) Reverte OLD se ele estava COMPLETED
    IF OLD.status = 'COMPLETED' THEN
      -- Conta Bancária
      IF OLD.account_id IS NOT NULL THEN
        IF OLD.type = 'INCOME' THEN
          UPDATE public.accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id;
        ELSIF OLD.type = 'EXPENSE' THEN
          UPDATE public.accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
        END IF;
      END IF;

      -- Cartão de Crédito
      IF OLD.card_id IS NOT NULL THEN
        IF OLD.type = 'EXPENSE' THEN
          UPDATE public.accounts SET current_bill = current_bill - OLD.amount WHERE id = OLD.card_id;
        ELSIF OLD.type = 'INCOME' THEN
          UPDATE public.accounts SET current_bill = current_bill + OLD.amount WHERE id = OLD.card_id;
        END IF;
      END IF;
    END IF;

    -- B) Aplica NEW se ele agora é COMPLETED
    IF NEW.status = 'COMPLETED' THEN
      -- Conta Bancária
      IF NEW.account_id IS NOT NULL THEN
        IF NEW.type = 'INCOME' THEN
          UPDATE public.accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
        ELSIF NEW.type = 'EXPENSE' THEN
          UPDATE public.accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
        END IF;
      END IF;

      -- Cartão de Crédito
      IF NEW.card_id IS NOT NULL THEN
        IF NEW.type = 'EXPENSE' THEN
          UPDATE public.accounts SET current_bill = current_bill + NEW.amount WHERE id = NEW.card_id;
        ELSIF NEW.type = 'INCOME' THEN
          UPDATE public.accounts SET current_bill = current_bill - NEW.amount WHERE id = NEW.card_id;
        END IF;
      END IF;
    END IF;

  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
