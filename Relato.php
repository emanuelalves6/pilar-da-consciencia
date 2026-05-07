<?php
namespace App\Models;

class Relato {
    public ?int $id = null;
    public string $humor = '';
    public string $relato = '';
    public string $data = '';

    public function __set($k, $v) { $this->$k = $v; }
    public function __get($k) { return $this->$k ?? null; }
}
