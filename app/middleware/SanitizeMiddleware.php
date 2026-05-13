<?php
namespace App\Middleware;

class SanitizeMiddleware {
    public static function handlePost(array $input): array {
        $clean = [];
        foreach ($input as $k => $v) {
            if (is_string($v)) {
                $v = filter_var($v, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            }
            $clean[$k] = $v;
        }
        return $clean;
    }
}
