# Wnioski o dostęp do API — Garmin i Whoop

Prosta instrukcja krok po kroku. Wszystko jest **za darmo**, ale wymaga Twojego konta i akceptacji przez firmę (tygodnie oczekiwania — dlatego składamy teraz, a apka w międzyczasie działa na Stravie i imporcie .fit).

Po akceptacji wracamy do kodu i robimy przycisk „Połącz z Garminem / Whoop" dokładnie tak, jak działa dziś „Połącz ze Stravą".

---

## GARMIN (Health API)

Co dostaniemy: sen, tętno spoczynkowe, Body Battery, stres, HRV — automatycznie, bez ręcznych plików .fit.

1. Wejdź na **https://developer.garmin.com/gc-developer-program/**
2. Kliknij **„Request Access"** (prawy górny róg / sekcja Health API).
3. Zaloguj się swoim kontem Garmin (tym samym co w zegarku) albo załóż nowe na firmę.
4. Wypełnij formularz zgłoszeniowy. Co wpisać:
   - **Company/App name:** velm
   - **Website:** https://velm-frontend.vercel.app
   - **App description (po angielsku):**
     > velm is an AI-powered running coach app (PWA + mobile). It creates weekly training plans and adapts them using the runner's daily wellness data. We request Health API access to read sleep, resting heart rate, Body Battery, stress and HRV so our AI coach can adjust training load and recovery recommendations.
   - **Use case:** Health & Fitness / Training optimization
   - **Ilość użytkowników:** wpisz szczerze (np. „pre-launch, expected <1000 in first year")
5. Wyślij i czekaj na maila. Garmin zwykle odpowiada w **2–8 tygodni**.
6. Jak przyjdzie akceptacja → dostaniesz Consumer Key + Secret. **Nie wklejaj ich nigdzie do kodu** — wrzucimy je jako zmienne środowiskowe na Railway (tak jak Strava).

## WHOOP (Developer Platform)

Co dostaniemy: recovery score, strain, sen, HRV.

1. Wejdź na **https://developer.whoop.com/**
2. Kliknij **„Get Started" / „Sign up"** i załóż konto deweloperskie (może być Twój zwykły mail).
3. W panelu utwórz aplikację (**Create App**):
   - **App name:** velm
   - **Redirect URI:** `https://velm-backend-production.up.railway.app/api/whoop/callback`
     (endpoint zrobimy w kodzie — analogicznie do Strava callback)
   - **Scopes (uprawnienia):** zaznacz `read:recovery`, `read:sleep`, `read:workout`, `read:profile`
   - **Opis (po angielsku):** ten sam co dla Garmina powyżej.
4. Whoop często daje klucze **od razu** (sandbox/limitowany dostęp), a o wyższy limit użytkowników wnioskuje się później — czyli może pójść szybciej niż Garmin.
5. Dostaniesz Client ID + Client Secret → **nie wklejaj do kodu**, dodamy na Railway.

## Po akceptacji (moja robota, nie Twoja)

- Backend: OAuth flow `/api/garmin/*` i `/api/whoop/*` wzorowany 1:1 na istniejącym flow Stravy (server.js).
- Frontend: przyciski „Połącz z Garminem" / „Połącz z Whoop" w Ustawieniach → Połączenia.
- Dane snu/HRV/gotowości zasilą zakładkę LABORATORIUM.

## Status

- [ ] Wniosek Garmin złożony — data: ______
- [ ] Wniosek Whoop złożony — data: ______
- [ ] Garmin zaakceptowany — klucze na Railway
- [ ] Whoop zaakceptowany — klucze na Railway
