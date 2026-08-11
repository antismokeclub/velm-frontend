        // ── Kreator "Zmień cel" (kafelki typu → parametry → zapis do /goal) ──
        // Funkcje, nie stale: jezyk moze sie zmienic w trakcie sesji, a stala
        // policzona przy ladowaniu pliku zamrozilaby napisy z momentu startu.
        function _gwTypes() {
            const o = {};
            ['time','distance','health','comeback','start','walkrun'].forEach(k => {
                o[k] = { t: t('gw.type.' + k), d: t('gw.type.' + k + '.d') };
            });
            return o;
        }
        function _gwDist() {
            return [['5k','5 km'],['10k','10 km'],['half',t('dist.half')],['marathon',t('dist.marathon')],['ultra',t('dist.ultra')],['other',t('dist.own')]];
        }
        let _goalWiz = null;

        function resetGoalWiz() {
            _goalWiz = { stepId:'type', goalId:null, dist:null, customDist:10, raceDate:'', hasRace:true, timeGoal:'', pb:'', pbNone:false, injArea:'', injNotes:'', injState:null, injDoctor:null, healthFocus:null, comebackReason:null, comebackSince:null, startFocus:null };
            renderGoalWiz();
        }
        
        function _wizGoalIds() {
            const cat = (window._settingsOnb || {}).goal_category;
            return (cat === 'advanced' || !cat)
                ? ['time','distance','health','comeback']
                : ['start','walkrun','health','comeback'];
        }
        
        
        

        function _obCard(title, sub, selected, onclick, icon) {
            // classList.add('picked') daje krótkie potwierdzenie wyboru zanim ekran
            // odjedzie — bez tego kliknięcie i przejście zlewają się w jeden przeskok.
            return '<button class="ob-cc' + (selected ? ' s' : '') +
                '" onclick="this.classList.add(\'picked\');' + onclick + '">' +
                (icon ? '<span class="ob-ci">' + icon + '</span>' : '') +
                '<span class="ob-cv"><span class="ob-ct" style="display:block;">' + title + '</span>' +
                (sub ? '<span class="ob-cs" style="display:block;">' + sub + '</span>' : '') + '</span>' +
                '<svg class="ob-ck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></button>';
        }

        
        function _wizStepReady() {
            const w = _goalWiz;
            if (!w) return false;
            if (w.goalId === 'time') return !!(w.dist && w.raceDate);
            if (w.goalId === 'distance') return !!(w.dist && (!w.hasRace || w.raceDate));
            if (w.goalId === 'health') return !!w.healthFocus;
            if (w.goalId === 'comeback') {
                if (!(w.comebackReason && w.comebackSince)) return false;
                // Przy powrocie po kontuzji szczegóły są WYMAGANE — fizjo nie ma
                // ich skąd wziąć, a od nich zależy, czy plan w ogóle jest bezpieczny.
                if (w.comebackReason === 'injury') return !!(w.injArea && w.injState);
                return true;
            }
            if (w.goalId === 'start' || w.goalId === 'walkrun') return !!w.startFocus;
            return false;
        }

        // Rekord życiowy — pole opcjonalne, ale cenne: sztab czyta je jako `pb`
        // w profilu zawodnika. NIE da się go odtworzyć z historii treningów, bo
        // zwykle pochodzi sprzed korzystania z apki.
        

        // Szczegóły kontuzji. Świadomie NIE pytamy tu o objętość ani typ treningu —
        // to mamy z historii. Pytamy wyłącznie o to, czego w danych nie ma.
        
        

        // Ikony typów celu — te same kształty co w onboardingu (cel, dystans, serce, powrót)
        function _wizGoalIcon(id) {
            const w = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">';
            if (id === 'time')     return w + '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
            if (id === 'distance') return w + '<path d="M3 18h4l3-12 4 16 3-8h4"/></svg>';
            if (id === 'health')   return w + '<path d="M20.8 5.6a5 5 0 00-7.1 0L12 7.3l-1.7-1.7a5 5 0 10-7.1 7.1L12 21.5l8.8-8.8a5 5 0 000-7.1z"/></svg>';
            if (id === 'comeback') return w + '<path d="M3 12a9 9 0 109-9"/><path d="M3 4v5h5"/></svg>';
            return w + '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/></svg>';
        }
        // Rekord życiowy z pola tekstowego ("21:30" / "1:45:00") na pola onboardingu.
        // Puste albo "nie mam" -> zapisujemy flagę, nie zmyślamy zera.
        function _wizApplyPb(u, w, kind) {
            const pfx = kind === 'time' ? 'time_pb' : 'distance_pb';
            if (w.pbNone || !(w.pb || '').trim()) { u[pfx + '_none'] = true; return; }
            const p = String(w.pb).split(':').map(Number).filter(n => !isNaN(n));
            if (!p.length) { u[pfx + '_none'] = true; return; }
            u[pfx + '_none'] = false;
            if (p.length === 2)      { u[pfx + '_hours'] = 0;    u[pfx + '_mins'] = p[0]; u[pfx + '_secs'] = p[1]; }
            else if (p.length === 3) { u[pfx + '_hours'] = p[0]; u[pfx + '_mins'] = p[1]; u[pfx + '_secs'] = p[2]; }
            else                     { u[pfx + '_none'] = true; }
        }

