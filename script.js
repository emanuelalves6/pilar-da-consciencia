// 1. Selecionar os elementos que vamos manipular
const formLogin = document.getElementById('form-login');
const secaoLogin = document.getElementById('login');
const header = document.querySelector('header');
const conteudoPrincipal = document.getElementById('conteudo-principal');

// 2. Escutar o momento em que o usuário clica no botão de entrar
formLogin.addEventListener('submit', function(event) {
    
    // Evita que a página recarregue (comportamento padrão de formulários)
    event.preventDefault();

    // 3. Trocar as classes para esconder o login e mostrar o conteúdo
    secaoLogin.classList.add('hidden');       // Esconde o Login
    header.classList.remove('hidden');       // Mostra o Menu
    conteudoPrincipal.classList.remove('hidden'); // Mostra o Diário

    // Feedback no console para sabermos que funcionou
    console.log("Login realizado com sucesso! Bem-vindo ao Gênese do Equilíbrio.");
});
