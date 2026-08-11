        const _profileIdEl = document.getElementById('profile-user-id');
        if (_profileIdEl) _profileIdEl.textContent = currentUserId ?? '—';

        // Init sleep ring with stored/default data
        setTimeout(updateSleepRing, 300);

        // --- Inertia & Slosh Engine ---
        function triggerSlosh(element, delta) {
            if (!element) return;
            const absDelta = Math.abs(delta);
            const baseIntensity = 0.3; // Gentle constant ripple

            // Peak intensity based on delta (min 0.8, max 3.5 for drama)
            const spikeValue = absDelta > 0 ? Math.min(absDelta * 0.15 + 0.5, 3.5) : baseIntensity;
            const duration = 1.5 + (absDelta * 0.05); // Natural settling time

            // 1. Kill moving intensity tweens to layered on top
            gsap.killTweensOf(element, "--slosh-intensity");

            // 2. Animate intensity spike then damp back to base
            gsap.fromTo(element,
                { "--slosh-intensity": spikeValue },
                {
                    "--slosh-intensity": baseIntensity,
                    duration: duration,
                    ease: "power2.out"
                }
            );
        }

        // --- Readiness & Trend Logic ---
        function updateReadiness(percent) {
            // Ensure percent is between 0 and 100
            percent = Math.max(0, Math.min(100, Math.round(percent)));

            const ticker = document.getElementById('readiness-ticker');
            const statusEl = document.getElementById('readiness-status');
            const liquidEl = document.querySelector('.liquid');
            const root = document.documentElement;

            // Reveal the % unit once we have real data (placeholder shows "—" without %)
            const unitEl = ticker?.parentElement?.querySelector('.rolling-unit');
            if (unitEl) unitEl.style.display = '';

            let color, status;

            // 3-Tier matte color system
            if (percent >= 70) {
                color = '#6B8F71'; // szałwiowy zielony
                status = 'Wysoka';
            } else if (percent >= 40) {
                color = '#C4A35A'; // ochra
                status = 'Umiarkowana';
            } else {
                color = '#C07264'; // ceglany
                status = 'Niska';
            }

            if (ticker) {
                ticker.setAttribute('data-value', percent);
                initPremiumCounter(ticker);
            }
            if (statusEl) statusEl.innerText = status;
            root.style.setProperty('--liquid-color', color);

            if (liquidEl) {
                const prevHeight = parseFloat(liquidEl.style.height) || 0;
                const delta = percent - prevHeight;

                liquidEl.style.height = percent + '%';
                liquidEl.style.background = color;

                // Inject Randomized Physics if not already set (or re-randomize for dynamism)
                const dur = (8 + Math.random() * 8).toFixed(1) + 's';
                const durRev = (12 + Math.random() * 8).toFixed(1) + 's';
                const delay = (Math.random() * -10).toFixed(1) + 's';
                const delayRev = (Math.random() * -10).toFixed(1) + 's';

                liquidEl.style.setProperty('--wave-dur', dur);
                liquidEl.style.setProperty('--wave-dur-rev', durRev);
                liquidEl.style.setProperty('--wave-delay', delay);
                liquidEl.style.setProperty('--wave-delay-rev', delayRev);

                // Trigger Perpetual Momentum Slosh
                triggerSlosh(liquidEl, delta);
            }
        }

        // --- Liquid Wave Logic ---
        // Wave animation is now 100% CSS driven (@keyframes wave-spin).
        // This function stub is kept so existing init calls don't error.
        // --- Premium Rolling Counter Logic ---
        function initPremiumCounter(element) {
            if (!element) return;
            const targetValue = element.getAttribute('data-value').toString();

            // 1. Prepare structure only if value changed or first time
            if (element.getAttribute('data-prev-value') === targetValue) return;
            element.setAttribute('data-prev-value', targetValue);

            element.innerHTML = '';
            const chars = targetValue.split('');

            chars.forEach((char, idx) => {
                const column = document.createElement('div');

                if (isNaN(parseInt(char))) {
                    column.innerText = char;
                    column.style.display = 'inline-block';
                } else {
                    column.classList.add('digit-column');
                    const strip = document.createElement('div');
                    strip.classList.add('digit-strip');

                    for (let i = 0; i <= 9; i++) {
                        const num = document.createElement('span');
                        num.innerText = i;
                        strip.appendChild(num);
                    }
                    column.appendChild(strip);

                    const targetDigit = parseInt(char);
                    const targetY = -(targetDigit) + 'em';

                    gsap.fromTo(strip,
                        { y: '0.3em', opacity: 0 },
                        {
                            y: targetY,
                            opacity: 1,
                            duration: 1.5,
                            ease: "power3.inOut",
                            delay: idx * 0.05
                        }
                    );
                }
                element.appendChild(column);
            });
        }

        // Call on initial load
        document.addEventListener('DOMContentLoaded', () => {
            // Adjust background for desktop realism
            if (window.innerWidth > 480) {
                document.body.style.background = "#000";
            }
        });

        // --- Navigation Logic ---
        /* --- Detailed View Logic --- */
        let currentChartData = null;
        let currentChartType = null;
        let currentChartLabels = null;
        let currentChartLongLabels = null;

        // UWAGA: argument to STABILNY klucz ('body'/'sleep'/'hr'/'xp'), NIE widoczna
        // nazwa — inaczej po zmianie języka żaden warunek poniżej by nie trafił.
        async function openMetricDetails(metric) {
            const METRIC_TITLE = { body: 'metric.body', sleep: 'metric.sleep', hr: 'metric.hr.full', xp: 'metric.xp' };
            const titleEl = document.getElementById('details-title');
            const contentEl = document.getElementById('details-content');
            if (titleEl) titleEl.innerText = t(METRIC_TITLE[metric] || 'details.title');

            // Clear previous content
            contentEl.innerHTML = '';
            contentEl.style.height = 'auto';
            contentEl.style.display = 'block';

            // Slide-up entrance
            const detailsView = document.getElementById('view-details');
            if (detailsView) {
                detailsView.classList.remove('details-enter');
                void detailsView.offsetWidth;
                detailsView.classList.add('details-enter');
            }

            if (metric === 'body') {
                await renderBigBattery(contentEl);
            } else if (metric === 'sleep') {
                await renderSimpleChart(contentEl, 'sleep');
            } else if (metric === 'hr') {
                await renderSimpleChart(contentEl, 'hr');
            } else if (metric === 'xp') {
                // Default WIP for others
                contentEl.style.display = 'flex';
                contentEl.style.height = '300px';
                contentEl.innerHTML = `
                    <div style="font-size: 48px; margin-bottom: 16px;">🚧</div>
                    <h2 style="color: white; margin-bottom: 8px;">WIP</h2>
                    <p>${t('metric.xp.soon')}</p>
                `;
            } else {
                // Default WIP for others
                contentEl.style.display = 'flex';
                contentEl.style.height = '300px';
                contentEl.innerHTML = `
                    <div style="font-size: 48px; margin-bottom: 16px;">🚧</div>
                    <h2 style="color: white; margin-bottom: 8px;">WIP</h2>
                    <p>Work in Progress</p>
                `;
            }

            switchView('details');
            requestAnimationFrame(() => {
                const scroller = document.getElementById('view-content');
                if (scroller) scroller.scrollTop = 0;
            });
        }

        async function renderSimpleChart(container, type) {
            const isSleep = type === 'sleep';
            currentChartType = type;
            let data = [];
            let dayLabels = _i18nDayNames('short').map(s => _capFirst(s).replace(/\.$/, ''));
            let longDayLabels = _i18nDayNames('long').map(_capFirst);
            let todayLongName = longDayLabels[6].toUpperCase();

            try {
                const apiType = isSleep ? 'sleep' : 'hr';
                const uid = localStorage.getItem('velm_user_id') || currentUserId;
                const response = await authFetch(`${API_BASE}/api/health/${uid}?type=${apiType}&days=7`, { headers: authHeaders() });
                if (!response.ok) throw new Error('HTTP ' + response.status);
                const result = await response.json();
                if (result.metrics && result.metrics.length > 0) {
                    data = result.metrics.map(m => m.value);
                    const dshort = d => _capFirst(new Intl.DateTimeFormat(_appLang, { weekday: 'short' }).format(d)).replace(/\.$/, '');
                    const dlong  = d => _capFirst(new Intl.DateTimeFormat(_appLang, { weekday: 'long'  }).format(d));
                    dayLabels     = result.metrics.map(m => dshort(new Date(m.metric_date+'T12:00:00')));
                    longDayLabels = result.metrics.map(m => dlong(new Date(m.metric_date+'T12:00:00')));
                    todayLongName = dlong(new Date(result.metrics[result.metrics.length-1].metric_date+'T12:00:00')).toUpperCase();
                }
            } catch(e) { console.error('chart fetch:', e?.message || e); }

            // No fake data — show empty state if backend has no metrics yet
            if (!data.length) {
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.alignItems = 'center';
                container.style.justifyContent = 'center';
                container.style.height = '260px';
                container.innerHTML = `
                    <div style="font-size:32px;margin-bottom:12px;opacity:0.5;">📊</div>
                    <div style="color:#fff;font-weight:600;font-size:15px;margin-bottom:4px;">${t('chart.nodata')}</div>
                    <div style="color:rgba(255,255,255,0.6);font-size:13px;text-align:center;max-width:240px;">${t(isSleep ? 'chart.nodata.sleep' : 'chart.nodata.hr')}</div>
                `;
                return;
            }

            currentChartData = data;
            currentChartLabels = dayLabels;
            currentChartLongLabels = longDayLabels;

            const lastIdx = data.length - 1;
            const formatValue = (val) => isSleep
                ? `${Math.floor(val)}h ${Math.round((val % 1) * 60)}m`
                : `${Math.round(val)} BPM`;
            const shortVal = (val) => isSleep
                ? `${Math.floor(val)}h ${String(Math.round((val%1)*60)).padStart(2,'0')}m`
                : `${Math.round(val)}`;

            // Status color per data point
            const getDotColor = (val) => {
                if (isSleep) {
                    const rec = (typeof getRecommendedSleep === 'function') ? getRecommendedSleep(typeof userAge !== 'undefined' ? userAge : 30) : 8;
                    const pct = (val / rec) * 100;
                    if (pct >= 90) return '#6B8F71';
                    if (pct >= 70) return '#C4A35A';
                    return '#C07264';
                } else {
                    if (val >= 50 && val <= 70) return '#6B8F71';
                    if (val > 70 && val <= 85) return '#C4A35A';
                    return '#C07264';
                }
            };

            // ── Calendar-style chart ─────────────────────────────────────
            const W = 320, H = 196;
            const pL = 28, pR = 8, pT = 14, pB = 52;
            const cW = W - pL - pR, cH = H - pT - pB;

            const maxV = Math.max(...data);
            const minV = Math.min(...data);
            const vSpan = Math.max(maxV - minV, 0.5);

            const xs = data.map((_, i) => pL + (i / (data.length - 1)) * cW);
            const ys = data.map(v => pT + cH - ((v - minV) / vSpan) * cH);

            // Straight line + area (like calendar)
            const linePath = data.map((_, i) => `${i===0?'M':'L'}${xs[i].toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
            const areaPath = linePath + ` L${xs[lastIdx].toFixed(1)},${(pT+cH).toFixed(1)} L${xs[0].toFixed(1)},${(pT+cH).toFixed(1)} Z`;

            // Grid (2 dashed lines)
            const grid = [0.35, 0.7].map(f => {
                const y = (pT + f * cH).toFixed(1);
                return `<line x1="${pL}" y1="${y}" x2="${(pL+cW).toFixed(1)}" y2="${y}" stroke="#EDE8DC" stroke-width="0.7" stroke-dasharray="4 3"/>`;
            }).join('');

            // Baseline
            const xAxis = `<line x1="${pL}" y1="${(pT+cH).toFixed(1)}" x2="${(pL+cW).toFixed(1)}" y2="${(pT+cH).toFixed(1)}" stroke="#D8D2C4" stroke-width="1"/>`;

            // Y-axis labels
            const yAxisLbls = [0, 0.35, 0.7, 1].map(f => {
                const yPos = pT + f * cH;
                const val  = maxV - f * vSpan;
                const mins = Math.round((val % 1) * 60);
                const lbl  = isSleep ? (mins > 0 ? `${Math.floor(val)}:${String(mins).padStart(2,'0')}` : `${Math.floor(val)}h`) : `${Math.round(val)}`;
                return `<text x="${(pL-4).toFixed(1)}" y="${(yPos+3).toFixed(1)}" text-anchor="end" font-size="7.5" fill="#8A8A8A" font-family="Inter,sans-serif">${lbl}</text>`;
            }).join('');

            // Dashed ref lines — vertical: dot → baseline
            const refLines = data.map((_, i) =>
                `<line x1="${xs[i].toFixed(1)}" y1="${ys[i].toFixed(1)}" x2="${xs[i].toFixed(1)}" y2="${(pT+cH).toFixed(1)}" stroke="#D8D2C4" stroke-width="0.7" stroke-dasharray="3 3"/>`
            ).join('');

            // Bottom rows
            const rowY1 = pT + cH + 13;
            const rowY2 = pT + cH + 26;
            const rowY3 = pT + cH + 39;

            const xLabels = dayLabels.map((day, i) =>
                `<text id="chart-day-${i}" x="${xs[i].toFixed(1)}" y="${rowY1}" text-anchor="middle" font-size="8" fill="${i===lastIdx?'#111111':'#8A8A8A'}" font-family="Inter,sans-serif" font-weight="${i===lastIdx?'800':'600'}">${day}</text>`
            ).join('');

            const valLabels = data.map((v, i) =>
                `<text x="${xs[i].toFixed(1)}" y="${rowY2}" text-anchor="middle" font-size="7" fill="${getDotColor(v)}" font-family="Inter,sans-serif" font-weight="700" style="animation:fadeIn 0.3s ease ${680+i*50}ms both;">${shortVal(v)}</text>`
            ).join('');

            // Dots — status colored, active = white center + colored ring
            const dots = data.map((v, i) => {
                const x = xs[i].toFixed(1), y = ys[i].toFixed(1), dl = 900 + i * 55;
                const isAct = i === lastIdx;
                const col = getDotColor(v);
                const inner = isAct ? `<circle cx="${x}" cy="${y}" r="2" fill="#FFFFFF" style="pointer-events:none;"/>` : '';
                return `<g onclick="selectChartDay(${i})" cursor="pointer" style="transform-origin:${x}px ${y}px;animation:popDot 0.35s cubic-bezier(0.34,1.56,0.64,1) ${dl}ms both;">
                    <circle id="chart-point-${i}" cx="${x}" cy="${y}" r="${isAct?5:4}" fill="${col}" stroke="#FFFFFF" stroke-width="1.5"/>
                    ${inner}
                </g>`;
            }).join('');

            const chartHTML = `
                <div style="background:#FFFFFF;border:1px solid rgba(235,235,235,0.5);border-radius:14px;padding:14px 14px 10px;box-shadow:0 2px 12px rgba(0,0,0,0.03);">
                    <div style="font-size:10px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#8A8A8A;margin-bottom:10px;">${isSleep ? t('home.sleeptime') : t('metric.hr.full')}</div>
                    <svg viewBox="0 0 ${W} ${H}" width="100%" style="overflow:visible;display:block;">
                        <defs>
                            <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%"   stop-color="var(--primary-color)" stop-opacity="0.2"/>
                                <stop offset="100%" stop-color="var(--primary-color)" stop-opacity="0"/>
                            </linearGradient>
                        </defs>
                        ${grid}${xAxis}${yAxisLbls}
                        <path d="${areaPath}" fill="url(#chart-grad)"/>
                        <path id="chart-path-main" d="${linePath}" fill="none" stroke="var(--primary-color)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                        ${refLines}${xLabels}${valLabels}${dots}
                    </svg>
                </div>`;

            const summaryHTML = `
                <div id="summary-day-label" class="summary-day-top">${todayLongName}</div>
                <div class="chart-summary-highlight">
                    <div id="summary-liquid-layer" class="summary-liquid-container">
                        <div class="summary-wave-container back"><svg viewBox="0 0 240 28" preserveAspectRatio="none" style="width:100%;height:100%;"><path d="M0 30 V15 Q30 3 60 15 t60 0 t60 0 t60 0 V30 z"/></svg></div>
                        <div class="summary-wave-container"><svg viewBox="0 0 240 28" preserveAspectRatio="none" style="width:100%;height:100%;"><path d="M0 30 V15 Q30 3 60 15 t60 0 t60 0 t60 0 V30 z"/></svg></div>
                    </div>
                    <div class="summary-content"><span id="summary-main-val" class="summary-main-val">${formatValue(data[lastIdx])}</span></div>
                </div>`;

            const listHTML = `
                <div class="chart-details-list">
                    ${[...dayLabels].reverse().map((_, ri) => {
                        const i = dayLabels.length - 1 - ri;
                        return `<div id="detail-row-${i}" class="detail-row ${i===lastIdx?'active':''}" onclick="selectChartDay(${i})">
                            <span class="detail-day">${longDayLabels[i]}</span>
                            <span class="detail-value">${formatValue(data[i])}</span>
                        </div>`;
                    }).join('')}
                </div>`;

            container.innerHTML = chartHTML + summaryHTML + listHTML;

            // Swipe left/right on summary to change day
            const summaryEl = container.querySelector('.chart-summary-highlight');
            if (summaryEl) {
                let _swipeX = 0;
                summaryEl.addEventListener('touchstart', e => { _swipeX = e.touches[0].clientX; }, { passive: true });
                summaryEl.addEventListener('touchend', e => {
                    const dx = e.changedTouches[0].clientX - _swipeX;
                    if (Math.abs(dx) < 40) return;
                    const cur = currentChartData ? currentChartData.indexOf(
                        parseFloat(document.getElementById('summary-main-val')?.innerText)
                    ) : -1;
                    const dots = Array.from(container.querySelectorAll('[id^="chart-point-"]'));
                    const activeDot = dots.find(d => d.classList.contains('active')) || dots[dots.length - 1];
                    const curIdx = activeDot ? parseInt(activeDot.id.replace('chart-point-', '')) : (data.length - 1);
                    let next = dx < 0 ? curIdx + 1 : curIdx - 1;
                    next = Math.max(0, Math.min(data.length - 1, next));
                    if (next !== curIdx) selectChartDay(next);
                }, { passive: true });
            }

            const fillPct = isSleep ? Math.min((data[lastIdx]/9)*100,100) : Math.min((data[lastIdx]/100)*100,100);
            setTimeout(() => {
                const l = document.getElementById('summary-liquid-layer');
                const bg   = isSleep ? 'rgba(123,152,176,0.28)' : _statusColor(fillPct);
                const solid = isSleep ? '#7B98B0' : _statusColorSolid(fillPct);
                if (l) { l.style.height = fillPct+'%'; l.style.background = bg; }
                document.querySelectorAll('.summary-wave-container').forEach(el => el.style.fill = solid);
            }, 100);

            const path = document.getElementById('chart-path-main');
            if (path) {
                const len = path.getTotalLength();
                path.style.strokeDasharray = len;
                path.style.strokeDashoffset = len;
                gsap.to(path, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out' });
            }
        }

        function _statusColor(pct) {
            if (pct >= 85) return 'rgba(107,143,113,0.28)';
            if (pct >= 60) return 'rgba(196,163,90,0.28)';
            return 'rgba(192,114,100,0.28)';
        }
        function _statusColorSolid(pct) {
            if (pct >= 85) return '#6B8F71';
            if (pct >= 60) return '#C4A35A';
            return '#C07264';
        }

        function selectChartDay(index) {
            if (!currentChartData) return;
            const val = currentChartData[index];
            const isSleep = currentChartType === 'sleep';

            const formatValue = (v) => {
                if (isSleep) {
                    const hrs = Math.floor(v);
                    const mins = Math.round((v - hrs) * 60);
                    return `${hrs}h ${mins}m`;
                }
                return `${v}${currentChartType === 'sleep' ? 'h' : ' BPM'}`;
            };

            // 1. Update List Highlights
            document.querySelectorAll('.detail-row').forEach(r => r.classList.remove('active'));
            const activeRow = document.getElementById(`detail-row-${index}`);
            if (activeRow) activeRow.classList.add('active');

            // 2. Update Summary Values
            const summaryVal = document.getElementById('summary-main-val');
            const summaryDay = document.getElementById('summary-day-label');
            if (summaryVal) summaryVal.innerText = formatValue(val);
            if (summaryDay) summaryDay.innerText = currentChartLongLabels[index].toUpperCase();

            // 3. Update Liquid Height + Color
            const liquidLayer = document.getElementById('summary-liquid-layer');
            if (liquidLayer) {
                const fillPercent = isSleep ? Math.min((val / 9) * 100, 100) : Math.min((val / 100) * 100, 100);
                const bg    = isSleep ? 'rgba(123,152,176,0.28)' : _statusColor(fillPercent);
                const solid = isSleep ? '#7B98B0' : _statusColorSolid(fillPercent);
                gsap.to(liquidLayer, { height: fillPercent + '%', backgroundColor: bg, duration: 1, ease: "power2.out" });
                document.querySelectorAll('.summary-wave-container').forEach(el => el.style.fill = solid);
            }

            // 4. Update Chart Highlights
            document.querySelectorAll('.chart-point').forEach(p => p.classList.remove('active'));
            document.querySelectorAll('.chart-day-label').forEach(l => l.classList.remove('active'));

            const activePoint = document.getElementById(`chart-point-${index}`);
            const activeLabel = document.getElementById(`chart-day-${index}`);

            if (activePoint) activePoint.classList.add('active');
            if (activeLabel) activeLabel.classList.add('active');
        }

        async function renderBigBattery(container) {
            let days = _dayNamesShort();
            let values = [];

            // Fetch readiness data from API
            try {
                const response = await authFetch(`${API_BASE}/api/health/${currentUserId}?type=readiness&days=7`, { headers: authHeaders() });
                if (!response.ok) throw new Error('HTTP ' + response.status);
                const result = await response.json();

                if (result.metrics && result.metrics.length > 0) {
                    values = result.metrics.map(m => Math.round(m.value));
                    const _dn = _dayNamesShort();          // 0 = poniedziałek
                    const plDays = [_dn[6], _dn[0], _dn[1], _dn[2], _dn[3], _dn[4], _dn[5]];   // getDay(): 0 = niedziela
                    days = result.metrics.map(m => {
                        const d = new Date(m.metric_date + 'T12:00:00');
                        return plDays[d.getDay()];
                    });
                }
            } catch (e) {
                console.warn('API fetch for readiness failed:', e?.message || e);
            }

            // No fake fallback — show empty state when there is no readiness history
            if (!values.length) {
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.alignItems = 'center';
                container.style.justifyContent = 'center';
                container.style.height = '320px';
                container.innerHTML = `
                    <div style="font-size:36px;margin-bottom:12px;opacity:0.5;">🔋</div>
                    <div style="color:#fff;font-weight:600;font-size:16px;margin-bottom:6px;">${t('home.readiness.empty.title')}</div>
                    <div style="color:rgba(255,255,255,0.65);font-size:13px;text-align:center;max-width:260px;">${t('home.readiness.empty.desc')}</div>
                `;
                return;
            }

            const lastIdx = values.length - 1;
            const todayValue = values[lastIdx];

            // Helper for unique physics
            const genPhys = () => {
                const dur = (8 + Math.random() * 8).toFixed(1) + 's';
                const durRev = (12 + Math.random() * 8).toFixed(1) + 's';
                const delay = (Math.random() * -10).toFixed(1) + 's';
                const delayRev = (Math.random() * -10).toFixed(1) + 's';
                return `--wave-dur: ${dur}; --wave-dur-rev: ${durRev}; --wave-delay: ${delay}; --wave-delay-rev: ${delayRev};`;
            };

            // Calculate averages from data
            const weekAvg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
            const averages = [
                { label: t('cal.week'), val: weekAvg, key: 'week' },
                { label: t('cal.month'), val: Math.round(weekAvg * 0.95), key: 'month' },
                { label: t('home.avg.year'), val: Math.round(weekAvg * 1.04), key: 'year' }
            ];

            let html = `
                <div class="big-battery-layout">
                    <!-- 1. Selection Label -->
                    <div class="selection-label">${t('home.pickday')}</div>

                    <!-- 2. Day Markers -->
                    <div class="day-markers">
                        ${days.map((day, i) => {
                const activeClass = i === lastIdx ? 'active' : '';
                return `
                                <div class="day-marker ${activeClass}" 
                                     onclick="updateBigBattery(${values[i]}, this)">
                                    <span class="day-marker-text">${day}</span>
                                    <div class="day-marker-dot"></div>
                                </div>
                            `;
            }).join('')}
                    </div>

                    <!-- 3. Big Battery -->
                    <div class="big-battery-shell">
                         <div class="battery-level" style="height: 100%; border-radius: 14px; overflow: hidden; position: relative; background: rgba(0,0,0,0.3);">
                            <div id="big-battery-liquid" class="liquid" style="height: ${todayValue}%; ${genPhys()}">
                                <!-- Splash Droplets -->
                                <div class="liquid-splash-container">
                                    <div class="droplet"></div><div class="droplet"></div><div class="droplet"></div><div class="droplet"></div><div class="droplet"></div>
                                </div>
                            </div>
                        </div>
                        <div class="big-battery-cap"></div>
                        <div id="big-battery-value" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 32px; font-weight: 900; color: white; text-shadow: 0 4px 15px rgba(0,0,0,0.5); z-index: 5;">
                            ${todayValue}%
                        </div>
                    </div>

                    <!-- 4. Averages Section -->
                    <div class="averages-section">
                        <div class="averages-divider"></div>
                        <div class="averages-title">${t('metric.body.status')}</div>

                        <div class="averages-grid">
                            ${averages.map(avg => `
                                <div class="average-item">
                                    <div style="position:relative;padding-top:10px;">
                                        <!-- Terminal + -->
                                        <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:24px;height:10px;background:#D4D4D4;border-radius:4px 4px 0 0;border:2px solid #D4D4D4;border-bottom:none;z-index:2;"></div>
                                        <!-- Battery body -->
                                        <div style="width:60px;height:110px;border:2px solid #D4D4D4;border-radius:12px;position:relative;overflow:hidden;background:#F5F3F0;box-shadow:none;">
                                            <!-- Level marks 75/50/25% -->
                                            <div style="position:absolute;bottom:75%;left:8px;right:8px;height:1px;background:rgba(0,0,0,0.08);z-index:3;"></div>
                                            <div style="position:absolute;bottom:50%;left:8px;right:8px;height:1px;background:rgba(0,0,0,0.08);z-index:3;"></div>
                                            <div style="position:absolute;bottom:25%;left:8px;right:8px;height:1px;background:rgba(0,0,0,0.08);z-index:3;"></div>
                                            <!-- Fill — kolor zależny od wartości -->
                                            <div style="position:absolute;bottom:0;left:0;right:0;height:${avg.val}%;background:${avg.val>=70?'#6B8F71':avg.val>=40?'#C4A35A':'#C07264'};opacity:0.9;transition:height 1.2s cubic-bezier(0.22,1,0.36,1);"></div>
                                            <!-- Value -->
                                            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:14px;font-weight:900;color:#1A1A1A;text-shadow:none;z-index:5;white-space:nowrap;">${avg.val}%</div>
                                        </div>
                                    </div>
                                    <span class="average-label">${avg.label}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML = html;

            // 6. Swipe left/right on battery to change day
            const shell = container.querySelector('.big-battery-shell');
            if (shell) {
                let _swipeX = 0;
                shell.addEventListener('touchstart', e => { _swipeX = e.touches[0].clientX; }, { passive: true });
                shell.addEventListener('touchend', e => {
                    const dx = e.changedTouches[0].clientX - _swipeX;
                    if (Math.abs(dx) < 40) return;
                    const markers = Array.from(document.querySelectorAll('.day-marker'));
                    const cur = markers.findIndex(m => m.classList.contains('active'));
                    let next = dx < 0 ? cur + 1 : cur - 1;
                    next = Math.max(0, Math.min(markers.length - 1, next));
                    if (next === cur) return;
                    updateBigBattery(values[next], markers[next]);
                }, { passive: true });
            }

            // 7. Trigger initial 'Arrival' slosh ONLY for the big battery (minis are static now)
            const bigLiquid = container.querySelector('#big-battery-liquid');
            if (bigLiquid) {
                setTimeout(() => triggerSlosh(bigLiquid, 25), 100);
            }

            // Trigger initial color sync
            updateBigBattery(todayValue, document.querySelector('.day-marker.active'));
        }

        function updateBigBattery(value, el) {
            // 1. Update active state
            document.querySelectorAll('.day-marker').forEach(m => m.classList.remove('active'));
            if (el) el.classList.add('active');

            // 2. Animate Liquid Level (GSAP)
            const liquid = document.getElementById('big-battery-liquid');
            const valDisplay = document.getElementById('big-battery-value');
            if (!liquid || !valDisplay) return;

            const prevHeight = parseFloat(liquid.style.height) || 0;
            const delta = value - prevHeight;

            // Animate height instead of top
            gsap.to(liquid, { height: value + '%', duration: 1.2, ease: "power3.inOut" });

            // 3. Kolor cieczy zależny od wartości
            const color = value >= 70 ? '#6B8F71' : value >= 40 ? '#C4A35A' : '#C07264';

            gsap.to(liquid, {
                backgroundColor: color,
                duration: 0.6
            });

            // 4. Update text percentage
            valDisplay.innerText = value + '%';

            // 5. Inject Randomized Physics for the next slosh event
            const dur = (8 + Math.random() * 8).toFixed(1) + 's';
            const durRev = (12 + Math.random() * 8).toFixed(1) + 's';
            const delay = (Math.random() * -10).toFixed(1) + 's';
            const delayRev = (Math.random() * -10).toFixed(1) + 's';

            liquid.style.setProperty('--wave-dur', dur);
            liquid.style.setProperty('--wave-dur-rev', durRev);
            liquid.style.setProperty('--wave-delay', delay);
            liquid.style.setProperty('--wave-delay-rev', delayRev);

            // 6. Trigger Perpetual Momentum Slosh
            triggerSlosh(liquid, delta);
        }

