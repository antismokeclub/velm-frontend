        // ── CHAT DEEP-LINK CONTEXT ──────────────────────────────────
        window.chatContext = null; // { source, date, weekStart, weekEnd, trainingRef }

        // ── CALENDAR v2 ─────────────────────────────────────────────
        const TYPE_COLORS = { easy:'#A8C8DC', interval:'#1A3356', tempo:'#1A3356', long:'#6A9BBF', rest:'#EBEBEB', cross:'#6A9BBF', walkrun:'#A8C8DC' };
        const TYPE_EMOJI  = {
            easy:     `<span style="width:9px;height:9px;border-radius:50%;display:inline-block;background:#6B8F71;flex-shrink:0;"></span>`,
            interval: `<span style="width:9px;height:9px;border-radius:50%;display:inline-block;background:#C07264;flex-shrink:0;"></span>`,
            tempo:    `<span style="width:9px;height:9px;border-radius:50%;display:inline-block;background:#C4A35A;flex-shrink:0;"></span>`,
            long:     `<span style="width:9px;height:9px;border-radius:50%;display:inline-block;background:#7B98B0;flex-shrink:0;"></span>`,
            rest:     `<span style="width:9px;height:9px;border-radius:50%;display:inline-block;background:#E8E2D6;flex-shrink:0;"></span>`,
            cross:    `<span style="width:9px;height:9px;border-radius:50%;display:inline-block;background:#7B98B0;flex-shrink:0;"></span>`,
            walkrun:  `<span style="width:9px;height:9px;border-radius:50%;display:inline-block;background:#C4A35A;flex-shrink:0;"></span>`
        };
        function TYPE_LABEL(typ) { return typ ? t('wtype.' + typ) : ''; }

        // Nazwy dni i miesięcy: patrz _dayNamesShort/_dayNamesFull/_monthNames
        // oraz _i18nDate w 12-i18n.js. Tablicy dopełniaczowej ("9 sierpnia") już
        // nie trzymamy — Intl odmienia sam, gdy formatuje się CAŁĄ datę.

        let calendarPlan  = null;
        let calView       = 'week';
        let calMonth      = new Date().getMonth();
        let calYear       = new Date().getFullYear();
        let calWeekStart  = getMonday(new Date());
        let calSelectedDay= toDateStr(new Date());
        let calMetric     = 'km';

        function toDateStr(d) {
            return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        }
        function getMonday(d) {
            const date = new Date(d);
            const dow  = date.getDay() === 0 ? 6 : date.getDay() - 1;
            date.setDate(date.getDate() - dow);
            date.setHours(0,0,0,0);
            return date;
        }
        function addDays(d, n) {
            const r = new Date(d); r.setDate(r.getDate() + n); return r;
        }
        function getDayData(dateStr) {
            if (!calendarPlan?.dni) return null;
            return calendarPlan.dni.find(d => d.data === dateStr) ?? null;
        }

        function updateCalToggle(view) {
            const wrap  = document.getElementById('cal-toggle-wrap');
            const views = ['month','week','day'];
            const ids   = ['cal-btn-month','cal-btn-week','cal-btn-day'];
            const idx   = views.indexOf(view);
            ids.forEach((id, i) => {
                const btn = document.getElementById(id);
                if (!btn) return;
                btn.style.fontWeight = i === idx ? '600' : '400';
                btn.style.color      = i === idx ? 'var(--primary-color)' : '#888';
            });
            if (!wrap) return;
            const totalW  = wrap.offsetWidth - 6;
            const sliderW = totalW / 3;
            const slider  = document.getElementById('cal-toggle-slider');
            if (slider) {
                slider.style.width = sliderW + 'px';
                slider.style.left  = (3 + idx * sliderW) + 'px';
            }
        }

        function switchCalView(view, dateStr) {
            calView = view;
            if (dateStr) calSelectedDay = dateStr;
            renderCalendar();
            updateCalToggle(view);
        }

        function renderCalendar() {
            if (!calendarPlan) return;
            if      (calView === 'month') renderMonthView();
            else if (calView === 'week')  renderWeekView();
            else                          renderDayView();
        }

        function prevCal() {
            if (calView === 'month') {
                calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; }
                renderMonthView('right');
            } else if (calView === 'week') {
                calWeekStart = addDays(calWeekStart, -7);
                renderWeekView('right');
            } else {
                calSelectedDay = toDateStr(addDays(new Date(calSelectedDay), -1));
                renderDayView();
            }
        }
        function nextCal() {
            if (calView === 'month') {
                calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; }
                renderMonthView('left');
            } else if (calView === 'week') {
                calWeekStart = addDays(calWeekStart, 7);
                renderWeekView('left');
            } else {
                calSelectedDay = toDateStr(addDays(new Date(calSelectedDay), 1));
                renderDayView();
            }
        }

        // ── MONTH VIEW ────────────────────────────────────────────────
        function renderMonthView(slideAnim) {
            const calContent = document.getElementById('cal-content');
            if (!calContent) return;
            const todayStr  = toDateStr(new Date());
            const firstDay  = new Date(calYear, calMonth, 1);
            const startCell = getMonday(firstDay);
            let cells = '';
            const cur = new Date(startCell);
            for (let row = 0; row < 6; row++) {
                for (let col = 0; col < 7; col++) {
                    const ds       = toDateStr(cur);
                    const inMonth  = cur.getMonth() === calMonth;
                    const isToday  = ds === todayStr;
                    const day      = getDayData(ds);
                    const bar      = day
                        ? `<div style="height:3px;border-radius:2px;background:${TYPE_COLORS[day.typ]||'#ccc'};margin-top:3px;width:80%;"></div>`
                        : '';
                    cells += `<div
                        onclick="${inMonth ? `calDayClick('${ds}')` : ''}"
                        style="height:44px;display:flex;flex-direction:column;align-items:center;padding-top:6px;border-radius:8px;
                            cursor:${inMonth ? 'pointer' : 'default'};opacity:${inMonth ? '1' : '0.22'};
                            background:${day && inMonth ? '#FFFFFF' : 'transparent'};
                            ${isToday && inMonth ? 'border:2px solid var(--primary-color);' : ''}
                            transition:transform 80ms ease;"
                        ${inMonth ? `ontouchstart="this.style.transform='scale(0.94)'" ontouchend="this.style.transform='scale(1)'"` : ''}>
                        <span style="font-size:13px;font-weight:600;color:#111;line-height:1;">${cur.getDate()}</span>
                        ${bar}
                    </div>`;
                    cur.setDate(cur.getDate() + 1);
                }
            }
            const animClass = slideAnim === 'left' ? 'cal-slide-in-left' : slideAnim === 'right' ? 'cal-slide-in-right' : 'cal-animate';
            const monthLabel = _capFirst(_i18nDate(new Date(calYear, calMonth, 1), { month: 'long', year: 'numeric' }));
            calContent.innerHTML = `
                <div class="${animClass}">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                        <button onclick="prevCal()" style="background:none;border:none;font-size:24px;color:var(--primary-color);cursor:pointer;padding:4px 8px;line-height:1;">‹</button>
                        <span style="font-weight:700;font-size:15px;color:#111;">${monthLabel}</span>
                        <button onclick="nextCal()" style="background:none;border:none;font-size:24px;color:var(--primary-color);cursor:pointer;padding:4px 8px;line-height:1;">›</button>
                    </div>
                    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:4px;">
                        ${_dayNamesShort().map(d=>`<div style="text-align:center;font-size:10px;font-weight:600;letter-spacing:0.06em;color:#8A8A8A;text-transform:uppercase;padding-bottom:4px;">${d}</div>`).join('')}
                    </div>
                    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;">${cells}</div>
                </div>`;
        }

        function calDayClick(ds) { switchCalView('day', ds); }

        function parsePaceToSec(paceStr) {
            if (!paceStr) return null;
            const part = paceStr.split('-')[0].trim().split('/')[0].trim();
            const [m, s] = part.split(':').map(Number);
            if (isNaN(m) || isNaN(s)) return null;
            return m * 60 + s;
        }
        function secToPace(sec) {
            const m = Math.floor(sec / 60);
            const s = sec % 60;
            return `${m}:${String(s).padStart(2,'0')}`;
        }

        // ── WEEK VIEW ─────────────────────────────────────────────────
        function renderWeekView(slideAnim) {
            const calContent = document.getElementById('cal-content');
            if (!calContent) return;
            const todayStr = toDateStr(new Date());
            const days = Array.from({length:7}, (_, i) => addDays(calWeekStart, i));
            if (!days.find(d => toDateStr(d) === calSelectedDay)) {
                const todayInWeek = days.find(d => toDateStr(d) === todayStr);
                calSelectedDay = todayInWeek ? todayStr : toDateStr(days[0]);
            }
            const from = days[0], to = days[6];
            // formatRange sam skraca powtórzony miesiąc ("1–7 sierpnia 2026")
            // i odmienia go poprawnie w każdym języku.
            const weekLabel = _i18nDateRange(from, to, { day: 'numeric', month: 'long', year: 'numeric' });
            const dayLbl = _dayNamesShort();

            // Short type names for compact cards
            const TYPE_SHORT = { easy:t('wshort.easy'), interval:t('wshort.interval'), tempo:t('wshort.tempo'), long:t('wshort.long'), rest:t('wshort.rest'), cross:t('wshort.cross'), walkrun:t('wshort.walkrun') };

            // Weekly stats
            let totalKm = 0, paceSum = 0, paceCount = 0;
            days.forEach(d => {
                const day = getDayData(toDateStr(d));
                if (day?.dystans_km) totalKm += parseFloat(day.dystans_km);
                if (day?.tempo_min_km && day.typ !== 'rest') {
                    const sec = parsePaceToSec(day.tempo_min_km);
                    if (sec) { paceSum += sec; paceCount++; }
                }
            });
            const totalKmStr  = totalKm > 0 ? totalKm.toFixed(1) : null;
            const avgPaceStr  = paceCount > 0 ? secToPace(Math.round(paceSum / paceCount)) : null;

            // Cel tygodnia — skrócony
            const cel = calendarPlan?.cel_tygodnia || '';
            const celShort = cel.length > 72 ? cel.slice(0, 70) + '…' : cel;

            const cards = days.map((d, i) => {
                const ds      = toDateStr(d);
                const day     = getDayData(ds);
                const isSel   = ds === calSelectedDay;
                const isToday = ds === todayStr;
                const color   = day ? (TYPE_COLORS[day.typ] || '#EBEBEB') : '#EBEBEB';
                const typeShort = day ? (TYPE_SHORT[day.typ] || day.typ) : '';
                const dist    = day?.dystans_km ? `${day.dystans_km} km` : '';
                const activeSt = `background:var(--primary-color);color:#fff;box-shadow:0 6px 18px rgba(17,17,17,0.22);border:1px solid transparent;`;
                const defSt    = `background:#FFFFFF;color:#111;${isToday ? 'box-shadow:inset 0 0 0 2px var(--primary-color);' : 'border:1px solid rgba(235,235,235,0.5);box-shadow:0 2px 12px rgba(0,0,0,0.03);'}`;
                return `<div onclick="calDayClick('${ds}')"
                    class="week-card-anim"
                    style="flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:4px;
                        padding:13px 3px 11px;border-radius:14px;cursor:pointer;
                        ${isSel ? activeSt : defSt}
                        animation-delay:${i * 38}ms;">
                    <div style="font-size:9px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;opacity:0.55;">${dayLbl[i]}</div>
                    <div style="font-size:16px;font-weight:800;line-height:1;">${d.getDate()}</div>
                    <div style="width:7px;height:7px;border-radius:50%;background:${isSel ? 'rgba(255,255,255,0.6)' : color};margin:1px 0;"></div>
                    <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;opacity:${isSel ? '0.9' : '0.7'};min-height:11px;">${typeShort}</div>
                    <div style="font-size:9px;font-weight:700;opacity:${isSel ? '1' : '0.65'};min-height:11px;">${dist}</div>
                </div>`;
            }).join('');

            const statsRow = (totalKmStr || avgPaceStr) ? `
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px;">
                    ${totalKmStr ? `<div class="week-stat-anim cal-metric-btn" data-metric="km" onclick="switchCalMetric('km')" style="cursor:pointer;transition:border-color 0.2s,background 0.2s;background:${calMetric==='km'?'rgba(17,17,17,0.04)':'#FFFFFF'};border:${calMetric==='km'?'2px solid var(--primary-color)':'1px solid #EBEBEB'};border-radius:14px;padding:14px 16px;animation-delay:310ms;">
                        <div style="font-size:10px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#8A8A8A;margin-bottom:5px;">${t('cal.weekkm')}</div>
                        <div style="font-size:28px;font-weight:800;color:#111;line-height:1;">${totalKmStr}<span style="font-size:13px;font-weight:500;color:#8A8A8A;margin-left:3px;">km</span></div>
                    </div>` : ''}
                    ${avgPaceStr ? `<div class="week-stat-anim cal-metric-btn" data-metric="pace" onclick="switchCalMetric('pace')" style="cursor:pointer;transition:border-color 0.2s,background 0.2s;background:${calMetric==='pace'?'rgba(17,17,17,0.04)':'#FFFFFF'};border:${calMetric==='pace'?'2px solid var(--primary-color)':'1px solid #EBEBEB'};border-radius:14px;padding:14px 16px;animation-delay:370ms;">
                        <div style="font-size:10px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#8A8A8A;margin-bottom:5px;">${t('cal.avgpace')}</div>
                        <div style="font-size:28px;font-weight:800;color:#111;line-height:1;">${avgPaceStr}<span style="font-size:13px;font-weight:500;color:#8A8A8A;margin-left:3px;">/km</span></div>
                    </div>` : ''}
                </div>` : '';

            // ── WEEKLY CHART (premium dual-line v2) ────────────────────
            const buildWeekChart = () => {
                const W = 300, H = 168;
                const pL = 28, pR = 30, pT = 20, pB = 46;
                const cW = W - pL - pR, cH = H - pT - pB;
                const T_SHORT = { easy:t('wshort.easy'), interval:t('wshort.interval'), tempo:t('wshort.tempo'), long:t('wshort.long'), rest:t('wshort.rest'), cross:t('wshort.cross'), walkrun:t('wshort.walkrun') };

                // All 7 days — km=0 for rest/empty so line always touches baseline
                const cd = days.map(d => {
                    const day = getDayData(toDateStr(d));
                    return {
                        km:    day?.dystans_km ? parseFloat(day.dystans_km) : 0,
                        pace:  (day?.tempo_min_km && day.typ !== 'rest') ? parsePaceToSec(day.tempo_min_km) : null,
                        color: day ? (TYPE_COLORS[day.typ] || '#D8D2C4') : '#D8D2C4',
                        short: day ? (T_SHORT[day.typ] || '–') : '–',
                        hasData: !!(day?.dystans_km),
                    };
                });

                if (!cd.some(d => d.km > 0)) return '';

                const maxKm = Math.max(...cd.map(d => d.km));
                const xs    = cd.map((_, i) => pL + (i / 6) * cW);
                const kmYs  = cd.map(d => pT + cH - (d.km / maxKm) * cH);

                const pVals  = cd.map(d => d.pace).filter(v => v !== null);
                const hasPace = pVals.length >= 2;
                const minP   = hasPace ? Math.min(...pVals) : 0;
                const maxP   = hasPace ? Math.max(...pVals) : 0;
                const pSpan  = Math.max(maxP - minP, 20);
                // faster (lower sec) = higher on chart
                const paceYs = cd.map(d => d.pace !== null && hasPace
                    ? pT + (d.pace - minP) / pSpan * cH : null);

                // Catmull-Rom bezier (tension 0.28)
                // KM line — all 7 points, straight lines, rest days at y=0 (baseline)
                const kmPath = cd.map((_, i) => `${i === 0 ? 'M' : 'L'}${xs[i].toFixed(1)},${kmYs[i].toFixed(1)}`).join(' ');
                const areaPath = kmPath
                    ? kmPath + ` L${xs[6].toFixed(1)},${(pT+cH).toFixed(1)} L${xs[0].toFixed(1)},${(pT+cH).toFixed(1)} Z`
                    : '';

                // Pace line — all 7 points, straight lines, rest days at y=baseline (bottom)
                const paceBaseline = pT + cH;
                const pacePath = cd.map((d, i) => {
                    const y = paceYs[i] !== null ? paceYs[i] : paceBaseline;
                    return `${i === 0 ? 'M' : 'L'}${xs[i].toFixed(1)},${y.toFixed(1)}`;
                }).join(' ');
                // Grid (2 lines, subtle dashed)
                const grid = [0.4, 0.75].map(f => {
                    const y = (pT + f * cH).toFixed(1);
                    return `<line x1="${pL}" y1="${y}" x2="${(pL+cW).toFixed(1)}" y2="${y}" stroke="#EDE8DC" stroke-width="0.7" stroke-dasharray="4 3"/>`;
                }).join('');

                // Baseline
                const xAxis = `<line x1="${pL}" y1="${(pT+cH).toFixed(1)}" x2="${(pL+cW).toFixed(1)}" y2="${(pT+cH).toFixed(1)}" stroke="#D8D2C4" stroke-width="1"/>`;

                // Y axis labels — km (left), 4 ticks
                const yKmL = [0, 0.4, 0.75, 1].map(f => {
                    const yPos = pT + f * cH;
                    const kmVal = maxKm * (1 - f);
                    const lbl = kmVal < 0.05 ? '0' : (kmVal % 1 < 0.05 ? kmVal.toFixed(0) : kmVal.toFixed(1));
                    return `<text x="${(pL-5).toFixed(1)}" y="${(yPos+3).toFixed(1)}" text-anchor="end" font-size="7.5" fill="#8A8A8A" font-family="Inter,sans-serif">${lbl}</text>`;
                }).join('');

                // Y axis labels — pace (left), 4 ticks
                const yPL = hasPace ? [0, 0.4, 0.75, 1].map(f => {
                    const yPos = pT + f * cH;
                    const paceVal = minP + f * pSpan;
                    return `<text x="${(pL-5).toFixed(1)}" y="${(yPos+3).toFixed(1)}" text-anchor="end" font-size="7.5" fill="#8A8A8A" font-family="Inter,sans-serif">${secToPace(Math.round(paceVal))}</text>`;
                }).join('') : '';

                // Dashed reference lines from Y-axis to each km data point
                const kmRefLines = cd.map((d, i) => {
                    if (!d.hasData || d.km === 0) return '';
                    return `<line x1="${pL}" y1="${kmYs[i].toFixed(1)}" x2="${xs[i].toFixed(1)}" y2="${kmYs[i].toFixed(1)}" stroke="#D8D2C4" stroke-width="0.7" stroke-dasharray="3 3"/>`;
                }).join('');

                // Dashed reference lines from Y-axis to each pace data point
                const paceRefLines = hasPace ? cd.map((d, i) => {
                    if (paceYs[i] === null) return '';
                    return `<line x1="${pL}" y1="${paceYs[i].toFixed(1)}" x2="${xs[i].toFixed(1)}" y2="${paceYs[i].toFixed(1)}" stroke="#D8D2C4" stroke-width="0.7" stroke-dasharray="3 3"/>`;
                }).join('') : '';

                // ── Bottom data rows ──────────────────────────────────────
                const rowY1 = pT + cH + 13;  // day name
                const rowY2 = pT + cH + 24;  // type label (colored)
                const rowY3 = pT + cH + 35;  // pace (amber)

                const dayAbbr   = _dayNamesShort();
                const xLabels   = cd.map((_,i) => `<text x="${xs[i].toFixed(1)}" y="${rowY1}" text-anchor="middle" font-size="8" fill="#8A8A8A" font-family="Inter,sans-serif">${dayAbbr[i]}</text>`).join('');
                const typeLabels = cd.map((d,i) => {
                    const col = d.hasData && d.short !== 'Rest' ? d.color : '#C8C2B8';
                    const lbl = d.hasData ? d.short : '·';
                    return `<text x="${xs[i].toFixed(1)}" y="${rowY2}" text-anchor="middle" font-size="7.5" fill="${col}" font-family="Inter,sans-serif" font-weight="700" style="animation:fadeIn 0.3s ease ${680+i*50}ms both;">${lbl}</text>`;
                }).join('');
                const paceRowL  = cd.map((d,i) => d.pace !== null
                    ? `<text x="${xs[i].toFixed(1)}" y="${rowY3}" text-anchor="middle" font-size="7.5" fill="#9A7F3E" font-family="Inter,sans-serif" font-weight="600" style="animation:fadeIn 0.3s ease ${750+i*50}ms both;">${secToPace(d.pace)}</text>`
                    : '').join('');

                // KM dots — colored by training type, grey at 0
                const kmDots = cd.map((d, i) => {
                    const x = xs[i].toFixed(1), y = kmYs[i].toFixed(1);
                    const dl = 900 + i * 55;
                    if (!d.hasData) {
                        return `<circle cx="${x}" cy="${(pT+cH).toFixed(1)}" r="2.5" fill="#D8D2C4" stroke="#FFFFFF" stroke-width="1" style="transform-origin:${x}px ${(pT+cH).toFixed(1)}px;animation:popDot 0.3s cubic-bezier(0.34,1.56,0.64,1) ${dl}ms both;"/>`;
                    }
                    return `<circle cx="${x}" cy="${y}" r="4" fill="${d.color}" stroke="#FFFFFF" stroke-width="1.5" style="transform-origin:${x}px ${y}px;animation:popDot 0.35s cubic-bezier(0.34,1.56,0.64,1) ${dl}ms both;"/>`;
                }).join('');

                // Pace dots — colored by training type
                const paceDots = hasPace ? cd.map((d, i) => {
                    if (paceYs[i] === null) return '';
                    const x = xs[i].toFixed(1), y = paceYs[i].toFixed(1);
                    const dl = 1050 + i * 55;
                    return `<circle cx="${x}" cy="${y}" r="4" fill="${d.color}" stroke="#FFFFFF" stroke-width="1.5" style="transform-origin:${x}px ${y}px;animation:popDot 0.35s cubic-bezier(0.34,1.56,0.64,1) ${dl}ms both;"/>`;
                }).join('') : '';

                // Pace area path (gradient fill under pace line)
                const paceAreaPath = pacePath
                    ? pacePath + ` L${xs[6].toFixed(1)},${paceBaseline.toFixed(1)} L${xs[0].toFixed(1)},${paceBaseline.toFixed(1)} Z`
                    : '';

                const kmGroupStyle   = calMetric === 'km'   ? '' : 'opacity:0;pointer-events:none;';
                const paceGroupStyle = calMetric === 'pace' ? '' : 'opacity:0;pointer-events:none;';

                return `
                <div class="week-stat-anim" style="margin-top:10px;background:#FFFFFF;border:1px solid rgba(235,235,235,0.5);border-radius:14px;padding:14px 14px 12px;box-shadow:0 2px 12px rgba(0,0,0,0.03);animation-delay:440ms;">
                    <div style="margin-bottom:10px;">
                        <span style="font-size:10px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#8A8A8A;">${t('cal.weekspread')}</span>
                    </div>
                    <svg viewBox="0 0 ${W} ${H}" width="100%" style="overflow:visible;display:block;">
                        <defs>
                            <linearGradient id="wkgrd" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%"   stop-color="var(--primary-color)" stop-opacity="0.2"/>
                                <stop offset="100%" stop-color="var(--primary-color)" stop-opacity="0"/>
                            </linearGradient>
                            <linearGradient id="wkpgrd" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%"   stop-color="var(--primary-color)" stop-opacity="0.2"/>
                                <stop offset="100%" stop-color="var(--primary-color)" stop-opacity="0"/>
                            </linearGradient>
                        </defs>
                        ${grid}
                        ${xAxis}
                        <g id="wk-y-km" style="transition:opacity 0.2s;${calMetric==='pace'?'opacity:0;':''}">
                            ${yKmL}
                        </g>
                        <g id="wk-y-pace" style="transition:opacity 0.2s;${calMetric==='km'?'opacity:0;':''}">
                            ${yPL}
                        </g>
                        <g id="wk-km-group" style="transition:opacity 0.2s;${kmGroupStyle}">
                            ${areaPath ? `<path d="${areaPath}" fill="url(#wkgrd)"/>` : ''}
                            ${kmRefLines}
                            <path d="${kmPath}" fill="none" stroke="var(--primary-color)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                            ${kmDots}
                        </g>
                        <g id="wk-pace-group" style="transition:opacity 0.2s;${paceGroupStyle}">
                            ${paceAreaPath ? `<path d="${paceAreaPath}" fill="url(#wkpgrd)"/>` : ''}
                            ${paceRefLines}
                            ${pacePath ? `<path d="${pacePath}" fill="none" stroke="var(--primary-color)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
                            ${paceDots}
                        </g>
                        ${xLabels}
                        ${typeLabels}
                        ${paceRowL}
                    </svg>
                </div>`;
            };
            const weekChart = buildWeekChart();

            // Cel tygodnia — pod wykresem
            const celBlock = celShort ? `
                <div class="week-stat-anim" style="margin-top:10px;padding:14px 16px;background:#FFFFFF;border:1px solid rgba(235,235,235,0.5);border-radius:14px;box-shadow:0 2px 12px rgba(0,0,0,0.03);animation-delay:500ms;">
                    <div style="font-size:10px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#8A8A8A;margin-bottom:5px;">${t('cal.weekgoal')}</div>
                    <div style="font-size:13px;color:#111;line-height:1.55;">${celShort}</div>
                </div>` : '';

            const animClass = slideAnim === 'left' ? 'cal-slide-in-left' : slideAnim === 'right' ? 'cal-slide-in-right' : 'cal-animate';
            calContent.innerHTML = `
                <div class="${animClass}">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                        <button onclick="prevCal()" style="background:none;border:none;font-size:24px;color:var(--primary-color);cursor:pointer;padding:4px 8px;line-height:1;">‹</button>
                        <span style="font-weight:700;font-size:14px;color:#111;">${weekLabel}</span>
                        <button onclick="nextCal()" style="background:none;border:none;font-size:24px;color:var(--primary-color);cursor:pointer;padding:4px 8px;line-height:1;">›</button>
                    </div>
                    <div style="display:flex;gap:5px;">${cards}</div>
                    ${statsRow}
                    ${weekChart}
                    ${celBlock}
                </div>`;
        }

        // ── DAY VIEW ──────────────────────────────────────────────────
        // ── DAY VIEW HELPERS ─────────────────────────────────────────────────────

        // Converts zone notation → BPM range string
        function _hrRange(strefy) {
            if (!strefy) return null;
            const maxHR = userMaxHR;
            const zonePct = { '1':[.50,.60], '2':[.60,.70], '3':[.70,.80], '4':[.80,.90], '5':[.90,1.00] };

            const s = String(strefy).trim();

            // "Z2-Z3" or "2-3" range of zones
            const zoneRange = s.match(/[Zz]?(\d)[–\-][Zz]?(\d)/);
            if (zoneRange) {
                const lo = zonePct[zoneRange[1]], hi = zonePct[zoneRange[2]];
                if (lo && hi) return `${Math.round(lo[0]*maxHR)}–${Math.round(hi[1]*maxHR)} bpm`;
            }

            // "65-75%" or "65–75%"
            const pctRange = s.match(/(\d+)\s*[–\-]\s*(\d+)\s*%/);
            if (pctRange) return `${Math.round(parseInt(pctRange[1])*maxHR/100)}–${Math.round(parseInt(pctRange[2])*maxHR/100)} bpm`;

            // Single zone: "Z3" or "3" or "strefa 3"
            const singleZ = s.match(/(?:[Zz]|[Ss]trefa\s*)(\d)/);
            if (singleZ) {
                const r = zonePct[singleZ[1]];
                if (r) return `${Math.round(r[0]*maxHR)}–${Math.round(r[1]*maxHR)} bpm`;
            }

            // Single percentage: "75%"
            const singlePct = s.match(/^(\d+)\s*%$/);
            if (singlePct) return `~${Math.round(parseInt(singlePct[1])*maxHR/100)} bpm`;

            return s; // fallback — show as-is
        }

        const T = 'background:var(--bg-color,#F5F3F0);border-radius:14px;padding:12px 14px;display:flex;flex-direction:column;justify-content:space-between;';

        function _tile(label, value, delay = 0, sub = '') {
            return `<div style="${T}animation:calFadeIn 0.3s ease ${delay}ms both;">
                <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#8A8A8A;margin-bottom:6px;font-family:'Inter',sans-serif;">${label}</div>
                <div style="font-size:20px;font-weight:900;color:#111;font-family:'Outfit',sans-serif;line-height:1;">${value || '<span style="color:#C8C2B8;">—</span>'}</div>
                ${sub ? `<div style="font-size:11px;color:#8A8A8A;margin-top:4px;font-weight:600;font-family:'Inter',sans-serif;">${sub}</div>` : '<div></div>'}
            </div>`;
        }

        function _intensityTile(day, delay = 0) {
            const iData = INTENSITY_MAP[day.typ] || { label: '—', pct: 0 };
            const val   = day.intensywnosc || iData.label;
            const pct   = iData.pct;
            return `<div style="${T}animation:calFadeIn 0.3s ease ${delay}ms both;">
                <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#8A8A8A;margin-bottom:6px;font-family:'Inter',sans-serif;">${t('home.intensity')}</div>
                <div style="font-size:20px;font-weight:900;color:#111;font-family:'Outfit',sans-serif;line-height:1;">${val}</div>
                <div style="margin-top:8px;height:3px;background:rgba(0,0,0,0.08);border-radius:2px;overflow:hidden;">
                    <div style="height:100%;border-radius:2px;background:var(--primary-color);width:${pct}%;"></div>
                </div>
            </div>`;
        }

        function _hrZoneTile(day, delay = 0) {
            const zData = HR_ZONE_MAP[day.typ];
            const maxHR = userMaxHR;
            const rawZone = day.strefy ? _hrRange(day.strefy) : null;
            const zone  = rawZone || (zData ? zData.zone : '—');
            const bpm   = zData ? `${Math.round(zData.lo * maxHR)}–${Math.round(zData.hi * maxHR)} BPM` : '';
            return `<div style="${T}animation:calFadeIn 0.3s ease ${delay}ms both;">
                <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#8A8A8A;margin-bottom:6px;font-family:'Inter',sans-serif;">${t('home.hrzone')}</div>
                <div style="font-size:20px;font-weight:900;color:#111;font-family:'Outfit',sans-serif;line-height:1;">${zone}</div>
                ${bpm ? `<div style="font-size:11px;color:#8A8A8A;margin-top:4px;font-weight:600;font-family:'Inter',sans-serif;">${bpm}</div>` : '<div></div>'}
            </div>`;
        }

        function _section(barColor, labelText, innerHTML) {
            return `<div style="margin-bottom:14px;border-radius:18px;overflow:hidden;border:1px solid rgba(235,235,235,0.5);box-shadow:0 2px 14px rgba(0,0,0,0.04);">
                <div style="background:var(--surface-color,#fff);padding:16px 16px 14px;">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
                        <div style="width:10px;height:10px;border-radius:50%;background:${barColor};flex-shrink:0;"></div>
                        <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.12em;color:#111;font-family:'Inter',sans-serif;">${labelText}</div>
                    </div>
                    ${innerHTML}
                </div>
            </div>`;
        }

        function _calcTime(distKm, tempoStr) {
            if (!distKm || !tempoStr) return null;
            const parts = tempoStr.replace(/\/km/g,'').split('-');
            const parseM = s => { const [m,sec] = s.trim().split(':').map(Number); return (m||0) + (sec||0)/60; };
            const avgMin = parts.length === 2 ? (parseM(parts[0]) + parseM(parts[1])) / 2 : parseM(parts[0]);
            const total = parseFloat(distKm) * avgMin;
            const m = Math.floor(total), s = Math.round((total - m) * 60);
            return s > 0 ? `${m}m ${s}s` : `${m} min`;
        }

        function _segBlock(seg, day, delay = 0) {
            if (!seg) return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">${_tile(t('home.dist'), null, delay)}${_tile(t('home.pace'), null, delay+40)}</div>`;
            const time = _calcTime(seg.dystans_km, seg.tempo);
            const zData = HR_ZONE_MAP[day.typ];
            const maxHR = userMaxHR;
            const bpm = zData ? `${Math.round(zData.lo*maxHR)}–${Math.round(zData.hi*maxHR)}` : null;
            const tiles = [
                _tile(t('home.dist'), seg.dystans_km ? `${seg.dystans_km} km` : null, delay),
                _tile(t('home.pace'), seg.tempo || null, delay+40),
                time ? _tile(t('cal.time'), time, delay+80) : '',
                bpm ? _tile(t('cal.hr'), bpm, delay+120, 'BPM') : '',
            ].filter(Boolean);
            return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">${tiles.join('')}</div>`;
        }

        function _askCard(day) {
            const dateStr = day?.data || '';
            const typ = day?.typ || '';
            const km = day?.dystans_km || '';
            const ref = (km && typ) ? `${km}km ${typ}` : (typ || '');
            const ctxJson = JSON.stringify({ source: 'calendar_day', date: dateStr, trainingRef: ref });
            return `<div style="margin-bottom:12px;animation:calFadeIn 0.3s ease 360ms both;">
                <button onclick='enterCoachWithContext(${ctxJson.replace(/'/g,"\\'")})'  style="width:100%;padding:13px;background:var(--primary-color);border:none;border-radius:14px;color:white;font-weight:700;font-size:14px;font-family:'Inter',sans-serif;cursor:pointer;letter-spacing:0.01em;">${t('home.askcoach')}</button>
                <div style="margin-top:8px;padding:12px 14px;background:var(--bg-color,#F5F3F0);border-radius:12px;font-size:12px;color:#8A8A8A;line-height:1.65;font-family:'Inter',sans-serif;">${t('cal.ask.note')}</div>
            </div>`;
        }

        function _descCard(day, color) {
            if (!day.opis && !day.uwagi) return '';
            return `<div style="background:var(--surface-color,#fff);border-radius:16px;border:1px solid #EBEBEB;padding:18px;margin-bottom:12px;animation:calFadeIn 0.3s ease 300ms both;box-shadow:0 1px 4px rgba(0,0,0,0.04);">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
                    <div style="width:10px;height:10px;border-radius:50%;background:${color};flex-shrink:0;"></div>
                    <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.12em;color:#111;font-family:'Inter',sans-serif;">${t('cal.desc')}</div>
                </div>
                ${day.opis ? `<div style="font-size:14px;color:#333;line-height:1.75;font-weight:400;font-family:'Inter',sans-serif;">${day.opis}</div>` : ''}
                ${day.uwagi ? `<div style="margin-top:12px;padding-top:12px;border-top:1px solid #EBEBEB;font-size:13px;color:#8A8A8A;font-style:italic;line-height:1.6;font-family:'Inter',sans-serif;">💡 ${day.uwagi}</div>` : ''}
            </div>`;
        }

        function buildDayHTML(day) {
            if (!day) return `<div style="text-align:center;padding:48px 0;">
                <div style="font-size:16px;font-weight:600;color:#111;margin-bottom:8px;">${t('cal.noday.title')}</div>
                <div style="font-size:14px;color:#8A8A8A;line-height:1.6;">${t('cal.noday.desc')}</div>
            </div>`;

            const color = TYPE_COLORS[day.typ] || '#ccc';
            const label = TYPE_LABEL(day.typ)  || day.typ;
            const s     = day.struktura || null;

            const optionalBadge = day.optional === true
                ? `<div style="display:inline-flex;align-items:center;gap:5px;background:#F5F5F5;border:1px solid #E0E0E0;border-radius:20px;padding:4px 12px;margin-bottom:10px;font-size:11px;font-weight:700;color:#8A8A8A;letter-spacing:0.08em;font-family:'Inter',sans-serif;text-transform:uppercase;">
                    <span style="font-size:10px;">◦</span> ${t('cal.optional')}
                   </div>
                   <div style="font-size:12px;color:#ABABAB;margin-bottom:8px;font-family:'Inter',sans-serif;">${t('cal.optional.desc')}</div>`
                : '';
            const header = `<div style="margin-bottom:22px;">
                <div style="font-size:11px;font-weight:700;color:#8A8A8A;text-transform:uppercase;letter-spacing:0.14em;margin-bottom:10px;font-family:'Inter',sans-serif;text-align:center;">${t('cal.yourworkout')}</div>
                <div style="background:var(--surface-color,#fff);border-radius:18px;border:1px solid rgba(235,235,235,0.5);padding:20px 20px 18px;text-align:center;box-shadow:0 2px 16px rgba(0,0,0,0.05);">
                    ${optionalBadge}
                    <div style="font-size:30px;font-weight:900;color:#111;font-family:'Outfit',sans-serif;letter-spacing:-0.02em;line-height:1.1;">${label}</div>
                    ${day.dystans_km && day.typ !== 'rest' ? `<div style="font-size:14px;color:#8A8A8A;font-weight:600;margin-top:6px;font-family:'Inter',sans-serif;">${day.dystans_km} km</div>` : ''}
                </div>
            </div>`;

            // REST
            if (day.typ === 'rest') {
                return `${header}<div style="text-align:center;padding:16px 0;">
                    <div style="font-size:52px;margin-bottom:14px;">⚪</div>
                    <div style="font-size:15px;color:#8A8A8A;line-height:1.7;font-family:'Inter',sans-serif;">${t('cal.rest.a')}<br>${t('cal.rest.b')}</div>
                    ${day.uwagi ? `<div style="margin-top:18px;padding:14px 16px;background:var(--surface-color,#fff);border-radius:12px;border:1px solid rgba(235,235,235,0.5);font-size:13px;color:#8A8A8A;font-style:italic;text-align:left;font-family:'Inter',sans-serif;">💡 ${day.uwagi}</div>` : ''}
                </div>`;
            }

            // EASY / LONG
            if (day.typ === 'easy' || day.typ === 'long') {
                return `${header}
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
                    ${_tile(t('home.dist'), day.dystans_km, 0, 'km')}
                    ${_tile(t('home.pace'), day.tempo_min_km ? day.tempo_min_km.split('/')[0].split('-')[0].trim() : null, 40, 'min/km')}
                    ${_intensityTile(day, 80)}
                    ${_hrZoneTile(day, 120)}
                </div>
                ${_askCard(day)}
                ${_descCard(day, color)}`;
            }

            // INTERVAL
            if (day.typ === 'interval') {
                const roz = s?.rozgrzewka;
                const rep = s?.powtorzeenia;
                const sch = s?.schlodzenie;
                const intBlock = rep
                    ? `<div style="text-align:center;padding:6px 0 14px;">
                        <span style="font-size:36px;font-weight:900;color:#111;font-family:'Outfit',sans-serif;">${rep.ile}</span>
                        <span style="font-size:22px;font-weight:600;color:#8A8A8A;font-family:'Outfit',sans-serif;"> × </span>
                        <span style="font-size:30px;font-weight:900;color:#111;font-family:'Outfit',sans-serif;">${rep.dystans_m}m</span>
                      </div>
                      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                          ${_tile(t('home.dist'), rep.dystans_m ? `${rep.dystans_m} m` : null, 0)}
                          ${_tile(t('home.pace'), rep.tempo, 40)}
                          ${_tile(t('cal.break'), rep.przerwa_sek ? `${rep.przerwa_sek}s` : null, 80)}
                          ${_hrZoneTile(day, 120)}
                      </div>`
                    : `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">${_tile(t('home.dist'), day.dystans_km, 0, 'km')}${_tile(t('home.pace'), day.tempo_min_km, 40)}${_intensityTile(day, 80)}${_hrZoneTile(day, 120)}</div>`;
                return `${header}
                ${_section('#7B98B0', t('cal.warmup'), _segBlock(roz, day, 0))}
                ${_section('#C07264', t('wtype.interval'), intBlock)}
                ${_section('#6B8F71', t('cal.cooldown'), _segBlock(sch, day, 0))}
                ${_askCard(day)}
                ${_descCard(day, color)}`;
            }

            // TEMPO
            if (day.typ === 'tempo') {
                const roz = s?.rozgrzewka;
                const odc = s?.odcinek;
                const sch = s?.schlodzenie;
                const odcBlock = odc
                    ? `<div style="text-align:center;padding:6px 0 14px;">
                        <span style="font-size:36px;font-weight:900;color:#111;font-family:'Outfit',sans-serif;">${odc.dystans_km} km</span>
                        <div style="font-size:14px;font-weight:600;color:#8A8A8A;margin-top:4px;font-family:'Inter',sans-serif;">${t('cal.atpace')} ${odc.tempo}</div>
                      </div>
                      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                          ${_tile(t('home.dist'), odc.dystans_km ? `${odc.dystans_km} km` : null, 0)}
                          ${_tile(t('home.pace'), odc.tempo || null, 40)}
                          ${_tile(t('cal.time'), _calcTime(odc.dystans_km, odc.tempo), 80)}
                          ${_hrZoneTile(day, 120)}
                      </div>`
                    : `<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">${_tile(t('home.dist'), day.dystans_km, 0, 'km')}${_tile(t('home.pace'), day.tempo_min_km, 40)}${_intensityTile(day, 80)}${_hrZoneTile(day, 120)}</div>`;
                return `${header}
                ${_section('#7B98B0', t('cal.warmup'), _segBlock(roz, day, 0))}
                ${_section('#C4A35A', t('cal.threshold'), odcBlock)}
                ${_section('#6B8F71', t('cal.cooldown'), _segBlock(sch, day, 0))}
                ${_askCard(day)}
                ${_descCard(day, color)}`;
            }

            // WALKRUN
            if (day.typ === 'walkrun') {
                const totalMin = s
                    ? (s.rozgrzewka_min || 0) + ((s.bieg_min || 0) + (s.marsz_min || 0)) * (s.powtorzeenia || 0) + (s.schlodzenie_min || 0)
                    : null;
                const blocksHTML = s ? (() => {
                    let b = '';
                    for (let i = 0; i < Math.min(s.powtorzeenia || 0, 10); i++) {
                        b += `<div style="background:#C4A35A;border-radius:8px;padding:5px 10px;font-size:10px;font-weight:700;color:#fff;font-family:'Inter',sans-serif;">🏃 ${s.bieg_min}m</div>`;
                        b += `<div style="background:#94a3b8;border-radius:8px;padding:5px 10px;font-size:10px;font-weight:700;color:#fff;font-family:'Inter',sans-serif;">🚶 ${s.marsz_min}m</div>`;
                    }
                    if (s.powtorzeenia > 10) b += `<span style="color:#8A8A8A;font-size:11px;font-weight:600;align-self:center;"> ×${s.powtorzeenia}</span>`;
                    return b;
                })() : '';
                return `${header}
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
                    ${_tile(t('home.dist'), day.dystans_km, 0, 'km')}
                    ${_tile(t('cal.totaltime'), totalMin ? `~${totalMin}` : null, 40, 'min')}
                </div>
                ${s ? _section('#C4A35A', t('cal.session'), `
                    <div style="font-size:10px;font-weight:700;color:#8A8A8A;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;font-family:'Inter',sans-serif;">🚶 ${t('cal.warmup')} ${s.rozgrzewka_min} min</div>
                    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:10px;">${blocksHTML}</div>
                    <div style="font-size:10px;font-weight:700;color:#8A8A8A;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:10px;font-family:'Inter',sans-serif;">🚶 ${t('cal.cooldown')} ${s.schlodzenie_min} min</div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                        ${_tile(t('cal.repeats'), s.powtorzeenia, 80)}
                        ${_tile(t('home.pace'), day.tempo_min_km || null, 120, 'min/km')}
                    </div>`) : ''}
                ${_askCard(day)}
                ${_descCard(day, color)}`;
            }

            // FALLBACK
            return `${header}
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
                ${_tile(t('home.dist'), day.dystans_km, 0, 'km')}
                ${_tile(t('home.pace'), day.tempo_min_km ? day.tempo_min_km.split('/')[0].split('-')[0].trim() : null, 40, 'min/km')}
                ${_intensityTile(day, 80)}
                ${_hrZoneTile(day, 120)}
            </div>
            ${_askCard(day)}
            ${_descCard(day, color)}`;
        }

        function renderDayView() {
            const calContent = document.getElementById('cal-content');
            if (!calContent) return;
            const day = getDayData(calSelectedDay);
            const [y, mo, dd] = calSelectedDay.split('-').map(Number);
            const dateObj = new Date(y, mo - 1, dd);
            const dateLabel = _capFirst(_i18nDate(dateObj, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));

            calContent.innerHTML = `
                <div>
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
                        <button onclick="prevCal()" style="background:none;border:none;font-size:24px;color:var(--primary-color);cursor:pointer;padding:4px 8px;line-height:1;">‹</button>
                        <span style="font-weight:700;font-size:14px;color:#111;text-align:center;flex:1;">${dateLabel}</span>
                        <button onclick="nextCal()" style="background:none;border:none;font-size:24px;color:var(--primary-color);cursor:pointer;padding:4px 8px;line-height:1;">›</button>
                    </div>
                    <div style="animation:calFadeIn 0.25s ease;">
                        ${buildDayHTML(day)}
                    </div>
                </div>`;
        }

        async function loadCalendar() {
            if (calendarPlan) { renderCalendar(); updateCalToggle(calView); return; }
            const calContent = document.getElementById('cal-content');
            if (!calContent) return;

            calContent.innerHTML = `
                <div style="display:flex;justify-content:center;padding:56px 0;">
                    <div class="velm-loader"><span></span><span></span><span></span></div>
                </div>`;

            if (!currentUserId) {
                calContent.innerHTML = `<div style="text-align:center;padding:48px 16px;font-size:14px;color:#8A8A8A;">${t('cal.onboarding')}</div>`;
                return;
            }
            try {
                const res  = await authFetch(`${API_BASE}/api/plan/${currentUserId}`, { headers: authHeaders() });
                const data = await res.json();
                // BUG: bez sprawdzenia res.ok, błąd auth (401 z poprawnym JSON-em
                // { error: '...' }) parsował się bez wyjątku — calendarPlan dostawał
                // ten obiekt błędu (bez .dni), renderCalendar() wychodził po cichu
                // (if (!calendarPlan) return), a siatka zostawała pusta/w spinnerze
                // BEZ ŻADNEGO komunikatu. Trening był wtedy widoczny na Dom (tam jest
                // fallback na pierwszy dzień z planu), ale nie w Kalendarzu (brak
                // fallbacku — i słusznie, komórka nie może pokazywać cudzego dnia).
                if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
                const _rawPlan = data?.plan?.plan ?? data?.plan ?? null;
                calendarPlan = (_rawPlan && Array.isArray(_rawPlan.dni)) ? _rawPlan : null;
                if (calendarPlan?.dni?.length) {
                    calWeekStart  = getMonday(new Date(calendarPlan.dni[0].data));
                    calSelectedDay = toDateStr(new Date());
                    // sync month view to first plan week
                    const planStart = new Date(calendarPlan.dni[0].data);
                    calMonth = planStart.getMonth();
                    calYear  = planStart.getFullYear();
                    renderCalendar();
                    updateCalToggle(calView);
                } else {
                    calContent.innerHTML = `<div style="text-align:center;padding:48px 16px;font-size:14px;color:#8A8A8A;">${t('cal.noplan')}</div>`;
                }
            } catch (e) {
                console.error('Calendar load error:', e);
                calContent.innerHTML = `<div style="text-align:center;padding:48px 16px;font-size:14px;color:#8A8A8A;">${t('err.noserver')}</div>`;
            }
        }

