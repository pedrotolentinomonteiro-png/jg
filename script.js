// Configurações do Jogo
const TAMANHO_DO_CAMPO = 12;
const PONTUACAO_PARA_VENCER = 50;

let posicao, agua, vidas, pontos, eventoAtual;
let bloqueiaCliques = false;

const descricoesEventos = {
    "praga": { titulo: "🐛 Uma praga apareceu na plantação!", dica: "Clique em PULAR para proteger a lavoura." },
    "seca": { titulo: "☀️ O solo está muito seco, precisa de água!", dica: "Clique em IRRIGAR (Gasta 10 de água)." },
    "terra_livre": { titulo: "🟫 Um pedaço de terra livre para plantio.", dica: "Clique em PLANTAR uma nova muda." },
    "plantacao_pronta": { titulo: "🌻 Uma plantação está pronta para colheita!", dica: "Clique em COLHER e ganhe pontos." },
    "nada": { titulo: "🌲 O caminho segue tranquilo por aqui.", dica: "Clique em SEGUIR EM FRENTE." }
};

function alternarTela(idTela) {
    document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
    document.getElementById(idTela).classList.add('ativa');
}

function iniciarJogo() {
    posicao = 0;
    agua = 100;
    vidas = 3;
    pontos = 0;
    bloqueiaCliques = false;
    
    alternarTela('tela-jogo');
    atualizarInterface();
    proximoTurno();
}

function reiniciarJogo() {
    iniciarJogo();
}

function gerarEvento() {
    const eventos = ["praga", "seca", "terra_livre", "plantacao_pronta", "nada"];
    const pesos = [25, 20, 25, 20, 10];
    
    let rand = Math.random() * 100;
    let somaPeso = 0;
    
    for (let i = 0; i < eventos.length; i++) {
        somaPeso += pesos[i];
        if (rand <= somaPeso) {
            return eventos[i];
        }
    }
    return "nada";
}

function proximoTurno() {
    if (posicao >= TAMANHO_DO_CAMPO || vidas <= 0) {
        finalizarJogo();
        return;
    }

    bloqueiaCliques = false;
    document.getElementById('feedback-mensagem').innerText = "";

    eventoAtual = gerarEvento();
    document.getElementById('evento-titulo').innerText = descricoesEventos[eventoAtual].titulo;
    document.getElementById('evento-dica').innerText = descricoesEventos[eventoAtual].dica;
    
    atualizarInterface();
}

function jogarAcao(acao) {
    if (bloqueiaCliques) return;
    bloqueiaCliques = true;

    let msg = "";
    let corFeedback = "#2e7d32";

    if (eventoAtual === "praga") {
        if (acao === "p") {
            pontos += 5;
            msg = "✅ Você pulou a tempo! Lavoura protegida. (+5 pontos)";
        } else {
            vidas -= 1;
            msg = "❌ Você não pulou! A praga danificou parte da plantação. (-1 vida)";
            corFeedback = "#c62828";
        }
    } 
    else if (eventoAtual === "seca") {
        if (acao === "i") {
            if (agua >= 10) {
                agua -= 10;
                pontos += 3;
                msg = "💧 Irrigação feita com consciência, economizando água. (+3 pontos)";
            } else {
                vidas -= 1;
                msg = "❌ Você não tinha água suficiente! A plantação sofreu. (-1 vida)";
                corFeedback = "#c62828";
            }
        } else {
            vidas -= 1;
            msg = "❌ O solo seco prejudicou a plantação por falta de irrigação. (-1 vida)";
            corFeedback = "#c62828";
        }
    } 
    else if (eventoAtual === "terra_livre") {
        if (acao === "t") {
            pontos += 4;
            msg = "🌱 Muda plantada com sucesso! (+4 pontos)";
        } else {
            msg = "🟫 Você deixou a terra livre sem plantar. Nenhum ponto ganho.";
            corFeedback = "#ef6c00";
        }
    } 
    else if (eventoAtual === "plantacao_pronta") {
        if (acao === "c") {
            pontos += 8;
            agua = Math.min(100, agua + 5);
            msg = "🌾 Colheita realizada com sucesso! (+8 pontos, +5 água)";
        } else {
            vidas -= 1;
            msg = "❌ A plantação passou do ponto e estragou por falta de colheita. (-1 vida)";
            corFeedback = "#c62828";
        }
    } 
    else {
        msg = "🏃‍♂️ Você seguiu em frente tranquilamente.";
    }

    const elFeedback = document.getElementById('feedback-mensagem');
    elFeedback.innerText = msg;
    elFeedback.style.color = corFeedback;

    posicao += 1;
    atualizarInterface();

    setTimeout(proximoTurno, 1800);
}

function atualizarInterface() {
    document.getElementById('txt-posicao').innerText = posicao;
    document.getElementById('txt-agua').innerText = agua;
    document.getElementById('txt-pontos').innerText = pontos;
    
    document.getElementById('txt-vidas').innerText = "❤️ ".repeat(Math.max(0, vidas)) || "☠️";

    let pct = (posicao / TAMANHO_DO_CAMPO) * 100;
    document.getElementById('barra-progresso').style.width = pct + "%";
}

function finalizarJogo() {
    alternarTela('tela-final');
    document.getElementById('resultado-pontos').innerText = pontos;

    const venceu = (posicao >= TAMANHO_DO_CAMPO) && (vidas > 0) && (pontos >= PONTUACAO_PARA_VENCER);

    if (venceu) {
        document.getElementById('resultado-titulo').innerText = "🎉 PARABÉNS! VOCÊ VENCEU O JOGO!";
        document.getElementById('resultado-titulo').style.color = "#2e7d32";
        document.getElementById('resultado-texto').innerHTML = "Sua fazenda cresceu de forma equilibrada,<br>cuidando da água e da terra com consciência de forma sustentável!";
    } else {
        document.getElementById('resultado-titulo').innerText = "😭 FIM DE JOGO";
        document.getElementById('resultado-titulo').style.color = "#c62828";
        if (vidas <= 0) {
            document.getElementById('resultado-texto').innerText = "Sua fazenda não resistiu e suas vidas acabaram. Tente novamente cuidando melhor da água e das pragas!";
        } else {
            document.getElementById('resultado-texto').innerText = `Você concluiu o percurso, mas fez apenas ${pontos} pontos. São necessários pelo menos ${PONTUACAO_PARA_VENCER} pontos de sustentabilidade para vencer!`;
        }
    }
}

document.addEventListener('keydown', (event) => {
    if (document.getElementById('tela-jogo').classList.contains('ativa') && !bloqueiaCliques) {
        const tecla = event.key.toLowerCase();
        if (tecla === 'p') jogarAcao('p');
        else if (tecla === 'i') jogarAcao('i');
        else if (tecla === 't') jogarAcao('t');
        else if (tecla === 'c') jogarAcao('c');
        else if (event.key === 'Enter') jogarAcao('');
    }
});
