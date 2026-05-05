<?php
// RelatoController.php
class RelatoController {
    private RelatoService $service;

    // Recebe a dependência
    public function __construct(RelatoService $service) {
        $this->service = $service;
    }

    public function store(array $requestData) {
        try {
            // Executa o serviço, zero if/else de regra de negócio aqui
            $this->service->processarNovoRelato($requestData['texto'], $requestData['humor']);
            
            // Redireciona com sucesso
            header("Location: /?sucesso=1");
            exit;
            
        } catch (BusinessRuleException $e) {
            // Se a regra falhar, renderiza a view de erro
            $erroMessage = $e->getMessage();
            require 'view.php'; // Arquivo HTML de erro
        } catch (Exception $e) {
            // Erro de banco ou servidor capturado silenciosamente
            $erroMessage = "Ocorreu um erro interno. Tente novamente mais tarde.";
            require 'view.php';
        }
    }
}
