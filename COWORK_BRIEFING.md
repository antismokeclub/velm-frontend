# VELM — Briefing dla Claude Cowork

Velm to AI-powered aplikacja dla biegaczy (PWA). Cztery agenty AI (Szef Sztabu, Analityk, Fizjo, Psycholog) analizują dane treningowe i generują spersonalizowane plany tygodniowe. Backend: Node.js/Express na Railway. Frontend: vanilla HTML/JS na Vercel. Baza: Supabase. AI: Claude Haiku (chat) + Sonnet (plany).

---

## Jak zacząć sesję

1. Przeczytaj `CLAUDE.md` — pełna dokumentacja projektu
2. Uruchom lokalnie:
   ```bash
   # Terminal 1 — backend
   cd velm-backend && node server.js

   # Terminal 2 — frontend
   cd aspireflow && npx serve . -l 8080
   ```
3. Użyj `/recall` żeby zobaczyć ostatnie zmiany w projekcie
4. Użyj `/wiki-brain query "pytanie"` zamiast czytać pliki od zera

---

## Komendy

| Komenda | Co robi |
|---------|---------|
| `/recall` | Ostatnie 5 sesji + co było zmieniane |
| `/wiki-brain query "pytanie"` | Szukaj w grafie wiedzy (szybciej niż czytanie plików) |
| `/wiki-brain ingest <plik>` | Dodaj nowy plik do wiki |
| `/review` | Code review aktualnych zmian |
| `/investigate` | Diagnoza błędów 500 / bugów |
| `/qa` | Testy end-to-end featurea |
| `/ship` | Push + PR |

---

## Lista zadań

