<?php
namespace App\Config;
use PDO;

class Database {
    private static ?PDO $instance = null;
    private function __construct() {}

    public static function getInstance(): PDO {
        if (self::$instance === null) {
            $cfg = parse_ini_file(__DIR__ . '/config.ini');
            $path = __DIR__ . '/' . $cfg['database'];
            self::$instance = new PDO('sqlite:' . $path);
            self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            self::$instance->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            self::$instance->exec("CREATE TABLE IF NOT EXISTS relatos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                humor TEXT NOT NULL,
                relato TEXT NOT NULL,
                data TEXT NOT NULL
            )");
        }
        return self::$instance;
    }
}
