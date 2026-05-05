<?php
// IRelatoRepository.php
interface IRelatoRepository {
    public function save(Relato $relato): bool;
    public function find(int $id): ?Relato;
    public function delete(int $id): bool;
}
