// --- Funções de Dados ---

// Função agora focada apenas na obtenção dos dados, com tratamento de erro HTTP.
async function fetchLivrosData() {
  try {
    const resposta = await fetch("livros.json");
    // Lança um erro se a resposta HTTP não for bem-sucedida
    if (!resposta.ok) {
        throw new Error(`Erro HTTP! status: ${resposta.status}`);
    }
    return await resposta.json();
  } catch (erro) {
    console.error("Erro ao carregar dados dos livros:", erro);
    // Retorna um array vazio em caso de falha para evitar quebras
    return [];
  }
}

// --- Funções de Renderização (Separação de Preocupações) ---

// Função dedicada para renderizar a lista de livros (livros.html)
function renderLivrosList(livros) {
  const lista = document.getElementById("livros");
  if (!lista || livros.length === 0) return;

  lista.innerHTML = ''; // Limpa antes de adicionar

  livros.forEach(livro => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="detalhes.html?id=${livro.id}">${livro.titulo}</a>`;
    // Melhoria de Acessibilidade: Adicionar um aria-label para leitores de tela
    li.setAttribute('aria-label', `Ver detalhes de ${livro.titulo}`);
    lista.appendChild(li);
  });
}

// Função dedicada para renderizar os detalhes do livro (detalhes.html)
function renderLivroDetails(livros) {
  const detalhesElement = document.getElementById("detalhes-livro");
  if (!detalhesElement) return;

  const params = new URLSearchParams(window.location.search);
  const idParam = params.get("id");
  const id = parseInt(idParam);

  // Validação mais robusta do ID
  if (isNaN(id)) {
    detalhesElement.innerHTML = "<h2>ID de livro inválido.</h2>";
    return;
  }

  const livro = livros.find(l => l.id === id);

  if (livro) {
    document.getElementById("titulo-livro").textContent = livro.titulo;
    document.getElementById("autor-livro").textContent = livro.autor;
    document.getElementById("ano-livro").textContent = livro.ano;
    document.getElementById("descricao-livro").textContent = livro.descricao;
  } else {
    // Feedback claro quando o livro não é encontrado
    detalhesElement.innerHTML = "<h2>Livro não encontrado.</h2>";
  }
}

// --- Inicialização ---

// Função principal que orquestra o carregamento e a renderização
async function initializeLivrosPage() {
    const livros = await fetchLivrosData();

    if (window.location.pathname.includes("livros.html")) {
        renderLivrosList(livros);
    } else if (window.location.pathname.includes("detalhes.html")) {
        renderLivroDetails(livros);
    }
}

// Executar a inicialização ao abrir as páginas correspondentes
if (window.location.pathname.includes("livros.html") || window.location.pathname.includes("detalhes.html")) {
  initializeLivrosPage();
}

// --- Validação e Cadastro (cadastro.html) ---

const form = document.getElementById("form-cadastro");
const mensagemElement = document.getElementById("mensagem");

if (form && mensagemElement) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const titulo = document.getElementById("titulo").value.trim();
    const autor = document.getElementById("autor").value.trim();
    const ano = document.getElementById("ano").value.trim();
    const descricao = document.getElementById("descricao").value.trim();

    // Validação de campos obrigatórios
    if (!titulo || !autor || !ano) {
      mensagemElement.textContent = "Preencha todos os campos obrigatórios: Título, Autor e Ano.";
      // Uso de classe CSS para estilização do erro (veja as melhorias em style.css)
      mensagemElement.className = "mensagem-erro"; 
      return;
    }

    // Lógica simulada de "cadastro"
    mensagemElement.textContent = `Livro "${titulo}" de ${autor} cadastrado com sucesso (simulação).`;
    mensagemElement.className = "mensagem-sucesso";
    form.reset(); // Limpa o formulário
  });
}