/**
 * GÊNESE DO EQUILÍBRIO - Script Principal
 * Funcionalidades: Login, Gerenciamento de Diário e Sistema SOS
 */

// --- 1. MAPEAMENTO DE ELEMENTOS DO DOM ---
const elementos = {
    formLogin: document.getElementById('form-login'),
    formDiario: document.querySelector('#diario form'),
    secaoLogin: document.getElementById('login'),
    header: document.querySelector('header'),
    conteudoPrincipal: document.getElementById('conteudo-principal'),
    btnSOS: document.querySelector('.btn-sos'),
    relatoTexto: document.getElementById('relato-diario'),
    pinAcesso: document.getElementById('pin-acesso')
};

// --- 2. SISTEMA DE NAVEGAÇÃO (LOGIN) ---
elementos.formLogin.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita recarregar a página

    // Simulação de autenticação
    console.log("🔐 Autenticando usuário...");
    
    // Transição suave de telas
    elementos.secaoLogin.classList.add('hidden');
    elementos.header.classList.remove('hidden');
    elementos.conteudoPrincipal.classList.remove('hidden');

    // Feedback visual
    alert("Bem-vindo ao seu refúgio seguro.");
});

// --- 3. LÓGICA DO DIÁRIO (MANIPULAÇÃO DE DADOS) ---
elementos.formDiario.addEventListener('submit', (event) => {
    event.preventDefault();

    // Capturando os valores (Tipos de Dados: String)
    const relato = elementos.relatoTexto.value;
    const pin = elementos.pinAcesso.value;

    // Lógica simples de validação
    if (relato.length < 10) {
        alert("O seu desabafo é importante. Tente escrever um pouco mais sobre como se sente.");
        return;
    }

    if (pin === "1234") { // Exemplo de PIN estático para teste
        console.log("✅ Relato enviado com sucesso!");
        console.log("Conteúdo capturado:", relato);
        
        alert("Seu relato foi salvo e criptografado com sucesso. Respire fundo.");
        
        // Limpa o formulário após o envio
        elementos.formDiario.reset();
    } else {
        alert("PIN de segurança incorreto. Tente novamente.");
    }
});

// --- 4. SISTEMA DE ACOLHIMENTO (SOS) ---
elementos.btnSOS.addEventListener('click', () => {
    const confirmar = confirm("Você será redirecionado para informações de apoio emocional (CVV). Deseja continuar?");
    
    if (confirmar) {
        // Abre o site do CVV em uma nova aba
        window.open('https://www.cvv.org.br', '_blank');
    }
});

// --- 5. LOGOUT (VOLTAR AO LOGIN) ---
const btnSair = document.querySelector('.btn-logout');
btnSair.addEventListener('click', (e) => {
    e.preventDefault();
    
    if(confirm("Deseja realmente encerrar sua sessão?")) {
        elementos.header.classList.add('hidden');
        elementos.conteudoPrincipal.classList.add('hidden');
        elementos.secaoLogin.classList.remove('hidden');
    }
});

console.log("🚀 Sistema Gênese do Equilíbrio carregado e pronto.");

