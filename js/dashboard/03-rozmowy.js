        const AGENT_COLORS = { szef_sztabu: '#5F8368', analityk: '#5B8DB8', fizjo: '#6B8F71', psycholog: '#C9924E' };
        function agentDesc(agent) {
            const a = ['szef_sztabu', 'analityk', 'fizjo', 'psycholog'].includes(agent) ? agent : 'szef_sztabu';
            return t('agent.' + a + '.desc');
        }
        function agentName(agent) {
            const a = ['szef_sztabu', 'analityk', 'fizjo', 'psycholog'].includes(agent) ? agent : 'szef_sztabu';
            return t('agent.' + a + '.name');
        }

        // Propozycje pytań trzymamy jako KLUCZE — treść bierzemy z I18N przy
        // każdym renderze, żeby po zmianie języka nie zostały polskie pytania.
        const AGENT_SUGGESTION_COUNT = 10;
        function agentSuggestions(agent) {
            const a = ['szef_sztabu', 'analityk', 'fizjo', 'psycholog'].includes(agent) ? agent : 'szef_sztabu';
            const out = [];
            for (let i = 0; i < AGENT_SUGGESTION_COUNT; i++) out.push(t('sug.' + a + '.' + i));
            return out;
        }

        // ── PYTANIE Z NAJBLIŻSZEGO TRENINGU ───────────────────────────────────
        //
        // Pula dziesięciu pytań na agenta jest z konieczności ogólna („Jak
        // wyglądają moje postępy?"), bo musi pasować każdemu. Jeśli w planie
        // stoi konkretna sesja, pierwsze pytanie może dotyczyć WŁAŚNIE JEJ.
        //
        // Czytamy `calendarPlan`, który wypełnia karta „dziś" na Domu albo
        // Kalendarz. Wchodząc do Trenera prosto po starcie apki plan zwykle już
        // jest; jeśli go nie ma, funkcja oddaje null i pula zostaje bez zmian.
        // ŻADNEGO dociągania planu tutaj — pytanie o „jutrzejsze interwały"
        // w sytuacji, w której nikt planu nie czytał, byłoby zgadywanką.
        const _SESJA_KLUCZ = { interval: 'sug.ctx.interval', tempo: 'sug.ctx.tempo', long: 'sug.ctx.long', rest: 'sug.ctx.rest' };

        function _pytanieZPlanu() {
            const dni = (typeof calendarPlan !== 'undefined' && calendarPlan) ? calendarPlan.dni : null;
            if (!Array.isArray(dni) || !dni.length) return null;
            const dzis = (typeof todayStr === 'function') ? todayStr() : null;
            if (!dzis) return null;

            // TYLKO dziś albo jutro. Nie z lenistwa: „dzisiaj" i „jutro" to
            // jedyne określenia czasu, które wchodzą do zdania bez odmiany
            // w każdym z pięciu języków. Nazwa dnia z Intl przychodzi w mianowniku
            // i po polsku dawała „Mam sobota interwały" — a przypadki trzeba by
            // wtedy pisać osobno dla polskiego. Sesja za cztery dni i tak nie
            // jest „na teraz", więc nic realnego nie tracimy.
            // Data z części LOKALNYCH. Przez toISOString() kotwica T12:00:00
            // wystarczała wszędzie poza UTC+13 (Nowa Zelandia w czasie letnim),
            // gdzie lokalne południe to w UTC dzień wcześniej i „jutro"
            // rozwiązywało się na dzisiaj.
            const d = new Date(dzis + 'T12:00:00');
            d.setDate(d.getDate() + 1);
            const dwa = (n) => String(n).padStart(2, '0');
            const jutro = d.getFullYear() + '-' + dwa(d.getMonth() + 1) + '-' + dwa(d.getDate());

            for (const d of dni) {
                if (!d || (d.data !== dzis && d.data !== jutro)) continue;
                const klucz = _SESJA_KLUCZ[d.typ];
                if (!klucz) continue;
                const kiedy = (d.data === dzis ? t('chat.day.today') : t('chat.day.tomorrow')).toLowerCase();
                const km = Number(d.dystans_km);
                return t(klucz)
                    .split('{kiedy}').join(kiedy)
                    .split('{km}').join(Number.isFinite(km) && km > 0 ? km : '');
            }
            return null;
        }

        function _pickSuggestions(agent) {
            const pool = agentSuggestions(agent);
            const shuffled = [...pool].sort(() => Math.random() - 0.5);
            const zPlanu = _pytanieZPlanu();
            // Pytanie z planu wchodzi na pierwsze miejsce i zabiera jedno z puli,
            // żeby kart dalej były trzy.
            return zPlanu ? [zPlanu, ...shuffled.slice(0, 2)] : shuffled.slice(0, 3);
        }

        function _renderSuggestions(agent) {
            const container = document.getElementById('coach-quick-suggestions');
            if (!container) return;
            const footerLabel = t('agent.' + (['szef_sztabu','analityk','fizjo','psycholog'].includes(agent) ? agent : 'szef_sztabu') + '.footer');
            const picks = _pickSuggestions(agent);

            // KARTY BUDUJEMY Z ELEMENTÓW, NIE ZE STRINGA HTML.
            // Poprzednia wersja skladala `onclick="sendQuickSuggestion(${JSON.stringify(q)})"`,
            // czyli wstawiala tekst w CUDZYSLOWACH do atrybutu ograniczonego
            // CUDZYSLOWAMI. Przegladarka konczyla atrybut na pierwszym z nich, więc
            // onclick brzmial `sendQuickSuggestion(` — blad skladni, klikniecie nie
            // robilo NIC. Wszystkie propozycje w czacie byly martwe.
            // Nasluch na wlasciwosci .onclick nie da sie zepsuc zadnym znakiem
            // w tresci pytania (a francuskie maja apostrofy, hiszpanskie znaki
            // zapytania po obu stronach).
            container.replaceChildren();
            for (const q of picks) {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'coach-suggest-card';
                b.textContent = q;
                b.onclick = () => sendQuickSuggestion(q);
                container.appendChild(b);
            }
            const f = document.createElement('div');
            f.className = 'coach-suggest-footer';
            f.textContent = footerLabel;
            container.appendChild(f);
        }

        // Nagłówek czatu i karty propozycji są budowane z JS (per agent), więc
        // NIE mają data-i18n — przy zmianie języka trzeba je przerysować ręcznie.
        function _refreshCoachUi() {
            const a = ['szef_sztabu', 'analityk', 'fizjo', 'psycholog'].includes(selectedAgent) ? selectedAgent : 'szef_sztabu';
            _paintAgentHeader(a);
            _renderAgentSheet();
            const introTitle = document.getElementById('coach-intro-title');
            if (introTitle) introTitle.textContent = agentName(a);
            const introDesc = document.getElementById('coach-intro-desc');
            if (introDesc) introDesc.textContent = agentDesc(a);
            _renderSuggestions(a);
        }

        // ── LISTA SPECJALISTÓW ────────────────────────────────────────────────
        //
        // Zamiast rzędu czterech szarych pigułek na stałe zajmujących pasek:
        // nazwa agenta w nagłówku jest przyciskiem, a pod nim rozwija się lista
        // z ikoną i JEDNYM ZDANIEM o tym, czym każdy się zajmuje. Wcześniej
        // trzeba było zgadywać, czym Analityk różni się od Trenera.
        const AGENT_IKONY = {
            // Gwizdek — trener prowadzi całość
            szef_sztabu: '<path d="M12 3v3"/><circle cx="9" cy="14" r="6"/><path d="M15 11h6"/><path d="M15 14h4"/>',
            // Wykres — analityk czyta liczby
            analityk:    '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M7 15l3.5-4 3 3L20 7"/>',
            // Puls — fizjo pilnuje ciała
            fizjo:       '<path d="M3 12h4l2.5-7 5 14L17.5 12H21"/>',
            // Głowa — psycholog
            psycholog:   '<path d="M15.5 21v-3.2a3 3 0 0 1 1-2.2A7 7 0 1 0 5 10a7 7 0 0 0 1.2 3.9c.5.7.8 1.5.8 2.4V21"/>'
        };

        function _renderAgentSheet() {
            const sheet = document.getElementById('agent-sheet');
            if (!sheet) return;
            for (const btn of sheet.querySelectorAll('.ag-item')) {
                const a = btn.getAttribute('data-agent');
                btn.classList.toggle('ag-active', a === selectedAgent);
                btn.setAttribute('aria-current', a === selectedAgent ? 'true' : 'false');
                btn.innerHTML =
                    '<span class="ag-ico" style="color:' + (AGENT_COLORS[a] || '#1A1A1A') + '">' +
                        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
                        'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + AGENT_IKONY[a] + '</svg>' +
                    '</span>' +
                    '<span class="ag-txt">' +
                        '<span class="ag-name"></span>' +
                        '<span class="ag-role"></span>' +
                    '</span>' +
                    '<span class="ag-check"></span>';
                // Nazwa i opis przez textContent — to teksty z i18n, ale zasada
                // jest jedna: do innerHTML idzie tylko nasz własny znacznik.
                btn.querySelector('.ag-name').textContent = agentName(a);
                btn.querySelector('.ag-role').textContent = t('agent.' + a + '.role');
            }
        }

        function toggleAgentSheet() {
            const sheet = document.getElementById('agent-sheet');
            const btn = document.getElementById('coach-agent-btn');
            if (!sheet || !btn) return;
            const otwarte = !sheet.classList.contains('hidden');
            if (otwarte) { sheet.classList.add('hidden'); btn.setAttribute('aria-expanded', 'false'); return; }
            _closeConvDrawer();
            _renderAgentSheet();
            sheet.classList.remove('hidden');
            btn.setAttribute('aria-expanded', 'true');
        }

        function _closeAgentSheet() {
            const sheet = document.getElementById('agent-sheet');
            const btn = document.getElementById('coach-agent-btn');
            if (sheet) sheet.classList.add('hidden');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        }

        function _paintAgentHeader(agent) {
            const dot = document.getElementById('coach-agent-dot');
            if (dot) dot.style.background = AGENT_COLORS[agent] || '#1A1A1A';
            const lbl = document.getElementById('coach-agent-label');
            if (lbl) lbl.textContent = agentName(agent);
        }

        function selectAgent(agent, btn) {
            selectedAgent = agent;
            _closeAgentSheet();
            const _vc = document.getElementById('view-coach');
            if (_vc) _vc.style.setProperty('--agent-color', AGENT_COLORS[agent] || '#5F8368');
            _paintAgentHeader(agent);
            const introTitle = document.getElementById('coach-intro-title');
            if (introTitle) introTitle.textContent = agentName(agent);
            const introDesc = document.getElementById('coach-intro-desc');
            if (introDesc) introDesc.textContent = agentDesc(agent);
            _renderSuggestions(agent);
            // Multi-conversation: switch to this agent's last active conversation (or new if none)
            switchAgentConversation(agent);
        }

        // ── KONWERSACJE (multi-rozmowa) ─────────────────────────
        let currentConversationId = null;
        let _conversationsCache = {}; // agent -> [conv]

        function _convDrawerEl() { return document.getElementById('conv-drawer'); }
        function _convToggleEl() { return document.getElementById('conv-drawer-toggle'); }

        function toggleConvDrawer() {
            const drawer = _convDrawerEl();
            const toggle = _convToggleEl();
            if (!drawer || !toggle) return;
            const isOpen = !drawer.classList.contains('hidden');
            if (isOpen) {
                drawer.classList.add('hidden');
                toggle.setAttribute('aria-expanded', 'false');
            } else {
                renderConversationsList();
                drawer.classList.remove('hidden');
                toggle.setAttribute('aria-expanded', 'true');
            }
        }

        function _closeConvDrawer() {
            const drawer = _convDrawerEl();
            const toggle = _convToggleEl();
            if (drawer) drawer.classList.add('hidden');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }

        // Klik poza rozwiniętą listą → zamknij. Dotyczy obu list w nagłówku:
        // rozmów i specjalistów.
        document.addEventListener('click', (e) => {
            const drawer = _convDrawerEl();
            const toggle = _convToggleEl();
            if (drawer && !drawer.classList.contains('hidden')
                && !drawer.contains(e.target) && !(toggle && toggle.contains(e.target))) {
                _closeConvDrawer();
            }
            const sheet = document.getElementById('agent-sheet');
            const agBtn = document.getElementById('coach-agent-btn');
            if (sheet && !sheet.classList.contains('hidden')
                && !sheet.contains(e.target) && !(agBtn && agBtn.contains(e.target))) {
                _closeAgentSheet();
            }
        });

        async function loadConversationsForAgent(agent) {
            if (!currentUserId || !agent) return [];
            try {
                const res = await authFetch(`${API_BASE}/api/conversations/${currentUserId}/${agent}?limit=10`, { headers: authHeaders() });
                if (!res.ok) return [];
                const data = await res.json();
                _conversationsCache[agent] = data.conversations || [];
                return _conversationsCache[agent];
            } catch (e) {
                return [];
            }
        }

        function _formatConvDate(iso) {
            const d = new Date(iso);
            const now = new Date();
            const diffH = (now - d) / 36e5;
            if (diffH < 24) return d.toLocaleTimeString(_appLang, { hour: '2-digit', minute: '2-digit' });
            if (diffH < 24 * 7) return d.toLocaleDateString(_appLang, { weekday: 'short' });
            return d.toLocaleDateString(_appLang, { day: 'numeric', month: 'short' });
        }

        function renderConversationsList() {
            const list = document.getElementById('conv-list');
            if (!list) return;
            const agentLabel = document.getElementById('conv-drawer-agent-label');
            if (agentLabel) agentLabel.textContent = agentName(selectedAgent);
            const cached = _conversationsCache[selectedAgent];
            if (cached && cached.length) {
                _renderConvItems(list, cached);
            } else {
                list.innerHTML = '<div class="conv-empty">' + t('com.loading') + '</div>';
            }
            loadConversationsForAgent(selectedAgent).then((convs) => {
                if (!convs.length) {
                    list.innerHTML = '<div class="conv-empty">' + t('coach.noconv') + '</div>';
                    return;
                }
                _renderConvItems(list, convs);
            });
        }

        function _renderConvItems(list, convs) {
            list.innerHTML = '';
            const filtered = convs.filter(c => c.last_message_at);
            if (!filtered.length) {
                list.innerHTML = '<div class="conv-empty">' + t('coach.noconv') + '</div>';
                return;
            }
            filtered.forEach((c) => {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'conv-item' + (c.id === currentConversationId ? ' active' : '');
                item.innerHTML = `
                    <div class="conv-text">
                        <div class="conv-title"></div>
                        <div class="conv-date">${_formatConvDate(c.last_message_at)}</div>
                    </div>
                    <button class="conv-delete" title="${t('coach.delconv')}" aria-label="${t('coach.delconv')}" data-i18n-aria="coach.delconv">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                    <div class="conv-confirm-overlay">
                        <span class="conv-confirm-label"></span>
                        <div class="conv-confirm-btns">
                            <button class="conv-confirm-yes" type="button">${t('com.delete')}</button>
                            <button class="conv-confirm-no" type="button">${t('com.cancel')}</button>
                        </div>
                    </div>`;
                item.querySelector('.conv-title').textContent = c.title || 'Rozmowa';
                item.querySelector('.conv-confirm-label').textContent = c.title || 'Rozmowa';
                item.addEventListener('click', (e) => {
                    if (e.target.closest('.conv-delete') || e.target.closest('.conv-confirm-overlay')) return;
                    selectConversation(c.id, c.title);
                });
                item.querySelector('.conv-delete').addEventListener('click', (e) => {
                    e.stopPropagation();
                    item.classList.add('conv-confirming');
                });
                item.querySelector('.conv-confirm-no').addEventListener('click', (e) => {
                    e.stopPropagation();
                    item.classList.remove('conv-confirming');
                });
                item.querySelector('.conv-confirm-yes').addEventListener('click', async (e) => {
                    e.stopPropagation();
                    try {
                        const res = await authFetch(`${API_BASE}/api/conversation/${c.id}`, { method: 'DELETE', headers: authHeaders() });
                        if (!res.ok) { item.classList.remove('conv-confirming'); return; }
                        if (c.id === currentConversationId) startNewConversation();
                        _conversationsCache[selectedAgent] = (_conversationsCache[selectedAgent] || []).filter(x => x.id !== c.id);
                        renderConversationsList();
                    } catch (ex) {
                        item.classList.remove('conv-confirming');
                    }
                });
                list.appendChild(item);
            });
        }

        // Tytul watku nie ma juz miejsca w pasku (nazwe zajmuje agent), a i tak
        // byl powtorzeniem: tytul rozmowy to jej PIERWSZA WIADOMOSC, ktora stoi
        // kilka pikseli nizej. Aktywna rozmowe zaznacza szuflada po id.
        // Funkcja zostaje jako punkt zaczepienia — wolaja ja trzy miejsca.
        function _setCurrentConvTitle(title) {
            const btn = document.getElementById('conv-drawer-toggle');
            if (btn) btn.title = title || agentName(selectedAgent);
        }

        async function selectConversation(convId, title) {
            currentConversationId = convId;
            localStorage.setItem(`velm_active_conv_${selectedAgent}`, convId);
            _setCurrentConvTitle(title);
            _closeConvDrawer();
            const container = document.getElementById('coach-messages');
            if (container) {
                container.classList.add('conv-switching');
                container.classList.remove('conv-ready');
                container.querySelectorAll('.msg, .chat-history-separator, .chat-day-sep, .msg-who, .typing-bubble-status').forEach(n => n.remove());
                resetChatGroups();
                // Karta notatek sztabu chowa się razem z intro — należy do
                // pustego ekranu, nie do wczytanej rozmowy.
                _hideIntro();
            }
            try {
                const res = await authFetch(`${API_BASE}/api/conversation/${convId}/messages?limit=50`, { headers: authHeaders() });
                if (!res.ok) {
                    if (container) { container.classList.remove('conv-switching'); container.classList.add('conv-ready'); }
                    return;
                }
                const data = await res.json();
                const msgs = data.messages || [];
                if (container) container.classList.add('bulk-loading');
                resetChatGroups();
                // created_at leci prosto z bazy — separatory dni i godziny nad
                // wiadomościami muszą pokazywać KIEDY TO NAPRAWDĘ BYŁO, a nie
                // moment wczytania historii. Rozmowa jest per agent, więc
                // selectedAgent poprawnie podpisuje wszystkie wiadomości w wątku.
                for (const m of msgs) {
                    addMessage(m.role === 'user' ? 'user' : 'ai', m.content, null,
                        { agent: selectedAgent, time: m.created_at });
                }
                if (container) {
                    container.classList.remove('bulk-loading', 'conv-switching');
                    requestAnimationFrame(() => container.classList.add('conv-ready'));
                }
                scrollToBottom(true);
                if (!('ontouchstart' in window)) {
                    const input = document.getElementById('chat-input');
                    if (input) input.focus();
                }
            } catch (e) {
                if (container) { container.classList.remove('conv-switching', 'bulk-loading'); container.classList.add('conv-ready'); }
            }
        }

        function startNewConversation() {
            currentConversationId = null;
            localStorage.removeItem(`velm_active_conv_${selectedAgent}`);
            _setCurrentConvTitle(null);
            _closeConvDrawer();
            const container = document.getElementById('coach-messages');
            if (container) {
                container.querySelectorAll('.msg, .chat-history-separator, .chat-day-sep, .msg-who, .typing-bubble-status').forEach(n => n.remove());
                resetChatGroups();
                const intro = document.getElementById('coach-intro');
                const quick = document.getElementById('coach-quick-suggestions');
                if (intro) intro.style.display = '';
                if (quick) quick.style.display = '';
                // Nowa rozmowa = znowu pusty ekran, więc notatki sztabu wracają.
                // loadUserMemory sam schowa kartę, jeśli pamięć jest pusta.
                if (typeof loadUserMemory === 'function') loadUserMemory();
            }
        }

        async function switchAgentConversation(agent) {
            startNewConversation();
            loadConversationsForAgent(agent); // cache w tle dla szuflady
        }

        // Suwak pod pigulkami agentow zniknal razem z pigulkami — zostaje pusta
        // funkcja, bo wola ja switchView('coach'). Kasowanie jej znaczyloby
        // grzebanie w nawigacji przy okazji zmiany wygladu czatu.
        // updateAgentSlider() usuniete razem z pigulkami — nikt go juz nie wola.

        function updateSendBtn() {
            const input = document.getElementById('chat-input');
            const btn = document.getElementById('send-btn');
            if (input && btn) btn.disabled = !input.value.trim();
        }

        function sendQuickSuggestion(text) {
            const input = document.getElementById('chat-input');
            if (!input) return;
            input.value = text;
            updateSendBtn();
            sendMessage();
        }
