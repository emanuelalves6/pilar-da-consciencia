<?php
namespace App\Config;

use PDO;
use RuntimeException;

class Database
{
    private static ?PDO $instance = null;

    private function __construct() {}

    public static function getInstance(): PDO
    {
        if (self::$instance !== null) {
            return self::$instance;
        }

        $configFile = ROOT_PATH . 'config.ini';

        if (!file_exists($configFile)) {
            throw new RuntimeException(
                "Arquivo config.ini não encontrado em: {$configFile}. " .
                "Crie-o a partir do config.ini.example e adicione ao .gitignore."
            );
        }

        $cfg = parse_ini_file($configFile);

        if ($cfg === false || empty($cfg['database'])) {
            throw new RuntimeException("config.ini inválido ou sem a chave 'database'.");
        }

        $dbPath = $cfg['database'];

        // Se não for caminho absoluto, procura dentro de database/
        if (!str_starts_with($dbPath, '/')) {
            $dbPath = ROOT_PATH . 'database/' . $dbPath;
        }

        // Garante que a pasta database/ existe
        $dbDir = dirname($dbPath);
        if (!is_dir($dbDir)) {
            mkdir($dbDir, 0755, true);
        }

        self::$instance = new PDO('sqlite:' . $dbPath);
        self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        self::$instance->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        // Cria a tabela se não existir
        self::$instance->exec("CREATE TABLE IF NOT EXISTS relatos (
            id      INTEGER PRIMARY KEY AUTOINCREMENT,
            humor   TEXT NOT NULL,
            relato  TEXT NOT NULL,
            data    TEXT NOT NULL
        )");

        return self::$instance;
    }

    public static function reset(): void
    {
        self::$instance = null;
    }
}
