/**
 * GÊNESE DO EQUILÍBRIO - Script v9.0 (Completo)
 * Funcionalidades: Navegação, Recuperação, Mini-jogo e SOS
 */

const UI = {
    // Telas Principais
    login: document.getElementById('login'),
    cadastro: document.getElementById('cadastro'),
    recuperar: document.getElementById('recuperar-senha'),
    header: document.getElementById('main-header'),
    main: document.getElementById('conteudo-principal'),
    sos: document.getElementById('sos-container'),
    footer: document.getElementById('main-footer'),
    
    // Navegação de Abas
    secoesApp: document.querySelectorAll('.content-section'),
    botoesNav: document.querySelectorAll('.nav-btn'),
    
    // Humor
    botoesHumor: document.querySelectorAll('.btn-mood'),
    humorSelecionado: null
};

// --- 1. NAVEGAÇÃO ENTRE TELAS (LOGIN/APP) ---
function navegarTela(destino) {
    [UI.login, UI.cadastro, UI.recuperar, UI.header, UI.main, UI.sos, UI.footer].forEach(el => el?.classList.add('hidden'));
    
    if (destino === 'app') {
        UI.header.classList.remove('hidden');
        UI.main.classList.remove('hidden');
        UI.sos.classList.remove('hidden');
        UI.footer.classList.remove('hidden');
        trocarAba('diario'); // Começa sempre no diário
    } else {
        document.getElementById(destino).classList.remove('hidden');
    }
}

// --- 2. NAVEGAÇÃO DE ABAS (DIÁRIO / HISTÓRICO / RELAX) ---
function trocarAba(idAba) {
    UI.secoesApp.forEach(sec => sec.classList.add('hidden'));
    UI.botoesNav.forEach(btn => btn.classList.remove('active'));
    
    const abaAtiva = document.getElementById(idAba);
    const btnAtivo = document.querySelector(`[data-target="${idAba}"]`);
    
    if (abaAtiva) abaAtiva.classList.remove('hidden');
    if (btnAtivo) btnAtivo.classList.add('active');

    if (idAba === 'jogos') iniciarJogo();
}

UI.botoesNav.forEach(btn => {
    btn.addEventListener('click', () => {
        const alvo = btn.getAttribute('data-target');
        if (alvo) trocarAba(alvo);
    });
});

// --- 3. RECUPERAÇÃO DE SENHA (SIMULADA) ---
let codigoGerado = null;

document.getElementById('btn-esqueci-senha').addEventListener('click', () => navegarTela('recuperar-senha'));

document.getElementById('btn-enviar-codigo').addEventListener('click', () => {
    const email = document.getElementById('email-recuperar').value;
    if (!email) return alert("Digite seu e-mail.");
    
    codigoGerado = Math.floor(1000 + Math.random() * 9000); // Gera 4 dígitos
    alert(`[Simulação] Código enviado para ${email}: ${codigoGerado}`);
    
    document.getElementById('etapa-email').classList.add('hidden');
    document.getElementById('etapa-codigo').classList.remove('hidden');
});

document.getElementById('btn-confirmar-nova-senha').addEventListener('click', () => {
    const codDigitado = document.getElementById('codigo-verificacao').value;
    const novaSenha = document.getElementById('nova-senha').value;
    const user = JSON.parse(localStorage.getItem('user_genese'));

    if (codDigitado == codigoGerado && user) {
        user.senha = novaSenha;
        localStorage.setItem('user_genese', JSON.stringify(user));
        alert("Senha alterada com sucesso!");
        navegarTela('login');
    } else {
        alert("Código incorreto ou usuário não encontrado.");
    }
});

// --- 4. MINI-JOGO: BOLHAS DE CALMA ---
let pontuacao = 0;
function iniciarJogo() {
    const container = document.getElementById('game-container');
    const scoreEl = document.getElementById('game-score');
    container.innerHTML = "";
    pontuacao = 0;
    scoreEl.innerText = pontuacao;

    const gameInterval = setInterval(() => {
        if (document.getElementById('jogos').classList.contains('hidden')) {
            clearInterval(gameInterval);
            return;
        }

        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.left = Math.random() * (container.offsetWidth - 50) + "px";
        bubble.innerText = "🫧";
        
        bubble.onclick = () => {
            pontuacao++;
            scoreEl.innerText = pontuacao;
            bubble.remove();
        };

        container.appendChild(bubble);
        setTimeout(() => bubble.remove(), 4000);
    }, 1000);
}

// --- 5. LOGIN E CADASTRO ---
document.getElementById('form-login').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email-login').value;
    const senha = document.getElementById('senha-login').value;
    const salvo = JSON.parse(localStorage.getItem('user_genese'));

    if (salvo && email === salvo.email && senha === salvo.senha) {
        navegarTela('app');
    } else {
        alert("E-mail ou senha incorretos.");
    }
});

document.querySelectorAll('.voltar-login').forEach(el => {
    el.onclick = () => navegarTela('login');
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    location.reload(); // Reinicia o app para segurança
});

// Inicialização de Humores
UI.botoesHumor.forEach(btn => {
    btn.addEventListener('click', () => {
        UI.botoesHumor.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        UI.humorSelecionado = btn.dataset.mood;
    });
});

// SOS CVV
document.getElementById('btn-cvv').onclick = () => window.open('https://www.cvv.org.br', '_blank');

// Inicia na tela de login
navegarTela('login');

