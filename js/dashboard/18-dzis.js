        // --- Theme — Cal AI: czarno-biały, bez kolorowych akcentów ---
        function applyTheme(name) {
            const r = document.documentElement;
            r.style.setProperty('--primary-color', '#1A1A1A');
            r.style.setProperty('--accent-color',  '#1A1A1A');
            r.style.setProperty('--surface-alt',   '#F0EDE8');
            r.style.setProperty('--text-secondary', '#8A8A8A');
            document.body.setAttribute('data-theme', 'cal');
            // Kolory treningowe — stałe, niezależne od tematu
            TYPE_COLORS.easy     = '#6B8F71';  // sage — regeneracja
            TYPE_COLORS.walkrun  = '#8BA896';  // light sage
            TYPE_COLORS.long     = '#7B98B0';  // steel — długi
            TYPE_COLORS.cross    = '#7B98B0';  // steel
            TYPE_COLORS.tempo    = '#C4A35A';  // amber — tempo
            TYPE_COLORS.interval = '#C07264';  // terracotta — interwały
            TYPE_COLORS.rest     = '#E5E5E5';  // ash — odpoczynek
        }

        applyTheme('cal');

        const INTENSITY_MAP = {
            easy:     { label: 'Niska',         pct: 22 },
            walkrun:  { label: 'Niska',         pct: 22 },
            cross:    { label: 'Umiarkowana',   pct: 50 },
            long:     { label: 'Umiarkowana',   pct: 55 },
            tempo:    { label: 'Wysoka',        pct: 78 },
            interval: { label: 'Maks',          pct: 100 },
        };
        const HR_ZONE_MAP = {
            easy:     { zone: 'Zone 2',    lo: 0.60, hi: 0.70 },
            walkrun:  { zone: 'Zone 1–2',  lo: 0.55, hi: 0.65 },
            long:     { zone: 'Zone 2–3',  lo: 0.65, hi: 0.75 },
            cross:    { zone: 'Zone 2',    lo: 0.60, hi: 0.70 },
            tempo:    { zone: 'Zone 3–4',  lo: 0.75, hi: 0.87 },
            interval: { zone: 'Zone 4–5',  lo: 0.85, hi: 0.95 },
        };

        function _fillTodayCard(dni) {
            const nameEl   = document.getElementById('home-main-workout-name');
            const badgeEl  = document.getElementById('home-main-workout-badge');
            const descEl   = document.getElementById('home-main-workout-desc');
            const mainCard = document.getElementById('home-main-workout-card');
            const tileDist = document.getElementById('home-tile-dist');
            const tilePace = document.getElementById('home-tile-pace');
            const tileInt  = document.getElementById('home-tile-intensity');
            const tileIntF = document.getElementById('home-tile-intensity-fill');
            const tileZone = document.getElementById('home-tile-hrzone');
            const tileBpm  = document.getElementById('home-tile-hrbpm');
            // Domyślnie kafelek prowadzi do kalendarza; stany "brak/wygasły plan" nadpiszą to niżej.
            if (mainCard) mainCard.onclick = () => switchView('calendar');

            if (!dni?.length) {
                if (nameEl) nameEl.textContent = t('today.noplan');
                if (mainCard) mainCard.onclick = (e) => { e.stopPropagation(); generateNewPlan(); };
                return;
            }

            // NIE `const todayStr = todayStr()` — taka deklaracja tworzy LOKALNE
            // wiązanie przesłaniające globalną funkcję todayStr() (19-konto.js),
            // a inicjalizator woła już to lokalne, będące w martwej strefie (TDZ).
            // Efekt: ReferenceException przy KAŻDYM wywołaniu _fillTodayCard, który
            // wspólny catch w loadTodayCard pokazywał jako „Brak połączenia
            // z serwerem" — mimo w pełni sprawnego serwera.
            const todayIso = todayStr();
            let day = dni.find(d => d.data === todayIso);
            if (!day) {
                // Plan, którego tydzień już się skończył (dziś jest PO ostatnim
                // dniu planu) — NIE zgadujemy losowego dnia z przeszłości jako
                // "dzisiejszego" (to właśnie pokazywało np. "10 km" sprzed
                // tygodnia). Mówimy wprost, że czekamy na naradę.
                const lastDay = dni[dni.length - 1]?.data;
                if (lastDay && todayIso > lastDay) {
                    window._todayTyp = 'rest'; window._todayKm = 0; window._todayStruktura = null;
                    if (nameEl)  nameEl.textContent = t('today.planexpired');
                    if (badgeEl) badgeEl.textContent = '🌙';
                    // Awaryjny ręczny spust narady (gdyby auto-narada nie ruszyła) — kafelek
                    // staje się przyciskiem generującym nowy plan (niezamykalne okno narady).
                    if (mainCard) mainCard.onclick = (e) => { e.stopPropagation(); generateNewPlan(); };
                    updatePostCheckinBanner();
                    return;
                }
                // Wciąż w obrębie tygodnia planu, ale bez dokładnego dopasowania
                // (np. luka w danych) — fallback jak dotychczas
                day = dni.find(d => d.typ !== 'rest') ?? dni[0];
            }

            if (!day || day.typ === 'rest') {
                window._todayTyp = 'rest';
                window._todayKm  = 0;
                window._todayStruktura = null;
                if (nameEl)  nameEl.textContent = t('wtype.rest');
                if (badgeEl) badgeEl.textContent = '🌙';
                updatePostCheckinBanner();
                return;
            }

            window._todayTyp = day.typ;
            window._todayKm  = day.dystans_km || 0;
            // Realna struktura treningu (powtórzenia/odcinek/tempo odcinka dla
            // interval/tempo/walkrun) — ta sama, którą pokazuje widok kalendarza
            // (buildDayHTML). Bez tego check-in pokazywał sztywne wartości domyślne
            // (8 powtórzeń, 400m, 6km) zamiast tego, co NAPRAWDĘ jest w planie.
            window._todayStruktura = day.struktura || null;

            // (usunięto kolorowy lewy pasek kafelka — mylił; kafelek zostaje neutralny)
            if (nameEl)  nameEl.textContent = TYPE_LABEL(day.typ) ?? day.typ;
            if (badgeEl) badgeEl.innerHTML = TYPE_EMOJI[day.typ] ?? '⚫';


            // Dystans
            if (tileDist) tileDist.textContent = day.dystans_km || '—';

            // Tempo
            const paceRaw = day.tempo_min_km || '';
            window._todayPace = paceRaw;
            if (tilePace) tilePace.textContent = paceRaw ? paceRaw.split('/')[0].split('-')[0].trim() : '—';

            // Intensywność
            const intData = INTENSITY_MAP[day.typ] || { label: '—', pct: 0 };
            if (tileInt)  tileInt.textContent = intData.label;
            if (tileIntF) setTimeout(() => tileIntF.style.width = intData.pct + '%', 80);

            // Strefa tętna
            const maxHR = parseInt(localStorage.getItem('velm_maxHR') || '190');
            const zData = HR_ZONE_MAP[day.typ];
            if (zData) {
                if (tileZone) tileZone.textContent = zData.zone;
                if (tileBpm)  tileBpm.textContent  = `${Math.round(zData.lo * maxHR)}–${Math.round(zData.hi * maxHR)}`;
            }

            updatePostCheckinBanner();
        }

        async function loadTodayCard() {
            if (!currentUserId) return;

            let dni = calendarPlan?.dni;

            if (!dni?.length) {
                try {
                    // apiFetch zamiast gołego fetch: daje darmowe odświeżenie tokenu
                    // po 401 i ROZRÓŻNIA awarię sieci (brak .status) od odpowiedzi
                    // serwera z kodem (.status). Wcześniej `await res.json()` rzucało
                    // na każdej odpowiedzi nie-JSON (np. stronie błędu Railway przy
                    // zimnym starcie), a catch pokazywał „Brak połączenia z serwerem".
                    const data = await apiFetch(`/api/plan/${currentUserId}`);
                    // Obiekt błędu (bez .dni) nie może trafić do WSPÓLNEGO calendarPlan —
                    // Dom ma własny fallback więc pokazywał coś (mylące „działa"),
                    // ale Kalendarz dziedziczył „plan" bez dni i renderował pustą siatkę.
                    const plan = data?.plan?.plan ?? data?.plan ?? null;
                    dni = plan?.dni;
                    if (plan?.dni && !calendarPlan) calendarPlan = plan;
                } catch (e) {
                    console.error('loadTodayCard: pobranie planu —', e?.status || '(sieć)', e?.message || e);
                    const nameEl = document.getElementById('home-main-workout-name');
                    if (nameEl) nameEl.textContent = e?.status ? t('err.server') : t('err.noserver');
                    return;
                }
            }

            // Render trzymamy POZA catchem sieciowym: błąd rysowania to nie jest
            // awaria połączenia i nie wolno go tak podpisywać. Wcześniej wspólny
            // catch zamieniał każdy wyjątek w „Brak połączenia z serwerem" i przy
            // okazji połykał go bez logu, więc nie dało się tego zdiagnozować.
            try {
                _fillTodayCard(dni);
                updatePostCheckinBanner();
            } catch (e) {
                console.error('loadTodayCard: render —', e?.message || e, e);
            }
        }

        // --- Plan Changes ---
        async function loadPlanChanges() {
            if (!currentUserId) return;
            try {
                const res = await authFetch(`${API_BASE}/api/plan-changes/${currentUserId}`, { headers: authHeaders() });
                const data = await res.json();
                const changes = data.changes || [];
                const section = document.getElementById('plan-changes-section');
                const list = document.getElementById('plan-changes-list');
                if (!section || !list) return;

                if (!changes.length) { section.style.display = 'none'; return; }

                section.style.display = 'block';
                list.innerHTML = changes.map(c => {
                    const fromEmoji = TYPE_EMOJI[c.original_typ] || '⚫';
                    const toEmoji = TYPE_EMOJI[c.new_typ] || '⚫';
                    const fromLabel = TYPE_LABEL(c.original_typ) || c.original_typ || '—';
                    const toLabel = TYPE_LABEL(c.new_typ) || c.new_typ || '—';
                    const hasChange = c.new_day && c.new_day !== c.original_day;

                    return `<div style="background:var(--surface-color);border:1px solid rgba(235,235,235,0.5);border-left:3px solid var(--primary-color);border-radius:14px;box-shadow:0 2px 12px rgba(0,0,0,0.03);padding:12px 14px;animation:fadeInUp 0.25s ease both;">
                        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
                            <span style="font-size:11px;font-weight:700;color:#8A8A8A;text-transform:uppercase;letter-spacing:0.08em;">${t('today.planchange')}</span>
                            <span style="font-size:11px;color:#C8C2B8;">${new Date(c.created_at).toLocaleDateString(_appLang,{day:'numeric',month:'short'})}</span>
                        </div>
                        <div style="display:flex;align-items:center;gap:8px;font-size:14px;">
                            <span style="font-weight:600;color:#111;">${c.original_day}</span>
                            <span style="color:#8A8A8A;">${fromEmoji} ${fromLabel}</span>
                            ${hasChange ? `<span style="color:#C8C2B8;">→</span><span style="font-weight:600;color:#111;">${c.new_day}</span><span style="color:#8A8A8A;">${toEmoji} ${toLabel}</span>` : `<span style="color:#C8C2B8;font-size:12px;">${t('today.skipped')}</span>`}
                        </div>
                        ${c.reason ? `<div style="font-size:12px;color:#8A8A8A;margin-top:4px;line-height:1.4;">${c.reason}</div>` : ''}
                    </div>`;
                }).join('');
            } catch(e) { console.error('loadPlanChanges:', e); }
        }

        // --- Race Countdown ---
        async function updateRaceCountdown() {
            const card = document.getElementById('race-countdown-card');
            if (!card) return;

            let raceDate = null;

            try {
                if (currentUserId) {
                    const res  = await authFetch(`${API_BASE}/api/user/${currentUserId}`, { headers: authHeaders() });
                    const data = await res.json();
                    raceDate = data.user?.onboarding_data?.time_race_target
                             || data.user?.onboarding_data?.time_race_date
                             || data.user?.onboarding_data?.dist_goal_date
                             || null;
                }
            } catch(e) { console.error('updateRaceCountdown error:', e); }

            const _fmt = d => {
                const dt = new Date(d);
                return dt.toLocaleDateString(_appLang, { day:'numeric', month:'short', year:'numeric' });
            };

            if (raceDate) {
                const now       = new Date(); now.setHours(0,0,0,0);
                const target    = new Date(raceDate); target.setHours(0,0,0,0);
                const daysLeft  = Math.ceil((target - now) / (1000*60*60*24));

                if (daysLeft > 0) {
                    // totalDays: from today (approximate — use 180d if unknown)
                    const totalDays = Math.max(daysLeft, 1);
                    const pct = Math.min(100, Math.max(0, Math.round((180 - daysLeft) / 180 * 100)));

                    card.innerHTML = `
                        <div style="font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;color:#111111;margin-bottom:6px;">${t('race.title')}</div>
                        <div id="race-days-num" style="font-size:32px;font-weight:900;color:#111111;font-family:'Outfit',sans-serif;line-height:1;">0</div>
                        <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#8A8A8A;margin-bottom:10px;">${t('race.daysleft')}</div>
                        <div style="width:100%;background:#EBEBEB;border-radius:2px;height:4px;margin-bottom:6px;overflow:hidden;">
                            <div id="race-progress-bar" style="height:100%;border-radius:2px;background:var(--primary-color);width:0%;transition:width 0.8s cubic-bezier(0.4,0,0.2,1);"></div>
                        </div>
                        <div style="font-size:11px;color:#8A8A8A;">${_fmt(raceDate)}</div>`;

                    // animate number 0 → daysLeft
                    const numEl = document.getElementById('race-days-num');
                    const barEl = document.getElementById('race-progress-bar');
                    let start = null;
                    const dur = 600;
                    function step(ts) {
                        if (!start) start = ts;
                        const p = Math.min((ts - start) / dur, 1);
                        const ease = 1 - Math.pow(1 - p, 3);
                        if (numEl) numEl.textContent = Math.round(ease * daysLeft);
                        if (p < 1) requestAnimationFrame(step);
                    }
                    requestAnimationFrame(step);
                    setTimeout(() => { if (barEl) barEl.style.width = pct + '%'; }, 50);
                    return;
                }
            }

            // no date or past
            card.innerHTML = `
                <div style="font-size:28px;margin-bottom:8px;">🏁</div>
                <div style="font-size:14px;font-weight:700;color:#111;margin-bottom:4px;">${t('race.none')}</div>
                <div onclick="event.stopPropagation();switchView('settings')" style="font-size:11px;color:#8A8A8A;cursor:pointer;text-decoration:underline;">${t('race.add')}</div>`;
        }

        async function loadStreak() {
            if (!currentUserId) return;
            try {
                const res = await authFetch(`${API_BASE}/api/streak/${currentUserId}`, { headers: authHeaders() });
                const data = await res.json();
                const streak = data.streak || 0;
                const card = document.getElementById('streak-card');
                const val = document.getElementById('streak-value');
                if (card && val) {
                    val.textContent = tp('home.streak.count', streak);
                    card.style.display = streak > 0 ? 'flex' : 'none';
                }
            } catch(e) {}
        }

