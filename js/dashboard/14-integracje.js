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
                const res = await fetch(API_BASE + '/api/strava/status/' + userId, {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const data = await res.json();
                const pill = document.getElementById('strava-pill');
                const btn = document.getElementById('strava-btn');
                const cnt = document.getElementById('conn-active-count');
                const cdot = document.getElementById('conn-active-dot');
                const WIFI = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 20 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>';
                const WIFIOFF = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.58 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>';

                if (data.connected) {
                    if (pill) pill.style.display = '';
                    if (btn) { btn.className = 'cx-btn on'; btn.onclick = stravaDisconnect; btn.innerHTML = WIFIOFF + t('conn.disconnect'); }
                    if (cnt) cnt.textContent = tp('conn.active', 1);
                    if (cdot) cdot.style.background = '#22C55E';
                } else {
                    if (pill) pill.style.display = 'none';
                    if (btn) { btn.className = 'cx-btn'; btn.onclick = stravaConnect; btn.innerHTML = WIFI + t('conn.connect'); }
                    if (cnt) cnt.textContent = tp('conn.active', 0);
                    if (cdot) cdot.style.background = '#D1D5DB';
                }
            } catch (e) {
                const cnt = document.getElementById('conn-active-count');
                if (cnt) cnt.textContent = '—';
            }
        }

        // ── ZEGAREK (Health Connect / HealthKit) ──
        // W apce natywnej (Capacitor) most Health Connect czyta magazyn telefonu (Garmin/
        // Coros/Samsung/Apple) i wysyła do POST /api/health/sync. W PWA (przeglądarka) nie
        // ma dostępu do magazynu, więc kierujemy do apki mobilnej.
        function _isNativeApp() {
            return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
        }
        function connectWatch() {
            if (!_isNativeApp()) {
                showVelmToast(t('int.watch.pwa'), false);
                return;
            }
            // TODO(native build): most do Health Connect —
            // window.HealthConnect.requestPermissions([...]) → odczyt → POST /api/health/sync
            showVelmToast(t('int.watch.connecting'), false);
        }
        async function stravaConnect() {
            const userId = localStorage.getItem('velm_user_id');
            const token = localStorage.getItem('velm_token');
            if (!userId || !token) return;
            try {
                const res = await fetch(API_BASE + '/api/strava/connect/' + userId, {
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
                await fetch(API_BASE + '/api/strava/disconnect/' + userId, {
                    method: 'DELETE',
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                loadStravaStatus();
            } catch (e) {
                alert(t('com.error') + ': ' + e.message);
            }
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

