/**
 * GÊNESE DO EQUILÍBRIO - Script v4.0
 * Funcionalidades: Fluxo de Cadastro, Recuperação de Senha, Login e Navegação
 */

// --- 1. MAPEAMENTO AMPLIADO DE ELEMENTOS ---
const UI = {
    // Seções principais
    secaoLogin: document.getElementById('login'),
    secaoCadastro: document.getElementById('cadastro'),
    secaoEsqueci: document.getElementById('esqueci-senha'),
    header: document.getElementById('main-header'),
    conteudoPrincipal: document.getElementById('conteudo-principal'),
    sosContainer: document.getElementById('sos-container'),

    // Formulários
    formLogin: document.getElementById('form-login'),
    formCadastro: document.getElementById('form-cadastro'),
    formEsqueciEmail: document.getElementById('form-esqueci-email'),
    formNovaSenha: document.getElementById('form-nova-senha'),
    formDiario: document.getElementById('form-diario'),

    // Links de navegação entre telas de Auth
    linkCadastro: document.getElementById('link-cadastro'),
    linkEsqueci: document.getElementById('link-esqueci'),
    botoesVoltar: document.querySelectorAll('.voltar-login'),
    btnLogout: document.getElementById('logout-btn'),

    // Inputs específicos para lógica
    inputRecuperarEmail: document.getElementById('recuperar-email'),
    instrucaoRecuperar: document.getElementById('instrucao-recuperar')
};

// --- 2. GERENCIADOR DE TELAS (NAVEGAÇÃO) ---
function mostrarTela(idDesejado) {
    const telas = [UI.secaoLogin, UI.secaoCadastro, UI.secaoEsqueci, UI.conteudoPrincipal];
    telas.forEach(tela => tela.classList.add('hidden'));
    UI.header.classList.add('hidden');
    UI.sosContainer.classList.add('hidden');

    if (idDesejado === 'dashboard') {
        UI.header.classList.remove('hidden');
        UI.conteudoPrincipal.classList.remove('hidden');
        UI.sosContainer.classList.remove('hidden');
    } else {
        document.getElementById(idDesejado).classList.remove('hidden');
    }
}

// Eventos de troca de tela
UI.linkCadastro.addEventListener('click', (e) => { e.preventDefault(); mostrarTela('cadastro'); });
UI.linkEsqueci.addEventListener('click', (e) => { e.preventDefault(); mostrarTela('esqueci-senha'); });
UI.botoesVoltar.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); mostrarTela('login'); }));

// --- 3. LÓGICA DE CADASTRO ---
UI.formCadastro.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const usuario = {
        nome: document.getElementById('cad-nome').value,
        email: document.getElementById('cad-email').value,
        username: document.getElementById('cad-username').value,
        pin: document.getElementById('cad-pin').value,
        senha: document.getElementById('cad-senha').value
    };

    // Salva temporariamente no navegador
    localStorage.setItem('usuarioAtivo', JSON.stringify(usuario));
    
    alert("Conta criada com sucesso! Agora você pode acessar.");
    UI.formCadastro.reset();
    mostrarTela('login');
});

// --- 4. LÓGICA DE LOGIN ---
UI.formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email-login').value;
    const senha = document.getElementById('senha-login').value;

    // Busca o usuário "cadastrado"
    const userSalvo = JSON.parse(localStorage.getItem('usuarioAtivo'));

    if (userSalvo && email === userSalvo.email && senha === userSalvo.senha) {
        mostrarTela('dashboard');
        alert(`Bem-vindo de volta, ${userSalvo.username}!`);
    } else {
        alert("E-mail ou senha incorretos. (Dica: Cadastre-se primeiro)");
    }
});

// --- 5. FLUXO DE ESQUECI A SENHA ---
UI.formEsqueciEmail.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = UI.inputRecuperarEmail.value;
    
    // Simula envio de e-mail
    UI.instrucaoRecuperar.innerText = `Enviamos um código de 6 dígitos para ${email}. Digite-o abaixo:`;
    UI.formEsqueciEmail.classList.add('hidden');
    UI.formNovaSenha.classList.remove('hidden');
});

UI.formNovaSenha.addEventListener('submit', (e) => {
    e.preventDefault();
    const novaSenha = document.getElementById('nova-senha').value;
    const userSalvo = JSON.parse(localStorage.getItem('usuarioAtivo'));

    if(userSalvo) {
        userSalvo.senha = novaSenha;
        localStorage.setItem('usuarioAtivo', JSON.stringify(userSalvo));
    }

    alert("Senha alterada com sucesso! Faça login com a nova senha.");
    UI.formNovaSenha.classList.add('hidden');
    UI.formEsqueciEmail.classList.remove('hidden');
    UI.instrucaoRecuperar.innerText = "Digite seu e-mail para receber o link de alteração.";
    mostrarTela('login');
});

// --- 6. FUNCIONALIDADES DO DIÁRIO ---
UI.formDiario.addEventListener('submit', (e) => {
    e.preventDefault();
    const pinDigitado = document.getElementById('pin-acesso').value;
    const userSalvo = JSON.parse(localStorage.getItem('usuarioAtivo'));
    
    // Se não tiver cadastro, usa o 1234 como padrão, se tiver, usa o PIN do cadastro
    const pinCorreto = userSalvo ? userSalvo.pin : "1234";

    if (pinDigitado === pinCorreto) {
        alert("Relato salvo com segurança no seu histórico!");
        UI.formDiario.reset();
    } else {
        alert("PIN incorreto. Acesso negado ao diário.");
    }
});

// --- 7. LOGOUT E SOS ---
UI.btnLogout.addEventListener('click', (e) => {
    e.preventDefault();
    if(confirm("Deseja encerrar sua sessão?")) mostrarTela('login');
});

document.querySelector('.btn-sos').addEventListener('click', () => {
    if(confirm("Deseja ser redirecionado ao CVV (Apoio Emocional)?")) {
        window.open('https://www.cvv.org.br', '_blank');
    }
});

// --- 8. NAVEGAÇÃO ENTRE ABAS DO DASHBOARD ---
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href').replace('#', '');
        if(targetId !== '' && targetId !== '#') {
            e.preventDefault();
            // Esconde todas as seções do main
            document.querySelectorAll('main section').forEach(sec => sec.classList.add('hidden'));
            // Mostra apenas a clicada
            document.getElementById(targetId).classList.remove('hidden');
        }
    });
});

