        const DEBUG = false;
        function log() { if (DEBUG) console.log.apply(console, arguments); }

        // --- Toast notification (replaces native alert, single-toast stacking) ---
        var _activeToast = null;
        var _toastTimeout = null;
        function showToast(m, t) {
            t = t || 'info';
            var c = { success: 'var(--correct)', error: 'var(--wrong)', info: 'var(--accent)' };
            var b = { success: 'var(--correct-bg)', error: 'var(--wrong-bg)', info: 'var(--accent-light)' };
            // Remove existing toast immediately
            if (_activeToast) { _activeToast.remove(); _activeToast = null; }
            if (_toastTimeout) { clearTimeout(_toastTimeout); _toastTimeout = null; }
            var el = document.createElement('div');
            el.textContent = m;
            el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:12px 24px;border-radius:12px;font-size:0.9rem;font-weight:500;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,0.12);opacity:0;transition:opacity 0.3s;max-width:90vw;text-align:center;';
            el.style.background = b[t] || b.info;
            el.style.color = c[t] || c.info;
            document.body.appendChild(el);
            _activeToast = el;
            requestAnimationFrame(function() { el.style.opacity = '1'; });
            _toastTimeout = setTimeout(function() {
                el.style.opacity = '0';
                setTimeout(function() { if (_activeToast === el) _activeToast = null; el.remove(); }, 300);
            }, 4000);
        }

        // --- Client-side rate limiting for auth forms ---
        var authCooldowns = {};
        function isAuthOnCooldown(id, s) {
            var n = Date.now();
            if (authCooldowns[id] && n - authCooldowns[id] < s * 1000) return true;
            authCooldowns[id] = n;
            return false;
        }

        // --- Fetch with exponential backoff retry ---
        async function fetchWithRetry(url, maxR) {
            maxR = maxR || 3;
            var lastErr;
            for (var i = 0; i < maxR; i++) {
                try {
                    var resp = await fetch(url);
                    if (!resp.ok) throw new Error('HTTP ' + resp.status);
                    return resp;
                } catch(e) {
                    lastErr = e;
                    if (i < maxR - 1) await new Promise(function(r) { setTimeout(r, Math.pow(2, i) * 500); });
                }
            }
            throw lastErr;
        }


        // --- UTILITY: Password visibility toggle ---
        function togglePasswordVisibility(inputId) {
            const input = document.getElementById(inputId);
            const btn = input.parentElement.querySelector('.password-toggle');
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            btn.setAttribute('aria-label', isPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
            btn.innerHTML = isPassword
                ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
                : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
        }

        // --- UTILITY: Password strength indicator ---
        function updatePasswordStrength() {
            const password = document.getElementById('signup-password').value;
            const bar = document.getElementById('password-strength-bar');
            const text = document.getElementById('password-strength-text');
            if (!bar || !text) return;
            if (!password) { bar.className = 'password-strength-bar'; text.textContent = ''; return; }
            let score = 0;
            if (password.length >= 8) score++;
            if (/[A-Z]/.test(password)) score++;
            if (/[a-z]/.test(password)) score++;
            if (/[0-9]/.test(password)) score++;
            if (/[^A-Za-z0-9]/.test(password)) score++;
            const levels = [
                { cls: 'weak', label: 'Faible' },
                { cls: 'fair', label: 'Moyen' },
                { cls: 'good', label: 'Bon' },
                { cls: 'strong', label: 'Excellent !' }
            ];
            const idx = Math.min(Math.max(score - 1, 0), levels.length - 1);
            bar.className = 'password-strength-bar ' + levels[idx].cls;
            text.textContent = levels[idx].label;
        }

        // --- UTILITY: Button loading state ---
        function setButtonLoading(btnId, isLoading) {
            const btn = document.getElementById(btnId);
            if (!btn) return;
            btn.disabled = isLoading;
            btn.style.opacity = isLoading ? '0.7' : '';
            btn.style.cursor = isLoading ? 'not-allowed' : '';
            if (isLoading) {
                btn.dataset.originalText = btn.textContent;
                btn.textContent = 'Chargement...';
            } else {
                btn.textContent = btn.dataset.originalText || btn.textContent;
            }
        }

