# Wnioski o dostęp do API — Garmin, Whoop, Coros (+ Apple/Samsung natywnie)

Prosta instrukcja krok po kroku. Rejestracja i złożenie wniosku nic nie kosztują, ale uwaga: program Garmina jest przeznaczony do użytku biznesowego i dostęp do części metryk może wiązać się z opłatami licencyjnymi lub wymogami dotyczącymi liczby urządzeń — ostateczne warunki poznasz po kontakcie z Garminem. Wniosek wymaga Twojego konta i akceptacji przez firmę, dlatego składamy go teraz, a apka w międzyczasie działa na Stravie i imporcie .fit.

Po akceptacji wracamy do kodu i robimy przycisk „Połącz z Garminem / Whoop” działający dla użytkownika tak samo prosto, jak dziś „Połącz ze Stravą”.

---

## GARMIN (Health API)

Co dostaniemy: sen, tętno spoczynkowe, Body Battery, stres, HRV — automatycznie, bez ręcznych plików .fit.

1. Wejdź na **https://developer.garmin.com/gc-developer-program/**
2. Kliknij **„Request Access”** (prawy górny róg / sekcja Health API).
3. Zaloguj się swoim kontem Garmin (tym samym co w zegarku) albo załóż nowe na firmę.
4. Wypełnij formularz zgłoszeniowy. Co wpisać:
   - **Company/App name:** velm
   - **Website:** https://velm-frontend.vercel.app
   - **App description (po angielsku):**
     > velm is an AI-powered running coach app (PWA + mobile). It creates weekly training plans and adapts them using the runner's daily wellness data. We request Health API access to read sleep, resting heart rate, Body Battery, stress and HRV so our AI coach can adjust training load and recovery recommendations.
   - **Use case:** Health & Fitness / Training optimization
   - **Ilość użytkowników:** wpisz szczerze (np. „pre-launch, expected <1000 in first year”)
5. Wyślij i czekaj na maila. Według FAQ Garmina potwierdzenie statusu wniosku przychodzi w ciągu **2 dni roboczych**, a typowa integracja zajmuje potem **1–4 tygodnie**.
6. Po otrzymaniu akceptacji dostaniesz Consumer Key + Secret. **Nie wklejaj ich nigdzie do kodu** — wrzucimy je jako zmienne środowiskowe na Railway (tak jak Strava).

## WHOOP (Developer Platform)

Co dostaniemy: recovery score, strain, sen, HRV.

1. Wejdź na **https://developer.whoop.com/**
2. Kliknij **„Get Started” / „Sign up”** i załóż konto deweloperskie (może być Twój zwykły mail).
3. W panelu utwórz aplikację (**Create App**):
   - **App name:** velm
   - **Redirect URI:** `https://velm-backend-production.up.railway.app/api/whoop/callback`
     (endpoint zrobimy w kodzie — analogicznie do Strava callback)
   - **Scopes (uprawnienia):** zaznacz `read:recovery`, `read:sleep`, `read:workout`, `read:profile` oraz **`offline`** — bez `offline` Whoop nie wyda refresh tokena, access token wygaśnie i automatyczna synchronizacja przestanie działać.
   - **Opis (po angielsku):** ten sam co dla Garmina powyżej.
4. Whoop często daje klucze **od razu** (sandbox/limitowany dostęp), a o wyższy limit użytkowników wnioskuje się później — czyli może pójść szybciej niż Garmin.
5. Dostaniesz Client ID + Client Secret → **nie wklejaj do kodu**, dodamy na Railway.

## COROS (Open Platform)

Co dostaniemy: treningi (bieg, tempo, tętno, przewyższenia) prosto z zegarków COROS.

1. Wejdź na **https://open.coros.com/** (COROS Open Platform).
2. Kliknij **Apply / Register** i wypełnij wniosek partnerski:
   - **App name:** velm
   - **Website:** https://velm-frontend.vercel.app
   - **Redirect URI:** `https://velm-backend-production.up.railway.app/api/coros/callback`
   - **Opis (po angielsku):** ten sam co dla Garmina powyżej.
3. COROS rozpatruje wnioski mailowo — czasem dopytują o szczegóły produktu. Po akceptacji dostaniesz Client ID + Secret (OAuth, schemat jak Strava).
4. Kluczy **nie wklejaj do kodu** — dodamy na Railway.

## APPLE HEALTH i SAMSUNG HEALTH — tylko natywnie (osobny etap)

Te dwie NIE mają web-API — żaden serwer nie może pobrać danych „z chmury".
Dostęp jest możliwy wyłącznie z natywnej aplikacji zainstalowanej na telefonie:

- **Apple Health (iOS):** HealthKit — czytamy sen/HRV/tętno/treningi bezpośrednio
  na iPhonie. Wymaga zapakowania velm w Capacitora (mamy już `capacitor.config.json`),
  pluginu HealthKit i publikacji w App Store.
- **Samsung Health (Android):** najlepsza droga to **Health Connect** (systemowy
  magazyn zdrowia Androida) — Samsung Health, Garmin i inni synchronizują do niego
  dane, a my czytamy jednym pluginem Capacitora. Jedna integracja = Samsung + inni.

Czyli: **jedna robota natywna (Capacitor + 2 pluginy) załatwia Apple i Samsunga naraz.**
Wniosków składać nie trzeba — to czysto nasza praca inżynierska + konta developerskie
Apple (99 USD/rok) i Google Play (25 USD jednorazowo), które i tak są potrzebne do sklepów.

## Po akceptacji (moja robota, nie Twoja)

- Backend: OAuth flow `/api/garmin/*` i `/api/whoop/*` według wspólnego schematu OAuth znanego ze Stravy (server.js), z dostosowaniem do wymagań każdego dostawcy — w tym zapisywanie access + refresh tokenów w bazie i automatyczne odświeżanie ich przed wygaśnięciem.
- Frontend: przyciski „Połącz z Garminem” / „Połącz z Whoop” w Ustawieniach → Połączenia.
- Dane snu/HRV/gotowości zasilą zakładkę LABORATORIUM.

## Status

- [ ] Wniosek Garmin złożony — data: ______
- [ ] Wniosek Whoop złożony — data: ______
- [ ] Wniosek Coros złożony — data: ______
- [ ] Garmin zaakceptowany — klucze na Railway
- [ ] Whoop zaakceptowany — klucze na Railway
- [ ] Coros zaakceptowany — klucze na Railway
- [ ] Konto Apple Developer (99 USD/rok) — potrzebne do App Store + HealthKit
- [ ] Konto Google Play (25 USD) — potrzebne do sklepu + Health Connect