function _wizSteps() {
            // Kroki mini-onboardingu. Każdy = JEDNO pytanie na ekran, dokładnie jak
            // w index.html. `skip` wycina to, czego dla danego celu nie pytamy —
            // i wszystko o bieżącym treningu, bo to mamy z historii.
            const w = _goalWiz || {};
            const isTime = w.goalId === 'time', isDist = w.goalId === 'distance';
            return [
                { id:'type',     cta:false },
                { id:'dist',     cta:true,  skip:() => !(isTime || isDist) },
                { id:'hasrace',  cta:false, skip:() => !isDist },
                { id:'racedate', cta:true,  skip:() => !(isTime || (isDist && w.hasRace)) },
                { id:'target',   cta:true,  skip:() => !isTime },
                { id:'pb',       cta:true,  skip:() => !(isTime || isDist) },
                { id:'health',   cta:false, skip:() => w.goalId !== 'health' },
                { id:'cbreason', cta:false, skip:() => w.goalId !== 'comeback' },
                { id:'cbsince',  cta:false, skip:() => w.goalId !== 'comeback' },
                { id:'injwhat',  cta:true,  skip:() => !(w.goalId === 'comeback' && w.comebackReason === 'injury') },
                { id:'injstate', cta:false, skip:() => !(w.goalId === 'comeback' && w.comebackReason === 'injury') },
                { id:'injdoc',   cta:false, skip:() => !(w.goalId === 'comeback' && w.comebackReason === 'injury') },
                { id:'start',    cta:false, skip:() => !(w.goalId === 'start' || w.goalId === 'walkrun') },
                { id:'done',     cta:true },
            ].filter(st => !st.skip || !st.skip());
        }

        // Czy z danego kroku wolno iść dalej (odpowiednik cant() z onboardingu).
        function _wizCant(id) {
            const w = _goalWiz;
            if (id === 'dist')     return !w.dist || (w.dist === 'other' && !(parseInt(w.customDist) > 0));
            if (id === 'racedate') return !w.raceDate;
            if (id === 'injwhat')  return !(w.injArea || '').trim();
            return false;   // reszta to karty (auto-przejście) albo pola opcjonalne
        }

        function wizNext() {
            const steps = _wizSteps();
            const i = steps.findIndex(st => st.id === _goalWiz.stepId);
            if (i < 0 || i >= steps.length - 1) return;
            const scr = document.querySelector('#goal-wiz .ob-screen');
            const go = () => { _goalWiz.stepId = steps[i + 1].id; renderGoalWiz(); };
            if (scr) { scr.classList.add('leaving'); setTimeout(go, 160); } else { go(); }
        }

        function goalWizBack() {
            if (!_goalWiz) { openSettingsPane('cel'); return; }
            const steps = _wizSteps();
            const i = steps.findIndex(st => st.id === _goalWiz.stepId);
            if (i <= 0) { openSettingsPane('cel'); return; }
            _goalWiz.stepId = steps[i - 1].id;
            renderGoalWiz();
        }

        // Wybór karty przesuwa dalej sam — jak w onboardingu (setTimeout(next,190)).
        function wizPickAdvance(field, val) {
            _goalWiz[field] = val;
            renderGoalWiz();
            setTimeout(wizNext, 190);
        }
        function wizPickType(id) {
            // Zmiana typu czyści pola należące do innych typów. Bez tego kreator
            // pokazywał na ekranie podsumowania "Dystans: 10 km / Data startu"
            // przy celu zdrowotnym — dane, których i tak nie zapiszemy.
            if (_goalWiz.goalId && _goalWiz.goalId !== id) {
                Object.assign(_goalWiz, { dist:null, customDist:10, raceDate:'', hasRace:true,
                    timeGoal:'', pb:'', pbNone:false, injArea:'', injNotes:'', injState:null,
                    injDoctor:null, healthFocus:null, comebackReason:null, comebackSince:null,
                    startFocus:null });
            }
            _goalWiz.goalId = id; renderGoalWiz(); setTimeout(wizNext, 190);
        }
        function wizSetHasRace(v) { _goalWiz.hasRace = v; renderGoalWiz(); setTimeout(wizNext, 190); }
        function wizPickDist(id) { _goalWiz.dist = id; renderGoalWiz(); }

        function renderGoalWiz() {
            const host = document.getElementById('goal-wiz');
            if (!host || !_goalWiz) return;
            const titleEl = document.getElementById('goal-wiz-title');
            if (titleEl) titleEl.textContent = '';

            const steps = _wizSteps();
            let i = steps.findIndex(st => st.id === _goalWiz.stepId);
            if (i < 0) { _goalWiz.stepId = steps[0].id; i = 0; }
            const step = steps[i];
            const pct = Math.round((i / Math.max(steps.length - 1, 1)) * 100);

            const head = (title, sub) => '<h1 class="ob-hl">' + title + '</h1>' +
                (sub ? '<div class="ob-sub">' + sub + '</div>' : '');
            const cards = (field, opts) => '<div class="ob-list">' + opts.map(([v, l, d]) =>
                _obCard(l, d || '', _goalWiz[field] === v, "wizPickAdvance('" + field + "','" + v + "')")
            ).join('') + '</div>';

            let body = '';
            switch (step.id) {
                case 'type':
                    body = head(t('gw.q.type'), t('gw.q.type.sub')) +
                        '<div class="ob-list">' + _wizGoalIds().map(id => {
                            const g = _gwTypes()[id];
                            return _obCard(g.t, g.d, _goalWiz.goalId === id, "wizPickType('" + id + "')", _wizGoalIcon(id));
                        }).join('') + '</div>';
                    break;
                case 'dist':
                    body = head(t('gw.q.dist')) +
                        '<div class="ob-grid">' + _gwDist().map(([v, l]) =>
                            '<button class="ob-tile' + (_goalWiz.dist === v ? ' s' : '') + '" onclick="wizPickDist(\'' + v + '\')">' + l + '</button>'
                        ).join('') + '</div>' +
                        (_goalWiz.dist === 'other'
                            ? '<div style="margin-top:16px;"><label class="ob-label">' + t('gw.q.km') + '</label>' +
                              '<input type="number" min="1" max="200" class="ob-txt" value="' + _goalWiz.customDist + '" oninput="_goalWiz.customDist=this.value;_wizSyncCta()"></div>'
                            : '');
                    break;
                case 'hasrace':
                    body = head(t('gw.q.hasrace')) +
                        '<div class="ob-list">' +
                        _obCard(t('gw.hasrace.yes'), '', _goalWiz.hasRace === true, 'wizSetHasRace(true)') +
                        _obCard(t('gw.hasrace.no'), t('gw.hasrace.no.sub'), _goalWiz.hasRace === false, 'wizSetHasRace(false)') +
                        '</div>';
                    break;
                case 'racedate':
                    body = head(t('gw.q.racedate'), t('gw.q.racedate.sub')) +
                        '<input type="date" class="ob-txt" value="' + _goalWiz.raceDate + '" oninput="_goalWiz.raceDate=this.value;_wizSyncCta()" onchange="_goalWiz.raceDate=this.value;_wizSyncCta()">';
                    break;
                case 'target':
                    body = head(t('gw.q.target'), t('gw.q.target.sub')) +
                        '<input type="text" class="ob-txt" placeholder="np. 45:00 lub 1:45:00" value="' + _goalWiz.timeGoal + '" oninput="_goalWiz.timeGoal=this.value">';
                    break;
                case 'pb':
                    body = head(t('gw.q.pb'), t('gw.q.pb.sub')) +
                        '<input type="text" class="ob-txt" placeholder="np. 21:30 lub 1:45:00" value="' + (_goalWiz.pb || '') + '"' +
                        ' oninput="_goalWiz.pb=this.value" ' + (_goalWiz.pbNone ? 'disabled' : '') + '>' +
                        '<div class="ob-list" style="margin-top:12px;">' +
                        _obCard(t('gw.pb.none'), '', !!_goalWiz.pbNone, '_goalWiz.pbNone=!_goalWiz.pbNone;renderGoalWiz()') +
                        '</div>';
                    break;
                case 'health':
                    body = head(t('gw.q.health')) +
                        cards('healthFocus', [['forma',t('gw.health.forma')],['waga',t('gw.health.waga')],['kondycja',t('gw.health.kondycja')],['energia',t('gw.health.energia')]]);
                    break;
                case 'cbreason':
                    body = head(t('gw.q.cbreason'), t('gw.q.cbreason.sub')) +
                        cards('comebackReason', [['injury',t('gw.cb.injury')],['break',t('gw.cb.break')]]);
                    break;
                case 'cbsince':
                    body = head(t('gw.q.cbsince')) +
                        cards('comebackSince', [['lt1',t('gw.cbsince.lt1')],['1_3',t('gw.cbsince.1_3')],['3_6',t('gw.cbsince.3_6')],['gt6',t('gw.cbsince.gt6')]]);
                    break;
                case 'injwhat':
                    body = head(t('gw.q.injwhat')) +
                        '<label class="ob-label">' + t('gw.inj.area') + '</label>' +
                        '<input type="text" class="ob-txt" style="margin-bottom:18px;" placeholder="' + t('gw.inj.area.ph') + '"' +
                        ' value="' + (_goalWiz.injArea || '') + '" oninput="_goalWiz.injArea=this.value;_wizSyncCta()">' +
                        '<label class="ob-label">' + t('gw.inj.notes') + '</label>' +
                        '<input type="text" class="ob-txt" placeholder="' + t('gw.inj.notes.ph') + '"' +
                        ' value="' + (_goalWiz.injNotes || '') + '" oninput="_goalWiz.injNotes=this.value">';
                    break;
                case 'injstate':
                    body = head(t('gw.q.injstate')) +
                        cards('injState', [['healed',t('gw.injstate.healed')],['mild',t('gw.injstate.mild')],['pain',t('gw.injstate.pain')]]);
                    break;
                case 'injdoc':
                    body = head(t('gw.q.injdoc')) +
                        cards('injDoctor', [['cleared',t('gw.injdoc.cleared')],['seen',t('gw.injdoc.seen')],['no',t('gw.injdoc.no')]]);
                    break;
                case 'start':
                    body = head(t('gw.q.start')) +
                        cards('startFocus', [['5k',t('gw.start.5k')],['30min',t('gw.start.30min')],['fit',t('gw.start.fit')]]);
                    break;
                case 'done':
                    body = head(t('gw.done'), t('gw.done.sub')) +
                        '<div class="ob-panel">' + _wizSummary() + '</div>';
                    break;
            }

            const isLast = step.id === 'done';
            const blocked = _wizCant(step.id);
            host.innerHTML =
                '<div class="ob-top">' +
                    '<button class="ob-bk' + (i === 0 ? '' : '') + '" onclick="goalWizBack()" aria-label="' + t('com.back') + '">' +
                        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>' +
                    '</button>' +
                    '<div class="ob-bar"><div class="ob-pf" style="width:' + pct + '%"></div></div>' +
                    '<span class="ob-pill">' + i + ' ' + t('com.of') + ' ' + (steps.length - 1) + '</span>' +
                '</div>' +
                '<div class="ob-screen">' + body +
                    (step.cta
                        // onclick MUSI być zawsze. Wcześniej dostawał go tylko przycisk
                        // odblokowany w momencie renderu — więc po wybraniu daty z kalendarza
                        // _wizSyncCta() zdejmowało `disabled`, ale kliknięcie nie miało czego
                        // wywołać i flow stawał w miejscu.
                        ? '<button class="ob-cta" id="wiz-cta" style="margin-top:22px;"' +
                          ' onclick="' + (isLast ? 'saveGoalWiz()' : 'wizNext()') + '"' +
                          (blocked ? ' disabled' : '') + '>' +
                          (isLast ? t('gw.save') : t('gw.next')) + '</button>'
                        : '') +
                    '<div id="goal-wiz-msg" class="s-msg" style="color:#6B8F71;"></div>' +
                '</div>';
        }

        // Odblokowanie CTA bez przerysowania ekranu — inaczej input traci focus przy pisaniu.
        function _wizSyncCta() {
            const btn = document.getElementById('wiz-cta');
            if (!btn || !_goalWiz) return;
            const steps = _wizSteps();
            const step = steps.find(st => st.id === _goalWiz.stepId);
            if (step) btn.disabled = _wizCant(step.id);
        }

        function _wizSummary() {
            const w = _goalWiz, L = [];
            const T = (_gwTypes()[w.goalId] || {}).t;
            if (T) L.push([t('gw.sum.goal'), T]);
            if (w.dist) L.push([t('home.dist'), (_gwDist().find(d => d[0] === w.dist) || [])[1] || w.dist]);
            if (w.raceDate) L.push([t('gw.sum.startdate'), w.raceDate]);
            if (w.timeGoal) L.push([t('gw.type.time'), w.timeGoal]);
            if (w.pb && !w.pbNone) L.push([t('gw.sum.pb'), w.pb]);
            if (w.injArea) L.push([t('gw.sum.injury'), w.injArea]);
            return L.map(([k, v]) =>
                '<div style="display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid #EDE8DC;">' +
                '<span style="font-size:14px;color:#5C6B85;">' + k + '</span>' +
                '<span style="font-size:14px;font-weight:600;color:#111;text-align:right;">' + v + '</span></div>'
            ).join('') || '<div class="ob-note">' + t('gw.sum.empty') + '</div>';
        }

        async function saveGoalWiz() {
            const userId = localStorage.getItem('velm_user_id');
            if (!userId || !_goalWiz || !_wizStepReady()) return;
            const w = _goalWiz;
            const u = { goalId: w.goalId };
            if (w.goalId === 'time') {
                u.time_distance = w.dist;
                if (w.dist === 'other') u.time_custom_dist = parseInt(w.customDist) || null;
                u.time_race_date = w.raceDate; u.dist_goal_date = w.raceDate; u.time_race_target = w.raceDate;
                const p = (w.timeGoal || '').split(':').map(Number).filter(n => !isNaN(n));
                if (p.length === 2) { u.time_target_hours = 0; u.time_target_mins = p[0]; u.time_target_secs = p[1]; }
                else if (p.length === 3) { u.time_target_hours = p[0]; u.time_target_mins = p[1]; u.time_target_secs = p[2]; }
                _wizApplyPb(u, w, 'time');
            } else if (w.goalId === 'distance') {
                u.endurance_dist = w.dist;
                if (w.dist === 'other') u.customDist = parseInt(w.customDist) || null;
                u.dist_has_race = w.hasRace;
                if (w.hasRace && w.raceDate) { u.dist_goal_date = w.raceDate; u.time_race_target = w.raceDate; }
                _wizApplyPb(u, w, 'distance');
            } else if (w.goalId === 'health') {
                u.health_focus = w.healthFocus;
            } else if (w.goalId === 'comeback') {
                u.comeback_reason = w.comebackReason; u.comeback_last_train = w.comebackSince;
                if (w.comebackReason === 'injury') {
                    u.comeback_injury_area = (w.injArea || '').trim() || null;
                    u.comeback_injury_notes = (w.injNotes || '').trim() || null;
                    u.comeback_recovery = w.injState;      // healed | mild | pain
                    u.comeback_doctor = w.injDoctor;       // cleared | seen | no
                    // "Wciąż boli" to informacja dla fizjo, nie kosmetyka — bez tego
                    // sztab przy powrocie po kontuzji planowałby po omacku.
                    u.comeback_severity = w.injState === 'pain' ? 'active'
                                        : (w.injState === 'mild' ? 'residual' : 'resolved');
                }
            } else if (w.goalId === 'start' || w.goalId === 'walkrun') {
                u.start_focus = w.startFocus;
            }
            try {
                const res = await authFetch(`${API_BASE}/api/user/${userId}/goal`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(u) });
                const data = await res.json();
                if (data.success) {
                    showVelmToast(t('gw.saved'), false);
                    setTimeout(() => { loadSettings(); openSettingsPane('cel'); }, 900);
                } else {
                    showVelmToast(apiErr(data, 'gw.saveerr'), true);
                }
            } catch(e) {
                showVelmToast(t('com.err.conn'), true);
            }
        }

