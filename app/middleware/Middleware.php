<?php
// --- ALTERAÇÃO: Adicionado o namespace para o autoload funcionar ---
namespace App\Middleware;

class Middleware {
    public static function sanitizePost(): array {
        $cleanData = [];
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            foreach ($_POST as $key => $value) {
                // Aplica filter_input para barrar tags HTML maliciosas (XSS)
                $cleanData[$key] = filter_input(INPUT_POST, $key, FILTER_SANITIZE_SPECIAL_CHARS);
            }
        }
        return $cleanData;
    }
}
