











        // --- Auth Check ---
        if (!localStorage.getItem('velm_token')) {
            // Clear user_id too to prevent redirect loop with index.html
            localStorage.removeItem('velm_user_id');
            localStorage.removeItem('velm_user_name');
            window.location.href = 'index.html';
        }

        // --- XSS Sanitization ---
        function sanitizeHTML(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        // --- Auth Header Helper ---
        function authHeaders(extra) {
            return Object.assign({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('velm_token')}`
            }, extra || {});
        }

        // --- Refresh Token Flow ---
        // Single in-flight refresh promise — multiple parallel 401s share one refresh attempt.
        let _refreshPromise = null;
        async function refreshAccessToken() {
            if (_refreshPromise) return _refreshPromise;
            _refreshPromise = (async () => {
                const refreshToken = localStorage.getItem('velm_refresh_token');
                if (!refreshToken) return null;
                try {
                    const res = await fetch(`${window.API_BASE || ''}/api/refresh`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refreshToken })
                    });
                    if (!res.ok) return null;
                    const data = await res.json().catch(() => ({}));
                    if (!data.accessToken || !data.refreshToken) return null;
                    localStorage.setItem('velm_token', data.accessToken);
                    localStorage.setItem('velm_refresh_token', data.refreshToken);
                    return data.accessToken;
                } catch (e) {
                    return null;
                } finally {
                    _refreshPromise = null;
                }
            })();
            return _refreshPromise;
        }

        // Access token żyje 1h, a odświeżyć go potrafi WYŁĄCZNIE apiFetch().
        // Większość loaderów startowych używa gołego fetch(), więc po godzinie
        // przerwy cały ekran startowy dostawał 401 (zmierzone: 15 żądań zanim
        // cokolwiek odświeżyło token) i pokazywał „Brak połączenia z serwerem"
        // mimo w pełni działającego serwera. Dlatego odświeżamy PRZED loaderami.
        //
        // Czytamy `exp` z tokenu bez weryfikacji podpisu — to tylko decyzja
        // „czy warto odświeżyć". Autentyczność i tak sprawdza serwer.
        function _accessTokenExpiresWithin(seconds) {
            const tok = localStorage.getItem('velm_token');
            if (!tok) return true;
            const parts = tok.split('.');
            if (parts.length !== 3) return true;   // nie-JWT (np. token testowy) — odśwież
            try {
                const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
                const exp = JSON.parse(json).exp;
                if (!exp) return true;
                return (exp * 1000) - Date.now() < seconds * 1000;
            } catch (e) {
                return true;
            }
        }
        // Zwraca zawsze — brak refresh tokenu albo nieudane odświeżenie nie może
        // zablokować startu apki (loadery i tak mają własne 401 → forceReauth).
        async function ensureFreshToken() {
            try {
                if (!_accessTokenExpiresWithin(120)) return;
                if (!localStorage.getItem('velm_refresh_token')) return;
                await refreshAccessToken();
            } catch (e) {
                console.warn('ensureFreshToken:', e?.message || e);
            }
        }

        // Wygasła/nieważna sesja — wyczyść tokeny i pokaż ekran logowania,
        // zamiast zostawiać apkę „martwą" (dane po cichu nie ładują się).
        let _reauthShown = false;
        function forceReauth(message) {
            localStorage.removeItem('velm_token');
            localStorage.removeItem('velm_refresh_token');
            const overlay = document.getElementById('login-overlay');
            if (overlay) overlay.classList.remove('hidden');
            if (!_reauthShown && message && typeof showVelmToast === 'function') {
                _reauthShown = true;
                showVelmToast(message, true);
            }
        }

        // --- API Fetch Helper ---
        // Wraps fetch() with: authHeaders, .ok check, JSON parse with safe fallback,
        // 401 → auto-refresh + retry once, then force re-login.
        async function apiFetch(path, opts = {}, _retried = false) {
            const url = path.startsWith('http') ? path : `${window.API_BASE || ''}${path}`;
            const init = {
                method: opts.method || 'GET',
                headers: authHeaders(opts.headers),
                ...opts
            };
            if (init.headers === undefined) init.headers = authHeaders();
            if (init.body && typeof init.body !== 'string') init.body = JSON.stringify(init.body);
            let res;
            try {
                res = await fetch(url, init);
            } catch (e) {
                const err = new Error(t('err.noserver'));
                err.cause = e;
                throw err;
            }
            // Parse body once — safely
            let data = null;
            const ct = res.headers.get('content-type') || '';
            if (ct.includes('application/json')) {
                try { data = await res.json(); } catch (e) { data = null; }
            } else {
                try { data = { _text: await res.text() }; } catch (e) { data = null; }
            }
            if (res.status === 401 && !_retried) {
                // Try refresh once
                const newToken = await refreshAccessToken();
                if (newToken) {
                    // Retry original request with new access token
                    return apiFetch(path, opts, true);
                }
                // Refresh failed — fall through to logout flow
            }
            if (res.status === 401) {
                // Refresh exhausted — force re-login
                localStorage.removeItem('velm_token');
                localStorage.removeItem('velm_refresh_token');
                const overlay = document.getElementById('login-overlay');
                if (overlay) overlay.classList.remove('hidden');
                const err = new Error((data && data.error) || t('err.session'));
                err.status = 401;
                err.data = data;
                throw err;
            }
            if (!res.ok) {
                const err = new Error((data && data.error) || `${t('err.server')} (${res.status})`);
                err.status = res.status;
                err.data = data;
                throw err;
            }
            return data;
        }

        // --- authFetch: goły fetch + odzyskiwanie po 401 ---------------------
        // 39 wywołań w js/dashboard robi `fetch(url, { headers: authHeaders() })`.
        // Gdy access token wygaśnie W TRAKCIE sesji (TTL 1h), każde z nich dostaje
        // 401 i nikt ich nie ponawia — apka po cichu pustoszeje: karty bez danych,
        // subskrypcja spada do nie-premium, zero komunikatu.
        //
        // apiFetch to potrafi, ale ma INNY KONTRAKT (rzuca na !ok, zwraca sparsowane
        // dane), więc przepisanie 39 miejsc byłoby zmianą semantyki w całej warstwie
        // danych. authFetch zwraca ZWYKŁY Response, więc `res.ok`, `res.json()`
        // i istniejące catche zostają nietknięte — podmiana jest mechaniczna.
        //
        // Świadomie NIE jest to opakowanie globalnego window.fetch: sondy renderu
        // podmieniają `w.fetch` po załadowaniu strony, więc globalny wrapper byłby
        // przez nie kasowany i testowałyby apkę z WYŁĄCZONYM odzyskiwaniem po 401,
        // nie wiedząc o tym.
        function _withFreshToken(headers) {
            const h = Object.assign({}, headers || {});
            // Klucz mógł przyjść w dowolnej wielkości liter — usuwamy każdy wariant,
            // żeby nie zostawić starego obok nowego.
            Object.keys(h).forEach(k => { if (k.toLowerCase() === 'authorization') delete h[k]; });
            const tok = localStorage.getItem('velm_token');
            if (tok) h['Authorization'] = 'Bearer ' + tok;
            return h;   // Content-Type NIE jest dotykany — inaczej FormData (.fit) traci boundary
        }
        async function authFetch(path, opts = {}) {
            const url = String(path).startsWith('http') ? path : `${window.API_BASE || ''}${path}`;
            // Nagłówek budujemy PRZY KAŻDEJ próbie, nie raz. authHeaders() czyta token
            // z localStorage w chwili wywołania, więc ponowienie ze starym `init`
            // poleciałoby z tym samym wygasłym tokenem i znowu dostało 401.
            const attempt = () => fetch(url, Object.assign({}, opts, { headers: _withFreshToken(opts.headers) }));

            const res = await attempt();
            if (res.status !== 401) return res;

            // refreshAccessToken() ma jedną obietnicę w locie, więc 39 równoległych
            // 401 dzieli JEDNO odświeżenie — nie dokładamy drugiego mechanizmu.
            const fresh = await refreshAccessToken();
            if (!fresh) {
                // Refresh token też padł — ekran logowania zamiast cicho pustej apki.
                // Działa dopiero odkąd nakładka nie jest usuwana z DOM.
                forceReauth(t('err.session'));
                return res;
            }
            return attempt();
        }


        // ── IKONY PUSTYCH EKRANÓW ─────────────────────────────────────────────
        //
        // Ekrany „nie ma jeszcze danych" miały do tej pory systemowe emotki, część
        // w rozmiarze 36–52 px: znak drogowy „roboty drogowe" przy brakującej
        // metryce, bateria przy braku check-inu, wykres przy pustych statystykach.
        // Emotka wygląda inaczej na każdym telefonie i na każdej wersji systemu —
        // czyli jedyny element, nad którym nie mamy kontroli, stał na środku
        // największego pustego miejsca w aplikacji.
        //
        // Rodzina jak ikony sztabu: siatka 24×24, sam obrys, zaokrąglone końce.
        // `velmIkona(nazwa, px, kolor)` zwraca gotowy SVG; kolor domyślnie
        // dziedziczony po rodzicu, żeby ta sama ikona działała na jasnym kafelku
        // i na ciemnej karcie.
        const VELM_IKONY = {
            // Klepsydra — „jeszcze nie ma", nie „coś się zepsuło"
            wkrotce:  '<path d="M7 3h10"/><path d="M7 21h10"/>' +
                      '<path d="M8 3v3.6c0 1.1.5 2.1 1.3 2.8L12 12l-2.7 2.6A3.7 3.7 0 0 0 8 17.4V21"/>' +
                      '<path d="M16 3v3.6c0 1.1-.5 2.1-1.3 2.8L12 12l2.7 2.6a3.7 3.7 0 0 1 1.3 2.8V21"/>',
            // Poranne słońce — brak check-inu to brak porannego zgłoszenia
            checkin:  '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.4"/><path d="M12 19v2.4"/>' +
                      '<path d="M4.4 4.4l1.7 1.7"/><path d="M17.9 17.9l1.7 1.7"/>' +
                      '<path d="M2.6 12H5"/><path d="M19 12h2.4"/>' +
                      '<path d="M4.4 19.6l1.7-1.7"/><path d="M17.9 6.1l1.7-1.7"/>',
            // Słupki — puste statystyki
            statystyki: '<path d="M4 3.6v14.9a1.9 1.9 0 0 0 1.9 1.9H20.4"/>' +
                      '<path d="M8.6 16.6v-4.2"/><path d="M12.6 16.6V8.4"/><path d="M16.6 16.6v-6.4"/>',
            // But biegowy w uproszczeniu — brak historii treningów
            historia: '<path d="M3.2 16.4h13.4a4.2 4.2 0 0 0 4.2-4.2c0-.8-.6-1.5-1.4-1.6l-4.2-.7a3 3 0 0 1-1.7-1L11 6.2a1.6 1.6 0 0 0-1.2-.6H6.4a1.6 1.6 0 0 0-1.6 1.6v2.4"/>' +
                      '<path d="M3.2 16.4v1.4a1.6 1.6 0 0 0 1.6 1.6h14.6"/><path d="M7.4 12.4l1.8 1.6"/><path d="M10.8 11.2l1.8 1.6"/>',
            // Księżyc — dzień bez treningu / plan wygasł
            odpoczynek: '<path d="M20.4 14.6A8.6 8.6 0 1 1 9.4 3.6a6.7 6.7 0 0 0 11 11z"/>',
            // Flaga mety — brak zaplanowanych zawodów
            zawody:   '<path d="M5.4 21V4"/><path d="M5.4 5.2h12.4l-2.4 3.8 2.4 3.8H5.4"/>',
            // Żarówka — podpowiedź od sztabu
            wskazowka:'<path d="M9.4 17.6h5.2"/><path d="M10.2 20.6h3.6"/>' +
                      '<path d="M12 2.8a6 6 0 0 0-3.5 10.9c.5.4.8 1 .9 1.6h5.2c.1-.6.4-1.2.9-1.6A6 6 0 0 0 12 2.8z"/>',
            // Kropka — awaryjna, gdy typ sesji jest nieznany
            nieznane: '<circle cx="12" cy="12" r="3.4"/>'
        };
        function velmIkona(nazwa, px, kolor) {
            const d = VELM_IKONY[nazwa];
            if (!d) return '';
            const r = px || 24;
            return '<svg width="' + r + '" height="' + r + '" viewBox="0 0 24 24" fill="none" '
                 + 'stroke="' + (kolor || 'currentColor') + '" stroke-width="1.7" '
                 + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
        }
