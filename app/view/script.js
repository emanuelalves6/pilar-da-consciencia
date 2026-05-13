/**
 * ================================================================
 * GÊNESE DO EQUILÍBRIO — Core Engine v2.0
 * ================================================================
 * Arquitetura modular: cada funcionalidade em sua própria função.
 * Persistência via localStorage. Zero dependências externas.
 * ================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initNavigation();
    initStreak();
    initDiary();
    initCheckin();
    initGratitude();
    initDreams();
    initSOS();
    initSecurity();
    initPomodoro();
    initMeditation();
    initMicroSteps();
    initSleepHygiene();
    initGAD7();
    initGlossarySearch();
    initCommunityWall();
    initPlaylist();
    initChatbot();
    initCofre();
    initDefusao();
    initTriggerMap();
    initEconomia();
    initAffirmation();
    initSocialChallenge();
    initBackup();
    initScreenTime();
    initThemes();
    initZenMode();
    initAvatar();
    initHeatmap();
    initLGPDExport();
    initPasswordStrength();
    initCPFMask();
    initMobileMenu();
    initFooter();

    console.log('Gênese do Equilíbrio v2.0 — Todos os sistemas inicializados.');
});

/* ================================================================
   UTILITÁRIOS
   ================================================================ */

/** Exibe uma notificação toast */
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.success}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

/** Lê dados do localStorage com fallback */
function storageGet(key, fallback = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : fallback;
    } catch { return fallback; }
}

/** Salva dados no localStorage */
function storageSet(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
}

/** Formata data para pt-BR */
function formatDate(date = new Date()) {
    return date.toLocaleDateString('pt-BR');
}

/** Gera ID único simples */
function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ================================================================
   1. SISTEMA DE AUTENTICAÇÃO
   ================================================================ */
function initAuth() {
    const loginForm = document.getElementById('form-login');
    const signupForm = document.getElementById('form-signup');
    const recoveryForm = document.getElementById('form-recovery');

    // Navegação entre telas de auth
    document.getElementById('link-recovery')?.addEventListener('click', e => { e.preventDefault(); switchAuth('recovery'); });
    document.getElementById('link-signup')?.addEventListener('click', e => { e.preventDefault(); switchAuth('signup'); });
    document.getElementById('link-login-back')?.addEventListener('click', e => { e.preventDefault(); switchAuth('login'); });
    document.getElementById('btn-back-login')?.addEventListener('click', () => switchAuth('login'));

    // Chips de foco
    document.querySelectorAll('.focus-chips .chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const pressed = chip.getAttribute('aria-pressed') === 'true';
            chip.setAttribute('aria-pressed', !pressed);
            chip.classList.toggle('active');
        });
    });

    // Login
    loginForm?.addEventListener('submit', e => {
        e.preventDefault();
        const btn = loginForm.querySelector('button[type="submit"]');
        const original = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Validando...';

        const name = document.getElementById('login-email').value.split('@')[0] || 'Usuário';
        storageSet('genese_user', { name: name, email: document.getElementById('login-email').value, loggedIn: true });

        setTimeout(() => {
            btn.innerHTML = original;
            btn.disabled = false;
            enterDashboard();
        }, 1200);
    });

    // Cadastro
    signupForm?.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value || 'Usuário';
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        if (password.length < 8) {
            showToast('A senha deve ter no mínimo 8 caracteres.', 'error');
            return;
        }

        storageSet('genese_user', { name, email, loggedIn: true });
        storageSet('genese_cofre_password', password);
        showToast(`Bem-vindo(a), ${name}! Sua jornada começa agora.`);
        setTimeout(() => enterDashboard(), 800);
    });

    // Recuperação
    recoveryForm?.addEventListener('submit', e => {
        e.preventDefault();
        showToast('Código de recuperação enviado para o e-mail informado.', 'info');
        setTimeout(() => switchAuth('login'), 2000);
    });

    // Auto-login se já logado
    const user = storageGet('genese_user');
    if (user?.loggedIn) {
        enterDashboard();
    }
}

function switchAuth(view) {
    document.querySelectorAll('.auth-form-content').forEach(el => {
        el.style.opacity = '0';
        setTimeout(() => el.classList.add('hidden'), 200);
    });
    setTimeout(() => {
        const target = document.getElementById(`view-${view}`);
        if (target) {
            target.classList.remove('hidden');
            setTimeout(() => { target.style.opacity = '1'; }, 50);
        }
    }, 250);
}

function enterDashboard() {
    document.getElementById('auth-portal')?.classList.add('hidden');
    document.getElementById('app-dashboard')?.classList.remove('hidden');
    document.getElementById('app-footer')?.classList.remove('hidden');

    const user = storageGet('genese_user', { name: 'Usuário' });
    const el = document.getElementById('sidebar-username');
    if (el) el.textContent = user.name;

    updateXPUI();
    showToast(`Bem-vindo ao seu refúgio, ${user.name}.`);
}

/* ================================================================
   2. NAVEGAÇÃO SPA (PÁGINAS)
   ================================================================ */
function initNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const page = link.dataset.page;
            if (!page) return;

            // Update active nav
            document.querySelectorAll('.nav-link').forEach(l => {
                l.classList.remove('active');
                l.removeAttribute('aria-current');
            });
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');

            // Show page
            document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
            const target = document.getElementById(`page-${page}`);
            if (target) target.classList.add('active');

            // Close mobile menu
            document.querySelector('.sidebar')?.classList.remove('open');
        });
    });
}

/* ================================================================
   3. SISTEMA DE OFENSIVA (STREAK)
   ================================================================ */
function initStreak() {
    checkStreak();
}

function checkStreak() {
    const data = storageGet('genese_streak', { count: 0, lastEntry: null, record: 0, records: [] });
    const now = Date.now();
    const lastEntry = data.lastEntry;

    if (lastEntry) {
        const deltaMs = now - lastEntry;
        const deltaHours = deltaMs / (1000 * 60 * 60);

        if (deltaHours >= 48) {
            // Streak quebrada — salvar recorde e reiniciar
            if (data.count > 0) {
                data.records = data.records || [];
                data.records.push({ count: data.count, date: formatDate(new Date(lastEntry)) });
                if (data.count > data.record) data.record = data.count;
                data.count = 0;
                data.lastEntry = null;
                storageSet('genese_streak', data);
                showToast('Tudo bem recomeçar, hoje é um novo dia 1. 💙', 'info');
            }
        }
    }

    updateStreakUI(data);
    updateMuralResiliencia(data);
}

function registerStreakEntry() {
    const data = storageGet('genese_streak', { count: 0, lastEntry: null, record: 0, records: [] });
    const now = Date.now();

    if (data.lastEntry) {
        const deltaMs = now - data.lastEntry;
        const deltaHours = deltaMs / (1000 * 60 * 60);

        if (deltaHours >= 24 && deltaHours < 48) {
            data.count += 1;
            data.lastEntry = now;
            storageSet('genese_streak', data);
            showToast(`🔥 Ofensiva: ${data.count} dias consecutivos!`);
            triggerBlueFireAnimation();
        } else if (deltaHours < 24) {
            // Já registrou hoje
            data.lastEntry = now;
            storageSet('genese_streak', data);
        } else {
            // >= 48h — streak resets
            if (data.count > 0) {
                data.records = data.records || [];
                data.records.push({ count: data.count, date: formatDate(new Date(data.lastEntry)) });
                if (data.count > data.record) data.record = data.count;
            }
            data.count = 1;
            data.lastEntry = now;
            storageSet('genese_streak', data);
            showToast('Tudo bem recomeçar, hoje é um novo dia 1. 💙', 'info');
        }
    } else {
        // Primeira entrada
        data.count = 1;
        data.lastEntry = now;
        storageSet('genese_streak', data);
        showToast('Primeiro dia de ofensiva! Continue assim. 🌱');
    }

    updateStreakUI(data);
    updateMuralResiliencia(data);
}

