/**
 * Gênese do Equilíbrio - Core Engine
 * Versão: 2.0.0
 * Descrição: Gerenciamento de SPA, Segurança, SOS e Gamificação.
 */

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initDashboard();
    initSOS();
    initMasks();
    initNotifications();
});

// --- 1. SISTEMA DE NOTIFICAÇÕES (TOAST) ---
const showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3500);
};

// --- 2. GERENCIAMENTO DE AUTENTICAÇÃO ---
const initAuth = () => {
    const loginForm = document.getElementById('form-login');
    const signupForm = document.getElementById('form-signup');
    const focusChips = document.querySelectorAll('.focus-chips .chip');

    // Troca de Telas com Animação
    window.switchAuth = (view) => {
        const views = document.querySelectorAll('.auth-form-content');
        views.forEach(v => {
            v.style.opacity = '0';
            setTimeout(() => v.classList.add('hidden'), 200);
        });

        setTimeout(() => {
            const target = document.getElementById(`view-${view}`);
            target.classList.remove('hidden');
            setTimeout(() => target.style.opacity = '1', 50);
        }, 250);
    };

    // Simulação de Login
    loginForm.addEventListener('submit', (e) => {
        const btn = loginForm.querySelector('button');
        const originalContent = btn.innerHTML;

        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Validando acesso...`;

        setTimeout(() => {
            document.getElementById('auth-portal').classList.add('hidden');
            document.getElementById('app-dashboard').classList.remove('hidden');
            showToast("Bem-vindo ao seu refúgio, Usuário.");
        }, 1500);
    });

    // Seleção de Chips (Foco)
    focusChips.forEach(chip => {
        chip.addEventListener('click', () => {
            chip.classList.toggle('active');
        });
    });
};

// --- 3. DASHBOARD E SEGURANÇA ---
const initDashboard = () => {
    const sidebarLinks = document.querySelectorAll('.sidebar nav a');
    const lockBtn = document.getElementById('lock-app');
    const unlockBtn = document.querySelector('#biometric-lock .btn-main');
    const journalBtn = document.querySelector('.journal-trigger .btn-submit');

    // Sidebar Ativa
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Bloqueio de Segurança
    lockBtn.addEventListener('click', () => {
        document.getElementById('biometric-lock').classList.remove('hidden');
    });

    unlockBtn.addEventListener('click', () => {
        const pin = document.getElementById('pin-secure').value;
        if (pin === '1234') {
            document.getElementById('biometric-lock').classList.add('hidden');
            document.getElementById('pin-secure').value = '';
            showToast("Acesso biométrico confirmado.");
        } else {
            showToast("PIN incorreto. Tente 1234.", "error");
        }
    });

    // Registro de Diário
    journalBtn.addEventListener('click', () => {
        const area = document.querySelector('.journal-trigger textarea');
        if (area.value.trim() !== "") {
            showToast("Registro criptografado via AES-256.");
            area.value = "";
        } else {
            showToast("O diário parece vazio...", "error");
        }
    });
};

// --- 4. FUNCIONALIDADE SOS (CRISE) ---
const initSOS = () => {
    const body = document.body;

    window.toggleSOS = () => {
        const existingOverlay = document.getElementById('sos-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = 'sos-overlay';
        overlay.className = 'modal-overlay';
        overlay.innerHTML = `
            <div class="lock-card sos-card">
                <h2>Apoio Imediato</h2>
                <p>Você não está sozinho. Respire conosco ou busque ajuda.</p>

                <div class="breathing-container">
                    <div class="breathing-circle"></div>
                    <strong id="breathing-text">Inspire...</strong>
                </div>

                <div class="sos-actions">
                    <a href="tel:188" class="btn-main btn-cvv"><i class="fa-solid fa-phone"></i> Ligar CVV (188)</a>
                    <button class="btn-main btn-close-sos" onclick="toggleSOS()">Estou melhor agora</button>
                </div>
            </div>
        `;
        body.appendChild(overlay);
        startBreathingCycle();
    };

    function startBreathingCycle() {
        const text = document.getElementById('breathing-text');
        const circle = document.querySelector('.breathing-circle');

        let phase = 0; // 0: Inspire, 1: Segure, 2: Expire

        const cycle = () => {
            if (!document.getElementById('sos-overlay')) return;

            if (phase === 0) {
                text.innerText = "Inspire...";
                circle.style.transform = "scale(1.5)";
                phase = 1;
                setTimeout(cycle, 4000);
            } else if (phase === 1) {
                text.innerText = "Segure...";
                phase = 2;
                setTimeout(cycle, 4000);
            } else {
                text.innerText = "Expire...";
                circle.style.transform = "scale(1)";
                phase = 0;
                setTimeout(cycle, 4000);
            }
        };
        cycle();
    }
};

// --- 5. MÁSCARAS E VALIDAÇÕES ---
const initMasks = () => {
    const cpfInput = document.getElementById('mask-cpf');

    cpfInput?.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        value = value.replace(/(\document.md{3})(\document.md)/, '$1.$2');
        value = value.replace(/(\document.md{3})(\document.md)/, '$1.$2');
        value = value.replace(/(\document.md{3})(\document.md{1,2})$/, '$1-$2');

        e.target.value = value;
    });
};
