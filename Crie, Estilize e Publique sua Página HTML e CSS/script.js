"use strict";

// Dados dos lotes. A abertura é 80% da venda de referência, arredondada ao milhar.
const carros = [
  { id: "skyline", nome: "Skyline GT-R R34", referencia: 145500 },
  { id: "supra", nome: "Supra RZ A80", referencia: 80640 },
  { id: "rx7", nome: "RX-7 FD3S", referencia: 39505 }
];
const incremento = 1000;
const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "USD" });
let usuario = "";

const botaoTema = document.querySelector("#alternar-tema");
const formularioCadastro = document.querySelector("#formulario-cadastro");
const campoNome = document.querySelector("#nome-usuario");
const mensagemCadastro = document.querySelector("#mensagem-cadastro");
const modeloLeilao = document.querySelector("#modelo-leilao");

// Um evento de clique alterna a classe; o CSS define as cores de cada modo.
botaoTema.addEventListener("click", () => {
  const modoClaro = document.body.classList.toggle("modo-claro");
  botaoTema.textContent = modoClaro ? "Ativar modo escuro" : "Ativar modo claro";
  botaoTema.setAttribute("aria-pressed", String(modoClaro));
});

function mostrarMensagem(elemento, texto, erro = false) {
  // textContent exibe os dados como texto, sem interpretar HTML digitado.
  elemento.textContent = texto;
  elemento.classList.toggle("erro", erro);
}

// O submit funciona tanto com o botão quanto com a tecla Enter.
formularioCadastro.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const nome = campoNome.value.trim().replace(/\s+/g, " ");

  if (!nome || nome.length > 50) {
    mostrarMensagem(mensagemCadastro, "Digite um nome com até 50 caracteres.", true);
    campoNome.setAttribute("aria-invalid", "true");
    campoNome.focus();
    return;
  }

  usuario = nome;
  campoNome.value = nome;
  campoNome.removeAttribute("aria-invalid");
  mostrarMensagem(mensagemCadastro, `Boas-vindas, ${usuario}! Seu cadastro está pronto. Escolha um carro e dê seu lance.`);
  document.querySelectorAll(".formulario-lance").forEach((formulario) => {
    formulario.querySelector("input").disabled = false;
    formulario.querySelector("button").disabled = false;
    mostrarMensagem(formulario.querySelector(".mensagem-lance"), `Participante: ${usuario}.`);
  });
});

// Aceita 116000, 116000,50 ou 116.000,50; rejeita texto e formatos ambíguos.
function converterLance(texto) {
  const valor = texto.trim();
  const formatoBrasileiro = /^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/;
  if (!formatoBrasileiro.test(valor)) return NaN;
  return Number(valor.replace(/\./g, "").replace(",", "."));
}

carros.forEach((carro) => {
  const card = document.querySelector(`[data-carro="${carro.id}"]`);
  const painel = modeloLeilao.content.firstElementChild.cloneNode(true);
  const formulario = painel.querySelector("form");
  const campoLance = formulario.querySelector("input");
  const mensagem = painel.querySelector(".mensagem-lance");
  const minimoTexto = painel.querySelector(".minimo-lance");
  const abertura = Math.floor(carro.referencia * 0.8 / 1000) * 1000;
  let maiorLance = 0;
  let totalLances = 0;

  painel.setAttribute("aria-label", `Leilão do ${carro.nome}`);
  campoLance.setAttribute("aria-label", `Seu lance para ${carro.nome}, em dólares americanos`);
  mensagem.id = `mensagem-${carro.id}`;
  minimoTexto.id = `minimo-${carro.id}`;
  campoLance.setAttribute("aria-describedby", `${minimoTexto.id} ${mensagem.id}`);

  function obterMinimo() {
    return totalLances === 0 ? abertura : maiorLance + incremento;
  }

  function atualizarMinimo() {
    minimoTexto.textContent = `Mínimo: ${moeda.format(obterMinimo())}`;
    campoLance.placeholder = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2 }).format(obterMinimo());
  }

  painel.querySelector(".valor-lance").textContent = moeda.format(abertura);
  atualizarMinimo();
  card.querySelector(".titulo-card").after(painel);

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (!usuario) {
      mostrarMensagem(mensagem, "Cadastre seu nome antes de dar um lance.", true);
      campoNome.focus();
      return;
    }

    const valor = converterLance(campoLance.value);
    // Limite técnico explícito para evitar perda de precisão em números enormes.
    if (!Number.isFinite(valor) || valor <= 0 || valor > 999999999) {
      mostrarMensagem(mensagem, "Informe um valor de até US$ 999.999.999,00. Use o formato 116.000,00.", true);
      campoLance.setAttribute("aria-invalid", "true");
      campoLance.focus();
      return;
    }

    if (valor < obterMinimo()) {
      mostrarMensagem(mensagem, `O lance deve ser de pelo menos ${moeda.format(obterMinimo())}.`, true);
      campoLance.setAttribute("aria-invalid", "true");
      campoLance.focus();
      return;
    }

    maiorLance = valor;
    totalLances += 1;
    painel.querySelector(".rotulo-preco").textContent = "Maior lance";
    painel.querySelector(".valor-lance").textContent = moeda.format(maiorLance);
    painel.querySelector(".lider-lance").textContent = `Liderando: ${usuario} · ${totalLances} ${totalLances === 1 ? "lance" : "lances"}`;
    mostrarMensagem(mensagem, `${usuario}, seu lance de ${moeda.format(valor)} para o ${carro.nome} foi registrado!`);
    campoLance.removeAttribute("aria-invalid");
    formulario.reset();
    atualizarMinimo();
  });
});
