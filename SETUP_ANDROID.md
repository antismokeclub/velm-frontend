# velm na Androida — od repo do Google Play

Projekt natywny (`android/`) jest już w repo, razem z mostem do Health Connect.
Ten plik opisuje tylko to, czego **nie da się zrobić z poziomu repo**: instalację
narzędzi, build na telefonie i zgłoszenie do sklepu.

---

## Co już jest zrobione (nie szukaj tego jeszcze raz)

- `android/` wygenerowane Capacitorem 8, `appId` = `app.velm`, nazwa „velm".
- Wtyczka `@capgo/capacitor-health` — jedna integracja czyta **Health Connect**
  (Android) i **Apple Health** (iOS). Garmin, Coros, Polar i Samsung same
  synchronizują się do tego magazynu, więc nie potrzeba pięciu partnerskich API.
- `minSdkVersion = 26` w `android/variables.gradle` — Health Connect nie istnieje
  poniżej Androida 8.0.
- Uprawnienie `READ_HEALTH_DATA_HISTORY` w `AndroidManifest.xml` — bez niego
  Health Connect oddaje tylko ostatnie 30 dni. Pozostałe uprawnienia zdrowotne
  wnosi manifest wtyczki, **nie dopisuj ich ręcznie**.
- Adres polityki prywatności dla okna zgody Health Connect w `strings.xml`
  (`health_connect_privacy_policy_url` → `/privacy.html` na produkcji).
- `connectWatch()` w `js/dashboard/14-integracje.js` — zgody, odczyt HRV, tętna
  spoczynkowego i snu, przeliczenie na dni i wysyłka do `POST /api/health/sync`.
  Do tego cicha synchronizacja w tle co 6 h przy starcie apki.

**Apka ładuje żywą stronę z Vercela** (`server.url` w `capacitor.config.json`).
Praktyczny skutek: poprawki w HTML/CSS/JS trafiają do użytkowników zwykłym
deployem, bez nowego wydania w sklepie. Nowe wydanie jest potrzebne tylko przy
zmianach natywnych (uprawnienia, wtyczki, ikona, wersja).

---

## 1. Narzędzia (jednorazowo, ~1,5 h razem z pobieraniem)

Na tej maszynie **nie ma jeszcze ani Javy, ani Android SDK** — sprawdzone.

1. **Android Studio Otter (2025.2.1) lub nowsze** — https://developer.android.com/studio
   Instalator dociąga Android SDK i JDK 21; osobna Java nie jest potrzebna.
2. Przy pierwszym uruchomieniu w kreatorze zaznacz **Android SDK Platform 36**
   i **Android SDK Build-Tools** (projekt jest na `compileSdk`/`targetSdk` 36).
3. Sprawdź w terminalu, że SDK jest widoczne:
   ```
   echo $env:ANDROID_HOME
   ```
   Jeśli pusto, ustaw na `%LOCALAPPDATA%\Android\Sdk` (Android Studio zwykle
   robi to samo, ale Gradle z linii poleceń tego wymaga).

Wersje, na których projekt jest zbudowany: Gradle 8.14.3, Android Gradle Plugin
8.13.0. Android Studio zaproponuje aktualizację AGP — **odrzuć ją na razie**,
wersje są dobrane pod Capacitora 8.

---

## 2. Pierwsze uruchomienie na Twoim Samsungu

```powershell
npm install            # jednorazowo, jeśli nie ma node_modules
npm run cap:sync       # build dist/ + przeniesienie do android/
npm run cap:open:android
```

W Android Studio: włącz na telefonie **opcje programisty → debugowanie USB**,
podłącz kablem, wybierz urządzenie z listy i naciśnij Run.

### Co sprawdzić w tej kolejności

1. **Czy most działa.** W Chrome na komputerze otwórz `chrome://inspect`,
   podłącz się do WebView apki i w konsoli wpisz:
   ```js
   window.Capacitor.Plugins.Health
   ```
   Ma zwrócić obiekt. `undefined` znaczy, że wtyczka nie wstała — wtedy nic
   dalej nie zadziała i to jest pierwszy trop.
