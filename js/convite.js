(function () {
  const capa = document.getElementById("capa");
  const convite = document.getElementById("convite");
  const data = new Date("2027-04-03T17:00:00");

  function abrir() {
    if (capa.classList.contains("aberta")) return;
    capa.classList.add("aberta");
    convite.classList.add("visivel");
    convite.setAttribute("aria-hidden", "false");
    capa.setAttribute("aria-hidden", "true");
    window.setTimeout(function () {
      capa.classList.add("oculta");
    }, 1500);
  }

  capa.addEventListener("click", abrir);
  capa.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      abrir();
    }
  });

  function atualizarContagem() {
    const el = document.getElementById("contagem");
    const diff = data - new Date();
    if (diff <= 0) {
      el.textContent = "O grande dia chegou!";
      return;
    }
    const dias = Math.floor(diff / 864e5);
    const horas = Math.floor((diff % 864e5) / 36e5);
    const min = Math.floor((diff % 36e5) / 6e4);
    el.textContent = "Faltam " + dias + " dias, " + horas + "h e " + min + "min";
  }

  atualizarContagem();
  window.setInterval(atualizarContagem, 60000);

  function ligarDialogo(botaoId, dialogoId) {
    const botao = document.getElementById(botaoId);
    const dialogo = document.getElementById(dialogoId);
    botao.addEventListener("click", function () {
      dialogo.showModal();
    });
    dialogo.addEventListener("click", function (evento) {
      if (evento.target === dialogo || evento.target.closest("[data-fechar]")) {
        dialogo.close();
      }
    });
  }

  ligarDialogo("btn-cerimonia", "dialogo-cerimonia");
  ligarDialogo("btn-recepcao", "dialogo-recepcao");

  const letras = document.querySelector(".selo-letras");
  if (document.fonts && document.fonts.load) {
    document.fonts.load("3.4rem \"Pinyon Script\"").then(function () {
      letras.style.transform = "translate(-50%, -58%)";
    }).catch(function () {});
  }
})();
