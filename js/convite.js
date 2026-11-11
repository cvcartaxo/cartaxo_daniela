(function () {
  const envelope = document.getElementById("envelope");
  const selo = document.getElementById("selo");
  const convite = document.getElementById("convite");
  const audio = document.getElementById("trilha");
  const botaoMusica = document.getElementById("musica");
  const dataFesta = new Date("2027-04-03T17:00:00");
  const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  audio.volume = 0.55;

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

  let raspasProntas = false;

  function prepararRaspas() {
    if (raspasProntas) return;
    raspasProntas = true;
    const cartas = Array.prototype.slice.call(document.querySelectorAll(".raspa"));

    cartas.forEach(function (carta) {
      const canvas = carta.querySelector("canvas");
      if (!canvas || reduzido) {
        carta.classList.add("revelada");
        return;
      }
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      let arrastando = false;
      let revelada = false;
      let passos = 0;

      function desenhar() {
        const rect = carta.querySelector(".valor").getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.max(1, Math.round(rect.width * dpr));
        canvas.height = Math.max(1, Math.round(rect.height * dpr));
        const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        g.addColorStop(0, "#f8e8c0");
        g.addColorStop(0.42, "#e6c56e");
        g.addColorStop(0.7, "#f4de9e");
        g.addColorStop(1, "#c49645");
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255,255,255,.38)";
        ctx.beginPath();
        ctx.ellipse(canvas.width * 0.32, canvas.height * 0.28, canvas.width * 0.26, canvas.height * 0.14, -0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      function ponto(evento) {
        const rect = canvas.getBoundingClientRect();
        return [
          (evento.clientX - rect.left) * (canvas.width / rect.width),
          (evento.clientY - rect.top) * (canvas.height / rect.height)
        ];
      }

      function raspar(evento) {
        if (revelada) return;
        const p = ponto(evento);
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(p[0], p[1], canvas.width * 0.18, 0, Math.PI * 2);
        ctx.fill();
      }

      function progresso() {
        if (revelada) return;
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let apagados = 0;
        let total = 0;
        for (let i = 3; i < pixels.length; i += 64) {
          total += 1;
          if (pixels[i] < 24) apagados += 1;
        }
        if (total && apagados / total > 0.4) {
          revelada = true;
          carta.classList.add("revelada");
          if (cartas.every(function (item) { return item.classList.contains("revelada"); })) {
            atualizarContagem();
            document.getElementById("contagem").hidden = false;
          }
        }
      }

      canvas.addEventListener("pointerdown", function (evento) {
        arrastando = true;
        try { canvas.setPointerCapture(evento.pointerId); } catch (erro) { /* o navegador recusa o gesto */ }
        raspar(evento);
      });
      canvas.addEventListener("pointermove", function (evento) {
        if (!arrastando) return;
        raspar(evento);
        passos += 1;
        if (passos % 5 === 0) progresso();
      });
      canvas.addEventListener("pointerup", function () {
        arrastando = false;
        progresso();
      });
      canvas.addEventListener("pointercancel", function () { arrastando = false; });

      desenhar();
    });

    if (reduzido) {
      atualizarContagem();
      document.getElementById("contagem").hidden = false;
    }
  }

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
    prepararRaspas();
    window.setTimeout(function () { envelope.hidden = true; }, reduzido ? 0 : 700);
  }

  function abrir() {
    if (envelope.classList.contains("abrindo")) return;
    envelope.classList.add("abrindo");
    tocar();
    window.setTimeout(mostrar, reduzido ? 0 : 1250);
  }

  selo.addEventListener("click", abrir);

  window.setInterval(atualizarContagem, 60000);
})();
