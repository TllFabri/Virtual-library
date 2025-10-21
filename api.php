<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

$db_file = "biblioteca.db";

try {
    $db = new PDO("sqlite:" . $db_file);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Cria tabela se não existir
    $db->exec("CREATE TABLE IF NOT EXISTS livros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        autor TEXT NOT NULL,
        ano INTEGER NOT NULL,
        descricao TEXT
    )");

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["erro" => "Falha na conexão com o banco: " . $e->getMessage()]);
    exit;
}

$metodo = $_SERVER["REQUEST_METHOD"];

// GET - Lista ou busca por ID
if ($metodo === "GET") {
    if (isset($_GET["id"])) {
        $id = (int) $_GET["id"];
        $stmt = $db->prepare("SELECT * FROM livros WHERE id = :id");
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->execute();
        $livro = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($livro) echo json_encode($livro);
        else {
            http_response_code(404);
            echo json_encode(["erro" => "Livro não encontrado"]);
        }
    } else {
        $res = $db->query("SELECT * FROM livros ORDER BY id DESC");
        echo json_encode($res->fetchAll(PDO::FETCH_ASSOC));
    }
}

// POST - Cadastrar novo livro
elseif ($metodo === "POST") {
    $dados = json_decode(file_get_contents("php://input"), true);
    if (!$dados || empty($dados["titulo"]) || empty($dados["autor"]) || empty($dados["ano"])) {
        http_response_code(400);
        echo json_encode(["erro" => "Campos obrigatórios faltando"]);
        exit;
    }

    $stmt = $db->prepare("INSERT INTO livros (titulo, autor, ano, descricao) VALUES (:t, :a, :an, :d)");
    $stmt->bindValue(":t", $dados["titulo"]);
    $stmt->bindValue(":a", $dados["autor"]);
    $stmt->bindValue(":an", (int)$dados["ano"]);
    $stmt->bindValue(":d", $dados["descricao"] ?? "");
    $stmt->execute();

    $novo = [
        "id" => $db->lastInsertId(),
        "titulo" => $dados["titulo"],
        "autor" => $dados["autor"],
        "ano" => (int)$dados["ano"],
        "descricao" => $dados["descricao"] ?? ""
    ];

    echo json_encode(["mensagem" => "Livro cadastrado com sucesso", "livro" => $novo]);
}

else {
    http_response_code(405);
    echo json_encode(["erro" => "Método não permitido"]);
}
?>
