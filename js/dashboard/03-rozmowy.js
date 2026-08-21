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
        // Rysowane na siatce 24×24, obrys 1.9, zaokrąglone końce — ta sama rodzina
        // co reszta ikon w apce. Każda musi być czytelna przy 18 px i odróżnialna
        // od pozostałych trzech NA RZUT OKA, dlatego sylwetki są celowo różne:
        // koło (stoper), kąt (wykres), szpic (tarcza), owal (głowa).
        //
        // Pierwsza wersja Trenera miała być gwizdkiem, a wychodziła jako okrąg
        // z dwiema kreskami — przy 18 px nie do rozpoznania. Stoper jest
        // najczytelniejszym przedmiotem trenera, jaki mieści się w tej skali.
        const AGENT_IKONY = {
            // STOPER — trener odmierza, prowadzi całość.
            // Koronka i przycisk boczny są tym, co odróżnia stoper od zwykłego
            // zegara; bez nich ikona mówiłaby „godzina", nie „trening".
            szef_sztabu:
                '<circle cx="12" cy="14.2" r="7.3"/>' +
                '<path d="M12 10.4v3.8l2.6 1.6"/>' +
                '<path d="M9.6 2.8h4.8"/>' +
                '<path d="M12 2.8v4.1"/>' +
                // Przycisk zaczyna się DOKŁADNIE na kopercie (12+7.3·cos45°,
                // 14.2−7.3·sin45°). Wcześniej startował 1,9 jednostki dalej
                // i przy 18 px czytał się jako odklejona kreska obok ikony.
                '<path d="M17.2 9l2.3-2.3"/>',

            // WYKRES — analityk czyta trend. Oś, linia rosnąca i kropka na końcu:
            // kropka mówi „tu jesteś teraz", czyli dokładnie to, po co się pyta
            // analityka.
            analityk:
                '<path d="M4 3.6v14.9a1.9 1.9 0 0 0 1.9 1.9H20.4"/>' +
                '<path d="M7.6 15.6l3.4-4.4 2.9 2.4 4.7-6.2"/>' +
                '<circle cx="18.6" cy="7.4" r="1.35" fill="currentColor" stroke="none"/>',

            // TARCZA — fizjo ZAPOBIEGA kontuzjom, nie leczy je (tak ma napisane
            // w swoim skillu). Puls, który tu był, mówił „tętno" — czyli dane,
            // a to domena analityka. Szpic u dołu odróżnia tarczę od głowy
            // psychologa, która jest zaokrąglona.
            fizjo:
                '<path d="M12 2.9l7.4 2.9v6.1c0 4.4-3 8.1-7.4 9.2-4.4-1.1-7.4-4.8-7.4-9.2V5.8z"/>' +
                '<path d="M8.9 12.1l2.1 2.1 4.1-4.3"/>',

            // GŁOWA Z MYŚLĄ — psycholog. Sam obrys głowy bywa brany za „profil
            // użytkownika"; łuk w środku przesuwa znaczenie na to, co się w niej
            // dzieje.
            psycholog:
                '<path d="M15.4 20.9v-2.7c0-.9.3-1.7.9-2.4a7 7 0 1 0-10.6-.4c.6.8 1 1.7 1 2.7v2.8"/>' +
                '<path d="M9.6 10.4a2.5 2.5 0 0 1 4.9.4c0 1.2-1 1.8-1.7 2.3-.5.4-.8.8-.8 1.4"/>'
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
                if (typeof renderCoachStan === 'function') renderCoachStan();
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
