# Documentação de Requisitos - Gênese do Equilíbrio

Este documento detalha os requisitos funcionais e não funcionais do sistema Gênese do Equilíbrio, focado no combate à autossabotagem e promoção do autocuidado.

## 1. Requisitos Funcionais (RF)

| ID | Requisito | Descrição | Prioridade |
|:---|:---|:---|:---|
| RF01 | Cadastro e Onboarding | Registro de usuário com avaliação emocional inicial (timidez, ansiedade, etc). | Alta |
| RF02 | Resumo do Dia | Espaço para o usuário relatar seu dia; é o gatilho para manter a ofensiva. | Alta |
| RF03 | Feedback Analítico de IA | A IA deve analisar o resumo do dia e identificar distorções cognitivas. | Alta |
| RF04 | Botão de Acolhimento | Acesso rápido a técnicas de respiração e contato direto com o CVV. | Alta |
| RF05 | Camada de Segurança Extra | Exigência de PIN/Biometria para acessar o diário e históricos. | Alta |
| RF06 | Sistema de Ofensivas | Contador de dias consecutivos (streaks) para incentivar a constância. | Média |
| RF07 | Gamificação (Insígnias) | Atribuição de níveis e medalhas conforme o progresso do usuário. | Média |
| RF08 | Curadoria de Mídia via IA | IA recomenda livros/filmes e gera quizzes automáticos de 75% de acerto. | Média |
| RF09 | Rastreador de Hábitos | Registro de metas (sono, café) para correlação com o humor. | Média |
| RF10 | Relatório Terapêutico | Exportação de histórico em PDF para ser compartilhado com profissionais. | Baixa |
| RF11 | Notificações via E-mail | Lembretes automáticos para evitar a procrastinação e abandono. | Baixa |

## 2. Requisitos Não Funcionais (RNF)

| ID | Categoria | Descrição |
|:---|:---|:---|
| RNF01 | Segurança | Criptografia de ponta a ponta (AES-256) nos relatos do diário. |
| RNF02 | Privacidade | Total conformidade com a LGPD (Direito ao esquecimento e exportação). |
| RNF03 | Usabilidade | Interface minimalista com cores terapêuticas (tons pastéis e calmos). |
| RNF04 | Desempenho | O feedback da IA deve ser gerado em no máximo 8 segundos. |
| RNF05 | Disponibilidade | O sistema deve ter uptime de 99,9% (especialmente para funções de crise). |
| RNF06 | Responsividade | O sistema deve ser Mobile-First, operando perfeitamente em smartphones. |

---
*Documento gerado em colaboração com o Agente de IA Product Management.*
