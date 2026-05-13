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
        const relatos = await listarRelatos(); // Função do db.js
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
    let perfil = await buscarPerfilPorEmail(state.user?.email || "default@user.com");

    if (!perfil) {
        perfil = { email: "default@user.com", xp: 0, nivel: 1 };
    }

    perfil.xp += ganhoXP;

    // Lógica simples de nível (cada 100 XP sobe um nível)
    perfil.nivel = Math.floor(perfil.xp / 100) + 1;
    const progressoNoNivel = perfil.xp % 100;

    // Salvar no Banco
    await salvarPerfilNoBanco(perfil);

    // Atualizar UI
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

        // Persistência no Banco de Dados (db.js)
        await salvarRelato(novoRelato);
        await atualizarProgressoUsuario(10); // Ganha 10 XP por desabafo

        // UI Feedback da IA
        if (FEEDBACK_IA) {
            document.getElementById('texto-analise').innerText = analise.mensagem;
            document.getElementById('texto-livro').innerText = `📖 Sugestão: ${analise.livro}`;
            FEEDBACK_IA.classList.remove('hidden');
        }

        // Reset do Formulário
        FORM_DIARIO.reset();
        UI.botoesHumor.forEach(b => b.classList.remove('active'));
        carregarHistorico();
    });
}

// Seleção de Humor (Click nos Emojis)
UI.botoesHumor.forEach(botao => {
    botao.addEventListener('click', () => {
        UI.botoesHumor.forEach(b => b.classList.remove('active'));
        botao.classList.add('active');
    });
});

// --- 6. FUNÇÕES GLOBAIS (WINDOW) ---
window.deletarEntrada = async (id) => {
    if (confirm("Deseja apagar permanentemente este registro?")) {
        await apagarRelato(id); // Função do db.js
        carregarHistorico();
    }
};

// --- 7. INICIALIZAÇÃO ---
window.addEventListener('load', () => {
    carregarHistorico();
    atualizarProgressoUsuario(0); // Apenas para carregar a UI inicial
    console.log("Controlador Mestre v9.0 iniciado e histórico sincronizado.");
});
