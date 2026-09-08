const formulario = document.getElementById("formulario");
const campoTarefa = document.getElementById("tarefa");
const listaTarefas = document.getElementById("tarefas");
const contador = document.getElementById("contador");
const botaoLimpar = document.getElementById("limpar");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function exibirTarefas() {
    listaTarefas.innerHTML = "";

    if (!tarefas.length) {
        listaTarefas.innerHTML = '<li class="vazio">Nenhuma tarefa cadastrada.</li>';
        contador.textContent = "0 tarefas";
        return;
    }

    tarefas.forEach((tarefa, indice) => {
        const item = document.createElement("li");
        const texto = document.createElement("span");
        const excluir = document.createElement("button");

        texto.textContent = tarefa;
        excluir.textContent = "Excluir";
        excluir.className = "excluir";
        excluir.onclick = () => excluirTarefa(indice);

        item.append(texto, excluir);
        listaTarefas.appendChild(item);
    });

    contador.textContent = `${tarefas.length} ${tarefas.length === 1 ? "tarefa" : "tarefas"}`;
}

function adicionarTarefa() {
    const tarefa = campoTarefa.value.trim();

    if (!tarefa) return;

    tarefas.push(tarefa);
    salvarTarefas();
    exibirTarefas();
    campoTarefa.value = "";
    campoTarefa.focus();
}

function excluirTarefa(indice) {
    tarefas.splice(indice, 1);
    salvarTarefas();
    exibirTarefas();
}

function limparTarefas() {
    tarefas = [];
    localStorage.removeItem("tarefas");
    exibirTarefas();
}

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    adicionarTarefa();
});

botaoLimpar.addEventListener("click", limparTarefas);

exibirTarefas();
