        // ── HISTORIA TRENINGÓW ──────────────────────────────────
        let historyWorkouts = [];
        let historyPage = 0;
        const HISTORY_PAGE_SIZE = 10;

        async function loadHistoryView() {
            if (!currentUserId) return;
            const container = document.getElementById('history-list');
            if (!container) return;
            container.innerHTML = '<div style="text-align:center;padding:40px;color:#8A8A8A;">Ładowanie…</div>';
            try {
                const res = await fetch(`${API_BASE}/api/workouts/${currentUserId}?days=90`, { headers: authHeaders() });
                const data = await res.json();
                historyWorkouts = data.workouts ?? [];
                historyPage = 0;
                renderHistoryPage();
            } catch(e) {
                container.innerHTML = '<div style="text-align:center;padding:40px;color:#8A8A8A;">Błąd ładowania</div>';
            }
        }

        function renderHistoryPage() {
            const container = document.getElementById('history-list');
            if (!container) return;
            const start = historyPage * HISTORY_PAGE_SIZE;
            const page = historyWorkouts.slice(start, start + HISTORY_PAGE_SIZE);

            const fitBtnHtml = '<div style="display:flex;justify-content:flex-end;margin-bottom:12px;"><button onclick="document.getElementById(\'fit-file-input\').click()" style="padding:8px 14px;background:transparent;border:1.5px solid #EBEBEB;border-radius:10px;font-size:12px;font-weight:600;font-family:Inter,sans-serif;color:#1A1A1A;cursor:pointer;">+ Wgraj .fit</button></div>';

            if (historyWorkouts.length === 0) {
                container.innerHTML = fitBtnHtml + `
                    <div style="text-align:center;padding:60px 20px;color:#8A8A8A;">
                        <div style="font-size:40px;margin-bottom:12px;">🏃</div>
                        <div style="font-size:15px;font-weight:600;">Brak zarejestrowanych treningów</div>
                        <div style="font-size:13px;margin-top:8px;">Użyj check-inu po treningu lub wgraj plik .fit</div>
                    </div>`;
                return;
            }

            const totalKm = historyWorkouts.reduce((s, w) => s + (parseFloat(w.distance_km) || 0), 0);
            const totalCount = historyWorkouts.length;

            container.innerHTML = fitBtnHtml + `
                <div style="display:flex;gap:12px;margin-bottom:20px;">
                    <div style="flex:1;background:#fff;border:1.5px solid #EBEBEB;border-radius:16px;padding:16px;text-align:center;">
                        <div style="font-size:24px;font-weight:800;color:#1A1A1A;">${totalCount}</div>
                        <div style="font-size:11px;color:#8A8A8A;text-transform:uppercase;letter-spacing:0.06em;margin-top:4px;">Treningów</div>
                    </div>
                    <div style="flex:1;background:#fff;border:1.5px solid #EBEBEB;border-radius:16px;padding:16px;text-align:center;">
                        <div style="font-size:24px;font-weight:800;color:#1A1A1A;">${Math.round(totalKm)}</div>
                        <div style="font-size:11px;color:#8A8A8A;text-transform:uppercase;letter-spacing:0.06em;margin-top:4px;">km łącznie</div>
                    </div>
                </div>
                ${page.map(w => renderWorkoutCard(w)).join('')}
                ${historyWorkouts.length > HISTORY_PAGE_SIZE ? renderPagination(start) : ''}`;
        }

        function renderWorkoutCard(w) {
            const type = w.type || w.typ || 'easy';
            const color = TYPE_COLORS[type] || '#8A8A8A';
            const label = TYPE_LABEL(type) || type;
            const date = w.date || (w.logged_at ? w.logged_at.split('T')[0] : '—');
            const dateFormatted = date !== '—'
                ? new Date(date + 'T12:00:00').toLocaleDateString(_appLang, { weekday:'short', day:'numeric', month:'short' })
                : '—';

            // Main stats (right column)
            let distHtml = w.distance_km ? '<div style="font-size:15px;font-weight:800;color:#1A1A1A;">' + w.distance_km + ' km</div>' : '';
            let durHtml  = w.duration_min ? '<div style="font-size:12px;color:#8A8A8A;">' + w.duration_min + ' min</div>' : '';
            let rpeHtml  = w.rpe ? '<div style="font-size:11px;color:#8A8A8A;">RPE ' + w.rpe + '/10</div>' : '';

            // Extra detail row (below title)
            const extras = [];
            if (type === 'interval') {
                if (w.completed_repeats != null && w.planned_repeats != null)
                    extras.push(w.completed_repeats + '/' + w.planned_repeats + ' pow.');
                else if (w.completed_repeats != null)
                    extras.push(w.completed_repeats + ' pow.');
                if (w.interval_avg_pace) extras.push(w.interval_avg_pace + '/km');
            } else if (type === 'tempo') {
                if (w.working_pace) extras.push('odcinek: ' + w.working_pace + '/km');
                else if (w.avg_pace) extras.push(w.avg_pace + '/km');
            } else {
                if (w.avg_pace) extras.push(w.avg_pace + '/km');
            }
            if (w.avg_hr) extras.push(w.avg_hr + ' bpm');
            const extraHtml = extras.length
                ? '<div style="font-size:11px;color:#8A8A8A;margin-top:3px;">' + extras.join(' · ') + '</div>'
                : '';

            return '<div style="background:#fff;border:1.5px solid #EBEBEB;border-radius:16px;padding:16px;margin-bottom:10px;display:flex;align-items:center;gap:14px;">'
                + '<div style="width:10px;height:10px;border-radius:50%;background:' + color + ';flex-shrink:0;margin-top:2px;"></div>'
                + '<div style="flex:1;min-width:0;">'
                + '<div style="font-size:14px;font-weight:700;color:#1A1A1A;">' + label + '</div>'
                + '<div style="font-size:12px;color:#8A8A8A;margin-top:2px;">' + dateFormatted + '</div>'
                + extraHtml
                + '</div>'
                + '<div style="text-align:right;flex-shrink:0;">' + distHtml + durHtml + rpeHtml + '</div>'
                + '</div>';
        }

        function renderPagination(start) {
            const newerColor = historyPage === 0 ? '#C4C4C4' : '#1A1A1A';
            const newerDisabled = historyPage === 0 ? 'disabled' : '';
            const olderColor = start + HISTORY_PAGE_SIZE >= historyWorkouts.length ? '#C4C4C4' : '#1A1A1A';
            const olderDisabled = start + HISTORY_PAGE_SIZE >= historyWorkouts.length ? 'disabled' : '';
            const rangeText = (start + 1) + '–' + Math.min(start + HISTORY_PAGE_SIZE, historyWorkouts.length) + ' z ' + historyWorkouts.length;
            return '<div style="display:flex;justify-content:center;gap:12px;margin-top:8px;margin-bottom:20px;">'
                + '<button onclick="historyPrev()" style="padding:10px 20px;border:1.5px solid #EBEBEB;border-radius:12px;background:white;font-size:13px;font-weight:600;cursor:pointer;color:' + newerColor + ';" ' + newerDisabled + '>\u2190 Nowsze</button>'
                + '<span style="display:flex;align-items:center;font-size:12px;color:#8A8A8A;">' + rangeText + '</span>'
                + '<button onclick="historyNext()" style="padding:10px 20px;border:1.5px solid #EBEBEB;border-radius:12px;background:white;font-size:13px;font-weight:600;cursor:pointer;color:' + olderColor + ';" ' + olderDisabled + '>Starsze \u2192</button>'
                + '</div>';
        }

        function historyNext() {
            if ((historyPage + 1) * HISTORY_PAGE_SIZE < historyWorkouts.length) {
                historyPage++;
                renderHistoryPage();
                document.getElementById('view-history')?.scrollTo(0, 0);
            }
        }

        function historyPrev() {
            if (historyPage > 0) {
                historyPage--;
                renderHistoryPage();
                document.getElementById('view-history')?.scrollTo(0, 0);
            }
        }

