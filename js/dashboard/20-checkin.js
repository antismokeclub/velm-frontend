        // ── CHECKIN OVERLAY JS ───────────────────────────────────
        let currentMode  = 'morning';
        let currentStep  = 0;
        const TOTAL_STEPS = 5;
        let duration = 45;
        let rpeVal   = null;
        let workoutType = 'easy';
        // Bez wymyślonych liczb. Wcześniej ziarno miało dystans_km:10 i gdy plan nie
        // zdążył się doładować (albo przyszło km=0), zawodnik z planem na 6 km widział
        // w check-inie 10 km. null = "nie wiem" i UI ma to przyznać, nie zgadywać.
        // ── START ZAWODÓW ──────────────────────────────────────────────────
        let _ciRaceTime = '', _ciIsRace = false;

        /** Czy DZIŚ jest dzień celu. Data celu z onboardingu — jedyne pewne źródło;
            faza planu mówi o TYGODNIU zawodów, a nas interesuje konkretny dzień. */
        function _ciIsRaceDay() {
            const onb = window._settingsOnb || window._userOnb || {};
            const raw = onb.time_race_date || onb.time_race_target || onb.dist_goal_date;
            if (!raw) return false;
            return String(raw).slice(0, 10) === todayStr();
        }

        /** "19:42" / "1:38:20" → sekundy. null gdy pusto albo bez sensu. */
        function _ciParseRaceSec(v) {
            const p = String(v || '').trim().split(':').map(x => parseInt(x, 10));
            if (!p.length || p.some(x => !Number.isFinite(x) || x < 0)) return null;
            // Minuty i sekundy muszą mieścić się w zakresie — "19:99" wcześniej
            // przechodziło jako 19 min 99 s i zapisywało zły czas oficjalny.
            if (p.length === 2 && p[1] > 59) return null;
            if (p.length === 3 && (p[1] > 59 || p[2] > 59)) return null;
            const sec = p.length === 2 ? p[0] * 60 + p[1]
                      : p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : null;
            return (sec && sec > 60 && sec < 24 * 3600) ? sec : null;
        }

        /** Przełącznik "to był start". Dostępny KAŻDEGO dnia, nie tylko w dniu celu:
            biegacze robią starty kontrolne, a gdy profil się nie doładuje w dniu celu,
            jedyna okazja do zapisania wyniku przepadłaby po cichu. */
        function _ciToggleRace() {
            _ciIsRace = !_ciIsRace;
            document.getElementById('ci-race-toggle')?.classList.toggle('s', _ciIsRace);
            const box = document.getElementById('ci-race-detail');
            if (box) box.style.display = _ciIsRace ? '' : 'none';
            if (!_ciIsRace) {
                _ciRaceTime = '';
                const inp = document.getElementById('ci-race-time');
                if (inp) inp.value = '';
            }
        }

        let workoutData = { dystans_km:null, struktura:true, powtorzenia:null, serie:null, odcinek_km:null };
        let inFollowUp       = false;
        let followUpSubStep  = 0;
        let followUpCauses   = new Set();
        let _gotoCoachAfterCheckin = false;
        let followUpSelections = new Set();
        let fuKmVal          = 5;
        // Per-segment state
        let inSegmentStep    = null;
        let segmentRepeats   = 0;
        let segmentSeries    = 0;
        let segmentWorkKm    = 0;
        // New completion + skip + morning follow-up state
        let selectedCompletion   = null;
        let skippedParts         = new Set();
        let readinessFollowup    = null;
        let inReadinessFollowup  = false;
        let inSorenessDetail     = false;
        let sorenessLocation     = null;
        let sorenessDuration     = null;
        // Sleep + body recovery state
        let sleepHours       = null;
        let sleepH = 7, sleepM = 0;
        let muscleRecovery   = null;
        // Duration pickers (H:MM:SS) — shared across easy/long/interval/walkrun
        let durH = 0, durM = 45, durS = 0;
        // Work segment duration (tempo / interval)
        let workSegH = 0, workSegM = 0, workSegS = 0;
        let intervalDistanceM  = 400;
        // "Więcej niż w planie" (step-post-3) — km dla easy/long/tempo, liczba
        // powtórzeń/serii dla interval/walkrun (jednostka zależy od typu)
        let moreVal = 0;
        // "Mniej niż w planie" (step-post-2b) — faktyczna liczba powtórzeń/serii,
        // gdy user zaznaczy że zrobił ich mniej niż plan. _fuCountTarget mówi,
        // do którego pola (segmentRepeats/segmentSeries) wpisać wartość
        let fuCountVal = 0;
        let _fuCountTarget = null;
        // fuKmWrap obsługuje 2 tryby: 'km' (dystans) i 'm' (metry, odcinek
        // interwałowy) — jeden widget, inny krok/format zależnie od _fuKmUnit
        let _fuKmUnit = 'km';
        let _checkinStepsLockedHeight = 0;
        function openCheckinSmart() {
            const today = todayStr();
            const morningDone = localStorage.getItem('velm_checkin_morning_done');
            if (morningDone !== today) {
                openCheckin('morning');
                return;
            }
            // Bez tej bramki FAB zawsze otwierał PUSTY formularz wieczornego
            // check-inu, nawet gdy user wypełnił go już dziś — dało się klikać
            // w kółko i nadpisywać dane bez żadnego ostrzeżenia.
            const postDone   = localStorage.getItem('velm_checkin_post_done');
            const hasWorkout = window._todayTyp && window._todayTyp !== 'rest';
            if (hasWorkout && postDone !== today) {
                openCheckin('post', window._todayTyp, window._todayKm);
                return;
            }
            showVelmToast(t('ci.alreadydone'));
        }

        function _ciSetText(id, txt) {
            const el = document.getElementById(id);
            if (el) el.textContent = txt;
        }
        function openCheckin(mode, typ, km) {
            // Trzy etykiety w markupie mają polskie wartości domyślne, bo ich
            // treść zależy od typu treningu — dlatego NIE mogą mieć data-i18n
            // (applyI18n nadpisałby wersję ustawioną przez _initMoreStep).
            // Zamiast tego ustawiamy je tu na wariant ogólny; _initMoreStep
            // i _syncFuKm doprecyzują je dla interwału/tempa.
            _ciSetText('more-step-title', t('ci.q.total'));
            _ciSetText('more-step-desc',  t('ci.q.total.desc'));
            _ciSetText('fuKmLabel',       t('ci.q.km.total'));
            _ciSetText('fuCountLabel',    t('ci.reps.actual'));
            // Reset state
            currentMode  = mode || 'morning';
            currentStep  = 0;
            inFollowUp   = false;
            inSegmentStep = null;
            rpeVal       = null;
            duration     = 45;
            followUpSelections = new Set();
            followUpSubStep = 0; followUpCauses = new Set(); _gotoCoachAfterCheckin = false;
            segmentRepeats = 0; segmentSeries = 0; segmentWorkKm = 0;
            selectedCompletion = null; skippedParts = new Set();
            readinessFollowup = null; inReadinessFollowup = false;
            inSorenessDetail = false; sorenessLocation = null; sorenessDuration = null;
            sleepH = 8; sleepM = 0; sleepHours = sleepH + sleepM / 60; muscleRecovery = null;
            durH = 0; durM = 45; durS = 0;
            workSegH = 0; workSegM = 0; workSegS = 0;
            intervalDistanceM = 400; moreVal = 0;
            fuCountVal = 0; _fuCountTarget = null; _fuKmUnit = 'km';
            // Resetuj do domyślnych — nadpisywane niżej realną strukturą planu,
            // jeśli jest dostępna. Bez tego resetu wartości z POPRZEDNIEGO otwarcia
            // (np. realne 6 powtórzeń z wczorajszych interwałów) zostawałyby
            // "przyklejone" do dzisiejszego, zupełnie innego treningu.
            workoutData.powtorzenia = 8; workoutData.serie = 6;
            workoutData.dystans_odcinka_m = null; workoutData.tempo_odcinka = null;
            const _sleepPkEl = document.getElementById('ci-pk-sleep');
            if (_sleepPkEl) { _sleepPkEl.innerHTML = _buildCiSleepPicker(); }
            document.querySelectorAll('#checkin-overlay .completion-btn').forEach(b => b.classList.remove('selected'));
            document.querySelectorAll('#checkin-overlay .morning-fu-btn').forEach(b => b.classList.remove('selected'));
            document.getElementById('fuKmWrap')?.classList.remove('visible');
            // BUG realny (nie artefakt testu): bez tego resetu, licznik odsłonięty
            // w POPRZEDNIM check-inie (np. "mniej powtórzeń" przy interwałach)
            // zostawał .visible, a toggleFollowUp2b sprawdza "!classList.contains
            // ('visible')" przed przeliczeniem etykiety/wartości — więc kolejny,
            // zupełnie inny trening (np. marsz-bieg) dziedziczył stary podpis
            // "Ile powtórzeń..." zamiast "Ile serii...".
            document.getElementById('fuCountWrap')?.classList.remove('visible');
            // Fallback do dzisiejszego planu — poranny check-in otwiera się bez
            // argumentów i pokazywał domyślne 10 km zamiast dystansu z planu
            if (!typ && window._todayTyp) typ = window._todayTyp;
            // 0 km to poprawna wartość (dzień wolny), undefined to "nie wiem" —
            // dlatego sprawdzamy przez == null, a nie przez falsy.
            if (km == null && window._todayKm != null) km = window._todayKm;
            if (typ) workoutType = typ;
            const _kmNum = (km == null || km === '') ? null : parseFloat(km);
            if (_kmNum != null && !isNaN(_kmNum) && _kmNum > 0) {
                workoutData.dystans_km = _kmNum;
                workoutData.odcinek_km = Math.round(_kmNum * 0.6 * 10) / 10;
            }
            // Nadpisz domyślne/heurystyczne wartości REALNĄ strukturą z planu (Szef
            // Sztabu zapisuje ją przy generowaniu — to samo źródło, którego już
            // używa widok kalendarza w buildDayHTML). Bez tego karuzela i karta planu
            // pokazywały fikcyjne 8 powtórzeń / 400 m / 6 km niezależnie od planu.
            // "powtorzeenia" to literalna nazwa pola z backendu (headtrainer.js) —
            // czytamy oba warianty pisowni na wszelki wypadek.
            const _struct = window._todayStruktura || null;
            if (_struct) {
                if (workoutType === 'interval') {
                    const rep = _struct.powtorzeenia || _struct.powtorzenia;
                    if (rep) {
                        if (rep.ile) workoutData.powtorzenia = rep.ile;
                        if (rep.dystans_m) workoutData.dystans_odcinka_m = rep.dystans_m;
                        if (rep.tempo) workoutData.tempo_odcinka = rep.tempo;
                    }
                } else if (workoutType === 'tempo') {
                    const odc = _struct.odcinek;
                    if (odc) {
                        if (odc.dystans_km) workoutData.odcinek_km = odc.dystans_km;
                        if (odc.tempo) workoutData.tempo_odcinka = odc.tempo;
                    }
                } else if (workoutType === 'walkrun') {
                    const repCount = _struct.powtorzeenia ?? _struct.powtorzenia;
                    if (typeof repCount === 'number' && repCount > 0) workoutData.serie = repCount;
                }
            }
            fuKmVal = workoutData.dystans_km ? workoutData.dystans_km / 2 : 0;
            if (currentMode === 'post') {
                // Wszystko liczone przez _ciEstTotalMin/_ciEstPaceMin — jedno źródło
                // prawdy, które PRZEDE WSZYSTKIM sięga po realne tempo odcinka z planu
                // (workoutData.tempo_odcinka), a dopiero potem po ogólne tempo dnia
                // i na końcu po sensowny fallback — karuzela zawsze startuje od
                // najdokładniejszej dostępnej wartości.
                const _dk = workoutData.dystans_km || 10;
                if (workoutType === 'easy' || workoutType === 'long') {
                    const _e = _ciEstTotalMin(workoutType, _dk);
                    durH = Math.floor(_e/60); durM = _e%60; durS = 0; duration = durH*60+durM;
                } else if (workoutType === 'walkrun') {
                    // Jeśli plan ma realny rozkład minut (rozgrzewka + serie biegu/marszu
                    // + schłodzenie), liczymy z NIEGO — dokładniej niż generyczne 8 min/km
                    const wr = _struct;
                    const repCount = wr ? (wr.powtorzeenia ?? wr.powtorzenia) : null;
                    let _e;
                    if (wr && typeof repCount === 'number' && repCount > 0) {
                        const _perRep = (wr.bieg_min || 0) + (wr.marsz_min || 0);
                        _e = Math.round((wr.rozgrzewka_min || 0) + _perRep * repCount + (wr.schlodzenie_min || 0));
                    } else {
                        _e = _ciEstTotalMin('walkrun', _dk);
                    }
                    durH = Math.floor(_e/60); durM = _e%60; durS = 0; duration = durH*60+durM;
                } else if (workoutType === 'tempo') {
                    const _sk = workoutData.odcinek_km || 6;
                    const _e = _ciEstTotalMin('tempo', _sk);
                    workSegH = Math.floor(_e/60); workSegM = _e%60; workSegS = 0;
                } else if (workoutType === 'interval') {
                    // Dystans odcinka z planu (np. 1000m), nie sztywne 400m
                    const _segKm = (workoutData.dystans_odcinka_m || 400) / 1000;
                    const _es = Math.round(_ciEstPaceMin('interval') * 60 * _segKm);
                    workSegH = Math.floor(_es/3600); workSegM = Math.floor((_es%3600)/60); workSegS = Math.round((_es%60)/5)*5;
                    if (workSegS >= 60) { workSegM++; workSegS = 0; }
                    if (workSegM >= 60) { workSegH++; workSegM -= 60; }
                }
                // UWAGA: showPost0Section() budowałoby karuzelę i ustawiało jej scrollTop
                // TUTAJ — ale overlay ma jeszcze display:none (dopiero ustawiane niżej).
                // scrollTop ustawiony na elemencie wewnątrz ukrytego przodka bywa
                // zawodny (gubiony) w przeglądarkach mobilnych — dlatego wołamy to
                // dopiero PO ov.style.display='flex', tak jak karuzelę snu.
            }

            // Update workout preview card
            function TYPE_LABEL_CI(typ) { return typ ? t('wtypeci.' + typ) : ''; }
            const previewTitle = document.getElementById('ci-preview-title');
            const previewSub   = document.getElementById('ci-preview-sub');
            if (previewTitle) previewTitle.textContent = TYPE_LABEL_CI(workoutType) || workoutType;
            if (previewSub) {
                // Pełny obraz planu: dystans · szacowany czas (zawsze, dzięki fallbackowi
                // w _ciEstTotalMin — nie znika, gdy plan nie ma wpisanego realnego tempa)
                const parts = [];
                if (workoutData.dystans_km) parts.push(workoutData.dystans_km + ' km');
                if (workoutData.dystans_km) {
                    const estMin = _ciEstTotalMin(workoutType, workoutData.dystans_km);
                    if (estMin > 0) parts.push('~' + _fmtMin(estMin));
                }
                if (window._todayPace) parts.push(String(window._todayPace).replace(/\s*min\/km\s*$/i, '') + '/km');
                previewSub.textContent = parts.length ? parts.join(' · ')
                    : t('ci.planloading');
            }
            // Panel startu tylko w dniu celu i tylko w trybie potreningowym.
            _ciRaceTime = '';
            // W dniu celu przełącznik startu jest włączony z góry (najczęstszy przypadek),
            // ale dostępny jest zawsze — patrz komentarz przy _ciToggleRace.
            _ciIsRace = (mode === 'post') && _ciIsRaceDay();
            const raceBox = document.getElementById('ci-race-box');
            if (raceBox) {
                raceBox.style.display = (mode === 'post') ? '' : 'none';
                const inp = document.getElementById('ci-race-time');
                if (inp) { inp.value = ''; inp.disabled = false; }
                document.getElementById('ci-race-toggle')?.classList.toggle('s', _ciIsRace);
                const det = document.getElementById('ci-race-detail');
                if (det) det.style.display = _ciIsRace ? '' : 'none';
                const hint = document.getElementById('ci-race-hint');
                if (hint) hint.textContent = _ciIsRaceDay()
                    ? t('ci.raceday') : t('ci.racehint');
            }

            const m2desc = document.getElementById('step-morning-4-desc');
            if (m2desc) m2desc.textContent = workoutData.dystans_km
                ? t('ci.ready.desc.plan').replace('{type}', TYPE_LABEL_CI(workoutType) || workoutType).replace('{km}', workoutData.dystans_km)
                : t('ci.ready.desc');

            _checkinStepsLockedHeight = 0;
            // Reset all steps to inactive
            document.querySelectorAll('#checkin-overlay .step').forEach(s => {
                s.classList.remove('active');
                s.classList.remove('is-leaving');
                s.style.opacity = '0';
                s.style.transform = 'translateY(12px)';
                s.style.animation = '';
            });
            // Activate first step
            const firstStep = document.getElementById(`step-${currentMode}-0`);
            if (firstStep) {
                firstStep.classList.add('active');
                firstStep.style.opacity='';
                firstStep.style.transform='';
            }

            // Reset all next buttons in overlay
            document.querySelectorAll('#checkin-overlay .btn-next:not(.done-btn)').forEach(b => b.classList.remove('visible'));
            // M0 sleep hours and M2 energy are always visible (no selection required / slider always has a value)
            const m0btn = document.querySelector('#step-morning-0 .btn-next');
            if (m0btn) m0btn.classList.add('visible');
            const m2btn = document.querySelector('#step-morning-2 .btn-next');
            if (m2btn) m2btn.classList.add('visible');
            const p1btn = document.querySelector('#step-post-0 .btn-next');
            if (p1btn) p1btn.classList.add('visible');

            // Reset sleep/rpe/readiness selections
            document.querySelectorAll('#checkin-overlay .sleep-card').forEach(c => { c.classList.remove('selected'); c.style.borderColor=''; });
            const _rpeS = document.getElementById('rpeSlider'); if (_rpeS) { _rpeS.value = 5; updateRpeSlider(); }
            document.querySelectorAll('#checkin-overlay .readiness-btn').forEach(b => { b.classList.remove('selected'); b.style.borderColor=''; });
            document.getElementById('next-morning-1')?.classList.remove('visible');
            document.getElementById('next-morning-3')?.classList.remove('visible');
            document.getElementById('next-morning-4')?.classList.remove('visible');
            document.getElementById('next-post-1')?.classList.remove('visible');
            document.getElementById('next-post-2')?.classList.remove('visible');
            // Reset body recovery selections
            document.querySelectorAll('#step-morning-3 .readiness-btn').forEach(b => { b.classList.remove('selected'); b.style.borderColor = ''; });
            // Hide mode toggle if mode is fixed
            document.getElementById('modeToggle').style.display = 'none';

            // Reinit slider and duration
            initModeSlider();
            updateSlider();
            updateProgress();

            // Show overlay (invisible) first so we can measure scrollHeight correctly
            const ov   = document.getElementById('checkin-overlay');
            const card = document.getElementById('ci-card');
            // Wyzeruj ewentualne zapamiętane poziome przesunięcie kontenera
            // (overflow-x:hidden nie resetuje scrollLeft — treść wyglądała na przesuniętą)
            const innerEl = document.getElementById('ci-inner');
            if (innerEl) {
                innerEl.scrollLeft = 0; innerEl.scrollTop = 0;
                // Pin osi X: gdyby silnik mimo wszystko przewinął kontener w bok
                // (focus inputu, scroll-chaining z pickerów) — natychmiast wracamy na 0
                if (!innerEl._xPinned) {
                    innerEl._xPinned = true;
                    innerEl.addEventListener('scroll', () => { if (innerEl.scrollLeft) innerEl.scrollLeft = 0; }, { passive: true });
                }
            }
            // Stempel wersji + tryb debug (?debug=1 albo localStorage.velm_debug='1')
            const stampEl = document.getElementById('ci-build-stamp');
            if (stampEl) stampEl.textContent = VELM_BUILD;
            if (location.search.indexOf('debug=1') !== -1 || localStorage.getItem('velm_debug') === '1') {
                let dbg = document.getElementById('ci-debug-info');
                if (!dbg && innerEl) {
                    dbg = document.createElement('div');
                    dbg.id = 'ci-debug-info';
                    dbg.style.cssText = 'font-size:9px;line-height:1.4;color:#8A8A8A;word-break:break-all;margin:0 0 10px;';
                    innerEl.insertBefore(dbg, innerEl.firstChild);
                }
                if (dbg) {
                    const sup = (p, v) => (window.CSS && CSS.supports && CSS.supports(p, v)) ? 'TAK' : 'NIE';
                    dbg.textContent = VELM_BUILD + ' · clip:' + sup('overflow-x', 'clip') + ' · inset:' + sup('inset', '0') + ' · ' + navigator.userAgent;
                }
            }
            // Skasuj ewentualny wiszący timer z closeCheckin (race: zamknij->otwórz <300ms)
            clearTimeout(_ciCloseTimer);
            _ciCloseTimer = null;
            ov.style.animation = '';
            // Wyczyść inline'y po animacji zamknięcia — wejście karty robi w całości
            // CSS-owe ciEntrance (restartuje się samo przy display:none→flex)
            card.style.opacity = '';
            card.style.transition = '';
            card.style.transform = '';
            ov.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            // Init dynamic pickers — TERAZ overlay jest już display:flex, więc
            // scrollTop ustawiony na kolumnach karuzeli faktycznie "łapie się"
            // na każdej przeglądarce (patrz komentarz przy showPost0Section wyżej)
            initCiPickers(document.getElementById('ci-pk-sleep'));
            if (currentMode === 'post') showPost0Section();

            requestAnimationFrame(() => {
                lockStepsHeight();
                updateStepsHeight();
            });
            // Domiar po zakończeniu animacji wejścia i po dociągnięciu fontów —
            // na wolnych telefonach font podmienia się PO pierwszym pomiarze
            // i krok robi się wyższy niż zablokowana wysokość
            setTimeout(() => updateStepsHeight(), 500);
            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(() => {
                    const o = document.getElementById('checkin-overlay');
                    if (o && o.style.display !== 'none') updateStepsHeight();
                });
            }

            // Fade-in overlaya (karta wjeżdża CSS-owym ciEntrance — jedyna animacja karty)
            ov.style.animation = 'ciOverlayIn 300ms ease forwards';
        }

        // Timer chowania overlayu — openCheckin MUSI go kasować, inaczej szybkie
        // zamknij->otwórz (<300ms) chowa świeżo otwarty check-in
        let _ciCloseTimer = null;
        function closeCheckin() {
            _checkinSending = false;   // zwalniamy blokade podwojnego wyslania
            const ov   = document.getElementById('checkin-overlay');
            const card = document.getElementById('ci-card');
            card.style.transition = 'transform 280ms cubic-bezier(0.4,0,1,1), opacity 200ms ease-in';
            card.style.transform  = 'translateY(80px)';
            card.style.opacity    = '0';
            ov.style.animation = 'ciOverlayOut 300ms ease forwards';
            clearTimeout(_ciCloseTimer);
            _ciCloseTimer = setTimeout(() => {
                ov.style.display = 'none';
                ov.style.animation = '';
                card.style.transform = '';
                card.style.transition = '';
                card.style.opacity = '';
            }, 300);
            document.body.style.overflow = '';
        }

        function initModeSlider() {
            const wrap = document.getElementById('modeToggle');
            const slider = document.getElementById('modeSlider');
            if (!wrap || !slider) return;
            const activeBtn = wrap.querySelectorAll('.mode-btn')[currentMode === 'morning' ? 0 : 1];
            slider.style.left  = (activeBtn.offsetLeft + 3) + 'px';
            slider.style.width = activeBtn.offsetWidth + 'px';
        }

        function setMode(mode) {
            if (mode === currentMode) return;
            document.getElementById('ci-inner')?.scrollTo({ top: 0, behavior: 'auto' });
            const oldId = inSorenessDetail ? 'step-soreness-detail' : inReadinessFollowup ? 'step-morning-followup' : inFollowUp ? (followUpSubStep === 0 ? 'step-post-2b' : followUpSubStep === 1 ? 'step-post-2c' : 'step-post-2d') : `step-${currentMode}-${currentStep}`;
            const oldStepEl = document.getElementById(oldId);
            if (oldStepEl) {
                oldStepEl.style.animation = 'ciStepExit 180ms ease-in forwards';
                setTimeout(() => { oldStepEl.classList.remove('active'); oldStepEl.style.animation = ''; }, 180);
            }
            currentMode = mode; currentStep = 0; inFollowUp = false;
            document.getElementById('btn-morning').classList.toggle('active', mode === 'morning');
            document.getElementById('btn-post').classList.toggle('active', mode === 'post');
            const activeBtn = document.getElementById(`btn-${mode}`);
            const mslider = document.getElementById('modeSlider');
            mslider.style.left  = activeBtn.offsetLeft + 'px';
            mslider.style.width = activeBtn.offsetWidth + 'px';
            setTimeout(() => {
                const newStepEl = document.getElementById(`step-${mode}-0`);
                // Wyczyść resztkowe inline style (opacity:0/transform) z resetu w openCheckin,
                // inaczej po zakończeniu animacji krok wróci do niewidocznego stanu
                newStepEl.style.opacity = '';
                newStepEl.style.transform = '';
                newStepEl.style.animation = 'ciStepEnter 220ms ease-out forwards';
                newStepEl.classList.add('active');
                newStepEl.addEventListener('animationend', () => { newStepEl.style.animation = ''; }, { once: true });
                updateProgress();
            }, 180);
        }

        function goNext() {
            if (inSorenessDetail) {
                inSorenessDetail = false;
                _sendCheckinData();
                return;
            }
            if (inReadinessFollowup) {
                inReadinessFollowup = false;
                if (readinessFollowup === 'soreness') {
                    inSorenessDetail = true;
                    animateStep('step-morning-followup', 'step-soreness-detail');
                } else {
                    _sendCheckinData();
                }
                return;
            }
            if (inFollowUp) {
                if (followUpSubStep === 0) {
                    followUpSubStep = 1;
                    _buildFollowUp2c();
                    animateStep('step-post-2b', 'step-post-2c');
                    return;
                }
                if (followUpSubStep === 1) {
                    followUpSubStep = 2;
                    animateStep('step-post-2c', 'step-post-2d');
                    return;
                }
                // followUpSubStep === 2: "Dam radę sam" — koniec, mamy już wszystko
                // (faktyczny dystans z 2b, przyczyny z 2c) — bez dodatkowego kroku
                inFollowUp = false; followUpSubStep = 0;
                _sendCheckinData();
                return;
            }
            // Morning: after readiness step (step 4), handle followup or send
            if (currentMode === 'morning' && currentStep === 4) {
                if (isFightingReadiness()) {
                    inReadinessFollowup = true;
                    animateStep('step-morning-4', 'step-morning-followup');
                } else {
                    _sendCheckinData();
                }
                return;
            }
            // Completion routing (post)
            if (currentMode === 'post' && currentStep === 2) {
                if (selectedCompletion === 'less') {
                    skippedParts = new Set(); followUpSelections = new Set(); followUpCauses = new Set(); followUpSubStep = 0;
                    _buildFollowUp2b();
                    inFollowUp = true;
                    animateStep('step-post-2', 'step-post-2b');
                    setTimeout(() => updateStepsHeight(), 420);
                    return;
                }
                if (selectedCompletion === 'more') {
                    // "Więcej niż w planie" → dopytaj o faktyczny dystans (step-post-3)
                    animateStep('step-post-2', 'step-post-3');
                    currentStep = 3; updateProgress();
                    setTimeout(() => updateStepsHeight(), 420);
                    return;
                }
                // "Zgodnie z planem" — RPE + zgodność z planem to komplet, bez dopytywania
                _sendCheckinData();
                return;
            }
            if (currentStep >= TOTAL_STEPS - 1) return;
            const fromId   = `step-${currentMode}-${currentStep}`;
            const nextStep = currentStep + 1;
            const toId = `step-${currentMode}-${nextStep}`;
            animateStep(fromId, toId);
            currentStep = nextStep; updateProgress();
            setTimeout(() => updateStepsHeight(), 420);
        }

        function animateStep(fromId, toId) {
            // Każdy kolejny krok startuje od góry — jeśli user doczytał poprzedni
            // krok do końca (dłuższa lista opcji), następny nie otwiera się
            // "wjechany" w środek treści
            document.getElementById('ci-inner')?.scrollTo({ top: 0, behavior: 'auto' });
            const fromEl = document.getElementById(fromId);
            const toEl   = document.getElementById(toId);
            if (!fromEl || !toEl) {
                console.error('animateStep: CRITICAL FAIL', { fromId, toId });
                if (toEl) {
                    // openCheckin ustawia inline opacity:0/transform na krokach — trzeba je
                    // wyczyścić, inaczej inline nadpisze CSS .active i krok zostanie niewidoczny
                    toEl.style.opacity = '';
                    toEl.style.transform = '';
                    toEl.classList.add('active');
                }
                return;
            }

            document.querySelectorAll('#checkin-overlay .step.is-leaving').forEach((step) => step.classList.remove('is-leaving'));

            if (fromEl && fromEl !== toEl) {
                fromEl.classList.add('is-leaving');
                fromEl.classList.remove('active');
            }

            toEl.classList.remove('is-leaving');
            requestAnimationFrame(() => {
                // Wyczyść resztkowe inline style z resetu w openCheckin (opacity:0 / translateY(12px)),
                // żeby CSS .step.active (opacity:1) mógł zadziałać — inline zawsze wygrywa nad arkuszem
                toEl.style.opacity = '';
                toEl.style.transform = '';
                toEl.classList.add('active');
                updateStepsHeight();
            });
        }

        function finish(evt) {
            const btn = (evt?.target) || (typeof event !== 'undefined' ? event?.target : null);
            if (btn) { btn.style.transform = 'scale(0.96)'; setTimeout(() => { btn.style.transform = ''; }, 150); }
            _sendCheckinData();
        }

        function sendMorningCheckinToAI() {
            const userId = localStorage.getItem('velm_user_id');
            if (!userId) return;
            const sleepIdx = [...document.querySelectorAll('#checkin-overlay .sleep-card')].findIndex(c => c.classList.contains('selected'));
            const sleep    = sleepIdx >= 0 ? sleepIdx + 1 : '?';
            const energy   = document.getElementById('energySlider')?.value ?? '?';
            const readinessEl = document.querySelector('#step-morning-4 .readiness-btn.selected');
            const readiness   = readinessEl?.textContent?.trim() ?? '?';
            const hoursStr = (sleepH > 0 || sleepM > 0) ? `${sleepH}h${sleepM > 0 ? ' ' + sleepM + 'min' : ''}` : '?';
            const recoveryStr = muscleRecovery || '?';
            const msg = `CHECK-IN PORANNY: sen=${sleep}/5, godziny_snu=${hoursStr}, energia=${energy}/10, regeneracja_miesni=${recoveryStr}, gotowosc=${readiness}`;
            authFetch(`${API_BASE}/api/chat`, {
                method:'POST', headers: authHeaders(),
                body: JSON.stringify({ userId, message: msg, agent: 'analityk' })
            }).catch(() => {});

            // Zapisz strukturalnie do health_metrics
            const sleepVal = sleepIdx >= 0 ? sleepIdx + 1 : null;
            const energyVal = parseInt(document.getElementById('energySlider')?.value) || null;
            const readinessVal = readinessEl?.textContent?.trim() ?? null;
            authFetch(`${API_BASE}/api/checkin`, {
                method: 'POST', headers: authHeaders(),
                body: JSON.stringify({
                    userId,
                    type: 'morning',
                    data: {
                        sleep: sleepVal, energy: energyVal, readiness: readinessVal,
                        readiness_followup: readinessFollowup || null,
                        soreness_location: sorenessLocation || null, soreness_duration: sorenessDuration || null,
                        sleep_hours: sleepHours || null, muscle_recovery: muscleRecovery || null
                    }
                })
            }).catch(() => {});
        }

        async function sendPostCheckinToAI() {
            const userId = localStorage.getItem('velm_user_id');
            // Wcześniej ciche `return` — flaga "check-in zrobiony" zostawała ustawiona,
            // więc wylogowany użytkownik tracił trening bez śladu. Rzucamy, żeby
            // zadziałało cofnięcie flagi i komunikat.
            if (!userId) throw new Error(t('ci.nouser'));
            const msg = buildAiMessage();
            const completion = selectedCompletion || 'exact';
            // Faktyczny dystans: "krótszy dystans" (easy/long) lub "mniejszy dystans
            // całkowity" (walkrun) → licznik z kroku 2b; "więcej niż w planie" →
            // licznik z kroku 3, ALE tylko dla easy/long, bo dla interval/tempo/
            // walkrun moreVal niesie inną jednostkę (powtórzenia/serie/km odcinka —
            // patrz completed_repeats/working_distance_km/completed_series niżej),
            // nie łączny dystans. Tempo AI liczy samo z distance_km/duration_min,
            // więc ręczne wpisywanie tempa (i tak niedostępne dla kogoś bez
            // zegarka biegowego) jest zbędne.
            const needsKmLess = (((workoutType === 'easy' || workoutType === 'long') && followUpSelections.has('krotszy_dystans')) ||
                                  (workoutType === 'walkrun' && followUpSelections.has('mniej_km'))) && fuKmVal > 0;
            const actualKm = needsKmLess
                ? fuKmVal
                : (selectedCompletion === 'more' && (workoutType === 'easy' || workoutType === 'long') && moreVal > 0)
                ? moreVal
                : workoutData.dystans_km;
            const workoutPayload = {
                date: todayStr(),
                distance_km: actualKm,
                duration_min: durH * 60 + durM + durS / 60, rpe: rpeVal,
                type: workoutType, completion, notes: msg,
                source: 'manual',
                skipped_parts: skippedParts.size > 0 ? [...skippedParts] : null
            };
            // Start zapisujemy TYLKO gdy user faktycznie wystartował i podał czas —
            // inaczej flaga bez czasu i tak nie zakotwiczy formy ani nie rozstrzygnie celu.
            if (_ciIsRace) {
                const _raceSec = _ciParseRaceSec(_ciRaceTime);
                if (_raceSec) {
                    workoutPayload.is_race = true;
                    workoutPayload.race_official_time_sec = _raceSec;
                }
            }
            if (workoutType === 'interval') {
                if (segmentRepeats > 0) workoutPayload.completed_repeats = segmentRepeats;
                if (workoutData.powtorzenia) workoutPayload.planned_repeats = workoutData.powtorzenia;
                if (workSegH + workSegM + workSegS > 0) workoutPayload.working_segment_duration_min = workSegH * 60 + workSegM + workSegS / 60;
                if (workoutData.odcinek_km > 0) workoutPayload.working_distance_km = workoutData.odcinek_km;
            }
            if (workoutType === 'tempo') {
                if (segmentWorkKm > 0) workoutPayload.working_distance_km = segmentWorkKm;
                if (workSegH + workSegM + workSegS > 0) workoutPayload.working_segment_duration_min = workSegH * 60 + workSegM + workSegS / 60;
            }
            if (workoutType === 'walkrun') {
                if (segmentSeries > 0) workoutPayload.completed_series = segmentSeries;
                if (workoutData.serie) workoutPayload.planned_series = workoutData.serie;
            }
            // Wcześniej: goły fetch z .catch(() => {}). To gubiło trening na DWA sposoby —
            // błąd sieci szedł w pustą funkcję, a 401 w ogóle nie jest odrzuceniem
            // (fetch rozwiązuje się z res.ok === false), więc wygasły token oznaczał
            // cichą utratę danych. apiFetch odświeża token i RZUCA, gdy się nie uda.
            await apiFetch('/api/workout', {
                method: 'POST',
                body: { userId, workout: workoutPayload }
            });
            // Analityka wołamy DOPIERO gdy trening jest w bazie. Odwrotna kolejność
            // (jak było) przy nieudanym zapisie zostawiała wiadomość w czacie bez
            // treningu, a powtórzony check-in dokładał jej duplikat. Błąd samej
            // wiadomości nie może już cofać zapisanego treningu — ale nie chowamy go.
            apiFetch('/api/chat', {
                method: 'POST',
                body: { userId, message: msg, agent: 'analityk' }
            }).catch(err => console.error('checkin: wiadomość do analityka nie poszła —', err?.message || err));
        }

        function updateProgress() {
            const steps = currentMode === 'morning' ? TOTAL_STEPS : 4;
            const dot4 = document.getElementById('dot-4');
            const line3wrap = document.getElementById('line-3-wrap');
            if (dot4) dot4.style.display = currentMode === 'morning' ? '' : 'none';
            if (line3wrap) line3wrap.style.display = currentMode === 'morning' ? '' : 'none';
            for (let i = 0; i < steps; i++) {
                const dot = document.getElementById(`dot-${i}`);
                if (!dot) continue;
                dot.classList.remove('active', 'done');
                if (i < currentStep) dot.classList.add('done');
                else if (i === currentStep) dot.classList.add('active');
            }
            for (let i = 0; i < steps - 1; i++) {
                const fill = document.getElementById(`line-${i}`);
                if (fill) fill.style.width = i < currentStep ? '100%' : '0%';
            }
        }

        function lockStepsHeight() {
            const outer = document.getElementById('stepsOuter');
            if (!outer) return 0;

            const steps = [...outer.querySelectorAll('.step')];
            if (!steps.length) return 0;

            const prevOuterHeight = outer.style.height;
            const prevOuterMinHeight = outer.style.minHeight;
            const prevStepStyles = steps.map((step) => ({
                position: step.style.position,
                opacity: step.style.opacity,
                transform: step.style.transform,
                pointerEvents: step.style.pointerEvents,
                visibility: step.style.visibility,
                gridArea: step.style.gridArea,
                display: step.style.display,
            }));

            outer.style.height = 'auto';
            outer.style.minHeight = '0';

            steps.forEach((step) => {
                step.style.position = 'static';
                step.style.gridArea = 'auto';
                step.style.opacity = '0';
                step.style.transform = 'none';
                step.style.pointerEvents = 'none';
                step.style.visibility = 'hidden';
                step.style.display = 'block';
            });

            // offsetHeight, NIE getBoundingClientRect — rect kurczy się pod scale(0.96)
            // animacji wejścia karty i wysokość wychodziła ~4% za mała (przycisk
            // "Dalej" nachodził na stopkę "velm · sztab AI" na wysokich krokach)
            const maxHeight = Math.max(...steps.map((step) => step.offsetHeight || 0), 0);

            steps.forEach((step, idx) => {
                const prev = prevStepStyles[idx];
                step.style.position = prev.position;
                step.style.opacity = prev.opacity;
                step.style.transform = prev.transform;
                step.style.pointerEvents = prev.pointerEvents;
                step.style.visibility = prev.visibility;
                step.style.gridArea = prev.gridArea;
                step.style.display = prev.display;
            });

            if (maxHeight > 0) {
                _checkinStepsLockedHeight = Math.max(_checkinStepsLockedHeight || 0, maxHeight);
                outer.style.height = `${_checkinStepsLockedHeight}px`;
                outer.style.minHeight = `${_checkinStepsLockedHeight}px`;
            } else {
                outer.style.height = prevOuterHeight;
                outer.style.minHeight = prevOuterMinHeight;
            }

            return _checkinStepsLockedHeight || maxHeight;
        }

        function updateStepsHeight() {
            const outer = document.getElementById('stepsOuter');
            if (!outer) return 0;

            // offsetHeight — odporny na scale() animacji wejścia (patrz lockStepsHeight)
            const active = document.querySelector('#checkin-overlay .step.active');
            const activeHeight = active ? (active.offsetHeight || 0) : 0;

            if (activeHeight > 0) {
                // Wysokość podąża za AKTYWNYM krokiem (transition na .steps-outer
                // animuje zmianę). Bez ratchetu do najwyższego kroku — krótkie kroki
                // nie mają pustki na dole i karta nie przewija się bez potrzeby.
                _checkinStepsLockedHeight = activeHeight;
                outer.style.height = `${activeHeight}px`;
                outer.style.minHeight = `${activeHeight}px`;
            }

            return activeHeight;
        }

        const SLEEP_COLORS = ['#C07264', '#C4A35A', '#6B8F71', '#6B8F71', '#4A6B50'];
        function selectSleep(idx) {
            document.querySelectorAll('#checkin-overlay .sleep-card').forEach((c, i) => {
                const sel = i === idx;
                c.classList.toggle('selected', sel);
                c.style.borderColor = sel ? SLEEP_COLORS[i] : '';
            });
            showBtn('next-morning-1');
        }

        function updateSlider() {
            const slider = document.getElementById('energySlider');
            if (!slider) return;
            const val = parseInt(slider.value);
            const sliderVal = document.getElementById('sliderVal');
            if (sliderVal) sliderVal.textContent = `${val}/10`;
            const pct = (val - 1) / 9 * 100;
            const c = val <= 3 ? '#C07264' : val <= 5 ? '#C4A35A' : val <= 7 ? '#6B8F71' : '#4A6B50';
            slider.style.background = `linear-gradient(to right, ${c} ${pct}%, #D8D2C4 ${pct}%)`;
            const descs = {}; for (let _i = 1; _i <= 10; _i++) descs[_i] = t('ci.mood.' + _i);
            const sliderDesc = document.getElementById('sliderDesc');
            if (sliderDesc) sliderDesc.textContent = descs[val] || '';
        }

        function selectReadiness(btn) {
            document.querySelectorAll('#step-morning-4 .readiness-btn').forEach(b => { b.classList.remove('selected'); b.style.borderColor = ''; });
            btn.classList.add('selected');
            btn.style.borderColor = btn.dataset.color;
            showBtn('next-morning-4');
        }

        function selectBodyRecovery(btn) {
            document.querySelectorAll('#step-morning-3 .readiness-btn').forEach(b => { b.classList.remove('selected'); b.style.borderColor = ''; });
            btn.classList.add('selected');
            btn.style.borderColor = btn.dataset.color;
            muscleRecovery = btn.dataset.recovery || null;
            showBtn('next-morning-3');
        }

        const CI_PK_H = 52, CI_PK_PAD = 3, CI_PK_CONT_H = 200;
        function _parsePaceMin(s) { const m = String(s||'').match(/(\d+):(\d+)/); return m ? parseInt(m[1]) + parseInt(m[2])/60 : null; }
        function _fmtMin(total) { const h = Math.floor(total/60), m = total%60; return h > 0 ? `${h}h ${m} min` : `${m} min`; }
        // Domyślne tempo per typ treningu — gdy plan nie ma wpisanego konkretnego
        // tempa (częste przy easy/long), i tak liczymy szacowany czas zamiast go
        // pomijać. Bez tego karta planu i podgląd poranny potrafiły pokazać samo
        // "6 km" bez czasu, kiedy window._todayPace było puste.
        const CI_FALLBACK_PACE = { easy: 6.5, long: 6.5, walkrun: 8.0, tempo: 5.0, interval: 4.5 };
        // Kolejność: (1) realne tempo ODCINKA z planu (najdokładniejsze — dla
        // interwałów/tempo bywa dużo szybsze niż ogólne tempo dnia, np. 3:40 vs 5:05),
        // (2) ogólne tempo dnia z planu, (3) sensowny fallback per typ
        function _ciEstPaceMin(type) {
            return _parsePaceMin(workoutData.tempo_odcinka) || _parsePaceMin(window._todayPace) || CI_FALLBACK_PACE[type] || 6.5;
        }
        // Zaokrąglone minuty total = tempo(min/km) x dystans(km); zawsze > 0 gdy km > 0
        function _ciEstTotalMin(type, km) { return Math.round(_ciEstPaceMin(type) * (km || 0)); }

        function _ciPkCol(values, initVal, key) {
            const selIdx = Math.max(0, values.indexOf(initVal));
            const initScroll = (CI_PK_PAD + selIdx) * CI_PK_H - (CI_PK_CONT_H / 2 - CI_PK_H / 2);
            const pad = `<div class="ci-pk-item" data-pad="1" style="height:${CI_PK_H}px"></div>`;
            const padHtml = pad.repeat(CI_PK_PAD);
            const needsPad = key === 'sleepM' || key === 'durM' || key === 'durS' || key === 'workSegM' || key === 'workSegS';
            const itemsHtml = values.map((v, i) => {
                const dist = Math.abs(i - selIdx);
                const cls = dist === 0 ? 'sel' : dist === 1 ? 'near1' : dist === 2 ? 'near2' : 'far';
                const lbl = needsPad ? String(v).padStart(2, '0') : String(v);
                return `<div class="ci-pk-item ${cls}" data-val="${v}" style="height:${CI_PK_H}px">${lbl}</div>`;
            }).join('');
            return `<div class="ci-pk-col" data-key="${key}" data-init="${initScroll}">${padHtml}${itemsHtml}${padHtml}</div>`;
        }

        function _buildCiSleepPicker() {
            const hVals = Array.from({length:13}, (_, i) => i);
            const mVals = [0, 10, 20, 30, 40, 50];
            return `<div class="ci-pk-row">
                <div class="ci-pk-field"><div class="ci-pk-label">h</div><div class="ci-pk-wrap"><div class="ci-pk-highlight"></div>${_ciPkCol(hVals, sleepH, 'sleepH')}</div></div>
                <div class="ci-pk-sep">:</div>
                <div class="ci-pk-field"><div class="ci-pk-label">min</div><div class="ci-pk-wrap"><div class="ci-pk-highlight"></div>${_ciPkCol(mVals, sleepM, 'sleepM')}</div></div>
            </div>`;
        }

        function _buildCiDurPicker() {
            const hVals = Array.from({length:24}, (_, i) => i);
            const mVals = Array.from({length:60}, (_, i) => i);
            const sVals = Array.from({length:12}, (_, i) => i * 5);
            return `<div class="ci-pk-row">
                <div class="ci-pk-field"><div class="ci-pk-label">h</div><div class="ci-pk-wrap"><div class="ci-pk-highlight"></div>${_ciPkCol(hVals, durH, 'durH')}</div></div>
                <div class="ci-pk-sep">:</div>
                <div class="ci-pk-field"><div class="ci-pk-label">min</div><div class="ci-pk-wrap"><div class="ci-pk-highlight"></div>${_ciPkCol(mVals, durM, 'durM')}</div></div>
                <div class="ci-pk-sep">:</div>
                <div class="ci-pk-field"><div class="ci-pk-label">sek</div><div class="ci-pk-wrap"><div class="ci-pk-highlight"></div>${_ciPkCol(sVals, Math.round(durS / 5) * 5, 'durS')}</div></div>
            </div>`;
        }

        function _buildCiWsegPicker() {
            const hVals = [0, 1, 2, 3];
            const mVals = Array.from({length:60}, (_, i) => i);
            const sVals = Array.from({length:12}, (_, i) => i * 5);
            return `<div class="ci-pk-row">
                <div class="ci-pk-field"><div class="ci-pk-label">h</div><div class="ci-pk-wrap"><div class="ci-pk-highlight"></div>${_ciPkCol(hVals, workSegH, 'workSegH')}</div></div>
                <div class="ci-pk-sep">:</div>
                <div class="ci-pk-field"><div class="ci-pk-label">min</div><div class="ci-pk-wrap"><div class="ci-pk-highlight"></div>${_ciPkCol(mVals, workSegM, 'workSegM')}</div></div>
                <div class="ci-pk-sep">:</div>
                <div class="ci-pk-field"><div class="ci-pk-label">sek</div><div class="ci-pk-wrap"><div class="ci-pk-highlight"></div>${_ciPkCol(sVals, Math.round(workSegS / 5) * 5, 'workSegS')}</div></div>
            </div>`;
        }

        function initCiPickers(container) {
            if (!container) return;
            container.querySelectorAll('.ci-pk-col').forEach(col => {
                col.scrollTop = parseInt(col.dataset.init || '0', 10);
                col.addEventListener('scroll', () => onCiPkScroll(col));
                onCiPkScroll(col);
            });
        }

        function onCiPkScroll(el) {
            const containerH = el.offsetHeight || CI_PK_CONT_H;
            const offset = containerH / 2 - CI_PK_H / 2;
            const totalIdx = Math.round((el.scrollTop + offset) / CI_PK_H);
            el.querySelectorAll('.ci-pk-item').forEach((item, k) => {
                if (item.dataset.pad) { item.className = 'ci-pk-item'; return; }
                const dist = Math.abs(k - totalIdx);
                item.className = 'ci-pk-item ' + (dist === 0 ? 'sel' : dist === 1 ? 'near1' : dist === 2 ? 'near2' : 'far');
            });
            const realIdx = totalIdx - CI_PK_PAD;
            const valueItems = el.querySelectorAll('.ci-pk-item[data-val]');
            if (valueItems.length === 0) return;
            const clampedIdx = Math.max(0, Math.min(valueItems.length - 1, realIdx));
            const val = parseFloat(valueItems[clampedIdx].dataset.val);
            const key = el.dataset.key;
            if (key === 'sleepH')        { sleepH = val; sleepHours = sleepH + sleepM / 60; }
            else if (key === 'sleepM')   { sleepM = val; sleepHours = sleepH + sleepM / 60; }
            else if (key === 'durH')     { durH = val; duration = durH * 60 + durM + durS / 60; }
            else if (key === 'durM')     { durM = val; duration = durH * 60 + durM + durS / 60; }
            else if (key === 'durS')     { durS = val; duration = durH * 60 + durM + durS / 60; }
            else if (key === 'workSegH') workSegH = val;
            else if (key === 'workSegM') workSegM = val;
            else if (key === 'workSegS') workSegS = val;
        }

        function showPost0Section() {
            ['duration', 'interval', 'tempo', 'walkrun'].forEach(id => {
                const el = document.getElementById('post0-' + id);
                if (el) el.classList.remove('active');
            });
            const map = { easy: 'duration', long: 'duration', rest: 'duration', interval: 'interval', tempo: 'tempo', walkrun: 'walkrun' };
            const sectionEl = document.getElementById('post0-' + (map[workoutType] || 'duration'));
            if (sectionEl) sectionEl.classList.add('active');
            // Wartości segmentów idą z planu (kontrolki ręcznej korekty usunięte —
            // odchylenia łapie gałąź "mniej niż plan" w kroku "Jak poszło?")
            if (workoutType === 'interval') {
                segmentRepeats = workoutData.powtorzenia || 8;
                intervalDistanceM = workoutData.dystans_odcinka_m || 400;
            } else if (workoutType === 'tempo') {
                segmentWorkKm = workoutData.odcinek_km || 6;
            } else if (workoutType === 'walkrun') {
                segmentSeries = workoutData.serie || 6;
            }
            const _pkMap = { duration: 'ci-pk-dur-easy', interval: 'ci-pk-wseg-interval', tempo: 'ci-pk-wseg-tempo', walkrun: 'ci-pk-dur-walkrun' };
            const _pkId = _pkMap[map[workoutType] || 'duration'];
            if (_pkId) {
                const _pkEl = document.getElementById(_pkId);
                if (_pkEl) {
                    const _isWseg = (workoutType === 'interval' || workoutType === 'tempo');
                    _pkEl.innerHTML = _isWseg ? _buildCiWsegPicker() : _buildCiDurPicker();
                    initCiPickers(_pkEl);
                }
            }
            // Karty "Plan na dziś" — jedna w KAŻDYM kroku post (pytanie → odpowiedź →
            // przypomnienie planu). Zamiast tempa PRZEWIDYWANY CZAS — ta sama wartość,
            // na której startuje karuzela. Treść zależna od typu treningu.
            const _dk = workoutData.dystans_km || 0;
            const _it = (val, unit, lbl) =>
                `<div class="cpc-item"><div class="cpc-val">${val}${unit ? `<small>${unit}</small>` : ''}</div><div class="cpc-lbl">${lbl}</div></div>`;
            const items = [];
            if (workoutType === 'interval') {
                items.push(_it(workoutData.powtorzenia || 8, '×', t('ci.card.reps')));
                items.push(_it(intervalDistanceM || 400, 'm', t('ci.card.segment')));
                if (workSegH || workSegM || workSegS) {
                    // Godziny NIE mogą się pogubić — przy odcinkach >1h sam M:SS
                    // pokazywałby np. "5:00" zamiast prawdziwych "1:05:00"
                    const _wt = workSegH > 0
                        ? `${workSegH}:${String(workSegM).padStart(2, '0')}:${String(workSegS).padStart(2, '0')}`
                        : `${workSegM}:${String(workSegS).padStart(2, '0')}`;
                    items.push(_it(`~${_wt}`, '', t('ci.card.esttime')));
                }
            } else if (workoutType === 'tempo') {
                if (workoutData.odcinek_km) items.push(_it(workoutData.odcinek_km, 'km', t('ci.card.segment')));
                if (workSegH * 60 + workSegM) items.push(_it('~' + _fmtMin(workSegH * 60 + workSegM), '', t('ci.card.esttime')));
            } else if (workoutType === 'walkrun') {
                if (workoutData.serie) items.push(_it(workoutData.serie, '×', t('ci.card.sets')));
                if (_dk) items.push(_it(_dk, 'km', t('ci.card.dist')));
                if (durH * 60 + durM) items.push(_it('~' + _fmtMin(durH * 60 + durM), '', t('ci.card.esttime')));
            } else {
                if (_dk) items.push(_it(_dk, 'km', t('ci.card.dist')));
                if (durH * 60 + durM) items.push(_it('~' + _fmtMin(durH * 60 + durM), '', t('ci.card.esttime')));
            }
            const _itemsHtml = items.join('');
            document.querySelectorAll('#checkin-overlay .ci-plan-card').forEach(cardEl => {
                const rowEl = cardEl.querySelector('.cpc-row');
                if (rowEl) rowEl.innerHTML = _itemsHtml;
                cardEl.style.display = items.length ? '' : 'none';
            });
            setTimeout(() => updateStepsHeight(), 50);
        }

        let _checkinSending = false;

        function _sendCheckinData() {
            // Podwójne dotknięcie "Gotowe" tworzyło DWA wiersze w workouts —
            // POST /api/workout robi zwykły INSERT, backend nie ma dedupe po dacie,
            // a runner może legalnie mieć dwa treningi dziennie, więc twardy unique
            // byłby błędny. Blokada musi być tutaj. Zwalniamy dopiero po zamknięciu
            // nakładki, bo do tego czasu przycisk jest widoczny i klikalny.
            if (_checkinSending) return;
            _checkinSending = true;
            const today = todayStr();
            if (currentMode === 'morning') {
                localStorage.setItem('velm_checkin_morning_done', today);
                sendMorningCheckinToAI(); // saves to /api/chat + /api/checkin internally
            } else {
                const userId = localStorage.getItem('velm_user_id');
                // Flagę stawiamy OPTYMISTYCZNIE (żeby UI od razu zareagował), ale gdy
                // zapis padnie — cofamy ją. Inaczej trening przepadał, a użytkownik
                // nie mógł go powtórzyć, bo apka uważała check-in za zrobiony.
                localStorage.setItem('velm_checkin_post_done', today);
                Promise.resolve(sendPostCheckinToAI()).catch(err => {
                    localStorage.removeItem('velm_checkin_post_done');
                    _checkinSending = false;
                    console.error('checkin: zapis treningu nieudany —', err?.message || err);
                    showVelmToast(t('checkin.save.failed'), true);
                    try { updatePostCheckinBanner(); } catch (e) {}
                });
                if (userId) {
                    const dur = durH * 60 + durM + durS / 60;
                    authFetch(`${API_BASE}/api/checkin`, {
                        method:'POST', headers: authHeaders(),
                        body: JSON.stringify({ userId, type:'post', data:{ duration:dur, rpe:rpeVal, completion:selectedCompletion }})
                    }).catch(e => console.error('checkin save:', e));
                }
            }
            setTimeout(() => { closeCheckin(); loadTodayCard(); updatePostCheckinBanner(); if (_gotoCoachAfterCheckin) setTimeout(() => switchView('coach'), 400); }, 300);
        }

        // Skala RPE — 3 kotwice (Lekko/Umiarkowanie/Ciężko) to TE SAME progi co
        // kolor suwaka (1-3 / 4-6 / 7-10) i się z nim podświetlają. Bez osobnego
        // opisowego podpisu pod suwakiem — liczba + kolor + kotwica to komplet.
        function _rpeZone(val) { return val <= 3 ? 'light' : val <= 6 ? 'moderate' : 'hard'; }
        function updateRpeSlider() {
            const slider = document.getElementById('rpeSlider');
            if (!slider) return;
            const val = parseInt(slider.value);
            rpeVal = val;
            const valEl = document.getElementById('rpeSliderVal');
            if (valEl) valEl.textContent = `${val}/10`;
            const pct = (val - 1) / 9 * 100;
            const zone = _rpeZone(val);
            const c = zone === 'light' ? '#6B8F71' : zone === 'moderate' ? '#C4A35A' : '#C07264';
            slider.style.background = `linear-gradient(to right, ${c} ${pct}%, #D8D2C4 ${pct}%)`;
            document.querySelectorAll('#checkin-overlay .rpe-scale span').forEach(s => {
                s.classList.toggle('active-zone', s.dataset.zone === zone);
            });
            showBtn('next-post-1');
        }

        function selectCompletion(btn, type) {
            document.querySelectorAll('#checkin-overlay .completion-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedCompletion = type;
            if (type === 'more') _initMoreStep();
            showBtn('next-post-2');
        }
        // "Więcej niż w planie" pyta o RÓŻNE rzeczy zależnie od typu — dla biegu
        // łączny dystans (jedyna sensowna jednostka bez struktury), dla treningów
        // strukturalnych to, co user faktycznie policzy sam w trakcie: ile
        // powtórzeń/serii zrobił, albo ile km trwał odcinek tempo.
        function _initMoreStep() {
            const titleEl = document.getElementById('more-step-title');
            const descEl  = document.getElementById('more-step-desc');
            if (workoutType === 'interval') {
                moreVal = (workoutData.powtorzenia || 6) + 1;
                if (titleEl) titleEl.textContent = t('ci.reps.title');
                if (descEl) descEl.textContent = t('ci.planassumed').replace('{v}', workoutData.powtorzenia || '—');
            } else if (workoutType === 'walkrun') {
                moreVal = (workoutData.serie || 6) + 1;
                if (titleEl) titleEl.textContent = t('ci.sets.title');
                if (descEl) descEl.textContent = t('ci.planassumed').replace('{v}', workoutData.serie || '—');
            } else if (workoutType === 'tempo') {
                moreVal = Math.round(((workoutData.odcinek_km || 5) + 0.5) * 2) / 2;
                if (titleEl) titleEl.textContent = t('ci.q.tempo');
                if (descEl) descEl.textContent = t('ci.q.tempo.desc');
            } else {
                moreVal = Math.round(((workoutData.dystans_km || 5) + 1) * 2) / 2;
                if (titleEl) titleEl.textContent = t('ci.q.total');
                if (descEl) descEl.textContent = t('ci.q.total.desc');
            }
            _renderMoreVal();
            // Zatwierdź OD RAZU, nie dopiero przy pierwszym dotknięciu +/- — inaczej
            // user widzący podpowiedź "7×" i klikający od razu "Gotowe" wysłałby
            // starą wartość z planu (6), bo nic by nigdy nie zapisało pokazanej liczby
            _commitMoreVal();
        }
        function _renderMoreVal() {
            const el = document.getElementById('moreValDisplay');
            if (!el) return;
            const isCount = (workoutType === 'interval' || workoutType === 'walkrun');
            el.textContent = isCount ? String(moreVal) + '×' : moreVal.toFixed(1) + ' km';
        }
        function _commitMoreVal() {
            // Segmenty raportowane do AI/statystyk mają widzieć FAKTYCZNĄ liczbę,
            // nie plan — to samo pole, które showPost0Section wypełnia planem
            if (workoutType === 'interval') segmentRepeats = moreVal;
            else if (workoutType === 'walkrun') segmentSeries = moreVal;
            else if (workoutType === 'tempo') segmentWorkKm = moreVal;
        }
        function adjustMore(dir) {
            const isCount = (workoutType === 'interval' || workoutType === 'walkrun');
            const step = isCount ? 1 : 0.5;
            const min  = isCount ? 1 : 0.5;
            moreVal = Math.max(min, Math.round((moreVal + dir * step) * 10) / 10);
            _renderMoreVal();
            _commitMoreVal();
        }
        function isFightingReadiness() {
            const sel = document.querySelector('#step-morning-4 .readiness-btn.selected');
            if (!sel) return false;
            const color = sel.dataset.color;
            return color === '#C4A35A' || color === '#C07264';
        }
        function selectMorningFollowup(btn, key) {
            document.querySelectorAll('#checkin-overlay .morning-fu-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            readinessFollowup = key;
            // openCheckin zdejmuje 'visible' ze wszystkich .btn-next — przywróć przycisk
            // Dalej dla tego kroku, inaczej nie da się dokończyć check-inu po wyborze powodu
            document.querySelector('#step-morning-followup .btn-next')?.classList.add('visible');
        }
        function selectSorenessLocation(btn, key) {
            document.querySelectorAll('#checkin-overlay .soreness-chip').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            sorenessLocation = key;
        }
        function selectSorenessDuration(btn, key) {
            document.querySelectorAll('#checkin-overlay .soreness-dur-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            sorenessDuration = key;
            const warn = document.getElementById('soreness-week-warning');
            if (warn) warn.classList.toggle('visible', key === 'longer');
            document.getElementById('next-soreness-detail')?.classList.add('visible');
        }

        // Opcje "Co poszło inaczej?" — dopasowane do typu treningu.
        // Zwykły/długi bieg: skrócenie ma sens głównie jako krótszy dystans.
        // Strukturalne (interwał/tempo/marszo-bieg): odcinki, tempo, serie — z porównaniem do planu.
        function _FU_2B_OPTS_() { return {
            // "Trening przerwany/niedokończony" usunięte — dla zwykłego/długiego biegu
            // to dokładnie to samo zjawisko co "krótszy dystans" (przerwanie ZAWSZE
            // skutkuje krótszym dystansem), więc było duplikatem tej samej opcji
            easy:    [{key:'krotszy_dystans',label:t('ci.fu.krotszy_dystans'),color:'#C4A35A'}],
            long:    [{key:'krotszy_dystans',label:t('ci.fu.krotszy_dystans'),color:'#C4A35A'}],
            interval:[{key:'mniej_powtorzen',label:t('ci.fu.mniej_powtorzen'),color:'#C07264'},{key:'krotsze_odcinki',label:t('ci.fu.krotsze_odcinki'),color:'#C4A35A'},{key:'wolniejsze_tempo_szybkich',label:t('ci.fu.wolniejsze_odcinki'),color:'#C07264'},{key:'dluzsze_przerwy',label:t('ci.fu.dluzsze_przerwy'),color:'#C4A35A'},{key:'przerwany',label:t('ci.fu.serie_przerwane'),color:'#C07264'}],
            tempo:   [{key:'krotszy_odcinek_tempo',label:t('ci.fu.krotszy_odcinek_tempo'),color:'#C07264'},{key:'wolniejsze_tempo',label:t('ci.fu.wolniejsze_tempo'),color:'#C07264'},{key:'przerwany',label:t('ci.fu.tempo_nieukonczone'),color:'#C07264'},{key:'bez_rozgrzewki',label:t('ci.fu.pominieta_rozgrzewka'),color:'#C4A35A'}],
            walkrun: [{key:'mniej_serii',label:t('ci.fu.mniej_serii'),color:'#C07264'},{key:'krotszy_bieg',label:t('ci.fu.krotszy_bieg'),color:'#C4A35A'},{key:'wiecej_marszu',label:t('ci.fu.wiecej_marszu'),color:'#C4A35A'},{key:'mniej_km',label:t('ci.fu.mniej_km'),color:'#C4A35A'}],
        }; }
        function _FU_2C_OPTS_() { return [
            {key:'zmeczenie',label:t('ci.cause.zmeczenie'),color:'#C07264'},
            {key:'bol',label:t('ci.cause.bol'),color:'#C07264'},
            {key:'brak_czasu',label:t('ci.cause.brak_czasu'),color:'#C4A35A'},
            {key:'pogoda',label:t('ci.cause.pogoda'),color:'#C4A35A'},
            {key:'motywacja',label:t('ci.cause.motywacja'),color:'#6B8F71'},
            {key:'inne',label:t('ci.cause.inne'),color:'#6B8F71'},
        ]; }

        function _buildFollowUp2b() {
            const el = document.getElementById('fu-2b-options');
            if (!el) return;
            const _fu2b = _FU_2B_OPTS_();
            const opts = _fu2b[workoutType] || _fu2b.easy;
            el.innerHTML = opts.map(o =>
                `<button class="morning-fu-btn fu-multi-btn" onclick="toggleFollowUp2b(this,'${o.key}')" data-key="${o.key}">` +
                `<span class="fu-dot" style="background:${o.color};width:10px;height:10px;border-radius:50%;flex-shrink:0;display:inline-block;margin-right:12px;"></span>${o.label}</button>`
            ).join('');
            const btn = document.getElementById('next-post-2b');
            if (btn) btn.classList.remove('visible');
        }
        function _buildFollowUp2c() {
            const el = document.getElementById('fu-2c-options');
            if (!el) return;
            followUpCauses = new Set();
            el.innerHTML = _FU_2C_OPTS_().map(o =>
                `<button class="morning-fu-btn fu-multi-btn" onclick="toggleFollowUpCause(this,'${o.key}')" data-key="${o.key}">` +
                `<span class="fu-dot" style="background:${o.color};width:10px;height:10px;border-radius:50%;flex-shrink:0;display:inline-block;margin-right:12px;"></span>${o.label}</button>`
            ).join('');
            // Reset pola "Coś innego" — świeże za każdym wejściem w ten krok
            document.getElementById('fuCauseOtherWrap')?.classList.remove('visible');
            const otherInput = document.getElementById('fuCauseOtherInput');
            if (otherInput) otherInput.value = '';
            const btn = document.getElementById('next-post-2c');
            if (btn) btn.classList.remove('visible');
        }
        function toggleFollowUp2b(card, key) {
            if (followUpSelections.has(key)) { followUpSelections.delete(key); card.classList.remove('selected'); }
            else { followUpSelections.add(key); card.classList.add('selected'); }
            // Każda opcja opisująca "mniej/krócej" musi wiedzieć O ILE — sam
            // checkbox tego nie mówi. "Przerwany"/"nieukończony" liczy się do
            // tej samej wartości co jego "krótszy ___" odpowiednik, bo skutek
            // (mniej zrobione) jest identyczny niezależnie od podanej przyczyny.
            const kmWrap = document.getElementById('fuKmWrap');
            if (kmWrap) {
                const needsKmEasy    = (workoutType === 'easy' || workoutType === 'long') && followUpSelections.has('krotszy_dystans');
                const needsKmTempo   = workoutType === 'tempo' && (followUpSelections.has('krotszy_odcinek_tempo') || followUpSelections.has('przerwany'));
                const needsKmWalkrun = workoutType === 'walkrun' && followUpSelections.has('mniej_km');
                const needsMeters    = workoutType === 'interval' && followUpSelections.has('krotsze_odcinki');
                const needsKm = needsKmEasy || needsKmTempo || needsKmWalkrun || needsMeters;
                if (needsKm && !kmWrap.classList.contains('visible')) {
                    _fuKmUnit = needsMeters ? 'm' : 'km';
                    const lbl = document.getElementById('fuKmLabel');
                    const el  = document.getElementById('fuKmVal');
                    if (needsMeters) {
                        const planM = workoutData.dystans_odcinka_m || 400;
                        fuKmVal = Math.max(50, Math.round((planM - 100) / 50) * 50);
                        if (lbl) lbl.textContent = t('ci.p0.meters');
                        if (el) el.textContent = fuKmVal + ' m';
                        intervalDistanceM = fuKmVal;
                    } else {
                        const base = needsKmTempo ? (workoutData.odcinek_km || 5) : (workoutData.dystans_km || 5);
                        fuKmVal = Math.max(0.5, Math.round((base - 1) * 2) / 2);
                        if (lbl) lbl.textContent = needsKmTempo ? t('ci.q.km.tempo') : t('ci.q.km.total');
                        if (el) el.textContent = fuKmVal.toFixed(1) + ' km';
                        if (needsKmTempo) segmentWorkKm = fuKmVal;
                    }
                }
                kmWrap.classList.toggle('visible', needsKm);
                if (needsKm) setTimeout(() => updateStepsHeight(), 320);
            }
            // Interval "mniej powtórzeń"/"przerwane" LUB walkrun "mniej serii"
            // → licznik faktycznej liczby (ten sam wzorzec co licznik km wyżej)
            const countWrap = document.getElementById('fuCountWrap');
            if (countWrap) {
                const needsRepeats = workoutType === 'interval' && (followUpSelections.has('mniej_powtorzen') || followUpSelections.has('przerwany'));
                const needsSeries  = workoutType === 'walkrun' && followUpSelections.has('mniej_serii');
                const needsCount = needsRepeats || needsSeries;
                if (needsCount && !countWrap.classList.contains('visible')) {
                    _fuCountTarget = needsRepeats ? 'repeats' : 'series';
                    const plan = needsRepeats ? (workoutData.powtorzenia || 6) : (workoutData.serie || 6);
                    fuCountVal = Math.max(1, plan - 1);
                    const lbl = document.getElementById('fuCountLabel');
                    if (lbl) lbl.textContent = t(needsRepeats ? 'ci.reps.actual' : 'ci.sets.actual');
                    const el = document.getElementById('fuCountVal');
                    if (el) el.textContent = String(fuCountVal);
                    if (needsRepeats) segmentRepeats = fuCountVal; else segmentSeries = fuCountVal;
                } else if (!needsCount) {
                    _fuCountTarget = null;
                }
                countWrap.classList.toggle('visible', needsCount);
                if (needsCount) setTimeout(() => updateStepsHeight(), 320);
            }
            const btn = document.getElementById('next-post-2b');
            if (btn) btn.classList.toggle('visible', followUpSelections.size > 0);
            setTimeout(() => updateStepsHeight(), 50);
        }
        function adjustFuCount(delta) {
            if (!_fuCountTarget) return;
            const plan = _fuCountTarget === 'repeats' ? (workoutData.powtorzenia || 6) : (workoutData.serie || 6);
            fuCountVal = Math.max(1, Math.min(plan, fuCountVal + delta));
            const el = document.getElementById('fuCountVal');
            if (el) el.textContent = String(fuCountVal);
            if (_fuCountTarget === 'repeats') segmentRepeats = fuCountVal;
            else segmentSeries = fuCountVal;
        }
        function toggleFollowUpCause(card, key) {
            if (followUpCauses.has(key)) { followUpCauses.delete(key); card.classList.remove('selected'); }
            else { followUpCauses.add(key); card.classList.add('selected'); }
            // "Coś innego" → odsłoń pole na własny opis (opcjonalny — zaznaczenie samo w sobie wystarczy)
            const otherWrap = document.getElementById('fuCauseOtherWrap');
            if (otherWrap) {
                const showOther = followUpCauses.has('inne');
                otherWrap.classList.toggle('visible', showOther);
                if (showOther) { setTimeout(() => document.getElementById('fuCauseOtherInput')?.focus(), 340); setTimeout(() => updateStepsHeight(), 320); }
                else { const ta = document.getElementById('fuCauseOtherInput'); if (ta) ta.value = ''; }
            }
            const btn = document.getElementById('next-post-2c');
            if (btn) btn.classList.toggle('visible', followUpCauses.size > 0);
            setTimeout(() => updateStepsHeight(), 50);
        }
        function goWithTrainer() {
            _gotoCoachAfterCheckin = true;
            inFollowUp = false; followUpSubStep = 0;
            _sendCheckinData();
        }

        // dir = kierunek (-1/+1), NIE stała delta — krok zależy od jednostki
        // (50m dla odcinka interwałowego, 0.5km dla dystansu)
        function adjustFuKm(dir) {
            const el = document.getElementById('fuKmVal');
            if (_fuKmUnit === 'm') {
                const maxM = workoutData.dystans_odcinka_m || 400;
                fuKmVal = Math.max(50, Math.min(maxM, fuKmVal + dir * 50));
                if (el) el.textContent = fuKmVal + ' m';
                intervalDistanceM = fuKmVal;
                return;
            }
            const max = workoutType === 'tempo' ? (workoutData.odcinek_km || 6) : workoutData.dystans_km;
            fuKmVal = Math.max(0.5, Math.min(max, fuKmVal + dir * 0.5));
            if (el) el.textContent = fuKmVal.toFixed(1) + ' km';
            if (workoutType === 'tempo') segmentWorkKm = fuKmVal;
        }
        function buildAiMessage() {
            const completionLabel = selectedCompletion === 'less' ? 'mniej_niż_plan'
                : selectedCompletion === 'more' ? 'więcej_niż_plan' : 'zgodnie_z_planem';
            const _durStr = durH > 0
                ? `${durH}:${String(durM).padStart(2,'0')}:${String(durS).padStart(2,'0')}`
                : `${String(durM).padStart(2,'0')}:${String(durS).padStart(2,'0')}`;
            let base = `CHECK-IN POTRENINGOWY: typ=${workoutType}, plan=${workoutData.dystans_km}km, czas=${_durStr}, RPE=${rpeVal??'?'}/10, realizacja=${completionLabel}`;
            // Per-segment data (tempo AI liczy samo z distance_km/duration_min —
            // bez ręcznego wpisywania, którego i tak nie zna user bez zegarka biegowego)
            if (workoutType === 'interval' && segmentRepeats) {
                base += `, powtórzenia=${segmentRepeats}/${workoutData.powtorzenia||'?'}, dystans_odcinka=${intervalDistanceM}m`;
            }
            if (workoutType === 'tempo' && segmentWorkKm) {
                base += `, odcinek=${segmentWorkKm.toFixed(1)}/${workoutData.odcinek_km||'?'}km`;
            }
            if ((workoutType === 'tempo' || workoutType === 'interval') && (workSegH + workSegM + workSegS > 0)) {
                const _wStr = workSegH > 0
                    ? `${workSegH}:${String(workSegM).padStart(2,'0')}:${String(workSegS).padStart(2,'0')}`
                    : `${String(workSegM).padStart(2,'0')}:${String(workSegS).padStart(2,'0')}`;
                base += `, czas_odcinka=${_wStr}`;
            }
            if (workoutType === 'walkrun' && segmentSeries) {
                base += `, serie=${segmentSeries}/${workoutData.serie||'?'}`;
            }
            // Easy/long lub walkrun skrócony: faktyczne km vs plan — AI ma wiedzieć O ILE mniej
            if ((((workoutType === 'easy' || workoutType === 'long') && followUpSelections.has('krotszy_dystans')) ||
                 (workoutType === 'walkrun' && followUpSelections.has('mniej_km'))) && fuKmVal > 0) {
                base += `, wykonano_km=${fuKmVal.toFixed(1)}/${workoutData.dystans_km}`;
            }
            if (selectedCompletion === 'less' && skippedParts.size > 0) {
                base += `, pominięto=[${[...skippedParts].join(',')}]`;
            }
            if (selectedCompletion === 'less' && followUpSelections.size > 0) {
                base += `, co_poszlo_inaczej=[${[...followUpSelections].join(',')}]`;
            }
            if (selectedCompletion === 'less' && followUpCauses.size > 0) {
                base += `, przyczyny=[${[...followUpCauses].join(',')}]`;
            }
            const _otherCauseText = document.getElementById('fuCauseOtherInput')?.value?.trim();
            if (selectedCompletion === 'less' && _otherCauseText) {
                base += `, przyczyna_inne="${_otherCauseText}"`;
            }
            // Więcej niż w planie, bieg bez struktury — faktyczny łączny dystans
            // z step-post-3. Dla interval/tempo/walkrun "więcej" idzie już wyżej
            // przez powtórzenia=/odcinek=/serie= (adjustMore aktualizuje segment*)
            if (selectedCompletion === 'more' && (workoutType === 'easy' || workoutType === 'long') && moreVal > 0) {
                base += `, wykonano_km=${moreVal.toFixed(1)}/${workoutData.dystans_km}`;
            }
            return base;
        }
        function showBtn(id) { const btn = document.getElementById(id); if (btn) btn.classList.add('visible'); }
        // ── END CHECKIN OVERLAY JS ───────────────────────────────

        function makeSliderTouchFriendly(sliderId, updateFn) {
            const slider = document.getElementById(sliderId);
            if (!slider) return;
            function handleTouch(e) {
                if (e.touches.length === 0) return;
                const rect = slider.getBoundingClientRect();
                const touch = e.touches[0];
                const clientX = touch.clientX;
                let pct = (clientX - rect.left) / rect.width;
                pct = Math.max(0, Math.min(1, pct));
                const min = parseFloat(slider.min) || 1;
                const max = parseFloat(slider.max) || 10;
                const step = parseFloat(slider.step) || 1;
                let rawVal = min + pct * (max - min);
                let val = Math.round(rawVal / step) * step;
                val = Math.max(min, Math.min(max, val));
                if (parseInt(slider.value) !== val) {
                    slider.value = val;
                    updateFn();
                }
                if (e.cancelable) e.preventDefault();
            }
            slider.addEventListener('touchstart', handleTouch, { passive: false });
            slider.addEventListener('touchmove', handleTouch, { passive: false });
        }

