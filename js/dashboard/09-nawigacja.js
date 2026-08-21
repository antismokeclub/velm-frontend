        function switchView(viewName) {
            // Toggle check-in FAB — only visible on home
            const ciTab = document.getElementById('home-ci-fab');
            if (ciTab) ciTab.classList.toggle('visible', viewName === 'home');

            // 1. Deactivate all views and nav items
            document.querySelectorAll('.view').forEach(el => {
                el.classList.remove('active');
                el.style.display = '';
            });
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

            // 2. Activate target view
            const targetView = document.getElementById(`view-${viewName}`);
            if (targetView) {
                targetView.classList.add('active');

                if (viewName === 'coach') {
                    targetView.style.display = 'flex';
                    loadUserMemory();
                    setTimeout(() => {
                        // Nazwa i kropka agenta w pasku — markup ma wpisanego
                        // domyślnego Trenera, ale wybór agenta i język mogą się
                        // zmienić między wejściami do zakładki.
                        _paintAgentHeader(selectedAgent || 'szef_sztabu');
                        _renderSuggestions(selectedAgent || 'szef_sztabu');
                        // Multi-conversation: ładuj ostatnią aktywną rozmowę dla tego agenta
                        if (typeof switchAgentConversation === 'function') {
                            switchAgentConversation(selectedAgent || 'szef_sztabu');
                        }
                    }, 50);
                    // Litery VELM zniknęły z paska Trenera — ich miejsce zajęła
                    // nazwa agenta. Restart animacji dotyczy już tylko nagłówka Domu.
                }

                if (viewName === 'calendar') {
                    loadCalendar();
                }

                if (viewName === 'charts') {
                    targetView.style.display = 'flex';
                    loadLab();
                    loadStats();
                    setTimeout(updateStatsToggle, 100);
                }

                if (viewName === 'home') {
                    const viewContent = document.getElementById('view-content');
                    if (viewContent) viewContent.scrollTop = 0;
                    loadTodayCard();
                    updateRaceCountdown();
                    loadPlanChanges();
                    updatePostCheckinBanner();
                    loadStreak();
                }

                if (viewName === 'settings') {
                    loadSettings();
                    loadStravaStatus();
                    loadWatchStatus();
                }

                if (viewName === 'history') {
                    loadHistoryView();
                }

            }

            const indexMap = { 'home': 0, 'calendar': 1, 'coach': 2, 'charts': 3, 'settings': 4 };
            const navItems = document.querySelectorAll('.nav-item');
            const activeNav = navItems[indexMap[viewName]];
            if (activeNav) {
                activeNav.classList.add('active');
                // Nav icon bounce
                activeNav.classList.remove('bounce');
                void activeNav.offsetWidth;
                activeNav.classList.add('bounce');
                setTimeout(() => activeNav.classList.remove('bounce'), 400);
            }
        }

        // --- Settings ---
        // Menu ustawień → podekrany (jak Garmin/iOS): lista kategorii, klik → szczegóły.
        function openSettingsPane(name) {
            const menu = document.getElementById('settings-menu');
            if (menu) menu.style.display = 'none';
            document.querySelectorAll('#view-settings .s-pane').forEach(p => p.style.display = 'none');
            const pane = document.getElementById('s-pane-' + name);
            if (pane) pane.style.display = 'block';
            // Odtwórz animację pierścienia postępu przy wejściu w "Twój cel"
            if (name === 'cel-detail') {
                const ring = document.getElementById('cel-ring-fill');
                const p = window._celPct;
                if (ring && typeof p === 'number') {
                    ring.style.transition = 'none';
                    ring.style.strokeDashoffset = '395.8';
                    void ring.getBoundingClientRect();
                    requestAnimationFrame(() => {
                        ring.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)';
                        ring.style.strokeDashoffset = (395.8 * (1 - p / 100)).toFixed(1);
                    });
                }
            }
            try { window.scrollTo(0, 0); } catch(e) {}
        }
        function backToSettingsMenu() {
            document.querySelectorAll('#view-settings .s-pane').forEach(p => p.style.display = 'none');
            const menu = document.getElementById('settings-menu');
            if (menu) menu.style.display = 'block';
            try { window.scrollTo(0, 0); } catch(e) {}
        }

        // ── Cel: przegląd / szczegóły / zmiana ──
        function confirmChangeGoal() {
            const m = document.getElementById('change-goal-modal');
            if (m) m.classList.add('show');
        }
        function closeChangeGoalModal() {
            const m = document.getElementById('change-goal-modal');
            if (m) m.classList.remove('show');
        }
        function proceedChangeGoal() {
            closeChangeGoalModal();
            openSettingsPane('cel-edit');
            resetGoalWiz();
        }

