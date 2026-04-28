<?php
/**
 * controller.php
 * Orquestra Service + Model e decide a resposta para o usuário.
 */

require_once __DIR__ . '/model.php';
require_once __DIR__ . '/service.php';

class MatriculaController
{
    public function processarMatricula(array $dados): void
    {
        try {
            $service = new MatriculaService();
            $processado = $service->processar($dados);

            $aluno = new AlunoModel();
            $aluno->setNome($processado['nome']);
            $aluno->setIdade($processado['idade']);
            $aluno->setCurso($processado['curso']);

            $id = $aluno->save();

            $this->renderSucesso($processado, $id);
        } catch (Exception $e) {
            $this->renderErro($e->getMessage());
        }
    }

    public function exibirFormulario(?string $aviso = null): void
    {
        $mensagem = $aviso;
        require __DIR__ . '/view.php';
    }

    private function renderSucesso(array $dados, int $id): void
    {
        $titulo = "✅ Matrícula realizada!";
        $corpo = "<p><strong>ID:</strong> {$id}</p>"
               . "<p><strong>Nome:</strong> " . htmlspecialchars($dados['nome']) . "</p>"
               . "<p><strong>Idade:</strong> {$dados['idade']}</p>"
               . "<p><strong>Curso:</strong> " . htmlspecialchars($dados['curso']) . "</p>"
               . "<p><strong>Bolsa:</strong> " . htmlspecialchars($dados['bolsa']) . "</p>";
        $this->renderResultado($titulo, $corpo, 'sucesso');
    }

    private function renderErro(string $msg): void
    {
        $this->renderResultado("❌ Falha na matrícula", "<p>" . htmlspecialchars($msg) . "</p>", 'erro');
    }

    private function renderResultado(string $titulo, string $corpo, string $tipo): void
    {
        $cor = $tipo === 'sucesso' ? '#16a34a' : '#dc2626';
        echo "<!DOCTYPE html><html lang='pt-br'><head><meta charset='utf-8'>
              <title>{$titulo}</title>
              <style>
                body{font-family:system-ui;max-width:560px;margin:60px auto;padding:24px;}
                .box{border-left:6px solid {$cor};background:#f9fafb;padding:20px;border-radius:8px;}
                h1{color:{$cor};margin-top:0;}
                a{display:inline-block;margin-top:20px;color:#2563eb;}
              </style></head><body>
              <div class='box'><h1>{$titulo}</h1>{$corpo}</div>
              <a href='/'>← Voltar ao formulário</a>
              </body></html>";
    }
}