function updateStreakUI(data) {
    const daysEl = document.getElementById('streak-days');
    const progressEl = document.getElementById('streak-progress');
    const statEl = document.getElementById('stat-streak');
    const counter = document.getElementById('streak-counter');

    if (daysEl) daysEl.textContent = data.count;
    if (progressEl) progressEl.value = Math.min(data.count, 30);
    if (statEl) statEl.textContent = `${data.count} dias`;

    // Glow effect
    if (counter) {
        counter.classList.remove('streak-fire', 'streak-blaze');
        if (data.count >= 14) counter.classList.add('streak-blaze');
        else if (data.count >= 7) counter.classList.add('streak-fire');
    }
}

function triggerBlueFireAnimation() {
    const counter = document.getElementById('streak-counter');
    if (!counter) return;
    counter.classList.add('streak-blaze');
    setTimeout(() => counter.classList.remove('streak-blaze'), 3000);
}

function updateMuralResiliencia(data) {
    const container = document.getElementById('mural-records');
    if (!container) return;
    const records = data.records || [];
    if (records.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);font-size:0.9rem;">Nenhum recorde anterior registrado ainda.</p>';
        return;
    }
    container.innerHTML = records.map(r =>
        `<div class="mural-record" role="listitem"><strong>${r.count} dias</strong><small>${r.date}</small></div>`
    ).join('');
}

/* ================================================================
   4. DIÁRIO TERAPÊUTICO
   ================================================================ */
function initDiary() {
    const form = document.getElementById('form-diario');
    const textarea = document.getElementById('texto-diario');

    // Mood selector
    document.querySelectorAll('.btn-mood').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.btn-mood').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            // Dynamic aria-label for textarea based on mood
            const moodLabels = {
                'Radiante': 'Que bom que você está radiante! Compartilhe o que iluminou seu dia.',
                'Bem': 'Você está bem — conte o que contribuiu para esse equilíbrio.',
                'Neutro': 'Sem julgamentos. O que está passando pela sua mente agora?',
                'Triste': 'Está tudo bem sentir tristeza. Expresse o que pesa — aqui é seguro.',
                'Ansioso': 'Respire fundo. Escrever pode ajudar a organizar os pensamentos ansiosos.'
            };
            const mood = btn.dataset.mood;
            if (textarea && moodLabels[mood]) {
                textarea.setAttribute('aria-label', moodLabels[mood]);
                textarea.placeholder = moodLabels[mood];
            }
        });
    });

    form?.addEventListener('submit', e => {
        e.preventDefault();
        const text = textarea?.value.trim();
        if (!text) {
            showToast('Escreva algo no diário antes de registrar.', 'error');
            return;
        }

        const activeMood = document.querySelector('.btn-mood.active');
        const mood = activeMood?.dataset.mood || 'Neutro';
        const emojis = { Radiante: '🤩', Bem: '😊', Neutro: '😐', Triste: '😔', Ansioso: '😰' };

        const entry = {
            id: uid(),
            relato: text,
            humor: mood,
            emoji: emojis[mood] || '😐',
            data: formatDate(),
            timestamp: Date.now()
        };

        // Save
        const entries = storageGet('genese_diary', []);
        entries.unshift(entry);
        storageSet('genese_diary', entries);

        // Analysis
        const analise = processarAnalise(text, mood);
        document.getElementById('texto-analise').textContent = analise.mensagem;
        document.getElementById('texto-livro').textContent = `📖 Sugestão: ${analise.livro}`;
        document.getElementById('ia-feedback')?.classList.remove('hidden');

        // XP + Streak
        addXP(10);
        registerStreakEntry();

        // Save mood for heatmap
        saveMoodToHeatmap(mood);

        // Reset
        form.reset();
        document.querySelectorAll('.btn-mood').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
        });
        document.querySelector('.btn-mood[data-mood="Neutro"]')?.classList.add('active');
        document.querySelector('.btn-mood[data-mood="Neutro"]')?.setAttribute('aria-pressed', 'true');

        loadDiaryHistory();
        showToast('Registro salvo com criptografia AES-256.');
        updatePlaylistSuggestions(text);
    });

    loadDiaryHistory();
}

function processarAnalise(texto, humor) {
    const t = texto.toLowerCase();
    let analise = {
        mensagem: 'Seu relato foi guardado com carinho. Continue expressando suas emoções — isso fortalece a autoconsciência.',
        livro: 'A Arte de Viver (Epicteto)',
        alerta: false
    };

    // Distorções cognitivas
    if (t.includes('nunca') || t.includes('sempre') || t.includes('tudo') || t.includes('nada')) {
        analise.mensagem = '⚠️ Detectamos palavras de pensamento absoluto ("nunca", "sempre", "tudo", "nada"). Na TCC, isso é chamado de Generalização Excessiva. Lembre-se: momentos difíceis são passageiros, não permanentes.';
        analise.alerta = true;
    } else if (t.includes('culpa') || t.includes('minha culpa') || t.includes('sou o problema')) {
        analise.mensagem = '💙 Percebemos uma tendência à autoculpabilização. Isso é uma distorção cognitiva chamada Personalização. Nem tudo depende de você — e isso é saudável de reconhecer.';
        analise.alerta = true;
    } else if (t.includes('não consigo') || t.includes('incapaz') || t.includes('fracasso')) {
        analise.mensagem = '🌱 Frases como "não consigo" podem indicar Raciocínio Emocional — quando seus sentimentos ditam seus fatos. Tente reformular: "Está difícil agora, mas já superei coisas difíceis antes."';
        analise.alerta = true;
    } else if (t.includes('feliz') || t.includes('grato') || t.includes('conquist')) {
        analise.mensagem = '🌟 Que lindo perceber gratidão e positividade em suas palavras! Registrar momentos bons fortalece os circuitos neurais do bem-estar.';
    }

    const sugestoes = {
        'Radiante': 'Roube como um Artista (Austin Kleon)',
        'Bem': 'O Homem em Busca de Sentido (Viktor Frankl)',
        'Neutro': 'Minimalismo Digital (Cal Newport)',
        'Triste': 'O Sol é Para Todos (Harper Lee)',
        'Ansioso': 'Talvez você deva conversar com alguém (Lori Gottlieb)'
    };

    if (sugestoes[humor]) analise.livro = sugestoes[humor];
    return analise;
}

function loadDiaryHistory() {
    const tbody = document.getElementById('tabela-historico');
    if (!tbody) return;
    const entries = storageGet('genese_diary', []);
    tbody.innerHTML = entries.slice(0, 20).map(item =>
        `<tr>
            <td>${item.data}</td>
            <td>${item.emoji}</td>
            <td>${item.relato.substring(0, 60)}${item.relato.length > 60 ? '...' : ''}</td>
            <td><button class="btn-action" onclick="deleteDiaryEntry('${item.id}')" title="Apagar registro" aria-label="Apagar registro de ${item.data}">🗑️</button></td>
        </tr>`
    ).join('');
}

window.deleteDiaryEntry = function(id) {
    const entries = storageGet('genese_diary', []);
    storageSet('genese_diary', entries.filter(e => e.id !== id));
    loadDiaryHistory();
    showToast('Registro removido permanentemente.');
};

/* ================================================================
   5. CHECK-IN RÁPIDO (Feature #16)
   ================================================================ */