2. **Ustawienia → Połączenia → Połącz** przy dowolnym zegarku. Powinno wyskoczyć
   systemowe okno Health Connect z prośbą o trzy rzeczy: zmienność tętna, tętno
   spoczynkowe, sen. Zgódź się na wszystkie.
3. Po zgodzie apka od razu ciągnie dane i pokazuje „Pobrano dane z N dni".
   Napis „Zegarek nie ma jeszcze nic do pobrania" znaczy, że zgody są dobrze,
   ale magazyn telefonu jest pusty — patrz punkt niżej.
4. **Sprawdź w bazie**, że wiersze wpadły: tabela `health_metrics`, kolumny
   `hrv`, `resting_hr`, `sleep_hours` pod właściwymi datami. To jedyny dowód,
   że cała droga zadziałała.

### Żeby w magazynie w ogóle coś było

Samsung Health domyślnie **nie** oddaje danych do Health Connect. Na telefonie:
Samsung Health → Ustawienia → Health Connect → włącz udostępnianie zmienności
tętna, tętna spoczynkowego i snu. Potem trzeba przespać jedną noc z zegarkiem —
HRV i tętno spoczynkowe powstają wyłącznie w czasie snu.

Ta sama droga obowiązuje Garmina (Garmin Connect → Health Connect) i Corosa.

---

## 3. Podpisany build do sklepu

```powershell
keytool -genkey -v -keystore velm-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias velm
```

**Ten plik i hasło do niego są nie do odzyskania.** Jeśli je stracisz, nie
wypuścisz już aktualizacji tej aplikacji — trzeba by założyć nową pozycję
w sklepie. Zrób kopię poza tym komputerem. `.gitignore` celowo blokuje
`*.jks` i `*.keystore`, żeby klucz nie wszedł do repo.

Potem w Android Studio: **Build → Generate Signed App Bundle**, wskaż keystore,
wynik to plik `.aab` do wgrania w Play Console.

---

## 4. Zgłoszenie do Google Play

To jest **bramka zewnętrzna** — recenzja danych zdrowotnych trwa od kilku dni do
kilku tygodni i nie ruszy, dopóki nie wgrasz pierwszego podpisanego buildu.
Dlatego warto wysłać nawet niedokończoną wersję do testów zamkniętych.

Do przygotowania:

1. **Deklaracja danych zdrowotnych.** Play zapyta osobno o każde uprawnienie
   zdrowotne z manifestu. Odpowiedź jest w kodzie: HRV, tętno spoczynkowe i sen
   służą do wyliczenia gotowości do treningu i planu na tydzień, dane idą do
   naszego backendu, nie są sprzedawane ani udostępniane dalej.
2. **Osobne uzasadnienie dla `READ_HEALTH_DATA_HISTORY`** — velm liczy trend
   formy z dłuższego okna niż 30 dni.
3. **Nagranie ekranu** pokazujące, gdzie w apce widać efekt tych danych
   (Laboratorium, karta „dziś"). Recenzent tego wymaga przy danych zdrowotnych.
4. **Adres polityki prywatności**: `https://velm-frontend.vercel.app/privacy.html`
   — ma już sekcję o danych zdrowotnych napisaną pod tę deklarację.
5. W `privacy.html` i `terms.html` siedzą **trzy czerwone znaczniki** do
   uzupełnienia: nazwa podmiotu, adres rejestrowy, e-mail kontaktowy. Bez nich
   zgłoszenie odpadnie na formalnościach.

---

## iOS — czego brakuje

`npx cap add ios` wymaga maca z Xcode. Wtyczka obsługuje HealthKit tym samym
kodem, więc `connectWatch()` zadziała bez zmian, ale trzeba włączyć uprawnienie
HealthKit w Xcode i dopisać `NSHealthShareUsageDescription` do `Info.plist`.
