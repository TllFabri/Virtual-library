const API_URL = "api.php";

// Lista de livros
async function carregarLivros() {
  try {
    const resposta = await fetch(API_URL);
    const livros = await resposta.json();

    const lista = document.getElementById("livros");
    if (lista) {
      lista.innerHTML = "";
      livros.forEach(livro => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="detalhes.html?id=${livro.id}">${livro.titulo}</a>`;
        lista.appendChild(li);
      });
    }

    // Página de detalhes
    if (window.location.pathname.includes("detalhes.html")) {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      if (id) {
        const resposta = await fetch(`${API_URL}?id=${id}`);
        const livro = await resposta.json();
        if (livro.erro) throw new Error(livro.erro);

        document.getElementById("titulo-livro").textContent = livro.titulo;
        document.getElementById("autor-livro").textContent = livro.autor;
        document.getElementById("ano-livro").textContent = livro.ano;
        document.getElementById("descricao-livro").textContent = livro.descricao;
      }
    }

  } catch (erro) {
    console.error("Erro ao carregar livros:", erro);
  }
}

// Envio de novo livro
const form = document.getElementById("form-cadastro");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const autor = document.getElementById("autor").value.trim();
    const ano = document.getElementById("ano").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const msg = document.getElementById("mensagem");

    if (!titulo || !autor || !ano) {
      msg.textContent = "Preencha todos os campos obrigatórios.";
      msg.style.color = "red";
      return;
    }

    const novoLivro = { titulo, autor, ano, descricao };

    try {
      const resposta = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoLivro)
      });
      const data = await resposta.json();
      msg.textContent = data.mensagem || "Erro ao cadastrar.";
      msg.style.color = "green";
      form.reset();
    } catch {
      msg.textContent = "Erro na conexão com o servidor.";
      msg.style.color = "red";
    }
  });
}

// Executa nas páginas certas
if (window.location.pathname.includes("livros.html") || window.location.pathname.includes("detalhes.html")) {
  carregarLivros();
}
