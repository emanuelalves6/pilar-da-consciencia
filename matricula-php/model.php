<?php
/**
 * model.php
 * Camada Model - única responsável por se comunicar com a tabela `alunos`.
 */

class AlunoModel
{
    private string $nome;
    private int $idade;
    private string $curso;
    private string $dbFile;

    public function __construct(string $dbFile = __DIR__ . '/database.sqlite')
    {
        $this->dbFile = $dbFile;
    }

    // ---- Getters ----
    public function getNome(): string { return $this->nome; }
    public function getIdade(): int { return $this->idade; }
    public function getCurso(): string { return $this->curso; }

    // ---- Setters ----
    public function setNome(string $nome): void { $this->nome = $nome; }
    public function setIdade(int $idade): void { $this->idade = $idade; }
    public function setCurso(string $curso): void { $this->curso = $curso; }

    /**
     * Persiste o aluno no SQLite usando Prepared Statements.
     */
    public function save(): int
    {
        $pdo = new PDO('sqlite:' . $this->dbFile);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $pdo->prepare(
            "INSERT INTO alunos (nome, idade, curso) VALUES (:nome, :idade, :curso)"
        );

        $stmt->execute([
            ':nome'  => $this->nome,
            ':idade' => $this->idade,
            ':curso' => $this->curso,
        ]);

        return (int) $pdo->lastInsertId();
    }
}
