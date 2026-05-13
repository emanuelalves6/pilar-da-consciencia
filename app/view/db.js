/**
 * GÊNESE DO EQUILÍBRIO - Banco de Dados v9.0 (Estável)
 * Foco: Persistência de Evolução e Recuperação de Acesso via IndexedDB
 */

const NOME_DB = "GeneseEquilibrioV9";
const VERSAO_DB = 1;
const STORE_DIARIO = "historico_emocional";
const STORE_USER = "perfil_usuario";

/**
 * Abre a conexão com o banco de dados e cria as tabelas se necessário.
 */
async function abrirConexao() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(NOME_DB, VERSAO_DB);

        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            // Tabela de relatos (id autoincremento)
            if (!db.objectStoreNames.contains(STORE_DIARIO)) {
                db.createObjectStore(STORE_DIARIO, { keyPath: "id", autoIncrement: true });
            }
            // Tabela de usuários (chave primária é o email)
            if (!db.objectStoreNames.contains(STORE_USER)) {
                db.createObjectStore(STORE_USER, { keyPath: "email" });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Erro ao conectar ao banco de dados.");
    });
}

/** --- GESTÃO DE RELATOS --- **/

/**
 * Salva um novo relato no histórico emocional.
 */
async function salvarRelato(dados) {
    const db = await abrirConexao();
    return new Promise((resolve, reject) => {
        const transacao = db.transaction([STORE_DIARIO], "readwrite");
        const store = transacao.objectStore(STORE_DIARIO);
        // Garante que o relato tenha data ISO para ordenação posterior
        dados.dataISO = new Date().toISOString();
        const request = store.add(dados);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Erro ao salvar relato.");
    });
}

/**
 * Retorna todos os relatos ordenados do mais recente para o mais antigo.
 */
async function listarRelatos() {
    const db = await abrirConexao();
    return new Promise((resolve, reject) => {
        const transacao = db.transaction([STORE_DIARIO], "readonly");
        const store = transacao.objectStore(STORE_DIARIO);
        const request = store.getAll();
        request.onsuccess = () => {
            // Ordenação lógica baseada na data ISO
            const lista = request.result.sort((a, b) => new Date(b.dataISO) - new Date(a.dataISO));
            resolve(lista);
        };
        request.onerror = () => reject("Erro ao carregar histórico.");
    });
}

/**
 * Apaga um relato específico pelo ID.
 */
async function apagarRelato(id) {
    const db = await abrirConexao();
    return new Promise((resolve, reject) => {
        const transacao = db.transaction([STORE_DIARIO], "readwrite");
        const store = transacao.objectStore(STORE_DIARIO);
        const request = store.delete(Number(id));
        request.onsuccess = () => resolve();
        request.onerror = () => reject("Erro ao apagar relato.");
    });
}

/** --- GESTÃO DE PERFIL E SEGURANÇA --- **/

/**
 * Salva ou atualiza os dados do perfil do utilizador (XP, Senha, PIN).
 */
async function salvarPerfilNoBanco(perfil) {
    const db = await abrirConexao();
    return new Promise((resolve, reject) => {
        const transacao = db.transaction([STORE_USER], "readwrite");
        const store = transacao.objectStore(STORE_USER);
        const request = store.put(perfil); // O 'put' atualiza se o email já existir
        request.onsuccess = () => resolve();
        request.onerror = () => reject("Erro ao atualizar perfil.");
    });
}

/**
 * Procura um perfil de utilizador pelo email.
 */
async function buscarPerfilPorEmail(email) {
    const db = await abrirConexao();
    return new Promise((resolve) => {
        const transacao = db.transaction([STORE_USER], "readonly");
        const store = transacao.objectStore(STORE_USER);
        const request = store.get(email);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
    });
}

console.log("📦 Banco de Dados v9.0 sincronizado e pronto.");
