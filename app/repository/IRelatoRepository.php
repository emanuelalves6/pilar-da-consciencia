<?php
namespace App\Repositories;

use App\Models\Relato;

interface IRelatoRepository {
    public function save(Relato $r): int;
    public function find(?int $id = null): array;
    public function delete(int $id): bool;
}