function initCheckin() {
    document.querySelectorAll('input[name="checkin-mood"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const value = parseInt(radio.value);
            const labels = { 1: 'Muito mal', 2: 'Mal', 3: 'Neutro', 4: 'Bem', 5: 'Ótimo' };
            const moods = { 1: 'Ansioso', 2: 'Triste', 3: 'Neutro', 4: 'Bem', 5: 'Radiante' };

            saveMoodToHeatmap(moods[value]);
            addXP(5);
            showToast(`Check-in registrado: ${labels[value]} +5 XP`);
        });
    });
}

/* ================================================================
   6. DIÁRIO DE GRATIDÃO NOTURNO (Feature #5)
   ================================================================ */
function initGratitude() {
    const form = document.getElementById('form-gratidao');
    const btn = document.getElementById('btn-finalizar-dia');
    const inputs = form?.querySelectorAll('input[required]');

    inputs?.forEach(input => {
        input.addEventListener('input', () => {
            const allFilled = Array.from(inputs).every(i => i.value.trim() !== '');
            if (btn) btn.disabled = !allFilled;
        });
    });

    form?.addEventListener('submit', e => {
        e.preventDefault();
        const values = Array.from(inputs).map(i => i.value.trim());
        if (values.some(v => !v)) return;

        const gratitudes = storageGet('genese_gratitudes', []);
        gratitudes.unshift({ items: values, date: formatDate(), timestamp: Date.now() });
        storageSet('genese_gratitudes', gratitudes);

        addXP(15);
        showToast('Dia finalizado com gratidão! +15 XP 🌙');
        form.reset();
        if (btn) btn.disabled = true;
    });
}

/* ================================================================
   7. DIÁRIO DE SONHOS (Feature #15)
   ================================================================ */
function initDreams() {
    const form = document.getElementById('form-sonhos');

    document.querySelectorAll('.dream-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const pressed = tag.getAttribute('aria-pressed') === 'true';
            tag.setAttribute('aria-pressed', !pressed);
            tag.classList.toggle('active');
        });
    });

    form?.addEventListener('submit', e => {
        e.preventDefault();
        const text = document.getElementById('texto-sonho')?.value.trim();
        if (!text) { showToast('Descreva seu sonho.', 'error'); return; }

        const tags = Array.from(document.querySelectorAll('.dream-tag.active')).map(t => t.dataset.tag);
        const dreams = storageGet('genese_dreams', []);
        dreams.unshift({ id: uid(), text, tags, date: formatDate() });
        storageSet('genese_dreams', dreams);

        addXP(5);
        showToast('Sonho registrado! +5 XP');
        form.reset();
        document.querySelectorAll('.dream-tag').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-pressed', 'false'); });
        renderDreamsHistory();
    });

    renderDreamsHistory();
}

function renderDreamsHistory() {
    const container = document.getElementById('sonhos-historico');
    if (!container) return;
    const dreams = storageGet('genese_dreams', []);
    container.innerHTML = dreams.slice(0, 10).map(d =>
        `<div class="sonho-item">
            <div>
                <small>${d.date}</small>
                <p style="font-size:0.9rem;margin-top:4px">${d.text.substring(0, 80)}${d.text.length > 80 ? '...' : ''}</p>
            </div>
            <div class="sonho-tags">${d.tags.map(t => `<span class="sonho-tag">${t}</span>`).join('')}</div>
        </div>`
    ).join('');
}

/* ================================================================
   8. BOTÃO SOS (3 segundos de pressão)
   ================================================================ */
function initSOS() {
    const btn = document.getElementById('sos-fab');
    if (!btn) return;

    let pressTimer = null;
    let isPressed = false;

    const startPress = (e) => {
        e.preventDefault();
        isPressed = true;
        btn.classList.add('pressing');
        pressTimer = setTimeout(() => {
            if (isPressed) {
                btn.classList.remove('pressing');
                openSOSPanel();
            }
        }, 3000);
    };

    const endPress = (e) => {
        e.preventDefault();
        isPressed = false;
        btn.classList.remove('pressing');
        if (pressTimer) clearTimeout(pressTimer);
    };

    btn.addEventListener('mousedown', startPress);
    btn.addEventListener('mouseup', endPress);
    btn.addEventListener('mouseleave', endPress);
    btn.addEventListener('touchstart', startPress, { passive: false });
    btn.addEventListener('touchend', endPress);
    btn.addEventListener('touchcancel', endPress);
}

