<?php
/**
 * migration.php
 * Responsável por preparar o banco de dados SQLite.
 * Execute uma única vez antes de iniciar a aplicação:
 *   php migration.php
 */

class Migration
{
    private string $dbFile;

    public function __construct(string $dbFile = __DIR__ . '/database.sqlite')
    {
        $this->dbFile = $dbFile;
    }

    public function run(): void
    {
        // Cria o arquivo SQLite (PDO cria automaticamente se não existir)
        $pdo = new PDO('sqlite:' . $this->dbFile);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "CREATE TABLE IF NOT EXISTS alunos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            idade INTEGER,
            curso TEXT
        )";

        $pdo->exec($sql);

        echo "✅ Migration executada com sucesso.\n";
        echo "   Arquivo: {$this->dbFile}\n";
        echo "   Tabela 'alunos' pronta para uso.\n";
    }
}

// Execução direta via CLI
if (PHP_SAPI === 'cli') {
    (new Migration())->run();
}
