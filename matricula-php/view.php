<?php
/**
 * view.php
 * Formulário de matrícula. Recebe opcionalmente $mensagem do Controller/Middleware.
 */
$mensagem = $mensagem ?? null;
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Matrícula de Aluno</title>
    <style>
        body { font-family: system-ui, sans-serif; max-width: 480px; margin: 60px auto; padding: 24px; }
        h1 { color: #1e293b; }
        label { display:block; margin-top: 14px; font-weight: 600; color:#334155; }
        input, select { width:100%; padding:10px; margin-top:6px; border:1px solid #cbd5e1; border-radius:6px; font-size:15px; }
        button { margin-top:20px; width:100%; padding:12px; background:#2563eb; color:#fff; border:0; border-radius:6px; font-size:16px; cursor:pointer; }
        button:hover { background:#1d4ed8; }
        .aviso { background:#fef3c7; border-left:6px solid #f59e0b; padding:12px; border-radius:6px; margin-bottom:16px; color:#78350f; }
    </style>
</head>
<body>
    <h1>📋 Matrícula de Aluno</h1>

    <?php if ($mensagem): ?>
        <div class="aviso"><?= htmlspecialchars($mensagem) ?></div>
    <?php endif; ?>

    <form method="POST" action="/">
        <label for="nome">Nome</label>
        <input type="text" id="nome" name="nome">

        <label for="idade">Idade</label>
        <input type="text" id="idade" name="idade">

        <label for="curso">Curso</label>
        <select id="curso" name="curso">
            <option value="">-- Selecione --</option>
            <option value="Informática">Informática (mín. 14)</option>
            <option value="Administração">Administração (mín. 16)</option>
            <option value="Direito">Direito (mín. 17)</option>
            <option value="Engenharia">Engenharia (mín. 17)</option>
            <option value="Medicina">Medicina (mín. 18)</option>
        </select>

        <button type="submit">Matricular</button>
    </form>
</body>
</html>
