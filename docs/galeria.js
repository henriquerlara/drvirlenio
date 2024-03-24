var modal = document.getElementById("modal-imagem");
var imagens = document.getElementsByClassName("imagem-pequena");
var modalImg = document.getElementById("imagem-ampliada");
var descricao = document.getElementById("descricao-imagem");
var span = document.getElementsByClassName("fechar")[0]; // Botão de fechar

var indiceImagemAtual = 0; // Manterá o controle do índice da imagem atualmente exibida

// Configurar imagem modal
function configurarImagemModal(indice) {
    modalImg.src = imagens[indice].src;
    descricao.innerHTML = imagens[indice].alt;
    indiceImagemAtual = indice;
}

// Adicionar evento de clique a cada imagem
for (let i = 0; i < imagens.length; i++) {
    imagens[i].onclick = function() {
        modal.style.display = "block";
        configurarImagemModal(i);
    }
}

// Função para mudar a imagem atual no modal
function mudarImagem(direcao) {
    var novoIndice = indiceImagemAtual + direcao;
    if (novoIndice >= 0 && novoIndice < imagens.length) {
        configurarImagemModal(novoIndice);
    }
    else if(novoIndice == imagens.length){
        configurarImagemModal(0);
    }
    else if(novoIndice < imagens.length){
        configurarImagemModal(imagens.length - 1);
    }
}

// Event listeners para os botões de navegar
document.querySelector('.anterior').addEventListener('click', function() {
    mudarImagem(-1);
});

document.querySelector('.proximo').addEventListener('click', function() {
    mudarImagem(1);
});

// Fechar modal
span.onclick = function() {
    modal.style.display = "none";
}

// Fecha o modal também quando clica fora da imagem
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
