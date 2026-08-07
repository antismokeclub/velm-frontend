        // ── NARADA SZTABU — sztab przechodzi tydzień dzień po dniu ──
        // Analityk (5 parametrów) → Fizjo → Psycholog → Szef; po każdym
        // agencie zakreśla się jego segment w rzędzie dnia. Wszystkie
        // podpunkty to CZYNNOŚCI (uniwersalnie prawdziwe) — zero ocen.
        // Nazwy dni biora sie z jezyka UI — jako FUNKCJE, bo stala policzona przy
        // ladowaniu pliku zamrozilaby polski, gdy user zmieni jezyk w trakcie sesji.
        function _nrdAgents() { return [
            { key: 'analityk',  initial: 'A', name: 'Analityk' },
            { key: 'fizjo',     initial: 'F', name: 'Fizjo' },
            { key: 'psycholog', initial: 'P', name: 'Psycholog' },
            { key: 'szef',      initial: 'T', name: t('nrd.agent.szef.short') }
        ]; }
        function _nrdAgentLabel(k) { return { analityk: t('agent.analityk.name'), fizjo: t('agent.fizjo.name'), psycholog: t('agent.psycholog.name'), szef: t('nrd.agent.szef') }[k]; }
        const NRD_AGENT_COLOR = { analityk: '#5B8DB8', fizjo: '#6B8F71', psycholog: '#C9924E', szef: '#1A1A1A' };
        function _nrdPools() { return {
            analityk: [0,1,2,3,4,5,6,7,8,9,10].map(i => t('nrd.a.' + i)),
            fizjo:    [0,1,2,3,4,5].map(i => t('nrd.f.' + i)),
            psycholog:[0,1,2,3,4].map(i => t('nrd.p.' + i)),
            szef:     [0,1,2,3,4].map(i => t('nrd.s.' + i))
        }; }
        const NRD_TICK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

        // Dźwięk narady — subtelne tyknięcia (gra tylko po interakcji
        // użytkownika; auto-otwarcie w dzień narady = cisza, i dobrze)
        const nrdSound = (() => {
            let ctx = null;
            function ac() {
                if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
                if (ctx.state === 'suspended') ctx.resume();
                return ctx;
            }
            function blip(freq, dur, gain, type) {
                try {
                    const c = ac();
                    const o = c.createOscillator();
                    const g = c.createGain();
                    o.type = type || 'sine';
                    o.frequency.value = freq;
                    g.gain.setValueAtTime(gain, c.currentTime);
                    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
                    o.connect(g); g.connect(c.destination);
                    o.start(); o.stop(c.currentTime + dur);
                } catch (e) { /* audio niedostępne */ }
            }
            return {
                tick() { blip(1250, 0.05, 0.04); },
                seg()  { blip(510, 0.1, 0.06, 'triangle'); setTimeout(() => blip(640, 0.1, 0.05, 'triangle'), 75); },
                day()  { blip(523, 0.13, 0.06, 'triangle'); setTimeout(() => blip(784, 0.18, 0.06, 'triangle'), 115); },
                finish() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => blip(f, 0.24, 0.07, 'triangle'), i * 125)); }
            };
        })();

        // opts.estimateMs — szacowany czas generowania (tempo dopasowuje
        // się tak, by 7 dni zmieściło się w ~88% tego czasu)
        function showNaradaOverlay(opts = {}) {
            const estimateMs = opts.estimateMs || 45000;
            document.getElementById('narada-overlay')?.remove();
            const overlay = document.createElement('div');
            overlay.id = 'narada-overlay';
            overlay.setAttribute('role', 'dialog');
            overlay.setAttribute('aria-modal', 'true');
            overlay.setAttribute('aria-label', t('nrd.aria'));
            overlay.tabIndex = -1;
            overlay.innerHTML =
                '<div class="nrd-wrap">' +
                    '<div class="nrd-head">' +
                        '<div class="nrd-kicker">' + t('nrd.kicker') + '</div>' +
                        '<h1>' + t('nrd.title') + '</h1>' +
                    '</div>' +
                    '<div class="nrd-staff">' +
                        _nrdAgents().map(a =>
                            '<div class="nrd-chip" data-agent="' + a.key + '">' +
                                '<div class="nrd-ava">' + a.initial + '<div class="nrd-badge">' + NRD_TICK_SVG + '</div></div>' +
                                '<div class="nrd-nm">' + a.name + '</div>' +
                            '</div>').join('') +
                    '</div>' +
                    '<div class="nrd-bench" aria-live="polite">' +
                        '<div class="nrd-bench-head">' +
                            '<span class="nrd-bench-day"></span>' +
                            '<span class="nrd-bench-agent"></span>' +
                        '</div>' +
                        '<div class="nrd-tasks"></div>' +
                    '</div>' +
                    '<div class="nrd-week">' +
                        _dayNamesShort().map((s, d) =>
                            '<div class="nrd-day-row" data-day="' + d + '">' +
                                '<div class="nrd-dl">' + s + '</div>' +
                                '<div class="nrd-fields">' +
                                    '<span class="nrd-f"><b>A</b></span><span class="nrd-f"><b>F</b></span>' +
                                    '<span class="nrd-f"><b>P</b></span><span class="nrd-f"><b>T</b></span>' +
                                '</div>' +
                                '<div class="nrd-status">' + t('nrd.rowready') + '</div>' +
                                '<div class="nrd-dcheck">' + NRD_TICK_SVG + '</div>' +
                            '</div>').join('') +
                    '</div>' +
                    '<div class="nrd-legend" aria-hidden="true">' +
                        '<div class="nrd-dl sp"></div>' +
                        '<div class="nrd-fields">' +
                            '<span><i style="background:#5B8DB8"></i>Analityk</span>' +
                            '<span><i style="background:#6B8F71"></i>Fizjo</span>' +
                            '<span><i style="background:#C9924E"></i>Psycholog</span>' +
                            '<span><i style="background:#1A1A1A"></i>Szef</span>' +
                        '</div>' +
                        '<div class="nrd-status sp">Plan gotowy</div>' +
                        '<div class="nrd-dcheck sp"></div>' +
                    '</div>' +
                    '<div class="nrd-progress-row">' +
                        '<div class="nrd-progress"><div class="nrd-progress-fill"></div></div>' +
                        '<span class="nrd-pct">0%</span>' +
                    '</div>' +
                '</div>';

            // Modalność: fokus na overlay, tło nieaktywne (inert), przywrócenie przy zamknięciu
            const prevFocus = document.activeElement;
            const inerted = [];
            Array.from(document.body.children).forEach(el => {
                if (el !== overlay && !el.inert) { el.inert = true; inerted.push(el); }
            });
            document.body.appendChild(overlay);
            overlay.focus({ preventScroll: true });
            function releaseModal() {
                inerted.forEach(el => { el.inert = false; });
                if (prevFocus && typeof prevFocus.focus === 'function') prevFocus.focus({ preventScroll: true });
            }
            requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('visible')));

            // ── Silnik narady ──
            const startedAt = Date.now();
            // Pełny przebieg przy speed=1 to ~81.5 s — skalujemy tempo,
            // by 7 dni zmieściło się w ~88% szacowanego czasu
            const speed = Math.min(1.15, Math.max(0.34, (estimateMs * 0.88) / 81500));
            let timers = [];
            let pctTimer = null;
            let running = true;
            let dayIdx = 0;

            const q = (sel) => overlay.querySelector(sel);
            const qa = (sel) => overlay.querySelectorAll(sel);
            const dayRowEl = (d) => q('.nrd-day-row[data-day="' + d + '"]');
            const chipElN = (key) => q('.nrd-chip[data-agent="' + key + '"]');
            const later = (fn, ms) => timers.push(setTimeout(fn, ms));
            const clearAllN = () => { timers.forEach(clearTimeout); timers = []; clearInterval(pctTimer); };
            const pickN2 = (arr, n) => arr.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).slice(0, n).map(p => p[1]);

            function chipWorking(key) {
                qa('.nrd-chip').forEach(c => c.classList.remove('active'));
                if (key) chipElN(key).classList.add('active');
            }
            function chipDone(key) {
                const c = chipElN(key);
                c.classList.remove('active');
                c.classList.add('ok');
            }
            function chipsReset() { qa('.nrd-chip').forEach(c => c.classList.remove('active', 'ok')); }
            function setScan(d, agentKey) {
                qa('.nrd-day-row').forEach((r, i) => {
                    r.classList.toggle('scan', i === d);
                    if (i === d && agentKey) r.style.setProperty('--nrd-scan-c', NRD_AGENT_COLOR[agentKey]);
                });
            }
            function setBenchHead(title, agent, dayNum) {
                const head = q('.nrd-bench-head');
                q('.nrd-bench').style.setProperty('--nrd-agent-c', NRD_AGENT_COLOR[agent]);
                head.classList.add('swap');
                setTimeout(() => {
                    q('.nrd-bench-day').innerHTML = title +
                        (dayNum ? '<span class="nrd-daynum">' + dayNum + '/7</span>' : '');
                    q('.nrd-bench-agent').textContent = _nrdAgentLabel(agent);
                    head.classList.remove('swap');
                }, 190);
            }
            function addTask(label) {
                const row = document.createElement('div');
                row.className = 'nrd-task';
                row.innerHTML = '<span class="nrd-tick">' + NRD_TICK_SVG + '</span><span>' + label + '</span>';
                q('.nrd-tasks').appendChild(row);
                requestAnimationFrame(() => requestAnimationFrame(() => row.classList.add('in')));
                return row;
            }
            const clearTasks = () => { q('.nrd-tasks').innerHTML = ''; };

            function fillSegment(d, agentIdx) {
                const row = dayRowEl(d);
                if (!row) return;
                const f = row.querySelectorAll('.nrd-f')[agentIdx];
                if (f && !f.classList.contains('on')) { f.classList.add('on'); nrdSound.seg(); }
            }
            function buildRowN(d) {
                const row = dayRowEl(d);
                if (!row) return;
                row.classList.remove('scan');
                row.classList.add('built');
                row.querySelectorAll('.nrd-f').forEach((f, i) => {
                    if (!f.classList.contains('on')) setTimeout(() => f.classList.add('on'), i * 130);
                });
            }
            function startPct() {
                const pctEl = q('.nrd-pct');
                const fillEl = q('.nrd-progress-fill');
                fillEl.style.transition = 'none';
                fillEl.style.width = '0%';
                setTimeout(() => {
                    fillEl.style.transition = 'width ' + (estimateMs * 0.9) + 'ms linear';
                    fillEl.style.width = '90%';
                }, 100);
                pctTimer = setInterval(() => {
                    const p = Math.min(90, Math.round((Date.now() - startedAt) / (estimateMs * 0.9) * 90));
                    if (pctEl) pctEl.textContent = p + '%';
                }, 250);
            }
            function agentSegment(agentKey, title, tasks, tickMs, cb, dayNum) {
                chipWorking(agentKey);
                setBenchHead(title, agentKey, dayNum);
                clearTasks();
                let delay = 300 * speed;
                tasks.forEach((label) => {
                    later(() => {
                        const row = addTask(label);
                        later(() => { row.classList.add('done'); nrdSound.tick(); }, (340 + Math.random() * 180) * speed);
                    }, delay);
                    delay += (tickMs + Math.random() * 140) * speed;
                });
                later(() => {
                    if (!running) return;
                    chipDone(agentKey);
                    later(cb, 280 * speed);
                }, delay + 300 * speed);
            }
            function runDay(d) {
                if (!running) return;
                chipsReset();
                const title = _dayNamesFull()[d];
                const n = d + 1;
                setScan(d, 'analityk');
                agentSegment('analityk', title, pickN2(_nrdPools().analityk, 5), 580, () => {
                    if (!running) return;
                    fillSegment(d, 0);
                    setScan(d, 'fizjo');
                    agentSegment('fizjo', title, pickN2(_nrdPools().fizjo, 2), 640, () => {
                        if (!running) return;
                        fillSegment(d, 1);
                        setScan(d, 'psycholog');
                        agentSegment('psycholog', title, pickN2(_nrdPools().psycholog, 2), 640, () => {
                            if (!running) return;
                            fillSegment(d, 2);
                            setScan(d, 'szef');
                            agentSegment('szef', title, pickN2(_nrdPools().szef, 2), 640, () => {
                                if (!running) return;
                                fillSegment(d, 3);
                                buildRowN(d);
                                nrdSound.day();
                                dayIdx++;
                                later(() => {
                                    if (!running) return;
                                    dayIdx < 7 ? runDay(dayIdx) : waitState();
                                }, 620 * speed);
                            }, n);
                        }, n);
                    }, n);
                }, n);
            }
            // Po niedzieli: spokojne oczekiwanie na odpowiedź API
            function waitState() {
                if (!running) return;
                chipsReset();
                chipWorking('szef');
                setScan(null);
                setBenchHead(t('nrd.lastpolish'), 'szef');
                clearTasks();
                addTask(t('nrd.assembling'));
            }

            startPct();
            later(() => runDay(0), 450);

            function closeOverlay() {
                releaseModal();
                overlay.classList.remove('visible');
                setTimeout(() => overlay.remove(), 320);
            }

            return {
                // Sukces: domknij wszystkie dni kaskadą, pokaż zatwierdzenie
                async finish() {
                    // Minimum ekspozycji — szybka odpowiedź API nie może mignąć
                    const minMs = 8000;
                    const elapsed = Date.now() - startedAt;
                    if (elapsed < minMs) await new Promise(r => setTimeout(r, minMs - elapsed));
                    running = false;
                    clearAllN();
                    const fillEl = q('.nrd-progress-fill');
                    if (fillEl) { fillEl.style.transition = 'width 400ms ease'; fillEl.style.width = '100%'; }
                    const pctEl = q('.nrd-pct');
                    if (pctEl) pctEl.textContent = '100%';
                    chipsReset();
                    _nrdAgents().forEach((a, i) => setTimeout(() => chipElN(a.key)?.classList.add('ok'), i * 120));
                    setScan(null);
                    setBenchHead(t('nrd.approved'), 'szef');
                    clearTasks();
                    const row = addTask(t('nrd.weekready'));
                    setTimeout(() => row.classList.add('done'), 500);
                    for (let d = 0; d < 7; d++) {
                        const r = dayRowEl(d);
                        if (r && !r.classList.contains('built')) {
                            setTimeout(() => buildRowN(d), 250 + d * 140);
                        }
                    }
                    nrdSound.finish();
                    // (usunięto zapis velm_narada_seen_week — nikt tej flagi nie czytał,
                    //  a opts.weekKey nigdy nie było przekazywane, więc i tak nie działała)
                    await new Promise(r => setTimeout(r, 2600));
                    closeOverlay();
                },
                // Błąd: zamknij od razu
                abort() {
                    running = false;
                    clearAllN();
                    closeOverlay();
                }
            };
        }

        // ── Narada NA ŻĄDANIE przy pierwszym wejściu po wygaśnięciu planu ──
        // Bez crona: to użytkownik (samym wejściem do apki) zwołuje naradę.
        // Rolling 7 dni: plan żyje 7 dni od tydzien_od. W oknie → nic. Po wygaśnięciu
        // (dziś > start+6) → niezamykalna narada + PRAWDZIWE generowanie (/api/weekly-update).
        // Darmowi (402) — cicho zostają przy starym planie, bez ponawiania dla tego
        // wygasłego planu. Kasa Sonneta pali się tylko dla wracających.
        // Zaczepka przy absencji — Szef pisze po ludzku, gdy user zniknął (3 pominięte
        // zaplanowane treningi, nie na uzgodnionej pauzie). Karta na Domu → otwiera czat.
        function renderCoachOutreach(outreach) {
            const card = document.getElementById('coach-outreach-card');
            if (!card) return;
            if (!outreach || !outreach.needed) { card.style.display = 'none'; return; }
            card.style.display = 'block';
            card.innerHTML = '<div style="background:#1A1A1A;border-radius:20px;padding:20px;">'
                + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">'
                + '<div style="width:36px;height:36px;background:white;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#1A1A1A;">S</div>'
                + '<div style="font-size:14px;font-weight:700;color:white;">Szef Sztabu</div></div>'
                + '<div style="font-size:15px;color:rgba(255,255,255,0.9);line-height:1.6;margin-bottom:16px;">' + sanitizeHTML(outreach.message) + '</div>'
                + '<button onclick="switchView(\'coach\')" style="width:100%;padding:14px;background:white;border:none;border-radius:14px;font-size:14px;font-weight:700;font-family:\'Inter\',sans-serif;cursor:pointer;color:#1A1A1A;">Odpisz trenerowi →</button>'
                + '</div>';
            // Cooldown: zaznacz, że zaczepka pokazana — nie nagabuj co wejście.
            apiFetch('/api/coaching/outreach-seen', { method: 'POST', body: { userId: currentUserId } }).catch(() => {});
        }

        // CHECK-IN POWROTNY (dormant, 30 dni ciszy) — łagodne okno powrotu zamiast zwykłej
        // narady. Pyta czy biegał, zapisuje kontekst, potem układa świeży plan.
        function showReturnCheckin(dormant) {
            if (document.getElementById('return-checkin-overlay')) return;
            const days = dormant?.daysSince || 30;
            const ov = document.createElement('div');
            ov.id = 'return-checkin-overlay';
            ov.style.cssText = 'position:fixed;inset:0;z-index:9999;background:#F7F4F0;display:flex;align-items:center;justify-content:center;padding:24px;';
            ov.innerHTML = '<div style="max-width:360px;width:100%;text-align:center;">'
                + '<div style="width:56px;height:56px;background:#1A1A1A;border-radius:18px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:20px;font-weight:800;color:white;">S</div>'
                + '<div style="font-family:\'Outfit\',sans-serif;font-weight:800;font-size:24px;color:#1A1A1A;margin-bottom:10px;">' + t('nrd.back.title') + '</div>'
                + '<div style="font-size:15px;color:#6B6B6B;line-height:1.6;margin-bottom:28px;">' + t('nrd.back.desc').replace('{n}', days) + '</div>'
                + '<button id="rc-yes" style="width:100%;padding:16px;background:#1A1A1A;border:none;border-radius:16px;font-size:15px;font-weight:700;font-family:\'Inter\',sans-serif;cursor:pointer;color:white;margin-bottom:12px;">' + t('nrd.back.yes') + '</button>'
                + '<button id="rc-no" style="width:100%;padding:16px;background:white;border:1.5px solid #EBEBEB;border-radius:16px;font-size:15px;font-weight:700;font-family:\'Inter\',sans-serif;cursor:pointer;color:#1A1A1A;">' + t('nrd.back.no') + '</button>'
                + '</div>';
            document.body.appendChild(ov);
            const finish = async (trained) => {
                ov.remove();
                try { await apiFetch('/api/coaching/return-checkin', { method: 'POST', body: { userId: currentUserId, trained } }); } catch(e) {}
                const narada = showNaradaOverlay({ estimateMs: 60000 });
                try {
                    await apiFetch('/api/weekly-update', { method: 'POST', body: { userId: currentUserId } });
                    calendarPlan = null; loadCalendar(); loadTodayCard();
                    await narada.finish();
                } catch(e) {
                    narada.abort();
                    if (e.status !== 402) showVelmToast(t('nrd.fail'), true);
                }
            };
            document.getElementById('rc-yes').onclick = () => finish(true);
            document.getElementById('rc-no').onclick = () => finish(false);
        }

        let _weeklyNaradaRunning = false;
        async function checkWeeklyNarada() {
            try {
                if (!currentUserId || _weeklyNaradaRunning) return false;
                if (document.getElementById('narada-overlay')) return false;

                // apiFetch (nie goły fetch) — dostajemy darmowy retry po
                // odświeżeniu tokenu. Goły fetch + "if (!res.ok) return" po
                // cichu ubijał całe sprawdzenie stale-planu, gdy access token
                // akurat wygasł przy starcie apki — bez tego user mógł nigdy
                // nie dostać wymuszonej narady, bo nic tego nie ponawiało.
                const data = await apiFetch(`/api/plan/${currentUserId}`);
                // Dormant (30 dni ciszy) ma pierwszeństwo — okno powrotne zamiast zwykłej narady.
                if (data?.dormant?.needed) { showReturnCheckin(data.dormant); return true; }
                renderCoachOutreach(data?.outreach);   // zaczepka przy absencji (niezależna od narady)
                const plan = data?.plan?.plan ?? data?.plan ?? null;
                const weekKey = plan?.tydzien_od || plan?.dni?.[0]?.data;

                // Maszyna stanów: user uprzedził o przerwie (wstrzymany) → nie zmuszamy narady
                // dopóki data powrotu nie minie. Konwersacyjna pauza zamiast przycisku.
                const _coaching = data?.coaching;
                if (_coaching?.state === 'paused' && _coaching.hold_until && _coaching.hold_until > toDateStr(new Date())) return false;

                // Ustal czy trzeba naradę + klucz 402-guardu.
                let naradaKey;
                if (weekKey) {
                    // Rolling 7 dni: plan żyje 7 dni od tydzien_od. Aktualny, dopóki dziś
                    // nie przekroczy ostatniego dnia (start + 6). Plan wygasa 8. dnia i przy
                    // pierwszym wejściu po wygaśnięciu wyskakuje niezamykalna narada.
                    const planEnd = new Date(weekKey + 'T00:00:00');
                    planEnd.setDate(planEnd.getDate() + 6);
                    if (toDateStr(new Date()) <= toDateStr(planEnd)) return false;   // plan w oknie 7 dni — nic do roboty
                    naradaKey = weekKey;
                } else {
                    // BRAK PLANU W OGÓLE (zgubiony / nieudany przy onboardingu) → wymuszona narada,
                    // żeby user nie utknął bez planu widząc tylko check-in. ALE max raz dziennie:
                    // gdyby weekly-update zwrócił 200 a plan i tak nie był potem parsowalny,
                    // bez tego guardu narada (Sonnet) odpalałaby się przy KAŻDYM wejściu = pętla
                    // i spalanie kasy. Guard ustawiamy przy PRÓBIE, niezależnie od wyniku.
                    const _today = toDateStr(new Date());
                    if (localStorage.getItem('velm_noplan_narada_day') === _today) return false;
                    localStorage.setItem('velm_noplan_narada_day', _today);
                    naradaKey = 'noplan';
                }

                // Darmowy user dostał już 402 dla tego przypadku? Nie męczymy. Premium NIGDY
                // nie blokujemy tą flagą — inaczej po zmianie free→premium narada nie ruszy.
                if (!currentUserPremium && localStorage.getItem('velm_narada_402_week') === naradaKey) return false;

                _weeklyNaradaRunning = true;
                const narada = showNaradaOverlay({ estimateMs: 60000 });
                // Narada przejmuje ekran — zamknij poranny check-in, gdyby zdążył się otworzyć.
                if (typeof closeCheckin === 'function') closeCheckin();
                try {
                    await apiFetch('/api/weekly-update', { method: 'POST', body: { userId: currentUserId } });
                    // calendarPlan to wspólny cache — loadCalendar/loadTodayCard
                    // bez wyczyszczenia go od razu wypadają na "if (calendarPlan)"
                    // i renderują STARY plan sprzed narady, bez pytania serwera.
                    calendarPlan = null;
                    loadCalendar();
                    loadTodayCard();
                    if (typeof loadPlanChanges === 'function') loadPlanChanges();
                    await narada.finish();
                } catch (e) {
                    narada.abort();
                    if (e.status === 402) {
                        // Free tier: stary plan zostaje; nie ponawiaj dla tego przypadku
                        localStorage.setItem('velm_narada_402_week', naradaKey);
                    } else {
                        showVelmToast(t('nrd.fail.call'), true);
                    }
                } finally {
                    _weeklyNaradaRunning = false;
                }
                return true;
            } catch (e) {
                // Offline / sesja wygasła bez odzysku — nie przerywamy usera
                // toastem, ale zostawiamy ślad w konsoli zamiast cichej czarnej
                // dziury (poprzednio zero logu, nie dało się tego zdiagnozować)
                console.warn('checkWeeklyNarada: pominięto —', e?.message || e);
                return false;
            }
        }

        // Klik w "Wygeneruj nowy plan" → eleganckie okno potwierdzenia
        async function generateNewPlan() {
            const userId = localStorage.getItem('velm_user_id');
            if (!userId) return;

            // currentUserPremium to migawka z URUCHOMIENIA apki (loadSubscriptionStatus
            // woła się raz, przy starcie) — jeśli status premium zmienił się W TRAKCIE
            // tej samej sesji (świeży zakup, albo ręczna zmiana w bazie jak teraz przy
            // teście), stary flag pokazywał zły ekran (paywall) mimo że konto JEST już
            // premium. Odświeżamy na żywo tuż przed decyzją zamiast ufać migawce.
            await loadSubscriptionStatus();
            if (!currentUserPremium) {
                showPaywall(t('nrd.premium'), { surveyAvailable: !currentSurveyCompleted });
                return;
            }
            showNaradaConfirm();
        }

        function showNaradaConfirm() {
            document.getElementById('nrd-confirm-backdrop')?.remove();
            const bd = document.createElement('div');
            bd.id = 'nrd-confirm-backdrop';
            bd.setAttribute('role', 'dialog');
            bd.setAttribute('aria-modal', 'true');
            bd.setAttribute('aria-label', t('nrd.confirm.aria'));
            bd.innerHTML =
                '<div id="nrd-confirm">' +
                    '<div class="nrdc-avas" aria-hidden="true">' +
                        '<div class="a" style="background:#5B8DB8">A</div>' +
                        '<div class="a" style="background:#6B8F71">F</div>' +
                        '<div class="a" style="background:#C9924E">P</div>' +
                        '<div class="a" style="background:#1A1A1A">T</div>' +
                    '</div>' +
                    '<h3>' + t('nrd.confirm.title') + '</h3>' +
                    '<p>' + t('nrd.confirm.desc') + '</p>' +
                    '<button class="nrdc-go">' + t('nrd.confirm.go') + '</button>' +
                    '<button class="nrdc-cancel">' + t('nrd.confirm.no') + '</button>' +
                '</div>';
            document.body.appendChild(bd);
            requestAnimationFrame(() => requestAnimationFrame(() => bd.classList.add('visible')));

            const close = () => {
                bd.classList.remove('visible');
                setTimeout(() => bd.remove(), 260);
            };
            bd.addEventListener('click', (e) => { if (e.target === bd) close(); });
            bd.querySelector('.nrdc-cancel').addEventListener('click', close);
            bd.querySelector('.nrdc-go').addEventListener('click', () => {
                close();
                startNaradaGeneration();
            });
        }

        async function startNaradaGeneration() {
            const userId = localStorage.getItem('velm_user_id');
            if (!userId) return;

            const btn = document.getElementById('settings-generate-plan-btn');
            if (btn) { btn.disabled = true; btn.style.cursor = 'wait'; }
            const resetBtn = () => {
                if (!btn) return;
                btn.innerHTML = t('nrd.genplan');
                btn.style.color = '#1A1A1A';
                btn.style.borderColor = '#EBEBEB';
                btn.disabled = false;
                btn.style.cursor = 'pointer';
            };

            const narada = showNaradaOverlay();
            try {
                await apiFetch('/api/weekly-update', {
                    method: 'POST',
                    body: { userId: userId }
                });
                calendarPlan = null;
                loadSettings();
                loadCalendar();
                loadTodayCard();
                loadPlanChanges();
                await narada.finish();
                resetBtn();
            } catch(e) {
                narada.abort();
                resetBtn();
                if (e.status === 402) {
                    showPaywall(e.data?.message || t('nrd.premium.short'), { surveyAvailable: e.data?.surveyAvailable });
                    return;
                }
                showVelmToast(e?.message || t('nrd.generr'), true);
            }
        }

