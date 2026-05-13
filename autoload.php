<?php
/**
 * Autoload PSR-4 Autoral
 * Responsável por carregar as classes automaticamente com base no Namespace.
 * Exemplo: new App\\Models\\Relato() -> procura em app/model/Relato.php
 */

spl_autoload_register(function ($class) {
    // Prefixo do namespace do projeto
    $prefix = 'App\\';

    // Diretório base onde as classes estão localizadas (app/)
    $base_dir = __DIR__ . '/app/';

    // Verifica se a classe usa o prefixo definido
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        // Se não usar o prefixo, podemos tentar carregar classes legadas (opcional)
        // Por exemplo, o Middleware que você enviou não tem namespace.
        $legacy_file = $base_dir . 'middleware/' . $class . '.php';
        if (file_exists($legacy_file)) {
            require_once $legacy_file;
        }
        return;
    }

    // Pega o nome relativo da classe (ex: Models\\Relato)
    $relative_class = substr($class, $len);

    // Mapeamento de pastas para garantir que o Autoload encontre subpastas em minúsculo 
    // conforme o Passo 1 (controller/, model/, etc)
    // Mas as classes no seu código estão como 'App\\Models', 'App\\Repositories'
    
    // Converte Namespaces em caminhos de arquivo (Ex: Repositories\\RelatoRepository -> Repositories/RelatoRepository.php)
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

    // Se o arquivo existir, carrega-o
    if (file_exists($file)) {
        require_once $file;
    } else {
        // Fallback: Tenta converter o nome da subpasta para minúsculo (comum em PSR-4 manual)
        // Isso ajuda se a pasta for 'model/' mas o namespace for 'Models'
        $parts = explode('\\', $relative_class);
        if (count($parts) > 1) {
            $parts[0] = strtolower($parts[0]); // Transforma 'Models' em 'model'
            // Alguns pluralizam no namespace e singularizam na pasta
            if ($parts[0] === 'models') $parts[0] = 'model';
            if ($parts[0] === 'controllers') $parts[0] = 'controller';
            
            $alt_file = $base_dir . implode('/', $parts) . '.php';
            if (file_exists($alt_file)) {
                require_once $alt_file;
            }
        }
    }
});
?>
