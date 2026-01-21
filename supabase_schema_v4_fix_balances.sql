-- ============================================
-- 🔄 CORREÇÃO TRIGGER: SALDO E CARTÕES
-- ============================================

CREATE OR REPLACE FUNCTION public.update_balances()
RETURNS TRIGGER AS $$
BEGIN
  -- ==========================================
  -- 1. INSERT
  -- ==========================================
  IF (TG_OP = 'INSERT') THEN
    -- Conta Bancária (Balance) - Apenas se estiver CONCLUÍDA
    IF NEW.account_id IS NOT NULL AND NEW.status = 'COMPLETED' THEN
      IF NEW.type = 'INCOME' THEN
        UPDATE public.accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
      ELSIF NEW.type = 'EXPENSE' THEN
        UPDATE public.accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
      END IF;
    END IF;

    -- Cartão de Crédito (Current Bill) - Sempre atualiza, pois consome limite
    IF NEW.card_id IS NOT NULL THEN
      IF NEW.type = 'EXPENSE' THEN
        UPDATE public.accounts SET current_bill = current_bill + NEW.amount WHERE id = NEW.card_id;
      ELSIF NEW.type = 'INCOME' THEN
        UPDATE public.accounts SET current_bill = current_bill - NEW.amount WHERE id = NEW.card_id;
      END IF;
    END IF;

  -- ==========================================
  -- 2. DELETE
  -- ==========================================
  ELSIF (TG_OP = 'DELETE') THEN
    -- Conta Bancária
    IF OLD.account_id IS NOT NULL AND OLD.status = 'COMPLETED' THEN
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

  -- ==========================================
  -- 3. UPDATE
  -- ==========================================
  ELSIF (TG_OP = 'UPDATE') THEN
    -- A) Reverte OLD
    IF OLD.account_id IS NOT NULL AND OLD.status = 'COMPLETED' THEN
      IF OLD.type = 'INCOME' THEN
        UPDATE public.accounts SET balance = balance - OLD.amount WHERE id = OLD.account_id;
      ELSIF OLD.type = 'EXPENSE' THEN
        UPDATE public.accounts SET balance = balance + OLD.amount WHERE id = OLD.account_id;
      END IF;
    END IF;
    IF OLD.card_id IS NOT NULL THEN
      IF OLD.type = 'EXPENSE' THEN
        UPDATE public.accounts SET current_bill = current_bill - OLD.amount WHERE id = OLD.card_id;
      ELSIF OLD.type = 'INCOME' THEN
        UPDATE public.accounts SET current_bill = current_bill + OLD.amount WHERE id = OLD.card_id;
      END IF;
    END IF;

    -- B) Aplica NEW
    IF NEW.account_id IS NOT NULL AND NEW.status = 'COMPLETED' THEN
      IF NEW.type = 'INCOME' THEN
        UPDATE public.accounts SET balance = balance + NEW.amount WHERE id = NEW.account_id;
      ELSIF NEW.type = 'EXPENSE' THEN
        UPDATE public.accounts SET balance = balance - NEW.amount WHERE id = NEW.account_id;
      END IF;
    END IF;
    IF NEW.card_id IS NOT NULL THEN
      IF NEW.type = 'EXPENSE' THEN
        UPDATE public.accounts SET current_bill = current_bill + NEW.amount WHERE id = NEW.card_id;
      ELSIF NEW.type = 'INCOME' THEN
        UPDATE public.accounts SET current_bill = current_bill - NEW.amount WHERE id = NEW.card_id;
      END IF;
    END IF;

  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_transaction_change ON transactions;
CREATE TRIGGER on_transaction_change
  AFTER INSERT OR UPDATE OR DELETE ON transactions
  FOR EACH ROW EXECUTE PROCEDURE public.update_balances();
