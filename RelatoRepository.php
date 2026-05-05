<?php
// RelatoRepository.php
require_once 'IRelatoRepository.php';
require_once 'Relato.php';

class RelatoRepository implements IRelatoRepository {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function save(Relato $relato): bool {
        $stmt = $this->db->prepare("INSERT INTO relatos (texto, humor, data) VALUES (:texto, :humor, :data)");
        return $stmt->execute([
            ':texto' => $relato->texto,
            ':humor' => $relato->humor,
            ':data' => $relato->data
        ]);
    }

    public function find(int $id): ?Relato {
        // Implementação simplificada do find
        $stmt = $this->db->prepare("SELECT * FROM relatos WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $data = $stmt->fetch();
        if (!$data) return null;
        return new Relato($data['texto'], $data['humor'], $data['id'], $data['data']);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM relatos WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }
}
