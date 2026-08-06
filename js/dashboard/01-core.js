











        // --- Auth Check ---
        if (!localStorage.getItem('velm_token')) {
            // Clear user_id too to prevent redirect loop with index.html
            localStorage.removeItem('velm_user_id');
            localStorage.removeItem('velm_user_name');
            window.location.href = 'index.html';
        }

        // --- XSS Sanitization ---
        function sanitizeHTML(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        // --- Auth Header Helper ---
        function authHeaders(extra) {
            return Object.assign({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('velm_token')}`
            }, extra || {});
        }

        // --- Refresh Token Flow ---
        // Single in-flight refresh promise — multiple parallel 401s share one refresh attempt.
        let _refreshPromise = null;
        async function refreshAccessToken() {
            if (_refreshPromise) return _refreshPromise;
            _refreshPromise = (async () => {
                const refreshToken = localStorage.getItem('velm_refresh_token');
                if (!refreshToken) return null;
                try {
                    const res = await fetch(`${window.API_BASE || ''}/api/refresh`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refreshToken })
                    });
                    if (!res.ok) return null;
                    const data = await res.json().catch(() => ({}));
                    if (!data.accessToken || !data.refreshToken) return null;
                    localStorage.setItem('velm_token', data.accessToken);
                    localStorage.setItem('velm_refresh_token', data.refreshToken);
                    return data.accessToken;
                } catch (e) {
                    return null;
                } finally {
                    _refreshPromise = null;
                }
            })();
            return _refreshPromise;
        }

        // Wygasła/nieważna sesja — wyczyść tokeny i pokaż ekran logowania,
        // zamiast zostawiać apkę „martwą" (dane po cichu nie ładują się).
        let _reauthShown = false;
        function forceReauth(message) {
            localStorage.removeItem('velm_token');
            localStorage.removeItem('velm_refresh_token');
            const overlay = document.getElementById('login-overlay');
            if (overlay) overlay.classList.remove('hidden');
            if (!_reauthShown && message && typeof showVelmToast === 'function') {
                _reauthShown = true;
                showVelmToast(message, true);
            }
        }

        // --- API Fetch Helper ---
        // Wraps fetch() with: authHeaders, .ok check, JSON parse with safe fallback,
        // 401 → auto-refresh + retry once, then force re-login.
        async function apiFetch(path, opts = {}, _retried = false) {
            const url = path.startsWith('http') ? path : `${window.API_BASE || ''}${path}`;
            const init = {
                method: opts.method || 'GET',
                headers: authHeaders(opts.headers),
                ...opts
            };
            if (init.headers === undefined) init.headers = authHeaders();
            if (init.body && typeof init.body !== 'string') init.body = JSON.stringify(init.body);
            let res;
            try {
                res = await fetch(url, init);
            } catch (e) {
                const err = new Error(t('err.noserver'));
                err.cause = e;
                throw err;
            }
            // Parse body once — safely
            let data = null;
            const ct = res.headers.get('content-type') || '';
            if (ct.includes('application/json')) {
                try { data = await res.json(); } catch (e) { data = null; }
            } else {
                try { data = { _text: await res.text() }; } catch (e) { data = null; }
            }
            if (res.status === 401 && !_retried) {
                // Try refresh once
                const newToken = await refreshAccessToken();
                if (newToken) {
                    // Retry original request with new access token
                    return apiFetch(path, opts, true);
                }
                // Refresh failed — fall through to logout flow
            }
            if (res.status === 401) {
                // Refresh exhausted — force re-login
                localStorage.removeItem('velm_token');
                localStorage.removeItem('velm_refresh_token');
                const overlay = document.getElementById('login-overlay');
                if (overlay) overlay.classList.remove('hidden');
                const err = new Error((data && data.error) || t('err.session'));
                err.status = 401;
                err.data = data;
                throw err;
            }
            if (!res.ok) {
                const err = new Error((data && data.error) || `${t('err.server')} (${res.status})`);
                err.status = res.status;
                err.data = data;
                throw err;
            }
            return data;
        }

