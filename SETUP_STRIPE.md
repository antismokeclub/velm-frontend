# Instrukcja: Stripe Subskrypcje — co musisz zrobić

## CO JUŻ ZROBIONE (przez Claude)
- Backend: `isPremium()`, `requirePremium()` middleware
- Backend: `/api/subscription/:userId`, `/api/subscription/checkout`, `/api/subscription/portal`
- Backend: `/api/stripe/webhook` (raw body, przed express.json)
- Backend: premium check w `/api/chat` dla fizjo/psycholog/analityk
- Backend: requirePremium na `/api/import/fit` i `/api/strava/connect`
- Frontend: modal paywall z planami miesięczny/roczny
- Frontend: sekcja "Subskrypcja" w Ustawieniach
- Frontend: obsługa `?subscription=success/cancelled` po powrocie ze Stripe
- db/queries.js: `updateSubscription`, `getSubscriptionStatus`, `getUserByStripeCustomerId`

---

## TWOJE KROKI (5 kroków)

---

## KROK 1 — Supabase SQL

Wejdź: https://supabase.com → Twój projekt → SQL Editor → New Query

```sql
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
```

Kliknij "Run". Gotowe gdy "Success".

---

## KROK 2 — Stripe: Załóż konto i stwórz produkty

1. Wejdź: https://stripe.com → Zarejestruj się (lub zaloguj)
2. Górny pasek: przełącz na **Test mode** (toggle "Test mode" w prawym górnym rogu)
3. Wejdź w **Products** → **Add product**

**Produkt 1 — Miesięczny:**
- Name: `velm Premium`
- Pricing: Recurring, `29.00`, PLN, Monthly
- Kliknij Save → zapisz **Price ID** (np. `price_1AbcDef...`)

**Produkt 2 — Roczny:**
- Name: `velm Premium Roczny`
- Pricing: Recurring, `199.00`, PLN, Yearly
- Kliknij Save → zapisz **Price ID** (np. `price_1XyzAbc...`)

---

## KROK 3 — Stripe: Klucze API

1. Wejdź: Stripe Dashboard → **Developers** → **API keys**
2. Zapisz **Secret key** (zaczyna się od `sk_test_...`)

---

## KROK 4 — Stripe: Webhook

1. Wejdź: Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**
2. Endpoint URL: `https://velm-backend-production.up.railway.app/api/stripe/webhook`
3. Events to send (zaznacz wszystkie 5):
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `customer.subscription.trial_will_end`
4. Kliknij **Add endpoint**
5. Na stronie webhooka kliknij **Reveal signing secret** → zapisz (zaczyna się od `whsec_...`)

---

## KROK 5 — Railway: Zmienne środowiskowe

Wejdź: https://railway.app → velm-backend → **Variables**

Dodaj 4 zmienne:

| Nazwa | Wartość |
|-------|---------|
| `STRIPE_SECRET_KEY` | `sk_test_...` (z Kroku 3) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (z Kroku 4) |
| `STRIPE_PRICE_MONTHLY` | `price_...` (miesięczny Price ID z Kroku 2) |
| `STRIPE_PRICE_YEARLY` | `price_...` (roczny Price ID z Kroku 2) |
| `FRONTEND_URL` | `https://velm-frontend.vercel.app` |

Railway zrestartuje backend automatycznie (~30 sekund).

---

## TESTOWANIE

Po wykonaniu kroków 1-5:

1. Otwórz: https://velm-frontend.vercel.app/dashboard.html
2. Zaloguj się
3. Wejdź w **Ustawienia** → zobaczysz sekcję "Subskrypcja"
4. Kliknij "✦ Przejdź na Premium — 7 dni za darmo"
5. Wybierz plan → zostaniesz przekierowany do Stripe Checkout
6. Użyj karty testowej: `4242 4242 4242 4242`, dowolna data przyszła, CVC: `123`
7. Kliknij "Subscribe"
8. Zostaniesz przekierowany z powrotem do aplikacji z komunikatem "✦ Witaj w Premium!"

**Sprawdź czy działa:**
- [ ] W Ustawieniach widać "✦ Premium — ✓ Aktywna"
- [ ] W chacie można wybrać Fizjo / Psycholog / Analityk
- [ ] Kliknięcie Fizjo bez premium pokazuje modal z planem
- [ ] Garmin .fit upload działa po zakupie premium

---

## GDY SKOŃCZYSZ TESTY → PRZEJDŹ NA LIVE

Gdy wszystko działa w trybie testowym:
1. W Stripe Dashboard → wyłącz "Test mode"
2. Zmień w Railway `STRIPE_SECRET_KEY` na klucz live (`sk_live_...`)
3. Dodaj nowy webhook dla trybu live z tymi samymi eventami
4. Zmień `STRIPE_WEBHOOK_SECRET` na webhook secret z live endpointu

---

## JEŚLI COŚ NIE DZIAŁA

- **"Płatności niedostępne"** → STRIPE_SECRET_KEY nie ustawiony w Railway
- **"Cena nie skonfigurowana"** → STRIPE_PRICE_MONTHLY lub STRIPE_PRICE_YEARLY puste
- **Po płatności status nadal free** → webhook nie działa, sprawdź STRIPE_WEBHOOK_SECRET
- **Webhook Error 400** → webhook secret niepoprawny
- **Portal zarządzania nie otwiera się** → musisz aktywować Customer Portal w Stripe Dashboard → Settings → Billing → Customer portal
