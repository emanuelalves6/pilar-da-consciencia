<?php

spl_autoload_register(function (string $class): void {
    $prefix = 'App\\';
    if (strncmp($prefix, $class, strlen($prefix)) !== 0) {
        return;
    }

    $map = [
        'Config'       => 'config',
        'Controllers'  => 'controller',
        'Exceptions'   => 'exceptions',
        'Middleware'   => 'middleware',
        'Models'       => 'model',
        'Repositories' => 'repository',
        'Services'     => 'service',
    ];

    $relative = substr($class, strlen($prefix));      // ex: "Controllers\RelatoController"
    $parts    = explode('\\', $relative);
    $ns       = array_shift($parts);                  // ex: "Controllers"
    $folder   = $map[$ns] ?? strtolower($ns);

    $file = __DIR__ . '/app/' . $folder . '/' . implode('/', $parts) . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});
