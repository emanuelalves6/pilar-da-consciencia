<!DOCTYPE html>
<html lang="pt-BR">
<head><title>Erro no Relato</title></head>
<body>
    <div style="color: red; padding: 20px; border: 1px solid red;">
        <strong>Ops, algo deu errado:</strong> <?php echo htmlspecialchars($erroMessage ?? 'Erro desconhecido'); ?>
    </div>
    <a href="/">Voltar</a>
</body>
</html>
