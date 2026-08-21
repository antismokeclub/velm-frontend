        // Init
        // --- Login logic ---
        function isLocalHostLike(hostname) {
            if (!hostname) return true;
            if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') return true;
            if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true;
            if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true;
            return /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname);
        }

        const API_BASE = isLocalHostLike(window.location.hostname)
            ? 'http://' + (window.location.hostname || 'localhost') + ':3000'
            : 'https://velm-backend-production.up.railway.app';
        window.API_BASE = API_BASE;

        // Stempel buildu â€” dowĂłd na urzÄ…dzeniu, ĹĽe dziaĹ‚a Ĺ›wieĹĽy kod (trzymaÄ‡
        // w zgodzie z CACHE_VERSION w sw.js; bump przy kaĹĽdym deployu frontendu)
        const VELM_BUILD = 'v102';
        console.log('velm build', VELM_BUILD, navigator.userAgent);

        async function hardReloadApp() {
            try {
                if ('serviceWorker' in navigator) {
                    const regs = await navigator.serviceWorker.getRegistrations();
                    await Promise.all(regs.map((reg) => reg.unregister()));
                }
                if ('caches' in window) {
                    const keys = await caches.keys();
                    await Promise.all(keys.map((key) => caches.delete(key)));
                }
            } catch (e) {
                console.warn('[velm] hard reload cleanup failed:', e);
            }

            const url = new URL(window.location.href);
            url.searchParams.set('_r', Date.now().toString());
            window.location.replace(url.toString());
        }

        async function doLogin() {
            const emailEl = document.getElementById('login-email');
            const pwdEl   = document.getElementById('login-password');
            const errEl   = document.getElementById('login-error');
            const btn     = document.getElementById('login-btn');
            const email   = emailEl.value.trim();
            const password = pwdEl.value;
            errEl.textContent = '';

            if (!email || !email.includes('@')) {
                errEl.textContent = t('acc.login.email.err');
                emailEl.focus();
                return;
            }
            if (!password) {
                errEl.textContent = t('acc.login.pwd.err');
                pwdEl.focus();
                return;
            }

            btn.disabled = true;
            btn.textContent = t('login.progress');

            try {
                const res  = await fetch(`${API_BASE}/api/login`, {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify({ email, password })
                });
                const data = await res.json();

                if (!res.ok || !data.success) {
                    errEl.textContent = apiErr(data, 'acc.login.err');
                    btn.disabled = false;
                    btn.textContent = t('login.title');
                    return;
                }

                // Hard reload so all in-memory state (chat history, plan, workouts,
                // selected agent, etc.) is fully reset for the new user. Prevents
                // user B from seeing user A's data when login happens after a
                // session expiry without page navigation.
                localStorage.setItem('velm_user_id', data.userId);
                if (data.accessToken || data.token) localStorage.setItem('velm_token', data.accessToken || data.token);
                if (data.refreshToken) localStorage.setItem('velm_refresh_token', data.refreshToken);
                if (data.name) localStorage.setItem('velm_user_name', data.name);
                await hardReloadApp();
                return;
            } catch (e) {
                const msg = e?.name === 'AbortError'
                    ? t('acc.login.timeout')
                    : `${t('com.err.conn')}: ${e?.message || 'API unreachable'}`;
                errEl.textContent = msg;
                btn.disabled = false;
                btn.textContent = t('login.title');
            }
        }

        // â”€â”€ PASSWORD RESET MODAL (gdy user przyszedĹ‚ z linku w mailu) â”€â”€â”€â”€â”€
        function openPasswordResetModal(token) {
            const existing = document.getElementById('pwd-reset-modal');
            if (existing) existing.remove();
            const modal = document.createElement('div');
            modal.id = 'pwd-reset-modal';
            modal.style.cssText = 'position:fixed;top:0;right:0;bottom:0;left:0;background:rgba(0,0,0,0.55);z-index:99999;display:flex;align-items:center;justify-content:center;padding:24px;font-family:Inter,sans-serif;';
            modal.innerHTML = `
                <div style="background:#fff;border-radius:20px;padding:32px 26px;max-width:380px;width:100%;box-shadow:0 8px 40px rgba(0,0,0,0.18);">
                  <h2 style="margin:0 0 8px 0;font-size:20px;font-weight:700;color:#1A1A1A;">${t('acc.reset.title')}</h2>
                  <p style="margin:0 0 20px 0;font-size:13.5px;color:#5A5A5A;line-height:1.5;">${t('acc.reset.desc')}</p>
                  <input id="pwd-reset-new" type="password" placeholder="${t('acc.reset.new.ph')}" autocomplete="new-password" style="width:100%;height:48px;border:1.5px solid #EBEBEB;border-radius:12px;padding:0 16px;font-size:15px;margin-bottom:10px;box-sizing:border-box;font-family:inherit;"/>
                  <input id="pwd-reset-new2" type="password" placeholder="${t('acc.reset.rep.ph')}" autocomplete="new-password" style="width:100%;height:48px;border:1.5px solid #EBEBEB;border-radius:12px;padding:0 16px;font-size:15px;margin-bottom:14px;box-sizing:border-box;font-family:inherit;"/>
                  <div id="pwd-reset-err" style="color:#C07264;font-size:13px;min-height:16px;margin-bottom:10px;line-height:1.4;"></div>
                  <button id="pwd-reset-btn" style="width:100%;height:48px;background:#1A1A1A;color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;">${t('acc.reset.save')}</button>
                  <button id="pwd-reset-cancel" style="width:100%;height:40px;background:none;border:none;color:#8A8A8A;font-size:13px;margin-top:8px;cursor:pointer;font-family:inherit;">${t('com.cancel')}</button>
                </div>`;
            document.body.appendChild(modal);
            const btn = document.getElementById('pwd-reset-btn');
            const err = document.getElementById('pwd-reset-err');
            const p1 = document.getElementById('pwd-reset-new');
            const p2 = document.getElementById('pwd-reset-new2');
            p1.focus();
            const submit = async () => {
                err.textContent = '';
                if (!p1.value || p1.value.length < 8) { err.textContent = t('acc.reset.min'); return; }
                if (p1.value !== p2.value) { err.textContent = t('int.pwd.mismatch'); return; }
                btn.disabled = true; btn.textContent = 'â€¦';
                try {
                    const res = await fetch(`${API_BASE}/api/password-reset/verify`, {
                        method: 'POST', headers: {'Content-Type':'application/json'},
                        body: JSON.stringify({ token, newPassword: p1.value })
                    });
                    let data = {};
                    try { data = await res.json(); } catch(e) {}
                    if (!res.ok) {
                        err.textContent = apiErr(data, 'err.server');
                        btn.disabled = false; btn.textContent = t('acc.reset.save');
                        return;
                    }
                    // WyczyĹ›Ä‡ lokalnÄ… sesjÄ™ i wyrzuÄ‡ na index z toastem
                    localStorage.removeItem('velm_token');
                    localStorage.removeItem('velm_user_id');
                    localStorage.removeItem('velm_user_name');
                    modal.remove();
                    alert(t('acc.reset.done'));
                    window.location.href = 'index.html';
                } catch (e) {
                    err.textContent = t('err.noserver');
                    btn.disabled = false; btn.textContent = t('acc.reset.save');
                }
            };
            btn.onclick = submit;
            p2.onkeydown = (e) => { if (e.key === 'Enter') submit(); };
            document.getElementById('pwd-reset-cancel').onclick = () => modal.remove();
        }

        async function doLogout() {
            if (!confirm(t('acc.logout.confirm'))) return;
            // Best-effort backend invalidation (bumps token_version) â€” never block logout on failure
            try {
                await authFetch(`${API_BASE}/api/logout`, { method: 'POST', headers: authHeaders() });
            } catch (e) { /* network down â€” local cleanup still happens */ }
            localStorage.removeItem('velm_user_id');
            localStorage.removeItem('velm_user_name');
            localStorage.removeItem('velm_token');
            localStorage.removeItem('velm_refresh_token');
            _chatHistoryLoaded = {};
            window.location.href = 'index.html';
        }

        async function exportMyData() {
            const btn = document.getElementById('export-data-btn');
            if (!btn) return;
            const orig = btn.textContent;
            btn.disabled = true;
            btn.textContent = t('com.downloading');
            try {
                const res = await authFetch(`${API_BASE}/api/user/${currentUserId}/export`, {
                    headers: authHeaders()
                });
                if (!res.ok) throw new Error(t('err.server'));
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `velm-export-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
                btn.textContent = t('acc.export.done') + ' âś“';
                setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 2000);
            } catch (e) {
                btn.textContent = t('acc.export.err');
                setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 2500);
            }
        }

        async function deleteAccount() {
            const ok = confirm(t('acc.delete.confirm'));
            if (!ok) return;
            const password = prompt(t('acc.delete.pwd'));
            if (password === null) return;
            try {
                const res = await authFetch(`${API_BASE}/api/user/${currentUserId}`, {
                    method: 'DELETE',
                    headers: authHeaders(),
                    body: JSON.stringify({ password })
                });
                let data = {};
                try { data = await res.json(); } catch (e) {}
                if (!res.ok) {
                    alert(apiErr(data, 'err.server') + ` (${res.status})`);
                    return;
                }
                alert(t('acc.delete.done'));
                localStorage.clear();
                window.location.href = 'index.html';
            } catch (e) {
                alert(t('acc.delete.err'));
                console.error('deleteAccount:', e);
            }
        }

        // â”€â”€ CHECK-IN REDIRECT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        /** Dzisiejsza data w strefie UĹ»YTKOWNIKA. Jedyne ĹşrĂłdĹ‚o prawdy dla "dziĹ›".
            NIE toISOString() â€” to UTC: w Los Angeles bieg o 18:00 dostawaĹ‚ datÄ™
            jutrzejszÄ…, nie pasowaĹ‚ do dnia planu, a flaga check-inu ustawiona na
            jutro blokowaĹ‚a check-in nazajutrz. */
        function todayStr() {
            return toDateStr(new Date());
        }

        function checkAndRedirectCheckin() {
            if (!currentUserId) return;
            const today = todayStr();
            const morningDone = localStorage.getItem('velm_checkin_morning_done');
            if (morningDone !== today) {
                openCheckin('morning');
            }
        }

        function updatePostCheckinBanner() {
            const banner = document.getElementById('post-checkin-banner');
            if (!banner) return;
            const hour     = new Date().getHours();
            const postDone = localStorage.getItem('velm_checkin_post_done');
            const today    = todayStr();
            const hasWorkout = window._todayTyp && window._todayTyp !== 'rest';

            if (hour >= 7 && postDone !== today && hasWorkout) {
                const link = banner.querySelector('div[onclick]');
                if (link) link.setAttribute('onclick', `openCheckin('post','${window._todayTyp}',${window._todayKm ?? 'null'})`);
                banner.style.display = 'block';
            } else {
                banner.style.display = 'none';
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            // Check if came from onboarding
            const urlParams = new URLSearchParams(window.location.search);
            const newUser = urlParams.get('userId');
            if (newUser) {
                currentUserId = newUser;
                localStorage.setItem('velm_user_id', newUser);
            }

            // Strava OAuth callback
            const stravaResult = urlParams.get('strava');
            if (stravaResult === 'connected') {
                // User connected â€” clear skip counter and remember connected state
                localStorage.setItem('velm_strava_connected', '1');
                localStorage.removeItem('velm_strava_skip_count');
                switchView('settings');
                setTimeout(() => {
                    const msg = document.createElement('div');
                    msg.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#1A1A1A;color:#fff;padding:12px 24px;border-radius:14px;font-size:14px;font-weight:600;z-index:9999;font-family:Inter,sans-serif;';
                    msg.textContent = t('acc.strava.ok');
                    document.body.appendChild(msg);
                    setTimeout(() => msg.remove(), 4000);
                }, 500);
                // Clean URL
                history.replaceState({}, '', window.location.pathname);
            } else if (stravaResult === 'error') {
                const reason = urlParams.get('reason') || 'unknown';
                switchView('settings');
                setTimeout(() => {
                    const msg = document.createElement('div');
                    msg.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#C07264;color:#fff;padding:12px 24px;border-radius:14px;font-size:14px;font-weight:600;z-index:9999;font-family:Inter,sans-serif;';
                    msg.textContent = t('acc.strava.err') + ' (' + reason + ')';
                    document.body.appendChild(msg);
                    setTimeout(() => msg.remove(), 5000);
                }, 500);
                history.replaceState({}, '', window.location.pathname);
            }

            // Password reset link from email
            const resetToken = urlParams.get('reset_token');
            if (resetToken) {
                openPasswordResetModal(resetToken);
                history.replaceState({}, '', window.location.pathname);
            }

            // Email verification result (from /api/email/verify redirect)
            const verifiedResult = urlParams.get('email_verified');
            if (verifiedResult) {
                const map = {
                    ok: { msg: t('acc.verify.ok'), err: false },
                    already: { msg: t('acc.verify.already'), err: false },
                    expired: { msg: t('acc.verify.expired'), err: true },
                    invalid: { msg: t('acc.verify.invalid'), err: true },
                    missing: { msg: t('acc.verify.missing'), err: true },
                    error: { msg: t('acc.verify.err'), err: true }
                };
                const r = map[verifiedResult] || map.error;
                setTimeout(() => showVelmToast(r.msg, r.err), 800);
                history.replaceState({}, '', window.location.pathname);
            }

            // Stripe Checkout callback
            const subResult = urlParams.get('subscription');
            if (subResult === 'success') {
                history.replaceState({}, '', window.location.pathname);
                switchView('settings');
                setTimeout(() => {
                    showVelmToast(t('acc.sub.welcome'));
                    loadSubscriptionStatus();
                }, 1000);
            } else if (subResult === 'cancelled') {
                history.replaceState({}, '', window.location.pathname);
                showVelmToast(t('acc.sub.cancelled'), true);
            }

            // Nakładka logowania startuje UKRYTA (class="hidden" w markupie) i tylko
            // ją odsłaniamy, gdy logowanie jest naprawdę potrzebne.
            // Wcześniej było overlay.remove(), co miało dwie wady: (1) usuwało element
            // z DOM, więc forceReauth() i ścieżka 401 w 01-core.js robiły
            // classList.remove('hidden') na czymś, czego już nie ma — po wygaśnięciu
            // sesji apka cicho umierała zamiast poprosić o zalogowanie;
            // (2) nie dało się tego odwrócić bez przeładowania strony.
            const overlay = document.getElementById('login-overlay');
            if (!currentUserId) {
                if (overlay) overlay.classList.remove('hidden');
                setTimeout(() => document.getElementById('login-email')?.focus(), 100);
            } else if (overlay) {
                overlay.classList.add('hidden');   // idempotentne — markup już to ma
            }

            applyI18n();   // natychmiast podmieĹ„ statyczny UI (nawigacja, nagĹ‚Ăłwki) na zapamiÄ™tany jÄ™zyk
            document.documentElement.setAttribute('lang', _appLang);
            updateGreeting();
            // NagĹ‚Ăłwek czatu i karty propozycji buduje JS (per agent), wiÄ™c nie majÄ…
            // data-i18n â€” trzeba je przerysowaÄ‡, inaczej do 1. wyboru agenta zostaje polski.
            try { _refreshCoachUi(); } catch(e) {}
            updateDate();
            startHeartAnimation();

            // Initial Rolling Counters
            const tickers = document.querySelectorAll('.ticker');
            tickers.forEach(t => initPremiumCounter(t));

            // Dane ładujemy DOPIERO po upewnieniu się, że access token jest świeży.
            // Wcześniej wszystkie żądania startowe leciały równolegle ze starym
            // tokenem, dostawały 401 i — poza nielicznymi na apiFetch — nikt ich
            // nie ponawiał: karta „dziś" pokazywała „Brak połączenia z serwerem",
            // a subskrypcja spadała do nie-premium, więc płacący user widział paywall.
            //
            // switchView('home') jest TUTAJ, nie wyżej, bo samo woła loadTodayCard,
            // updateRaceCountdown, loadPlanChanges i loadStreak (09-nawigacja.js:47-55).
            // Wywołane przed odświeżeniem tokenu było źródłem czterech pewnych 401.
            // Widok domowy i tak jest aktywny z markupu (`class="view active"`),
            // więc przesunięcie nie powoduje pustego ekranu.
            ensureFreshToken().then(() => {
                switchView('home');
                loadUserMemory();
                loadUserProfile();
                loadSubscriptionStatus();
                // Narada (brak planu / plan wygasł) lub okno powrotne ma priorytet nad
                // porannym check-inem — poranny otwieramy dopiero gdy narada niczego nie przejęła.
                return checkWeeklyNarada()
                    .then((tookOver) => { if (!tookOver) checkAndRedirectCheckin(); })
                    .catch(() => checkAndRedirectCheckin());
            });


            // Header Scroll Effect
            const viewContent = document.getElementById('view-content');
            const header = document.getElementById('app-header');
            if (viewContent && header) {
                viewContent.addEventListener('scroll', () => {
                    if (viewContent.scrollTop > 10) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                });
            }
        });


        // --- Heartbeat Logic ---
        function startHeartAnimation() {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            // 1. Thump-Thump Timeline
            const beatTl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });

            beatTl.to(".main-heart", {
                scale: 1.25,
                duration: 0.15,
                ease: "power2.out"
            }, "beat")
                .to(".main-heart", {
                    scale: 1,
                    duration: 0.2,
                    ease: "power3.in"
                })
                .to(".main-heart", {
                    scale: 1.15,
                    duration: 0.12,
                    ease: "power2.out"
                }, "+=0.05")
                .to(".main-heart", {
                    scale: 1,
                    duration: 0.25,
                    ease: "power3.inOut"
                });
        }

        // --- The Grinder Runner (Pro Jointed Edition) ---
        // USUNIĘTE (2026-08-11): IIFE „Page Init", które robiło startHeartAnimation(),
        // liczniki i switchView('home') — czyli DOKŁADNIE to samo, co handler
        // DOMContentLoaded kilkaset linii wyżej. Skutek był dotkliwszy niż podwójna
        // animacja: switchView('home') sam woła loadTodayCard/loadPlanChanges/
        // loadStreak/updateRaceCountdown (09-nawigacja.js:47-55), więc CAŁY start
        // wykonywał się dwa razy — zmierzone w sondzie jako dwie identyczne serie
        // żądań. Przy wygasłym tokenie dawało to podwójny szturm 401 i widoczne
        // „przeskakiwanie" ekranu, bo dane renderowały się dwukrotnie.
        // Ten plik jest wstawiany przez parser na końcu <body>, więc w chwili jego
        // wykonania document.readyState === 'loading' i DOMContentLoaded na pewno
        // jeszcze się nie odpalił — nie potrzeba tu żadnej siatki bezpieczeństwa.