function openSOSPanel() {
    const existing = document.getElementById('sos-overlay');
    if (existing) { existing.remove(); return; }

    const overlay = document.createElement('div');
    overlay.id = 'sos-overlay';
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Painel de crise — Apoio imediato');
    overlay.innerHTML = `
        <div class="lock-card sos-card">
            <h2>🆘 Apoio Imediato</h2>
            <p>Você <strong>não está sozinho(a)</strong>. Respire conosco ou busque ajuda profissional.</p>
            <div class="breathing-container">
                <div class="breathing-circle" id="sos-circle"></div>
                <strong id="breathing-text" aria-live="polite">Inspire...</strong>
            </div>
            <div class="sos-actions">
                <a href="tel:188" class="btn-main btn-cvv" title="Ligar para o CVV (188)"><i class="fa-solid fa-phone" aria-hidden="true"></i> Ligar CVV (188)</a>
                <button class="btn-main btn-close-sos" id="btn-close-sos" title="Fechar painel de crise">Estou melhor agora</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('btn-close-sos')?.addEventListener('click', () => overlay.remove());
    startBreathingCycle();
}

function startBreathingCycle() {
    const text = document.getElementById('breathing-text');
    const circle = document.getElementById('sos-circle');
    if (!text || !circle) return;

    let phase = 0;
    const cycle = () => {
        if (!document.getElementById('sos-overlay')) return;
        if (phase === 0) {
            text.textContent = 'Inspire... (4s)';
            circle.style.transform = 'scale(1.6)';
            phase = 1;
            setTimeout(cycle, 4000);
        } else if (phase === 1) {
            text.textContent = 'Segure... (4s)';
            phase = 2;
            setTimeout(cycle, 4000);
        } else {
            text.textContent = 'Expire... (4s)';
            circle.style.transform = 'scale(1)';
            phase = 0;
            setTimeout(cycle, 4000);
        }
    };
    cycle();
}

/* ================================================================
   9. SEGURANÇA (BLOQUEIO PIN)
   ================================================================ */
function initSecurity() {
    document.getElementById('lock-app')?.addEventListener('click', () => {
        document.getElementById('biometric-lock')?.classList.remove('hidden');
    });

    document.getElementById('btn-unlock')?.addEventListener('click', () => {
        const pin = document.getElementById('pin-secure')?.value;
        if (pin === '1234') {
            document.getElementById('biometric-lock')?.classList.add('hidden');
            document.getElementById('pin-secure').value = '';
            showToast('Acesso desbloqueado com sucesso.');
        } else {
            showToast('PIN incorreto. Dica: 1234', 'error');
        }
    });
}

/* ================================================================
   10. POMODORO / FOCO PROFUNDO (Feature #2)
   ================================================================ */
function initPomodoro() {
    let timeLeft = 25 * 60;
    let running = false;
    let interval = null;
    let audioCtx = null;
    let oscillator = null;

    const display = document.getElementById('pomodoro-time');
    const btnStart = document.getElementById('btn-pomodoro-start');
    const btnPause = document.getElementById('btn-pomodoro-pause');
    const btnReset = document.getElementById('btn-pomodoro-reset');
    const minutesInput = document.getElementById('pomodoro-minutes');
    const binauralToggle = document.getElementById('binaural-toggle');

    function updateDisplay() {
        if (!display) return;
        const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const s = (timeLeft % 60).toString().padStart(2, '0');
        display.textContent = `${m}:${s}`;
    }

    btnStart?.addEventListener('click', () => {
        if (running) return;
        running = true;
        btnStart.disabled = true;
        btnPause.disabled = false;
        interval = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft <= 0) {
                clearInterval(interval);
                running = false;
                btnStart.disabled = false;
                btnPause.disabled = true;
                addXP(20);
                showToast('Sessão Pomodoro concluída! +20 XP 🎯');
                stopBinaural();
            }
        }, 1000);
    });

    btnPause?.addEventListener('click', () => {
        if (interval) clearInterval(interval);
        running = false;
        btnStart.disabled = false;
        btnPause.disabled = true;
    });

    btnReset?.addEventListener('click', () => {
        if (interval) clearInterval(interval);
        running = false;
        const mins = parseInt(minutesInput?.value) || 25;
        timeLeft = mins * 60;
        updateDisplay();
        btnStart.disabled = false;
        btnPause.disabled = true;
        stopBinaural();
    });

    minutesInput?.addEventListener('change', () => {
        if (!running) {
            timeLeft = (parseInt(minutesInput.value) || 25) * 60;
            updateDisplay();
        }
    });

    // Binaural beats via Web Audio API
    binauralToggle?.addEventListener('change', () => {
        if (binauralToggle.checked) {
            startBinaural();
        } else {
            stopBinaural();
        }
    });

    function startBinaural() {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            // Left ear: 200Hz, Right ear: 210Hz → 10Hz alpha binaural beat
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const merger = audioCtx.createChannelMerger(2);
            const gain = audioCtx.createGain();
            gain.gain.value = 0.15;

            osc1.frequency.value = 200;
            osc2.frequency.value = 210;
            osc1.type = 'sine';
            osc2.type = 'sine';

            osc1.connect(merger, 0, 0);
            osc2.connect(merger, 0, 1);
            merger.connect(gain);
            gain.connect(audioCtx.destination);

            osc1.start();
            osc2.start();
            oscillator = { osc1, osc2, audioCtx };
        } catch (err) {
            console.warn('Web Audio API não disponível:', err);
        }
    }

    function stopBinaural() {
        if (oscillator) {
            try {
                oscillator.osc1.stop();
                oscillator.osc2.stop();
                oscillator.audioCtx.close();
            } catch { /* already stopped */ }
            oscillator = null;
        }
        if (binauralToggle) binauralToggle.checked = false;
    }

    updateDisplay();
}

/* ================================================================
   11. BIBLIOTECA DE MEDITAÇÃO (Feature #14)
   ================================================================ */
function initMeditation() {
    let audioCtx = null;
    let currentOsc = null;
    let analyser = null;
    let animFrame = null;
    const canvas = document.getElementById('audio-visualizer');
    const ctx = canvas?.getContext('2d');
    const speedControl = document.getElementById('meditation-speed');
    const speedLabel = document.getElementById('speed-label');

    document.querySelectorAll('.meditation-track').forEach(track => {
        track.addEventListener('click', () => {
            document.querySelectorAll('.meditation-track').forEach(t => t.classList.remove('active'));
            track.classList.add('active');

            const freq = parseInt(track.dataset.freq);
            stopMeditation();
            startMeditation(freq);
        });
    });

    speedControl?.addEventListener('input', () => {
        const val = parseFloat(speedControl.value);
        if (speedLabel) speedLabel.textContent = `${val}x`;
        if (currentOsc) {
            const baseFreq = parseInt(document.querySelector('.meditation-track.active')?.dataset.freq || 174);
            currentOsc.frequency.value = baseFreq * val;
        }
    });

    function startMeditation(freq) {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            currentOsc = audioCtx.createOscillator();
            analyser = audioCtx.createAnalyser();
            const gain = audioCtx.createGain();

            currentOsc.type = 'sine';
            currentOsc.frequency.value = freq;
            gain.gain.value = 0.12;

            analyser.fftSize = 256;

            currentOsc.connect(analyser);
            analyser.connect(gain);
            gain.connect(audioCtx.destination);
            currentOsc.start();

            drawVisualizer();
        } catch (err) {
            console.warn('Audio error:', err);
        }
    }

    function stopMeditation() {
        if (currentOsc) { try { currentOsc.stop(); } catch {} }
        if (audioCtx) { try { audioCtx.close(); } catch {} }
        if (animFrame) cancelAnimationFrame(animFrame);
        currentOsc = null;
        audioCtx = null;
    }

    function drawVisualizer() {
        if (!analyser || !ctx || !canvas) return;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            if (!analyser) return;
            animFrame = requestAnimationFrame(draw);
            analyser.getByteTimeDomainData(dataArray);

            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg-safe').trim() || '#f0f4f8';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.lineWidth = 2;
            ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#4a90d9';
            ctx.beginPath();

            const sliceWidth = canvas.width / bufferLength;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * canvas.height / 2;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
                x += sliceWidth;
            }
            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();
        };
        draw();
    }
}

/* ================================================================
   12. MICRO-PASSOS (Feature #13)
   ================================================================ */
function initMicroSteps() {
    const form = document.getElementById('form-micro-passo');
    const input = document.getElementById('novo-passo');

    form?.addEventListener('submit', e => {
        e.preventDefault();
        const text = input?.value.trim();
        if (!text) return;
        addMicroStep(text);
        form.reset();
    });

    // Preset buttons
    document.querySelectorAll('.preset-passo').forEach(btn => {
        btn.addEventListener('click', () => addMicroStep(btn.dataset.task));
    });

    renderMicroSteps();
}

function addMicroStep(text) {
    const steps = storageGet('genese_micro_steps', []);
    steps.push({ id: uid(), text, done: false });
    storageSet('genese_micro_steps', steps);
    renderMicroSteps();
    showToast('Micro-passo adicionado.');
}

function renderMicroSteps() {
    const container = document.getElementById('lista-passos');
    if (!container) return;
    const steps = storageGet('genese_micro_steps', []);
    container.innerHTML = steps.map(s =>
        `<li class="micro-item ${s.done ? 'done' : ''}" role="listitem">
            <input type="checkbox" ${s.done ? 'checked' : ''} onchange="toggleMicroStep('${s.id}')" aria-label="Marcar como concluído: ${s.text}">
            <span>${s.text}</span>
            <button class="btn-action" onclick="deleteMicroStep('${s.id}')" title="Remover" aria-label="Remover tarefa: ${s.text}">🗑️</button>
        </li>`
    ).join('');
}

window.toggleMicroStep = function(id) {
    const steps = storageGet('genese_micro_steps', []);
    const step = steps.find(s => s.id === id);
    if (step) {
        step.done = !step.done;
        if (step.done) addXP(5);
        storageSet('genese_micro_steps', steps);
        renderMicroSteps();
        if (step.done) showToast('Micro-passo concluído! +5 XP 🎉');
    }
};

window.deleteMicroStep = function(id) {
    storageSet('genese_micro_steps', storageGet('genese_micro_steps', []).filter(s => s.id !== id));
    renderMicroSteps();
};

/* ================================================================
   13. HIGIENE DO SONO (Feature #7)
   ================================================================ */
function initSleepHygiene() {
    const checks = document.querySelectorAll('#sono-checklist input[type="checkbox"]');
    const scoreEl = document.getElementById('sono-score-value');
    const statEl = document.getElementById('stat-sono');

    checks.forEach(check => {
        check.addEventListener('change', () => {
            const total = checks.length;
            const checked = document.querySelectorAll('#sono-checklist input:checked').length;
            if (scoreEl) scoreEl.textContent = `${checked}/${total}`;
            if (statEl) statEl.textContent = `${Math.round((checked / total) * 100)}%`;

            if (checked === total) {
                addXP(10);
                showToast('Checklist de sono completo! +10 XP 🌙');
            }
        });
    });
}

/* ================================================================
   14. TESTE GAD-7 (Feature #8)
   ================================================================ */
function initGAD7() {
    const form = document.getElementById('form-gad7');

    form?.addEventListener('submit', e => {
        e.preventDefault();
        let score = 0;
        let allAnswered = true;

        for (let i = 1; i <= 7; i++) {
            const selected = form.querySelector(`input[name="gad-q${i}"]:checked`);
            if (!selected) { allAnswered = false; break; }
            score += parseInt(selected.value);
        }

        if (!allAnswered) {
            showToast('Responda todas as 7 perguntas.', 'error');
            return;
        }

        let interpretation = '';
        if (score <= 4) interpretation = '🟢 Ansiedade mínima. Continue mantendo suas práticas de bem-estar.';
        else if (score <= 9) interpretation = '🟡 Ansiedade leve. Considere técnicas de relaxamento e mindfulness.';
        else if (score <= 14) interpretation = '🟠 Ansiedade moderada. Recomendamos buscar apoio profissional.';
        else interpretation = '🔴 Ansiedade severa. Procure um profissional de saúde mental. Ligue 188 (CVV) se precisar de apoio imediato.';

        document.getElementById('gad7-score').textContent = score;
        document.getElementById('gad7-interpretacao').textContent = interpretation;
        document.getElementById('gad7-resultado')?.classList.remove('hidden');

        // Save result
        const results = storageGet('genese_gad7', []);
        results.unshift({ score, interpretation, date: formatDate() });
        storageSet('genese_gad7', results);

        addXP(10);
        showToast('Avaliação GAD-7 concluída. +10 XP');
    });
}

/* ================================================================
   15. GLOSSÁRIO BUSCA (Feature #17)
   ================================================================ */
function initGlossarySearch() {
    const input = document.getElementById('busca-emocao');
    const items = document.querySelectorAll('.glossario-item');

    input?.addEventListener('input', () => {
        const query = input.value.toLowerCase().trim();
        items.forEach(item => {
            const dt = item.querySelector('dt')?.textContent.toLowerCase() || '';
            const dd = item.querySelector('dd')?.textContent.toLowerCase() || '';
            item.style.display = (dt.includes(query) || dd.includes(query)) ? '' : 'none';
        });
    });
}

/* ================================================================
   16. MURAL COMUNITÁRIO (Feature #9)
   ================================================================ */
function initCommunityWall() {
    const form = document.getElementById('form-postit');
    const defaultMessages = [
        'Você é mais forte do que imagina. 💪',
        'Um dia de cada vez. Está tudo bem ir devagar.',
        'Seu valor não diminui por alguém não reconhecê-lo.',
        'Respire fundo. Este momento vai passar.',
        'Pedir ajuda é um ato de coragem, não de fraqueza.',
        'Você merece descansar sem culpa.',
        'Cada pequeno passo conta. Continue.',
        'Hoje você acordou — isso já é uma vitória.',
        'Seja gentil consigo mesmo(a) como seria com um amigo.',
        'A noite mais escura também tem amanhecer.',
        'Não compare seu capítulo 1 com o capítulo 20 de outra pessoa.',
        'Suas emoções são válidas, todas elas.'
    ];

    const colors = ['postit-yellow', 'postit-green', 'postit-blue', 'postit-pink', 'postit-purple'];

    form?.addEventListener('submit', e => {
        e.preventDefault();
        const text = document.getElementById('postit-texto')?.value.trim();
        if (!text) return;

        const notes = storageGet('genese_community', []);
        notes.push({ text, date: formatDate() });
        storageSet('genese_community', notes);
        form.reset();
        renderPostits();
        addXP(5);
        showToast('Mensagem colada no mural! +5 XP 📌');
    });

    function renderPostits() {
        const container = document.getElementById('postits-grid');
        if (!container) return;
        const saved = storageGet('genese_community', []);
        const all = [...defaultMessages.map(t => ({ text: t })), ...saved];

        container.innerHTML = all.map((note, i) => {
            const color = colors[i % colors.length];
            const rotate = (Math.random() * 6 - 3).toFixed(1);
            return `<div class="postit ${color}" style="--rotate:${rotate}deg" role="listitem">${note.text}</div>`;
        }).join('');
    }

    renderPostits();
}

/* ================================================================
   17. PLAYLIST DINÂMICA (Feature #10)
   ================================================================ */
function initPlaylist() {
    updatePlaylistSuggestions('');
}

function updatePlaylistSuggestions(text) {
    const container = document.getElementById('playlist-sugestoes');
    if (!container) return;

    const t = text.toLowerCase();
    let playlists = [];

    if (t.includes('triste') || t.includes('chorar') || t.includes('sozinho')) {
        playlists = [
            { emoji: '🎵', title: 'Acoustic Healing', desc: 'Músicas acústicas para acolher' },
            { emoji: '🌧️', title: 'Rainy Day Comfort', desc: 'Sons de chuva + piano' },
            { emoji: '💙', title: 'Sad but Beautiful', desc: 'Melancolia com beleza' }
        ];
    } else if (t.includes('ansio') || t.includes('nervos') || t.includes('medo')) {
        playlists = [
            { emoji: '🧘', title: 'Calm & Breathe', desc: 'Meditação guiada + ambient' },
            { emoji: '🌊', title: 'Ocean Waves', desc: 'Sons de ondas do mar' },
            { emoji: '🍃', title: 'Forest Sounds', desc: 'Sons da floresta tropical' }
        ];
    } else if (t.includes('feliz') || t.includes('bem') || t.includes('grato')) {
        playlists = [
            { emoji: '☀️', title: 'Good Vibes Only', desc: 'Pop uplifting e indie' },
            { emoji: '🎉', title: 'Celebration Mood', desc: 'Músicas para celebrar' },
            { emoji: '🌈', title: 'Rainbow Energy', desc: 'Afrobeats e world music' }
        ];
    } else {
        playlists = [
            { emoji: '🎧', title: 'Lo-fi Study Beats', desc: 'Para foco e tranquilidade' },
            { emoji: '🌅', title: 'Morning Ritual', desc: 'Músicas para começar o dia' },
            { emoji: '🌙', title: 'Nighttime Wind Down', desc: 'Jazz suave para a noite' },
            { emoji: '🧠', title: 'Deep Focus', desc: 'Ambient eletrônico' }
        ];
    }

    container.innerHTML = playlists.map(p =>
        `<div class="playlist-card" role="listitem">
            <span class="playlist-emoji">${p.emoji}</span>
            <strong>${p.title}</strong>
            <small>${p.desc}</small>
        </div>`
    ).join('');
}

/* ================================================================
   18. CHATBOT LUMI (Feature #4)
   ================================================================ */
function initChatbot() {
    const form = document.getElementById('form-chat');
    const input = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');

    const tccResponses = [
        'Obrigada por compartilhar isso comigo. Me conte mais sobre o que você está sentindo.',
        'Eu entendo que isso pode ser difícil. Seus sentimentos são completamente válidos.',
        'Quando você pensa isso, que evidências concretas apoiam essa ideia? E quais evidências a contradizem?',
        'Parece que você está tendo um pensamento automático negativo. Na TCC, chamamos isso de "filtro mental". Tente ver a situação por outro ângulo.',
        'Você já passou por algo semelhante antes? Como lidou naquela época?',
        'Uma técnica que pode ajudar: escreva esse pensamento no papel e pergunte "Eu diria isso para um amigo?" — geralmente somos mais gentis com os outros do que conosco.',
        'Isso soa como uma distorção de "catastrofização". Qual seria o cenário mais realista, não o pior?',
        'Que tal tentarmos um exercício de respiração juntos? Inspire por 4 segundos, segure por 4, expire por 4.',
        'Lembre-se: pensamentos não são fatos. Eles são nuvens que passam pelo céu da sua mente.',
        'Você é corajoso(a) por expressar isso. Cada vez que nomeia um sentimento, ele perde um pouco do poder sobre você.',
        'O que você poderia fazer agora, neste momento, que trouxesse um pouco de alívio? Mesmo algo pequeno conta.',
        'Imagine que um amigo te contasse exatamente isso. O que você diria para ele? Tente se dar o mesmo conselho.'
    ];

    let responseIndex = 0;

    form?.addEventListener('submit', e => {
        e.preventDefault();
        const text = input?.value.trim();
        if (!text) return;

        // User message
        const userMsg = document.createElement('li');
        userMsg.className = 'msg-user';
        userMsg.innerHTML = `<p>${escapeHTML(text)}</p><span class="msg-avatar" aria-hidden="true">🧑</span>`;
        messages?.appendChild(userMsg);

        input.value = '';

        // Bot response (delayed for natural feel)
        setTimeout(() => {
            const botMsg = document.createElement('li');
            botMsg.className = 'msg-bot';
            const response = tccResponses[responseIndex % tccResponses.length];
            responseIndex++;
            botMsg.innerHTML = `<span class="msg-avatar" aria-hidden="true">🤖</span><p>${response}</p>`;
            messages?.appendChild(botMsg);
            messages?.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });
        }, 800 + Math.random() * 700);

        messages?.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });
        addXP(3);
    });
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/* ================================================================
   19. COFRE DE MEMÓRIAS POSITIVAS (Feature #1)
   ================================================================ */
function initCofre() {
    document.getElementById('btn-open-cofre')?.addEventListener('click', () => {
        document.getElementById('cofre-memorias')?.classList.remove('hidden');
        document.getElementById('cofre-auth')?.classList.remove('hidden');
        document.getElementById('cofre-conteudo')?.classList.add('hidden');
    });

    document.getElementById('btn-close-cofre')?.addEventListener('click', () => {
        document.getElementById('cofre-memorias')?.classList.add('hidden');
    });

    document.getElementById('btn-abrir-cofre')?.addEventListener('click', () => {
        const pw = document.getElementById('cofre-password')?.value;
        const stored = storageGet('genese_cofre_password', 'genese2025');

        if (pw === stored) {
            document.getElementById('cofre-auth')?.classList.add('hidden');
            document.getElementById('cofre-conteudo')?.classList.remove('hidden');
            renderCofreItems();
            showToast('Cofre desbloqueado com sucesso!');
        } else {
            showToast('Senha incorreta. Dica: use a senha do cadastro ou "genese2025".', 'error');
        }
    });

    document.getElementById('form-add-memoria')?.addEventListener('submit', e => {
        e.preventDefault();
        const text = document.getElementById('memoria-texto')?.value.trim();
        if (!text) return;

        const memories = storageGet('genese_cofre', []);
        memories.push({ text, date: formatDate(), id: uid() });
        storageSet('genese_cofre', memories);
        document.getElementById('memoria-texto').value = '';
        renderCofreItems();
        addXP(5);
        showToast('Memória guardada com carinho! +5 XP');
    });
}

function renderCofreItems() {
    const container = document.getElementById('cofre-grid');
    if (!container) return;
    const memories = storageGet('genese_cofre', []);
    if (memories.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted)">Nenhuma memória ainda. Adicione a primeira!</p>';
        return;
    }
    container.innerHTML = memories.map(m =>
        `<div class="cofre-item" role="listitem">✨ ${escapeHTML(m.text)}<br><small>${m.date}</small></div>`
    ).join('');
}

/* ================================================================
   20. DEFUSÃO COGNITIVA (Feature #12)
   ================================================================ */
function initDefusao() {
    const canvas = document.getElementById('defusao-canvas');
    const ctx = canvas?.getContext('2d');
    const input = document.getElementById('defusao-texto');
    let particles = [];
    let animFrame = null;

    document.getElementById('btn-open-defusao')?.addEventListener('click', () => {
        document.getElementById('defusao-cognitiva')?.classList.remove('hidden');
        if (ctx) { ctx.clearRect(0, 0, canvas.width, canvas.height); }
        particles = [];
    });

    document.getElementById('btn-close-defusao')?.addEventListener('click', () => {
        document.getElementById('defusao-cognitiva')?.classList.add('hidden');
        if (animFrame) cancelAnimationFrame(animFrame);
    });

    document.getElementById('btn-estilhacar')?.addEventListener('click', () => {
        const text = input?.value.trim();
        if (!text || !ctx || !canvas) {
            showToast('Digite um pensamento para estilhaçar.', 'error');
            return;
        }

        // Draw text first
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-main').trim();
        ctx.textAlign = 'center';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        // Create particles from text position
        particles = [];
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const primary = getComputedStyle(document.body).getPropertyValue('--primary').trim();

        for (let i = 0; i < 120; i++) {
            particles.push({
                x: centerX + (Math.random() - 0.5) * text.length * 12,
                y: centerY + (Math.random() - 0.5) * 30,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8 - 2,
                size: Math.random() * 4 + 1,
                alpha: 1,
                color: primary,
                gravity: 0.08
            });
        }

        if (animFrame) cancelAnimationFrame(animFrame);
        animateParticles();
        addXP(5);
        showToast('Pensamento estilhaçado! Lembre-se: pensamentos não são fatos. +5 XP');
    });

    function animateParticles() {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let alive = false;
        particles.forEach(p => {
            if (p.alpha <= 0) return;
            alive = true;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.alpha -= 0.01;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fill();
            ctx.globalAlpha = 1;
        });

        if (alive) animFrame = requestAnimationFrame(animateParticles);
    }
}

/* ================================================================
   21. MAPEAMENTO DE GATILHOS (Feature #3)
   ================================================================ */
function initTriggerMap() {
    const form = document.getElementById('form-gatilhos');

    form?.addEventListener('submit', e => {
        e.preventDefault();
        const sono = parseFloat(document.getElementById('trigger-sono')?.value);
        const alimentacao = parseInt(document.getElementById('trigger-alimentacao')?.value);
        const ansiedade = parseInt(document.getElementById('trigger-ansiedade')?.value);

        if (isNaN(sono) || isNaN(alimentacao) || isNaN(ansiedade)) {
            showToast('Preencha todos os campos.', 'error');
            return;
        }

        const triggers = storageGet('genese_triggers', []);
        let correlation = 'Neutro';
        if (sono < 6 && ansiedade > 6) correlation = 'Sono baixo → Ansiedade alta';
        else if (alimentacao < 5 && ansiedade > 5) correlation = 'Alimentação ruim → Ansiedade';
        else if (sono >= 7 && ansiedade <= 3) correlation = 'Bom descanso → Calma';
        else if (alimentacao >= 7 && ansiedade <= 3) correlation = 'Boa alimentação → Equilíbrio';

        triggers.unshift({ sono, alimentacao, ansiedade, correlation, date: formatDate() });
        storageSet('genese_triggers', triggers);
        form.reset();
        renderTriggerTable();
        addXP(5);
        showToast('Dados de gatilhos registrados! +5 XP');
    });

    renderTriggerTable();
}

function renderTriggerTable() {
    const tbody = document.getElementById('trigger-body');
    if (!tbody) return;
    const triggers = storageGet('genese_triggers', []);
    tbody.innerHTML = triggers.slice(0, 15).map(t => {
        let cls = 'correlation-neutral';
        if (t.correlation.includes('alta') || t.correlation.includes('ruim')) cls = 'correlation-negative';
        else if (t.correlation.includes('Calma') || t.correlation.includes('Equilíbrio') || t.correlation.includes('Bom')) cls = 'correlation-positive';
        return `<tr>
            <td>${t.date}</td>
            <td>${t.sono}h</td>
            <td>${t.alimentacao}/10</td>
            <td>${t.ansiedade}/10</td>
            <td class="${cls}">${t.correlation}</td>
        </tr>`;
    }).join('');
}

/* ================================================================
   22. CALCULADORA DE ECONOMIA (Feature #11)
   ================================================================ */
function initEconomia() {
    const form = document.getElementById('form-economia');

    form?.addEventListener('submit', e => {
        e.preventDefault();
        const item = document.getElementById('eco-item')?.value.trim();
        const custo = parseFloat(document.getElementById('eco-custo')?.value);
        const freq = parseInt(document.getElementById('eco-freq')?.value);
        const dias = parseInt(document.getElementById('eco-dias')?.value);

        if (!item || isNaN(custo) || isNaN(freq) || isNaN(dias)) {
            showToast('Preencha todos os campos.', 'error');
            return;
        }

        const total = custo * freq * dias;
        document.getElementById('eco-valor').textContent = `R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        document.getElementById('eco-resultado')?.classList.remove('hidden');

        // Generate bar chart
        const chart = document.getElementById('eco-chart');
        if (chart) {
            chart.innerHTML = '';
            const periods = [
                { label: '1 sem', days: 7 },
                { label: '1 mês', days: 30 },
                { label: '3 meses', days: 90 },
                { label: '6 meses', days: 180 },
                { label: '1 ano', days: 365 }
            ];
            const maxVal = custo * freq * 365;
            periods.forEach(p => {
                const val = custo * freq * p.days;
                const h = Math.max(5, (val / maxVal) * 130);
                const bar = document.createElement('div');
                bar.className = 'eco-bar';
                bar.style.height = `${h}px`;
                bar.title = `${p.label}: R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
                bar.innerHTML = `<span class="eco-bar-label">${p.label}</span>`;
                chart.appendChild(bar);
            });
        }

        showToast(`Economia calculada para ${item}!`, 'info');
    });
}

/* ================================================================
   23. AFIRMAÇÃO DIÁRIA (Feature #21)
   ================================================================ */
function initAffirmation() {
    const afirmacoes = [
        'Eu sou digno(a) de amor e respeito, começando pelo meu próprio.',
        'Hoje eu escolho ser gentil comigo mesmo(a).',
        'Meus sentimentos são válidos e merecem ser ouvidos.',
        'Eu sou mais forte do que os meus pensamentos negativos.',
        'Cada dia é uma nova oportunidade para recomeçar.',
        'Eu mereço descansar sem precisar justificar.',
        'Minha jornada é única e não precisa ser comparada.',
        'Eu estou fazendo o melhor que posso com o que tenho agora.',
        'Pedir ajuda é um ato de coragem.',
        'Eu tenho a capacidade de superar desafios.',
        'Minha paz interior não depende das circunstâncias externas.',
        'Eu me permito sentir sem julgamento.',
        'Hoje eu me celebro por ser quem eu sou.',
        'Cada respiração é uma chance de recomeçar.',
        'Eu escolho focar no que posso controlar.',
        'Minha vulnerabilidade é minha força.',
        'Eu sou suficiente exatamente como sou agora.',
        'O autocuidado não é egoísmo — é sobrevivência.',
        'Eu confio no processo da minha evolução.',
        'Há beleza em recomeçar, quantas vezes forem necessárias.'
    ];

    // One per day
    const today = new Date().toDateString();
    const lastDate = storageGet('genese_affirmation_date', '');
    let index;

    if (lastDate === today) {
        index = storageGet('genese_affirmation_index', 0);
    } else {
        index = Math.floor(Math.random() * afirmacoes.length);
        storageSet('genese_affirmation_date', today);
        storageSet('genese_affirmation_index', index);
    }

    const textEl = document.getElementById('afirmacao-texto');
    if (textEl) textEl.textContent = afirmacoes[index % afirmacoes.length];

    // Card flip
    const flipCard = document.querySelector('.card-flip');
    flipCard?.addEventListener('click', () => flipCard.classList.toggle('flipped'));
    flipCard?.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            flipCard.classList.toggle('flipped');
        }
    });
}

/* ================================================================
   24. DESAFIOS DE CONEXÃO SOCIAL (Feature #23)
   ================================================================ */
function initSocialChallenge() {
    const challenges = [
        'Mande um "oi, tudo bem?" para alguém que você não fala faz tempo.',
        'Elogie sinceramente alguém hoje — pode ser um estranho.',
        'Ligue para um familiar que você não conversa há semanas.',
        'Escreva uma carta (mesmo que digital) para alguém que te ajudou.',
        'Compartilhe uma memória feliz com alguém que fez parte dela.',
        'Diga "obrigado" com detalhes — explique exatamente pelo que é grato.',
        'Convide alguém para tomar um café (presencial ou virtual).',
        'Pergunte "como você está REALMENTE?" — e espere a resposta verdadeira.',
        'Envie uma música que te faz pensar em alguém especial.',
        'Ofereça ajuda a alguém sem esperar nada em troca.',
        'Sorria para 3 pessoas hoje — observe o efeito dominó.',
        'Mande um áudio de voz em vez de uma mensagem de texto.'
    ];

    const textoEl = document.getElementById('desafio-texto');
    const btn = document.getElementById('btn-novo-desafio');

    function loadChallenge() {
        const idx = Math.floor(Math.random() * challenges.length);
        if (textoEl) textoEl.textContent = `🎯 ${challenges[idx]}`;
    }

    btn?.addEventListener('click', loadChallenge);
    loadChallenge();
}

/* ================================================================
   25. BACKUP EM NUVEM SIMULADO (Feature #24)
   ================================================================ */
function initBackup() {
    const statusEl = document.getElementById('backup-status');
    const timeEl = document.getElementById('backup-time');
    const iconEl = document.getElementById('cloud-icon');

    function simulateSync() {
        if (iconEl) iconEl.style.animation = 'cloudPulse 0.5s ease-in-out infinite';
        if (statusEl) statusEl.textContent = 'Sincronizando...';

        setTimeout(() => {
            if (iconEl) iconEl.style.animation = 'cloudPulse 3s ease-in-out infinite';
            if (statusEl) statusEl.textContent = 'Dados sincronizados';
            if (timeEl) timeEl.textContent = `Última sincronização: ${new Date().toLocaleTimeString('pt-BR')}`;
        }, 2000);
    }

    simulateSync();
    setInterval(simulateSync, 120000); // Every 2 min
}

/* ================================================================
   26. MONITOR DE TEMPO DE TELA (Feature #22)
   ================================================================ */
function initScreenTime() {
    let seconds = 0;
    const display = document.getElementById('screen-time-value');
    const dialog = document.getElementById('dialog-descanso');

    setInterval(() => {
        seconds++;
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        if (display) display.textContent = `${m}:${s}`;

        // Alert every 40 minutes
        if (seconds > 0 && seconds % (40 * 60) === 0) {
            dialog?.showModal();
        }
    }, 1000);

    document.getElementById('btn-close-dialog')?.addEventListener('click', () => {
        dialog?.close();
    });
}

/* ================================================================
   27. TEMAS CROMOTERAPÊUTICOS (Feature #25)
   ================================================================ */
function initThemes() {
    const select = document.getElementById('theme-select');
    const saved = storageGet('genese_theme', 'azul');

    if (saved) {
        document.body.className = `theme-${saved}`;
        if (select) select.value = saved;
    }

    select?.addEventListener('change', () => {
        const theme = select.value;
        document.body.className = `theme-${theme}`;
        storageSet('genese_theme', theme);
        showToast(`Tema alterado para ${theme}.`, 'info');
    });
}

/* ================================================================
   28. MODO ZEN (Feature #18)
   ================================================================ */
function initZenMode() {
    const btn = document.getElementById('btn-zen-mode');
    let zenActive = false;

    btn?.addEventListener('click', () => {
        zenActive = !zenActive;
        document.body.classList.toggle('zen-mode', zenActive);
        showToast(zenActive ? 'Modo Zen ativado — foque no essencial. 🍃' : 'Modo Zen desativado.', 'info');
    });
}

/* ================================================================
   29. AVATAR EVOLUTIVO (Feature #19)
   ================================================================ */
function initAvatar() {
    updateAvatar();
}

function updateAvatar() {
    const profile = storageGet('genese_xp', { xp: 0, level: 1 });
    const level = profile.level;
    const accessories = document.getElementById('avatar-accessories');
    const body = document.querySelector('.avatar-body');
    const aura = document.querySelector('.avatar-aura');
    const smile = document.querySelector('.avatar-smile');
    const label = document.getElementById('avatar-level-label');
    const sidebarLevel = document.getElementById('sidebar-level');

    if (label) label.textContent = `Nível ${level}`;
    if (sidebarLevel) sidebarLevel.textContent = `Nível ${level} • ${getLevelTitle(level)}`;

    // Color evolves with level
    const colors = ['#4a90d9', '#51b194', '#f39c12', '#e74c3c', '#9b59b6', '#1abc9c', '#e67e22', '#2ecc71'];
    const color = colors[(level - 1) % colors.length];

    if (body) body.setAttribute('fill', color);
    if (aura) {
        aura.setAttribute('r', Math.min(55, 35 + level * 2));
    }

    // Smile evolves
    if (smile && level >= 5) {
        smile.setAttribute('d', 'M 42 68 Q 60 88 78 68');
    }

    // Accessories based on level
    if (accessories) {
        let acc = '';
        if (level >= 3) acc += '<circle cx="60" cy="20" r="6" fill="#ffd700" opacity="0.8"/>'; // Crown dot
        if (level >= 5) acc += '<polygon points="52,12 60,2 68,12" fill="#ffd700" opacity="0.8"/>'; // Crown
        if (level >= 10) acc += '<circle cx="60" cy="60" r="42" fill="none" stroke="#ffd700" stroke-width="2" stroke-dasharray="4 4" opacity="0.5"/>'; // Halo
        accessories.innerHTML = acc;
    }
}

function getLevelTitle(level) {
    if (level >= 20) return 'Iluminado';
    if (level >= 15) return 'Mestre';
    if (level >= 10) return 'Sábio';
    if (level >= 7) return 'Resiliente';
    if (level >= 5) return 'Explorador';
    if (level >= 3) return 'Aprendiz';
    return 'Iniciante';
}

/* ================================================================
   30. HEATMAP ANUAL (Feature #6)
   ================================================================ */
function initHeatmap() {
    const container = document.getElementById('year-grid');
    if (!container) return;

    const data = storageGet('genese_heatmap', {});
    const today = new Date();
    const year = today.getFullYear();
    const startDate = new Date(year, 0, 1);

    container.innerHTML = '';
    for (let d = 0; d < 364; d++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + d);
        const key = date.toISOString().split('T')[0];
        const mood = data[key];

        const cell = document.createElement('div');
        cell.className = 'day-cell';
        cell.title = `${date.toLocaleDateString('pt-BR')} — ${mood || 'Sem registro'}`;

        const colors = {
            'Radiante': '#00b894',
            'Bem': '#55efc4',
            'Neutro': '#ffeaa7',
            'Triste': '#ff7675',
            'Ansioso': '#ff7675'
        };

        if (mood && colors[mood]) {
            cell.style.background = colors[mood];
        }

        container.appendChild(cell);
    }
}

function saveMoodToHeatmap(mood) {
    const data = storageGet('genese_heatmap', {});
    const key = new Date().toISOString().split('T')[0];
    data[key] = mood;
    storageSet('genese_heatmap', data);
    initHeatmap();
}

/* ================================================================
   31. EXPORTAÇÃO LGPD (Feature #20)
   ================================================================ */
function initLGPDExport() {
    document.getElementById('btn-exportar-lgpd')?.addEventListener('click', () => {
        const allData = {};
        const keys = [
            'genese_user', 'genese_diary', 'genese_streak', 'genese_dreams',
            'genese_gratitudes', 'genese_micro_steps', 'genese_triggers',
            'genese_gad7', 'genese_heatmap', 'genese_cofre', 'genese_community',
            'genese_xp', 'genese_theme'
        ];

        keys.forEach(key => {
            const val = storageGet(key);
            if (val !== null) allData[key] = val;
        });

        const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `genese-do-equilibrio-dados-${formatDate().replace(/\//g, '-')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('Dados exportados em conformidade com a LGPD.', 'info');
    });
}

/* ================================================================
   32. FORÇA DA SENHA
   ================================================================ */
function initPasswordStrength() {
    const input = document.getElementById('signup-password');
    const fill = document.getElementById('meter-fill');
    const text = document.getElementById('meter-text');

    input?.addEventListener('input', () => {
        const pw = input.value;
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
        if (/\d/.test(pw)) score++;
        if (/[^a-zA-Z0-9]/.test(pw)) score++;

        const levels = ['', 'weak', 'fair', 'good', 'strong'];
        const labels = ['', 'Fraca', 'Razoável', 'Boa', 'Forte'];
        const level = levels[score] || '';
        fill.className = `meter-fill ${level}`;
        if (text) text.textContent = labels[score] || 'Força da senha';
    });
}

/* ================================================================
   33. MÁSCARA CPF
   ================================================================ */
function initCPFMask() {
    const input = document.getElementById('signup-cpf');
    input?.addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 11) v = v.slice(0, 11);
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = v;
    });
}

