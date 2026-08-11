        // Konto: rozwijane formularze (email / hasło) pod wierszami listy
        function toggleAccountSection(id) {
            const el = document.getElementById(id);
            if (!el) return;
            const willOpen = el.style.display === 'none';
            document.querySelectorAll('#s-pane-konto .sd-acc-form').forEach(f => { if (f !== el) f.style.display = 'none'; });
            el.style.display = willOpen ? 'block' : 'none';
        }

        function _celDistLabel(onb) {
            const map = { '5k':'5 km', '10k':'10 km', 'half':t('dist.half'), 'marathon':t('dist.marathon'), 'ultra':t('dist.ultra.full'), 'other':t('dist.own.full') };
            const d = onb.time_distance || onb.endurance_dist || onb.dist_goal || onb.distance || null;
            if (d && map[d]) return map[d];
            if (onb.time_custom_dist) return onb.time_custom_dist + ' km';
            if (onb.customDist) return onb.customDist + ' km';
            return t('set.plan.running');
        }
        // Etykieta celu dopasowana do typu: cel czasowy → "10 km · 45:00", dystansowy → sam dystans.
        function _celGoalLabel(onb) {
            const dist = _celDistLabel(onb);
            const h = parseInt(onb.time_target_hours) || 0;
            const m = parseInt(onb.time_target_mins);
            const s = parseInt(onb.time_target_secs) || 0;
            const isTimeGoal = onb.goalId === 'time' || onb.time_distance;
            if (isTimeGoal && !isNaN(m) && (h > 0 || m > 0)) {
                const t = h > 0
                    ? h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0')
                    : m + ':' + String(s).padStart(2, '0');
                return dist + ' · ' + t;
            }
            return dist;
        }
        function _fmtPlDate(d) {
            try { return new Date(d).toLocaleDateString(_appLang, { day:'numeric', month:'long', year:'numeric' }); }
            catch(e) { return '—'; }
        }
        function _setText(ids, txt) {
            ids.forEach(id => { const el = document.getElementById(id); if (el) el.textContent = txt; });
        }

        // Wypełnia panele "Cel i plan" + "Twój cel" realnymi danymi (bez zmyślania —
        // brak daty zawodów => myślnik/CTA, postęp = kalendarzowy do dnia startu).
        async function renderGoalPanes(user, planData) {
            const onb = user?.onboarding_data ?? {};
            window._settingsOnb = onb;
            // Zapamiętane argumenty — po zmianie języka _refreshActiveView()
            // przerysowuje ten panel bez wołania loadSettings() (patrz 12-i18n.js).
            window._settingsGoalArgs = { user, planData };
            const raceDate = onb.time_race_target || onb.time_race_date || onb.dist_goal_date || null;
            _setText(['cel-sum-dist','cel-d-dist'], _celGoalLabel(onb));

            let dateTxt = '—', leftTxt = t('set.setracedate'), pct = null;
            if (raceDate) {
                dateTxt = _fmtPlDate(raceDate);
                const now = new Date(); now.setHours(0,0,0,0);
                const target = new Date(raceDate); target.setHours(0,0,0,0);
                const daysLeft = Math.ceil((target - now) / 86400000);
                if (daysLeft > 0) {
                    const weeks = Math.round(daysLeft / 7);
                    leftTxt = weeks >= 1 ? tp('set.weeks', weeks) : tp('set.days', daysLeft);
                    let start = user?.created_at ? new Date(user.created_at) : null;
                    if (!start || isNaN(start.getTime()) || start >= target) start = new Date(target.getTime() - 180 * 86400000);
                    const total = target - start;
                    pct = total > 0 ? Math.min(100, Math.max(0, Math.round((now - start) / total * 100))) : null;
                } else {
                    leftTxt = daysLeft === 0 ? t('set.raceday') : t('set.racepast');
                    pct = 100;
                }
            }
            _setText(['cel-sum-date','cel-d-date'], dateTxt);
            _setText(['cel-sum-left','cel-d-left'], leftTxt);

            const pctTxt = pct === null ? '—' : pct + '%';
            _setText(['cel-sum-pct','cel-ring-pct'], pctTxt);
            window._celPct = pct;
            const bar = document.getElementById('cel-sum-bar');
            if (bar) setTimeout(() => { bar.style.width = (pct === null ? 0 : pct) + '%'; }, 60);
            const ring = document.getElementById('cel-ring-fill');
            if (ring) setTimeout(() => { ring.style.strokeDashoffset = (395.8 * (1 - (pct === null ? 0 : pct) / 100)).toFixed(1); }, 60);
            const motiv = document.getElementById('cel-d-motiv');
            if (motiv && pct !== null) motiv.textContent = t(pct >= 75 ? 'goal.motiv.high' : pct >= 40 ? 'goal.motiv.mid' : 'goal.motiv.low');

            // Ten tydzień — realne treningi (Pn–Nd zawierający dziś)
            try {
                const uid = localStorage.getItem('velm_user_id');
                const res = await authFetch(`${API_BASE}/api/workouts/${uid}?days=14`, { headers: authHeaders() });
                const data = res.ok ? await res.json() : {};
                const workouts = data.workouts ?? [];
                const today = new Date(); today.setHours(0,0,0,0);
                const dow = (today.getDay() + 6) % 7; // 0=Pn
                const monday = new Date(today.getTime() - dow * 86400000);
                const weekEnd = new Date(monday.getTime() + 7 * 86400000);
                const doneDays = new Set();
                workouts.forEach(w => {
                    const ds = w.date || (w.logged_at ? w.logged_at.split('T')[0] : null);
                    if (!ds) return;
                    const wd = new Date(ds); wd.setHours(0,0,0,0);
                    if (wd >= monday && wd < weekEnd) doneDays.add((wd.getDay() + 6) % 7);
                });
                const plannedSet = new Set(_daysToIdx(onb.selectedDays));
                const planned = plannedSet.size || onb.daysPerWeek || doneDays.size;
                const countEl = document.getElementById('cel-d-week-count');
                if (countEl) countEl.textContent = t('set.weekdone').replace('{a}', doneDays.size).replace('{b}', planned);
                const wk = document.getElementById('cel-d-week');
                if (wk) {
                    const labels = _dayNamesShort();
                    wk.innerHTML = labels.map((lb, i) => {
                        const done = doneDays.has(i);
                        const isToday = i === dow;
                        const cls = 'sd-day' + (done ? ' done' : '') + (isToday ? ' today' : '');
                        const inner = done
                            ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5F8368" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'
                            : (plannedSet.has(i)
                                ? '<span style="width:6px;height:6px;border-radius:50%;background:#C9C0B2;"></span>'
                                : '<span style="color:#C9C0B2;font-size:12px;line-height:1;">–</span>');
                        return `<div class="${cls}"><span class="sd-day-lbl">${lb}</span><span class="sd-day-dot">${inner}</span></div>`;
                    }).join('');
                }
            } catch(e) { /* zostaw myślniki */ }
        }

        async function loadSettings() {
            const userId = localStorage.getItem('velm_user_id');
            if (!userId) return;
            backToSettingsMenu();   // wejście w ustawienia zawsze pokazuje menu
            // PRZED fetchem: gdy zapytanie padnie, wiersze profilu zostawały na
            // polskich wartościach domyślnych z markupu (te elementy wypełnia JS,
            // więc nie mają data-i18n). _refreshProfilRows ma własny fallback z t().
            _refreshProfilRows();
            loadSubscriptionSection();
            try {
                const [userRes, planRes] = await Promise.all([
                    authFetch(`${API_BASE}/api/user/${userId}`, { headers: authHeaders() }),
                    authFetch(`${API_BASE}/api/plan/${userId}`, { headers: authHeaders() })
                ]);
                const { user } = userRes.ok ? await userRes.json() : {};
                const planData = planRes.ok ? await planRes.json() : {};
                const onb = user?.onboarding_data ?? {};
                const raceDate = onb.time_race_date ?? onb.dist_goal_date ?? null;

                // Profil — avatar initials + editable fields
                const name = user?.name ?? onb.name ?? '—';
                const sName = document.getElementById('settings-name-display');
                if (sName) sName.textContent = name;
                const editName = document.getElementById('settings-edit-name');
                if (editName) editName.value = onb.name ?? user?.name ?? '';
                const editWeight = document.getElementById('settings-edit-weight');
                if (editWeight && onb.weight) editWeight.value = onb.weight;
                const editHeight = document.getElementById('settings-edit-height');
                if (editHeight && onb.height) editHeight.value = onb.height;
                const sInitials = document.getElementById('settings-initials');
                if (sInitials) sInitials.textContent = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
                const sEmail = document.getElementById('settings-email');
                if (sEmail) sEmail.textContent = user?.email ?? '—';
                const kEmail = document.getElementById('konto-email');
                if (kEmail) kEmail.textContent = user?.email ?? '—';
                const sId = document.getElementById('settings-user-id');
                if (sId) sId.textContent = userId.slice(0, 8) + '...';

                // Nowe pola profilu
                const editAge = document.getElementById('settings-edit-age');
                if (editAge && onb.dob_y) editAge.value = new Date().getFullYear() - parseInt(onb.dob_y);
                const editSex = document.getElementById('settings-edit-sex');
                if (editSex && onb.sex) editSex.value = onb.sex;
                _settingsSelectedDays = _daysToIdx(onb.selectedDays);
                document.querySelectorAll('.s-day-btn').forEach((btn, i) => {
                    btn.classList.toggle('selected', _settingsSelectedDays.includes(i));
                });
                selectSettingsLang(onb.language ?? 'pl');
                selectSettingsUnit(onb.unit ?? 'km');

                // Twój cel — inputs
                const editRaceDate = document.getElementById('settings-edit-race-date');
                const editTimeGoal = document.getElementById('settings-edit-time-goal');
                const editWeeklyKm = document.getElementById('settings-edit-weekly-km');
                if (editRaceDate && raceDate) editRaceDate.value = raceDate;
                if (editTimeGoal && onb.time_target_mins) {
                    const tg = onb.time_target_hours
                        ? onb.time_target_hours + ':' + String(onb.time_target_mins).padStart(2,'0') + ':' + String(onb.time_target_secs || 0).padStart(2,'0')
                        : onb.time_target_mins + ':' + String(onb.time_target_secs || 0).padStart(2,'0');
                    editTimeGoal.value = tg;
                }
                if (editWeeklyKm && onb.weekly_km) editWeeklyKm.value = onb.weekly_km;

                // Plan treningowy — cel tygodnia
                const planGoalEl = document.getElementById('settings-plan-goal');
                const plan = planData?.plan?.plan;
                if (planGoalEl) {
                    planGoalEl.textContent = plan?.cel_tygodnia || t('set.noplan');
                }

                // Cel i plan / Twój cel — realne dane (ring, podsumowanie, ten tydzień)
                renderGoalPanes(user, planData);
                _refreshProfilRows();
            } catch (e) { /* zostaw placeholdery */ }
        }

        function copyUserId() {
            const userId = localStorage.getItem('velm_user_id');
            if (!userId) return;
            navigator.clipboard.writeText(userId).then(() => {
                const el = document.getElementById('settings-user-id');
                if (el) { const orig = el.textContent; el.textContent = 'Skopiowano!'; setTimeout(() => el.textContent = orig, 1500); }
            }).catch(() => {});
        }

        async function saveProfileSettings() {
            const userId = localStorage.getItem('velm_user_id');
            if (!userId) return;
            const updates = {};
            const nameVal = document.getElementById('settings-edit-name')?.value?.trim();
            const weightVal = parseFloat(document.getElementById('settings-edit-weight')?.value);
            const heightVal = parseFloat(document.getElementById('settings-edit-height')?.value);
            if (nameVal) updates.name = nameVal;
            if (weightVal && weightVal > 0) updates.weight = weightVal;
            if (heightVal && heightVal > 0) updates.height = heightVal;
            const ageVal = parseInt(document.getElementById('settings-edit-age')?.value);
            if (ageVal >= 10 && ageVal <= 99) updates.dob_y = new Date().getFullYear() - ageVal;
            const sexVal = document.getElementById('settings-edit-sex')?.value;
            if (sexVal) updates.sex = sexVal;
            if (_settingsSelectedDays.length > 0) { updates.selectedDays = _idxToDays(_settingsSelectedDays); updates.daysPerWeek = _settingsSelectedDays.length; }
            if (_settingsLang) updates.language = _settingsLang;
            if (_settingsUnit) updates.unit = _settingsUnit;
            if (Object.keys(updates).length === 0) return;
            try {
                const res = await authFetch(`${API_BASE}/api/user/${userId}`, {
                    method: 'PUT', headers: authHeaders(),
                    body: JSON.stringify(updates)
                });
                const data = await res.json();
                if (!data.success) throw new Error(data.error);
                showVelmToast(t('com.saved'), false);   // toast — działa z każdego podekranu profilu
                _refreshProfilRows();                // odśwież podglądy w menu profilu (bez resetu widoku)
            } catch(e) {
                showVelmToast(t('set.saveerr') + ' ' + e.message, true);
            }
        }

        // Podglądy wartości w wierszach menu Profilu ("więcej się dzieje").
        function _refreshProfilRows() {
            const LANG = { pl:'Polski', en:'English', fr:'Français', es:'Español', de:'Deutsch' };
            const nm = document.getElementById('settings-edit-name')?.value?.trim();
            const rn = document.getElementById('profil-row-name');
            if (rn) rn.textContent = nm || t('prof.name.sub');
            const rd = document.getElementById('profil-row-dni');
            if (rd) rd.textContent = _settingsSelectedDays.length ? tp('prof.days.count', _settingsSelectedDays.length) : t('prof.days.sub');
            const rl = document.getElementById('profil-row-lang');
            if (rl) rl.textContent = (LANG[_settingsLang] || 'Polski') + ' · ' + t(_settingsUnit === 'mi' ? 'prof.units.mi' : 'prof.units.km');
        }

        function toggleSettingsDay(btn, idx) {
            const pos = _settingsSelectedDays.indexOf(idx);
            if (pos >= 0) _settingsSelectedDays.splice(pos, 1);
            else _settingsSelectedDays.push(idx);
            btn.classList.toggle('selected', _settingsSelectedDays.includes(idx));
        }

