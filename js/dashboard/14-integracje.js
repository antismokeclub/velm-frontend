        // `el`, a nie `t` — lokalne `t` przesłaniałoby globalną funkcję tłumaczącą
        // t(), więc dopisanie tu kiedykolwiek t('klucz') wysypałoby się po cichu.
        // Ta sama klasa błędu co `const todayStr = todayStr()` w 18-dzis.js.
        function showVelmToast(msg, isError) {
            const el = document.createElement('div');
            el.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);' +
                'background:' + (isError ? '#C07264' : '#1A1A1A') + ';color:#fff;' +
                'padding:12px 24px;border-radius:14px;font-size:14px;font-weight:600;' +
                'z-index:9999;font-family:Inter,sans-serif;box-shadow:0 4px 20px rgba(0,0,0,0.2);';
            el.textContent = msg;
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 4000);
        }

        // ── STRAVA ───────────────────────────────────────────────
        async function loadStravaStatus() {
            const userId = localStorage.getItem('velm_user_id');
            const token = localStorage.getItem('velm_token');
            if (!userId || !token) return;

            try {
                const res = await authFetch('/api/strava/status/' + userId, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const data = await res.json();
                const pill = document.getElementById('strava-pill');
                const btn = document.getElementById('strava-btn');
                const WIFI = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 20 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>';
                const WIFIOFF = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.58 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>';

                if (data.connected) {
                    if (pill) pill.style.display = '';
                    if (btn) { btn.className = 'cx-btn on'; btn.onclick = stravaDisconnect; btn.innerHTML = WIFIOFF + t('conn.disconnect'); }
                } else {
                    if (pill) pill.style.display = 'none';
                    if (btn) { btn.className = 'cx-btn'; btn.onclick = stravaConnect; btn.innerHTML = WIFI + t('conn.connect'); }
                }
                _connStrava = !!data.connected;
                _renderConnCount();
            } catch (e) {
                const cnt = document.getElementById('conn-active-count');
                if (cnt) cnt.textContent = '—';
            }
        }

        // ── ZEGAREK (Health Connect / HealthKit) ──
        // W apce natywnej (Capacitor) most Health Connect czyta magazyn telefonu (Garmin/
        // Coros/Samsung/Apple) i wysyła do POST /api/health/sync. W PWA (przeglądarka) nie
        // ma dostępu do magazynu, więc kierujemy do apki mobilnej.
        //
        // DLACZEGO JEDNA INTEGRACJA NA PIĘĆ KAFELKÓW: Garmin, Coros, Polar i Samsung
        // synchronizują się do magazynu telefonu (Health Connect na Androidzie, Apple
        // Health na iOS). Czytamy z magazynu, więc omijamy pięć osobnych partnerskich
        // API — kafelki są tylko oznaczeniem marki, przycisk pod każdym jest ten sam.
        function _isNativeApp() {
            return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
        }

        // Wtyczka @capgo/capacitor-health rejestruje się natywnie pod nazwą "Health",
        // więc most Capacitora wystawia ją na window.Capacitor.Plugins. Sięgamy tam
        // wprost, bo js/dashboard to klasyczne skrypty — nie ma bundlera, który
        // rozwiązałby `import { Health } from '@capgo/capacitor-health'`.
        function _healthPlugin() {
            return (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Health) || null;
        }

        // Dokładnie te trzy typy przyjmuje POST /api/health/sync (hrv, resting_hr,
        // sleep_hours). Nie prosimy o nic ponad to — każde zbędne uprawnienie trzeba
        // osobno uzasadnić w deklaracji danych zdrowotnych w Google Play.
        const HEALTH_READ_TYPES = ['heartRateVariability', 'restingHeartRate', 'sleep'];
        const WATCH_AUTOSYNC_MS = 6 * 60 * 60 * 1000;

        function _avgRound(list) {
            if (!list.length) return null;
            return Math.round(list.reduce((a, b) => a + b, 0) / list.length);
        }

        // Surowe próbki z magazynu telefonu → wiersze {date, hrv, resting_hr, sleep_hours},
        // czyli dokładnie kształt, którego oczekuje backend. Wydzielone z synchronizacji,
        // żeby dało się to sprawdzić bez telefonu.
        function _healthEntries(hrvSamples, rhrSamples, sleepSamples) {
            const bucket = {};
            const at = (d) => (bucket[d] = bucket[d] || { hrv: [], rhr: [], sleepMin: 0 });

            // HRV i tętno spoczynkowe zegarek mierzy nad ranem, więc lokalna data
            // POCZĄTKU próbki to ten sam dzień, pod którym check-in zapisuje samopoczucie.
            // Data musi być lokalna, nie UTC — inaczej wpis ląduje pod innym dniem niż
            // flaga check-inu i powstaje dziura, którą widzą Laboratorium i agenci.
            for (const s of (hrvSamples || [])) {
                if (!s || !(s.value > 0)) continue;
                at(toDateStr(new Date(s.startDate))).hrv.push(s.value);
            }
            for (const s of (rhrSamples || [])) {
                if (!s || !(s.value > 0)) continue;
                at(toDateStr(new Date(s.startDate))).rhr.push(s.value);
            }

            const seen = new Set();
            for (const s of (sleepSamples || [])) {
                if (!s) continue;
                // Ta sama sesja snu potrafi wrócić więcej niż raz. platformId to
                // identyfikator rekordu w magazynie telefonu — bez odsiania duplikatów
                // doba zliczyłaby się podwójnie.
                if (s.platformId) {
                    if (seen.has(s.platformId)) continue;
                    seen.add(s.platformId);
                }
                // Sen liczymy do dnia PRZEBUDZENIA: noc z 23:40 na 6:20 to jedna
                // przespana noc widziana z porannego check-inu, a nie dwa pół-dni.
                const day = at(toDateStr(new Date(s.endDate || s.startDate)));
                if (Array.isArray(s.stages) && s.stages.length) {
                    for (const st of s.stages) {
                        if (!st || st.stage === 'awake') continue;
                        day.sleepMin += Number(st.durationMinutes) || 0;
                    }
                } else if (s.sleepState !== 'awake') {
                    day.sleepMin += Number(s.value) || 0;
                }
            }

            return Object.keys(bucket).sort().map((date) => {
                const b = bucket[date];
                const e = { date };
                const hrv = _avgRound(b.hrv);
                const rhr = _avgRound(b.rhr);
                if (hrv) e.hrv = hrv;
                if (rhr) e.resting_hr = rhr;
                // Ponad 24 h snu w dobie znaczy, że magazyn oddał nakładające się sesje
                // (zegarek i telefon zapisały tę samą noc osobno) — wtedy lepiej nie
                // zapisać nic niż wpisać bzdurę, na której agenci oprą plan.
                if (b.sleepMin > 0 && b.sleepMin <= 24 * 60) e.sleep_hours = Math.round(b.sleepMin / 6) / 10;
                return e;
            }).filter((e) => Object.keys(e).length > 1);   // sam `date` = nic do zapisania
        }

        async function _watchReadSamples(Health, dataType, range) {
            try {
                const r = await Health.readSamples(Object.assign({ dataType }, range));
                return (r && r.samples) || [];
            } catch (e) {
                // Brak zgody na JEDEN typ nie może wywalić całej synchronizacji — user
                // mógł odznaczyć sen w oknie Health Connect i wciąż chcieć HRV.
                console.warn('[zegarek] odczyt ' + dataType + ':', (e && e.message) || e);
                return [];
            }
        }

        async function _watchSync(days) {
            const Health = _healthPlugin();
            if (!Health) throw new Error('brak wtyczki Health');

            const end = new Date();
            const range = {
                startDate: new Date(end.getTime() - days * 86400000).toISOString(),
                endDate: end.toISOString(),
                limit: 1000,
                ascending: true
            };
            const [hrv, rhr, sleep] = await Promise.all([
                _watchReadSamples(Health, 'heartRateVariability', range),
                _watchReadSamples(Health, 'restingHeartRate', range),
                _watchReadSamples(Health, 'sleep', range)
            ]);

            const entries = _healthEntries(hrv, rhr, sleep);
            if (!entries.length) return { saved: 0, days: 0 };

            // Backend tnie do 60 wpisów na żądanie — wysyłamy najnowsze, bo to one
            // decydują o dzisiejszej formie.
            const res = await authFetch('/api/health/sync', {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({
                    userId: localStorage.getItem('velm_user_id'),
                    entries: entries.slice(-60)
                })
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.success) throw new Error(apiErr(data, 'int.watch.err'));

            localStorage.setItem('velm_watch_last_sync', String(Date.now()));
            return { saved: data.saved || 0, days: entries.length };
        }

        async function connectWatch() {
            if (!_isNativeApp()) {
                showVelmToast(t('int.watch.pwa'), false);
                return;
            }
            const Health = _healthPlugin();
            if (!Health) { showVelmToast(t('int.watch.err'), true); return; }

            try {
                const avail = await Health.isAvailable();
                if (!avail || !avail.available) {
                    // Android 14+ ma Health Connect z pudełka, wcześniejsze wersje wymagają
                    // doinstalowania — otwieramy ekran, na którym user to zrobi.
                    showVelmToast(t('int.watch.nohc'), true);
                    try { await Health.openHealthConnectSettings(); } catch (e) { /* brak ekranu na iOS */ }
                    return;
                }

                // requestHistoryAccess: bez tego uprawnienia Health Connect oddaje TYLKO
                // ostatnie 30 dni. Trend formy w Laboratorium potrzebuje dłuższego okna,
                // a odmowa nie jest błędem — schodzimy wtedy do 30 dni.
                const status = await Health.requestAuthorization({
                    read: HEALTH_READ_TYPES,
                    requestHistoryAccess: true
                });
                if (!status || !(status.readAuthorized || []).length) {
                    showVelmToast(t('int.watch.denied'), true);
                    return;
                }

                showVelmToast(t('int.watch.connecting'), false);
                const r = await _watchSync(status.historyAccessAuthorized ? 60 : 30);

                localStorage.setItem('velm_watch_connected', '1');
                _connWatch = true;
                _renderWatchStatus();
                showVelmToast(r.days ? tp('int.watch.synced', r.days) : t('int.watch.nodata'), false);
            } catch (e) {
                showVelmToast(t('int.watch.err'), true);
                console.error('[zegarek] połączenie:', e);
            }
        }

        // Cicha synchronizacja przy starcie apki — user nie ma klikać "Połącz" co rano.
        // Bez komunikatów: to tło, a nie akcja usera. Wołane z 21-start.js.
        async function watchAutoSync() {
            if (!_isNativeApp()) return;
            const Health = _healthPlugin();
            if (!Health) return;
            if (!localStorage.getItem('velm_user_id')) return;

            const last = Number(localStorage.getItem('velm_watch_last_sync') || 0);
            if (Date.now() - last < WATCH_AUTOSYNC_MS) return;

            try {
                // checkAuthorization NIE pokazuje okna zgody — w odróżnieniu od
                // requestAuthorization. Gdyby tu poszło request, apka wyskakiwałaby
                // z pytaniem o dane zdrowotne przy każdym otwarciu.
                const status = await Health.checkAuthorization({ read: HEALTH_READ_TYPES });
                if (!status || !(status.readAuthorized || []).length) return;
                await _watchSync(14);
                _connWatch = true;
                _renderWatchStatus();
            } catch (e) {
                console.warn('[zegarek] synchronizacja w tle:', (e && e.message) || e);
            }
        }

        // Stan połączeń trzymamy w dwóch flagach, bo licznik „N aktywnych" jest wspólny
        // dla Stravy i zegarka — wcześniej ustawiała go wyłącznie Strava, więc podłączony
        // zegarek pokazywał zero.
        let _connStrava = false;
        let _connWatch  = false;

        function _renderConnCount() {
            // Polar liczy się OSOBNO od zgody Health Connect — to dwa różne
            // połączenia i zawodnik może mieć jedno bez drugiego.
            const n = (_connStrava ? 1 : 0) + (_connWatch ? 1 : 0) + (_connPolar ? 1 : 0);
            const cnt  = document.getElementById('conn-active-count');
            const cdot = document.getElementById('conn-active-dot');
            if (cnt)  cnt.textContent = tp('conn.active', n);
            if (cdot) cdot.style.background = n ? '#22C55E' : '#D1D5DB';
        }

        function _renderWatchStatus() {
            document.querySelectorAll('.watch-pill').forEach(el => {
                el.style.display = _connWatch ? '' : 'none';
            });
            _renderConnCount();
        }

        // Wołane przy wejściu w „Połączenia" — pyta magazyn telefonu o realny stan zgód
        // zamiast wierzyć fladze w localStorage (user mógł cofnąć zgodę w ustawieniach
        // systemu, a apka o tym nie wie).
        async function loadWatchStatus() {
            _connWatch = false;
            if (_isNativeApp()) {
                const Health = _healthPlugin();
                if (Health) {
                    try {
                        const status = await Health.checkAuthorization({ read: HEALTH_READ_TYPES });
                        _connWatch = !!(status && (status.readAuthorized || []).length);
                    } catch (e) {
                        _connWatch = localStorage.getItem('velm_watch_connected') === '1';
                    }
                }
            }
            localStorage.setItem('velm_watch_connected', _connWatch ? '1' : '0');
            _renderWatchStatus();
        }
        async function stravaConnect() {
            const userId = localStorage.getItem('velm_user_id');
            const token = localStorage.getItem('velm_token');
            if (!userId || !token) return;
            try {
                const res = await authFetch('/api/strava/connect/' + userId, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const data = await res.json();
                if (!res.ok || !data.redirectUrl) {
                    alert(apiErr(data, 'int.strava.err'));
                    return;
                }
                window.location.href = data.redirectUrl;
            } catch (e) {
                alert(t('err.noserver'));
            }
        }

        async function stravaDisconnect() {
            if (!confirm(t('int.strava.disconnect'))) return;
            const userId = localStorage.getItem('velm_user_id');
            const token = localStorage.getItem('velm_token');
            try {
                await authFetch('/api/strava/disconnect/' + userId, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                loadStravaStatus();
            } catch (e) {
                alert(t('com.error') + ': ' + e.message);
            }
        }

        // ── POLAR ACCESSLINK ─────────────────────────────────────
        //
        // Jedyna marka poza Stravą z WŁASNYM logowaniem. Powód jest jeden:
        // Polar oddaje przez swoje API Nightly Recharge, czyli pomiar HRV
        // z nocy — 35% wagi w liczeniu gotowości. Health Connect tego nie
        // przenosi. Dla marek, które nie dokładają nic ponad telefon
        // (Samsung, COROS), świadomie zostajemy przy Health Connect.
        let _connPolar = false;

        // Czy serwer w ogóle ma klucze Polara. Bez POLAR_CLIENT_ID endpoint
        // /api/polar/connect oddaje 500 — a przycisk, który zawsze kończy się
        // błędem, jest gorszy niż przycisk wyłączony. Domyślnie false: jeśli
        // nie potwierdzimy kluczy, nie obiecujemy połączenia.
        let _polarSkonfigurowany = false;

        async function polarConnect() {
            const userId = localStorage.getItem('velm_user_id');
            const token = localStorage.getItem('velm_token');
            if (!userId || !token) return;
            try {
                const res = await authFetch('/api/polar/connect/' + userId, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const data = await res.json();
                if (!res.ok || !data.redirectUrl) { alert(apiErr(data, 'int.polar.err')); return; }
                window.location.href = data.redirectUrl;
            } catch (e) {
                alert(t('err.noserver'));
            }
        }

        async function polarDisconnect() {
            if (!confirm(t('int.polar.disconnect'))) return;
            const userId = localStorage.getItem('velm_user_id');
            const token = localStorage.getItem('velm_token');
            try {
                await authFetch('/api/polar/disconnect/' + userId, {
                    method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token }
                });
                loadPolarStatus();
            } catch (e) {
                alert(t('com.error') + ': ' + e.message);
            }
        }

        async function loadPolarStatus() {
            const userId = localStorage.getItem('velm_user_id');
            const token = localStorage.getItem('velm_token');
            const btn  = document.getElementById('polar-btn');
            const pill = document.getElementById('polar-pill');
            if (!userId || !token) return;
            try {
                const res = await authFetch('/api/polar/status/' + userId, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const data = await res.json();
                _connPolar = !!data.connected;
                _polarSkonfigurowany = data.configured === true;
            } catch (e) {
                _connPolar = false;   // brak odpowiedzi to nie jest „połączono"
                _polarSkonfigurowany = false;
            }
            if (pill) pill.style.display = _connPolar ? '' : 'none';
            if (btn) {
                // Odłączyć wolno ZAWSZE. Gdyby klucze zniknęły z serwera, zawodnik
                // i tak musi móc zdjąć połączenie, które już ma — inaczej zostaje
                // z kontem podpiętym na zawsze.
                const martwy = !_polarSkonfigurowany && !_connPolar;
                btn.className = _connPolar ? 'cx-btn on' : 'cx-btn';
                btn.disabled = martwy;
                btn.style.opacity = martwy ? '0.45' : '';
                btn.style.cursor = martwy ? 'default' : '';
                btn.onclick = martwy ? null : (_connPolar ? polarDisconnect : polarConnect);
                const etykieta = btn.querySelector('span');
                if (etykieta) etykieta.textContent =
                    t(martwy ? 'conn.soon' : (_connPolar ? 'conn.disconnect' : 'conn.connect'));
            }
            _renderConnCount();
        }

        // ── GARMIN .FIT IMPORT ───────────────────────────────────
        async function handleFitImport(event) {
            const file = event.target.files?.[0];
            if (!file) return;

            if (!file.name.toLowerCase().endsWith('.fit')) {
                showFitStatus(t('int.fit.onlyfit'), 'error');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                showFitStatus(t('int.fit.toobig'), 'error');
                return;
            }

            showFitStatus(t('int.fit.uploading'), 'loading');

            const formData = new FormData();
            formData.append('file', file);

            try {
                // authFetch podmienia WYŁĄCZNIE nagłówek Authorization i nie dotyka
                // Content-Type, więc FormData samo ustawia swój boundary. Dzięki temu
                // import .fit też odzyskuje po wygasłym tokenie zamiast padać na 401.
                const res = await authFetch(API_BASE + '/api/import/fit/' + currentUserId, {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();

                if (res.status === 409) {
                    showFitStatus(t('int.fit.exists.a') + ' ' + (data.existing?.date || '?') + ' ' + t('int.fit.exists.b') + ' (' + (data.existing?.distance_km || '?') + ' km)', 'warning');
                    return;
                }
                if (!res.ok || !data.success) {
                    showFitStatus((data.error || t('int.fit.err')), 'error');
                    return;
                }

                const p = data.parsed;
                const details = [
                    p.distance_km ? p.distance_km + ' km' : null,
                    p.duration_min ? p.duration_min + ' min' : null,
                    p.avg_pace ? t('int.pace') + ' ' + p.avg_pace + '/km' : null,
                    p.avg_hr ? 'HR ' + p.avg_hr + ' bpm' : null
                ].filter(Boolean).join(' · ');

                showFitStatus(t('int.fit.imported') + ' ' + p.date + '\n' + details, 'success');

                if (document.getElementById('view-history')?.classList.contains('active')) {
                    loadHistoryView();
                }
                event.target.value = '';

            } catch (e) {
                showFitStatus(t('com.err.conn') + ': ' + e.message, 'error');
            }
        }

        function showFitStatus(msg, type) {
            const el = document.getElementById('fit-import-status');
            if (!el) return;
            const styles = {
                loading: 'background:#F0EDE8;color:#8A8A8A;',
                success: 'background:#F0FDF4;color:#166534;',
                error:   'background:#FEF2F2;color:#991B1B;',
                warning: 'background:#FFFBEB;color:#92400E;'
            };
            el.style.cssText = (styles[type] || styles.loading) + 'display:block;font-size:13px;padding:10px 14px;border-radius:10px;white-space:pre-line;line-height:1.5;';
            el.textContent = msg;
            if (type !== 'loading') setTimeout(() => { el.style.display = 'none'; }, 5000);
        }

        async function changePassword() {
            const current = document.getElementById('settings-pwd-current')?.value;
            const newPwd  = document.getElementById('settings-pwd-new')?.value;
            const confirmPwd = document.getElementById('settings-pwd-confirm')?.value;
            if (!current || !newPwd) { showSettingsMsg('settings-pwd-msg', t('int.pwd.fillall'), true); return; }
            if (newPwd !== confirmPwd) { showSettingsMsg('settings-pwd-msg', t('int.pwd.mismatch'), true); return; }
            if (newPwd.length < 8) { showSettingsMsg('settings-pwd-msg', t('int.pwd.min'), true); return; }
            try {
                const res = await authFetch(`${API_BASE}/api/user/${currentUserId}/change-password`, {
                    method: 'POST', headers: authHeaders(),
                    body: JSON.stringify({ currentPassword: current, newPassword: newPwd })
                });
                const data = await res.json();
                if (!data.success) throw new Error(data.error);
                // Save new token pair — bumping token_version invalidated the old ones
                if (data.accessToken || data.token) localStorage.setItem('velm_token', data.accessToken || data.token);
                if (data.refreshToken) localStorage.setItem('velm_refresh_token', data.refreshToken);
                ['settings-pwd-current','settings-pwd-new','settings-pwd-confirm'].forEach(id => {
                    const el = document.getElementById(id); if(el) el.value = '';
                });
                showSettingsMsg('settings-pwd-msg', t('int.pwd.changed'));
            } catch(e) {
                showSettingsMsg('settings-pwd-msg', e.message, true);
            }
        }

        async function changeEmail() {
            const newEmail = document.getElementById('settings-new-email')?.value?.trim();
            const pwd = document.getElementById('settings-email-pwd')?.value;
            if (!newEmail || !pwd) { showSettingsMsg('settings-email-msg', t('int.email.fillboth'), true); return; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) { showSettingsMsg('settings-email-msg', t('int.email.invalid'), true); return; }
            try {
                const res = await authFetch(`${API_BASE}/api/user/${currentUserId}/change-email`, {
                    method: 'POST', headers: authHeaders(),
                    body: JSON.stringify({ currentPassword: pwd, newEmail })
                });
                const data = await res.json();
                if (!data.success) throw new Error(data.error);
                // Zmiana loginu unieważniła stare tokeny — zapisz świeże
                if (data.accessToken || data.token) localStorage.setItem('velm_token', data.accessToken || data.token);
                if (data.refreshToken) localStorage.setItem('velm_refresh_token', data.refreshToken);
                ['settings-new-email','settings-email-pwd'].forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
                showSettingsMsg('settings-email-msg', 'Email zmieniony');
                loadSettings();
            } catch(e) {
                showSettingsMsg('settings-email-msg', e.message, true);
            }
        }

        function showSettingsMsg(elementId, msg, isError) {
            const el = document.getElementById(elementId);
            if (!el) return;
            el.textContent = msg;
            el.style.color = isError ? '#C07264' : '#6B8F71';
            el.style.display = 'block';
            setTimeout(() => { el.style.display = 'none'; }, 3000);
        }

