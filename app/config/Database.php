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
        if (self::$instance !== null) return self::$instance;

        $configFile = ROOT_PATH . 'config.ini';
        $dbPath = 'database.sqlite';
        if (file_exists($configFile)) {
            $cfg = parse_ini_file($configFile);
            if (!empty($cfg['database'])) $dbPath = $cfg['database'];
        }

        if (!str_starts_with($dbPath, '/')) {
            // Procura primeiro em database/, depois na raiz
            $candidatos = [ROOT_PATH . 'database/' . $dbPath, ROOT_PATH . $dbPath];
            $dbPath = null;
            foreach ($candidatos as $c) {
                if (file_exists($c)) { $dbPath = $c; break; }
            }
            if ($dbPath === null) {
                $dbPath = ROOT_PATH . 'database/database.sqlite';
                if (!is_dir(dirname($dbPath))) mkdir(dirname($dbPath), 0755, true);
            }
        }

        self::$instance = new PDO('sqlite:' . $dbPath);
        self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        self::$instance->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        self::$instance->exec("CREATE TABLE IF NOT EXISTS relatos (
            id     INTEGER PRIMARY KEY AUTOINCREMENT,
            humor  TEXT NOT NULL,
            relato TEXT NOT NULL,
            data   TEXT NOT NULL
        )");

        return self::$instance;
    }

    public static function reset(): void { self::$instance = null; }
}
