<?php
// Database.php
class Database {
    private static ?PDO $instance = null;

    private function __construct() {} // Impede instanciamento direto

    public static function getInstance(): PDO {
        if (self::$instance === null) {
            $config = parse_ini_file(__DIR__ . '/config.ini');
            
            $dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset=utf8mb4";
            self::$instance = new PDO($dsn, $config['user'], $config['pass']);
            
            // Lança exceções do PDO em caso de erro
            self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            self::$instance->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        }
        return self::$instance;
    }
}
