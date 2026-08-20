        async function saveGoalSettings() {
            const userId = localStorage.getItem('velm_user_id');
            if (!userId) return;

            const raceDate = document.getElementById('settings-edit-race-date')?.value;
            const timeGoal = document.getElementById('settings-edit-time-goal')?.value;
            const weeklyKm = document.getElementById('settings-edit-weekly-km')?.value;

            const updates = {};

            if (raceDate) {
                updates.time_race_date = raceDate;
                updates.dist_goal_date = raceDate;
                updates.time_race_target = raceDate;
            }

            if (timeGoal) {
                const parts = timeGoal.split(':').map(Number);
                if (parts.length === 2) {
                    updates.time_target_mins = parts[0];
                    updates.time_target_secs = parts[1];
                } else if (parts.length === 3) {
                    updates.time_target_hours = parts[0];
                    updates.time_target_mins = parts[1];
                    updates.time_target_secs = parts[2];
                }
            }

            if (weeklyKm) {
                updates.weekly_km = parseInt(weeklyKm);
                updates.current_weekly_km = parseInt(weeklyKm);
            }

            if (Object.keys(updates).length === 0) return;

            try {
                const res = await authFetch(`${API_BASE}/api/user/${userId}/goal`, {
                    method: 'PUT',
                    headers: authHeaders(),
                    body: JSON.stringify(updates)
                });
                const data = await res.json();
                if (data.success) {
                    const msg = document.getElementById('settings-save-msg');
                    if (msg) { msg.style.display = 'block'; setTimeout(() => msg.style.display = 'none', 4000); }
                    loadUserProfile();
                    updateRaceCountdown();
                }
            } catch(e) {
                console.error('saveGoalSettings błąd:', e);
            }
        }

        // --- Memory System ---
        async function loadUserMemory() {
            const list = document.getElementById('memory-list') || document.getElementById('memory-content') || document.getElementById('coach-memory') || null;
            if (!list) return;
            try {
                const response = await authFetch(`${API_BASE}/api/memory/get?userId=${currentUserId}`, { headers: authHeaders() });
                const data = await response.json();

                const AGENT_DISPLAY = { analityk: t('agent.analityk.name'), fizjo: t('agent.fizjo.name'), psycholog: t('agent.psycholog.name'), szef_sztabu: t('agent.szef_sztabu.name') };
                const entries = Object.entries(data.memory || {})
                    .filter(([, notes]) => notes && notes.trim().length > 0)
                    .map(([agent, notes]) => {
                        const label = AGENT_DISPLAY[agent] || agent;
                        const preview = notes.length > 200 ? notes.slice(0, 200) + '...' : notes;
                        return `<div style="padding: 4px 0; border-bottom: 1px solid var(--border-color); display: flex; gap: 6px;">
                            <span style="font-weight: 600; color: #8A8A8A; text-transform: uppercase; font-size: 9px; padding-top: 2px;">${label}</span>
                            <span>${preview}</span>
                        </div>`;
                    });
                if (entries.length > 0) {
                    list.innerHTML = entries.join('');
                } else {
                    list.innerHTML = '<div style="padding: 4px 0; font-style: italic; opacity: 0.6;">' + t('chat.nofacts') + '</div>';
                }
            } catch (e) {
                console.error("Failed to load memory", e);
            }
        }

        // --- Chat Logic ---
        function handleEnterTA(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        }

        function autoResizeInput(el) {
            el.style.height = 'auto';
            el.style.height = Math.min(el.scrollHeight, 130) + 'px';
            el.style.overflowY = el.scrollHeight > 130 ? 'auto' : 'hidden';
        }

        async function sendMessage() {
            const input = document.getElementById('chat-input');
            const text = input.value.trim();
            if (!text) return;

            // 1. Add User Message (display always shows raw text)
            addMessage('user', text);
            input.value = '';
            input.style.height = 'auto';
            input.style.overflowY = 'hidden';
            updateSendBtn();

            // Enrich message for AI with deep-link context (invisible to user)
            let messageForAI = text;
            if (window.chatContext) {
                const ctxBlock = _buildContextBlockForAI(window.chatContext);
                if (ctxBlock) messageForAI = `${ctxBlock}\n\n${text}`;
                window.chatContext = null;
                const banner = document.querySelector('.context-banner');
                if (banner) banner.remove();
            }

            // 2. Hide suggestions & Welcome Card
            const suggestions = document.getElementById('coach-suggestions');
            if (suggestions) suggestions.style.display = 'none';

            // 3. Show Loading
            const loadingId = addLoadingIndicator(text, selectedAgent);
            scrollToBottom();

            try {
                // 3. Call API
                const response = await authFetch(`${API_BASE}/api/chat`, {
                    method: 'POST',
                    headers: authHeaders(),
                    body: JSON.stringify({
                        userId: currentUserId,
                        message: messageForAI,
                        agent: selectedAgent,
                        conversationId: currentConversationId,
                        clientTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                    })
                });
                let data;
                try { data = await response.json(); }
                catch (parseErr) { data = {}; }

                // 4. Remove loading
                removeMessage(loadingId);

                // Premium paywall
                if (response.status === 403 && data.error === 'premium_required') {
                    showPaywall(data.message || t('chat.premium'));
                    return;
                }

                // Trial wyczerpany — paywall z opcją ankiety (bez wywołania AI po stronie serwera)
                if (response.status === 402) {
                    currentTrialMessagesLeft = 0;
                    updateTrialCounter();
                    showPaywall(data.message || t('chat.trialout'), { surveyAvailable: data.surveyAvailable });
                    return;
                }

                // Auth expired — trigger relogin
                if (response.status === 401) {
                    addMessage('ai', t('chat.session'));
                    return;
                }

                if (!response.ok) {
                    addMessage('ai', data.error || `${t('err.server')} (${response.status})`);
                    return;
                }

                // 5. Add AI Message
                addMessage('ai', data.reply || data.error || t('chat.replyerr'));

                // Zaktualizuj licznik trialu (null = premium, bez limitu)
                if (data.trialMessagesLeft !== null && data.trialMessagesLeft !== undefined) {
                    currentTrialMessagesLeft = data.trialMessagesLeft;
                    updateTrialCounter();
                }

                // 5b. Save conversationId — backend creates new convo if missing
                if (data.conversationId && data.conversationId !== currentConversationId) {
                    currentConversationId = data.conversationId;
                    localStorage.setItem(`velm_active_conv_${selectedAgent}`, data.conversationId);
                    // Refresh title from first user message (truncate 60)
                    const titleText = text.length > 60 ? text.slice(0, 57).trim() + '…' : text;
                    _setCurrentConvTitle(titleText);
                    // Invalidate cache to refresh next time drawer opens
                    delete _conversationsCache[selectedAgent];
                }

                // 6. Refresh memory in background
                setTimeout(loadUserMemory, 2000);

            } catch (e) {
                removeMessage(loadingId);
                addMessage('ai', t('chat.connerr'));
                console.error(e);
            }
            scrollToBottom();
        }

        // ── FORMATOWANIE ODPOWIEDZI AGENTA ────────────────────────────────────
        //
        // PO CO: odpowiedź szła przez textContent, więc lądowała jako JEDEN blok
        // surowego tekstu. Agent pisze 4-6 zdań gęstych od liczb — tempa 5:30-5:40,
        // dystanse, RPE, strefy Z2 — czyli dokładnie to, czego biegacz szuka wzrokiem,
        // a co ginęło w ścianie tekstu.
        //
        // NIE PARSUJEMY MARKDOWNU. Agenci mają go ZAKAZANEGO (reguła z CLAUDE.md),
        // a pomiar to potwierdził: 0 z 191 odpowiedzi w czacie zawierało markdown.
        // Parser byłby więc martwym kodem czekającym, żeby źle zinterpretować
        // gwiazdkę w zwykłym zdaniu.
        //
        // BEZPIECZEŃSTWO: najpierw sanitizeHTML na CAŁOŚCI, dopiero potem wstawiamy
        // własne znaczniki. Odwrotna kolejność oznaczałaby, że treść od modelu trafia
        // do innerHTML przed ucieczką znaków.
        const _WZORCE_LICZB = [
            // Tempo: 5:30 albo zakres 5:30-5:40, opcjonalnie z /km
            /\b\d{1,2}:\d{2}(?:\s*[-–]\s*\d{1,2}:\d{2})?(?:\s*\/\s*km|\s*min\/km)?\b/g,
            // Dystans: 12 km, 8,5 km, 800 m
            /\b\d+(?:[.,]\d+)?\s*(?:km|m)\b/g,
            // RPE i strefy tętna
            /\bRPE\s*\d{1,2}(?:\s*\/\s*10)?\b/gi,
            /\bZ[1-5]\b/g,
            // Tętno. Jedna cyfra też — „tętno spadło o 5 bpm" to najczęstsze zdanie
            // o adaptacji, jakie agent pisze, a przy \d{2,3} wypadało z wyróżnienia.
            /\b\d{1,3}\s*(?:bpm|ud\/min)\b/gi
        ];

        function _formatAgentText(text) {
            const bezpieczny = sanitizeHTML(String(text || '').trim());
            if (!bezpieczny) return '';

            // Akapity: pusta linia albo pojedyncze złamanie od modelu. Gdy model nie
            // złamał nic, zostaje jeden akapit — i to jest w porządku, bo 4-6 zdań
            // bez podziału dalej czyta się dobrze.
            const akapity = bezpieczny.split(/\n\s*\n|\n/).map(a => a.trim()).filter(Boolean);

            return akapity.map((ak, i) => {
                let tresc = ak;
                for (const wz of _WZORCE_LICZB) {
                    tresc = tresc.replace(wz, (m) => '<b class="liczba">' + m + '</b>');
                }
                // Opóźnienie rośnie z indeksem, ale ma SUFIT — przy dłuższej odpowiedzi
                // ostatni akapit nie może kazać czekać pół sekundy.
                const op = Math.min(i * 60, 240);
                return '<span class="ak" style="animation-delay:' + op + 'ms">' + tresc + '</span>';
            }).join('');
        }

        function addMessage(role, text) {
            const container = document.getElementById('coach-messages');
            // Hide quick suggestions on first message
            const quick = document.getElementById('coach-quick-suggestions');
            if (quick) quick.style.display = 'none';
            const intro = document.getElementById('coach-intro');
            if (intro) intro.style.display = 'none';

            const div = document.createElement('div');
            div.className = role === 'user' ? 'msg msg-user' : 'msg msg-ai';
            if (role === 'user') {
                // Wiadomość użytkownika zostaje na textContent — jego własny tekst nie
                // wymaga wyróżniania liczb, a to najprostsza droga do bezpieczeństwa.
                div.textContent = text;
            } else {
                div.innerHTML = _formatAgentText(text);
            }
            container.appendChild(div);
            return div;
        }

        let _chatHistoryLoaded = {};
        let _settingsSelectedDays = [];
        let _settingsLang = 'pl';
        let _settingsUnit = 'km';
        // Baza trzyma selectedDays jako angielskie NAZWY dni (["Monday",...]) — onboarding
        // (index.html WDAYS) i plan-gen tak zapisują. UI ustawień działa na indeksach 0-6
        // (0=Pn). Konwertujemy w obie strony, inaczej dni się nie zaznaczają ani nie zapisują.
        const _WEEK_DAYS_EN = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
        function _daysToIdx(arr){ return (Array.isArray(arr)?arr:[]).map(d => typeof d === 'number' ? d : _WEEK_DAYS_EN.indexOf(d)).filter(i => i >= 0 && i <= 6); }
        function _idxToDays(arr){ return (Array.isArray(arr)?arr:[]).map(i => _WEEK_DAYS_EN[i]).filter(Boolean); }
        function enterCoachWithContext(ctx) {
            window.chatContext = ctx;
            switchView('coach');
            setTimeout(() => {
                const container = document.getElementById('coach-messages');
                if (!container) return;
                const intro = document.getElementById('coach-intro');
                if (intro) intro.style.display = 'none';
                const quick = document.getElementById('coach-quick-suggestions');
                if (quick) quick.style.display = 'none';

                // Remove existing banner if any
                const existing = container.querySelector('.context-banner');
                if (existing) existing.remove();

                const div = document.createElement('div');
                div.className = 'context-banner';

                let label = '';
                if (ctx.source === 'calendar_day') {
                    const d = new Date(ctx.date + 'T12:00:00');
                    const dayName = d.toLocaleDateString(_appLang, { weekday: 'long' });
                    const dateShort = d.toLocaleDateString(_appLang, { day: 'numeric', month: 'long' });
                    label = `${t('chat.ctx.day')} ${dayName}, ${dateShort}${ctx.trainingRef ? ` (${ctx.trainingRef})` : ''}`;
                } else if (ctx.source === 'home_today') {
                    label = t('chat.ctx.today');
                } else if (ctx.source === 'home_week') {
                    label = t('chat.ctx.week');
                }

                div.innerHTML = `<span class="context-icon">\u2192</span><span class="context-label">${label}</span>`;
                container.insertBefore(div, container.firstChild);
            }, 100);
        }

        function _buildContextBlockForAI(ctx) {
            if (ctx.source === 'calendar_day') {
                return `[KONTEKST DEEP-LINK: Użytkownik otworzył chat z widoku kalendarza. Pyta o konkretny dzień: ${ctx.date}.${ctx.trainingRef ? ' Trening w tym dniu: ' + ctx.trainingRef + '.' : ''} Jeśli pytanie jest ogólne ("co mam?"), odpowiedz w kontekście tego dnia.]`;
            }
            if (ctx.source === 'home_today') {
                const today = todayStr();
                return `[KONTEKST DEEP-LINK: Użytkownik otworzył chat z ekranu głównego, sekcja "Dzisiejszy trening". Pyta o dzisiaj: ${today}.]`;
            }
            if (ctx.source === 'home_week') {
                return `[KONTEKST DEEP-LINK: Użytkownik otworzył chat z ekranu głównego, sekcja "Opis tygodnia". Pytanie dotyczy CAŁEGO tygodnia (${ctx.weekStart} do ${ctx.weekEnd}), nie pojedynczego treningu.]`;
            }
            return '';
        }

        function _guessAIStatus(msg, agent) {
            const m = (msg || '').toLowerCase();
            if (/trening|plan|dzi\u015b|jutro|dzisiaj|dzisiejsz/i.test(m)) {
                return [t('chat.st.plan.0'), t('chat.st.plan.1'), t('chat.st.plan.2')];
            }
            if (/sen|spa\u0142|wyspa\u0142|zm\u0119czony|regeneracj/i.test(m)) {
                return [t('chat.st.sleep.0'), t('chat.st.sleep.1'), t('chat.st.sleep.2')];
            }
            if (/t\u0119tno|puls|hr|bpm|serce/i.test(m)) {
                return [t('chat.st.hr.0'), t('chat.st.hr.1'), t('chat.st.hr.2')];
            }
            if (/tempo|szybciej|wolniej|pace|czas/i.test(m)) {
                return [t('chat.st.pace.0'), t('chat.st.pace.1'), t('chat.st.pace.2')];
            }
            if (/tydzie\u0144|tygodniowo|podsumow|w tym tyg/i.test(m)) {
                return [t('chat.st.week.0'), t('chat.st.week.1'), t('chat.st.week.2')];
            }
            if (agent === 'fizjo' || /boli|b\u00f3l|kontuzj|uraz/i.test(m)) {
                return [t('chat.st.fizjo.0'), t('chat.st.fizjo.1'), t('chat.st.fizjo.2')];
            }
            if (agent === 'psycholog' || /motywacj|nie chce|boj\u0119|stres/i.test(m)) {
                return [t('chat.st.psy.0'), t('chat.st.psy.1'), t('chat.st.psy.2')];
            }
            const defaults = {
                szef_sztabu: [t('chat.st.def.0'), t('chat.st.def.1'), t('chat.st.plan.2')],
                analityk:    [t('chat.st.an.0'), t('chat.st.week.1'), t('chat.st.an.2')],
                fizjo:       [t('chat.st.fz.0'), t('chat.st.fz.1'), t('chat.st.fz.2')],
                psycholog:   [t('chat.st.ps.0'), t('chat.st.ps.1'), t('chat.st.psy.2')]
            };
            return defaults[agent] || defaults.szef_sztabu;
        }

        function addLoadingIndicator(userMessage, agent) {
            const container = document.getElementById('coach-messages');
            const div = document.createElement('div');
            const id = 'loading-' + Date.now();
            div.id = id;
            div.className = 'typing-bubble-status';

            const status = _guessAIStatus(userMessage, agent);

            div.innerHTML = `
                <div class="status-dots">
                    <span></span><span></span><span></span>
                </div>
                <div class="status-text">${status[0]}</div>
            `;
            container.appendChild(div);

            let idx = 1;
            const interval = setInterval(() => {
                if (idx >= status.length) { clearInterval(interval); return; }
                const el = div.querySelector('.status-text');
                if (el) {
                    el.style.animation = 'none';
                    void el.offsetWidth; // reflow
                    el.style.animation = 'statusFade 0.3s ease';
                    setTimeout(() => { if (el) { el.textContent = status[idx]; idx++; } }, 150);
                }
            }, 1800);

            div._statusInterval = interval;
            return id;
        }

        function removeMessage(id) {
            const el = document.getElementById(id);
            if (el) {
                if (el._statusInterval) clearInterval(el._statusInterval);
                el.remove();
            }
        }

        function scrollToBottom(force) {
            setTimeout(() => {
                const container = document.getElementById('coach-messages');
                if (!container) return;
                const distFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
                if (force || distFromBottom < 120) {
                    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
                }
            }, 50);
        }

        // --- UI Updates (Greeting, Date) ---
        function updateGreeting() {
            const hour = new Date().getHours();
            const greetingEl = document.getElementById('home-greeting');
            if (greetingEl) {
                if (hour < 6) greetingEl.innerText = t('greet.night');
                else if (hour < 12) greetingEl.innerText = t('greet.morning');
                else if (hour < 18) greetingEl.innerText = t('greet.day');
                else greetingEl.innerText = t('greet.evening');
            }
        }

        function updateDate() {
            // Target by class added in HTML
            const dateEl = document.querySelector('#view-home .date-display');
            if (dateEl) {
                const now = new Date();
                const options = { weekday: 'long', day: 'numeric', month: 'short' };
                // Polish locale
                let dateStr = now.toLocaleDateString(_appLang, options);
                // Capitalize first letter
                dateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
                dateEl.innerText = dateStr;
            }
        }

