<?php
/**
 * middleware.php
 * Camada de segurança/validação executada ANTES do Controller.
 */

class Middleware
{
    /**
     * Valida os dados do POST. Em caso de erro, encerra a execução
     * exibindo a view com a mensagem de aviso.
     */
    public static function validarMatricula(array $dados): array
    {
        $nome  = trim($dados['nome']  ?? '');
        $idade = trim($dados['idade'] ?? '');
        $curso = trim($dados['curso'] ?? '');

        $erro = null;

        if ($nome === '' || $idade === '' || $curso === '') {
            $erro = '⚠️ Todos os campos são obrigatórios.';
        } elseif (!ctype_digit($idade)) {
            $erro = '⚠️ A idade deve ser um número inteiro válido.';
        }

        if ($erro !== null) {
            $mensagem = $erro;
            require __DIR__ . '/view.php';
            exit;
        }

        return [
            'nome'  => $nome,
            'idade' => (int) $idade,
            'curso' => $curso,
        ];
    }
}
