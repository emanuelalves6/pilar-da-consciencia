# Resumo de Aprendizado: CSS Básico

## 1. O que é CSS e por que usar arquivos externos?
O CSS (Cascading Style Sheets) é o que dá "estilo" à estrutura HTML. Usar um arquivo externo (como `style.css`) é o mais recomendado porque:
* **Organização:** Separa o conteúdo (HTML) do visual (CSS).
* **Manutenção:** Facilita alterar o design de várias páginas ao mesmo tempo.
* **Performance:** O navegador carrega o estilo uma única vez para todo o site.

## 2. Glossário de Propriedades
* **color:** Define a cor do texto.
* **background-color:** Define a cor de fundo de um elemento.
* **margin:** Cria espaço *fora* da borda do elemento (espaço entre elementos).
* **padding:** Cria espaço *dentro* do elemento (entre o conteúdo e a borda).
* **display: flex:** Transforma o elemento em um container flexível, facilitando o alinhamento de itens internos.

## 3. A Importância das Classes
As **classes** (ex: `.meu-botao`) funcionam como etiquetas. Elas permitem que a gente selecione elementos específicos no HTML para aplicar estilos sem afetar todas as tags do mesmo tipo, mantendo o código limpo e reutilizável.
