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
        // ── NOTATKI SZTABU O ZAWODNIKU ────────────────────────────────────────
        //
        // Ta funkcja istniała od dawna i NIGDY nic nie narysowała, z dwóch
        // niezależnych powodów naraz:
        //   1. szukała elementów #memory-list / #memory-content / #coach-memory,
        //      a żadnego z nich nie było w dashboard.html — więc wychodziła
        //      pierwszą linijką,
        //   2. czytała `data.memory`, a /api/memory/get oddaje `data.context`
        //      w kształcie [{category, fact}] — więc nawet z kontenerem
        //      wyrenderowałaby pustą listę.
        // Backend liczył to i wysyłał przez cały czas.
        //
        // To jest treść, której nie ma żadna inna apka biegowa: cztery notatki
        // czterech specjalistów o TYM zawodniku. Dlatego stoi na ekranie
        // powitalnym Trenera, nad propozycjami pytań — zanim jeszcze cokolwiek
        // napiszesz, widzisz, co sztab już wie.
        //
        // Notatki bywają długie (akapit na specjalistę), więc domyślnie są
        // przycięte do dwóch linii, a dotknięcie karty rozwija całość.
        const _MEM_AGENCI = {
            'Analityk': 'analityk', 'Fizjo': 'fizjo',
            'Psycholog': 'psycholog', 'Trener': 'szef_sztabu'
        };

        function toggleMemory(el) {
            const karta = el.closest('.mem-card');
            if (!karta) return;
            karta.classList.toggle('mem-open');
            const btn = karta.querySelector('.mem-head');
            if (btn) btn.setAttribute('aria-expanded', String(karta.classList.contains('mem-open')));
        }

        async function loadUserMemory() {
            const box = document.getElementById('coach-memory');
            if (!box || !currentUserId) return;
            // sendMessage() odświeża pamięć 2 s po każdej odpowiedzi. Bez tego
            // warunku karta wracałaby nad rozmowę w trakcie czytania, przy każdej
            // wymianie zdań — należy do pustego ekranu, nie do trwającego czatu.
            const msgs = document.getElementById('coach-messages');
            if (msgs && msgs.querySelector('.msg')) { box.hidden = true; return; }
            try {
                const response = await authFetch(`${API_BASE}/api/memory/get?userId=${currentUserId}`, { headers: authHeaders() });
                if (!response.ok) { box.hidden = true; return; }
                const data = await response.json();

                const wpisy = (data.context || [])
                    .filter(c => c && typeof c.fact === 'string' && c.fact.trim().length > 0);

                // Świeże konto nie ma notatek — wtedy karty NIE MA. Pusta ramka
                // z napisem „brak faktów" mówi tylko tyle, że coś nie działa.
                if (!wpisy.length) { box.hidden = true; box.replaceChildren(); return; }

                box.replaceChildren();
                const karta = document.createElement('div');
                karta.className = 'mem-card';

                const head = document.createElement('button');
                head.type = 'button';
                head.className = 'mem-head';
                head.setAttribute('aria-expanded', 'false');
                head.onclick = () => toggleMemory(head);
                const tytul = document.createElement('span');
                tytul.className = 'mem-title';
                tytul.textContent = t('chat.mem.title');
                const licznik = document.createElement('span');
                licznik.className = 'mem-n';
                licznik.textContent = String(wpisy.length);
                const chev = document.createElement('span');
                chev.className = 'mem-chev';
                head.append(tytul, licznik, chev);
                karta.appendChild(head);

                for (const c of wpisy) {
                    const klucz = _MEM_AGENCI[c.category] || 'szef_sztabu';
                    const wiersz = document.createElement('div');
                    wiersz.className = 'mem-row';

                    const kto = document.createElement('div');
                    kto.className = 'mem-who';
                    const dot = document.createElement('span');
                    dot.className = 'mem-dot';
                    dot.style.background = (typeof AGENT_COLORS !== 'undefined' && AGENT_COLORS[klucz]) || '#1A1A1A';
                    const nazwa = document.createElement('span');
                    nazwa.textContent = (typeof agentName === 'function') ? agentName(klucz) : c.category;
                    kto.append(dot, nazwa);

                    const tresc = document.createElement('div');
                    tresc.className = 'mem-text';
                    tresc.textContent = c.fact.trim();

                    wiersz.append(kto, tresc);
                    karta.appendChild(wiersz);
                }

                box.appendChild(karta);
                box.hidden = false;
            } catch (e) {
                box.hidden = true;
                console.error('loadUserMemory:', e?.message || e);
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

        // ── STRUMIEŃ ODPOWIEDZI ───────────────────────────────────────────────
        //
        // Zawodnik prosił o „pokazanie toku myślenia". Jedyny uczciwy sposób to
        // pokazać PRAWDZIWY przebieg: najpierw wykaz tego, co sztab wczytał
        // (backend liczy go zaraz po odczycie danych, przed pisaniem), potem
        // odpowiedź pojawiającą się tak, jak model ją pisze. Wszystko inne było
        // animowanym udawaniem — dokładnie to, co wycięliśmy w v93.
        function _strumienDostepny() {
            return typeof ReadableStream === 'function'
                && typeof TextDecoder === 'function'
                && !!(window.Response && Response.prototype && 'body' in Response.prototype);
        }
        function _toStrumien(res) {
            return res.ok && (res.headers.get('content-type') || '').includes('text/event-stream') && res.body;
        }

        // Bańka rośnie w miarę napływania tekstu. Podczas pisania trzymamy surowy
        // (zabezpieczony) tekst w jednym akapicie — pełne formatowanie z akapitami
        // i wyróżnionymi liczbami wchodzi na końcu, kiedy tekst już się nie zmienia.
        function _strumienBubble(agent) {
            const bubble = addMessage('ai', '', null, { agent });
            bubble.innerHTML = '<span class="ak strumien"></span>';
            bubble.classList.add('msg-pisze');
            return bubble;
        }

        async function _czytajStrumien(response, { loadingId, text }) {
            const reader = response.body.getReader();
            const dekoder = new TextDecoder('utf-8');
            let ogon = '', tresc = '', bubble = null, zakonczone = false;
            let ostatnieMeta = null, konwId = null, trialLeft, agentOdp = selectedAgent;

            // Cisza dłuższa niż 6 s znaczy zwykle, że pośrednik buforuje całą
            // odpowiedź. Nie ponawiamy żądania (to podwójny koszt modelu za
            // problem z rysowaniem) — zdejmujemy tylko kursor, żeby nie mrugał
            // w próżni, a wskaźnik pracy i tak mówi prawdę.
            let cisza = setTimeout(() => { if (bubble) bubble.classList.remove('msg-pisze'); }, 6000);
            const odswiezCisze = () => { clearTimeout(cisza); cisza = setTimeout(() => {
                if (bubble) bubble.classList.remove('msg-pisze');
            }, 6000); };

            const obsluz = (typ, dane) => {
                if (typ === 'meta') {
                    ostatnieMeta = dane && dane.loaded ? dane : null;
                    _pokazWykazWTrakcie(loadingId, ostatnieMeta);
                } else if (typ === 'delta') {
                    if (!bubble) { removeMessage(loadingId); bubble = _strumienBubble(agentOdp); }
                    tresc += dane.t || '';
                    const span = bubble.querySelector('.ak');
                    if (span) span.textContent = tresc;
                    scrollToBottom();
                } else if (typ === 'replace') {
                    if (!bubble) { removeMessage(loadingId); bubble = _strumienBubble(agentOdp); }
                    tresc = dane.t || '';
                    const span = bubble.querySelector('.ak');
                    if (span) span.textContent = tresc;
                } else if (typ === 'done') {
                    zakonczone = true;
                    konwId = dane.conversationId;
                    trialLeft = dane.trialMessagesLeft;
                    if (dane.meta && dane.meta.loaded) ostatnieMeta = dane.meta;
                    if (dane.agent) agentOdp = dane.agent;
                } else if (typ === 'error') {
                    zakonczone = true;
                }
            };

            try {
                for (;;) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    odswiezCisze();
                    ogon += dekoder.decode(value, { stream: true });
                    // Zdarzenia SSE rozdziela pusta linia. Ostatni, niepełny
                    // fragment zostaje w ogonie do następnego odczytu.
                    const czesci = ogon.split('\n\n');
                    ogon = czesci.pop();
                    for (const blok of czesci) {
                        const mTyp = blok.match(/^event: (.+)$/m);
                        const mDane = blok.match(/^data: ([\s\S]*)$/m);
                        if (!mTyp || !mDane) continue;
                        let dane = {};
                        try { dane = JSON.parse(mDane[1]); } catch (e) { continue; }
                        obsluz(mTyp[1], dane);
                    }
                }
            } finally {
                clearTimeout(cisza);
            }

            removeMessage(loadingId);
            if (!bubble) {
                // Strumień skończył się bez ani jednego kawałka tekstu.
                addMessage('ai', t('chat.replyerr'), null, { agent: agentOdp });
                return;
            }

            // Koniec pisania: pełne formatowanie (akapity, wyróżnione liczby)
            // plus wykaz „co sprawdziłem" pod odpowiedzią.
            bubble.classList.remove('msg-pisze');
            bubble.innerHTML = _formatAgentText(tresc) + _wykazHtml(ostatnieMeta);

            if (trialLeft !== null && trialLeft !== undefined) {
                currentTrialMessagesLeft = trialLeft;
                updateTrialCounter();
            }
            if (konwId && konwId !== currentConversationId) {
                currentConversationId = konwId;
                localStorage.setItem(`velm_active_conv_${selectedAgent}`, konwId);
                const titleText = text.length > 60 ? text.slice(0, 57).trim() + '…' : text;
                _setCurrentConvTitle(titleText);
                delete _conversationsCache[selectedAgent];
            }
            setTimeout(loadUserMemory, 2000);
        }

        // Wskaźnik pracy zamienia się w LISTĘ POLICZONYCH ŹRÓDEŁ, gdy tylko
        // backend przyśle wykaz — czyli zanim model napisze pierwsze słowo.
        // To jest ten „tok myślenia": nie animacja obietnicy, tylko rzeczy,
        // które naprawdę zostały wczytane.
        function _pokazWykazWTrakcie(loadingId, meta) {
            const el = document.getElementById(loadingId);
            if (!el || !meta || !meta.loaded) return;
            const pozycje = [];
            for (const [pole, klucz] of _WYKAZ_POZYCJE) {
                if (typeof meta.loaded[pole] === 'number' && meta.loaded[pole] > 0) pozycje.push(tp(klucz, meta.loaded[pole]));
            }
            if (meta.loaded.zawody) pozycje.push(t('chat.read.race'));
            if (!pozycje.length) return;

            (el._statusTimers || []).forEach(clearTimeout);
            el.classList.add('praca-wykaz');
            el.replaceChildren();

            const naglowek = document.createElement('div');
            naglowek.className = 'praca-head';
            const kropki = document.createElement('div');
            kropki.className = 'status-dots';
            kropki.innerHTML = '<span></span><span></span><span></span>';
            const napis = document.createElement('div');
            napis.className = 'status-text';
            napis.textContent = t('chat.work.write');
            naglowek.append(kropki, napis);
            el.appendChild(naglowek);

            const lista = document.createElement('div');
            lista.className = 'praca-lista';
            pozycje.forEach((p, i) => {
                const w = document.createElement('div');
                w.className = 'praca-poz';
                w.style.animationDelay = Math.min(i * 70, 420) + 'ms';
                const ptak = document.createElement('span');
                ptak.className = 'praca-ptak';
                const txt = document.createElement('span');
                txt.textContent = p;
                w.append(ptak, txt);
                lista.appendChild(w);
            });
            el.appendChild(lista);
            scrollToBottom();
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

            // Podpowiedzi i kartę powitalną chowa addMessage() — elementu
            // #coach-suggestions nie ma w dashboard.html od dawna, ten getElementById
            // zwracał null przy każdej wysłanej wiadomości.

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
                        clientTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        // Strumień prosimy JAWNIE. Bramki 402/403/401 zostają po
                        // stronie serwera PRZED otwarciem strumienia, więc dalej
                        // wracają prawdziwym kodem HTTP i obsługa niżej jest ta sama.
                        stream: _strumienDostepny()
                    })
                });

                // Odpowiedź strumieniowa — tekst dociera po kawałku, a wykaz
                // „co sprawdziłem" jeszcze zanim model zacznie pisać.
                if (_toStrumien(response)) {
                    await _czytajStrumien(response, { loadingId, text });
                    scrollToBottom();
                    return;
                }

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
                // meta idzie TYLKO tędy — ścieżki 402/403/401 i !response.ok
                // kończą się wcześniej, więc wykaz nie pojawi się przy paywallu
                // ani przy wygasłej sesji, gdzie agent niczego nie przeczytał.
                addMessage('ai', data.reply || data.error || t('chat.replyerr'), data.meta,
                    { agent: data.agent || selectedAgent });

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

        // Czterech agentów sztabu. Lista w jednym miejscu, bo nazwa agenta wraca
        // z backendu i nie wolno jej wkleić do klucza i18n bez sprawdzenia.
        const _AGENCI = ['szef_sztabu', 'analityk', 'fizjo', 'psycholog'];

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

        // ── WYKAZ „CO SPRAWDZIŁEM" ────────────────────────────────────────────
        //
        // Zawodnik dostawał akapit tekstu i zero powodów, żeby wierzyć, że stoi
        // za nim cokolwiek poza ładnie brzmiącym modelem. Backend liczy teraz,
        // ile rzeczy agent NAPRAWDĘ wczytał przed napisaniem odpowiedzi
        // (velm-backend/lib/chatMeta.js) i przysyła same liczby — zdania
        // składamy tutaj, bo apka chodzi w pięciu językach, a backend odpowiada
        // po polsku.
        //
        // Wykaz jest pod odpowiedzią, nie nad nią: najpierw ma być odpowiedź.
        // Zwinięty do jednej linijki, bo osiem pozycji nad klawiaturą telefonu
        // zasłoniłoby to, po co zawodnik tu przyszedł.
        //
        // Kolejność jak w chatMeta.POLA — od rzeczy najbardziej konkretnych.
        const _WYKAZ_POZYCJE = [
            ['plan',     'chat.read.plan'],
            ['treningi', 'chat.read.workouts'],
            ['checkiny', 'chat.read.checkins'],
            ['kontuzje', 'chat.read.injuries'],
            ['notatki',  'chat.read.notes'],
            ['wzorce',   'chat.read.habits'],
            ['pamiec',   'chat.read.memory'],
            ['historia', 'chat.read.history']
        ];

        function _wykazHtml(meta) {
            const l = meta && meta.loaded;
            if (!l) return '';

            const pozycje = [];
            for (const [pole, klucz] of _WYKAZ_POZYCJE) {
                if (typeof l[pole] === 'number' && l[pole] > 0) pozycje.push(tp(klucz, l[pole]));
            }
            // Zawody to flaga, nie liczba — własny klucz bez odmiany przez liczbę.
            if (l.zawody) pozycje.push(t('chat.read.race'));
            if (!pozycje.length) return '';

            const lista = pozycje
                .map((p, i) => '<span class="air-item" style="animation-delay:' + Math.min(i * 35, 210) + 'ms">'
                             + sanitizeHTML(p) + '</span>')
                .join('');

            return '<div class="ai-read">' +
                '<button class="air-btn" type="button" aria-expanded="false" onclick="toggleWykaz(this)">' +
                    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
                        '<polyline points="20 6 9 17 4 12"></polyline></svg>' +
                    '<span>' + sanitizeHTML(t('chat.read.title')) + '</span>' +
                    '<span class="air-n">' + pozycje.length + '</span>' +
                    '<svg class="air-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
                        '<polyline points="6 9 12 15 18 9"></polyline></svg>' +
                '</button>' +
                '<div class="air-list" hidden>' + lista + '</div>' +
            '</div>';
        }

        function toggleWykaz(btn) {
            const box = btn.parentElement;
            const list = box.querySelector('.air-list');
            if (!list) return;
            const otwarte = !list.hasAttribute('hidden');
            if (otwarte) {
                list.setAttribute('hidden', '');
            } else {
                list.removeAttribute('hidden');
                // Pozycje wjeżdżają za każdym razem — restart animacji przez reflow,
                // inaczej drugie otwarcie pokazałoby je bez ruchu.
                list.querySelectorAll('.air-item').forEach(el => {
                    el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
                });
            }
            box.classList.toggle('air-open', !otwarte);
            btn.setAttribute('aria-expanded', String(!otwarte));
        }

        // ── PODPIS NAD WIADOMOŚCIĄ AGENTA ─────────────────────────────────────
        //
        // Sztab ma czterech specjalistów, a każdy z nich produkował identyczną
        // białą bańkę. Po przewinięciu rozmowy o tydzień w górę nie dało się
        // stwierdzić, kto co powiedział — a to jedyna rzecz, która odróżnia
        // czterech agentów od jednego czatu.
        //
        // Podpis pojawia się RAZ NA GRUPĘ: przy zmianie nadawcy, agenta albo
        // dnia. Przy każdej wiadomości byłby szumem — trener odpowiada zwykle
        // jednym ciągiem.
        let _ostatniNadawca = null;   // 'user' | 'ai'
        let _ostatniAgent   = null;
        let _ostatniDzien   = null;   // 'YYYY-MM-DD'

        function resetChatGroups() {
            _ostatniNadawca = null; _ostatniAgent = null; _ostatniDzien = null;
        }

        function _dzienEtykieta(d) {
            const dzis = new Date(); dzis.setHours(0, 0, 0, 0);
            const dzien = new Date(d); dzien.setHours(0, 0, 0, 0);
            const roznica = Math.round((dzis - dzien) / 86400000);
            if (roznica === 0) return t('chat.day.today');
            if (roznica === 1) return t('chat.day.yesterday');
            // Starsze niż tydzień dostają datę, w tygodniu wystarczy nazwa dnia.
            return roznica < 7
                ? _capFirst(new Intl.DateTimeFormat(_appLang, { weekday: 'long' }).format(dzien))
                : _i18nDate(dzien, { day: 'numeric', month: 'long' });
        }

        function _godzina(d) {
            try { return new Intl.DateTimeFormat(_appLang, { hour: '2-digit', minute: '2-digit' }).format(d); }
            catch (e) { return ''; }
        }

        // Klucz dnia z CZĘŚCI LOKALNYCH, nie z toISOString().
        // toISOString() oddaje dobę UTC. Zawodnik w strefie UTC+2 pisze o 00:30
        // (klucz UTC = wczoraj), potem o 10:00 (klucz UTC = dziś) — dwa różne
        // klucze tego samego lokalnego dnia, czyli DWA separatory, oba podpisane
        // „Dzisiaj", bo etykietę liczy już zegar lokalny. To ta sama rodzina
        // błędu co daty check-inu w v88 i cała notatka o datach w UTC z audytu.
        function _kluczDnia(d) {
            const dwa = (n) => String(n).padStart(2, '0');
            return d.getFullYear() + '-' + dwa(d.getMonth() + 1) + '-' + dwa(d.getDate());
        }

        // Karta „co sztab o Tobie wie" należy do ekranu powitalnego — znika
        // razem z intro, kiedy w rozmowie pojawia się pierwsza wiadomość.
        function _hideIntro() {
            for (const id of ['coach-intro', 'coach-quick-suggestions']) {
                const el = document.getElementById(id);
                if (el) el.style.display = 'none';
            }
            const mem = document.getElementById('coach-memory');
            if (mem) mem.hidden = true;
        }

        function addMessage(role, text, meta, opts) {
            const container = document.getElementById('coach-messages');
            if (!container) return null;
            _hideIntro();

            const o = opts || {};
            // Czas z bazy (`created_at` w historii) albo teraz — nigdy zmyślony.
            const kiedy = o.time ? new Date(o.time) : new Date();
            const prawidlowy = !isNaN(kiedy.getTime());
            const dzien = prawidlowy ? _kluczDnia(kiedy) : null;
            const agent = role === 'ai' ? (o.agent || selectedAgent || 'szef_sztabu') : null;

            // 1. Separator dnia — gdy data się zmienia albo to pierwsza wiadomość
            if (prawidlowy && dzien !== _ostatniDzien) {
                const sep = document.createElement('div');
                sep.className = 'chat-day-sep';
                const s = document.createElement('span');
                s.textContent = _dzienEtykieta(kiedy);
                sep.appendChild(s);
                container.appendChild(sep);
                _ostatniDzien = dzien;
                _ostatniNadawca = null;      // po separatorze podpis zawsze od nowa
            }

            // 2. Podpis grupy — tylko dla agenta i tylko przy zmianie nadawcy/agenta
            if (role === 'ai' && (_ostatniNadawca !== 'ai' || _ostatniAgent !== agent)) {
                const who = document.createElement('div');
                who.className = 'msg-who';
                const dot = document.createElement('span');
                dot.className = 'msg-dot';
                dot.style.background = (typeof AGENT_COLORS !== 'undefined' && AGENT_COLORS[agent]) || '#1A1A1A';
                who.appendChild(dot);
                const nazwa = document.createElement('span');
                nazwa.className = 'msg-who-name';
                nazwa.textContent = (typeof agentName === 'function') ? agentName(agent) : '';
                who.appendChild(nazwa);
                if (prawidlowy) {
                    const czas = document.createElement('span');
                    czas.className = 'msg-who-time';
                    czas.textContent = _godzina(kiedy);
                    who.appendChild(czas);
                }
                container.appendChild(who);
            }
            _ostatniNadawca = role;
            _ostatniAgent = agent;

            const div = document.createElement('div');
            div.className = role === 'user' ? 'msg msg-user' : 'msg msg-ai';
            if (role === 'user') {
                // Wiadomość użytkownika zostaje na textContent — jego własny tekst nie
                // wymaga wyróżniania liczb, a to najprostsza droga do bezpieczeństwa.
                div.textContent = text;
            } else {
                // Historia rozmowy i komunikaty błędów przychodzą bez meta —
                // wtedy wykazu po prostu nie ma. Pusty pasek byłby gorszy niż jego brak.
                div.innerHTML = _formatAgentText(text) + _wykazHtml(meta);
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

        // \u2500\u2500 CO SZTAB ROBI, KIEDY CZEKASZ \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
        //
        // Poprzednia wersja ZGADYWA\u0141A: regex po s\u0142owach z pytania wybiera\u0142 trzy
        // zdania i pokazywa\u0142 je jako fakty. \u201ePor\u00f3wnuj\u0119 HRV z ostatnich 7 dni"
        // lecia\u0142o do zawodnika bez zegarka, \u201ePrzegl\u0105dam histori\u0119 twoich
        // dolegliwo\u015bci" \u2014 do zdrowego, \u201eKonsultuj\u0119 si\u0119 ze sztabem" opisywa\u0142o
        // co\u015b, co w czacie w og\u00f3le si\u0119 nie dzieje. To nie by\u0142o t\u0142umaczenie
        // procesu, tylko jego udawanie, i psu\u0142o dok\u0142adnie t\u0119 wiarygodno\u015b\u0107,
        // kt\u00f3r\u0105 mia\u0142o budowa\u0107.
        //
        // Zostaj\u0105 zdania prawdziwe ZAWSZE, bo opisuj\u0105 realne fazy \u017c\u0105dania:
        // najpierw jedno du\u017ce zapytanie po dane zawodnika, potem pisanie
        // odpowiedzi. Konkrety \u2014 ILE i CZEGO \u2014 pokazujemy PO odpowiedzi,
        // kiedy backend przy\u015ble policzony wykaz (meta.loaded).
        //
        // Progi czasowe wzi\u0119te z pomiaru: kontekst schodzi w u\u0142amku sekundy,
        // model pisze 3-8 s, a powy\u017cej ~14 s zawodnik zaczyna si\u0119 zastanawia\u0107,
        // czy apka nie zawis\u0142a \u2014 i wtedy dostaje trzecie zdanie zamiast ciszy.
        function addLoadingIndicator(userMessage, agent) {
            const container = document.getElementById('coach-messages');
            const div = document.createElement('div');
            const id = 'loading-' + Date.now();
            div.id = id;
            div.className = 'typing-bubble-status';

            const kto = t('agent.' + (_AGENCI.includes(agent) ? agent : 'szef_sztabu') + '.name');
            const fazy = [
                { po: 0,     txt: t('chat.work.read').split('{kto}').join(kto) },
                { po: 1400,  txt: t('chat.work.write') },
                { po: 14000, txt: t('chat.work.long') }
            ];

            div.innerHTML =
                '<div class="status-dots"><span></span><span></span><span></span></div>' +
                '<div class="status-text"></div>';
            const txtEl = div.querySelector('.status-text');
            txtEl.textContent = fazy[0].txt;
            container.appendChild(div);

            // Osobne timery zamiast jednego setInterval \u2014 fazy nie s\u0105 r\u00f3wno
            // roz\u0142o\u017cone w czasie, a interval nie umia\u0142by tego odda\u0107.
            div._statusTimers = fazy.slice(1).map(f => setTimeout(() => {
                if (!txtEl.isConnected) return;
                txtEl.style.animation = 'none';
                void txtEl.offsetWidth;              // reflow, \u017ceby animacja ruszy\u0142a od nowa
                txtEl.style.animation = 'statusFade 0.3s ease';
                setTimeout(() => { if (txtEl.isConnected) txtEl.textContent = f.txt; }, 150);
            }, f.po));

            return id;
        }

        function removeMessage(id) {
            const el = document.getElementById(id);
            if (el) {
                // Bez tego timer trzeciej fazy potrafiłby odpalić się 14 s po tym,
                // jak odpowiedź już przyszła i bańka zniknęła.
                (el._statusTimers || []).forEach(clearTimeout);
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