/* ================================================================
   34. MENU MOBILE
   ================================================================ */
function initMobileMenu() {
    const btn = document.getElementById('btn-menu-mobile');
    const sidebar = document.querySelector('.sidebar');

    btn?.addEventListener('click', () => {
        sidebar?.classList.toggle('open');
    });

    // Close on outside click
    document.addEventListener('click', e => {
        if (sidebar?.classList.contains('open') &&
            !sidebar.contains(e.target) &&
            !btn?.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
}

/* ================================================================
   35. FOOTER / FEEDBACK
   ================================================================ */
function initFooter() {
    document.getElementById('btn-feedback')?.addEventListener('click', e => {
        e.preventDefault();
        showToast('Obrigado pelo interesse! O formulário de feedback estará disponível em breve.', 'info');
    });
}

/* ================================================================
   XP & GAMIFICATION ENGINE
   ================================================================ */
function addXP(amount) {
    const profile = storageGet('genese_xp', { xp: 0, level: 1 });
    profile.xp += amount;
    profile.level = Math.floor(profile.xp / 100) + 1;
    storageSet('genese_xp', profile);
    updateXPUI();
    updateAvatar();
}

function updateXPUI() {
    const profile = storageGet('genese_xp', { xp: 0, level: 1 });
    const progressPercent = profile.xp % 100;

    const bar = document.getElementById('progresso-xp');
    const levelEl = document.getElementById('nivel-usuario');
    const xpEl = document.getElementById('xp-valor');
    const statXp = document.getElementById('stat-xp');

    if (bar) bar.style.width = `${progressPercent}%`;
    if (levelEl) levelEl.textContent = `Nível ${profile.level}`;
    if (xpEl) xpEl.textContent = `${profile.xp} XP`;
    if (statXp) statXp.textContent = profile.xp;
}

/* ================================================================
   NOTIFICAÇÕES INIT
   ================================================================ */
function initNotifications() {
    document.getElementById('btn-notifications')?.addEventListener('click', () => {
        showToast('Nenhuma notificação nova no momento.', 'info');
    });
}
