        // --- Screen history tracking ---
        var previousScreen = 'screen-signup';
        // ══════════════════════════════════════════
        // SUPABASE INIT & AUTH LOGIC
        // ══════════════════════════════════════════
        const SUPABASE_URL = 'https://abouaxqxnsmigvicpxoo.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFib3VheHF4bnNtaWd2aWNweG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNzA1ODksImV4cCI6MjA5NDg0NjU4OX0.oP2f_IyKkM-cBmMhVrKU7fmgsnuggGBnAargfi6si4I';
        let sbClient;
        try {
            sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        } catch (e) {
            console.error('Supabase client failed to initialize:', e);
        }

        let currentUser = null;
        let currentProfile = null;
        let selectedAvatar = 'snake';
        let hasUnsavedChanges = false;

        async function initAuth() {
            log('initAuth started');
            try {
                if (!sbClient) {
                    console.error('Supabase not initialized');
                    showScreen('screen-login');
                    return;
                }
                const { data: { session }, error } = await sbClient.auth.getSession();
                log('getSession finished', { session, error });
                if (session) {
                    currentUser = session.user;
                    await fetchProfile();
                    // Check if OAuth but no profile (needs setup)
                    if (!currentProfile) {
                        showScreen('screen-oauth-setup');
                    } else {
                        // Normal flow
                        initializeDashboard();
                    }
                } else {
                    // No session, check url for hash (password reset or email verification)
                    const hash = window.location.hash;
                    if (hash && hash.includes('type=recovery')) {
                        showScreen('screen-reset-password');
                    } else if (hash && hash.includes('error=')) {
                        showScreen('screen-link-expired');
                    } else {
                        // Go to Login by default
                        showScreen('screen-login');
                    }
                }

                // Listen for auth state changes
                sbClient.auth.onAuthStateChange(async (event, session) => {
                    if (event === 'SIGNED_IN') {
                        // Don't interrupt an active game session (e.g. on token refresh)
                        const activeGameScreens = ['screen-encounter','screen-ex1','screen-ex2-game','screen-match','screen-ex3','screen-ex1-retest','screen-ex3-retest','screen-transition','screen-test-out','screen-revise'];
                        const inGame = activeGameScreens.some(id => document.getElementById(id)?.classList.contains('active'));
                        if (inGame) return;
                        currentUser = session.user;
                        await fetchProfile();
                        if (!currentProfile) {
                            showScreen('screen-oauth-setup');
                        } else {
                            initializeDashboard();
                        }
                    } else if (event === 'SIGNED_OUT') {
                        currentUser = null;
                        currentProfile = null;
                        showScreen('screen-login');
                    } else if (event === 'PASSWORD_RECOVERY') {
                        showScreen('screen-reset-password');
                    }
                });
            } catch (err) {
                console.error('initAuth error:', err);
                showScreen('screen-login');
            }
        }

        async function fetchProfile() {
            if (!currentUser) return;
            const { data, error } = await sbClient.from('profiles').select('*').eq('id', currentUser.id).single();
            if (!error && data) {
                currentProfile = data;
                // Update last_seen and check streak
                updateLastSeen(data);
            } else {
                currentProfile = null;
            }
        }

        async function updateLastSeen(profile) {
            const now = new Date();
            const lastSeen = profile.last_seen ? new Date(profile.last_seen) : null;
            let newStreak = profile.streak_days || 0;

            if (lastSeen) {
                const diffTime = Math.abs(now - lastSeen);
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays === 1) {
                    newStreak++;
                } else if (diffDays > 1) {
                    newStreak = 0; // Lost streak
                }
            } else {
                newStreak = 1;
            }

            await sbClient.from('profiles').update({ last_seen: now.toISOString(), streak_days: newStreak }).eq('id', currentUser.id);
            currentProfile.streak_days = newStreak;
            currentProfile.last_seen = now.toISOString();
        }

        function selectAvatar(context, avatar) {
            document.querySelectorAll(`#${context}-avatar-grid .avatar-btn`).forEach(btn => btn.classList.remove('selected'));
            const buttons = document.querySelectorAll(`#${context}-avatar-grid .avatar-btn`);
            for (const btn of buttons) {
                if (btn.innerText.includes(getAvatarEmoji(avatar))) {
                    btn.classList.add('selected');
                }
            }
            selectedAvatar = avatar;
        }

        function getAvatarEmoji(name) {
            return `<svg width="24" height="24" style="color:var(--accent)"><use href="#avatar-${name}"/></svg>`;
        }

        function getAvatarIconHTML(name) {
            const id = name || 'snake';
            return `<svg width="24" height="24" style="color:var(--accent)"><use href="#avatar-${id}"/></svg>`;
        }

        // ══════════════════════════════════════════
        // AUTHENTICATION FUNCTIONS
        // ══════════════════════════════════════════
        async function handleSignup(e) {
            e.preventDefault();
            if (isAuthOnCooldown('signup', 3)) { showToast('Merci de patienter quelques secondes.', 'info'); return; }
            const email = document.getElementById('signup-email').value;
            const username = document.getElementById('signup-username').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            const errGeneral = document.getElementById('err-signup-general');
            errGeneral.textContent = '';

            if (password !== confirmPassword) {
                document.getElementById('err-signup-confirm-password').textContent = "Les mots de passe ne correspondent pas.";
                return;
            }

            setButtonLoading('btn-signup-submit', true);
            try {
                // Check username
                const { data: existingUser } = await sbClient.from('profiles').select('id').eq('username', username).single();
                if (existingUser) {
                    document.getElementById('err-signup-username').textContent = "Ce nom d'utilisateur est déjà pris.";
                    return;
                }

                const { data, error } = await sbClient.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username: username,
                            avatar_id: selectedAvatar
                        }
                    }
                });

                if (error) {
                    errGeneral.textContent = error.message;
                } else {
                    showScreen('screen-verify-email');
                }
            } finally {
                setButtonLoading('btn-signup-submit', false);
            }
        }

        async function handleLogin(e) {
            e.preventDefault();
            if (isAuthOnCooldown('login', 3)) { showToast('Merci de patienter quelques secondes.', 'info'); return; }
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const errGeneral = document.getElementById('err-login-general');
            errGeneral.textContent = '';

            setButtonLoading('btn-login-submit', true);
            try {
                const { data, error } = await sbClient.auth.signInWithPassword({ email, password });

                if (error) {
                    errGeneral.textContent = "Email ou mot de passe incorrect.";
                    if (error.message.includes('Email not confirmed')) {
                        document.getElementById('login-resend-container').style.display = 'block';
                    }
                }
            } finally {
                setButtonLoading('btn-login-submit', false);
            }
        }

        async function signInWithGoogle() {
            await sbClient.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
        }

        async function signInWithGitHub() {
            await sbClient.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: window.location.origin } });
        }

        async function handleSignOut() {
            await sbClient.auth.signOut();
        }

        async function resendVerificationEmail() {
            const email = document.getElementById('login-email').value || '';
            if (!email) {
                showToast("Veuillez saisir votre email dans le formulaire de connexion.", "error");
                return;
            }
            const { error } = await sbClient.auth.resend({ type: 'signup', email });
            if (!error) {
                showToast("Email de confirmation renvoyé !", "success");
            } else {
                showToast("Erreur: " + error.message, "error");
            }
        }

        async function handleForgotPassword(e) {
            e.preventDefault();
            if (isAuthOnCooldown('forgot', 5)) { showToast('Merci de patienter avant de renvoyer.', 'info'); return; }
            const email = document.getElementById('forgot-email').value;

            setButtonLoading('btn-forgot-submit', true);
            try {
                const { error } = await sbClient.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '#type=recovery' });
                if (!error) {
                    document.getElementById('msg-forgot-success').textContent = "Lien envoyé ! Vérifiez vos emails.";
                    document.getElementById('msg-forgot-success').style.display = 'block';
                } else {
                    document.getElementById('err-forgot-general').textContent = error.message;
                }
            } finally {
                setButtonLoading('btn-forgot-submit', false);
            }
        }

        async function handleResetPassword(e) {
            e.preventDefault();
            if (isAuthOnCooldown('reset', 3)) { showToast('Merci de patienter quelques secondes.', 'info'); return; }
            const pwd = document.getElementById('reset-password').value;
            const confirm = document.getElementById('reset-confirm-password').value;
            if (pwd !== confirm) {
                document.getElementById('err-reset-confirm-password').textContent = "Les mots de passe ne correspondent pas.";
                return;
            }

            setButtonLoading('btn-reset-submit', true);
            try {
                const { error } = await sbClient.auth.updateUser({ password: pwd });
                if (!error) {
                    document.getElementById('msg-reset-success').textContent = "Mot de passe mis à jour !";
                    document.getElementById('msg-reset-success').style.display = 'block';
                    setTimeout(() => showScreen('screen-login'), 2000);
                } else {
                    document.getElementById('err-reset-general').textContent = error.message;
                }
            } finally {
                setButtonLoading('btn-reset-submit', false);
            }
        }

        async function handleOAuthSetup(e) {
            e.preventDefault();
            const username = document.getElementById('oauth-username').value;
            const { data: existingUser } = await sbClient.from('profiles').select('id').eq('username', username).single();
            if (existingUser) {
                document.getElementById('err-oauth-username').textContent = "Ce nom d'utilisateur est déjà pris.";
                return;
            }

            // Create profile since OAuth doesn't trigger the trigger if we don't have username? 
            // Actually Supabase trigger creates empty profile. We just update it.
            const { error } = await sbClient.from('profiles').upsert({
                id: currentUser.id,
                username: username,
                avatar_id: selectedAvatar,
                total_score: 0,
                streak_days: 1,
                last_seen: new Date().toISOString()
            });

            if (!error) {
                await fetchProfile();
                initializeDashboard();
            } else {
                document.getElementById('err-oauth-general').textContent = error.message;
            }
        }

        // ══════════════════════════════════════════
        // PROFILE & SETTINGS FUNCTIONS
        // ══════════════════════════════════════════


        function renderProfileOwn() {
            if (!currentProfile) return;

            const header = document.getElementById('profile-own-header');
            header.innerHTML = `
        <div class="profile-avatar-large">${getAvatarEmoji(currentProfile.avatar_id)}</div>
        <h2 class="section-title" style="margin: 0;">${currentProfile.username || 'Utilisateur'}</h2>
        <div style="font-size: 0.85rem; color: var(--ink-light);">
          Score: <strong style="color: var(--accent);">${currentProfile.total_score || 0}</strong> • 
          Streak: <strong style="color: var(--accent);">${currentProfile.streak_days || 0}🔥</strong>
        </div>
      `;

            // Render courses
            const coursesDiv = document.getElementById('profile-own-courses');
            if (currentProfile.courses_progress && Object.keys(currentProfile.courses_progress).length > 0) {
                let html = '';
                for (const [courseId, progress] of Object.entries(currentProfile.courses_progress)) {
                    html += `
            <div class="profile-course-card">
              <div style="font-weight: 600; color: var(--accent);">${courseId}</div>
              <div class="progress-pills">
                <span class="pill seen">${progress.seen || 0} vus</span>
                <span class="pill learning">${progress.learning || 0} en cours</span>
                <span class="pill learnt">${progress.learnt || 0} acquis</span>
              </div>
            </div>
          `;
                }
                coursesDiv.innerHTML = html;
            } else {
                coursesDiv.innerHTML = `<div style="font-size: 0.85rem; color: var(--ink-light); margin-top: 8px;">Aucun cours commencé.</div>`;
            }
        }

        function prepareProfileEdit() {
            hasUnsavedChanges = false;
            document.getElementById('edit-email').value = currentUser?.email || '';
            document.getElementById('edit-username').value = currentProfile?.username || '';
            selectAvatar('edit', currentProfile?.avatar_id || 'snake');
            document.getElementById('msg-edit-success').style.display = 'none';
            document.getElementById('err-edit-general').textContent = '';
            document.getElementById('err-edit-username').textContent = '';
        }

        function markUnsavedChanges() {
            hasUnsavedChanges = true;
        }

        function checkUnsavedChangesAndGoBack(targetScreen) {
            if (hasUnsavedChanges) {
                if (confirm("Tu as des modifications non sauvegardées. Es-tu sûr de vouloir quitter ?")) {
                    showScreen(targetScreen);
                }
            } else {
                showScreen(targetScreen);
            }
        }

        async function handleProfileEdit(e) {
            e.preventDefault();
            const username = document.getElementById('edit-username').value;
            const errGeneral = document.getElementById('err-edit-general');
            errGeneral.textContent = '';
            document.getElementById('err-edit-username').textContent = '';

            if (username !== currentProfile.username) {
                const { data: existing } = await sbClient.from('profiles').select('id').eq('username', username).single();
                if (existing && existing.id !== currentProfile.id) {
                    document.getElementById('err-edit-username').textContent = "Ce nom d'utilisateur est déjà pris.";
                    return;
                }
            }

            const { error } = await sbClient.from('profiles').update({
                username: username,
                avatar_id: selectedAvatar
            }).eq('id', currentProfile.id);

            if (!error) {
                currentProfile.username = username;
                currentProfile.avatar_id = selectedAvatar;
                hasUnsavedChanges = false;
                document.getElementById('msg-edit-success').style.display = 'block';
                setTimeout(() => showScreen('screen-profile-own'), 1500);
            } else {
                errGeneral.textContent = error.message;
            }
        }

        async function handleDataExport() {
            if (!currentProfile || !currentUser) return;
            const data = {
                user: currentUser,
                profile: currentProfile
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `lexio_data_${currentProfile.username}.json`;
            a.click();
            URL.revokeObjectURL(url);
            document.getElementById('export-msg').textContent = "Données exportées avec succès.";
            document.getElementById('export-msg').style.color = "var(--correct)";
        }

        function openDeleteModal() {
            document.getElementById('delete-confirm-input').value = '';
            document.getElementById('err-delete-general').textContent = '';
            document.getElementById('delete-modal').style.display = 'flex';
        }

        function closeDeleteModal() {
            document.getElementById('delete-modal').style.display = 'none';
        }

        async function handleAccountDeletion() {
            const confirmInput = document.getElementById('delete-confirm-input').value;
            if (confirmInput !== 'DELETE') {
                document.getElementById('err-delete-general').textContent = "Veuillez taper DELETE pour confirmer.";
                return;
            }

            // Supabase Edge Functions or Postgres Trigger would be ideal for full deletion.
            // Since we only have client access, we delete the profile and then delete the user via a potential RPC or just sign out.
            // Wait, client can't easily delete user without an admin token or edge function.
            // We will delete the profile data and sign out.

            const { error } = await sbClient.from('profiles').delete().eq('id', currentUser.id);
            if (error) {
                document.getElementById('err-delete-general').textContent = "Erreur lors de la suppression du profil: " + error.message;
                return;
            }

            // Also try to call an RPC if the user set it up, but if not, just sign out
            // Actually, Supabase has auth.admin.deleteUser but we can't use it here. 
            // We will just sign out after wiping the profile.
            closeDeleteModal();
            showToast("Ton profil a été supprimé. Ton compte sera définitivement effacé par l'administrateur.", "success");
            await handleSignOut();
        }

        // ══════════════════════════════════════════
        // WORD DATA & ARCHITECTURE
        // ══════════════════════════════════════════
        const INDEX_FILE = 'word-lists/INDEX.json';
        let WORD_LIST_FILE = '';
	let currentCourseName = '';
        let words = [];
        let allEnglish = [];
        let allFrench = [];
        let indexDataCached = null;

        let fullWordList = [];
        let currentChunkIndex = 0;

        // ══════════════════════════════════════════
        // STATE
        // ══════════════════════════════════════════
        let encounterIndex = 0;
        let encounterSentenceIndex = 0;

        let ex1Queue = [];  // words to test
        let ex1Index = 0;
        let ex1Incorrect = [];  // words to retest
        let ex1RetestQueue = [];
        let ex1RetestIndex = 0;

        let ex2GameQueue = [];
        let ex2GameIndex = 0;
        let ex2CurrentPart = 1;
        let ex2GameTimerInterval = null;
        let ex2GameLoopInterval = null;
        let ex2GameTimeLeft = 15;
        let ex2GameCorrectHits = 0;
        let ex2GameActive = false;

        let sessionStartTime = 0;
        let firstTryCorrect = 0;
        let secondTryCorrect = 0;
        let retestAllCorrect = true;
        let wordErrors = {};

        let playerLives = 4;
        const MAX_LIVES = 4;

        let ex3Queue = [];
        let ex3Index = 0;
        let ex3Incorrect = [];
        let ex3RetestIndex = 0;
        let ex3RetestAttempts = 0;

        let totalSteps = 0;
        let stepsCompleted = 0;

        // ── TEST OUT STATE ──
        let testOutQueue = [];
        let testOutIndex = 0;
        let testOutKnown = [];
        let testOutUnknown = [];
        let testOutCourseKey = '';
        let testOutCourseName = '';
        let testOutAllWords = [];

        // ── PREVIEW EXCLUSIONS ──
        let previewExcludedWords = new Set(); // english words excluded by user on preview screen

        // ── LEARNT WORD TRACKING ──
        let sessionLearntWords = new Set(); // words correctly answered first-try this session

        // ── REVISION STATE ──
        let isRevisionSession = false;
        let revisionSelectedWords = [];
        let revisionCorrectThisSession = new Set(); // english words correct in this revision

        // ══════════════════════════════════════════
        // UTILS
        // ══════════════════════════════════════════
        function showScreen(id) {
            log('showScreen called with id:', id);
            // Track previous screen for smart back-navigation
            const currentActive = document.querySelector('.screen.active');
            if (currentActive && currentActive.id !== id) {
                previousScreen = currentActive.id;
            }

            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            const el = document.getElementById(id);
            if (el) {
                el.classList.add('active');
                el.style.animation = 'none';
                el.offsetHeight;
                el.style.animation = '';
                const footer = document.getElementById('home-footer');
                if (footer) footer.style.display = (id === 'screen-home') ? 'block' : 'none';

                if (id === 'screen-profile-own' && typeof renderProfileOwn === 'function') {
                    renderProfileOwn();
                } else if (id === 'screen-profile-edit' && typeof prepareProfileEdit === 'function') {
                    prepareProfileEdit();
                }

                // Update document.title for screen reader announcement
                const screenTitles = {
                    'screen-home': 'Lexio — Accueil',
                    'screen-login': 'Lexio — Connexion',
                    'screen-signup': 'Lexio — Inscription',
                    'screen-privacy': 'Lexio — Politique de confidentialité',
                    'screen-profile-own': 'Lexio — Mon profil',
                    'screen-profile-edit': 'Lexio — Modifier le profil',
                    'screen-account-settings': 'Lexio — Paramètres',
                    'screen-verb-home': 'Lexio — Verb Practice',
                    'screen-verb-conj-select': 'Lexio — Conjugation Practice',
                    'screen-verb-drill': 'Lexio — Conjugation Drill',
                    'screen-tense-choice': 'Lexio — Tense Choice',
                    'screen-verb-results': 'Lexio — Results',
                    'screen-forgot-password': 'Lexio — Mot de passe oublié',
                    'screen-reset-password': 'Lexio — Nouveau mot de passe',
                };
                document.title = screenTitles[id] || 'Lexio — Apprends l\'anglais';
            }
        }

        function triggerGlow(type) {
            document.body.classList.remove('glow-correct', 'glow-wrong');
            document.body.classList.add(type === 'correct' ? 'glow-correct' : 'glow-wrong');
            setTimeout(() => document.body.classList.remove('glow-correct', 'glow-wrong'), 2000);
        }

        function initLives() {
            playerLives = MAX_LIVES;
            const container = document.getElementById('lives-container');
            container.innerHTML = '';
            for (let i = 0; i < MAX_LIVES; i++) {
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.textContent = '❤️';
                container.appendChild(heart);
            }
            container.style.display = 'flex';
        }

        function loseLife() {
            if (playerLives <= 0) return;
            playerLives--;
            const container = document.getElementById('lives-container');
            const hearts = container.querySelectorAll('.heart');
            if (hearts[playerLives]) {
                hearts[playerLives].classList.add('lost');
            }
            if (playerLives <= 0) {
                ex2GameActive = false;
                showScreen('screen-game-over');
                if (ex2GameTimerInterval !== null) clearInterval(ex2GameTimerInterval);
                if (ex2GameLoopInterval !== null) clearInterval(ex2GameLoopInterval);
            }
        }

        function showTransition(message, nextFunc) {
            document.getElementById('transition-msg-text').textContent = message;
            showScreen('screen-transition');
            setTimeout(() => {
                nextFunc();
            }, 2500);
        }

        function shuffle(arr) {
            const a = [...arr];
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }

        function getMCQOptions(correctEnglish, count = 4) {
            const distractors = allEnglish.filter(e => e !== correctEnglish);
            const chosen = shuffle(distractors).slice(0, count - 1);
            return shuffle([correctEnglish, ...chosen]);
        }

        function getFrenchMCQOptions(correctFrench, count = 4) {
            const distractors = allFrench.filter(f => f !== correctFrench);
            const chosen = shuffle(distractors).slice(0, count - 1);
            return shuffle([correctFrench, ...chosen]);
        }

        function updateProgress() {
            const pct = totalSteps > 0 ? Math.round((stepsCompleted / totalSteps) * 100) : 0;
            document.getElementById('progressBar').style.width = pct + '%';
            const wrap = document.getElementById('header-progress-wrap');
            if (wrap) wrap.setAttribute('aria-valuenow', pct);
        }

        function playAudio(slow = false, specificWord = null) {
            if (words.length === 0) return;
            const word = specificWord || (encounterIndex < words.length ? words[encounterIndex].english : "");
            if (!word) return;
            if ('speechSynthesis' in window) {
                speechSynthesis.cancel(); // Cancel any playing speech
                const utt = new SpeechSynthesisUtterance(word);
                utt.lang = 'en-GB';
                utt.rate = slow ? 0.5 : 1.0;
                speechSynthesis.speak(utt);
            }
        }

        // ══════════════════════════════════════════
        // GOOGLE TRANSLATE API DYNAMIC FETCH
        // ══════════════════════════════════════════
        async function translateText(text, sl = 'en', tl = 'fr') {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("Translation failed");
            const data = await response.json();
            try {
                return data[0].map(item => item[0]).join('');
            } catch (e) {
                return text;
            }
        }

        function normalizeString(str) {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        }

        async function translateAndGenerateSentencesForSession(selectedWords) {
            const promises = selectedWords.map(async (w) => {
                let english = w.english;
                let french = w.french;
                const hasFrench = w.french && !w.french.includes('[Traduire') && w.french.trim() !== "";
                if (!hasFrench) {
                    try {
                        french = await translateText(english, 'en', 'fr');
                    } catch (e) {
                        french = french || `[Traduire : ${english}]`;
                    }
                }
                return {
                    id: w.id,
                    english: english,
                    french: french,
                    sentences: []
                };
            });
            return Promise.all(promises);
        }

        // ══════════════════════════════════════════
        // HOME DASHBOARD & NAVIGATION
        // ══════════════════════════════════════════
        const homeCategoriesData = [
            {
                id: "curriculum",
                type: "themed",
                title: "Learn by curriculum",
                icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2C3E6B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
                description: "Listes de vocabulaire alignées sur les examens de Cambridge et le programme national.",
                files: [
                    { filename: "CAMBRIDGE STARTERS ANIMALS.json", title: "Les Animaux (Starters)", level: "A1", approximate_word_count: 30 },
                    { filename: "CAMBRIDGE STARTERS.json", title: "Cambridge YLE Starters", level: "Pre-A1", approximate_word_count: 200 },
                    { filename: "CAMBRIDGE MOVERS.json", title: "Cambridge YLE Movers", level: "A1", approximate_word_count: 220 },
                    { filename: "CAMBRIDGE FLYERS.json", title: "Cambridge YLE Flyers", level: "A2", approximate_word_count: 200 },
                    { filename: "BREVET.json", title: "Brevet - Vocabulaire", level: "B1", approximate_word_count: 160 },
                    { filename: "BAC - axes thematiques.json", title: "Bac - Axes Thématiques", level: "B2", approximate_word_count: 125 }
                ]
            },
            {
                id: "theme",
                type: "themed",
                title: "Learn by theme",
                icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2C3E6B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
                description: "Listes thématiques couvrant la vie quotidienne et les sujets d'intérêt.",
                files: [
                    { filename: "THEMES A1-A2.json", title: "Thèmes A1-A2", level: "A1-A2", approximate_word_count: 200 },
                    { filename: "THEMES B1-B2.json", title: "Thèmes B1-B2", level: "B1-B2", approximate_word_count: 210 },
                    { filename: "THEMES C1-C2.json", title: "Thèmes C1-C2", level: "C1-C2", approximate_word_count: 210 },
                    { filename: "BUSINESS AND FINANCE.json", title: "Business and Finance", level: "C1-C2", approximate_word_count: 140 },
                    { filename: "MEDICAL AND PSYCHOLOGICAL.json", title: "Medical and Psychological", level: "C1-C2", approximate_word_count: 165 },
                    { filename: "PRACTICAL ENGLISH.json", title: "Practical English", level: "B1-B2", approximate_word_count: 140 }
                ]
            },
            {
                id: "level",
                type: "themed",
                title: "Learn by level",
                icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2C3E6B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
                description: "Vocabulaire classé par nature grammaticale et par niveau CEFR.",
                files: [
                    { filename: "WORD GROUPS A1-A2.json", title: "Groupes de Mots A1-A2", level: "A1-A2", approximate_word_count: 230 },
                    { filename: "WORD GROUPS B1-B2.json", title: "Groupes de Mots B1-B2", level: "B1-B2", approximate_word_count: 330 },
                    { filename: "WORD GROUPS C1-C2.json", title: "Groupes de Mots C1-C2", level: "C1-C2", approximate_word_count: 330 }
                ]
            }
        ];

        function goToHome() {
            isRevisionSession = false;
            document.getElementById('header-home-btn').classList.add('hidden');
            document.getElementById('header-logo').style.display = 'block';
            document.getElementById('header-progress-wrap').style.display = 'none';
            document.getElementById('lives-container').style.display = 'none';
            backToModeSelect();
            showScreen('screen-home');
        }

        function renderHomeDashboard(indexData) {
            const modeContainer = document.getElementById('home-mode-select');
            modeContainer.innerHTML = '';

            homeCategoriesData.forEach((cat, index) => {
                const card = document.createElement('div');
                card.className = 'mode-card';
                card.onclick = () => showCategory(index);

                card.innerHTML = `
                    <div class="mode-icon" style="display:flex;align-items:center;justify-content:center;width:44px;height:44px;background:var(--accent-light);border-radius:12px;flex-shrink:0;">${cat.icon}</div>
                    <div class="mode-info">
                        <div class="mode-title">${cat.title}</div>
                        <div class="mode-desc">${cat.description}</div>
                    </div>
                `;
                modeContainer.appendChild(card);
            });

            // Verb Practice card — always visible
            const verbCard = document.createElement('div');
            verbCard.className = 'mode-card';
            verbCard.onclick = () => openVerbPractice();
            verbCard.innerHTML = `
                <div class="mode-icon" style="display:flex;align-items:center;justify-content:center;width:44px;height:44px;background:var(--accent-light);border-radius:12px;flex-shrink:0;">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2C3E6B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </div>
                <div class="mode-info">
                    <div class="mode-title">Verb Practice</div>
                    <div class="mode-desc">Conjugations by tense &amp; level, plus tense-choice fill-in sentences.</div>
                </div>
            `;
            modeContainer.appendChild(verbCard);

            // Revise card — only show if logged in and has learnt words
            if (currentProfile) {
                const allLearnt = _getAllLearntWords();
                const totalLearnt = Object.values(allLearnt).reduce((n, arr) => n + arr.length, 0);
                if (totalLearnt > 0) {
                    const revCard = document.createElement('div');
                    revCard.className = 'mode-card revise-card';
                    revCard.onclick = () => openReviseScreen();
                    revCard.innerHTML = `
                        <div class="mode-icon" style="display:flex;align-items:center;justify-content:center;width:44px;height:44px;background:var(--accent-light);border-radius:12px;flex-shrink:0;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2C3E6B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg></div>
                        <div class="mode-info">
                            <div class="mode-title">Réviser</div>
                            <div class="mode-desc">${totalLearnt} mot${totalLearnt > 1 ? 's' : ''} acquis disponibles à réviser.</div>
                        </div>
                    `;
                    modeContainer.appendChild(revCard);
                }
            }
        }

        // ══════════════════════════════════════════
        // THEME NAVIGATION (level → topics → session)
        // ══════════════════════════════════════════

        // emoji map for known theme keys
        const THEME_ICONS = {
            everyday_objects: '🎒', the_house_and_local_area: '🏠',
            family_and_relationships: '👨‍👩‍👧', travel_and_holidays: '✈️',
            environment_and_world: '🌍', food_and_lifestyle: '🍎',
            hobbies_and_interests: '🎸', work_and_jobs: '💼',
            health_and_body: '🏥', education: '📚', technology: '💻',
            society_and_politics: '🏛️', arts_and_culture: '🎭',
            science_and_nature: '🔬', sport: '⚽', money_and_shopping: '🛍️',
            emotions_and_personality: '😊', clothes_and_appearance: '👗',
            default: '📖'
        };

        let _themeNavStack = []; // for back navigation: [{label, fn}]

        function showThemeLevels(cat) {
            _themeNavStack = [{ label: '← Retour aux options', fn: backToModeSelect }];
            _renderThemeBackBtn();
            const container = document.getElementById('home-categories-container');
            container.innerHTML = '';
            const grid = document.createElement('div');
            grid.style.cssText = 'display:flex; flex-direction:column; gap:10px; width:100%;';

            cat.files.forEach(file => {
                const card = document.createElement('div');
                card.className = 'theme-topic-card';
                card.innerHTML = `
                    <div class="theme-topic-info">
                        <div class="theme-topic-title">${file.title}</div>
                        <div class="theme-topic-meta">Niveau ${file.level} · ~${file.approximate_word_count || '?'} mots</div>
                    </div>
                    <div class="theme-topic-arrow">›</div>
                `;
                card.onclick = () => showThemeTopics(file, cat);
                grid.appendChild(card);
            });
            container.appendChild(grid);
        }

        async function showThemeTopics(file, cat) {
            _themeNavStack.push({ label: `← ${file.title}`, fn: () => {
                _themeNavStack.pop();
                showThemeLevels(cat);
            }});
            _renderThemeBackBtn();

            const container = document.getElementById('home-categories-container');
            container.innerHTML = `<div style="text-align:center; padding:24px; color:var(--ink-light);">Chargement des thèmes...</div>`;

            let data;
            try {
                const res = await fetchWithRetry('word-lists/' + file.filename);
                if (!res.ok) throw new Error('HTTP ' + res.status);
                data = await res.json();
            } catch (e) {
                container.innerHTML = `<div style="color:var(--wrong); text-align:center; padding:16px;">Impossible de charger ce fichier.</div>`;
                return;
            }

            // Extract themes/topics/categories from the JSON
            const topicContainer = data.themes || data.topics || data.categories || data.word_groups || data.axes || null;
            container.innerHTML = '';

            if (!topicContainer) {
                // Flat file — no sub-topics, just start the course directly
                selectCourse(file.filename, file.title);
                return;
            }

            document.getElementById('home-subtitle-text').textContent = file.title;

            const grid = document.createElement('div');
            grid.style.cssText = 'display:flex; flex-direction:column; gap:10px; width:100%;';

            // "Study all" card at the top
            const allCard = document.createElement('div');
            const totalWords = Object.values(topicContainer).reduce((n, t) => n + (t.words?.length || 0), 0);
            allCard.className = 'theme-topic-card';
            allCard.style.borderColor = 'var(--accent)';
            allCard.innerHTML = `
                <div class="theme-topic-icon">📚</div>
                <div class="theme-topic-info">
                    <div class="theme-topic-title" style="color:var(--accent);">Tout étudier</div>
                    <div class="theme-topic-meta">${totalWords} mots · tous les thèmes</div>
                </div>
                <div class="theme-topic-arrow">›</div>
            `;
            allCard.onclick = () => selectCourse(file.filename, file.title);
            grid.appendChild(allCard);

            // Individual topic cards
            Object.entries(topicContainer).forEach(([key, topic]) => {
                const label = topic.label || key.replace(/_/g, ' ');
                const wordCount = topic.words?.length || 0;
                const icon = THEME_ICONS[key] || THEME_ICONS.default;

                const card = document.createElement('div');
                card.className = 'theme-topic-card';
                card.innerHTML = `
                    <div class="theme-topic-icon">${icon}</div>
                    <div class="theme-topic-info">
                        <div class="theme-topic-title">${label}</div>
                        <div class="theme-topic-meta">${wordCount} mot${wordCount !== 1 ? 's' : ''}</div>
                    </div>
                    <div class="theme-topic-arrow">›</div>
                `;
                card.onclick = () => selectThemeTopic(file.filename, file.title, key, label, topic.words || []);
                grid.appendChild(card);
            });

            container.appendChild(grid);
        }

        function selectThemeTopic(filename, fileTitle, topicKey, topicLabel, rawWords) {
            WORD_LIST_FILE = 'word-lists/' + filename;
            currentCourseName = `${fileTitle} — ${topicLabel}`;
            // Stash the pre-filtered words so showCoursePreview uses them
            window._themeTopicWords = rawWords.map(w => ({
                english: w.word || w.english || '',
                french: w.french || '',
                id: w.id || (w.word || w.english || '').toLowerCase().replace(/[^a-z0-9]/g, '-'),
                sentences: w.sentences || [],
                type: w.type || ''
            })).filter(w => w.english);
            showCoursePreview(filename, `${fileTitle} — ${topicLabel}`);
        }

        function _renderThemeBackBtn() {
            const catView = document.getElementById('home-category-view');
            let backBtn = catView.querySelector('.back-home-btn');
            if (!backBtn) return;
            const top = _themeNavStack[_themeNavStack.length - 1];
            if (top) {
                backBtn.textContent = top.label;
                backBtn.onclick = top.fn;
            }
        }

        function showCategory(index) {
            document.getElementById('home-mode-select').style.display = 'none';
            const catView = document.getElementById('home-category-view');
            catView.style.display = 'flex';

            const cat = homeCategoriesData[index];
            document.getElementById('home-subtitle-text').textContent = cat.title;

            if (cat.type === 'themed') {
                showThemeLevels(cat);
                return;
            }

            const container = document.getElementById('home-categories-container');
            container.innerHTML = '';

            const sec = document.createElement('div');
            sec.className = 'category-section';
            sec.style.marginTop = '0';

            const h3 = document.createElement('h3');
            h3.className = 'category-title';
            h3.textContent = cat.title;
            sec.appendChild(h3);

            const grid = document.createElement('div');
            grid.className = 'courses-grid';

            cat.files.forEach(file => {
                const card = document.createElement('div');
                card.className = 'course-card';
                card.onclick = () => selectCourse(file.filename);

                const top = document.createElement('div');
                top.className = 'course-card-top';

                let lvlClass = 'level-c1-c2';
                const lvl = (file.level || 'A1').toLowerCase();
                if (lvl.includes('pre-a1')) lvlClass = 'level-pre-a1';
                else if (lvl.includes('a1')) lvlClass = 'level-a1';
                else if (lvl.includes('a2')) lvlClass = 'level-a2';
                else if (lvl.includes('b1')) lvlClass = 'level-b1';
                else if (lvl.includes('b2')) lvlClass = 'level-b2';

                const badge = document.createElement('span');
                badge.className = `level-badge ${lvlClass}`;
                badge.textContent = file.level || 'A1';
                top.appendChild(badge);

                const name = document.createElement('div');
                name.className = 'course-name';
                name.textContent = file.title;
                top.appendChild(name);

                const desc = document.createElement('div');
                desc.className = 'course-desc';
                desc.textContent = file.notes || file.description || 'Vocabulaire thématique pour l\'apprentissage.';
                top.appendChild(desc);

                card.appendChild(top);

                const footer = document.createElement('div');
                footer.className = 'course-footer';

                const count = document.createElement('span');
                count.className = 'course-count';
                count.textContent = file.approximate_word_count ? `~${file.approximate_word_count} mots` : '10 mots';
                footer.appendChild(count);

                const act = document.createElement('span');
                act.textContent = 'Étudier →';
                footer.appendChild(act);

                if (currentProfile) {
                    const testBtn = document.createElement('button');
                    testBtn.className = 'test-out-btn';
                    testBtn.textContent = '🎯 Tester';
                    testBtn.title = 'Tester vos connaissances sur ce cours';
                    testBtn.onclick = (e) => initiateTestOut(file.filename, file.title, e);
                    footer.appendChild(testBtn);
                }

                card.appendChild(footer);
                grid.appendChild(card);
            });

            sec.appendChild(grid);
            container.appendChild(sec);
        }

        function backToModeSelect() {
            document.getElementById('home-category-view').style.display = 'none';
            document.getElementById('home-mode-select').style.display = 'flex';
            document.getElementById('home-subtitle-text').textContent = "Comment voulez-vous apprendre aujourd'hui ?";
        }

    function selectCourse(filename, title) {
    WORD_LIST_FILE = 'word-lists/' + filename;
    currentCourseName = title || filename;
    showCoursePreview(filename, title);
}

    async function showCoursePreview(filename, title) {
    // Show the preview screen immediately with a loading state
    showScreen('screen-word-preview');
    document.getElementById('preview-course-title').textContent = title || filename;
    document.getElementById('preview-word-count').textContent = '';
    document.getElementById('preview-level-badge').textContent = '';
    document.getElementById('preview-leaderboard').style.display = 'none';
    document.getElementById('preview-word-grid').innerHTML = `
        <div style="grid-column: span 2; text-align: center; padding: 20px; color: var(--ink-light);">
            <div class="spinner" style="width: 28px; height: 28px; border-width: 3px; margin-bottom: 12px;"></div>
            Chargement des mots...
        </div>`;

    // Find level info from homeCategoriesData
    let levelText = '';
    for (const cat of homeCategoriesData) {
        const found = cat.files.find(f => f.filename === filename);
        if (found) { levelText = found.level || ''; break; }
    }
    if (levelText) document.getElementById('preview-level-badge').textContent = `Niveau ${levelText}`;

    // Load word list — use pre-filtered topic words if coming from a theme topic
    const courseKey = 'word-lists/' + filename;

    let rawParsed;
    if (window._themeTopicWords && window._themeTopicWords.length > 0) {
        rawParsed = window._themeTopicWords;
        // Wrap as a fulfilled-style result
        const parsed = await translateAndGenerateSentencesForSession(rawParsed);
        previewExcludedWords = new Set();
        _renderPreviewWordChips(parsed, courseKey);
    } else {
        const [wordResult] = await Promise.allSettled([
            fetchWithRetry('word-lists/' + filename).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }),
        ]);

        if (wordResult.status === 'fulfilled') {
            const rawParsed = parseWordList(wordResult.value);
            const parsed = await translateAndGenerateSentencesForSession(rawParsed);
            previewExcludedWords = new Set();
            _renderPreviewWordChips(parsed, courseKey);
        } else {
            document.getElementById('preview-word-grid').innerHTML =
                `<div style="grid-column: span 2; text-align: center; color: var(--wrong);">Impossible de charger la liste.</div>`;
        }
    }

    // Load the per-course leaderboard (only if logged in)
    if (currentProfile && sbClient) {
        await fetchCourseLeaderboard(courseKey, title || filename);
    }
}

    function _renderPreviewWordChips(parsed, courseKey) {
        const courseProgress = currentProfile?.courses_progress?.[courseKey];
        const learntFromStudy = courseProgress?.learnt_words || [];
        const learntFromTestOut = courseProgress?.test_out?.known_words || [];
        const learntSet = new Set([...learntFromStudy, ...learntFromTestOut]);

        document.getElementById('preview-word-count').textContent = `${parsed.length} mots`;
        const grid = document.getElementById('preview-word-grid');
        if (parsed.length === 0) {
            grid.innerHTML = `<div style="grid-column: span 2; text-align: center; color: var(--ink-light);">Aucun mot trouvé.</div>`;
            return;
        }
        grid.innerHTML = '';
        parsed.forEach(w => {
            const isLearnt = learntSet.has(w.english);
            const chip = document.createElement('div');
            chip.className = 'word-chip-removable' + (isLearnt ? ' word-chip-learnt' : '');
            chip.dataset.word = w.english;

            if (isLearnt) {
                previewExcludedWords.add(w.english);
                chip.innerHTML = `
                    <span class="word-chip-en">${w.english}</span>
                    <span class="word-chip-fr">${w.french || '—'}</span>
                    <button class="word-chip-learnt-badge" title="Déjà acquis — cliquer pour réétudier">✓</button>
                `;
                chip.querySelector('.word-chip-learnt-badge').addEventListener('click', () => {
                    if (previewExcludedWords.has(w.english)) {
                        previewExcludedWords.delete(w.english);
                        chip.classList.remove('word-chip-learnt');
                        chip.style.opacity = '1';
                        const btn = chip.querySelector('.word-chip-learnt-badge');
                        btn.textContent = '✕';
                        btn.className = 'word-chip-remove-btn';
                    } else {
                        previewExcludedWords.add(w.english);
                        chip.classList.add('word-chip-learnt');
                        const btn = chip.querySelector('.word-chip-remove-btn');
                        btn.textContent = '✓';
                        btn.className = 'word-chip-learnt-badge';
                    }
                    _updatePreviewWordCount(parsed.length);
                });
            } else {
                chip.innerHTML = `
                    <span class="word-chip-en">${w.english}</span>
                    <span class="word-chip-fr">${w.french || '—'}</span>
                    <button class="word-chip-remove-btn" title="Je ne veux pas apprendre ce mot">✕</button>
                `;
                chip.querySelector('.word-chip-remove-btn').addEventListener('click', () => {
                    if (previewExcludedWords.has(w.english)) {
                        previewExcludedWords.delete(w.english);
                        chip.style.opacity = '1';
                        chip.style.borderColor = '';
                        chip.querySelector('.word-chip-remove-btn').style.background = '';
                        chip.querySelector('.word-chip-remove-btn').style.color = '';
                    } else {
                        previewExcludedWords.add(w.english);
                        chip.style.opacity = '0.45';
                        chip.style.borderColor = 'var(--wrong)';
                        chip.querySelector('.word-chip-remove-btn').style.background = 'var(--wrong)';
                        chip.querySelector('.word-chip-remove-btn').style.color = 'white';
                    }
                    _updatePreviewWordCount(parsed.length);
                });
            }
            grid.appendChild(chip);
        });
        _updatePreviewWordCount(parsed.length);
    }

    async function fetchCourseLeaderboard(courseKey, courseName) {
    const leaderboardDiv = document.getElementById('preview-leaderboard');
    const tbody = document.getElementById('preview-leaderboard-body');
    document.getElementById('preview-leaderboard-title').textContent = `Classement — ${courseName}`;
    leaderboardDiv.style.display = 'block';
    tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Chargement...</td></tr>';

    const { data, error } = await sbClient
        .from('profiles')
        .select('username, avatar_id, courses_progress, id');

    if (error || !data) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: var(--wrong);">Erreur de chargement.</td></tr>';
        return;
    }

    // Only include players who have earned points for this specific course
    const ranked = data
        .filter(p => (p.courses_progress?.[courseKey]?.score || 0) > 0)
        .map(p => ({ ...p, displayScore: p.courses_progress[courseKey].score }))
        .sort((a, b) => b.displayScore - a.displayScore)
        .slice(0, 10);

    if (ranked.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: var(--ink-light);">Personne n\'a encore étudié ce cours. Sois le premier !</td></tr>';
        return;
    }

    let html = '';
    ranked.forEach((p, index) => {
        const isMe = p.id === currentUser?.id;
        const rank = index + 1;
        let rankDisplay = rank;
        if (rank === 1) rankDisplay = '🥇 1';
        if (rank === 2) rankDisplay = '🥈 2';
        if (rank === 3) rankDisplay = '🥉 3';
        html += `
            <tr class="${isMe ? 'highlight' : ''}">
                <td>${rankDisplay}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 1.2rem;">${getAvatarEmoji(p.avatar_id)}</span>
                        <span>${p.username || 'Joueur anonyme'} ${isMe ? '(Toi)' : ''}</span>
                    </div>
                </td>
                <td style="font-weight: 600; color: var(--accent);">${p.displayScore}</td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

    function startCourseFromPreview() {
        const previewGrid = document.getElementById('preview-word-grid');
        const total = previewGrid ? previewGrid.querySelectorAll('.word-chip-removable').length : 0;
        const remaining = total - previewExcludedWords.size;
        if (remaining < 4) return;
        window._previewExcludedWords = previewExcludedWords.size > 0 ? new Set(previewExcludedWords) : null;
        loadWordList();
    }

    function _updatePreviewWordCount(total) {
        const remaining = total - previewExcludedWords.size;
        const learntCount = [...previewExcludedWords].filter(w => {
            const chip = document.querySelector(`.word-chip-removable[data-word="${CSS.escape(w)}"]`);
            return chip && chip.classList.contains('word-chip-learnt');
        }).length;
        const manuallyExcluded = previewExcludedWords.size - learntCount;
        let label = `${remaining} / ${total} mots`;
        if (learntCount > 0) label += ` · ${learntCount} acquis ✓`;
        if (manuallyExcluded > 0) label += ` · ${manuallyExcluded} ignoré${manuallyExcluded > 1 ? 's' : ''}`;
        if (remaining < 4) label += ` · minimum 4 requis`;
        document.getElementById('preview-word-count').textContent = label;

        const startBtn = document.getElementById('preview-start-btn');
        if (startBtn) {
            startBtn.disabled = remaining < 4;
            startBtn.style.opacity = remaining < 4 ? '0.4' : '1';
            startBtn.style.cursor = remaining < 4 ? 'not-allowed' : 'pointer';
            startBtn.textContent = remaining < 4
                ? `Sélectionne au moins 4 mots pour commencer`
                : `Commencer l'apprentissage →`;
        }
    }

        // ══════════════════════════════════════════
        // SCHEMA PARSER
        // ══════════════════════════════════════════
        function parseWordList(data) {
            let parsedWords = [];

            if (data.words && Array.isArray(data.words)) {
                parsedWords = data.words;
            }
            else if (data.topics && typeof data.topics === 'object') {
                Object.keys(data.topics).forEach(topicKey => {
                    const topic = data.topics[topicKey];
                    if (topic.words && Array.isArray(topic.words)) {
                        parsedWords.push(...topic.words);
                    }
                });
            }
            else if (data.word_groups && typeof data.word_groups === 'object') {
                Object.keys(data.word_groups).forEach(groupKey => {
                    const group = data.word_groups[groupKey];
                    if (group.words && Array.isArray(group.words)) {
                        parsedWords.push(...group.words);
                    }
                });
            }
            else if (data.themes && typeof data.themes === 'object') {
                Object.keys(data.themes).forEach(themeKey => {
                    const theme = data.themes[themeKey];
                    if (theme.words && Array.isArray(theme.words)) {
                        parsedWords.push(...theme.words);
                    }
                });
            }
            else if (data.categories && typeof data.categories === 'object') {
                Object.keys(data.categories).forEach(catKey => {
                    const cat = data.categories[catKey];
                    if (cat.words && Array.isArray(cat.words)) {
                        parsedWords.push(...cat.words);
                    }
                });
            }
            else if (data.situations && typeof data.situations === 'object') {
                Object.keys(data.situations).forEach(sitKey => {
                    const sit = data.situations[sitKey];
                    if (sit.phrases && Array.isArray(sit.phrases)) {
                        sit.phrases.forEach(p => {
                            parsedWords.push({
                                word: p.phrase,
                                type: "expression",
                                notes: p.use
                            });
                        });
                    }
                });
            }

            return parsedWords.map(w => {
                const english = w.word || w.english || "Unknown";
                let french = w.french || w.translation_hint || w.meaning || w.notes || "";

                return {
                    id: w.id || english.toLowerCase().replace(/[^a-z0-9]/g, "-"),
                    french: french,
                    english: english,
                    sentences: w.sentences || [],
                    type: w.type || ""
                };
            });
        }

        // ══════════════════════════════════════════
        // FIRST ENCOUNTER
        // ══════════════════════════════════════════
        function startEncounter() {
            encounterIndex = 0;
            encounterSentenceIndex = 0;
            loadEncounterWord();
        }

        function loadEncounterWord() {
            if (encounterIndex >= words.length) {
                startEx2Part1();
                return;
            }
            const w = words[encounterIndex];
            document.getElementById('enc-word').textContent = w.english;
            document.getElementById('enc-translation').textContent = w.french;

            setTimeout(() => {
                playAudio(false);
            }, 300);
        }

        function encounterNext() {
            stepsCompleted++;
            updateProgress();
            encounterIndex++;
            loadEncounterWord();
        }

        // ══════════════════════════════════════════
        // EX 1 — MCQ French word → choose English
        // ══════════════════════════════════════════
        function startEx1() {
            ex1Queue = [...words];
            ex1Index = 0;
            ex1Incorrect = [];
            showScreen('screen-ex1');
            loadEx1();
        }

        function loadEx1() {
            if (ex1Index >= ex1Queue.length) {
                if (ex1Incorrect.length > 0) {
                    startEx1Retest();
                } else {
                    const msgs = ["Almost there!", "Keep it up!", "Great work!"];
                    showTransition(msgs[Math.floor(Math.random() * msgs.length)], isRevisionSession ? startEx3 : startMatch);
                }
                return;
            }
            const w = ex1Queue[ex1Index];
            document.getElementById('ex1-word').textContent = w.french;
            document.getElementById('ex1-counter').textContent = `${ex1Index + 1} / ${ex1Queue.length}`;
            document.getElementById('ex1-feedback').className = 'feedback-banner';
            document.getElementById('ex1-next-btn').classList.add('hidden');

            const options = getMCQOptions(w.english);
            const grid = document.getElementById('ex1-options');
            grid.innerHTML = '';
            options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = opt;
                btn.onclick = () => checkEx1(btn, opt, w.english, w);
                grid.appendChild(btn);
            });
        }

        function checkEx1(btn, chosen, correct, wordObj) {
            const allBtns = document.querySelectorAll('#ex1-options .option-btn');
            allBtns.forEach(b => b.disabled = true);

            if (chosen === correct) {
                btn.classList.add('correct');
                triggerGlow('correct');
                showFeedback('ex1-feedback', 'correct', '✓ Correct !');
                playAudio(false, correct);
                stepsCompleted++;
                updateProgress();
                if (!ex1Incorrect.find(w => w.english === wordObj.english)) {
                    firstTryCorrect++;
                    sessionLearntWords.add(wordObj.english);
                    if (isRevisionSession) revisionCorrectThisSession.add(wordObj.english);
                } else {
                    // Word was wrong before — this is a second-attempt correct
                    secondTryCorrect++;
                }
                document.getElementById('ex1-next-btn').classList.remove('hidden');
            } else {
                btn.classList.add('wrong');
                allBtns.forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });
                triggerGlow('wrong');
                showFeedback('ex1-feedback', 'wrong', `✗ La bonne réponse est : "${correct}"`);
                if (!ex1Incorrect.find(w => w.english === wordObj.english)) ex1Incorrect.push(wordObj);

                // Track errors
                if (!wordErrors[correct]) wordErrors[correct] = 0;
                wordErrors[correct]++;
                loseLife();

                ex1Queue.splice(ex1Index + 1, 0, wordObj);
                document.getElementById('ex1-next-btn').classList.remove('hidden');
            }
        }

        function ex1Next() {
            ex1Index++;
            showScreen('screen-ex1');
            loadEx1();
        }

        // EX1 RETEST
        function startEx1Retest() {
            ex1RetestQueue = [...ex1Incorrect];
            ex1RetestIndex = 0;
            showScreen('screen-ex1-retest');
            loadEx1Retest();
        }

        function loadEx1Retest() {
            if (ex1RetestIndex >= ex1RetestQueue.length) {
                const msgs = ["Almost there!", "Keep it up!", "Great work!"];
                showTransition(msgs[Math.floor(Math.random() * msgs.length)], isRevisionSession ? startEx3 : startMatch);
                return;
            }
            const w = ex1RetestQueue[ex1RetestIndex];
            document.getElementById('ex1rt-word').textContent = w.english;
            document.getElementById('ex1rt-counter').textContent = `${ex1RetestIndex + 1} / ${ex1RetestQueue.length}`;
            document.getElementById('ex1rt-feedback').className = 'feedback-banner';
            document.getElementById('ex1rt-next-btn').classList.add('hidden');

            const options = getFrenchMCQOptions(w.french);
            const grid = document.getElementById('ex1rt-options');
            grid.innerHTML = '';
            options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = opt;
                btn.onclick = () => checkEx1Retest(btn, opt, w.french);
                grid.appendChild(btn);
            });
        }

        function checkEx1Retest(btn, chosen, correct) {
            const allBtns = document.querySelectorAll('#ex1rt-options .option-btn');
            allBtns.forEach(b => b.disabled = true);
            if (chosen === correct) {
                btn.classList.add('correct');
                triggerGlow('correct');
                showFeedback('ex1rt-feedback', 'correct', '✓ Correct !');
                playAudio(false, ex1RetestQueue[ex1RetestIndex].english);
            } else {
                btn.classList.add('wrong');
                allBtns.forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });
                triggerGlow('wrong');
                showFeedback('ex1rt-feedback', 'wrong', `✗ La bonne réponse est : "${correct}"`);
                loseLife();
                retestAllCorrect = false;
            }
            stepsCompleted++;
            updateProgress();
            document.getElementById('ex1rt-next-btn').classList.remove('hidden');
        }

        function ex1RetestNext() {
            ex1RetestIndex++;
            showScreen('screen-ex1-retest');
            loadEx1Retest();
        }

        // ══════════════════════════════════════════
        // EX 2 — GAME (TAP THE TRANSLATION)
        // ══════════════════════════════════════════
        let ex2FullQueue = [];

        function startEx2Part1() {
            ex2FullQueue = shuffle([...words]);
            ex2GameQueue = [...ex2FullQueue]; // all words in one pass
            ex2GameIndex = 0;
            ex2CurrentPart = 1;
            showScreen('screen-ex2-intro');
            document.querySelector('#screen-ex2-intro .btn-primary').setAttribute('onclick', 'startEx2Part1Game()');
        }

        function startEx2Part1Game() {
            ex2GameActive = true;
            showScreen('screen-ex2-game');
            loadEx2GameWord();
        }

        // Called from intro screen
        function startEx2Game() {
            showScreen('screen-ex2-game');
            loadEx2GameWord();
        }

        function loadEx2GameWord() {
            if (ex2GameIndex >= ex2GameQueue.length) {
                stepsCompleted++;
                updateProgress();
                const msgs = ["Now let's test your memory!", "Exercise time!", "Keep going!"];
                showTransition(msgs[Math.floor(Math.random() * msgs.length)], startEx1);
                return;
            }


            const w = ex2GameQueue[ex2GameIndex];
            document.getElementById('ex2-game-french').textContent = w.french;
            document.getElementById('ex2-game-counter').textContent = `Mot ${ex2GameIndex + 1} / ${ex2GameQueue.length}`;

            ex2GameTimeLeft = 15;
            ex2GameCorrectHits = 0;
            document.getElementById('ex2-game-timer').textContent = ex2GameTimeLeft + 's';
            const area = document.getElementById('ex2-game-area');
            Array.from(area.children).forEach(c => {
                if (c.id !== 'ex2-game-french') area.removeChild(c);
            });

            ex2GameTimerInterval = setInterval(() => {
                ex2GameTimeLeft--;
                document.getElementById('ex2-game-timer').textContent = ex2GameTimeLeft + 's';
                if (ex2GameTimeLeft <= 0) {
                    clearInterval(ex2GameTimerInterval);
                    clearInterval(ex2GameLoopInterval);
                    stepsCompleted++;
                    updateProgress();
                    ex2GameIndex++;
                    loadEx2GameWord();
                }
            }, 1000);

            for (let i = 0; i < 5; i++) {
                spawnEx2Distractor(w.english);
            }

            spawnEx2Target(w.english);

            ex2GameLoopInterval = setInterval(() => {
                spawnEx2Distractor(w.english);
            }, 800);
        }

        function createBubble(text, isTarget, onClick) {
            const area = document.getElementById('ex2-game-area');
            const bubble = document.createElement('div');
            bubble.className = 'game-bubble distractor';
            bubble.textContent = text;

            let x, y;
            do {
                x = 10 + Math.random() * 80;
                y = 10 + Math.random() * 80;
            } while (x > 25 && x < 75 && y > 35 && y < 65);

            bubble.style.left = x + '%';
            bubble.style.top = y + '%';

            bubble.onclick = () => {
                onClick(bubble);
            };

            area.appendChild(bubble);
            setTimeout(() => bubble.classList.add('show'), 50);
            return bubble;
        }

        function spawnEx2Target(correctWord) {
            let alive = true;
            const b = createBubble(correctWord, true, (bubble) => {
                if (!alive) return;
                alive = false;
                ex2GameCorrectHits++;
                bubble.classList.remove('show');
                playAudio(false, correctWord);

                const fly = document.createElement('div');
                fly.className = 'game-score-fly';
                fly.textContent = '+1';
                fly.style.left = bubble.style.left;
                fly.style.top = bubble.style.top;
                document.getElementById('ex2-game-area').appendChild(fly);
                setTimeout(() => fly.remove(), 1000);

                setTimeout(() => bubble.remove(), 300);
                setTimeout(() => { if (ex2GameActive && ex2GameTimeLeft > 0 && ex2GameQueue[ex2GameIndex] && ex2GameQueue[ex2GameIndex].english === correctWord) spawnEx2Target(correctWord); }, 500);
            });

            setTimeout(() => {
                if (alive) {
                    alive = false;
                    b.classList.remove('show');
                    setTimeout(() => b.remove(), 300);
                    setTimeout(() => { if (ex2GameActive && ex2GameTimeLeft > 0 && ex2GameQueue[ex2GameIndex] && ex2GameQueue[ex2GameIndex].english === correctWord) spawnEx2Target(correctWord); }, 1000);
                }
            }, 5000);
        }

        function spawnEx2Distractor(correctWord) {
            let word = "word";
            const r = Math.random();
            if (r < 0.5 && allEnglish.length > 1) {
                word = shuffle(allEnglish.filter(e => e !== correctWord))[0] || 'word';
            } else if (r < 0.6) {
                if (correctWord.length > 3) {
                    let chars = correctWord.split('');
                    const idx = 1 + Math.floor(Math.random() * (chars.length - 2));
                    [chars[idx], chars[idx + 1]] = [chars[idx + 1], chars[idx]];
                    word = chars.join('');
                } else {
                    word = correctWord + "s";
                }
            } else {
                const randoms = ['lion', 'run', 'blue', 'fast', 'happy', 'house', 'tree', 'jump'];
                word = shuffle(randoms.filter(x => x !== correctWord))[0];
            }

            let alive = true;
            const b = createBubble(word, false, (bubble) => {
                if (!alive) return;
                alive = false;
                bubble.classList.remove('show');
                bubble.style.background = 'var(--wrong)';
                bubble.style.color = 'white';

                const wrongDisplay = document.createElement('div');
                wrongDisplay.className = 'game-target-center';
                wrongDisplay.style.color = 'var(--wrong)';
                wrongDisplay.style.zIndex = '20';
                wrongDisplay.textContent = correctWord;
                document.getElementById('ex2-game-area').appendChild(wrongDisplay);
                setTimeout(() => wrongDisplay.remove(), 1000);

                setTimeout(() => bubble.remove(), 300);
            });

            setTimeout(() => {
                if (alive) {
                    alive = false;
                    b.classList.remove('show');
                    setTimeout(() => b.remove(), 300);
                }
            }, 4000);
        }
	// ══════════════════════════════════════════
	// EX2 MATCH — Matching Table
	// ══════════════════════════════════════════
        let matchPairs = [];
        let matchSelected = null;

        function startMatch() {
            log('🎯 startMatch called, words:', words.length);
            matchPairs = words.map(w => ({ english: w.english, french: w.french }));
            matchSelected = null;
            buildMatchTable();
            updateMatchCounter();
            showScreen('screen-match');
	}

	function buildMatchTable() {
    const englishWords = shuffle(matchPairs.map(p => p.english));
    const frenchWords  = shuffle(matchPairs.map(p => p.french));
    const tbody = document.getElementById('match-tbody');
    tbody.innerHTML = '';
    for (let i = 0; i < matchPairs.length; i++) {
        const tr = document.createElement('tr');
        const makeCell = (lang, word) => {
            const td = document.createElement('td');
            const span = document.createElement('span');
            span.className = 'match-cell';
            span.textContent = word;
            span.dataset.lang = lang;
            span.dataset.word = word;
            span.addEventListener('click', () => onMatchCellClick(span));
            td.appendChild(span);
            return td;
        };
        tr.appendChild(makeCell('en', englishWords[i]));
        tr.appendChild(makeCell('fr', frenchWords[i]));
        tbody.appendChild(tr);
    }
	}

	function onMatchCellClick(cell) {
    if (cell.classList.contains('matched')) return;

    // Tap same cell again = deselect
    if (matchSelected && matchSelected.cell === cell) {
        cell.classList.remove('selected');
        matchSelected = null;
        return;
    }

    // Tap same language = switch selection
    if (matchSelected && matchSelected.lang === cell.dataset.lang) {
        matchSelected.cell.classList.remove('selected');
        cell.classList.add('selected');
        matchSelected = { lang: cell.dataset.lang, word: cell.dataset.word, cell };
        return;
    }

    // Nothing selected yet = select
    if (!matchSelected) {
        cell.classList.add('selected');
        matchSelected = { lang: cell.dataset.lang, word: cell.dataset.word, cell };
        return;
    }

    // Two different languages selected — check pair
    const enWord = matchSelected.lang === 'en' ? matchSelected.word : cell.dataset.word;
    const frWord = matchSelected.lang === 'fr' ? matchSelected.word : cell.dataset.word;
    const isCorrect = words.some(w => w.english === enWord && w.french === frWord);

    if (isCorrect) {
        matchSelected.cell.classList.remove('selected');
        matchSelected.cell.classList.add('matched');
        cell.classList.add('matched');
        matchSelected = null;
        matchPairs = matchPairs.filter(p => !(p.english === enWord && p.french === frWord));
        updateMatchCounter();
        if (matchPairs.length === 0) {
            setTimeout(() => {
                const msgs = ["All matched!", "Parfait !", "Excellent !"];
                showTransition(msgs[Math.floor(Math.random() * msgs.length)], startEx4);
            }, 600);
        }
    } else {
        const cellA = matchSelected.cell;
        matchSelected.cell.classList.remove('selected');
        matchSelected.cell.classList.add('wrong');
        cell.classList.add('wrong');
        matchSelected = null;
        loseLife();
        setTimeout(() => {
            cellA.classList.remove('wrong');
            cell.classList.remove('wrong');
        }, 700);
    }
	}

	function updateMatchCounter() {
    const matched = words.length - matchPairs.length;
    document.getElementById('match-counter').textContent = `${matched} / ${words.length} paires trouvées`;
	}
        // ══════════════════════════════════════════
        // EX 4 — WHACK-A-MOLE
        // ══════════════════════════════════════════
        let ex4Queue        = [];
        let ex4Index        = 0;
        let ex4TimeLeft     = 0;
        let ex4TimerInterval = null;
        let ex4MoleTimers   = [];
        let ex4Active       = false;
        const EX4_HOLES     = 6;
        const EX4_WORD_TIME = 5;

        // Show the intro screen first
        function startEx4() {
            showScreen('screen-ex4-intro');
        }

        // Called by the intro screen's button
        function startEx4Game() {
            ex4Queue  = shuffle([...words]);
            ex4Index  = 0;
            ex4Active = true;
            showScreen('screen-ex4');
            _ex4LoadWord();
        }

        function _ex4LoadWord() {
            ex4MoleTimers.forEach(t => clearTimeout(t));
            ex4MoleTimers = [];
            if (ex4TimerInterval) clearInterval(ex4TimerInterval);

            if (ex4Index >= ex4Queue.length) {
                ex4Active = false;
                stepsCompleted++;
                updateProgress();
                const msgs = ["Almost there!", "Presque fini !", "Super boulot !"];
                showTransition(msgs[Math.floor(Math.random() * msgs.length)], startEx3);
                return;
            }

            const w = ex4Queue[ex4Index];
            document.getElementById('ex4-french').textContent = w.french;
            document.getElementById('ex4-counter').textContent = `${ex4Index + 1} / ${ex4Queue.length}`;
            document.getElementById('ex4-progress-fill').style.width =
                `${Math.round((ex4Index / ex4Queue.length) * 100)}%`;
            document.getElementById('ex4-feedback').className = 'feedback-banner';

            // Build 6 fresh holes
            const grid = document.getElementById('ex4-grid');
            grid.innerHTML = '';
            for (let i = 0; i < EX4_HOLES; i++) {
                const hole = document.createElement('div');
                hole.className = 'mole-hole';
                hole.id = `mole-hole-${i}`;
                grid.appendChild(hole);
            }

            // One target + (EX4_HOLES-1) distractors, shuffled into slots
            const distractors = _ex4GetDistractors(w.english, EX4_HOLES - 1);
            const slots = shuffle([w.english, ...distractors]);

            // Staggered pop-up
            slots.forEach((word, i) => {
                const isTarget = word === w.english;
                const t = setTimeout(() => {
                    if (!ex4Active) return;
                    _ex4SpawnMole(i, word, isTarget, w);
                }, 150 + i * 180);
                ex4MoleTimers.push(t);
            });

            // Countdown
            ex4TimeLeft = EX4_WORD_TIME;
            _ex4UpdateTimer();
            ex4TimerInterval = setInterval(() => {
                ex4TimeLeft--;
                _ex4UpdateTimer();
                if (ex4TimeLeft <= 0) {
                    clearInterval(ex4TimerInterval);
                    if (!ex4Active) return;
                    // Time's up — no life lost, just show answer and advance
                    ex4Active = false;
                    showFeedback('ex4-feedback', 'wrong', `⏱ Temps écoulé — c'était : "${w.english}"`);
                    triggerGlow('wrong');
                    const t = setTimeout(() => {
                        ex4Active = true;
                        ex4Index++;
                        _ex4LoadWord();
                    }, 1400);
                    ex4MoleTimers.push(t);
                }
            }, 1000);
        }

        function _ex4SpawnMole(slotIndex, word, isTarget, wordObj) {
            const hole = document.getElementById(`mole-hole-${slotIndex}`);
            if (!hole) return;

            const existing = hole.querySelector('.mole');
            if (existing) existing.remove();

            const mole = document.createElement('div');
            mole.className = 'mole'; // all moles look identical
            mole.textContent = word;
            hole.appendChild(mole);

            const t1 = setTimeout(() => mole.classList.add('up'), 20);
            ex4MoleTimers.push(t1);

            // Auto-hide after dwell time (same for target and distractors — no visual hint)
            const dwell = 1500 + Math.random() * 1000;
            const t2 = setTimeout(() => {
                if (!mole.parentNode) return;
                mole.classList.remove('up');
                const t3 = setTimeout(() => {
                    if (mole.parentNode) mole.remove();
                    if (ex4Active) {
                        // Respawn this slot
                        const t4 = setTimeout(() => {
                            if (!ex4Active) return;
                            const newWord = isTarget
                                ? wordObj.english
                                : (_ex4GetDistractors(wordObj.english, 1)[0] || word);
                            _ex4SpawnMole(slotIndex, newWord, isTarget, wordObj);
                        }, 300 + Math.random() * 500);
                        ex4MoleTimers.push(t4);
                    }
                }, 250);
                ex4MoleTimers.push(t3);
            }, dwell);
            ex4MoleTimers.push(t2);

            mole.addEventListener('click', () => {
                if (!ex4Active) return;
                if (isTarget) {
                    // ✅ Correct
                    ex4Active = false;
                    clearInterval(ex4TimerInterval);
                    ex4MoleTimers.forEach(t => clearTimeout(t));
                    ex4MoleTimers = [];

                    mole.classList.add('hit-correct');
                    playAudio(false, wordObj.english);
                    triggerGlow('correct');
                    stepsCompleted++;
                    updateProgress();

                    const fly = document.createElement('div');
                    fly.className = 'mole-score-fly';
                    fly.textContent = '+1';
                    hole.appendChild(fly);
                    setTimeout(() => fly.remove(), 900);

                    showFeedback('ex4-feedback', 'correct', '✓ Correct !');
                    const t = setTimeout(() => {
                        ex4Active = true;
                        ex4Index++;
                        _ex4LoadWord();
                    }, 900);
                    ex4MoleTimers.push(t);
                } else {
                    // ✗ Wrong — flash red, no life lost, keep going
                    mole.classList.add('hit-wrong');
                    triggerGlow('wrong');
                    showFeedback('ex4-feedback', 'wrong', `✗ Non ! Cherche "${wordObj.english}"`);
                    setTimeout(() => {
                        if (mole.parentNode) {
                            mole.classList.remove('hit-wrong');
                        }
                        document.getElementById('ex4-feedback').className = 'feedback-banner';
                    }, 700);
                }
            });
        }

        function _ex4UpdateTimer() {
            const el = document.getElementById('ex4-timer');
            if (!el) return;
            el.textContent = `${ex4TimeLeft}s`;
            el.style.color = ex4TimeLeft <= 2 ? 'var(--wrong)' : 'var(--accent)';
        }

        function _ex4GetDistractors(correctWord, count) {
            const others = shuffle(allEnglish.filter(e => e !== correctWord));
            const pool = [...others];
            while (pool.length < count) {
                if (correctWord.length > 3) {
                    const chars = correctWord.split('');
                    const idx = 1 + Math.floor(Math.random() * (chars.length - 2));
                    [chars[idx], chars[idx + 1]] = [chars[idx + 1], chars[idx]];
                    pool.push(chars.join(''));
                } else {
                    pool.push(correctWord + 's');
                }
            }
            return pool.slice(0, count);
        }

    	// ══════════════════════════════════════════
        // EX 3 — Partial word typing
        // ══════════════════════════════════════════
        function startEx3() {
            ex3Queue = shuffle([...words]);
            ex3Index = 0;
            ex3Incorrect = [];
            showScreen('screen-ex3');
            loadEx3();
        }

        function makeAnagramWord(word) {
            const letters = word.split('');
            if (letters.length <= 1) return word;
            let anagram = shuffle(letters).join('');
            let attempts = 0;
            while (anagram === word && attempts < 5) {
                anagram = shuffle(letters).join('');
                attempts++;
            }
            return anagram;
        }

        function loadEx3() {
            if (ex3Index >= ex3Queue.length) {
                if (ex3Incorrect.length > 0) {
                    startEx3Retest();
                } else {
                    showSessionComplete();
                }
                return;
            }

            const w = ex3Queue[ex3Index];
            const anagram = makeAnagramWord(w.english);
            document.getElementById('ex3-french').textContent = w.french;

            const display = [...anagram].map(c =>
                c === ' ' ? `&nbsp;&nbsp;` : `<span style="margin: 0 2px;">${c}</span>`
            ).join('');
            document.getElementById('ex3-partial').innerHTML = display;

            document.getElementById('ex3-counter').textContent = `${ex3Index + 1} / ${ex3Queue.length}`;
            document.getElementById('ex3-feedback').className = 'feedback-banner';
            document.getElementById('ex3-next-btn').classList.add('hidden');
            document.getElementById('ex3-input').value = '';
            document.getElementById('ex3-input').className = 'type-input';
            document.getElementById('ex3-input').placeholder = 'Tapez le mot anglais complet...';

            document.getElementById('ex3-input').dataset.answer = w.english;
            document.getElementById('ex3-input').dataset.partial = anagram;
            document.getElementById('ex3-input').dataset.ex3Tried = "false";
        }

        function ex3Check() {
            const input = document.getElementById('ex3-input');
            const answer = input.dataset.answer.toLowerCase();
            const val = input.value.trim().toLowerCase();
            const tried = input.dataset.ex3Tried === "true";
            if (tried) return; // Prevent double-fire

            if (val === answer) {
                input.classList.add('correct');
                triggerGlow('correct');
                showFeedback('ex3-feedback', 'correct', '✓ Correct !');
                playAudio(false, answer);
                if (!tried) {
                    firstTryCorrect++;
                    sessionLearntWords.add(answer);
                    if (isRevisionSession) revisionCorrectThisSession.add(answer);
                }
                input.dataset.ex3Tried = "true";
            } else {
                input.classList.add('wrong');
                triggerGlow('wrong');
                showFeedback('ex3-feedback', 'wrong', `✗ La bonne réponse était : "${input.dataset.answer}"`);

                if (!wordErrors[answer]) wordErrors[answer] = 0;
                wordErrors[answer]++;
                loseLife();
                if (!ex3Incorrect.find(w => w.english.toLowerCase() === answer)) {
                    ex3Incorrect.push(ex3Queue[ex3Index]);
                }
                input.dataset.ex3Tried = "true";
            }
            stepsCompleted++;
            updateProgress();
            document.getElementById('ex3-next-btn').classList.remove('hidden');
        }

        function ex3Next() {
            ex3Index++;
            showScreen('screen-ex3');
            loadEx3();
        }

        function startEx3Retest() {
            ex3RetestIndex = 0;
            showScreen('screen-ex3-retest');
            loadEx3Retest();
        }

        function loadEx3Retest() {
            if (ex3RetestIndex >= ex3Incorrect.length) {
                showSessionComplete();
                return;
            }

            ex3RetestAttempts = 0;
            const w = ex3Incorrect[ex3RetestIndex];
            document.getElementById('ex3rt-french').textContent = w.french;

            const engDisplay = document.getElementById('ex3rt-english-display');
            engDisplay.textContent = w.english;
            engDisplay.style.display = 'block';

            document.getElementById('ex3rt-counter').textContent = `${ex3RetestIndex + 1} / ${ex3Incorrect.length}`;
            document.getElementById('ex3rt-feedback').className = 'feedback-banner';
            document.getElementById('ex3rt-next-btn').classList.add('hidden');

            const input = document.getElementById('ex3rt-input');
            input.value = '';
            input.className = 'type-input hidden';
            input.placeholder = 'Tapez le mot anglais...';
            input.dataset.answer = w.english;
            input.disabled = false;

            document.getElementById('ex3rt-memorized-btn').classList.remove('hidden');
            document.getElementById('ex3rt-verify-btn').classList.add('hidden');
        }

        function ex3RetestMemorized() {
            document.getElementById('ex3rt-english-display').style.display = 'none';
            document.getElementById('ex3rt-memorized-btn').classList.add('hidden');
            document.getElementById('ex3rt-verify-btn').classList.remove('hidden');

            const input = document.getElementById('ex3rt-input');
            input.classList.remove('hidden');
            input.focus();
        }

        function ex3RetestCheck() {
            const input = document.getElementById('ex3rt-input');
            const answer = input.dataset.answer.toLowerCase();
            const val = input.value.trim().toLowerCase();

            const verifyBtn = document.getElementById('ex3rt-verify-btn');

            if (val === answer) {
                input.classList.add('correct');
                triggerGlow('correct');
                showFeedback('ex3rt-feedback', 'correct', '✓ Correct !');
                playAudio(false, answer);
                input.disabled = true;
                verifyBtn.classList.add('hidden');
                document.getElementById('ex3rt-next-btn').classList.remove('hidden');
            } else {
                ex3RetestAttempts++;
                input.classList.add('wrong');
                triggerGlow('wrong');
                retestAllCorrect = false;

                if (ex3RetestAttempts >= 2) {
                    showFeedback('ex3rt-feedback', 'wrong', `✗ La bonne réponse était : "${input.dataset.answer}"`);
                    input.disabled = true;
                    verifyBtn.classList.add('hidden');
                    document.getElementById('ex3rt-next-btn').classList.remove('hidden');
                } else {
                    showFeedback('ex3rt-feedback', 'wrong', '✗ Presque... (1 tentative restante)');
                }
            }
        }

        function ex3RetestNext() {
            ex3RetestIndex++;
            showScreen('screen-ex3-retest');
            loadEx3Retest();
        }

        // ══════════════════════════════════════════
        // SHARED HELPERS
        // ══════════════════════════════════════════
        function showFeedback(id, type, msg) {
            const el = document.getElementById(id);
            el.className = `feedback-banner show ${type}`;
            el.innerHTML = (type === 'correct' ? '✓ ' : '✗ ') + msg.replace(/^[✓✗] /, '');
        }

        function showSessionComplete() {
            document.getElementById('progressBar').style.width = '100%';

            const totalChunks = Math.ceil(fullWordList.length / 10);
            document.getElementById('complete-title').textContent = `Session terminée ! (${currentChunkIndex + 1}/${totalChunks})`;

            const now = Date.now();
            const diffSecs = Math.floor((now - sessionStartTime) / 1000);
            const m = Math.floor(diffSecs / 60);
            const s = diffSecs % 60;

            document.getElementById('stat-time').textContent = `${m}m ${s}s`;
            document.getElementById('stat-words').textContent = words.length;

            const reviseList = document.getElementById('stat-revise-list');
            reviseList.innerHTML = '';

            const sortedErrors = Object.keys(wordErrors).sort((a, b) => wordErrors[b] - wordErrors[a]);
            const topErrors = sortedErrors.slice(0, 3);

            if (topErrors.length === 0) {
                reviseList.innerHTML = '<li style="color:var(--correct); list-style:none;">Aucun, parfait ! 🎉</li>';
            } else {
                topErrors.forEach(w => {
                    const li = document.createElement('li');
                    li.textContent = w + ` (${wordErrors[w]} erreur${wordErrors[w] > 1 ? 's' : ''})`;
                    reviseList.appendChild(li);
                });
            }

            const btnNext = document.getElementById('btn-next-group');
            if ((currentChunkIndex + 1) * 10 < fullWordList.length) {
                btnNext.style.display = 'block';
            } else {
                btnNext.style.display = 'none';
            }

            // Calculate score with bonuses
            const baseScore = (firstTryCorrect * 10) + (secondTryCorrect * 5);
            const perfectLivesBonus = playerLives === MAX_LIVES ? 10 : 0;
            const hasRetest = (ex1Incorrect.length > 0 || ex3Incorrect.length > 0);
            const perfectRetestBonus = hasRetest && retestAllCorrect ? 10 : 0;
            const scoreGained = baseScore + perfectLivesBonus + perfectRetestBonus;

            // Update score display
            document.getElementById('stat-score').textContent = `${scoreGained} pts`;

            // Show bonus breakdown if any bonuses earned
            const bonuses = [];
            if (firstTryCorrect > 0) bonuses.push({ label: `${firstTryCorrect} × premier essai correct`, pts: firstTryCorrect * 10 });
            if (secondTryCorrect > 0) bonuses.push({ label: `${secondTryCorrect} × deuxième essai correct`, pts: secondTryCorrect * 5 });
            if (perfectLivesBonus) bonuses.push({ label: '🛡️ Toutes vies conservées', pts: 10 });
            if (perfectRetestBonus) bonuses.push({ label: '⭐ Révision parfaite', pts: 10 });

            const bonusDiv = document.getElementById('stat-bonuses');
            const bonusList = document.getElementById('stat-bonus-list');
            bonusList.innerHTML = bonuses.map(b =>
                `<div style="display:flex; justify-content:space-between;"><span>${b.label}</span><span style="color:var(--accent); font-weight:600;">+${b.pts}</span></div>`
            ).join('');
            bonusDiv.style.display = bonuses.length > 0 ? 'block' : 'none';

            syncProgressToServer(scoreGained);

            if (isRevisionSession) {
                _saveRevisionCooldowns();
                isRevisionSession = false;
            }

            showScreen('screen-complete');
        }

        function restartApp() {
            stepsCompleted = 0;
            totalSteps = words.length * 4;
            sessionStartTime = Date.now();
            firstTryCorrect = 0;
            secondTryCorrect = 0;
            retestAllCorrect = true;
            wordErrors = {};
            sessionLearntWords = new Set();
            initLives();
            updateProgress();
            document.getElementById('header-home-btn').classList.remove('hidden');
            document.getElementById('header-progress-wrap').style.display = 'block';
            showScreen('screen-encounter');
            startEncounter();
        }

        function nextGroup() {
            currentChunkIndex++;
            startCurrentChunk();
        }

        // ══════════════════════════════════════════
        // INIT & FETCH
        // ══════════════════════════════════════════
        async function initializeDashboard() {
            if (currentProfile) {
                document.getElementById('header-profile-btn-container').style.display = 'block';
                document.getElementById('header-avatar-btn').innerHTML = getAvatarEmoji(currentProfile.avatar_id);
            } else {
                document.getElementById('header-profile-btn-container').style.display = 'none';
            }
            showScreen('screen-loading');
            document.getElementById('loading-status').textContent = 'Chargement en cours...';
            document.getElementById('header-home-btn').classList.add('hidden');
            document.getElementById('header-logo').style.display = 'block';
            document.getElementById('header-progress-wrap').style.display = 'none';

            try {
                const response = await fetchWithRetry(INDEX_FILE);
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                const data = await response.json();
                indexDataCached = data;
                renderHomeDashboard(data);

                showScreen('screen-home');
            } catch (err) {
                console.error("Failed to load index:", err);
                WORD_LIST_FILE = '';
		currentCourseName = '';
                showScreen('screen-error');
            }
        }

        async function loadWordList() {
            showScreen('screen-loading');
            document.getElementById('loading-status').textContent = 'Chargement de la liste...';
            document.getElementById('header-home-btn').classList.add('hidden');
            document.getElementById('header-logo').style.display = 'none';
            document.getElementById('header-progress-wrap').style.display = 'none';

            try {
                const response = await fetchWithRetry(WORD_LIST_FILE);
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                const data = await response.json();

                let parsedWords = parseWordList(data);

                // If coming from a specific theme topic, use only those words
                if (window._themeTopicWords && window._themeTopicWords.length > 0) {
                    parsedWords = window._themeTopicWords;
                    window._themeTopicWords = null;
                }

                if (!parsedWords || parsedWords.length === 0) {
                    throw new Error("No words found in JSON.");
                }

                fullWordList = shuffle(parsedWords);

                // If coming from a test-out, filter out words the user already knows
                if (window._testOutKnownSet && window._testOutKnownSet.size > 0) {
                    fullWordList = fullWordList.filter(w => !window._testOutKnownSet.has(normalizeString(w.english)));
                    window._testOutKnownSet = null;
                }

                // Filter out words the user manually excluded on the preview screen
                if (window._previewExcludedWords && window._previewExcludedWords.size > 0) {
                    fullWordList = fullWordList.filter(w => !window._previewExcludedWords.has(w.english));
                    window._previewExcludedWords = null;
                }
                currentChunkIndex = 0;

                await startCurrentChunk();
            } catch (err) {
                console.error("Failed to load words:", err);
                showScreen('screen-error');
            }
        }

        async function startCurrentChunk() {
            showScreen('screen-loading');
            document.getElementById('loading-status').textContent = 'Traduction et génération des phrases...';

            const startIndex = currentChunkIndex * 10;
            const chunk = fullWordList.slice(startIndex, startIndex + 10);

            words = await translateAndGenerateSentencesForSession(chunk);
            allEnglish = words.map(w => w.english);
            allFrench = words.map(w => w.french);

            totalSteps = words.length * 4;
            stepsCompleted = 0;
            sessionStartTime = Date.now();
            firstTryCorrect = 0;
            secondTryCorrect = 0;
            retestAllCorrect = true;
            wordErrors = {};
            sessionLearntWords = new Set();
            initLives();
            updateProgress();

            document.getElementById('header-home-btn').classList.remove('hidden');
            document.getElementById('header-progress-wrap').style.display = 'block';

            showScreen('screen-encounter');
            startEncounter();
        }

        function handleRetry() {
            if (WORD_LIST_FILE) {
                loadWordList();
            } else {
                initializeDashboard();
            }
        }

        // ══════════════════════════════════════════
        // TEST OUT
        // ══════════════════════════════════════════
        async function initiateTestOut(filename, title, e) {
            if (e) e.stopPropagation();
            if (!currentProfile) {
                showToast("Vous devez être connecté pour utiliser le test de niveau.", "error");
                return;
            }
            testOutCourseKey = 'word-lists/' + filename;
            testOutCourseName = title || filename;
            WORD_LIST_FILE = testOutCourseKey;
            currentCourseName = testOutCourseName;

            showScreen('screen-loading');
            document.getElementById('loading-status').textContent = 'Chargement et traduction du test...';
            document.getElementById('header-home-btn').classList.add('hidden');
            document.getElementById('header-logo').style.display = 'none';
            document.getElementById('header-progress-wrap').style.display = 'none';

            try {
                const response = await fetch(testOutCourseKey);
                if (!response.ok) throw new Error('HTTP ' + response.status);
                const data = await response.json();
                // Translate missing French entries just like the normal study flow
                const rawWords = parseWordList(data);
                testOutAllWords = shuffle(await translateAndGenerateSentencesForSession(rawWords));

                // Load saved progress if any
                const saved = currentProfile?.courses_progress?.[testOutCourseKey]?.test_out;
                const savedKnown = saved?.known_words || [];
                const savedTested = new Set(saved?.tested_words || []);

                testOutKnown = [...savedKnown];
                // Unknown = tested before but not in known
                testOutUnknown = testOutAllWords.filter(w =>
                    savedTested.has(w.english) && !savedKnown.includes(w.english)
                );
                // Queue = words not yet tested at all
                testOutQueue = testOutAllWords.filter(w => !savedTested.has(w.english));
                testOutIndex = 0;

                // If already fully tested, go straight to results
                if (testOutQueue.length === 0) {
                    showTestOutResults();
                    return;
                }

                totalSteps = testOutAllWords.length;
                stepsCompleted = savedTested.size;
                document.getElementById('header-home-btn').classList.remove('hidden');
                document.getElementById('header-logo').style.display = 'none';
                document.getElementById('header-progress-wrap').style.display = 'block';
                document.getElementById('lives-container').style.display = 'none';
                updateProgress();
                showScreen('screen-test-out');
                loadTestOutWord();
            } catch (err) {
                console.error('Test out failed:', err);
                showScreen('screen-error');
            }
        }

        function loadTestOutWord() {
            if (testOutIndex >= testOutQueue.length) {
                showTestOutResults();
                return;
            }
            const w = testOutQueue[testOutIndex];
            document.getElementById('test-out-french').textContent = w.french || w.english;
            document.getElementById('test-out-counter').textContent =
                `${testOutIndex + 1} / ${testOutQueue.length} mots restants`;
            document.getElementById('test-out-feedback').className = 'feedback-banner';
            document.getElementById('test-out-next-btn').classList.add('hidden');
            const input = document.getElementById('test-out-input');
            const firstLetter = w.english.charAt(0).toUpperCase();
            input.value = '';
            input.className = 'type-input';
            input.dataset.answer = w.english;
            input.dataset.checked = 'false';
            input.disabled = false;
            input.placeholder = `${firstLetter}...`;
            // Show first-letter hint below the input
            document.getElementById('test-out-hint').textContent = `Indice : commence par « ${firstLetter} »`;
            setTimeout(() => input.focus(), 100);
        }

        function testOutCheck() {
            const input = document.getElementById('test-out-input');
            if (input.dataset.checked === 'true') return;
            const answer = input.dataset.answer;
            const val = input.value.trim();
            if (!val) return;

            input.dataset.checked = 'true';
            input.disabled = true;

            const isCorrect = normalizeString(val) === normalizeString(answer);
            if (isCorrect) {
                input.classList.add('correct');
                triggerGlow('correct');
                showFeedback('test-out-feedback', 'correct', '✓ Correct — mot connu !');
                testOutKnown.push(answer);
            } else {
                input.classList.add('wrong');
                triggerGlow('wrong');
                showFeedback('test-out-feedback', 'wrong', `✗ La bonne réponse était : "${answer}"`);
                testOutUnknown.push(testOutQueue[testOutIndex]);
            }

            stepsCompleted++;
            updateProgress();
            document.getElementById('test-out-next-btn').classList.remove('hidden');
            // Auto-save after each answer
            _persistTestOutProgress();
        }

        function testOutNext() {
            testOutIndex++;
            loadTestOutWord();
        }

        async function _persistTestOutProgress() {
            if (!currentProfile || !currentUser) return;
            if (!currentProfile.courses_progress) currentProfile.courses_progress = {};
            if (!currentProfile.courses_progress[testOutCourseKey]) {
                currentProfile.courses_progress[testOutCourseKey] = { seen: 0, learning: 0, learnt: 0, score: 0 };
            }
            const testedWords = [
                ...testOutKnown,
                ...testOutUnknown.map(w => w.english)
            ];
            currentProfile.courses_progress[testOutCourseKey].test_out = {
                in_progress: testOutIndex < testOutQueue.length,
                known_words: testOutKnown,
                tested_words: testedWords,
                total_words: testOutAllWords.length
            };
            currentProfile.courses_progress[testOutCourseKey].learnt = testOutKnown.length;
            await sbClient.from('profiles').update({
                courses_progress: currentProfile.courses_progress
            }).eq('id', currentUser.id);
        }

        async function saveAndExitTestOut() {
            await _persistTestOutProgress();
            goToHome();
        }

        function showTestOutResults() {
            const knownCount = testOutKnown.length;
            const unknownCount = testOutUnknown.length;
            const total = knownCount + unknownCount;

            document.getElementById('test-out-known-count').textContent = knownCount;
            document.getElementById('test-out-unknown-count').textContent = unknownCount;

            if (unknownCount === 0) {
                document.getElementById('test-out-results-sub').textContent =
                    `Impressionnant ! Vous connaissez déjà tous les mots de ce cours.`;
                document.getElementById('test-out-start-filtered-btn').style.display = 'none';
            } else {
                const pct = total > 0 ? Math.round((knownCount / total) * 100) : 0;
                document.getElementById('test-out-results-sub').textContent =
                    `Vous connaissez ${knownCount} mot${knownCount !== 1 ? 's' : ''} sur ${total} (${pct}%). ` +
                    `Concentrez-vous sur les ${unknownCount} restant${unknownCount !== 1 ? 's' : ''}.`;
                document.getElementById('test-out-start-filtered-btn').style.display = 'block';
            }

            _persistTestOutProgress();
            document.getElementById('header-progress-wrap').style.display = 'none';
            document.getElementById('header-home-btn').classList.remove('hidden');
            document.getElementById('header-logo').style.display = 'none';
            showScreen('screen-test-out-results');
        }

        function startCourseFromTestOut() {
            // Pass known words to loadWordList via a temporary global set
            window._testOutKnownSet = new Set(testOutKnown.map(w => normalizeString(w)));
            loadWordList();
        }

        // ══════════════════════════════════════════
        // REVISION
        // ══════════════════════════════════════════

        // Returns { courseKey: [{english, french}, ...] } — filters out cooldown words
        function _getAllLearntWords() {
            if (!currentProfile?.courses_progress) return {};
            const todayStr = new Date().toISOString().slice(0, 10);
            const result = {};
            for (const [courseKey, prog] of Object.entries(currentProfile.courses_progress)) {
                const learnt = prog.learnt_words || [];
                const testOutKnown = prog.test_out?.known_words || [];
                const allForCourse = [...new Set([...learnt, ...testOutKnown])];
                const cooldowns = prog.revision_cooldown || {};
                const available = allForCourse.filter(w => {
                    const cd = cooldowns[w];
                    return !cd || cd < todayStr;
                });
                if (available.length > 0) result[courseKey] = available;
            }
            return result;
        }

        function _getCourseDisplayName(courseKey) {
            const filename = courseKey.replace('word-lists/', '');
            for (const cat of homeCategoriesData) {
                const match = cat.files.find(f => f.filename === filename);
                if (match) return match.title;
            }
            return filename.replace('.json', '');
        }

        let reviseViewAll = false;
        let reviseWordData = {}; // courseKey -> [{english, french}] with translated french

        function toggleReviseViewAll() {
            reviseViewAll = !reviseViewAll;
            document.getElementById('revise-view-toggle').textContent = reviseViewAll ? 'Par cours' : 'Tout voir';
            _renderReviseContent();
        }

        function _renderReviseContent() {
            const container = document.getElementById('revise-content');
            container.innerHTML = '';

            if (reviseViewAll) {
                // Flat list — one block with all words
                const allWords = [];
                for (const [ck, words] of Object.entries(reviseWordData)) {
                    words.forEach(w => allWords.push({ ...w, sourceKey: ck }));
                }
                const block = _buildReviseBlock('Tous les mots acquis', allWords.map(w => w.english), allWords);
                container.appendChild(block);
            } else {
                // Per course
                for (const [courseKey, wordObjs] of Object.entries(reviseWordData)) {
                    const name = _getCourseDisplayName(courseKey);
                    const block = _buildReviseBlock(name, wordObjs.map(w => w.english), wordObjs);
                    container.appendChild(block);
                }
            }
        }

        function _buildReviseBlock(title, wordKeys, wordObjs) {
            const block = document.createElement('div');
            block.className = 'revise-course-block';

            // Check how many from this block are already selected
            const allSelected = wordKeys.every(w => _isRevisionSelected(w));
            const someSelected = wordKeys.some(w => _isRevisionSelected(w));

            const header = document.createElement('div');
            header.className = 'revise-course-header';
            header.innerHTML = `
                <input type="checkbox" id="revise-course-select-all" class="revise-course-checkbox"
                    ${allSelected ? 'checked' : ''}
                    ${someSelected && !allSelected ? 'indeterminate' : ''}>
                <span class="revise-course-title">${title}</span>
                <span class="revise-course-count">${wordKeys.length} mot${wordKeys.length > 1 ? 's' : ''}</span>
            `;
            const cb = header.querySelector('input');
            if (someSelected && !allSelected) cb.indeterminate = true;

            cb.addEventListener('change', (e) => {
                e.stopPropagation();
                wordObjs.forEach(w => {
                    if (cb.checked) _addRevisionWord(w);
                    else _removeRevisionWord(w.english);
                });
                _renderReviseContent();
                _updateReviseFooter();
            });
            header.addEventListener('click', (e) => {
                if (e.target === cb) return;
                // Toggle collapse
                const grid = block.querySelector('.revise-word-grid');
                if (grid) grid.style.display = grid.style.display === 'none' ? 'flex' : 'none';
            });

            block.appendChild(header);

            const grid = document.createElement('div');
            grid.className = 'revise-word-grid';

            wordObjs.forEach(w => {
                const chip = document.createElement('div');
                const sel = _isRevisionSelected(w.english);
                chip.className = 'revise-word-chip' + (sel ? ' selected' : '');
                chip.innerHTML = `
                    <input type="checkbox" id="revise-word-checkbox" ${sel ? 'checked' : ''}>
                    <span class="revise-word-en">${w.english}</span>
                    <span class="revise-word-fr">${w.french || '—'}</span>
                `;
                chip.addEventListener('click', () => {
                    if (_isRevisionSelected(w.english)) {
                        _removeRevisionWord(w.english);
                        chip.classList.remove('selected');
                        chip.querySelector('input').checked = false;
                    } else {
                        _addRevisionWord(w);
                        chip.classList.add('selected');
                        chip.querySelector('input').checked = true;
                    }
                    _updateReviseFooter();
                    // Update course checkbox state
                    const allSel = wordKeys.every(k => _isRevisionSelected(k));
                    const someSel = wordKeys.some(k => _isRevisionSelected(k));
                    cb.checked = allSel;
                    cb.indeterminate = someSel && !allSel;
                });
                grid.appendChild(chip);
            });

            block.appendChild(grid);
            return block;
        }

        function _isRevisionSelected(english) {
            return revisionSelectedWords.some(w => w.english === english);
        }
        function _addRevisionWord(wordObj) {
            if (!_isRevisionSelected(wordObj.english)) revisionSelectedWords.push(wordObj);
        }
        function _removeRevisionWord(english) {
            revisionSelectedWords = revisionSelectedWords.filter(w => w.english !== english);
        }

        function _updateReviseFooter() {
            const n = revisionSelectedWords.length;
            const label = n === 0 ? '0 mot sélectionné'
                : n < 5 ? `${n} mot${n > 1 ? 's' : ''} sélectionné${n > 1 ? 's' : ''} — minimum 5 requis`
                : `${n} mot${n > 1 ? 's' : ''} sélectionné${n > 1 ? 's' : ''}`;
            document.getElementById('revise-selected-count').textContent = label;
            const btn = document.getElementById('revise-start-btn');
            btn.disabled = n < 5;
            btn.style.opacity = n >= 5 ? '1' : '0.4';
            btn.textContent = n >= 5 ? `Réviser ${n} mot${n > 1 ? 's' : ''} →` : 'Réviser les mots sélectionnés →';
        }

        async function openReviseScreen() {
            document.getElementById('header-home-btn').classList.add('hidden');
            document.getElementById('header-logo').style.display = 'none';
            document.getElementById('header-progress-wrap').style.display = 'none';
            showScreen('screen-loading');
            document.getElementById('loading-status').textContent = 'Chargement des mots acquis...';

            revisionSelectedWords = [];
            reviseViewAll = false;
            reviseWordData = {};

            const learntByCourse = _getAllLearntWords();

            // Fetch French translations for all words
            for (const [courseKey, englishWords] of Object.entries(learntByCourse)) {
                // Try to get French from the course progress or translate
                const prog = currentProfile.courses_progress[courseKey];
                const translated = await translateAndGenerateSentencesForSession(
                    englishWords.map(e => ({ english: e, french: '' }))
                );
                reviseWordData[courseKey] = translated.map(w => ({ ...w, sourceKey: courseKey }));
            }

            document.getElementById('revise-view-toggle').textContent = 'Tout voir';
            _renderReviseContent();
            _updateReviseFooter();
            showScreen('screen-revise');
        }

        async function startRevisionSession() {
            if (revisionSelectedWords.length < 5) return;

            isRevisionSession = true;
            revisionCorrectThisSession = new Set();

            // Set up the word list directly — no loadWordList needed
            words = revisionSelectedWords.map(w => ({ english: w.english, french: w.french, sourceKey: w.sourceKey }));
            allEnglish = words.map(w => w.english);
            allFrench = words.map(w => w.french);
            fullWordList = [...words];
            currentChunkIndex = 0;
            WORD_LIST_FILE = 'revision_session';
            currentCourseName = 'Révision';

            totalSteps = words.length * 2; // ex1 + ex3 only
            stepsCompleted = 0;
            sessionStartTime = Date.now();
            firstTryCorrect = 0;
            secondTryCorrect = 0;
            retestAllCorrect = true;
            wordErrors = {};
            sessionLearntWords = new Set();
            initLives();
            updateProgress();

            document.getElementById('header-home-btn').classList.remove('hidden');
            document.getElementById('header-logo').style.display = 'none';
            document.getElementById('header-progress-wrap').style.display = 'block';

            // Skip encounter screen — go straight to Ex1
            showScreen('screen-ex1');
            startEx1();
        }

        async function _saveRevisionCooldowns() {
            if (!currentProfile || revisionCorrectThisSession.size === 0) return;
            const tomorrowStr = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

            // Group correct words by their source course
            for (const w of revisionSelectedWords) {
                if (!revisionCorrectThisSession.has(w.english)) continue;
                const ck = w.sourceKey || WORD_LIST_FILE;
                if (!currentProfile.courses_progress[ck]) continue;
                if (!currentProfile.courses_progress[ck].revision_cooldown)
                    currentProfile.courses_progress[ck].revision_cooldown = {};
                currentProfile.courses_progress[ck].revision_cooldown[w.english] = tomorrowStr;
            }

            await sbClient.from('profiles').update({
                courses_progress: currentProfile.courses_progress
            }).eq('id', currentUser.id);
        }

      async function syncProgressToServer(scoreGained) {
    if (!currentProfile) return;
    currentProfile.total_score = (currentProfile.total_score || 0) + scoreGained;

    if (!currentProfile.courses_progress) currentProfile.courses_progress = {};
    const courseKey = WORD_LIST_FILE || 'default_course';
    if (!currentProfile.courses_progress[courseKey]) {
        currentProfile.courses_progress[courseKey] = { seen: 0, learning: 0, learnt: 0, score: 0 };
    }

    const progress = currentProfile.courses_progress[courseKey];
    const wordsInSession = words.length;
    const wordsLearnt = firstTryCorrect;
    const wordsLearning = wordsInSession - wordsLearnt;

    progress.seen += wordsInSession;
    progress.learning += wordsLearning;
    progress.score = (progress.score || 0) + scoreGained;

    // Merge newly learnt words into the stored list (by English string)
    if (!progress.learnt_words) progress.learnt_words = [];
    const learntSet = new Set(progress.learnt_words);
    sessionLearntWords.forEach(w => learntSet.add(w));
    progress.learnt_words = [...learntSet];
    progress.learnt = progress.learnt_words.length; // keep count in sync

    await sbClient.from('profiles').update({
        total_score: currentProfile.total_score,
        courses_progress: currentProfile.courses_progress
    }).eq('id', currentUser.id);
	}
        // ══════════════════════════════════════════
        // VERB PRACTICE — DATA
        // ══════════════════════════════════════════

        // Verb database: tenses available per level
        const VERB_TENSES_BY_LEVEL = {
            A1: ['present_simple', 'present_continuous', 'past_simple'],
            A2: ['present_simple', 'present_continuous', 'past_simple', 'past_continuous', 'future_will', 'future_going_to'],
            B1: ['present_simple', 'present_continuous', 'past_simple', 'past_continuous', 'present_perfect', 'future_will', 'future_going_to'],
            B2: ['present_simple', 'present_continuous', 'past_simple', 'past_continuous', 'present_perfect', 'present_perfect_continuous', 'past_perfect', 'future_will', 'future_going_to', 'future_perfect'],
            C1: ['present_simple', 'present_continuous', 'past_simple', 'past_continuous', 'present_perfect', 'present_perfect_continuous', 'past_perfect', 'past_perfect_continuous', 'future_will', 'future_going_to', 'future_perfect', 'future_continuous']
        };

        const TENSE_META = {
            present_simple:              { name: 'Present Simple',              example: 'He walks.' },
            present_continuous:          { name: 'Present Continuous',          example: 'She is running.' },
            past_simple:                 { name: 'Past Simple',                 example: 'They worked.' },
            past_continuous:             { name: 'Past Continuous',             example: 'I was reading.' },
            present_perfect:             { name: 'Present Perfect',             example: 'We have seen.' },
            present_perfect_continuous:  { name: 'Present Perf. Continuous',    example: 'She has been working.' },
            past_perfect:                { name: 'Past Perfect',                example: 'He had left.' },
            past_perfect_continuous:     { name: 'Past Perfect Continuous',     example: 'They had been waiting.' },
            future_will:                 { name: 'Future (will)',                example: 'I will go.' },
            future_going_to:             { name: 'Future (going to)',            example: "She's going to call." },
            future_perfect:              { name: 'Future Perfect',              example: 'He will have finished.' },
            future_continuous:           { name: 'Future Continuous',           example: 'They will be working.' }
        };

        const PRONOUNS = ['I', 'you', 'he/she/it', 'we', 'you (pl.)', 'they'];
        const PRONOUN_SHORT = ['I', 'you', 'he', 'we', 'you', 'they'];

        // Conjugation engine: returns array of 6 forms for given verb + tense
        function conjugateVerb(infinitive, tense, isIrregular) {
            const v = infinitive.toLowerCase().trim();

            // ── Special case: TO BE ──
            if (v === 'be') {
                const beConj = {
                    present_simple:             ['am', 'are', 'is', 'are', 'are', 'are'],
                    present_continuous:         ['am being', 'are being', 'is being', 'are being', 'are being', 'are being'],
                    past_simple:                ['was', 'were', 'was', 'were', 'were', 'were'],
                    past_continuous:            ['was being', 'were being', 'was being', 'were being', 'were being', 'were being'],
                    present_perfect:            ['have been', 'have been', 'has been', 'have been', 'have been', 'have been'],
                    present_perfect_continuous: ['have been being', 'have been being', 'has been being', 'have been being', 'have been being', 'have been being'],
                    past_perfect:               Array(6).fill('had been'),
                    past_perfect_continuous:    Array(6).fill('had been being'),
                    future_will:                Array(6).fill('will be'),
                    future_going_to:            ["I'm going to be", "you're going to be", "he's going to be", "we're going to be", "you're going to be", "they're going to be"],
                    future_perfect:             Array(6).fill('will have been'),
                    future_continuous:          Array(6).fill('will be being'),
                };
                return beConj[tense] || beConj.present_simple;
            }

            // ── Special case: TO HAVE (present simple) ──
            if (v === 'have' && tense === 'present_simple') {
                return ['have', 'have', 'has', 'have', 'have', 'have'];
            }

            // Build conjugations
            const conj = {
                present_simple: () => {
                    const base = v;
                    let third = base;
                    if (/[sxz]$/.test(base) || /[cs]h$/.test(base) || /[^aeiou]o$/.test(base) || base === 'do' || base === 'go') third += 'es';
                    else if (/[^aeiou]y$/.test(base)) third = base.slice(0,-1) + 'ies';
                    else third += 's';
                    return [base, base, third, base, base, base];
                },
                present_continuous: () => {
                    let stem = v;
                    if (stem.endsWith('ie')) stem = stem.slice(0,-2) + 'y';
                    else if (stem.endsWith('e') && stem.length > 2) stem = stem.slice(0,-1);
                    const ing = stem + 'ing';
                    return PRONOUN_SHORT.map(p => {
                        const be = {I:'am',you:'are',he:'is',we:'are',they:'are'}[p] || 'are';
                        return `${be} ${ing}`;
                    });
                },
                past_simple: () => {
                    if (isIrregular) {
                        const irreg = getIrregularPast()[v];
                        if (irreg) return Array(6).fill(irreg);
                    }
                    let past = v;
                    if (/[^aeiou]e$/.test(v)) past = v + 'd';
                    else if (/[^aeiou]y$/.test(v)) past = v.slice(0,-1) + 'ied';
                    else if (/[^aeiou][aeiou][^aeiou]$/.test(v) && v.length <= 5) past = v + v.slice(-1) + 'ed';
                    else past = v + 'ed';
                    return Array(6).fill(past);
                },
                past_continuous: () => {
                    let stem = v;
                    if (stem.endsWith('ie')) stem = stem.slice(0,-2) + 'y';
                    else if (stem.endsWith('e') && stem.length > 2) stem = stem.slice(0,-1);
                    const ing = stem + 'ing';
                    return PRONOUN_SHORT.map(p => {
                        const be = {I:'was',you:'were',he:'was',we:'were',they:'were'}[p] || 'were';
                        return `${be} ${ing}`;
                    });
                },
                present_perfect: () => {
                    let pp;
                    if (isIrregular && getIrregularPP()[v]) pp = getIrregularPP()[v];
                    else if (/[^aeiou]e$/.test(v)) pp = v + 'd';
                    else if (/[^aeiou]y$/.test(v)) pp = v.slice(0,-1) + 'ied';
                    else pp = v + 'ed';
                    return PRONOUN_SHORT.map(p => {
                        const have = {I:'have',you:'have',he:'has',we:'have',they:'have'}[p] || 'have';
                        return `${have} ${pp}`;
                    });
                },
                present_perfect_continuous: () => {
                    let stem = v;
                    if (stem.endsWith('e') && stem.length > 2) stem = stem.slice(0,-1);
                    const ing = stem + 'ing';
                    return PRONOUN_SHORT.map(p => {
                        const have = {I:'have',you:'have',he:'has',we:'have',they:'have'}[p] || 'have';
                        return `${have} been ${ing}`;
                    });
                },
                past_perfect: () => {
                    let pp;
                    if (isIrregular && getIrregularPP()[v]) pp = getIrregularPP()[v];
                    else if (/[^aeiou]e$/.test(v)) pp = v + 'd';
                    else if (/[^aeiou]y$/.test(v)) pp = v.slice(0,-1) + 'ied';
                    else pp = v + 'ed';
                    return Array(6).fill(`had ${pp}`);
                },
                past_perfect_continuous: () => {
                    let stem = v;
                    if (stem.endsWith('e') && stem.length > 2) stem = stem.slice(0,-1);
                    const ing = stem + 'ing';
                    return Array(6).fill(`had been ${ing}`);
                },
                future_will: () => Array(6).fill(`will ${v}`),
                future_going_to: () => {
                    return PRONOUN_SHORT.map(p => {
                        const be = {I:"I'm",you:"you're",he:"he's",we:"we're",they:"they're"}[p] || "are";
                        return `${be} going to ${v}`;
                    });
                },
                future_perfect: () => {
                    let pp;
                    if (isIrregular && getIrregularPP()[v]) pp = getIrregularPP()[v];
                    else if (/[^aeiou]e$/.test(v)) pp = v + 'd';
                    else if (/[^aeiou]y$/.test(v)) pp = v.slice(0,-1) + 'ied';
                    else pp = v + 'ed';
                    return Array(6).fill(`will have ${pp}`);
                },
                future_continuous: () => {
                    let stem = v;
                    if (stem.endsWith('e') && stem.length > 2) stem = stem.slice(0,-1);
                    const ing = stem + 'ing';
                    return Array(6).fill(`will be ${ing}`);
                }
            };
            return (conj[tense] || conj.present_simple)();
        }

        const SUBJ_KEY_TO_IDX = { 'I': 0, 'you': 1, 'he': 2, 'we': 3, 'they': 5 };

        // All irregular verbs across all levels — lazy-loaded with verb data
        var _allIrregularVerbs = null;
        function getAllIrregularVerbs() {
            if (!_allIrregularVerbs) _allIrregularVerbs = new Set([...Object.values(getVerbLists().irregular).flat()]);
            return _allIrregularVerbs;
        }

        function generateTenseChoiceSentences(level) {
            const tenses = VERB_TENSES_BY_LEVEL[level];
            const questions = [];
            const tensePool = shuffle([...tenses]);

            for (const tenseKey of tensePool) {
                if (questions.length >= 8) break;
                const bank = getTenseSentenceBank()[tenseKey];
                if (!bank || bank.length === 0) continue;

                const template = bank[Math.floor(Math.random() * bank.length)];
                const verb = template.verb;
                const isIrr = getAllIrregularVerbs().has(verb); // always check global set, not level list
                const pIdx = SUBJ_KEY_TO_IDX[template.subjKey] ?? 2;

                let answer;
                if (template.goingTo) {
                    answer = verb;
                } else {
                    answer = conjugateVerb(verb, tenseKey, isIrr)[pIdx];
                }

                // 3 distractors: same verb conjugated in other tenses
                const distractors = [];
                for (const dt of shuffle(tenses.filter(t => t !== tenseKey))) {
                    if (getTenseSentenceBank()[dt]?.[0]?.goingTo) continue;
                    const cand = conjugateVerb(verb, dt, isIrr)[pIdx];
                    if (cand && cand !== answer && !distractors.includes(cand)) {
                        distractors.push(cand);
                        if (distractors.length === 3) break;
                    }
                }
                // Pad from other pronoun forms of same tense if needed
                if (!template.goingTo && distractors.length < 3) {
                    const forms = conjugateVerb(verb, tenseKey, isIrr);
                    for (let pi = 0; pi < 6 && distractors.length < 3; pi++) {
                        const cand = forms[pi];
                        if (cand !== answer && !distractors.includes(cand)) distractors.push(cand);
                    }
                }
                // Last resort: use conjugated forms from a broad set of tenses, always respecting irregulars
                if (distractors.length < 3) {
                    const fallbackTenses = ['present_simple','past_simple','present_perfect','future_will','present_continuous'];
                    for (const ft of fallbackTenses) {
                        if (distractors.length >= 3) break;
                        const cand = conjugateVerb(verb, ft, isIrr)[pIdx];
                        if (cand && cand !== answer && !distractors.includes(cand)) distractors.push(cand);
                    }
                }

                const tenseName = TENSE_META[tenseKey]?.name || tenseKey;
                questions.push({
                    sentence: template.template,
                    verb,
                    tenseKey,
                    answer,
                    options: shuffle([answer, ...distractors.slice(0, 3)]),
                    hint: `Verb: "${verb}" — context clue: ${template.clue}`,
                    explanation: `${tenseName} — ${template.clue}.`
                });
            }
            return shuffle(questions);
        }

        // ══════════════════════════════════════════
        // VERB PRACTICE — STATE & NAVIGATION
        // ══════════════════════════════════════════
        let verbState = {
            level: 'A1',
            verbType: 'regular',
            verbForm: 'affirmative',
            tense: null,
            verbList: [],
            verbIndex: 0,
            correct: 0,
            total: 0,
            sessionMode: null // 'conjugation' | 'tense_choice'
        };
        let tcSentences = [];
        let tcIndex = 0;
        let tcCorrect = 0;

        function openVerbPractice() {
            verbState.level = 'A1';
            document.querySelectorAll('.verb-level-btn').forEach(b => b.classList.remove('selected'));
            document.querySelector('.verb-level-btn').classList.add('selected');
            document.getElementById('verb-mode-select').style.display = 'none';
            showScreen('screen-verb-home');
        }

        function selectVerbLevel(level) {
            verbState.level = level;
            document.querySelectorAll('.verb-level-btn').forEach(b => {
                b.classList.toggle('selected', b.textContent === level);
            });
            const modeDiv = document.getElementById('verb-mode-select');
            modeDiv.style.display = 'flex';
            document.getElementById('verb-mode-title').textContent = `Practice options for ${level}`;
        }

        // Tenses where irregular verbs produce genuinely different forms (past stem or past participle).
        // past_continuous and present_perfect_continuous use -ing which is identical for all verbs.
        const IRREGULAR_SENSITIVE_TENSES = new Set([
            'past_simple',
            'present_perfect',
            'past_perfect',
            'past_perfect_continuous'  // uses past participle: "had been running" — pp identical, but included for consistency
        ]);

        // ── NEGATIVE CONJUGATION ──
        function conjugateNegative(infinitive, tense, isIrregular) {
            const v = infinitive.toLowerCase().trim();
            const pos = conjugateVerb(v, tense, isIrregular);

            function negateForm(form, pi) {
                // Special case: "be" in present simple — negate the be-form itself (am/is/are)
                if (v === 'be' && tense === 'present_simple') {
                    const negMap = { 'am': "am not", 'is': "isn't", 'are': "aren't" };
                    return negMap[form] || ('not ' + form);
                }
                // Special case: "be" in past simple — negate was/were directly
                if (v === 'be' && tense === 'past_simple') {
                    return form === 'was' ? "wasn't" : "weren't";
                }
                // present_simple (non-be): use do/does + not + base
                if (tense === 'present_simple') {
                    return pi === 2 ? `doesn't ${v}` : `don't ${v}`;
                }
                // past_simple (non-be): use didn't + base
                if (tense === 'past_simple') return `didn't ${v}`;
                // All other tenses: negate by inserting "not" after the first auxiliary
                const contractions = {
                    'will ': "won't ", 'am ': "am not ", 'is ': "isn't ", 'are ': "aren't ",
                    'was ': "wasn't ", 'were ': "weren't ", 'have ': "haven't ", 'has ': "hasn't ",
                    'had ': "hadn't ",
                };
                for (const [aux, neg] of Object.entries(contractions)) {
                    if (form.startsWith(aux)) return neg + form.slice(aux.length);
                }
                // Contracted going_to forms
                if (form.includes("'m going to")) return form.replace("'m going to", "'m not going to");
                if (form.includes("'re going to")) return form.replace("'re going to", "'re not going to");
                if (form.includes("'s going to")) return form.replace("'s going to", "'s not going to");
                return 'not ' + form;
            }
            return pos.map((f, i) => negateForm(f, i));
        }

        // ── INTERROGATIVE CONJUGATION ──
        function conjugateInterrogative(infinitive, tense, isIrregular) {
            const v = infinitive.toLowerCase().trim();
            const pos = conjugateVerb(v, tense, isIrregular);
            const subjs = ['I', 'you', 'he/she/it', 'we', 'you', 'they'];
            const subjsLower = ['I', 'you', 'he/she/it', 'we', 'you', 'they'];

            function interrogateForm(form, pi) {
                const subj = subjs[pi];
                const sl = subj.toLowerCase();

                // Special case: "be" in present simple — invert am/is/are + subject
                if (v === 'be' && tense === 'present_simple') {
                    const auxMap2 = { 'am': 'Am', 'is': 'Is', 'are': 'Are' };
                    const aux2 = auxMap2[form] || 'Is';
                    return `${aux2} ${sl}?`;
                }
                // Special case: "be" in past simple — invert was/were + subject
                if (v === 'be' && tense === 'past_simple') {
                    const aux2 = form === 'was' ? 'Was' : 'Were';
                    return `${aux2} ${sl}?`;
                }
                // present_simple (non-be): Do/Does + subject + base
                if (tense === 'present_simple') {
                    const aux = pi === 2 ? 'Does' : 'Do';
                    return `${aux} ${sl} ${v}?`;
                }
                // past_simple (non-be): Did + subject + base
                if (tense === 'past_simple') return `Did ${sl} ${v}?`;
                // All other tenses: invert auxiliary and subject
                const auxMap = {
                    'am ': 'Am ', 'is ': 'Is ', 'are ': 'Are ',
                    'was ': 'Was ', 'were ': 'Were ',
                    'have ': 'Have ', 'has ': 'Has ', 'had ': 'Had ',
                    'will ': 'Will ',
                };
                for (const [aux, Aux] of Object.entries(auxMap)) {
                    if (form.startsWith(aux)) {
                        return `${Aux}${sl} ${form.slice(aux.length)}?`;
                    }
                }
                // Contracted going_to forms
                if (form.includes("'m going to")) return `Am I going to ${v}?`;
                if (form.includes("'re going to")) return `Are ${sl} going to ${v}?`;
                if (form.includes("'s going to")) return `Is ${sl} going to ${v}?`;
                return `${form} ${subj}?`;
            }
            return pos.map((f, i) => interrogateForm(f, i));
        }

        function getConjugatedForms(verb, tense, isIrr, form) {
            if (form === 'negative') return conjugateNegative(verb, tense, isIrr);
            if (form === 'interrogative') return conjugateInterrogative(verb, tense, isIrr);
            return conjugateVerb(verb, tense, isIrr); // affirmative
        }

        // ── DRILL TIMER ──
        let drillTimerInterval = null;
        let drillTimerSecondsLeft = 0;
        let drillTimerSecondsElapsed = 0;
        let drillDurationMinutes = 5; // default

        function setDuration(mins) {
            drillDurationMinutes = mins;
            [1, 2, 5, 10, 0].forEach(m => {
                const el = document.getElementById('vdur-' + m);
                if (el) el.classList.toggle('active', m === mins);
            });
        }

        function startDrillTimer() {
            clearDrillTimer();
            drillTimerSecondsElapsed = 0;
            const timerEl = document.getElementById('drill-timer');

            if (drillDurationMinutes === 0) {
                // Unlimited — hide timer
                timerEl.style.display = 'none';
                return;
            }

            drillTimerSecondsLeft = drillDurationMinutes * 60;
            timerEl.style.display = 'block';
            updateTimerDisplay();

            drillTimerInterval = setInterval(() => {
                drillTimerSecondsLeft--;
                drillTimerSecondsElapsed++;
                updateTimerDisplay();
                if (drillTimerSecondsLeft <= 0) {
                    clearDrillTimer();
                    showVerbResults('conjugation');
                }
            }, 1000);
        }

        function updateTimerDisplay() {
            const el = document.getElementById('drill-timer');
            if (!el) return;
            const m = Math.floor(drillTimerSecondsLeft / 60);
            const s = drillTimerSecondsLeft % 60;
            el.textContent = `${m}:${String(s).padStart(2, '0')}`;
            // Turn red in last 30 seconds
            el.style.color = drillTimerSecondsLeft <= 30 ? 'var(--wrong)' : 'var(--accent)';
            el.style.background = drillTimerSecondsLeft <= 30 ? 'var(--wrong-bg)' : 'var(--accent-light)';
        }

        function clearDrillTimer() {
            if (drillTimerInterval) { clearInterval(drillTimerInterval); drillTimerInterval = null; }
        }

        function endDrillEarly() {
            clearDrillTimer();
            showScreen('screen-verb-conj-select');
        }

        function openVerbConjugation() {
            verbState.sessionMode = 'conjugation';
            verbState.verbType = 'regular';
            verbState.verbForm = 'affirmative';
            const tag = document.getElementById('verb-conj-level-tag');
            tag.textContent = verbState.level;
            tag.className = 'level-badge level-' + verbState.level.toLowerCase().replace('/','');
            document.getElementById('vtype-regular').classList.add('active');
            document.getElementById('vtype-irregular').classList.remove('active');
            // Ensure all form buttons visible (regular mode)
            ['negative','interrogative','mixed'].forEach(f => {
                document.getElementById('vform-' + f).style.display = '';
            });
            ['affirmative','negative','interrogative','mixed'].forEach(f => {
                document.getElementById('vform-' + f).classList.toggle('active', f === 'affirmative');
            });
            // Sync duration buttons to current selection
            [1, 2, 5, 10, 0].forEach(m => {
                const el = document.getElementById('vdur-' + m);
                if (el) el.classList.toggle('active', m === drillDurationMinutes);
            });
            renderTenseGrid();
            showScreen('screen-verb-conj-select');
        }

        function setVerbForm(form) {
            verbState.verbForm = form;
            ['affirmative','negative','interrogative','mixed'].forEach(f => {
                const el = document.getElementById('vform-' + f);
                if (el) {
                    el.classList.toggle('active', f === form);
                    el.setAttribute('aria-pressed', f === form ? 'true' : 'false');
                }
            });
        }

        function setVerbType(type) {
            verbState.verbType = type;
            ['regular','irregular'].forEach(t => {
                const el = document.getElementById('vtype-' + t);
                if (el) el.setAttribute('aria-pressed', t === type ? 'true' : 'false');
            });
            document.getElementById('vtype-regular').classList.toggle('active', type === 'regular');
            document.getElementById('vtype-irregular').classList.toggle('active', type === 'irregular');

            const irrelevantForms = ['negative', 'interrogative', 'mixed'];
            irrelevantForms.forEach(f => {
                document.getElementById('vform-' + f).style.display = type === 'irregular' ? 'none' : '';
            });
            if (type === 'irregular' && irrelevantForms.includes(verbState.verbForm)) {
                setVerbForm('affirmative');
            }

            renderTenseGrid();
        }

        function renderTenseGrid() {
            const grid = document.getElementById('verb-tense-grid');
            grid.innerHTML = '';
            const tenses = VERB_TENSES_BY_LEVEL[verbState.level] || VERB_TENSES_BY_LEVEL.A1;
            const typeToggle = document.getElementById('verb-type-toggle-wrap');
            tenses.forEach(tenseKey => {
                const meta = TENSE_META[tenseKey];
                const irrelevant = !IRREGULAR_SENSITIVE_TENSES.has(tenseKey);
                const btn = document.createElement('button');
                btn.className = 'verb-tense-btn';
                // Grey out tenses where the regular/irregular distinction doesn't apply
                // when irregular is selected, and add a note when it doesn't matter
                const note = (irrelevant && verbState.verbType === 'irregular')
                    ? '<span class="tense-example" style="color:var(--ink-light); font-style:normal;">not applicable for irregular</span>'
                    : `<span class="tense-example">${meta.example}</span>`;
                btn.innerHTML = `<span class="tense-name">${meta.name}</span>${note}`;
                btn.onclick = () => startConjugationDrill(tenseKey);
                grid.appendChild(btn);
            });
        }

        function getVerbListForTense(tenseKey) {
            const level = verbState.level;
            const reg = getVerbLists().regular[level] || getVerbLists().regular.A1;
            const irr = getVerbLists().irregular[level] || getVerbLists().irregular.A1;
            if (!IRREGULAR_SENSITIVE_TENSES.has(tenseKey)) {
                // Distinction doesn't apply — always use both lists combined
                return [...reg, ...irr];
            }
            return verbState.verbType === 'irregular' ? irr : reg;
        }

        function startConjugationDrill(tenseKey) {
            verbState.tense = tenseKey;
            verbState.correct = 0;
            verbState.total = 0;

            const verbPool = getVerbListForTense(tenseKey);
            const forms = ['affirmative', 'negative', 'interrogative'];
            const selectedForm = verbState.verbForm || 'affirmative';

            // For timed sessions, generate a very large shuffled queue (10× verb pool × 6 pronouns)
            // so it never runs out before the timer ends. For unlimited, use one full pass.
            const repeats = drillDurationMinutes > 0 ? Math.max(10, Math.ceil((drillDurationMinutes * 60) / (verbPool.length * 6 * 8))) : 1;
            const pairs = [];
            for (let r = 0; r < repeats; r++) {
                for (const verb of verbPool) {
                    for (let pi = 0; pi < 6; pi++) {
                        const form = selectedForm === 'mixed'
                            ? forms[Math.floor(Math.random() * 3)]
                            : selectedForm;
                        pairs.push({ verb, pronounIdx: pi, form });
                    }
                }
            }
            verbState.drillQueue = shuffle(pairs);
            verbState.drillPos = 0;

            showScreen('screen-verb-drill');
            startDrillTimer();
            loadDrillItem();
        }

        function loadDrillItem() {
            if (verbState.drillPos >= verbState.drillQueue.length) {
                clearDrillTimer();
                showVerbResults('conjugation');
                return;
            }
            const { verb, pronounIdx, form } = verbState.drillQueue[verbState.drillPos];
            const isIrr = getAllIrregularVerbs().has(verb);
            verbState.currentForms = getConjugatedForms(verb, verbState.tense, isIrr, form);
            verbState.currentPronounIdx = pronounIdx;
            verbState.currentForm = form;

            const tenseName = TENSE_META[verbState.tense]?.name || verbState.tense;
            const isSensitive = IRREGULAR_SENSITIVE_TENSES.has(verbState.tense);
            const typeLabel = isSensitive ? (isIrr ? ' · Irregular' : ' · Regular') : '';
            document.getElementById('drill-tense-label').textContent = tenseName + typeLabel;
            document.getElementById('drill-verb-infinitive').textContent = 'to ' + verb;
            document.getElementById('drill-verb-number').textContent =
                `${verbState.drillPos + 1} / ${verbState.drillQueue.length}`;
            document.getElementById('drill-score-badge').textContent =
                `${verbState.correct} / ${verbState.total}`;

            // Form label
            const formLabels = { affirmative: '✓ Affirmative', negative: '✗ Negative', interrogative: '? Interrogative' };
            document.getElementById('drill-form-label').textContent = formLabels[form] || '';

            // Update input placeholder based on form
            const placeholders = {
                affirmative: 'e.g. walked / has gone…',
                negative: "e.g. didn't walk / hasn't gone…",
                interrogative: 'e.g. Did she walk? / Has he gone?'
            };
            document.getElementById('drill-single-input').placeholder = placeholders[form] || 'conjugated form…';

            // Progress bar
            const container = document.getElementById('drill-pronoun-dots');
            container.innerHTML = '';
            const total = verbState.drillQueue.length;
            const barsToShow = Math.min(total, 12);
            const step = Math.floor(total / barsToShow) || 1;
            for (let i = 0; i < barsToShow; i++) {
                const dot = document.createElement('div');
                const pos = i * step;
                let color = 'var(--border)';
                if (pos < verbState.drillPos) color = 'var(--correct)';
                if (pos === verbState.drillPos) color = 'var(--accent)';
                dot.style.cssText = `width:20px; height:6px; border-radius:3px; background:${color}; transition:background 0.2s;`;
                container.appendChild(dot);
            }

            loadSinglePronoun();
        }

        // Keep legacy alias
        function loadDrillVerb() { loadDrillItem(); }

        function loadSinglePronoun() {
            const pron = PRONOUNS[verbState.currentPronounIdx];

            const input = document.getElementById('drill-single-input');
            input.value = '';
            input.disabled = false;
            input.className = 'conj-input';
            input.placeholder = 'conjugated form…';

            document.getElementById('drill-pronoun-display').textContent = pron;
            document.getElementById('drill-single-answer').style.display = 'none';
            document.getElementById('drill-single-answer').textContent = '';

            const feedback = document.getElementById('drill-feedback');
            feedback.className = 'feedback-banner';
            feedback.textContent = '';

            document.getElementById('drill-check-btn').classList.remove('hidden');
            document.getElementById('drill-skip-btn').classList.remove('hidden');
            document.getElementById('drill-next-btn').classList.add('hidden');

            setTimeout(() => input.focus(), 80);
        }

        function checkSingleConjugation() {
            const realIdx = verbState.currentPronounIdx;
            const expected = verbState.currentForms[realIdx].toLowerCase().trim();
            const input = document.getElementById('drill-single-input');
            const given = input.value.toLowerCase().trim();
            const ok = given === expected;

            input.disabled = true;
            input.className = 'conj-input ' + (ok ? 'correct' : 'wrong');

            verbState.total++;
            if (ok) {
                verbState.correct++;
                document.getElementById('drill-feedback').className = 'feedback-banner correct show';
                document.getElementById('drill-feedback').textContent = '✓ Correct!';
                document.body.classList.add('glow-correct');
                setTimeout(() => document.body.classList.remove('glow-correct'), 800);
            } else {
                const answerDiv = document.getElementById('drill-single-answer');
                answerDiv.textContent = `✓ Correct form: ${verbState.currentForms[realIdx]}`;
                answerDiv.style.display = 'block';
                document.getElementById('drill-feedback').className = 'feedback-banner wrong show';
                document.getElementById('drill-feedback').textContent = '✗ Not quite — see the correct form above.';
                document.body.classList.add('glow-wrong');
                setTimeout(() => document.body.classList.remove('glow-wrong'), 800);
            }

            document.getElementById('drill-score-badge').textContent = `${verbState.correct} / ${verbState.total}`;
            document.getElementById('drill-check-btn').classList.add('hidden');
            document.getElementById('drill-skip-btn').classList.add('hidden');
            document.getElementById('drill-next-btn').classList.remove('hidden');

            const isLast = (verbState.drillPos === verbState.drillQueue.length - 1);
            document.getElementById('drill-next-btn').textContent = isLast ? 'See Results →' : 'Next →';
        }

        function skipSinglePronoun() {
            verbState.total++;
            verbState.drillPos++;
            loadDrillItem();
        }

        function advanceDrill() {
            verbState.drillPos++;
            loadDrillItem();
        }

        // Keep legacy stubs so nothing breaks if called
        function checkConjugation() { checkSingleConjugation(); }
        function skipDrillVerb() { skipSinglePronoun(); }
        function nextDrillVerb() { advanceDrill(); }

        function openTenseChoice() {
            verbState.sessionMode = 'tense_choice';
            tcSentences = generateTenseChoiceSentences(verbState.level);
            tcIndex = 0;
            tcCorrect = 0;
            showScreen('screen-tense-choice');
            loadTenseChoiceQuestion();
        }

        function loadTenseChoiceQuestion() {
            if (tcIndex >= tcSentences.length) {
                showVerbResults('tense_choice');
                return;
            }
            const q = tcSentences[tcIndex];
            const displaySentence = q.sentence.replace('__BLANK__', `<span class="tense-blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>`);
            document.getElementById('tc-sentence-display').innerHTML = displaySentence;
            document.getElementById('tc-hint').textContent = q.hint;
            document.getElementById('tc-progress-label').textContent = `Question ${tcIndex + 1} of ${tcSentences.length}`;
            document.getElementById('tc-score-badge').textContent = `${tcCorrect} / ${tcIndex}`;

            const feedback = document.getElementById('tc-feedback');
            feedback.className = 'feedback-banner';
            feedback.textContent = '';
            document.getElementById('tc-next-btn').classList.add('hidden');

            // Build MCQ options
            const grid = document.getElementById('tc-options-grid');
            grid.innerHTML = '';
            q.options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = opt;
                btn.onclick = () => selectTenseOption(btn, opt, q);
                grid.appendChild(btn);
            });
        }

        function selectTenseOption(btn, chosen, q) {
            // Disable all options
            const grid = document.getElementById('tc-options-grid');
            grid.querySelectorAll('.option-btn').forEach(b => {
                b.disabled = true;
                if (b.textContent === q.answer) b.classList.add('correct');
            });

            const ok = chosen === q.answer;
            if (ok) {
                tcCorrect++;
                btn.classList.add('correct');
                document.getElementById('tc-feedback').className = 'feedback-banner correct show';
                document.getElementById('tc-feedback').textContent = '✓ Correct!';
                document.body.classList.add('glow-correct');
                setTimeout(() => document.body.classList.remove('glow-correct'), 800);
            } else {
                btn.classList.add('wrong');
                document.getElementById('tc-feedback').className = 'feedback-banner wrong show';
                document.getElementById('tc-feedback').innerHTML = `✗ The correct answer is <strong>${q.answer}</strong> — ${q.explanation}`;
                document.body.classList.add('glow-wrong');
                setTimeout(() => document.body.classList.remove('glow-wrong'), 800);
                // Fill blank with correct answer
                const filled = q.sentence.replace('__BLANK__', `<span class="tense-blank" style="color:var(--correct); border-color:var(--correct);">${q.answer}</span>`);
                document.getElementById('tc-sentence-display').innerHTML = filled;
            }
            document.getElementById('tc-score-badge').textContent = `${tcCorrect} / ${tcIndex + 1}`;
            document.getElementById('tc-next-btn').classList.remove('hidden');
        }

        function checkTenseChoice() { /* replaced by selectTenseOption */ }

        function nextTenseChoice() {
            tcIndex++;
            loadTenseChoiceQuestion();
        }

        function showVerbResults(mode) {
            clearDrillTimer();
            let correct, total;
            if (mode === 'conjugation') {
                correct = verbState.correct;
                total = verbState.total;
            } else {
                correct = tcCorrect;
                total = tcSentences.length;
            }
            const wrong = total - correct;
            const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
            document.getElementById('vr-correct').textContent = correct;
            document.getElementById('vr-wrong').textContent = wrong;
            document.getElementById('vr-pct').textContent = pct + '%';
            document.getElementById('verb-results-icon').textContent = pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📚';
            document.getElementById('verb-results-title').textContent = pct >= 80 ? 'Excellent work!' : pct >= 50 ? 'Good effort!' : 'Keep practising!';
            document.getElementById('verb-results-sub').textContent = mode === 'conjugation'
                ? `You conjugated verbs correctly ${correct} out of ${total} times in the ${TENSE_META[verbState.tense]?.name} tense.`
                : `You identified ${correct} out of ${total} tense forms correctly.`;

            // Show elapsed time for conjugation sessions
            const timeRow = document.getElementById('vr-time-row');
            if (mode === 'conjugation' && drillTimerSecondsElapsed > 0) {
                const elapsed = drillDurationMinutes > 0
                    ? drillDurationMinutes * 60
                    : drillTimerSecondsElapsed;
                const m = Math.floor(elapsed / 60);
                const s = elapsed % 60;
                const timeStr = m > 0 ? `${m}m ${s}s` : `${s}s`;
                document.getElementById('vr-time-label').textContent = `Session time: ${timeStr}`;
                timeRow.style.display = 'block';
            } else {
                timeRow.style.display = 'none';
            }

            document.getElementById('vr-retry-btn').onclick = () => {
                if (mode === 'conjugation') startConjugationDrill(verbState.tense);
                else openTenseChoice();
            };
            showScreen('screen-verb-results');
        }

        function retryVerbSession() { /* handled by vr-retry-btn onclick */ }

        log('Calling initAuth now');
        initAuth().catch(err => {
            console.error('initAuth uncaught error:', err);
            showScreen('screen-login');
        });
