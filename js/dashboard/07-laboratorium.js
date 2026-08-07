        function _labRing(score, color, id) {
            const r = 40, C = 2 * Math.PI * r;
            const has = score != null;
            return '<div style="position:relative;width:96px;height:96px;margin:8px auto 0;">' +
                '<svg width="96" height="96" viewBox="0 0 96 96" style="display:block;overflow:visible;">' +
                    '<circle cx="48" cy="48" r="' + r + '" fill="none" stroke="#EDE8DF" stroke-width="8"/>' +
                    (has ? '<circle id="' + id + '-arc" cx="48" cy="48" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="8" stroke-linecap="round" stroke-dasharray="' + C.toFixed(2) + '" stroke-dashoffset="' + C.toFixed(2) + '" transform="rotate(-90 48 48)" style="transition:stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1);"/>' : '') +
                '</svg>' +
                '<div id="' + id + '-num" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:Outfit,sans-serif;font-size:26px;font-weight:800;font-variant-numeric:tabular-nums;color:' + (has ? '#1A1A1A' : '#C8C2B8') + ';">' + (has ? '0' : '—') + '</div>' +
                '</div>';
        }

        function _labRingCard(label, score, sub, subColor, id) {
            return '<div class="lab-card" style="background:#fff;border:1px solid #EBEBEB;border-radius:20px;padding:16px 14px 18px;text-align:center;">' +
                '<div style="font-size:11px;font-weight:700;color:#8A8A8A;text-transform:uppercase;letter-spacing:0.08em;">' + label + '</div>' +
                _labRing(score, subColor, id) +
                (sub ? '<div style="font-size:12px;font-weight:600;color:' + (subColor || '#8A8A8A') + ';margin-top:6px;">' + sub + '</div>' : '') +
                '</div>';
        }

        // Liczy od 0 do docelowej wartości z ease-out, jednocześnie z wypełnianiem
        // pierścienia (transition CSS na stroke-dashoffset robi samą kreskę).
        function _labAnimateRing(id, score) {
            const arc = document.getElementById(id + '-arc');
            const num = document.getElementById(id + '-num');
            if (!num || score == null) return;
            const r = 40, C = 2 * Math.PI * r, target = Math.max(0, Math.min(100, score));
            if (arc) requestAnimationFrame(() => requestAnimationFrame(() => {
                arc.style.strokeDashoffset = (C * (1 - target / 100)).toFixed(2);
            }));
            const duration = 1100, start = performance.now(), ease = t => 1 - Math.pow(1 - t, 3);
            (function tick(now) {
                const t = Math.min((now - start) / duration, 1);
                num.textContent = Math.round(target * ease(t));
                if (t < 1) requestAnimationFrame(tick);
            })(start);
        }

        // Obciążenie (ACWR) na pełną szerokość: pasek stref + trójkątny wskaźnik
        // pozycji. Skala 0-2.0 — realny ACWR prawie zawsze mieści się w tym zakresie,
        // progi 0.8/1.3/1.5 to te same wartości co status z backendu. Backend teraz
        // wymaga min. 4 treningów rozciągniętych na 14+ dni zanim w ogóle zwróci
        // load — bez tego 1-2 pierwsze biegi na świeżym koncie potrafiły podbić
        // ACWR do absurdalnych wartości (np. 4.0) i pokazać fałszywe "przeciążenie".
        function _labLoadGauge(load) {
            const STATUS_PL  = { low: t('lab.load.low'), optimal: t('lab.load.optimal'), elevated: t('lab.load.elevated'), high: t('lab.load.high') };
            const STATUS_COL = { low: '#8A8A8A', optimal: '#6B8F71', elevated: '#C4A35A', high: '#C07264' };
            const MAX = 2.0;
            const zones = [
                { w: 0.8, color: '#D8D2C4' },  // 0.0–0.8 niskie
                { w: 0.5, color: '#6B8F71' },  // 0.8–1.3 optymalne
                { w: 0.2, color: '#C4A35A' },  // 1.3–1.5 podwyższone
                { w: 0.5, color: '#C07264' },  // 1.5–2.0 wysokie
            ];
            const segs = zones.map(z => '<div style="flex:' + z.w + ';background:' + z.color + ';height:100%;"></div>').join('');
            const has = load && load.acwr != null;
            const pos = has ? Math.max(2, Math.min(98, (load.acwr / MAX) * 100)) : null;
            const detail = has
                ? t('lab.load.thisweek') + ' <b style="color:#1A1A1A;font-weight:700;">' + load.acuteKm + ' km</b> · ' + t('lab.load.monthavg') + ' <b style="color:#1A1A1A;font-weight:700;">' + load.chronicKm + ' km</b>'
                : '';
            return '<div class="lab-card" style="background:#fff;border:1px solid #EBEBEB;border-radius:20px;padding:18px 16px;margin-top:12px;">' +
                '<div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:2px;">' +
                    '<div style="font-size:11px;font-weight:700;color:#8A8A8A;text-transform:uppercase;letter-spacing:0.08em;">' + t('lab.load.title') + '</div>' +
                    '<div id="lab-load-val" style="font-family:Outfit,sans-serif;font-size:20px;font-weight:800;color:#1A1A1A;font-variant-numeric:tabular-nums;">' + (has ? '0.00' : '—') + '</div>' +
                '</div>' +
                '<div style="font-size:12px;font-weight:600;color:' + (has ? STATUS_COL[load.status] || '#8A8A8A' : '#8A8A8A') + ';margin-bottom:16px;">' + (has ? (STATUS_PL[load.status] || '') : t('lab.load.nodata')) + '</div>' +
                '<div style="position:relative;">' +
                    (has ? '<div id="lab-load-marker" style="position:absolute;left:0%;top:-7px;transform:translateX(-50%);width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid #1A1A1A;opacity:0;"></div>' : '') +
                    '<div style="height:10px;border-radius:6px;overflow:hidden;display:flex;">' + segs + '</div>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between;margin-top:8px;font-size:9.5px;font-weight:700;color:#B0A89E;letter-spacing:0.03em;text-transform:uppercase;">' +
                    '<span>Niskie</span><span>Optymalne</span><span>Wysokie</span>' +
                '</div>' +
                (detail ? '<div style="font-size:11.5px;color:#8A8A8A;margin-top:12px;padding-top:12px;border-top:1px solid #F0EDE8;line-height:1.4;">' + detail + '</div>' : '') +
                '</div>';
        }

        function _labAnimateGauge(load) {
            const marker = document.getElementById('lab-load-marker');
            const val = document.getElementById('lab-load-val');
            if (!val || !load || load.acwr == null) return;
            const targetPos = Math.max(2, Math.min(98, (load.acwr / 2.0) * 100));
            if (marker) {
                marker.style.transition = 'left 900ms cubic-bezier(0.22,1,0.36,1), opacity 300ms ease';
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    marker.style.left = targetPos.toFixed(1) + '%';
                    marker.style.opacity = '1';
                }));
            }
            const duration = 900, start = performance.now(), ease = t => 1 - Math.pow(1 - t, 3);
            (function tick(now) {
                const t = Math.min((now - start) / duration, 1);
                val.textContent = (load.acwr * ease(t)).toFixed(2);
                if (t < 1) requestAnimationFrame(tick);
            })(start);
        }

        // Wykres trendu — wzorowany 1:1 na karcie "Sen"/"Tętno Spoczynkowe"
        // (renderSimpleChart, ~5124: prawdziwa oś Y z wartościami, pionowe kreski
        // odniesienia do każdego punktu, kropki kolorowane statusem, aktywna kropka =
        // kolorowe wypełnienie + biały środek) — user explicite wskazał te dwie karty
        // jako wzór "jak ma wyglądać dobry wykres" w tej apce. Jedyna różnica: tu
        // tydzień bez wystarczających sygnałów to przerwa w linii (Sen/Tętno mają
        // zawsze komplet 7/7 dni), nigdy zmyślona/interpolowana wartość — ta sama
        // zasada co bramka ACWR dla obciążenia.
        // invert=true: wyższa wartość wyżej na wykresie (Forma, 0-100 gdzie więcej=lepiej).
        // invert=false: wyższa wartość NIŻEJ (czas wyścigu, gdzie mniej=lepiej — ten sam
        // trik co w _buildPaceSVG, gdzie szybsze tempo/mniej sekund samo wypada wyżej).
        // opts.tipId: włącza tappable kropki (reużywa .stats-tooltip + showStatsTip()
        // ze Statystyk). opts.dotColorFor(value): opcjonalny kolor per punkt (status),
        // domyślnie stały `color`. opts.refLine: opcjonalna pozioma kreska odniesienia
        // (cel usera z onboardingu) — rozciąga skalę tak, żeby zawsze się zmieściła.
        function _labTrendSVG(points, opts) {
            const { invert = true, color = '#1A1A1A', lineId, tipId, refLine, dotColorFor, yFmt } = opts || {};
            const W = 320, H = 172;
            const pL = 30, pR = 10, pT = 16, pB = 16;
            const cW = W - pL - pR, cH = H - pT - pB;
            const n = points.length;

            const validVals = points.filter(p => p.y != null).map(p => p.y);
            if (validVals.length < 2) return null;
            let minY = Math.min(...validVals), maxY = Math.max(...validVals);
            if (refLine && refLine.value != null) { minY = Math.min(minY, refLine.value); maxY = Math.max(maxY, refLine.value); }
            const pad = Math.max((maxY - minY) * 0.25, Math.abs(maxY) * 0.05, 1);
            const yLo = minY - pad, yHi = maxY + pad;
            const span = (yHi - yLo) || 1;

            const xAt = i => pL + (n <= 1 ? cW / 2 : (i / (n - 1)) * cW);
            const yAt = v => invert ? (pT + (1 - (v - yLo) / span) * cH) : (pT + ((v - yLo) / span) * cH);
            const baseline = pT + cH;
            const fmt = yFmt || (v => String(Math.round(v)));

            // Oś Y — jak w renderSimpleChart: 3 linie (dół/środek/góra) z prawdziwymi wartościami.
            const gridFracs = [0, 0.5, 1];
            const gridLines = gridFracs.map(f => {
                const y = pT + f * cH;
                return `<line x1="${pL}" y1="${y.toFixed(1)}" x2="${(pL + cW).toFixed(1)}" y2="${y.toFixed(1)}" stroke="#EDE8DC" stroke-width="0.8" stroke-dasharray="4 3"/>`;
            }).join('');
            const yLabels = gridFracs.map(f => {
                const y = pT + f * cH;
                const v = invert ? (yHi - f * span) : (yLo + f * span);
                return `<text x="${(pL - 6).toFixed(1)}" y="${(y + 3).toFixed(1)}" text-anchor="end" font-size="8" fill="#8A8A8A" font-family="Inter,sans-serif">${fmt(v)}</text>`;
            }).join('');

            let segments = [], cur = [];
            points.forEach((p, i) => {
                if (p.y == null) { if (cur.length) segments.push(cur); cur = []; return; }
                cur.push([xAt(i), yAt(p.y)]);
            });
            if (cur.length) segments.push(cur);
            if (!segments.length) return null;

            // Krzywa (Catmull-Rom, ten sam _crSmooth co karty tygodniowe w Kalendarzu)
            // zamiast łamanej — kilka punktów po prostej wygląda toporne, wygładzona
            // linia czyta się jak dopracowany wykres, nie szkic.
            const linePD = segments.map(seg => _crSmooth(seg)).join(' ');

            // Przerwa (brak wystarczających danych w danym tygodniu) NIE jest ukrywana
            // ani zmyślana — ale goły odstęp w linii czyta się jak zepsuty wykres, nie
            // świadomy wybór. Łącznik: cienka, przerywana, wyraźnie odmienna od
            // properowej krzywej kreska między ostatnim realnym punktem a następnym —
            // sygnalizuje "tu nie wiemy", nie podaje żadnej wartości pośredniej.
            const gapConnectors = segments.slice(1).map((seg, i) => {
                const prevEnd = segments[i][segments[i].length - 1];
                const nextStart = seg[0];
                return `<line x1="${prevEnd[0].toFixed(1)}" y1="${prevEnd[1].toFixed(1)}" x2="${nextStart[0].toFixed(1)}" y2="${nextStart[1].toFixed(1)}" stroke="${color}" stroke-width="1.4" stroke-dasharray="1 4" stroke-linecap="round" opacity="0.4"/>`;
            }).join('');

            // Cień (wypełnienie) NIE może kończyć się urwanym pionowym uskokiem tam,
            // gdzie zaczyna się "główny" odcinek — to wygląda jak zepsuty render, nie
            // świadomy wybór (w przeciwieństwie do samej linii, gdzie przerwa MA być
            // widoczna). Cień idzie więc przez CAŁĄ szerokość — gładka krzywa w
            // odcinkach z danymi, prosta kreska (jak gapConnectors) w przerwach —
            // jeden ciągły kształt od pierwszego do ostatniego punktu.
            const fullPD = segments.map((seg, i) => {
                const d = _crSmooth(seg);
                return i === 0 ? d : d.replace(/^M/, 'L');
            }).join(' ');
            const firstPt = segments[0][0];
            const lastSeg = segments[segments.length - 1];
            const lastPt = lastSeg[lastSeg.length - 1];
            const areaPD = fullPD
                ? fullPD + ` L${lastPt[0].toFixed(1)},${baseline.toFixed(1)} L${firstPt[0].toFixed(1)},${baseline.toFixed(1)} Z`
                : '';

            // Pionowe kreski odniesienia od każdego ważnego punktu do linii bazowej —
            // dokładnie jak refLines w renderSimpleChart.
            const refTicks = points.map((p, i) => {
                if (p.y == null) return '';
                const x = xAt(i).toFixed(1), y = yAt(p.y).toFixed(1);
                return `<line x1="${x}" y1="${y}" x2="${x}" y2="${baseline.toFixed(1)}" stroke="#D8D2C4" stroke-width="0.7" stroke-dasharray="3 3"/>`;
            }).join('');

            const refLineHtml = (refLine && refLine.value != null) ? (() => {
                const ry = yAt(refLine.value).toFixed(1);
                const lbl = refLine.label ? `<text x="${(pL + cW).toFixed(1)}" y="${(parseFloat(ry) - 6).toFixed(1)}" text-anchor="end" font-size="9.5" fill="#B08A3E" font-family="Inter,sans-serif" font-weight="700">${refLine.label}</text>` : '';
                return `<line x1="${pL}" y1="${ry}" x2="${(pL + cW).toFixed(1)}" y2="${ry}" stroke="#C4A35A" stroke-width="1.3" stroke-dasharray="5 3"/>${lbl}`;
            })() : '';

            // Kropki kolorowane statusem (jak getDotColor w renderSimpleChart); aktywna
            // (ostatnia ważna) = kolorowe wypełnienie + mały biały środek, nie osobny pierścień.
            let lastValidIdx = -1;
            for (let i = points.length - 1; i >= 0; i--) if (points[i].y != null) { lastValidIdx = i; break; }
            const dots = points.map((p, i) => {
                if (p.y == null) return '';
                const isLast = i === lastValidIdx;
                const x = xAt(i).toFixed(1), y = yAt(p.y).toFixed(1);
                const dotCol = dotColorFor ? dotColorFor(p.y) : color;
                const r = isLast ? 5 : 4;
                const inner = isLast ? `<circle cx="${x}" cy="${y}" r="1.8" fill="#FFFFFF" style="pointer-events:none;"/>` : '';
                const tapAttrs = (tipId && (p.label || p.sub))
                    ? ` onclick="showStatsTip('${tipId}',this,'${String(p.label || '').replace(/'/g, "\\'")}','${String(p.sub || '').replace(/'/g, "\\'")}','')" style="cursor:pointer;touch-action:manipulation;"`
                    : '';
                return `<circle cx="${x}" cy="${y}" r="${r}" fill="${dotCol}" stroke="#FFFFFF" stroke-width="1.5"${tapAttrs}/>${inner}`;
            }).join('');

            const gradId = lineId + '-grad';
            const tipHtml = tipId ? `<div id="s-${tipId}-tip" class="stats-tooltip"></div>` : '';
            return {
                html: `<div style="position:relative;">
                    <svg id="${lineId}" viewBox="0 0 ${W} ${H}" width="100%" style="display:block;overflow:visible;">
                        <defs><linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="${color}" stop-opacity="0.2"/>
                            <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
                        </linearGradient></defs>
                        ${gridLines}${yLabels}
                        ${areaPD ? `<path d="${areaPD}" fill="url(#${gradId})"/>` : ''}
                        ${refTicks}
                        ${refLineHtml}
                        ${gapConnectors}
                        ${linePD ? `<path id="${lineId}-line" d="${linePD}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
                        ${dots}
                    </svg>
                    ${tipHtml}
                </div>`
            };
        }

        // Rysuje linię (stroke-dashoffset, jak pace-chart w Statystykach) + liczy w górę
        // wartość liczbową obok. formatFn opcjonalny — domyślnie zaokrąglona liczba
        // całkowita (Forma), dla czasu wyścigu przekazujemy formatter mm:ss.
        function _labAnimateTrendChart(lineId, numId, targetNum, formatFn) {
            const line = document.getElementById(lineId + '-line');
            if (line && typeof line.getTotalLength === 'function') {
                const len = line.getTotalLength();
                if (len > 0) {
                    line.style.strokeDasharray = len;
                    line.style.strokeDashoffset = len;
                    line.style.transition = 'stroke-dashoffset 900ms cubic-bezier(0.4,0,0.2,1)';
                    requestAnimationFrame(() => requestAnimationFrame(() => { line.style.strokeDashoffset = '0'; }));
                }
            }
            const num = numId && document.getElementById(numId);
            if (num && targetNum != null) {
                const fmt = formatFn || (v => String(Math.round(v)));
                const duration = 900, start = performance.now(), ease = t => 1 - Math.pow(1 - t, 3);
                (function tick(now) {
                    const t = Math.min((now - start) / duration, 1);
                    num.textContent = fmt(targetNum * ease(t));
                    if (t < 1) requestAnimationFrame(tick);
                })(start);
            }
        }

        function _labFmtRaceTime(totalSec) {
            if (totalSec == null || !isFinite(totalSec)) return '—';
            const s = Math.max(0, Math.round(totalSec));
            const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
            return h > 0 ? h + ':' + String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0') : m + ':' + String(sec).padStart(2, '0');
        }

        // Forma: zastępuje surowy tekst AI ("Analiza AI") jedną policzoną wartością
        // 0-100 (nie samym kierunkiem tempa) — ważona kompozycja kilku sygnałów,
        // dokładnie jak Gotowość waży energię/sen/tętno. Wagi rozkładają się
        // dynamicznie na to, co faktycznie mamy (bez zegarka Tętno wypada, reszta
        // się przelicza) — ten sam wzorzec co backendowa formuła Gotowości.
        // Dokładniejsza wersja (konkretne interwały tydzień do tygodnia z danych
        // zegarka) czeka na rework trenerów — to jest v1 algorytmu na danych,
        // które już mamy, do skalibrowania później.
        function _labFormaScore(d) {
            const tr = d.trends || {};
            const parts = [];
            // Tempo: najważniejszy, bezpośredni sygnał fitness. ±20s/km od zera
            // to pełen zakres skali — szybciej niż -20s = 100, wolniej niż +20s = 0.
            if (tr.paceDeltaSec != null) {
                parts.push([clamp01(50 - tr.paceDeltaSec * 2.5), 0.35]);
            }
            // Tętno przy tym samym wysiłku: niższe = lepsza forma. Tylko z zegarka.
            if (tr.hrDelta != null) {
                parts.push([clamp01(50 - tr.hrDelta * 5), 0.20]);
            }
            // Obciążenie: kara za oddalenie od optymalnego ACWR (~1.05) w OBIE
            // strony — zarówno za mało, jak i za dużo obciążenia szkodzi formie.
            if (d.load && d.load.acwr != null) {
                parts.push([clamp01(100 - Math.abs(d.load.acwr - 1.05) * 100), 0.20]);
            }
            // Sen: trend regeneracji wspierający progres.
            if (d.sleep && d.sleep.trend != null) {
                parts.push([clamp01(50 + d.sleep.trend * 5), 0.15]);
            }
            // Gotowość: stan z dzisiejszego rana, mniejsza waga (to migawka, nie trend).
            if (d.readiness && d.readiness.score != null) {
                parts.push([d.readiness.score, 0.10]);
            }
            if (!parts.length) return null;
            const wSum = parts.reduce((s, [, w]) => s + w, 0);
            return Math.round(parts.reduce((s, [v, w]) => s + v * w, 0) / wSum);
        }

        function clamp01(v) { return Math.max(0, Math.min(100, v)); }

        // Plakietka z przezroczystym tłem koloru tekstu (8-cyfrowy hex-alfa — wspierane
        // od lat w Chrome/Safari mobile, cel PWA) — jedyne miejsce gdzie tło ma kolor,
        // reszta karty zostaje monochromatyczna.
        function _labPill(text, color) {
            return '<span style="display:inline-flex;align-items:center;padding:5px 12px;border-radius:20px;background:' + color + '1F;color:' + color + ';font-size:13px;font-weight:700;line-height:1.2;">' + text + '</span>';
        }

        function _labFormaTile(label, val, col, sub) {
            return '<div style="background:#F8F5EE;border-radius:14px;padding:12px 8px;text-align:center;">' +
                '<div style="font-size:9.5px;font-weight:700;color:#8A8A8A;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">' + label + '</div>' +
                '<div style="font-family:Outfit,sans-serif;font-size:16px;font-weight:800;color:' + col + ';font-variant-numeric:tabular-nums;">' + val + '</div>' +
                (sub ? '<div style="font-size:9px;color:#B0A89E;margin-top:3px;line-height:1.3;">' + sub + '</div>' : '') +
                '</div>';
        }

        function _labFormaCard(d) {
            const tr = d.trends || {};
            const hasPace = tr.paceSec != null && tr.paceDeltaSec != null;

            const header = '<div style="margin-top:20px;">' +
                '<div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:2px;">' +
                    '<div style="font-family:Outfit,sans-serif;font-size:18px;font-weight:800;color:#1A1A1A;letter-spacing:-0.01em;">' + t('lab.forma.title') + '</div>' +
                    '<div style="font-size:10px;font-weight:700;color:#8A8A8A;text-transform:uppercase;letter-spacing:0.1em;">Analityk</div>' +
                '</div>' +
                '<div style="font-size:12px;color:#8A8A8A;margin-bottom:10px;line-height:1.4;">' + t('lab.forma.sub') + '</div>';

            if (!hasPace) {
                return header +
                    '<div class="lab-card" style="background:#fff;border:1px solid #EBEBEB;border-radius:20px;padding:28px 20px;text-align:center;">' +
                        '<div style="font-size:14px;font-weight:600;color:#1A1A1A;margin-bottom:4px;">' + t('lab.forma.nodata.title') + '</div>' +
                        '<div style="font-size:13px;color:#8A8A8A;line-height:1.5;">' + t('lab.forma.nodata.desc') + '</div>' +
                    '</div></div>';
            }

            const score = _labFormaScore(d);
            const col = score >= 70 ? '#6B8F71' : (score >= 45 ? '#C4A35A' : '#C07264');
            const verdict = score >= 70 ? t('lab.verdict.up') : (score >= 45 ? t('lab.verdict.stable') : t('lab.verdict.down'));

            const dl = tr.paceDeltaSec;
            const hasHr = tr.avgHr != null && tr.hrDelta != null;
            const loadStatusPl = { low: t('lab.load.low.short'), optimal: t('lab.load.optimal'), elevated: t('lab.load.elevated'), high: t('lab.load.high.short') };
            const loadCol = { low: '#8A8A8A', optimal: '#6B8F71', elevated: '#C4A35A', high: '#C07264' };
            const sleepT = d.sleep && d.sleep.trend != null ? d.sleep.trend : null;

            const tiles =
                _labFormaTile(t('home.pace'), (dl < 0 ? '▲' : dl > 0 ? '▼' : '=') + ' ' + Math.abs(dl) + 's', dl <= 0 ? '#6B8F71' : '#C07264', t('lab.sub.vs2w')) +
                _labFormaTile(t('cal.hr'), hasHr ? (tr.hrDelta < 0 ? '▼' : tr.hrDelta > 0 ? '▲' : '=') + ' ' + Math.abs(tr.hrDelta) : '—',
                    hasHr ? (tr.hrDelta <= 0 ? '#6B8F71' : '#C07264') : '#C8C2B8', hasHr ? t('lab.sub.sameeffort') : t('lab.sub.nowatch')) +
                _labFormaTile(t('lab.load.title'), d.load ? (loadStatusPl[d.load.status] || '—') : '—', d.load ? (loadCol[d.load.status] || '#8A8A8A') : '#C8C2B8', t('lab.sub.thisweek')) +
                _labFormaTile(t('metric.sleep'), sleepT != null ? (sleepT > 0 ? '▲ +' + sleepT : sleepT < 0 ? '▼ ' + sleepT : '= 0') : '—',
                    sleepT != null ? (sleepT >= 0 ? '#6B8F71' : '#C07264') : '#C8C2B8', t('lab.sub.vslastweek'));

            // User odrzucił pojedynczy pierścień — chce widzieć TREND w czasie ("czy
            // idzie w górę"). Wymóg ≥3 ważnych punktów (spośród 8 tyg. historii + dziś)
            // zanim w ogóle pokażemy wykres — inaczej fallback do pierścienia, żeby nie
            // pokazywać pewnie wyglądającej linii z 1-2 prawdziwych punktów.
            const points = _labFormaChartPoints(d.formaHistory, d);
            const validCount = points.filter(p => p.y != null).length;
            let bodyHtml;
            if (validCount >= 3) {
                const chart = _labTrendSVG(points, {
                    invert: true, color: '#1A1A1A', lineId: 'lab-forma-line', tipId: 'lab-forma',
                    dotColorFor: v => v >= 70 ? '#6B8F71' : (v >= 45 ? '#C4A35A' : '#C07264')
                });
                const firstValid = points.find(p => p.y != null);
                const delta = (firstValid && firstValid.y !== score) ? score - firstValid.y : null;
                const deltaPill = delta != null
                    ? _labPill((delta >= 0 ? '▲ +' : '▼ ') + Math.abs(delta), delta >= 0 ? '#6B8F71' : '#C07264')
                    : '';
                bodyHtml =
                    '<div style="display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;">' +
                        '<span id="lab-forma-num" style="font-family:Outfit,sans-serif;font-size:38px;font-weight:800;color:' + col + ';font-variant-numeric:tabular-nums;line-height:1;">0</span>' +
                        _labPill(verdict, col) + deltaPill +
                    '</div>' +
                    '<div style="font-size:12px;color:#8A8A8A;margin:8px 0 4px;">' + t('lab.chart.hint') + '</div>' +
                    (chart ? chart.html : '') +
                    '<div style="display:flex;justify-content:space-between;font-size:11px;color:#B0A89E;margin-top:4px;"><span>' + t('lab.chart.from') + '</span><span>' + t('lab.chart.today') + '</span></div>';
            } else {
                bodyHtml = _labRing(score, col, 'lab-ring-forma') +
                    '<div style="margin-top:10px;">' + _labPill(verdict, col) + '</div>' +
                    '<div style="font-size:11.5px;color:#B0A89E;margin-top:10px;">' + t('lab.chart.soon') + '</div>';
            }

            return header +
                '<div class="lab-card" style="background:#fff;border:1px solid #EBEBEB;border-radius:20px;padding:24px 20px 20px;text-align:center;position:relative;">' +
                    bodyHtml +
                    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:20px;">' + tiles + '</div>' +
                '</div></div>';
        }

        // Surowe sygnały z backendu (formaHistory) → punkty wykresu, licząc KAŻDY
        // tydzień przez _labFormaScore() — te same wagi co "dziś", jedno miejsce,
        // bez ryzyka że backend i frontend policzą Formę inaczej. Tydzień bez
        // wystarczających sygnałów → _labFormaScore zwraca null → przerwa w linii.
        // label/sub zasilają tooltip po dotknięciu punktu (_labTrendSVG + showStatsTip).
        function _labFormaChartPoints(history, d) {
            const hist = history || [];
            const pts = hist.map((h, i) => {
                const y = _labFormaScore({
                    trends: { paceDeltaSec: h.paceDeltaSec, hrDelta: h.hrDelta },
                    load: h.acwr != null ? { acwr: h.acwr } : null,
                    sleep: h.sleepTrend != null ? { trend: h.sleepTrend } : null,
                    readiness: h.readiness != null ? { score: h.readiness } : null
                });
                const weeksAgo = hist.length - i;
                return { y, label: weeksAgo === 1 ? t('lab.weekago1') : t('lab.weeksago').replace('{n}', weeksAgo), sub: y != null ? y + ' ' + t('lab.pts') : t('lab.nodata.short') };
            });
            const today = _labFormaScore(d);
            pts.push({ y: today, label: t('lab.today'), sub: today != null ? today + ' ' + t('lab.pts') : '' });
            return pts;
        }

        // Przewidywany czas wyścigu — druga nowa sekcja, pod Formą. Zakotwiczenie
        // (anchor) to najlepszy niedawny wysiłek strukturalny (interwały/tempo z
        // realnym tempem odcinka) albo, jako fallback niższej pewności, bieg z
        // zegarka — formuła Riegela (backend, lib/racePrediction.js) ekstrapoluje z
        // tego na dystans celu z onboardingu. Brak anchora = pusta sekcja/empty-state,
        // NIGDY ekstrapolacja z samych easy runów (ta sama lekcja co ACWR=4.0).
        // Podpis "na podstawie" jest nieopcjonalny — user explicite odrzucił czarną
        // skrzynkę przy "Analizie AI" (runda 4); tu grounding jest jawny i krótki.
        function _labRacePredictionCard(rp) {
            if (!rp) return ''; // brak celu wyścigu z onboardingu — sekcja się nie pokazuje

            const header = '<div style="margin-top:20px;">' +
                '<div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:2px;">' +
                    '<div style="font-family:Outfit,sans-serif;font-size:18px;font-weight:800;color:#1A1A1A;letter-spacing:-0.01em;">' + t('lab.race.title') + '</div>' +
                    '<div style="font-size:10px;font-weight:700;color:#8A8A8A;text-transform:uppercase;letter-spacing:0.1em;">' + (rp.goalLabel || '') + '</div>' +
                '</div>' +
                '<div style="font-size:12px;color:#8A8A8A;margin-bottom:10px;line-height:1.4;">' + t('lab.race.sub') + '</div>';

            if (!rp.current) {
                return header +
                    '<div class="lab-card" style="background:#fff;border:1px solid #EBEBEB;border-radius:20px;padding:28px 20px;text-align:center;">' +
                        '<div style="font-size:14px;font-weight:600;color:#1A1A1A;margin-bottom:4px;">' + t('lab.race.nodata.title') + '</div>' +
                        '<div style="font-size:13px;color:#8A8A8A;line-height:1.5;">' + t('lab.race.nodata.desc') + '</div>' +
                    '</div></div>';
            }

            const histArr = rp.history || [];
            const points = histArr.map((h, i) => {
                const weeksAgo = histArr.length - i;
                return {
                    y: h.predictedSec,
                    label: weeksAgo === 1 ? t('lab.weekago1') : t('lab.weeksago').replace('{n}', weeksAgo),
                    sub: h.predictedSec != null ? _labFmtRaceTime(h.predictedSec) + (h.basedOn ? ' · ' + h.basedOn.type : '') : t('lab.nodata.short')
                };
            });
            points.push({
                y: rp.current.predictedSec, label: t('lab.today'),
                sub: _labFmtRaceTime(rp.current.predictedSec) + (rp.current.basedOn ? ' · ' + rp.current.basedOn.type : '')
            });
            const validCount = points.filter(p => p.y != null).length;

            let bodyHtml =
                '<div id="lab-race-num" style="font-family:Outfit,sans-serif;font-size:38px;font-weight:800;color:#1A1A1A;font-variant-numeric:tabular-nums;line-height:1;">' + _labFmtRaceTime(0) + '</div>' +
                '<div style="margin-top:10px;">' + _labPill(t('lab.race.basedon') + ' ' + _labBasedOnText(rp.current.basedOn), '#8A8A8A') + '</div>';

            if (validCount >= 3) {
                const goalSec = rp.goalTimeSec;
                const refLine = goalSec != null ? { value: goalSec, label: t('lab.race.goal') + ' ' + _labFmtRaceTime(goalSec) } : undefined;
                const chart = _labTrendSVG(points, {
                    invert: false, color: '#1A1A1A', lineId: 'lab-race-line', tipId: 'lab-race', refLine,
                    yFmt: _labFmtRaceTime,
                    dotColorFor: goalSec != null ? (v => v <= goalSec ? '#6B8F71' : (v <= goalSec * 1.05 ? '#C4A35A' : '#C07264')) : undefined
                });
                if (chart) {
                    bodyHtml += '<div style="font-size:12px;color:#8A8A8A;margin:10px 0 2px;">' + t('lab.chart.hint') + '</div>' +
                        chart.html +
                        '<div style="display:flex;justify-content:space-between;font-size:11px;color:#B0A89E;margin-top:4px;"><span>' + t('lab.chart.from') + '</span><span>' + t('lab.chart.today') + '</span></div>';
                }
            }

            return header +
                '<div class="lab-card" style="background:#fff;border:1px solid #EBEBEB;border-radius:20px;padding:24px 20px 20px;text-align:center;position:relative;">' +
                    bodyHtml +
                '</div></div>';
        }

        function _labBasedOnText(basedOn) {
            if (!basedOn) return '';
            const dateTxt = basedOn.date ? new Date(basedOn.date + 'T00:00:00').toLocaleDateString(_appLang, { day: 'numeric', month: 'numeric' }) : '';
            const confNote = basedOn.confidence === 'low' ? t('lab.basedon.lowconf') : '';
            return basedOn.type + ' ' + basedOn.distanceKm + 'km' + (dateTxt ? ', ' + dateTxt : '') + confNote;
        }

        let _labLoadGen = 0;
        async function loadLab() {
            const el = document.getElementById('lab-content');
            if (!el || !currentUserId) return;
            const gen = ++_labLoadGen; // strażnik: starsze odpowiedzi nie nadpisują nowszych
            try {
                const d = await apiFetch('/api/lab/' + currentUserId);
                if (gen !== _labLoadGen) return;

                // ── Gotowość + Sleep Score: pierścienie 0-100 ──
                const ringCards = [];

                if (d.readiness) {
                    const r = d.readiness.score;
                    const col = r >= 70 ? '#6B8F71' : (r >= 45 ? '#C4A35A' : '#C07264');
                    const lbl = r >= 70 ? t('lab.ready.good') : (r >= 45 ? t('lab.ready.mid') : t('lab.ready.low'));
                    ringCards.push(_labRingCard(t('lab.ready.title'), r, lbl, col, 'lab-ring-readiness'));
                } else {
                    ringCards.push(_labRingCard(t('lab.ready.title'), null, t('lab.ready.nocheckin'), null, 'lab-ring-readiness'));
                }

                if (d.sleep && d.sleep.score != null) {
                    const s = d.sleep.score, slTrend = d.sleep.trend;
                    const col = s >= 70 ? '#6B8F71' : (s >= 45 ? '#C4A35A' : '#C07264');
                    const sub = slTrend == null ? t('lab.sleep.last7')
                        : (slTrend > 0 ? '▲ +' + slTrend + ' ' + t('lab.sub.vslastweek') : (slTrend < 0 ? '▼ ' + slTrend + ' ' + t('lab.sub.vslastweek') : t('lab.sleep.same')));
                    ringCards.push(_labRingCard('velm Sleep Score', s, sub, col, 'lab-ring-sleep'));
                } else {
                    ringCards.push(_labRingCard('velm Sleep Score', null, t('lab.sleep.nodata'), null, 'lab-ring-sleep'));
                }

                // ── Obciążenie: skala na pełną szerokość ──
                const loadHtml = _labLoadGauge(d.load);

                // ── Forma: wykres trendu (fallback: pierścień) + 4 kafelki wspierające ──
                const formaHtml = _labFormaCard(d);

                // ── Przewidywany czas wyścigu: wykres trendu pod Formą ──
                const raceHtml = _labRacePredictionCard(d.racePrediction);

                el.innerHTML =
                    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' + ringCards.join('') + '</div>' + loadHtml + formaHtml + raceHtml;

                // Wypełnienie pierścieni i wjazd wskaźnika na skali — osobno od
                // fade-in kart poniżej, żeby liczby/kreska ożywały PO tym jak karta
                // jest już widoczna, a nie w tej samej klatce
                setTimeout(() => {
                    if (gen !== _labLoadGen) return;
                    if (d.readiness) _labAnimateRing('lab-ring-readiness', d.readiness.score);
                    if (d.sleep && d.sleep.score != null) _labAnimateRing('lab-ring-sleep', d.sleep.score);
                    _labAnimateGauge(d.load);

                    const formaPoints = _labFormaChartPoints(d.formaHistory, d);
                    const formaScore = _labFormaScore(d);
                    if (formaPoints.filter(p => p.y != null).length >= 3) {
                        _labAnimateTrendChart('lab-forma-line', 'lab-forma-num', formaScore);
                    } else if (formaScore != null) {
                        _labAnimateRing('lab-ring-forma', formaScore);
                    }

                    if (d.racePrediction && d.racePrediction.current) {
                        const rpPoints = (d.racePrediction.history || []).map(h => ({ y: h.predictedSec }));
                        rpPoints.push({ y: d.racePrediction.current.predictedSec });
                        if (rpPoints.filter(p => p.y != null).length >= 3) {
                            _labAnimateTrendChart('lab-race-line', 'lab-race-num', d.racePrediction.current.predictedSec, _labFmtRaceTime);
                        } else {
                            const numEl = document.getElementById('lab-race-num');
                            if (numEl) numEl.textContent = _labFmtRaceTime(d.racePrediction.current.predictedSec);
                        }
                    }
                }, 200);

                // Wejście kart: fade + rise, stagger 50ms
                el.querySelectorAll('.lab-card').forEach((c, i) => {
                    c.style.opacity = '0';
                    c.style.transform = 'translate3d(0,8px,0)';
                    c.style.transition = 'opacity 350ms cubic-bezier(0.23,1,0.32,1) ' + (i * 50) + 'ms, transform 350ms cubic-bezier(0.23,1,0.32,1) ' + (i * 50) + 'ms';
                    requestAnimationFrame(() => requestAnimationFrame(() => {
                        c.style.opacity = '1';
                        c.style.transform = 'translate3d(0,0,0)';
                    }));
                });
            } catch (e) {
                if (gen !== _labLoadGen) return;
                el.innerHTML = '<div style="background:#fff;border:1px solid #EBEBEB;border-radius:20px;padding:20px;text-align:center;">' +
                    '<div style="font-size:14px;font-weight:600;color:#1A1A1A;margin-bottom:4px;">' + t('lab.err.title') + '</div>' +
                    '<div style="font-size:13px;color:#8A8A8A;margin-bottom:12px;">' + t('lab.err.desc') + '</div>' +
                    '<button onclick="loadLab()" style="padding:10px 20px;min-height:44px;background:transparent;border:1px solid #1A1A1A;border-radius:12px;font-size:14px;font-weight:600;color:#1A1A1A;cursor:pointer;font-family:Inter,sans-serif;touch-action:manipulation;">' + t('lab.err.retry') + '</button></div>';
                console.error('loadLab błąd:', e.message);
            }
        }

