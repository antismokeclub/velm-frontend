        // ── SUBSCRIPTION ─────────────────────────────────────────
        let currentUserPremium = false;
        let currentTrialMessagesLeft = 0;
        let currentSurveyCompleted = false;

        async function loadSubscriptionStatus() {
            if (!currentUserId) return;
            try {
                const res = await authFetch(API_BASE + '/api/subscription/' + currentUserId, { headers: authHeaders() });
                if (!res.ok) {
                    console.error('loadSubscriptionStatus: HTTP ' + res.status);
                    return; // zachowaj poprzedni stan zamiast degradować do nie-premium
                }
                const data = await res.json();
                currentUserPremium = data.isPremium ?? false;
                // Premium nie może być blokowany starą flagą 402 (był free → dostał 402 →
                // kupił premium) — inaczej auto-narada nigdy nie ruszy mimo aktywnej subskrypcji.
                if (currentUserPremium) localStorage.removeItem('velm_narada_402_week');
                currentTrialMessagesLeft = data.trialMessagesLeft ?? 0;
                currentSurveyCompleted = data.surveyCompleted ?? false;
                updateTrialCounter();
                const badge = document.getElementById('premium-badge');
                if (badge) {
                    badge.style.display = currentUserPremium ? 'inline-flex' : 'none';
                }
            } catch(e) {
                currentUserPremium = false;
            }
        }

        async function loadSubscriptionSection() {
            const container = document.getElementById('subscription-section');
            if (!container || !currentUserId) return;
            try {
                const res = await authFetch(API_BASE + '/api/subscription/' + currentUserId, { headers: authHeaders() });
                const data = await res.json();
                const _benefit = txt => '<div style="display:flex;align-items:center;gap:12px;padding:9px 0;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5F8368" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M20 6L9 17l-5-5"/></svg><span style="font-size:14px;color:#1A1A1A;font-family:Inter,sans-serif;">' + txt + '</span></div>';
                const _proBenefits = '<div class="sd-card"><div class="sd-seclabel">' + t('sub.benefits') + '</div>' +
                    _benefit(t('sub.benefit.0')) + _benefit(t('sub.benefit.1')) +
                    _benefit(t('sub.benefit.2')) + _benefit(t('sub.benefit.3')) + '</div>';
                if (data.isPremium) {
                    const expiry = data.expiresAt
                        ? new Date(data.expiresAt).toLocaleDateString(_appLang, { day: 'numeric', month: 'long', year: 'numeric' })
                        : null;
                    const statusPill = { active: t('sub.status.active'), trialing: t('sub.status.trialing'), past_due: t('sub.status.pastdue'), cancelled: t('sub.status.cancelled') }[data.status] ?? data.status;
                    const pillOk = data.status === 'active' || data.status === 'trialing';
                    container.innerHTML =
                        '<div class="sd-hero">' +
                            '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:16px;">' +
                                '<div style="font-family:Outfit,sans-serif;font-weight:800;font-size:24px;">VELM Pro</div>' +
                                '<span style="background:' + (pillOk ? '#2E4636' : '#4A2E2A') + ';color:' + (pillOk ? '#9FC7A9' : '#D9A79F') + ';font-size:12px;font-weight:700;padding:5px 12px;border-radius:20px;white-space:nowrap;">' + statusPill + '</span>' +
                            '</div>' +
                            (expiry ? '<div style="font-size:12px;color:#9A948C;">' + t('sub.nextpay') + ' ' + expiry + '</div>' : '') +
                            '<div style="margin-top:6px;"><span style="font-size:26px;font-weight:800;font-family:Outfit,sans-serif;">$29</span><span style="font-size:14px;color:#9A948C;font-weight:500;"> ' + t('sub.permonth') + '</span></div>' +
                        '</div>' +
                        _proBenefits +
                        '<button onclick="openBillingPortal()" class="s-btn-danger" style="min-height:52px;">' + t('sub.cancel') + '</button>';
                } else {
                    currentTrialMessagesLeft = data.trialMessagesLeft ?? 0;
                    currentSurveyCompleted = data.surveyCompleted ?? false;
                    const trialLine = currentTrialMessagesLeft > 0
                        ? t('sub.signupplan') + ' · ' + tp('sub.msgs', currentTrialMessagesLeft)
                        : t('sub.signupplan') + ' · ' + t('sub.trialused');
                    container.innerHTML =
                        '<div class="sd-hero">' +
                            '<div style="font-family:Outfit,sans-serif;font-weight:800;font-size:22px;">' + t('sub.free') + '</div>' +
                            '<div style="font-size:13px;color:#B9B4AC;margin-top:6px;line-height:1.5;">' + trialLine + '</div>' +
                        '</div>' +
                        _proBenefits +
                        '<button onclick="showPaywall(null, { surveyAvailable: !currentSurveyCompleted })" class="s-btn-primary" style="min-height:54px;font-size:15px;">' + t('sub.gopremium') + '</button>' +
                        (!currentSurveyCompleted
                            ? '<button onclick="openTrialSurvey()" class="s-btn-secondary" style="margin-top:10px;">' + t('sub.surveycta') + '</button>'
                            : '');
                }
            } catch(e) {
                container.innerHTML = '';
            }
        }

        async function openBillingPortal() {
            try {
                const res = await authFetch(API_BASE + '/api/subscription/portal', { method: 'POST', headers: authHeaders() });
                const data = await res.json();
                if (data.url) window.location.href = data.url;
                else showVelmToast(t('sub.portal.err'), true);
            } catch(e) {
                showVelmToast(t('com.err.conn'), true);
            }
        }

        function _escHtml(s) {
            return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }

                function showPaywall(message, opts = {}) {
            const existing = document.getElementById('paywall-modal');
            if (existing) existing.remove();

            const surveyAvailable = !!opts.surveyAvailable && !currentUserPremium && !currentSurveyCompleted;

            const modal = document.createElement('div');
            modal.id = 'paywall-modal';
            modal.style.cssText = 'position:fixed;top:0;right:0;bottom:0;left:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:flex-end;justify-content:center;padding:16px;';
            modal.innerHTML = '<div style="background:#FFFFFF;border-radius:20px;padding:24px 20px calc(24px + env(safe-area-inset-bottom));width:100%;max-width:480px;">' +
                '<div style="font-family:Outfit,sans-serif;font-size:22px;font-weight:800;color:#1A1A1A;letter-spacing:-0.02em;margin-bottom:6px;">velm Premium</div>' +
                '<div style="font-size:14px;color:#8A8A8A;line-height:1.45;margin-bottom:20px;">' + (message ? _escHtml(message) : t('pw.default')) + '</div>' +
                '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">' +
                    '<button onclick="startCheckout(\'monthly\')" style="border:1px solid #EBEBEB;background:#FFFFFF;border-radius:12px;padding:16px 12px;cursor:pointer;text-align:left;min-height:44px;touch-action:manipulation;font-family:Inter,sans-serif;">' +
                        '<div style="font-size:13px;color:#8A8A8A;font-weight:500;margin-bottom:4px;">' + t('pw.monthly') + '</div>' +
                        '<div style="font-family:Outfit,sans-serif;font-size:22px;font-weight:800;color:#1A1A1A;font-variant-numeric:tabular-nums;">$29</div>' +
                        '<div style="font-size:13px;color:#8A8A8A;">' + t('pw.permonth') + '</div>' +
                    '</button>' +
                    '<button onclick="startCheckout(\'yearly\')" style="border:1px solid #1A1A1A;background:#1A1A1A;border-radius:12px;padding:16px 12px;cursor:pointer;text-align:left;min-height:44px;touch-action:manipulation;font-family:Inter,sans-serif;">' +
                        '<div style="font-size:13px;color:rgba(255,255,255,0.7);font-weight:500;margin-bottom:4px;">' + t('pw.yearly') + '</div>' +
                        '<div style="font-family:Outfit,sans-serif;font-size:22px;font-weight:800;color:#FFFFFF;font-variant-numeric:tabular-nums;">$199</div>' +
                        '<div style="font-size:13px;color:rgba(255,255,255,0.7);">' + t('pw.peryear') + '</div>' +
                    '</button>' +
                '</div>' +
                '<div style="font-size:13px;color:#8A8A8A;text-align:center;margin-bottom:16px;">' + t('pw.freetrial') + '</div>' +
                (surveyAvailable ?
                '<div style="border:1px solid #EBEBEB;border-radius:12px;padding:16px;margin-bottom:12px;">' +
                    '<div style="font-size:14px;font-weight:600;color:#1A1A1A;margin-bottom:4px;">' + t('pw.testing') + '</div>' +
                    '<div style="font-size:13px;color:#8A8A8A;line-height:1.45;margin-bottom:12px;">' + t('pw.survey.desc') + '</div>' +
                    '<button onclick="openTrialSurvey()" style="width:100%;padding:12px;min-height:44px;background:transparent;border:1px solid #1A1A1A;border-radius:12px;font-size:14px;font-weight:600;color:#1A1A1A;cursor:pointer;font-family:Inter,sans-serif;touch-action:manipulation;">' + t('pw.survey.cta') + '</button>' +
                '</div>' : '') +
                '<button onclick="document.getElementById(\'paywall-modal\').remove()" style="width:100%;padding:12px;min-height:44px;background:transparent;border:none;font-size:14px;font-weight:500;font-family:Inter,sans-serif;cursor:pointer;color:#8A8A8A;touch-action:manipulation;">' + t('pw.later') + '</button>' +
                '</div>';
            modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
            document.body.appendChild(modal);
        }

        // ── ANKIETA ODBLOKOWUJĄCA TRIAL ──────────────────────────
        const _surveyState = { source: null, pays: null, paysWhat: '', willing: null };

        function openTrialSurvey() {
            document.getElementById('paywall-modal')?.remove();
            document.getElementById('survey-modal')?.remove();
            _surveyState.source = null; _surveyState.pays = null;
            _surveyState.paysWhat = ''; _surveyState.willing = null;

            const chip = (group, value, label) =>
                '<button data-svgroup="' + group + '" data-svval="' + value + '" onclick="svSelect(this)" aria-pressed="false" ' +
                'style="padding:10px 14px;min-height:44px;border:1px solid #D9D9D9;border-radius:12px;background:#FFFFFF;color:#1A1A1A;font-size:14px;font-weight:500;font-family:Inter,sans-serif;cursor:pointer;touch-action:manipulation;">' +
                label + '</button>';

            const q = (title, chipsHtml) =>
                '<div style="margin-bottom:20px;">' +
                '<div style="font-size:14px;font-weight:600;color:#1A1A1A;margin-bottom:8px;">' + title + '</div>' +
                '<div style="display:flex;flex-wrap:wrap;gap:8px;">' + chipsHtml + '</div></div>';

            const modal = document.createElement('div');
            modal.id = 'survey-modal';
            modal.style.cssText = 'position:fixed;top:0;right:0;bottom:0;left:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:flex-end;justify-content:center;padding:16px;';
            modal.innerHTML = '<div style="background:#FFFFFF;border-radius:20px;padding:24px 20px calc(24px + env(safe-area-inset-bottom));width:100%;max-width:480px;max-height:85vh;overflow-y:auto;">' +
                '<div style="font-family:Outfit,sans-serif;font-size:22px;font-weight:800;color:#1A1A1A;letter-spacing:-0.02em;margin-bottom:4px;">' + t('sv.title') + '</div>' +
                '<div style="font-size:13px;color:#8A8A8A;margin-bottom:20px;">' + t('sv.sub') + '</div>' +
                q(t('sv.q.source'),
                    chip('source','instagram','Instagram') + chip('source','tiktok','TikTok') +
                    chip('source','google','Google') + chip('source','znajomi',t('sv.src.friends')) +
                    chip('source','inne',t('sv.src.other'))) +
                q(t('sv.q.pays'),
                    chip('pays','nie',t('sv.no')) + chip('pays','tak',t('sv.yes'))) +
                '<div id="sv-pays-what" style="display:none;margin:-8px 0 20px;">' +
                    '<input id="sv-pays-input" type="text" maxlength="100" placeholder="' + t('sv.which.ph') + '" ' +
                    'style="width:100%;padding:12px;border:1px solid #D9D9D9;border-radius:12px;font-size:14px;font-family:Inter,sans-serif;background:#FFFFFF;color:#1A1A1A;box-sizing:border-box;"></div>' +
                q(t('sv.q.willing'),
                    chip('willing','0',t('sv.pay.0')) + chip('willing','10-20',t('sv.pay.1')) +
                    chip('willing','20-35',t('sv.pay.2')) + chip('willing','35+',t('sv.pay.3'))) +
                '<div style="margin-bottom:20px;">' +
                    '<div style="font-size:14px;font-weight:600;color:#1A1A1A;margin-bottom:8px;">' + t('sv.q.missing') + ' <span style="font-weight:400;color:#8A8A8A;">' + t('sv.optional') + '</span></div>' +
                    '<textarea id="sv-missing" maxlength="500" rows="2" placeholder="' + t('sv.missing.ph') + '" ' +
                    'style="width:100%;padding:12px;border:1px solid #D9D9D9;border-radius:12px;font-size:14px;font-family:Inter,sans-serif;background:#FFFFFF;color:#1A1A1A;resize:none;box-sizing:border-box;"></textarea></div>' +
                '<button id="sv-submit" onclick="submitTrialSurvey()" disabled ' +
                    'style="width:100%;padding:14px;min-height:48px;background:#1A1A1A;border:none;border-radius:12px;color:#FFFFFF;font-size:15px;font-weight:600;font-family:Inter,sans-serif;cursor:pointer;opacity:0.4;touch-action:manipulation;">' + t('sv.submit') + '</button>' +
                '<button onclick="document.getElementById(\'survey-modal\').remove()" style="width:100%;padding:12px;min-height:44px;background:transparent;border:none;font-size:14px;font-weight:500;font-family:Inter,sans-serif;cursor:pointer;color:#8A8A8A;margin-top:4px;touch-action:manipulation;">' + t('com.back') + '</button>' +
                '</div>';
            modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
            document.body.appendChild(modal);
        }

        function svSelect(btn) {
            const group = btn.dataset.svgroup;
            const val = btn.dataset.svval;
            _surveyState[group === 'pays' ? 'pays' : group] = val;
            document.querySelectorAll('#survey-modal [data-svgroup="' + group + '"]').forEach(b => {
                const sel = b === btn;
                b.setAttribute('aria-pressed', sel ? 'true' : 'false');
                b.style.background = sel ? '#1A1A1A' : '#FFFFFF';
                b.style.color = sel ? '#FFFFFF' : '#1A1A1A';
                b.style.borderColor = sel ? '#1A1A1A' : '#D9D9D9';
            });
            if (group === 'pays') {
                const box = document.getElementById('sv-pays-what');
                if (box) box.style.display = val === 'tak' ? 'block' : 'none';
            }
            const submit = document.getElementById('sv-submit');
            if (submit) {
                const ready = !!(_surveyState.source && _surveyState.pays && _surveyState.willing);
                submit.disabled = !ready;
                submit.style.opacity = ready ? '1' : '0.4';
            }
        }

        async function submitTrialSurvey() {
            const submit = document.getElementById('sv-submit');
            if (!submit || submit.disabled) return;
            submit.disabled = true;
            submit.textContent = t('sv.sending');
            const paysInput = document.getElementById('sv-pays-input');
            const missing = document.getElementById('sv-missing');
            const answers = {
                source: _surveyState.source,
                willingToPay: _surveyState.willing,
                paysForApps: _surveyState.pays === 'tak'
                    ? ('tak' + (paysInput && paysInput.value.trim() ? ': ' + paysInput.value.trim() : ''))
                    : (_surveyState.pays || ''),
                missing: missing ? missing.value.trim() : ''
            };
            try {
                const data = await apiFetch('/api/survey', {
                    method: 'POST',
                    body: { userId: currentUserId, answers }
                });
                document.getElementById('survey-modal')?.remove();
                currentTrialMessagesLeft = data.trialMessagesLeft ?? 5;
                currentSurveyCompleted = true;
                updateTrialCounter();
                showVelmToast(t('sv.unlocked'));
            } catch (e) {
                if (e.status === 409) {
                    document.getElementById('survey-modal')?.remove();
                    currentSurveyCompleted = true;
                    showVelmToast(t('sv.already'), true);
                } else {
                    submit.disabled = false;
                    submit.textContent = t('sv.submit');
                    showVelmToast(e.message || t('sv.senderr'), true);
                }
            }
        }

        function updateTrialCounter() {
            const el = document.getElementById('trial-counter');
            if (!el) return;
            if (currentUserPremium || currentTrialMessagesLeft <= 0) {
                el.style.display = 'none';
                return;
            }
            const n = currentTrialMessagesLeft;
            el.textContent = tp('sub.left', n);
            el.style.display = 'block';
        }

        async function startCheckout(plan) {
            document.getElementById('paywall-modal')?.remove();
            try {
                const res = await authFetch(API_BASE + '/api/subscription/checkout', {
                    method: 'POST',
                    headers: authHeaders(),
                    body: JSON.stringify({ plan })
                });
                const data = await res.json();
                if (data.url) window.location.href = data.url;
                else showVelmToast(apiCode(data) || (t('sub.pay.err') + ' ' + (data.error || t('sub.pay.unknown'))), true);
            } catch(e) {
                showVelmToast(t('com.err.conn'), true);
            }
        }

