        // ── STATS VIEW ───────────────────────────────────────────────────────────
        let statsRange = 'week';
        let statsData  = null;
        let _statsTipTimer = null;
        let statsMetric = 'km';
        let _statsCurrentDays = null;

        function animateNumber(el, from, to, duration, suffix) {
            duration = duration || 800; suffix = suffix || '';
            const start = performance.now();
            const ease  = t => 1 - Math.pow(1 - t, 3);
            (function tick(now) {
                const t = Math.min((now - start) / duration, 1);
                const v = from + (to - from) * ease(t);
                el.textContent = (Number.isInteger(to) ? Math.round(v) : v.toFixed(1)) + suffix;
                if (t < 1) requestAnimationFrame(tick);
            })(performance.now());
        }

        function _parseAvgPace(s) {
            if (!s) return null;
            const vals = s.split('-').map(p => {
                const c = p.trim().split('/')[0].trim();
                const [m, sec] = c.split(':').map(Number);
                return (isNaN(m) || isNaN(sec)) ? null : m * 60 + sec;
            }).filter(Boolean);
            return vals.length ? Math.round(vals.reduce((a, b) => a + b) / vals.length) : null;
        }

        function _p2t(sec) {
            return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
        }

        function _crSmooth(pts) {
            const v = pts.filter(Boolean);
            if (v.length < 2) return '';
            let d = `M${v[0][0].toFixed(1)},${v[0][1].toFixed(1)}`;
            const t = 0.28;
            for (let i = 0; i < v.length - 1; i++) {
                const a = v[Math.max(0,i-1)], b = v[i], c = v[i+1], e = v[Math.min(v.length-1,i+2)];
                d += ` C${(b[0]+(c[0]-a[0])*t).toFixed(1)},${(b[1]+(c[1]-a[1])*t).toFixed(1)} ${(c[0]-(e[0]-b[0])*t).toFixed(1)},${(c[1]-(e[1]-b[1])*t).toFixed(1)} ${c[0].toFixed(1)},${c[1].toFixed(1)}`;
            }
            return d;
        }

        function updateStatsToggle() {
            const wrap = document.getElementById('stats-toggle-wrap');
            const slider = document.getElementById('stats-toggle-slider');
            const bW = document.getElementById('stats-btn-week');
            const bM = document.getElementById('stats-btn-month');
            const isW = statsRange === 'week';
            if (bW) { bW.style.color = isW ? 'var(--primary-color)' : '#888'; bW.style.fontWeight = isW ? '700' : '500'; }
            if (bM) { bM.style.color = !isW ? 'var(--primary-color)' : '#888'; bM.style.fontWeight = !isW ? '700' : '500'; }
            if (!wrap || !slider) return;
            const hw = (wrap.offsetWidth - 6) / 2;
            slider.style.width = hw + 'px';
            slider.style.left  = (3 + (isW ? 0 : hw)) + 'px';
        }

        function switchStatsRange(range) {
            statsRange = range;
            updateStatsToggle();
            renderStats();
        }

        // ── LABORATORIUM — wskaźniki + widoczna analiza AI ───────
        // Pierścień 0-100, ten sam wzorzec co karta "Sen" na Dom (SVG stroke-dasharray,
        // transform="rotate(-90 cx cy)" jako atrybut SVG a NIE css transform — css
        // transform-origin na inline SVG bywa różny między silnikami przeglądarek).
        // Pierścień renderuje się PUSTY (offset = pełny obwód, liczba "0") — realną
        // wartość dokłada _labAnimateRing() po wstawieniu do DOM, żeby wypełnienie
        // faktycznie się animowało (statyczny SVG od razu z gotowym offsetem nie ma
        // czego animować, bo przeglądarka nigdy nie widzi stanu "przed").
