(function () {
  const envelope = document.getElementById("envelope");
  const selo = document.getElementById("selo");
  const convite = document.getElementById("convite");
  const audio = document.getElementById("trilha");
  const botaoMusica = document.getElementById("musica");
  const dataFesta = new Date("2027-04-03T17:00:00");
  const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  audio.volume = 0.55;

  function ajustarSelo() {
    const texto = document.querySelector(".selo-letras");
    if (!texto || !texto.getBBox) return;
    texto.removeAttribute("transform");
    const caixa = texto.getBBox();
    if (!caixa.width || !caixa.height) return;
    const centroX = caixa.x + caixa.width / 2;
    const centroY = caixa.y + caixa.height / 2;
    const escala = Math.min(1, 54 / caixa.width, 40 / caixa.height);
    texto.setAttribute(
      "transform",
      "translate(60 60) scale(" + escala.toFixed(3) + ") translate(" + (-centroX).toFixed(2) + " " + (-centroY).toFixed(2) + ")"
    );
  }

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustarSelo);
  else ajustarSelo();

  function marcarMusica(tocando) {
    botaoMusica.classList.toggle("tocando", tocando);
    botaoMusica.setAttribute("aria-pressed", tocando ? "true" : "false");
    botaoMusica.setAttribute("aria-label", tocando ? "Pausar música" : "Tocar música");
  }

  function tocar() {
    const promessa = audio.play();
    if (promessa) {
      promessa.then(function () { marcarMusica(true); }).catch(function () { marcarMusica(false); });
    }
  }

  botaoMusica.addEventListener("click", function () {
    if (audio.paused) tocar();
    else {
      audio.pause();
      marcarMusica(false);
    }
  });

  function atualizarContagem() {
    const el = document.getElementById("contagem");
    const diff = dataFesta - new Date();
    if (diff <= 0) {
      el.textContent = "O grande dia chegou!";
      return;
    }
    const dias = Math.floor(diff / 864e5);
    const horas = Math.floor((diff % 864e5) / 36e5);
    const min = Math.floor((diff % 36e5) / 6e4);
    el.textContent = "Faltam " + dias + " dias, " + horas + "h e " + min + "min";
  }

  function mostrar() {
    convite.hidden = false;
    envelope.classList.add("sumido");
    envelope.setAttribute("aria-hidden", "true");
    window.setTimeout(function () { envelope.hidden = true; }, reduzido ? 0 : 900);
  }

  function abrir() {
    if (envelope.classList.contains("abrindo")) return;
    envelope.classList.add("abrindo");
    tocar();
    window.setTimeout(mostrar, reduzido ? 0 : 1750);
  }

  selo.addEventListener("pointerdown", function () {
    envelope.classList.add("tocando");
  });

  selo.addEventListener("click", abrir);

  atualizarContagem();
  window.setInterval(atualizarContagem, 60000);
})();
