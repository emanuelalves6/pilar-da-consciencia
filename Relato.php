<?php
// Relato.php
class Relato {
    public ?int $id;
    public string $texto;
    public string $humor;
    public string $data;

    public function __construct(string $texto, string $humor, ?int $id = null, ?string $data = null) {
        $this->texto = $texto;
        $this->humor = $humor;
        $this->id = $id;
        $this->data = $data ?? date('Y-m-d H:i:s');
    }
}
