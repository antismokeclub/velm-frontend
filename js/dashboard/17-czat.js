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
                const res = await fetch(`${API_BASE}/api/user/${userId}/goal`, {
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
                const response = await fetch(`${API_BASE}/api/memory/get?userId=${currentUserId}`, { headers: authHeaders() });
                const data = await response.json();

                const AGENT_DISPLAY = { analityk: 'Analityk', fizjo: 'Fizjo', psycholog: 'Psycholog', szef_sztabu: 'Trener' };
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
                    list.innerHTML = '<div style="padding: 4px 0; font-style: italic; opacity: 0.6;">Brak zapisanych faktów... (Porozmawiaj z trenerem)</div>';
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
                const response = await fetch(`${API_BASE}/api/chat`, {
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
                    showPaywall(data.message || 'Ten agent dostępny tylko w Premium');
                    return;
                }

                // Trial wyczerpany — paywall z opcją ankiety (bez wywołania AI po stronie serwera)
                if (response.status === 402) {
                    currentTrialMessagesLeft = 0;
                    updateTrialCounter();
                    showPaywall(data.message || 'Darmowe wiadomości wykorzystane.', { surveyAvailable: data.surveyAvailable });
                    return;
                }

                // Auth expired — trigger relogin
                if (response.status === 401) {
                    addMessage('ai', 'Sesja wygasła. Zaloguj się ponownie.');
                    return;
                }

                if (!response.ok) {
                    addMessage('ai', data.error || `Błąd serwera (${response.status})`);
                    return;
                }

                // 5. Add AI Message
                addMessage('ai', data.reply || data.error || 'Błąd odpowiedzi');

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
                addMessage('ai', 'Przepraszam, wystąpił błąd połączenia z trenerem. Spróbuj ponownie.');
                console.error(e);
            }
            scrollToBottom();
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
            div.textContent = text;
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
                    const dayName = d.toLocaleDateString('pl-PL', { weekday: 'long' });
                    const dateShort = d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' });
                    label = `Pytasz o trening: ${dayName}, ${dateShort}${ctx.trainingRef ? ` (${ctx.trainingRef})` : ''}`;
                } else if (ctx.source === 'home_today') {
                    label = 'Pytasz o dzisiejszy trening';
                } else if (ctx.source === 'home_week') {
                    label = 'Pytasz o cały tydzień treningowy';
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
                return ['Sprawdzam tw\u00f3j plan treningowy', 'Analizuj\u0119 dzie\u0144 w kontek\u015bcie tygodnia', 'Przygotowuj\u0119 odpowied\u017a'];
            }
            if (/sen|spa\u0142|wyspa\u0142|zm\u0119czony|regeneracj/i.test(m)) {
                return ['Sprawdzam dane ze snu z ostatniej nocy', 'Por\u00f3wnuj\u0119 HRV z ostatnich 7 dni', 'Oceniam gotowo\u015b\u0107 do treningu'];
            }
            if (/t\u0119tno|puls|hr|bpm|serce/i.test(m)) {
                return ['Wczytuję dane tętna z ostatnich treningów', 'Analizuję tętno spoczynkowe', 'Porównuję strefy HR'];
            }
            if (/tempo|szybciej|wolniej|pace|czas/i.test(m)) {
                return ['Analizuję tempo z ostatnich treningów', 'Porównuję z miesiącem temu', 'Sprawdzam trend wydajności'];
            }
            if (/tydzie\u0144|tygodniowo|podsumow|w tym tyg/i.test(m)) {
                return ['Zbieram treningi z tego tygodnia', 'Obliczam statystyki', 'Porównuję z poprzednim tygodniem'];
            }
            if (agent === 'fizjo' || /boli|b\u00f3l|kontuzj|uraz/i.test(m)) {
                return ['Przeglądam historię twoich dolegliwości', 'Sprawdzam obciążenie z ostatniego tygodnia', 'Przygotowuję rekomendację'];
            }
            if (agent === 'psycholog' || /motywacj|nie chce|boj\u0119|stres/i.test(m)) {
                return ['Przeglądam naszą ostatnią rozmowę', 'Szukam wzorców w twoich reakcjach', 'Formułuję odpowiedź'];
            }
            const defaults = {
                szef_sztabu: ['Konsultuję się ze sztabem', 'Analizuję twoje dane', 'Przygotowuję odpowiedź'],
                analityk:    ['Wczytuję dane treningowe', 'Obliczam statystyki', 'Formuję wnioski'],
                fizjo:       ['Sprawdzam historię obciążenia', 'Oceniam ryzyko', 'Przygotowuję poradę'],
                psycholog:   ['Przeglądam kontekst rozmowy', 'Analizuję wzorce', 'Formułuję odpowiedź']
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
                let dateStr = now.toLocaleDateString('pl-PL', options);
                // Capitalize first letter
                dateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
                dateEl.innerText = dateStr;
            }
        }

