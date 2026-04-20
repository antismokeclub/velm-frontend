# Instrukcja: Strava + Garmin .fit — finalizacja

## CO JUŻ ZROBIONE (przez Claude)
- Backend: endpointy OAuth Strava (`/api/strava/connect`, `/api/strava/callback`, webhook)
- Backend: endpoint importu .fit (`/api/import/fit/:userId`)
- Frontend: UI w Ustawieniach → Połączenia (przycisk "Połącz" + status)
- Frontend: UI importu Garmin .fit (przycisk "Wgraj .fit" w Settings i Historii)

## CO MUSISZ ZROBIĆ TY (4 kroki)

---

## KROK 1 — Supabase SQL (jednorazowo)

Wejdź na: https://supabase.com → Twój projekt → SQL Editor → New Query

Wklej i uruchom:

```sql
-- Kolumny Stravy w tabeli users
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS strava_athlete_id BIGINT,
  ADD COLUMN IF NOT EXISTS strava_access_token TEXT,
  ADD COLUMN IF NOT EXISTS strava_refresh_token TEXT,
  ADD COLUMN IF NOT EXISTS strava_token_expires_at TIMESTAMPTZ;

-- Tabela deduplikacji (żeby nie importować 2x tego samego biegu)
CREATE TABLE IF NOT EXISTS strava_processed_activities (
  id SERIAL PRIMARY KEY,
  strava_activity_id TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Kliknij "Run". Gotowe gdy napisze "Success".

---

## KROK 2 — Strava: Zarejestruj aplikację

1. Wejdź na: https://www.strava.com/settings/api
2. Kliknij "Create & Manage Your App"
3. Wypełnij:
   - **Application Name**: velm
   - **Category**: Training
   - **Club**: (zostaw puste)
   - **Website**: https://velm-frontend.vercel.app
   - **Authorization Callback Domain**: `velm-backend-production.up.railway.app`
4. Kliknij "Save"
5. Zapisz sobie **Client ID** i **Client Secret** (będą potrzebne za chwilę)

---

## KROK 3 — Railway: Dodaj zmienne środowiskowe

Wejdź na: https://railway.app → velm-backend → Variables

Kliknij "New Variable" i dodaj **4 zmienne**:

| Nazwa | Wartość |
|-------|---------|
| `STRAVA_CLIENT_ID` | (twój Client ID ze Stravy, np. `12345`) |
| `STRAVA_CLIENT_SECRET` | (twój Client Secret ze Stravy, długi ciąg znaków) |
| `STRAVA_VERIFY_TOKEN` | `velm_strava_verify_2024` |
| `STRAVA_REDIRECT_URI` | `https://velm-backend-production.up.railway.app/api/strava/callback` |

Po dodaniu Railway automatycznie zrestartuje backend (~30 sekund).

---

## KROK 4 — Strava Webhook: Jednorazowa rejestracja

Po restarcie backendu uruchom w terminalu (zastąp `TWOJ_CLIENT_ID` i `TWOJ_CLIENT_SECRET`):

```bash
curl -X POST https://www.strava.com/api/v3/push_subscriptions \
  -F client_id=TWOJ_CLIENT_ID \
  -F client_secret=TWOJ_CLIENT_SECRET \
  -F "callback_url=https://velm-backend-production.up.railway.app/api/strava/webhook" \
  -F "verify_token=velm_strava_verify_2024"
```

Powinnaś dostać odpowiedź z `"id": 123456` (jakiś numer).
To znaczy że webhook jest zarejestrowany — Strava będzie automatycznie
powiadamiać backend po każdym Twoim biegu.

**Nie masz terminala?** Możesz użyć https://reqbin.com lub Postman.

---

## TESTOWANIE STRAVY

1. Otwórz aplikację: https://velm-frontend.vercel.app/dashboard.html
2. Wejdź w **Ustawienia** → **Połączenia**
3. Kliknij "**Połącz**" przy Strava
4. Zostaniesz przekierowany na Strava.com → zaakceptuj uprawnienia
5. Wrócisz do aplikacji z komunikatem "Strava połączona!"
6. Treningi z ostatnich 30 dni zaimportują się automatycznie w tle
7. Sprawdź w **Historia** czy pojawiły się biegi

---

## TESTOWANIE GARMIN .FIT

1. Wejdź na: https://connect.garmin.com
2. Kliknij dowolny bieg → kliknij **ikonę koła zębatego (⚙)** → **Eksportuj oryginał**
3. Pobierzesz plik `.fit` (np. `activity_12345.fit`)
4. W aplikacji velm → **Ustawienia** → **Połączenia** → "**Wgraj .fit**"
5. Wybierz pobrany plik
6. Po chwili zobaczysz potwierdzenie z dystansem i tempem
7. Sprawdź **Historia** — trening powinien się pojawić

---

## JEŚLI COŚ NIE DZIAŁA

- **Strava "error=access_denied"** — anulowałeś uprawnienia na Strava.com
- **Strava "server_error"** — sprawdź czy zmienne CLIENT_ID/SECRET są poprawne w Railway
- **.fit "Tylko pliki .fit"** — upewnij się że plik ma rozszerzenie `.fit` (nie `.zip`)
- **.fit "Aktywność X nie jest biegiem"** — Garmin zapisał aktywność jako inny sport (np. Cycling)
- **.fit "Trening z tej daty już istnieje"** — ten trening już masz w bazie
- **Backend nie odpowiada** — odczekaj 60s po zmianie zmiennych w Railway

---

## PUSH DO PRODUKCJI

Przed testowaniem zrób push zmian:

```bash
# Z katalogu velm-backend
cd C:\Users\User\Desktop\aspireflow\velm-backend
git add -A
git commit -m "feat: Strava OAuth + Garmin .fit import"
git push

# Z katalogu aspireflow (frontend)
cd C:\Users\User\Desktop\aspireflow
git add dashboard.html
git commit -m "feat: Strava + Garmin .fit import UI"
git push
```
