        // --- State ---
        let currentUserId = localStorage.getItem('velm_user_id') || null;
        let selectedAgent = 'szef_sztabu';
        let userMaxHR = parseInt(localStorage.getItem('velm_maxHR') || '190');
        let userAge = parseInt(localStorage.getItem('velm_age') || '30');

        // --- Sleep Ring ---
        function getRecommendedSleep(age) {
            if (age < 6)  return 12;
            if (age < 14) return 10;
            if (age < 18) return 9;
            if (age < 26) return 8;
            if (age < 65) return 8;
            return 7.5;
        }

        function parseSleepHours(str) {
            const h = (str.match(/(\d+)h/) || [])[1] || 0;
            const m = (str.match(/(\d+)m/) || [])[1] || 0;
            return parseInt(h) + parseInt(m) / 60;
        }

        function updateSleepRing() {
            const arc    = document.getElementById('sleep-ring-arc');
            const pctEl  = document.getElementById('sleep-ring-pct');
            const timeEl = document.getElementById('sleep-ring-time');
            if (!arc || !pctEl || !timeEl) return;

            const sleepText  = document.getElementById('sleep-today')?.textContent || '7h 24m';
            const sleepH     = parseSleepHours(sleepText);
            const recommended = getRecommendedSleep(userAge);
            const pct        = Math.round((sleepH / recommended) * 100);
            const fillFrac   = Math.min(pct / 100, 1);

            // circumference = 2π × 50 ≈ 314.16
            const C = 2 * Math.PI * 50;
            arc.style.strokeDashoffset = C * (1 - fillFrac);

            // Color: matte status colors
            const ringColor = pct >= 85 ? '#6B8F71' : pct >= 60 ? '#C4A35A' : '#C07264';
            arc.setAttribute('stroke', ringColor);
            arc.removeAttribute('filter');

            timeEl.textContent = sleepText;
            pctEl.textContent  = pct + '%';
        }

        async function loadUserProfile() {
            if (!currentUserId) return;
            try {
                let res = await fetch(`${API_BASE}/api/user/${currentUserId}`, { headers: authHeaders() });
                // Wartownik sesji: 401 → spróbuj odświeżyć token i powtórz; jak dalej 401,
                // sesja jest martwa → pokaż logowanie (inaczej cała apka po cichu nie działa)
                if (res.status === 401) {
                    const nt = await refreshAccessToken();
                    if (nt) res = await fetch(`${API_BASE}/api/user/${currentUserId}`, { headers: authHeaders() });
                }
                if (res.status === 401) { forceReauth('Sesja wygasła — zaloguj się ponownie'); return; }
                const data = await res.json();
                const u = data?.user;
                // Onboarding globalnie — check-in musi wiedzieć, czy DZIŚ jest dzień
                // startu, a _settingsOnb zapełnia się dopiero po wejściu w ustawienia.
                window._userOnb = u?.onboarding_data ?? null;
                // dob_y przechowywane w onboarding_data, nie na poziomie wiersza
                const dob_y = u?.onboarding_data?.dob_y ?? u?.dob_y;
                if (dob_y) {
                    const age = new Date().getFullYear() - parseInt(dob_y);
                    userMaxHR = age > 0 ? (220 - age) : 190;
                    userAge = age;
                    localStorage.setItem('velm_maxHR', String(userMaxHR));
                    localStorage.setItem('velm_age', String(age));
                }
                const avatarEl = document.getElementById('user-avatar-initials');
                if (avatarEl && u) {
                    const name = u.onboarding_data?.name || u.name || '';
                    avatarEl.textContent = name ? name.charAt(0).toUpperCase() : '?';
                }
                // Język całej apki z profilu (żeby UI zmieniło się na wybrany język od razu na starcie)
                if (u?.onboarding_data?.language) setAppLanguage(u.onboarding_data.language);
                // Email verification banner — only if user has email_verified=false (column may not exist on legacy rows → undefined; treat undefined as verified)
                if (u && u.email_verified === false) {
                    showEmailVerifyBanner(u.email);
                } else {
                    hideEmailVerifyBanner();
                }
            } catch(e) { /* zostaje domyślne 190 */ }
            updateSleepRing();
            loadReadinessDelta();
            loadSleepFromAPI();
            loadRestingHRFromAPI();
        }

        function showEmailVerifyBanner(email) {
            if (document.getElementById('email-verify-banner')) return;
            if (sessionStorage.getItem('velm_email_verify_dismissed') === '1') return;
            const banner = document.createElement('div');
            banner.id = 'email-verify-banner';
            banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#FFF7ED;border-bottom:1px solid #FED7AA;color:#9A3412;padding:10px 16px;font-size:13px;font-weight:500;z-index:9998;display:flex;align-items:center;gap:12px;font-family:Inter,sans-serif;';
            banner.innerHTML = `
                <span style="flex:1;line-height:1.4;">Potwierdź adres email <strong style="font-weight:600;">${(email || '').replace(/[<>"']/g, '')}</strong> żeby aktywować konto.</span>
                <button id="email-verify-resend-btn" style="background:#1A1A1A;color:#fff;border:none;padding:6px 14px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">Wyślij link</button>
                <button id="email-verify-dismiss-btn" style="background:none;border:none;color:#9A3412;font-size:18px;cursor:pointer;padding:0 4px;line-height:1;" aria-label="Zamknij">&times;</button>`;
            document.body.appendChild(banner);
            document.getElementById('email-verify-resend-btn').onclick = async () => {
                const btn = document.getElementById('email-verify-resend-btn');
                btn.disabled = true; btn.textContent = '…';
                try {
                    const res = await fetch(`${API_BASE}/api/email/send-verification`, { method: 'POST', headers: authHeaders() });
                    const data = await res.json().catch(() => ({}));
                    if (res.ok) {
                        btn.textContent = 'Wysłano ✓';
                        setTimeout(() => hideEmailVerifyBanner(), 2500);
                    } else {
                        btn.textContent = 'Błąd';
                        btn.disabled = false;
                        console.warn('verify resend błąd:', data);
                    }
                } catch (e) {
                    btn.textContent = 'Błąd';
                    btn.disabled = false;
                }
            };
            document.getElementById('email-verify-dismiss-btn').onclick = () => {
                sessionStorage.setItem('velm_email_verify_dismissed', '1');
                hideEmailVerifyBanner();
            };
        }

        function hideEmailVerifyBanner() {
            const el = document.getElementById('email-verify-banner');
            if (el) el.remove();
        }

        async function loadSleepFromAPI() {
            if (!currentUserId) return;
            try {
                const res = await fetch(`${API_BASE}/api/health/${currentUserId}?type=sleep&days=1`, { headers: authHeaders() });
                const data = await res.json();
                const metrics = data?.metrics;
                if (!metrics?.length) return;
                const latest = metrics[metrics.length - 1];
                const score = Math.round((latest.value ?? 0) / 20); // value=score*20
                const sleepTimes = [null, '5h 0m', '6h 0m', '7h 0m', '7h 45m', '8h 30m'];
                const timeStr = sleepTimes[score] || null;
                if (!timeStr) return;
                const el = document.getElementById('sleep-today');
                if (el) { el.textContent = timeStr; updateSleepRing(); }
            } catch(e) { /* zostaje domyślne */ }
        }

        async function loadRestingHRFromAPI() {
            if (!currentUserId) return;
            try {
                const res = await fetch(`${API_BASE}/api/health/${currentUserId}?type=hr&days=7`, { headers: authHeaders() });
                const data = await res.json();
                const metrics = data?.metrics;
                if (!metrics?.length) return;
                const latest = metrics[metrics.length - 1];
                const bpm = Math.round(latest.value);
                if (!bpm || bpm <= 0) return;
                const el = document.getElementById('home-resting-hr-value');
                if (el) el.textContent = bpm;
            } catch(e) { /* zostaje domyślne */ }
        }

        async function loadReadinessDelta() {
            if (!currentUserId) return;
            try {
                const res = await fetch(`${API_BASE}/api/health/${currentUserId}?type=readiness&days=2`, { headers: authHeaders() });
                const data = await res.json();
                const metrics = data?.metrics;
                if (!metrics || metrics.length === 0) return;
                const today = Math.round(metrics[metrics.length - 1].value);
                updateReadiness(today);
                const deltaEl = document.getElementById('readiness-delta');
                if (!deltaEl) return;
                if (metrics.length >= 2) {
                    const yesterday = Math.round(metrics[metrics.length - 2].value);
                    const diff = today - yesterday;
                    if (diff > 0) {
                        deltaEl.textContent = `+${diff}% vs wczoraj`;
                        deltaEl.style.color = '#6B8F71';
                    } else if (diff < 0) {
                        deltaEl.textContent = `${diff}% vs wczoraj`;
                        deltaEl.style.color = '#C07264';
                    } else {
                        deltaEl.textContent = `0% vs wczoraj`;
                        deltaEl.style.color = '#8A8A8A';
                    }
                }
            } catch(e) {}
        }