### UI/UX — DO POPRAWY
- [ ] Okno logowania — przeprojektuj zgodnie z velm design system (białe karty, #1A1A1A, 20px radius)
- [ ] Onboarding — usuń zbędne kontrasty, uprość pytania, popraw styl według skillów `velm-taste` i `velm-design`
- [ ] UI Settings — dodaj waga/wzrost użytkownika, dodatkowe uwagi dla AI (pole `ai_notes` → trafia do `onboarding_data`)
- [ ] Historia treningów — kalendarz z poprzednimi treningami z tabeli `workouts`
- [ ] Poprawa ogólnego stylu według zainstalowanych skillów (`velm-taste`, `velm-design`, `velm-animations`)

### INTEGRACJE
- [ ] Strava OAuth — Client ID z `strava.com/settings/api`, przycisk "Połącz Strava" w Settings, import aktywności do `workouts`
- [ ] Garmin API — sen, HR, Body Battery (wymaga rejestracji partnera Garmin Health API)
- [ ] Google Fit API — alternatywa dla użytkowników Android bez Garmina

### PŁATNOŚCI I LAUNCH
- [ ] Stripe — plan $34.99/miesiąc, Checkout Session, webhook `checkout.session.completed` → `users.is_paid = true`
- [ ] Capacitor — Google Play (Android): `npx cap init` + `npx cap add android` + podpisanie APK; iOS: Codemagic CI/CD
- [ ] Push notifikacje — przypomnienie o check-inie (Web Push API lub Capacitor Push plugin)

### LOGIKA CHECK-IN
- [ ] Przemyśl kiedy pokazuje się dzienny check-in — rano (przed treningiem) czy wieczorem (po dniu)?
- [ ] Przemyśl kiedy pokazuje się po-treningowy check-in — tylko po zapisanym treningu przez `/api/workout`?
- [ ] Komu pokazuje się check-in — tylko aktywnym użytkownikom z aktywnym planem tygodniowym?

### TESTY I BŁĘDY
- [ ] Napisz testy dla głównych endpointów API (`/api/login`, `/api/chat`, `/api/workout`, `/api/onboarding`)
- [ ] Sprawdź błędy w logach Railway (Railway dashboard → Deployments → Logs)
- [ ] Przetestuj flow onboardingu end-to-end (rejestracja → pierwszy plan → dashboard)
- [ ] Przetestuj chat z każdym agentem (`fizjo`, `analityk`, `psycholog`, `szef_sztabu`)

### NICE TO HAVE
- [ ] Landing page velm (hero + 4 agenci + pricing + CTA)
- [ ] Widok historii wszystkich treningów z filtrowaniem po typie

---

## Znane błędy i rozwiązania

| Problem | Rozwiązanie |
|---------|------------|
| `user_injuries` tabela | Już utworzona w Supabase — nie tworzyć ponownie |
| Format odpowiedzi agentów | Bez markdown (żadnych `**`, `#`, `-` jako lista), max 4-6 zdań, `new Date()` dla dnia |
| `API_BASE` | Musi być dynamiczny — nigdy nie hardcoduj IP, patrz CLAUDE.md |
| Walidacja JS | `node --check <plik>` po każdej zmianie przed commitem |
| PORT | Railway ustawia automatycznie — serwer słucha na `process.env.PORT \|\| 3000` |
| CORS | Nowe domeny dodawaj do tablicy `allowed` w `server.js` |

---

## Flow pracy

1. `/recall` na początku sesji — zorientuj się co ostatnio zrobiono
2. Jeden task na raz — nie zaczynaj następnego przed ukończeniem
3. `node --check <plik>` po każdej zmianie JS
4. `git push` — Railway i Vercel wdrażają automatycznie z main brancha
5. `/ship` gdy feature gotowy — PR z opisem co i dlaczego

---

## Instrukcja dla Claude Cowork — pierwsze uruchomienie

Gdy zaczynasz pracę z tym projektem po raz pierwszy:

1. Przeczytaj `CLAUDE.md` i ten plik
2. Uruchom `/recall` żeby zobaczyć historię sesji
3. Uruchom `/wiki-brain query "architektura velm"` żeby zrozumieć projekt bez czytania 7000 linii kodu

4. Następnie **ZAPROPONUJ** mi bez czekania na prośbę:
   - Co Twoim zdaniem jest najpilniejsze do naprawy (błędy UX, bugi, dług techniczny)
   - Co możesz zautomatyzować lub uprościć w kodzie
   - Jakie widzisz ryzyka przed launchem (bezpieczeństwo, wydajność, koszty AI)
   - Co zrobiłbyś inaczej w architekturze gdybyś zaczynał od zera
   - Jakie testy warto napisać w pierwszej kolejności
   - Co w UI według Ciebie wygląda słabo i jak to poprawić

5. Napisz krótkie podsumowanie oceny projektu — co jest dobre, co wymaga uwagi, jakie masz pomysły których nie ma na liście

Jesteś senior developerem który widzi projekt świeżym okiem. Nie czekaj aż Cię o to poproszę.

---

## Moja ocena projektu — propozycje zmian (od Claude)

Piszę to jako senior developer który przeczytał cały kod w tej sesji.

### Co jest dobrze zrobione
- Architektura agentów jest czysta — każdy ma jasną odpowiedzialność, nie zachodzi na siebie
- `long_term_memory` + `user_patterns` to solidny fundament pod personalizację — rzadko spotykane w MVP
- Rate limiting na wszystkich endpointach od razu — dobra decyzja
- `extractAndSaveMemory()` wykrywa sygnały (kontuzja, demotywacja) z naturalnego języka — to jest killer feature
- Koszt $0.37/user/miesiąc przy Haiku to bardzo dobry wynik

### Ryzyka przed launchem

**Bezpieczeństwo:**
- Brak weryfikacji `userId` w żadnym endpoincie — użytkownik A może odpytać dane użytkownika B przez `/api/plan/CUDZY_UUID`. Dodaj middleware `requireAuth` który weryfikuje czy `userId` z tokenu = `userId` z parametru
- Brak JWT/session token — samo `userId` w localStorage to za mało dla płatnej aplikacji. Rozważ Supabase Auth (gotowy, wbudowany)
- `POST /api/init-memory` i `POST /api/plan-changes/init` są publiczne bez auth — każdy może wywołać

**Wydajność:**
- `proactiveCheck` odpala się dla WSZYSTKICH userów co wieczór bez concurrency limit — przy 1000 użytkownikach może to zajmować kilka minut i blokować inne requesty. Dodaj `p-limit` z concurrency = 5
- Cache notatek agentów ma TTL 1h ale jest in-memory — po restarcie serwera (Railway restartuje przy deploy) cały cache ginie i pierwsze requesty po deploymencie będą wolne

**Koszty AI:**
- `szefNarada` uruchamia `analitykTygodniowy` (Sonnet) nawet gdy user nie miał treningów w tygodniu — lazy loading jest, ale warunek `recentCheck.length === 0` zatrzymuje tylko `analitykTygodniowy`, nie `szefNaradę`. Przy 500 userach to 500 wywołań Sonnet co niedzielę niezależnie od aktywności

### Co uprościłbym w architekturze

- **`extractAndSaveMemory()` jest skopiowana 4 razy** (headtrainer, analityk, fizjo, psycholog — identyczny kod). Przenieść do `db/queries.js` lub osobnego `utils/memory.js` i importować
- **`_extractNotes()` i `_stripNotesTag()`** — te same funkcje w każdym agencie. To samo
- Rozważ `agents/base.js` z shared logiką — każdy agent dziedziczy / importuje

### Testy które warto napisać najpierw

1. `POST /api/onboarding` → czy tworzy usera + generuje plan (integracyjny z live Supabase)
2. `POST /api/chat` z każdym agentem → czy zwraca `reply` (string, nie pusty)
3. `POST /api/workout` → czy triggeruje `analitykAutoAnaliza` (mock Claude API)
4. `GET /api/plan/:userId` → czy zwraca plan po onboardingu
5. Rate limiter test — 21 requestów na `/api/chat` → 21. powinien zwrócić 429

### Co w UI wygląda słabo (bez patrzenia na kod, na podstawie architektury)

- Okno logowania prawdopodobnie nie pasuje do design systemu dashboardu — onboarding (index.html) i dashboard (dashboard.html) mają różne tokeny kolorów i fonty. Warto ujednolicić
- Brak stanu ładowania podczas generowania planu (`szefNarada` zajmuje kilka sekund Sonnet) — użytkownik nie wie czy aplikacja działa
- Check-in prawdopodobnie jest widoczny zawsze — logika "komu i kiedy" powinna być zaimplementowana (patrz lista zadań)

### Propozycje których nie ma na liście

- **Streak jako core loop** — masz `getUserStreak()` ale nie wiem czy jest widocznie w UI. Streak to najsilniejszy mechanizm retencji w health appach — powinien być na głównym ekranie dashboardu
- **"Dziś masz odpoczynek" screen** — dla dni rest w planie zamiast pustego ekranu pokaż coś wartościowego (cytat, podsumowanie tygodnia, sugestia fizjo)
- **Agent "głos"** — każdy agent powinien mieć wyraźnie inny styl. Analityk: zimny, liczbowy. Fizjo: krótko, ostrzegawczo. Psycholog: ciepło ale bez pustych fraz. Szef: motywacyjnie ale konkretnie. Sprawdź czy prompty to egzekwują
