/* ==========================================================================
   CONFIGURAÇÕES INICIAIS E ESTADO
   ========================================================================== */
const state = {
    user: null,
    currentMood: null,
    isDarkMode: false
};

// Seletores Globais
const loader = document.getElementById('loader');
const body = document.body;

/* ==========================================================================
   1. FLUXO DE AUTENTICAÇÃO (Login e Cadastro)
   ========================================================================== */

// Alternância de Telas
document.getElementById('link-cadastro').addEventListener('click', () => {
    document.getElementById('login').classList.add('hidden');
    document.getElementById('cadastro').classList.remove('hidden');
});

document.querySelectorAll('.voltar-login').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById('cadastro').classList.add('hidden');
        document.getElementById('login').classList.remove('hidden');
    });
});

// Máscara de CPF
document.getElementById('cad-cpf').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    e.target.value = value;
});

// Validação de Login com Captcha
document.getElementById('form-login').addEventListener('submit', function(e) {
    e.preventDefault();
    const captchaResult = document.getElementById('check-robot-login').value;

    if (captchaResult !== "8") {
        alert("Captcha incorreto! Tente novamente.");
        return;
    }

    showLoader(true);

    // Simulação de delay de rede
    setTimeout(() => {
        showLoader(false);
        document.getElementById('login').classList.add('hidden');
        document.getElementById('app-shell').classList.remove('hidden');
        document.getElementById('global-footer').classList.remove('hidden');
        
        // Inicializa dados fictícios
        document.getElementById('user-name-display').innerText = "Viajante";
    }, 1500);
});

// Validação de Cadastro
document.getElementById('form-cadastro').addEventListener('submit', function(e) {
    e.preventDefault();
    const senha = document.getElementById('cad-senha').value;
    const confirma = document.getElementById('cad-senha-confirma').value;

    if (senha !== confirma) {
        alert("As senhas não coincidem!");
        return;
    }

    alert("Jornada iniciada com sucesso! Agora faça login.");
    this.reset();
    document.getElementById('cadastro').classList.add('hidden');
    document.getElementById('login').classList.remove('hidden');
});

/* ==========================================================================
   2. NAVEGAÇÃO E INTERFACE (Shell)
   ========================================================================== */

// Troca de Abas Sidebar
document.querySelectorAll('.nav-item').forEach(button => {
    button.addEventListener('click', () => {
        const target = button.getAttribute('data-target');
        
        // Atualizar UI dos botões
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        button.classList.add('active');

        // Alternar Seções
        document.querySelectorAll('.view-section').forEach(sec => sec.classList.add('hidden'));
        
        const targetSec = document.getElementById(`sec-${target}`);
        if(targetSec) targetSec.classList.remove('hidden');
        
        // Atualizar título da página
        document.getElementById('page-title').innerText = button.innerText.split(' ')[1];
    });
});

// Modo Escuro
document.getElementById('toggle-dark-mode').addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    body.classList.toggle('light-theme');
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    if(confirm("Deseja realmente sair?")) {
        location.reload(); // Reseta o estado da aplicação
    }
});

/* ==========================================================================
   3. CORE: DASHBOARD E "IA"
   ========================================================================== */

// Seletor de Humor
document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.mood-btn').forEach(b => b.style.transform = "scale(1)");
        this.style.transform = "scale(1.4)";
        state.currentMood = this.getAttribute('data-mood');
    });
});

// Contador de Caracteres
const entryArea = document.getElementById('daily-entry');
entryArea.addEventListener('input', (e) => {
    const count = e.target.value.length;
    document.getElementById('char-count').innerText = `${count}/1000`;
});

// Simulação Motor de IA
document.getElementById('save-entry').addEventListener('click', async () => {
    const text = entryArea.value;
    if(text.length < 10) return alert("Conte-nos um pouco mais...");

    const loaderIA = document.getElementById('ai-content-loader');
    const responseIA = document.getElementById('ai-response');
    
    loaderIA.classList.remove('hidden');
    responseIA.innerHTML = "";

    // Simulação de Processamento
    setTimeout(() => {
        loaderIA.classList.add('hidden');
        responseIA.innerHTML = `
            <p><strong>Análise:</strong> Identificamos um padrão de leve ansiedade em seu relato. 
            Lembre-se que sentimentos são nuvens, eles passam.</p>
        `;
        document.getElementById('media-rec').classList.remove('hidden');
        document.getElementById('rec-text').innerText = "Ouça 'Weightless' da Marconi Union para reduzir o cortisol.";
        
        // Desbloquear Insígnia (Gamificação)
        const firstBadge = document.querySelector('.badge.locked');
        if(firstBadge) firstBadge.classList.remove('locked');
        
    }, 2000);
});

/* ==========================================================================
   4. SISTEMA SOS E RESPIRAÇÃO (Técnica 4-7-8)
   ========================================================================== */

const sosBtn = document.getElementById('main-sos-btn');
const sosMenu = document.getElementById('sos-menu');

sosBtn.addEventListener('click', () => sosMenu.classList.toggle('hidden'));

document.getElementById('start-breathing').addEventListener('click', () => {
    document.getElementById('breathing-modal').classList.remove('hidden');
    runBreathingCycle();
});

document.querySelector('.btn-exit-modal').addEventListener('click', () => {
    document.getElementById('breathing-modal').classList.add('hidden');
});

async function runBreathingCycle() {
    const text = document.getElementById('breathing-instruction');
    const circle = document.querySelector('.circle-expand');

    const cycle = async (label, seconds, grow) => {
        text.innerText = label;
        circle.style.transition = `all ${seconds}s linear`;
        circle.style.transform = grow ? 'scale(1.5)' : 'scale(1)';
        circle.style.opacity = grow ? '0.8' : '0.3';
        await new Promise(r => setTimeout(r, seconds * 1000));
    };

    while (!document.getElementById('breathing-modal').classList.contains('hidden')) {
        await cycle("Inspire...", 4, true);
        await cycle("Segure...", 7, true);
        await cycle("Expire lentamente...", 8, false);
    }
}

/* ==========================================================================
   5. MINI-GAMES E PERSISTÊNCIA
   ========================================================================== */

// Check-list de Hábitos (Persistência Local)
const habits = ['h-sono', 'h-agua', 'h-medita'];
habits.forEach(id => {
    const el = document.getElementById(id);
    // Carregar
    el.checked = localStorage.getItem(id) === 'true';
    // Salvar
    el.addEventListener('change', (e) => {
        localStorage.setItem(id, e.target.checked);
    });
});

// Funções Auxiliares
function showLoader(show) {
    loader.classList.toggle('hidden', !show);
// Selecionando os elementos
const telaLogin = document.getElementById('login');
const telaCadastro = document.getElementById('cadastro');
const btnIrParaCadastro = document.getElementById('link-cadastro');
const btnVoltarParaLogin = document.querySelector('.voltar-login');

// Função para mostrar cadastro e esconder login
btnIrParaCadastro.addEventListener('click', () => {
    telaLogin.classList.add('hidden');
    telaCadastro.classList.remove('hidden');
});

// Função para voltar ao login
btnVoltarParaLogin.addEventListener('click', () => {
    telaCadastro.classList.add('hidden');
    telaLogin.classList.remove('hidden');
});
}
