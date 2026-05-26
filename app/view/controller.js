/**
 * GÊNESE DO EQUILÍBRIO - Controlador Mestre v9.0
 * Integração Total: Diário, Histórico, Gamificação e Segurança
 */

// --- 1. CONFIGURAÇÕES E SELETORES ---
const FORM_DIARIO = document.getElementById('form-diario');
const TABELA_CORPO = document.getElementById('tabela-historico');
const FEEDBACK_IA = document.getElementById('ia-feedback');
const BADGES_CONTAINER = document.getElementById('badges-container');

// Objeto UI para facilitar o acesso
const UI = {
    botoesHumor: document.querySelectorAll('.btn-mood'),
    barraProgresso: document.getElementById('progresso-xp'),
    nivelTexto: document.getElementById('nivel-usuario'),
    xpTexto: document.getElementById('xp-valor')
};

// --- ESTADO GLOBAL ---
// Guarda o usuário logado na sessão atual (sessionStorage = some ao fechar o browser/aba)
const state = {
    get user() {
        try { return JSON.parse(sessionStorage.getItem('genese_session')); } catch { return null; }
    },
    set user(val) {
        if (val) sessionStorage.setItem('genese_session', JSON.stringify(val));
        else sessionStorage.removeItem('genese_session');
    }
};

// --- 2. MOTOR DE INTELIGÊNCIA EMOCIONAL ---
function processarAnalise(texto, humor) {
    const t = texto.toLowerCase();
    let analise = {
        mensagem: "Seu relato foi guardado com carinho. Continue sua jornada de expressão.",
        livro: "A Arte de Viver (Epicteto)",
        alerta: false
    };

    if (t.includes("nunca") || t.includes("sempre") || t.includes("tudo") || t.includes("nada")) {
        analise.mensagem = "Percebemos palavras de peso absoluto. Lembre-se: momentos difíceis são passageiros, não permanentes.";
        analise.alerta = true;
    }

    const sugestoes = {
        "Radiante": "Roube como um Artista (Austin Kleon)",
        "Bem": "O Homem em Busca de Sentido (Viktor Frankl)",
        "Neutro": "Minimalismo Digital (Cal Newport)",
        "Triste": "O Sol é Para Todos (Harper Lee)",
        "Ansioso": "Talvez você deva conversar com alguém (Lori Gottlieb)"
    };

    if (sugestoes[humor]) {
        analise.livro = sugestoes[humor];
    }

    return analise;
}

// --- 3. GESTÃO DE HISTÓRICO (UI) ---
async function carregarHistorico() {
    if (!TABELA_CORPO) return;

    try {
        const relatos = await listarRelatos();
        TABELA_CORPO.innerHTML = "";

        relatos.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.data}</td>
                <td><span class="emoji-mood">${item.emoji}</span></td>
                <td class="relato-texto">${item.relato.substring(0, 50)}${item.relato.length > 50 ? '...' : ''}</td>
                <td>
                    <button class="btn-action" onclick="deletarEntrada(${item.id})">🗑️</button>
                </td>
            `;
            TABELA_CORPO.appendChild(tr);
        });
    } catch (err) {
        console.error("Erro ao carregar histórico:", err);
    }
}

// --- 4. GAMIFICAÇÃO E PROGRESSO ---
async function atualizarProgressoUsuario(ganhoXP) {
    // Usa o email da sessão atual, ou fallback padrão
    const email = state.user?.email || "default@user.com";
    let perfil = await buscarPerfilPorEmail(email);

    if (!perfil) {
        perfil = { email: email, xp: 0, nivel: 1 };
    }

    perfil.xp += ganhoXP;
    perfil.nivel = Math.floor(perfil.xp / 100) + 1;
    const progressoNoNivel = perfil.xp % 100;

    await salvarPerfilNoBanco(perfil);

    if (UI.barraProgresso) UI.barraProgresso.style.width = `${progressoNoNivel}%`;
    if (UI.nivelTexto) UI.nivelTexto.innerText = `Nível ${perfil.nivel}`;
    if (UI.xpTexto) UI.xpTexto.innerText = `${perfil.xp} XP`;
}

// --- 5. EVENTOS E SUBMISSÃO ---
if (FORM_DIARIO) {
    FORM_DIARIO.addEventListener('submit', async (e) => {
        e.preventDefault();

        const relatoTexto = document.getElementById('texto-diario').value;
        const botaoAtivo = document.querySelector('.btn-mood.active');
        const humor = botaoAtivo ? botaoAtivo.dataset.mood : "Neutro";

        if (!relatoTexto.trim()) {
            alert("Por favor, escreva como você se sente. Suas memórias estão protegidas.");
            return;
        }

        const analise = processarAnalise(relatoTexto, humor);
        const emojisMap = { "Radiante": "🤩", "Bem": "😊", "Neutro": "😐", "Triste": "😔", "Ansioso": "😰" };

        const novoRelato = {
            relato: relatoTexto,
            emoji: emojisMap[humor] || "😐",
            data: new Date().toLocaleDateString('pt-BR'),
            analise: analise
        };

        await salvarRelato(novoRelato);
        await atualizarProgressoUsuario(10);

        if (FEEDBACK_IA) {
            document.getElementById('texto-analise').innerText = analise.mensagem;
            document.getElementById('texto-livro').innerText = `📖 Sugestão: ${analise.livro}`;
            FEEDBACK_IA.classList.remove('hidden');
        }

        FORM_DIARIO.reset();
        UI.botoesHumor.forEach(b => b.classList.remove('active'));
        carregarHistorico();
    });
}

// Seleção de Humor
UI.botoesHumor.forEach(botao => {
    botao.addEventListener('click', () => {
        UI.botoesHumor.forEach(b => b.classList.remove('active'));
        botao.classList.add('active');
    });
});

// --- 6. FUNÇÕES GLOBAIS ---
window.deletarEntrada = async (id) => {
    if (confirm("Deseja apagar permanentemente este registro?")) {
        await apagarRelato(id);
        carregarHistorico();
    }
};

// --- 7. INICIALIZAÇÃO ---
window.addEventListener('load', () => {
    carregarHistorico();
    atualizarProgressoUsuario(0);
    console.log("Controlador Mestre v9.0 iniciado e histórico sincronizado.");
});
