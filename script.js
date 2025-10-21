// Dados simulados (poderia vir de um fetch JSON)
const livros = [
  { id: 1, titulo: "Dom Casmurro", autor: "Machado de Assis", ano: 1899, descricao: "Clássico da literatura brasileira." },
  { id: 2, titulo: "O Cortiço", autor: "Aluísio Azevedo", ano: 1890, descricao: "Romance naturalista brasileiro." },
  { id: 3, titulo: "Memórias Póstumas de Brás Cubas", autor: "Machado de Assis", ano: 1881, descricao: "Narrado por um defunto-autor." }
];

// Lista de livros (livros.html)
const lista = document.getElementById("livros");
if (lista) {
  livros.forEach(livro => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="detalhes.html?id=${livro.id}">${livro.titulo}</a>`;
    lista.appendChild(li);
  });
}

// Página de detalhes (detalhes.html)
if (window.location.pathname.includes("detalhes.html")) {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const livro = livros.find(l => l.id === id);

  if (livro) {
    document.getElementById("titulo-livro").textContent = livro.titulo;
    document.getElementById("autor-livro").textContent = livro.autor;
    document.getElementById("ano-livro").textContent = livro.ano;
    document.getElementById("descricao-livro").textContent = livro.descricao;
  }
}

// Validação e cadastro (cadastro.html)
const form = document.getElementById("form-cadastro");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const titulo = document.getElementById("titulo").value.trim();
    const autor = document.getElementById("autor").value.trim();
    const ano = document.getElementById("ano").value.trim();

    if (!titulo || !autor || !ano) {
      document.getElementById("mensagem").textContent = "Preencha todos os campos obrigatórios.";
      document.getElementById("mensagem").style.color = "red";
      return;
    }

    document.getElementById("mensagem").textContent = "Livro cadastrado com sucesso!";
    document.getElementById("mensagem").style.color = "green";
    form.reset();
  });
}
