/**
 * GÊNESE DO EQUILÍBRIO - Controlador Mestre v9.0
 * Integração Total: Diário, Histórico, Gamificação e Segurança
 */

// --- 1. CONFIGURAÇÕES E SELETORES ---
const FORM_DIARIO = document.getElementById('form-diario');
const TABELA_CORPO = document.getElementById('tabela-historico');
const FEEDBACK_IA = document.getElementById('ia-feedback');
const BADGES_CONTAINER = document.getElementById('badges-container');

// --- 2. MOTOR DE INTELIGÊNCIA EMOCIONAL ---
function processarAnalise(texto, humor) {
    const t = texto.toLowerCase();
    let analise = {
        mensagem: "Seu relato foi guardado com carinho. Continue sua jornada de expressão.",
        livro: "A Arte de Viver (Epicteto)",
        alerta: false
    };

    // Detecção de Distorções Cognitivas (Generalização)
    if (t.includes("nunca") || t.includes("sempre") || t.includes("tudo") || t.includes("nada")) {
        analise.mensagem = "Percebemos palavras de peso absoluto. Lembre-se: momentos difíceis são passageiros, não permanentes.";
        analise.alerta = true;
    }

    // Curadoria de Leitura Baseada no Humor
    const sugestoes = {
        "Radiante": "Roube como um Artista (Austin Kleon)",
        "Bem": "O Homem em Busca de Sentido (Viktor Frankl)",
        "Neutro": "Minimalismo Digital (Cal Newport)",
        "Triste": "A Morte é um Dia que Vale a Pena Viver (Ana Claudia)",
        "Ansioso": "Ansiedade: Como enfrentar o mal do século (Augusto Cury)"
    };

    analise.livro = sugestoes[humor] || "Talvez Você Precise Conversar com Alguém";
    return analise;
}

// --- 3. SISTEMA DE GAMIFICAÇÃO (XP & STREAKS) ---
async function atualizarProgressoUsuario(ganhoXP = 0) {
    let user = JSON.parse(localStorage.getItem('user_genese'));
    if (!user) return;

    // Atualiza XP e Nível
    user.exp = (user.exp || 0) + ganhoXP;
    
    const niveis = [
        { nome: "🌱 Semente", min: 0 },
        { nome: "🌿 Broto", min: 20 },
        { nome: "🌳 Árvore", min: 50 },
        { nome: "✨ Mestre", min: 100 }
    ];

    const nivelAtual = [...niveis].reverse().find(n => user.exp >= n.min);
    
    // Atualiza Interface de Status
    document.getElementById('user-level').innerText = nivelAtual.nome;
    document.getElementById('streak-count').innerText = `🔥 ${user.streak || 0} dias`;
    document.getElementById('user-display-name').innerText = user.nome.split(' ')[0];

    // Lógica de Insígnias
    const relatos = await listarRelatos();
    let insignias = ["🐣 Recém-chegado"];
    if (relatos.length >= 1) insignias.push("📝 Escritor");
    if (user.exp >= 30) insignias.push("🛡️ Persistente");
    if (user.streak >= 7) insignias.push("👑 Constância");

    // Salva e Renderiza
    localStorage.setItem('user_genese', JSON.stringify(user));
    if (typeof salvarPerfilNoBanco === 'function') await salvarPerfilNoBanco(user);
    
    if (BADGES_CONTAINER) {
        BADGES_CONTAINER.innerHTML = insignias.map(i => `<span class="badge">${i}</span>`).join('');
    }
}

// --- 4. RENDERIZAÇÃO DO HISTÓRICO ---
async function carregarHistorico() {
    if (!TABELA_CORPO) return;
    
    const registros = await listarRelatos();
    TABELA_CORPO.innerHTML = "";

    registros.forEach(reg => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${reg.data}</td>
            <td style="font-size: 1.5rem">${reg.emoji}</td>
            <td title="${reg.relato}">${reg.relato.substring(0, 25)}...</td>
            <td>
                <button class="btn-delete" onclick="deletarEntrada(${reg.id})">🗑️</button>
            </td>
        `;
        TABELA_CORPO.appendChild(tr);
    });
}

// --- 5. EVENTO: SALVAR NOVO RELATO ---
if (FORM_DIARIO) {
    FORM_DIARIO.addEventListener('submit', async (e) => {
        e.preventDefault();

        const relatoTexto = document.getElementById('relato-diario').value;
        const pinDigitado = document.getElementById('pin-acesso').value;
        const humor = UI.humorSelecionado || "Neutro";
        const user = JSON.parse(localStorage.getItem('user_genese'));

        // Validação de Segurança
        if (user && pinDigitado !== user.pin) {
            alert("PIN Incorreto! Suas memórias estão protegidas.");
            return;
        }

        const analise = processarAnalise(relatoTexto, humor);
        const emojisMap = { "Radiante": "🤩", "Bem": "😊", "Neutro": "😐", "Triste": "😔", "Ansioso": "😰" };

        const novoRelato = {
            relato: relatoTexto,
            emoji: emojisMap[humor],
            data: new Date().toLocaleDateString('pt-BR'),
            analise: analise
        };

        // Persistência
        await salvarRelato(novoRelato);
        await atualizarProgressoUsuario(10); // Ganha 10 XP por desabafo
        
        // UI Feedback
        document.getElementById('texto-analise').innerText = analise.mensagem;
        document.getElementById('texto-livro').innerText = `📖 Sugestão: ${analise.livro}`;
        FEEDBACK_IA.classList.remove('hidden');

        // Reset
        FORM_DIARIO.reset();
        UI.botoesHumor.forEach(b => b.classList.remove('active'));
        carregarHistorico();
    });
}

// --- 6. FUNÇÕES GLOBAIS (WINDOW) ---
window.deletarEntrada = async (id) => {
    if (confirm("Deseja apagar permanentemente este registro?")) {
        await apagarRelato(id);
        carregarHistorico();
        atualizarProgressoUsuario(0);
    }
};

// --- 7. INICIALIZAÇÃO ---
window.addEventListener('load', () => {
    // Garante que o dashboard atualize ao entrar
    if (!document.getElementById('main-header').classList.contains('hidden')) {
        atualizarProgressoUsuario(0);
        carregarHistorico();
    }
});

