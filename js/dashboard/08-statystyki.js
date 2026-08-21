        async function loadStats() {
            const el = document.getElementById('stats-content');
            if (!el) return;
            el.innerHTML = `<div style="display:flex;justify-content:center;align-items:center;height:260px;"><div class="velm-loader"><span></span><span></span><span></span></div></div>`;
            try {
                if (calendarPlan) {
                    statsData = calendarPlan;
                } else {
                    if (!currentUserId) throw new Error('no user');
                    const r = await authFetch(`${API_BASE}/api/plan/${currentUserId}`, { headers: authHeaders() });
                    if (!r.ok) throw new Error('http');
                    const d = await r.json();
                    if (!d.success || !d.plan) throw new Error('no plan');
                    statsData = d.plan;
                }
                await renderStats();
                setTimeout(updateStatsToggle, 60);
            } catch(e) {
                el.innerHTML = `
                    <div style="text-align:center;padding:80px 20px;">
                        <div style="margin-bottom:14px;color:#C4BFB4;">${velmIkona('statystyki', 30)}</div>
                        <div style="font-size:16px;font-weight:700;color:#111;margin-bottom:8px;">${t('chart.nodata')}</div>
                        <div style="font-size:13px;color:#8A8A8A;line-height:1.6;">${t('stats.nodata.desc')}</div>
                    </div>`;
            }
        }

        function _weekDays(dni) {
            const today = toDateStr(new Date());
            const abbrs = _dayNamesShort();
            const fulls = _dayNamesFull();
            return Array.from({length: 7}, (_, i) => {
                const pd  = dni[i] || null;
                const dow = pd?.data ? (new Date(pd.data + 'T00:00:00').getDay() + 6) % 7 : i;
                return {
                    abbr:    abbrs[dow],
                    full:    pd?.data ? fulls[(new Date(pd.data + 'T00:00:00').getDay() + 6) % 7] : fulls[i],
                    date:    pd?.data || null,
                    km:      pd?.dystans_km   ? parseFloat(pd.dystans_km)      : 0,
                    pace:    pd?.tempo_min_km ? _parseAvgPace(pd.tempo_min_km) : null,
                    typ:     pd?.typ  || null,
                    isToday: pd?.data === today,
                    isRest:  pd?.typ === 'rest',
                };
            });
        }

        function _monthWeeks(dni) {
            let ws = getMonday(new Date());
            if (dni.length && dni[0].data) ws = new Date(dni[0].data + 'T00:00:00');
            return [-3, -2, -1, 0].map(off => {
                const d0  = addDays(ws, off * 7);
                const lbl = off === 0 ? 'Ten' : `${d0.getDate()}/${d0.getMonth() + 1}`;
                if (off < 0) return { abbr: lbl, full: lbl, date: null, km: 0, pace: null, typ: null, isToday: false, isRest: true };
                let km = 0, pS = 0, pN = 0, typ = null;
                dni.forEach(pd => {
                    if (pd.dystans_km) km += parseFloat(pd.dystans_km);
                    if (pd.tempo_min_km && pd.typ !== 'rest') {
                        const p = _parseAvgPace(pd.tempo_min_km);
                        if (p) { pS += p; pN++; }
                    }
                    if (!typ && pd.typ && pd.typ !== 'rest') typ = pd.typ;
                });
                return { abbr: lbl, full: lbl, date: null, km, pace: pN > 0 ? Math.round(pS / pN) : null, typ: typ || 'easy', isToday: false, isRest: km === 0 };
            });
        }

        function _buildDistSVG(days) {
            const W = 360, H = 220;
            const pL = 38, pR = 12, pT = 22, pB = 34;
            const cW = W - pL - pR, cH = H - pT - pB;
            const n = days.length, colW = cW / n;
            const barW = Math.min(Math.max(colW * 0.52, 8), 38);
            const barR = Math.min(barW / 2, 6);
            const maxKm = Math.max(...days.map(d => d.km), 0.01);
            const niceMax = maxKm <= 5 ? 5 : maxKm <= 10 ? 10 : maxKm <= 15 ? 15 : maxKm <= 20 ? 20 : Math.ceil(maxKm / 5) * 5;
            const bottom = pT + cH;

            // Gradient defs for each training type
            const usedTypes = [...new Set(days.map(d => d.typ).filter(t => t && t !== 'rest'))];
            let defs = '<defs>';
            usedTypes.forEach(typ => {
                const c = TYPE_COLORS[typ] || '#888';
                defs += `<linearGradient id="bg-${typ}" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="${c}" stop-opacity="1"/>
                    <stop offset="100%" stop-color="${c}" stop-opacity="0.6"/>
                </linearGradient>`;
            });
            defs += '</defs>';

            // Y axis — 5 levels
            const yCount = 4;
            let grid = '', yAxis = '';
            for (let i = 0; i <= yCount; i++) {
                const v = Math.round((niceMax / yCount) * i);
                const y = (bottom - (v / niceMax) * cH).toFixed(1);
                grid += `<line class="s-grid" x1="${pL}" y1="${y}" x2="${(pL+cW).toFixed(1)}" y2="${y}" stroke="${i === 0 ? '#D8D2C4' : '#EEEBE3'}" stroke-width="1" opacity="0"/>`;
                yAxis += `<text class="s-grid" x="${pL-8}" y="${y}" text-anchor="end" dominant-baseline="middle" font-size="10" fill="${i === 0 ? '#8A8A8A' : '#8A8A8A'}" font-family="Inter,sans-serif" opacity="0">${v}</text>`;
            }

            let rects = '', labels = '', xAxis = '';
            days.forEach((d, i) => {
                const cx    = pL + (i + 0.5) * colW;
                const color = d.typ && TYPE_COLORS[d.typ] ? TYPE_COLORS[d.typ] : '#EBEBEB';
                const isZero = d.isRest || d.km === 0;
                const barH  = isZero ? 3 : Math.max((d.km / niceMax) * cH, 5);
                const fill  = isZero ? '#EBEBEB' : (usedTypes.includes(d.typ) ? `url(#bg-${d.typ})` : color);
                const lClr  = isZero ? '#C8C2B8' : color;
                const kmStr = (d.km > 0 && !d.isRest) ? d.km.toFixed(1) : '0';
                const x = (cx - barW/2).toFixed(1), y = (bottom - barH).toFixed(1);
                const tipD = d.full || d.abbr;
                const tipV = d.km > 0 ? `${d.km.toFixed(1)} km` : (d.isRest ? 'Odpoczynek' : '—');
                const tipT = d.typ ? (TYPE_LABEL(d.typ) || d.typ) : '';

                // Today: soft glow ring
                if (d.isToday) rects += `<rect x="${(cx-barW/2-3).toFixed(1)}" y="${(bottom-barH-3).toFixed(1)}" width="${(barW+6).toFixed(1)}" height="${(barH+3).toFixed(1)}" rx="${barR+2}" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.25" stroke-dasharray="3 3"/>`;

                rects += `<rect class="s-bar" data-i="${i}" data-cx="${cx.toFixed(1)}" data-bot="${bottom}" x="${x}" y="${y}" width="${barW.toFixed(1)}" height="${barH.toFixed(1)}" rx="${barR}" fill="${fill}" onclick="showStatsTip('dist',this,'${tipD}','${tipV}','${tipT}')" style="cursor:pointer;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.08));"/>`;

                const lblY = (bottom - barH - 8).toFixed(1);
                labels += `<text class="s-lbl" data-i="${i}" x="${cx.toFixed(1)}" y="${lblY}" text-anchor="middle" font-size="10" font-weight="700" fill="${lClr}" font-family="Inter,sans-serif" opacity="0">${kmStr}</text>`;

                // X axis — highlight today
                const xFill = d.isToday ? '#111' : '#8A8A8A';
                const xWeight = d.isToday ? 'font-weight:700' : '';
                xAxis += `<text x="${cx.toFixed(1)}" y="${(bottom+22).toFixed(1)}" text-anchor="middle" font-size="11" fill="${xFill}" font-family="Inter,sans-serif" style="${xWeight}">${d.abbr}</text>`;
                if (d.isToday) xAxis += `<circle cx="${cx.toFixed(1)}" cy="${(bottom+28).toFixed(1)}" r="2" fill="var(--primary-color)"/>`;
            });

            return `<svg id="s-dist-svg" viewBox="0 0 ${W} ${H}" width="100%" style="display:block;overflow:visible;">${defs}${grid}${yAxis}${rects}${labels}${xAxis}</svg>`;
        }

        function _buildPaceSVG(days) {
            const W = 360, H = 230;
            const pL = 38, pR = 14, pT = 18, pB = 52;
            const cW = W - pL - pR, cH = H - pT - pB;
            const n = days.length;
            const validP = days.map(d => d.pace).filter(Boolean);
            if (validP.length < 2) return { html: `<div style="text-align:center;padding:40px 0;color:#8A8A8A;font-size:13px;">${t('stats.nopace')}</div>`, avg: null };

            const minP = Math.min(...validP), maxP = Math.max(...validP);
            const pad  = Math.max(20, Math.round((maxP - minP) * 0.3));
            const pMin = Math.floor((minP - pad) / 15) * 15;
            const pMax = Math.ceil((maxP  + pad) / 15) * 15;
            const span = pMax - pMin || 60;
            // Note: lower sec = faster = higher on chart
            const pY  = sec => pT + (sec - pMin) / span * cH;
            const xAt = i   => pL + (i / Math.max(n - 1, 1)) * cW;

            // Y axis — 4 grid lines
            const step = Math.max(Math.round(span / 3 / 15) * 15, 15);
            let yTxt = '', yGrid = '';
            for (let s = pMin; s <= pMax + 1; s += step) {
                const y = pY(s);
                if (y < pT - 4 || y > pT + cH + 4) continue;
                yTxt  += `<text class="s-grid" x="${pL - 6}" y="${y.toFixed(1)}" text-anchor="end" dominant-baseline="middle" font-size="9.5" fill="#8A8A8A" font-family="Inter,sans-serif" opacity="0">${_p2t(s)}</text>`;
                yGrid += `<line class="s-grid" x1="${pL}" y1="${y.toFixed(1)}" x2="${(pL + cW).toFixed(1)}" y2="${y.toFixed(1)}" stroke="${s === pMin ? '#D8D2C4' : '#EEEBE3'}" stroke-width="${s === pMin ? '1' : '0.8'}" ${s === pMin ? '' : 'stroke-dasharray="4 3"'} opacity="0"/>`;
            }

            // Points — only where pace exists, straight lines
            const ptsAll = days.map((d, i) => d.pace !== null ? [xAt(i), pY(d.pace)] : null);
            const validPts = ptsAll.filter(Boolean);
            const linePD = validPts.length < 2 ? '' : validPts.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt[0].toFixed(1)},${pt[1].toFixed(1)}`).join(' ');
            const fPt = validPts[0], lPt = validPts[validPts.length - 1];
            const baseline = pT + cH;

            // Area fill under the curve
            const areaPD = (linePD && fPt && lPt)
                ? linePD + ` L${lPt[0].toFixed(1)},${baseline.toFixed(1)} L${fPt[0].toFixed(1)},${baseline.toFixed(1)} Z`
                : '';

            // Dashed horizontal reference lines from Y-axis to each data point
            const refLines = days.map((d, i) => {
                if (d.pace === null) return '';
                const x = xAt(i).toFixed(1), y = pY(d.pace).toFixed(1);
                return `<line x1="${pL}" y1="${y}" x2="${x}" y2="${y}" stroke="#D8D2C4" stroke-width="0.7" stroke-dasharray="3 3"/>`;
            }).join('');

            // Bottom rows: row1=day abbr, row2=type label (colored), row3=pace (amber)
            const rowY1 = baseline + 14;
            const rowY2 = baseline + 25;
            const rowY3 = baseline + 37;

            const xLbls = days.map((d, i) => {
                const x = xAt(i).toFixed(1);
                const isTod = d.isToday;
                let s = `<text x="${x}" y="${rowY1}" text-anchor="middle" font-size="9" fill="${isTod ? '#111' : '#8A8A8A'}" font-family="Inter,sans-serif" font-weight="${isTod ? '700' : '400'}">${d.abbr}</text>`;
                if (isTod) s += `<circle cx="${x}" cy="${(rowY1 + 5)}" r="1.8" fill="var(--primary-color)"/>`;
                return s;
            }).join('');

            const typeLabels = days.map((d, i) => {
                const x = xAt(i).toFixed(1);
                const col = d.typ && TYPE_COLORS[d.typ] ? TYPE_COLORS[d.typ] : '#C8C2B8';
                const lbl = d.typ && d.typ !== 'rest' ? (TYPE_LABEL(d.typ) || d.typ).slice(0, 5) : '·';
                return `<text x="${x}" y="${rowY2}" text-anchor="middle" font-size="7.5" fill="${col}" font-family="Inter,sans-serif" font-weight="700" style="animation:fadeIn 0.3s ease ${680 + i * 50}ms both;">${lbl}</text>`;
            }).join('');

            const paceRow = days.map((d, i) => {
                if (!d.pace) return '';
                return `<text x="${xAt(i).toFixed(1)}" y="${rowY3}" text-anchor="middle" font-size="8" fill="#9A7F3E" font-family="Inter,sans-serif" font-weight="600" style="animation:fadeIn 0.3s ease ${750 + i * 50}ms both;">${_p2t(d.pace)}</text>`;
            }).join('');

            // Dots — colored by training type, today larger
            const dots = days.map((d, i) => {
                if (d.pace === null) return '';
                const x = xAt(i).toFixed(1), y = pY(d.pace).toFixed(1);
                const col = d.typ && TYPE_COLORS[d.typ] ? TYPE_COLORS[d.typ] : '#888';
                const r = d.isToday ? '5.5' : '4';
                const dl = 900 + i * 60;
                const tipD = d.full || d.abbr, tipT = d.typ ? (TYPE_LABEL(d.typ) || d.typ) : '';
                return `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" stroke="#FFFFFF" stroke-width="1.5" onclick="showStatsTip('pace',this,'${tipD}','${_p2t(d.pace)} min/km','${tipT}')" style="cursor:pointer;transform-origin:${x}px ${y}px;animation:popDot 0.35s cubic-bezier(0.34,1.56,0.64,1) ${dl}ms both;"/>`;
            }).join('');

            const avg = Math.round(validP.reduce((a, b) => a + b) / validP.length);
            const html = `<svg id="s-pace-svg" viewBox="0 0 ${W} ${H}" width="100%" style="display:block;overflow:visible;">
                <defs>
                    <linearGradient id="s-pg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stop-color="#1A1A1A" stop-opacity="0.12"/>
                        <stop offset="100%" stop-color="#1A1A1A" stop-opacity="0"/>
                    </linearGradient>
                </defs>
                ${yGrid}${yTxt}
                ${refLines}
                ${areaPD ? `<path d="${areaPD}" fill="url(#s-pg)"/>` : ''}
                ${linePD ? `<path id="s-p-line" d="${linePD}" fill="none" stroke="#1A1A1A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
                ${xLbls}${typeLabels}${paceRow}${dots}
            </svg>`;
            return { html, avg };
        }

        async function loadRealWorkouts() {
            if (!currentUserId) return null;
            try {
                const res = await authFetch(`${API_BASE}/api/health/${currentUserId}?type=workouts&days=7`, { headers: authHeaders() });
                const data = await res.json();
                return data.workouts || null;
            } catch(e) { return null; }
        }

        function _realWorkoutsToDni(workouts) {
            const map = {};
            for (const w of workouts) {
                if (w.date) map[w.date] = w;
            }
            const mon = getMonday(new Date());
            return Array.from({length: 7}, (_, i) => {
                const d       = addDays(mon, i);
                const dateStr = toDateStr(d);
                const w       = map[dateStr];
                if (!w) return { data: dateStr, dystans_km: 0, tempo_min_km: null, typ: 'rest' };
                const pace = w.avg_pace != null
                    ? w.avg_pace
                    : (w.duration_min && w.distance_km ? w.duration_min / w.distance_km : null);
                return {
                    data:         dateStr,
                    dystans_km:   w.distance_km || 0,
                    tempo_min_km: pace,
                    typ:          w.type || w.typ || 'easy'
                };
            });
        }

        async function renderStats() {
            const el = document.getElementById('stats-content');
            if (!el || !statsData) return;

            // Próbuj załadować realne treningi — fallback na plan
            const realWorkouts  = await loadRealWorkouts();
            const hasRealData   = realWorkouts && realWorkouts.some(w => w.distance_km > 0);
            const usingRealData = hasRealData;

            let dni;
            if (usingRealData) {
                dni = _realWorkoutsToDni(realWorkouts);
            } else {
                dni = statsData.dni || [];
            }

            if (!dni.length) {
                el.innerHTML = `
                    <div style="text-align:center;padding:80px 20px;">
                        <div style="margin-bottom:14px;color:#C4BFB4;">${velmIkona('statystyki', 30)}</div>
                        <div style="font-size:16px;font-weight:700;color:#111;margin-bottom:8px;">${t('stats.nodata2.title')}</div>
                        <div style="font-size:13px;color:#8A8A8A;line-height:1.6;">${t('stats.nodata.desc')}</div>
                    </div>`;
                return;
            }
            const days    = statsRange === 'week' ? _weekDays(dni) : _monthWeeks(dni);
            const totalKm = days.reduce((s, d) => s + d.km, 0);
            const sessions = days.filter(d => d.km > 0 && !d.isRest).length;
            const totalSessions = dni.filter(d => d.dystans_km && parseFloat(d.dystans_km) > 0 && d.typ !== 'rest').length;
            const { html: paceSVG, avg: avgSec } = _buildPaceSVG(days);
            const distSVG = _buildDistSVG(days);

            // Legend — unique training types present
            const typesPresent = [...new Set(days.map(d => d.typ).filter(t => t && t !== 'rest'))];
            const legendHTML = typesPresent.length > 0
                ? `<div class="stats-legend">${typesPresent.map(t =>
                    `<div class="stats-legend-item"><div class="stats-legend-dot" style="background:${TYPE_COLORS[t]||'#ccc'}"></div>${TYPE_LABEL(t)||t}</div>`
                  ).join('')}</div>`
                : '';

            el.innerHTML = `
                <!-- Hero stats strip -->
                <div class="stats-hero">
                    <div class="stats-hero-card" data-hi="0"
                        onclick="switchStatsMetric('km')"
                        style="cursor:pointer;transition:border-color 0.2s,background 0.2s;border:${statsMetric==='km'?'2px solid var(--primary-color)':'1px solid #EBEBEB'};background:${statsMetric==='km'?'rgba(17,17,17,0.04)':'#fff'}">
                        <div class="sh-icon"><svg width="26" height="26" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#7B98B0"/></svg></div>
                        <div class="sh-val" id="s-hero-km">0</div>
                        <div class="sh-label">${t('hist.km')}</div>
                    </div>
                    <div class="stats-hero-card" data-hi="1"
                        onclick="switchStatsMetric('pace')"
                        style="cursor:pointer;transition:border-color 0.2s,background 0.2s;border:${statsMetric==='pace'?'2px solid var(--primary-color)':'1px solid #EBEBEB'};background:${statsMetric==='pace'?'rgba(17,17,17,0.04)':'#fff'}">
                        <div class="sh-icon"><svg width="26" height="26" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#C4A35A"/><polyline points="12 7 12 12 15.5 14" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                        <div class="sh-val" id="s-hero-pace">${avgSec ? _p2t(avgSec) : '—'}</div>
                        <div class="sh-label">${t('stats.avgpace')}</div>
                    </div>
                    <div class="stats-hero-card" data-hi="2">
                        <div class="sh-icon"><svg width="26" height="26" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="17" rx="2" fill="#6B8F71"/><rect x="3" y="5" width="18" height="6" rx="2" fill="#6B8F71"/><line x1="16" y1="2" x2="16" y2="6" stroke="#fff" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="#fff" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="15" x2="16" y2="15" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg></div>
                        <div class="sh-val" id="s-hero-sess">0</div>
                        <div class="sh-label">${t('stats.total')}</div>
                    </div>
                </div>

                <!-- Chart card — one visible at a time -->
                <div class="stats-chart-card" data-ci="0">
                    <div id="s-chart-container">
                        ${statsMetric === 'km' ? `
                        <div class="sc-header">
                            <span class="sc-title">${t('home.dist')}</span>
                            <span class="sc-value" id="s-km-total">${totalKm.toFixed(1)} km</span>
                        </div>
                        <div class="sc-desc">${statsRange === 'week' ? t('stats.desc.week') : t('stats.desc.month')}</div>
                        ${distSVG}
                        ${legendHTML}
                        <div id="s-dist-tip" class="stats-tooltip"></div>
                        ` : `
                        <div class="sc-header">
                            <span class="sc-title">${t('home.pace')}</span>
                            ${avgSec ? `<span class="sc-value" style="color:#111;">${t('stats.avg')} ${_p2t(avgSec)} <span style="font-size:12px;font-weight:400;color:#8A8A8A;">min/km</span></span>` : `<span style="font-size:12px;color:#8A8A8A;">—</span>`}
                        </div>
                        <div class="sc-desc">${t('stats.pace.desc')}</div>
                        ${paceSVG}
                        <div id="s-pace-tip" class="stats-tooltip"></div>
                        `}
                    </div>
                </div>
                ${!usingRealData ? `<div style="text-align:center;margin-top:8px;font-size:11px;color:#B0A898;letter-spacing:0.03em;">${t('stats.planned')}</div>` : ''}`;

            _statsCurrentDays = days;

            // === CHOREOGRAPHED ANIMATION SEQUENCE ===
            requestAnimationFrame(() => requestAnimationFrame(() => {

                // Phase 0: Hero cards fly in (staggered)
                document.querySelectorAll('.stats-hero-card').forEach(card => {
                    const i = parseInt(card.dataset.hi);
                    card.style.transition = `opacity 400ms cubic-bezier(0.4,0,0.2,1) ${i * 80}ms, transform 400ms cubic-bezier(0.34,1.56,0.64,1) ${i * 80}ms`;
                    requestAnimationFrame(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; });
                });

                // Phase 0b: Animate hero numbers
                const heroKm = document.getElementById('s-hero-km');
                const heroSess = document.getElementById('s-hero-sess');
                if (heroKm && totalKm > 0) {
                    setTimeout(() => animateNumber(heroKm, 0, parseFloat(totalKm.toFixed(1)), 900, ''), 200);
                }
                if (heroSess && totalSessions > 0) {
                    setTimeout(() => animateNumber(heroSess, 0, totalSessions, 600, ''), 280);
                }

                // Phase 1: Chart cards slide in
                document.querySelectorAll('.stats-chart-card').forEach(card => {
                    const i = parseInt(card.dataset.ci);
                    card.style.transition = `opacity 450ms cubic-bezier(0.4,0,0.2,1) ${300 + i * 120}ms, transform 450ms cubic-bezier(0.34,1.56,0.64,1) ${300 + i * 120}ms`;
                    requestAnimationFrame(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; });
                });

                // Phase 2: Grid lines fade in (350ms delay)
                setTimeout(() => {
                    document.querySelectorAll('#s-dist-svg .s-grid').forEach((el, i) => {
                        el.style.transition = `opacity 250ms ease ${i * 30}ms`;
                        el.style.opacity = '1';
                    });
                }, 350);

                // Phase 3: Bars grow (500ms delay)
                setTimeout(() => {
                    document.querySelectorAll('.s-bar').forEach(rect => {
                        const i   = parseInt(rect.dataset.i);
                        const cx  = rect.dataset.cx, bot = rect.dataset.bot;
                        rect.style.transformOrigin = `${cx}px ${bot}px`;
                        rect.style.transform       = 'scaleY(0)';
                        rect.style.transition      = `transform 550ms cubic-bezier(0.34,1.56,0.64,1) ${i * 60}ms`;
                        requestAnimationFrame(() => {
                            rect.style.transform = 'scaleY(1)';
                            rect.addEventListener('transitionend', () => { rect.style.willChange = 'auto'; }, { once: true });
                        });
                    });
                }, 500);

                // Phase 4: Bar labels pop in (after bars)
                setTimeout(() => {
                    document.querySelectorAll('.s-lbl').forEach(txt => {
                        const i = parseInt(txt.dataset.i);
                        txt.style.transition = `opacity 0.3s ease ${i * 50}ms, transform 0.3s cubic-bezier(0.34,1.56,0.64,1) ${i * 50}ms`;
                        txt.style.transform = 'translateY(4px)';
                        requestAnimationFrame(() => { txt.style.opacity = '1'; txt.style.transform = 'translateY(0)'; });
                    });
                }, 900);

                // Phase 5: Pace grid + line (after dist chart finishes)
                setTimeout(() => {
                    document.querySelectorAll('#s-pace-svg .s-grid').forEach((el, i) => {
                        el.style.transition = `opacity 250ms ease ${i * 30}ms`;
                        el.style.opacity = '1';
                    });
                }, 750);

                // Phase 6: Pace line draw
                setTimeout(() => {
                    const pLine = document.getElementById('s-p-line');
                    if (pLine && typeof pLine.getTotalLength === 'function') {
                        const len = pLine.getTotalLength();
                        if (len > 0) {
                            pLine.style.strokeDasharray  = len;
                            pLine.style.strokeDashoffset = len;
                            pLine.style.transition = `stroke-dashoffset 900ms cubic-bezier(0.4,0,0.2,1)`;
                            requestAnimationFrame(() => { pLine.style.strokeDashoffset = '0'; });
                        }
                    }
                }, 900);

                // Phase 7: km counter in header
                const kmEl = document.getElementById('s-km-total');
                if (kmEl && totalKm > 0) {
                    setTimeout(() => animateNumber(kmEl, 0, parseFloat(totalKm.toFixed(1)), 800, ' km'), 600);
                }

            }));
        }

        function switchCalMetric(metric) {
            if (metric === calMetric) return;
            calMetric = metric;

            const kmGrp   = document.getElementById('wk-km-group');
            const paceGrp = document.getElementById('wk-pace-group');
            const yKmGrp  = document.getElementById('wk-y-km');
            const yPGrp   = document.getElementById('wk-y-pace');

            if (kmGrp)   { kmGrp.style.opacity   = metric === 'km'   ? '1' : '0'; kmGrp.style.pointerEvents   = metric === 'km'   ? '' : 'none'; }
            if (paceGrp) { paceGrp.style.opacity = metric === 'pace' ? '1' : '0'; paceGrp.style.pointerEvents = metric === 'pace' ? '' : 'none'; }
            if (yKmGrp)  yKmGrp.style.opacity  = metric === 'km'   ? '1' : '0';
            if (yPGrp)   yPGrp.style.opacity   = metric === 'pace' ? '1' : '0';

            document.querySelectorAll('.cal-metric-btn').forEach(btn => {
                const active = btn.dataset.metric === metric;
                btn.style.border     = active ? '2px solid var(--primary-color)' : '1px solid #EBEBEB';
                btn.style.background = active ? 'rgba(17,17,17,0.04)' : 'transparent';
            });
        }

        function switchStatsMetric(metric) {
            if (metric === statsMetric || !_statsCurrentDays) return;
            statsMetric = metric;

            // Update hero card borders
            const cards = document.querySelectorAll('.stats-hero-card[onclick]');
            cards.forEach(card => {
                const isKm    = card.getAttribute('onclick').includes('km');
                const active  = (metric === 'km' && isKm) || (metric === 'pace' && !isKm);
                card.style.border     = active ? '2px solid var(--primary-color)' : '1px solid #EBEBEB';
                card.style.background = active ? 'rgba(17,17,17,0.04)' : '#fff';
            });

            // Build new chart HTML
            const days = _statsCurrentDays;
            let newHTML = '';
            if (metric === 'km') {
                const { html: _p, avg: _a } = _buildPaceSVG(days); // unused — just for totalKm
                const totalKm = days.reduce((s, d) => s + d.km, 0);
                const distSVG = _buildDistSVG(days);
                const typesPresent = [...new Set(days.map(d => d.typ).filter(t => t && t !== 'rest'))];
                const legendHTML = typesPresent.length > 0
                    ? `<div class="stats-legend">${typesPresent.map(t =>
                        `<div class="stats-legend-item"><div class="stats-legend-dot" style="background:${TYPE_COLORS[t]||'#ccc'}"></div>${TYPE_LABEL(t)||t}</div>`
                      ).join('')}</div>` : '';
                newHTML = `
                    <div class="sc-header">
                        <span class="sc-title">${t('home.dist')}</span>
                        <span class="sc-value" id="s-km-total">${totalKm.toFixed(1)} km</span>
                    </div>
                    <div class="sc-desc">${statsRange === 'week' ? t('stats.desc.week') : t('stats.desc.month')}</div>
                    ${distSVG}${legendHTML}
                    <div id="s-dist-tip" class="stats-tooltip"></div>`;
            } else {
                const { html: paceSVG, avg: avgSec } = _buildPaceSVG(days);
                newHTML = `
                    <div class="sc-header">
                        <span class="sc-title">${t('home.pace')}</span>
                        ${avgSec ? `<span class="sc-value" style="color:#111;">${t('stats.avg')} ${_p2t(avgSec)} <span style="font-size:12px;font-weight:400;color:#8A8A8A;">min/km</span></span>` : `<span style="font-size:12px;color:#8A8A8A;">—</span>`}
                    </div>
                    <div class="sc-desc">${t('stats.pace.desc')}</div>
                    ${paceSVG}
                    <div id="s-pace-tip" class="stats-tooltip"></div>`;
            }

            // Fade out → swap → fade in
            const container = document.getElementById('s-chart-container');
            if (!container) return;
            container.style.transition = 'opacity 120ms ease';
            container.style.opacity = '0';
            setTimeout(() => {
                container.innerHTML = newHTML;
                container.style.transition = 'opacity 180ms ease';
                requestAnimationFrame(() => { container.style.opacity = '1'; });

                // Run animations for the new chart
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    if (metric === 'km') {
                        document.querySelectorAll('#s-dist-svg .s-grid').forEach((el, i) => {
                            el.style.transition = `opacity 250ms ease ${i * 30}ms`;
                            el.style.opacity = '1';
                        });
                        setTimeout(() => {
                            document.querySelectorAll('.s-bar').forEach(rect => {
                                const i = parseInt(rect.dataset.i);
                                const cx = rect.dataset.cx, bot = rect.dataset.bot;
                                rect.style.transformOrigin = `${cx}px ${bot}px`;
                                rect.style.transform = 'scaleY(0)';
                                rect.style.transition = `transform 550ms cubic-bezier(0.34,1.56,0.64,1) ${i * 60}ms`;
                                requestAnimationFrame(() => { rect.style.transform = 'scaleY(1)'; });
                            });
                        }, 150);
                        setTimeout(() => {
                            document.querySelectorAll('.s-lbl').forEach(txt => {
                                const i = parseInt(txt.dataset.i);
                                txt.style.transition = `opacity 0.3s ease ${i * 50}ms, transform 0.3s cubic-bezier(0.34,1.56,0.64,1) ${i * 50}ms`;
                                txt.style.transform = 'translateY(4px)';
                                requestAnimationFrame(() => { txt.style.opacity = '1'; txt.style.transform = 'translateY(0)'; });
                            });
                        }, 550);
                    } else {
                        document.querySelectorAll('#s-pace-svg .s-grid').forEach((el, i) => {
                            el.style.transition = `opacity 250ms ease ${i * 30}ms`;
                            el.style.opacity = '1';
                        });
                        setTimeout(() => {
                            const pLine = document.getElementById('s-p-line');
                            if (pLine && typeof pLine.getTotalLength === 'function') {
                                const len = pLine.getTotalLength();
                                if (len > 0) {
                                    pLine.style.strokeDasharray  = len;
                                    pLine.style.strokeDashoffset = len;
                                    pLine.style.transition = `stroke-dashoffset 900ms cubic-bezier(0.4,0,0.2,1)`;
                                    requestAnimationFrame(() => { pLine.style.strokeDashoffset = '0'; });
                                }
                            }
                        }, 200);
                    }
                }));
            }, 130);
        }

        function showStatsTip(chartId, el, day, value, typ) {
            const tip = document.getElementById(`s-${chartId}-tip`);
            if (!tip) return;
            clearTimeout(_statsTipTimer);
            document.querySelectorAll('.stats-tooltip.visible').forEach(t => t.classList.remove('visible'));
            const card  = tip.parentElement;
            const r     = el.getBoundingClientRect();
            const cr    = card.getBoundingClientRect();
            tip.innerHTML = `<strong style="display:block;margin-bottom:2px;">${day}</strong>${value}${typ ? ` · ${typ}` : ''}`;
            tip.style.left = `${r.left + r.width / 2 - cr.left + 10}px`;
            tip.style.top  = `${r.top - cr.top - (tip.offsetHeight || 44) - 10}px`;
            requestAnimationFrame(() => { tip.classList.add('visible'); });
            _statsTipTimer = setTimeout(() => { tip.classList.remove('visible'); }, 2000);
            const hide = e => { if (!tip.contains(e.target)) { tip.classList.remove('visible'); document.removeEventListener('click', hide); } };
            setTimeout(() => document.addEventListener('click', hide), 100);
        }

