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

        function _pickSuggestions(agent) {
            const pool = agentSuggestions(agent);
            const shuffled = [...pool].sort(() => Math.random() - 0.5);
            return shuffled.slice(0, 3);
        }

        function _renderSuggestions(agent) {
            const container = document.getElementById('coach-quick-suggestions');
            if (!container) return;
            const footer = container.querySelector('.coach-suggest-footer');
            const footerLabel = t('agent.' + (['szef_sztabu','analityk','fizjo','psycholog'].includes(agent) ? agent : 'szef_sztabu') + '.footer');
            const picks = _pickSuggestions(agent);
            const btns = picks.map(q =>
                `<button class="coach-suggest-card" onclick="sendQuickSuggestion(${JSON.stringify(q)})">${q}</button>`
            ).join('');
            container.innerHTML = btns + `<div class="coach-suggest-footer">${footerLabel}</div>`;
        }

        // Nagłówek czatu i karty propozycji są budowane z JS (per agent), więc
        // NIE mają data-i18n — przy zmianie języka trzeba je przerysować ręcznie.
        function _refreshCoachUi() {
            const a = ['szef_sztabu', 'analityk', 'fizjo', 'psycholog'].includes(selectedAgent) ? selectedAgent : 'szef_sztabu';
            const nameEl = document.getElementById('coach-agent-name');
            if (nameEl) nameEl.textContent = agentName(a);
            const introTitle = document.getElementById('coach-intro-title');
            if (introTitle) introTitle.textContent = agentName(a);
            const introDesc = document.getElementById('coach-intro-desc');
            if (introDesc) introDesc.textContent = agentDesc(a);
            _renderSuggestions(a);
        }

        function selectAgent(agent, btn) {
            selectedAgent = agent;
            document.querySelectorAll('#agent-pill-wrap button').forEach(b => b.classList.remove('agent-active'));
            btn.classList.add('agent-active');
            const _vc = document.getElementById('view-coach');
            if (_vc) _vc.style.setProperty('--agent-color', AGENT_COLORS[agent] || '#5F8368');
            const nameEl = document.getElementById('coach-agent-name');
            if (nameEl) nameEl.textContent = agentName(agent);
            const introTitle = document.getElementById('coach-intro-title');
            if (introTitle) introTitle.textContent = agentName(agent);
            const introDesc = document.getElementById('coach-intro-desc');
            if (introDesc) introDesc.textContent = agentDesc(agent);
            _renderSuggestions(agent);
            updateAgentSlider();
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

        // Click outside drawer → close
        document.addEventListener('click', (e) => {
            const drawer = _convDrawerEl();
            const toggle = _convToggleEl();
            if (!drawer || drawer.classList.contains('hidden')) return;
            if (drawer.contains(e.target) || toggle.contains(e.target)) return;
            _closeConvDrawer();
        });

        async function loadConversationsForAgent(agent) {
            if (!currentUserId || !agent) return [];
            try {
                const res = await fetch(`${API_BASE}/api/conversations/${currentUserId}/${agent}?limit=10`, { headers: authHeaders() });
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
                            <button class="conv-confirm-yes" type="button">Usuń</button>
                            <button class="conv-confirm-no" type="button">Anuluj</button>
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
                        const res = await fetch(`${API_BASE}/api/conversation/${c.id}`, { method: 'DELETE', headers: authHeaders() });
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

        function _setCurrentConvTitle(title) {
            const el = document.getElementById('conv-current-title');
            if (el) el.textContent = title || agentName(selectedAgent);
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
                container.querySelectorAll('.msg, .chat-history-separator').forEach(n => n.remove());
                const intro = document.getElementById('coach-intro');
                const quick = document.getElementById('coach-quick-suggestions');
                if (intro) intro.style.display = 'none';
                if (quick) quick.style.display = 'none';
            }
            try {
                const res = await fetch(`${API_BASE}/api/conversation/${convId}/messages?limit=50`, { headers: authHeaders() });
                if (!res.ok) {
                    if (container) { container.classList.remove('conv-switching'); container.classList.add('conv-ready'); }
                    return;
                }
                const data = await res.json();
                const msgs = data.messages || [];
                if (container) container.classList.add('bulk-loading');
                for (const m of msgs) addMessage(m.role === 'user' ? 'user' : 'ai', m.content);
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
                container.querySelectorAll('.msg, .chat-history-separator').forEach(n => n.remove());
                const intro = document.getElementById('coach-intro');
                const quick = document.getElementById('coach-quick-suggestions');
                if (intro) intro.style.display = '';
                if (quick) quick.style.display = '';
            }
        }

        async function switchAgentConversation(agent) {
            startNewConversation();
            loadConversationsForAgent(agent); // cache w tle dla szuflady
        }

        function updateAgentSlider() {
            const wrap = document.getElementById('agent-pill-wrap');
            const slider = document.getElementById('agent-slider');
            const activeBtn = wrap && wrap.querySelector('button.agent-active');
            if (!wrap || !slider || !activeBtn) return;
            slider.style.left = activeBtn.offsetLeft + 'px';
            slider.style.width = activeBtn.offsetWidth + 'px';
        }

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
