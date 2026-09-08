const players = [
  { id: 1, numero: 23, nome: "Rafael", posicao: "Goleiro", nacionalidade: "Brasil", papel: "3º Capitão" },
  { id: 2, numero: 31, nome: "Carlos Coronel", posicao: "Goleiro", nacionalidade: "Paraguai", papel: "" },
  { id: 3, numero: 52, nome: "Felipe Preis", posicao: "Goleiro", nacionalidade: "Brasil", papel: "" },

  { id: 4, numero: 2, nome: "Rafael Tolói", posicao: "Defensor", nacionalidade: "Itália", papel: "" },
  { id: 5, numero: 5, nome: "Robert Arboleda", posicao: "Defensor", nacionalidade: "Equador", papel: "" },
  { id: 6, numero: 12, nome: "Iago Borduchi", posicao: "Defensor", nacionalidade: "Brasil", papel: "", origem: "Emprestado pelo Bahia" },
  { id: 7, numero: 13, nome: "Enzo Díaz", posicao: "Defensor", nacionalidade: "Argentina", papel: "" },
  { id: 8, numero: 18, nome: "Wendell", posicao: "Defensor", nacionalidade: "Brasil", papel: "" },
  { id: 9, numero: 19, nome: "Lucas Ramon", posicao: "Defensor", nacionalidade: "Brasil", papel: "" },
  { id: 10, numero: 20, nome: "Aurélio Buta", posicao: "Defensor", nacionalidade: "Portugal", papel: "" },
  { id: 11, numero: 22, nome: "Domingos Duarte", posicao: "Defensor", nacionalidade: "Portugal", papel: "" },
  { id: 12, numero: 35, nome: "Sabino", posicao: "Defensor", nacionalidade: "Brasil", papel: "" },
  { id: 13, numero: 42, nome: "Maik", posicao: "Defensor", nacionalidade: "Brasil", papel: "" },
  { id: 14, numero: 54, nome: "Luis Osorio", posicao: "Defensor", nacionalidade: "Brasil", papel: "" },
  { id: 15, numero: 56, nome: "Nicolas Bosshardt", posicao: "Defensor", nacionalidade: "Brasil", papel: "" },

  { id: 16, numero: 8, nome: "Marcos Antônio", posicao: "Meio-campo", nacionalidade: "Brasil", papel: "" },
  { id: 17, numero: 16, nome: "Damián Bobadilla", posicao: "Meio-campo", nacionalidade: "Paraguai", papel: "" },
  { id: 18, numero: 28, nome: "Newton", posicao: "Meio-campo", nacionalidade: "Brasil", papel: "" },
  { id: 19, numero: 29, nome: "Pablo Maia", posicao: "Meio-campo", nacionalidade: "Brasil", papel: "" },
  { id: 20, numero: 38, nome: "Hugo Leonardo", posicao: "Meio-campo", nacionalidade: "Brasil", papel: "" },
  { id: 21, numero: 80, nome: "Cauly", posicao: "Meio-campo", nacionalidade: "Brasil", papel: "", origem: "Emprestado pelo Bahia" },
  { id: 22, numero: 94, nome: "Danielzinho", posicao: "Meio-campo", nacionalidade: "Brasil", papel: "" },

  { id: 23, numero: 7, nome: "Lucas Moura", posicao: "Atacante", nacionalidade: "Brasil", papel: "Vice-capitão" },
  { id: 24, numero: 9, nome: "Jonathan Calleri", posicao: "Atacante", nacionalidade: "Argentina", papel: "Capitão" },
  { id: 25, numero: 10, nome: "Luciano", posicao: "Atacante", nacionalidade: "Brasil", papel: "" },
  { id: 26, numero: 11, nome: "Ferreira", posicao: "Atacante", nacionalidade: "Brasil", papel: "" },
  { id: 27, numero: 17, nome: "André Silva", posicao: "Atacante", nacionalidade: "Brasil", papel: "" },
  { id: 28, numero: 27, nome: "Victor Sá", posicao: "Atacante", nacionalidade: "Brasil", papel: "" },
  { id: 29, numero: 37, nome: "Arthur", posicao: "Atacante", nacionalidade: "Brasil", papel: "", origem: "Emprestado pelo Botafogo" },
  { id: 30, numero: 43, nome: "Gustavo Santana", posicao: "Atacante", nacionalidade: "Brasil", papel: "" },
  { id: 31, numero: 45, nome: "Lucca Marques", posicao: "Atacante", nacionalidade: "Brasil", papel: "" },
  { id: 32, numero: 49, nome: "Ryan Francisco", posicao: "Atacante", nacionalidade: "Brasil", papel: "" }
];

const VAGAS_ELENCO = 40;
const POR_PAGINA = 8;
let filtroAtual = "Todos";
let paginaAtual = 1;

const cardsContainer = document.getElementById("cardsContainer");
const spinner = document.getElementById("loadingSpinner");
const paginationEl = document.getElementById("pagination");
const noResultsAlert = document.getElementById("noResultsAlert");
const progressBar = document.getElementById("progressBar");
const progressLabel = document.getElementById("progressLabel");
const filterLabel = document.getElementById("filterLabel");
const addPlayerForm = document.getElementById("addPlayerForm");
const overallRange = document.getElementById("overallRange");
const overallValue = document.getElementById("overallValue");
const toastEl = document.getElementById("appToast");
const toastBody = document.getElementById("appToastBody");
const toast = new bootstrap.Toast(toastEl);
const addPlayerModal = new bootstrap.Modal(document.getElementById("addPlayerModal"));

