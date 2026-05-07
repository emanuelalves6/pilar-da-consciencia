<?php
namespace App\Repositories;
use App\Models\Relato;
use PDO;

class RelatoRepository implements IRelatoRepository {
    public function __construct(private PDO $pdo) {}

    public function save(Relato $r): int {
        $stmt = $this->pdo->prepare(
            "INSERT INTO relatos (humor, relato, data) VALUES (?, ?, ?)"
        );
        $stmt->execute([$r->humor, $r->relato, $r->data]);
        return (int)$this->pdo->lastInsertId();
    }

    public function find(?int $id = null): array {
        if ($id !== null) {
            $stmt = $this->pdo->prepare("SELECT * FROM relatos WHERE id = ?");
            $stmt->execute([$id]);
            return $stmt->fetch() ?: [];
        }
        return $this->pdo->query("SELECT * FROM relatos ORDER BY id DESC")->fetchAll();
    }

    public function delete(int $id): bool {
        $stmt = $this->pdo->prepare("DELETE FROM relatos WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