function jogadoresFiltrados() {
  return filtroAtual === "Todos" ? players : players.filter(p => p.posicao === filtroAtual);
}

function formatarData(data) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function renderCards() {
  const filtrados = jogadoresFiltrados();
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;
  const inicio = (paginaAtual - 1) * POR_PAGINA;
  const pagina = filtrados.slice(inicio, inicio + POR_PAGINA);

  cardsContainer.innerHTML = "";
  noResultsAlert.classList.toggle("d-none", filtrados.length > 0);

  pagina.forEach(p => {
    const col = document.createElement("div");
    col.className = "col";
    const nascimentoLinha = p.nascimento
      ? `Nascimento: ${formatarData(p.nascimento)}`
      : "Nascimento: não divulgado";
    const origemLinha = p.origem ? `<p class="small mb-1">${p.origem}</p>` : "";
    const overallTexto = (p.overall !== undefined && p.overall !== null) ? p.overall : "não divulgado";

    col.innerHTML = `
      <div class="card player-card h-100 shadow-sm">
        <div class="card-body">
          <div class="d-flex align-items-center gap-3 mb-3">
            <div class="jersey-circle">${p.numero}</div>
            <div>
              <h3 class="h6 mb-1">${p.nome}</h3>
              <span class="badge badge-sp">${p.posicao}</span>
              ${p.papel ? `<span class="badge bg-dark">${p.papel}</span>` : ""}
            </div>
          </div>
          <p class="mb-1 small text-secondary">Nacionalidade: ${p.nacionalidade}</p>
          <p class="mb-3 small text-secondary">Nível: ${overallTexto}</p>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-dark btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#details-${p.id}">Detalhes</button>
            <button class="btn btn-outline-danger btn-sm" type="button" data-remove="${p.id}">Remover</button>
          </div>
          <div class="collapse mt-3" id="details-${p.id}">
            <hr>
            ${origemLinha}
            <p class="small mb-1">${nascimentoLinha}</p>
            <p class="small mb-0">Jogador do elenco tricolor, atua como ${p.posicao.toLowerCase()} e veste a camisa ${p.numero}.</p>
          </div>
        </div>
      </div>
    `;
    cardsContainer.appendChild(col);
  });

  renderPagination(totalPaginas);
  updateProgress();
}

function renderPagination(totalPaginas) {
  paginationEl.innerHTML = "";
  if (totalPaginas <= 1) return;
  for (let i = 1; i <= totalPaginas; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === paginaAtual ? "active" : ""}`;
    li.innerHTML = `<button class="page-link" type="button">${i}</button>`;
    li.querySelector("button").addEventListener("click", () => {
      paginaAtual = i;
      renderCards();
    });
    paginationEl.appendChild(li);
  }
}

function updateProgress() {
  const percentual = Math.min(100, Math.round((players.length / VAGAS_ELENCO) * 100));
  progressBar.style.width = `${percentual}%`;
  progressBar.setAttribute("aria-valuenow", percentual);
  progressLabel.textContent = `${players.length}/${VAGAS_ELENCO} vagas preenchidas`;
}

function showToast(mensagem) {
  toastBody.textContent = mensagem;
  toast.show();
}

cardsContainer.addEventListener("click", e => {
  const btn = e.target.closest("[data-remove]");
  if (!btn) return;
  const id = Number(btn.dataset.remove);
  const index = players.findIndex(p => p.id === id);
  if (index === -1) return;
  const nome = players[index].nome;
  players.splice(index, 1);
  renderCards();
  showToast(`${nome} removido do elenco.`);
});

document.querySelectorAll("[data-filtro]").forEach(item => {
  item.addEventListener("click", () => {
    filtroAtual = item.dataset.filtro;
    filterLabel.textContent = filtroAtual;
    paginaAtual = 1;
    renderCards();
  });
});

overallRange.addEventListener("input", () => {
  overallValue.textContent = overallRange.value;
});

addPlayerForm.addEventListener("submit", e => {
  e.preventDefault();
  e.stopPropagation();
  if (!addPlayerForm.checkValidity()) {
    addPlayerForm.classList.add("was-validated");
    return;
  }

  const capitao = document.getElementById("checkCapitao").checked;
  const titular = document.getElementById("checkTitular").checked;
  const papel = capitao ? "Capitão" : (titular ? "Titular" : "");

  const novoJogador = {
    id: Date.now(),
    nome: document.getElementById("inputNome").value.trim(),
    numero: Number(document.getElementById("inputNumero").value),
    posicao: document.getElementById("inputPosicao").value,
    nacionalidade: "Brasil",
    nascimento: document.getElementById("inputNascimento").value,
    overall: Number(overallRange.value),
    papel: papel
  };

  players.push(novoJogador);
  addPlayerForm.reset();
  addPlayerForm.classList.remove("was-validated");
  overallValue.textContent = overallRange.value;
  addPlayerModal.hide();
  paginaAtual = Math.ceil(players.length / POR_PAGINA);
  renderCards();
  showToast(`${novoJogador.nome} adicionado ao elenco.`);
});

document.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => new bootstrap.Popover(el));

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    spinner.classList.add("d-none");
    cardsContainer.classList.remove("d-none");
    renderCards();
  }, 900);
});
