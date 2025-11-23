// Seleciona o elemento HTML com a classe "card-container" e o armazena na variável cardContainer.
let cardContainer = document.querySelector(".card-container");
// Declara um array vazio chamado 'dados' que será usado para armazenar os dados do arquivo JSON.
let dados = [];
// Seleciona o elemento de input com o id "caixa-busca" e o armazena na variável caixaBusca.
let caixaBusca = document.querySelector("#caixa-busca");
// Seleciona o elemento de botão com o id "botao-busca" e o armazena na variável botaoBusca.
let botaoBusca = document.querySelector("#botao-busca");

// Adiciona um ouvinte de evento que chama a função 'iniciarBusca' quando a página termina de carregar.
window.addEventListener('load', iniciarBusca);

// Adiciona um ouvinte de evento ao botão de busca que chama a função 'buscar' quando o botão é clicado.
botaoBusca.addEventListener('click', buscar);
// Adiciona um ouvinte de evento à caixa de busca que é acionado a cada tecla pressionada.
caixaBusca.addEventListener('keyup', (e) => { // O parâmetro 'e' representa o evento do teclado.
    // Verifica se a tecla pressionada foi a tecla "Enter".
    if (e.key === "Enter") { // Permite buscar com a tecla Enter
        // Se for a tecla "Enter", chama a função 'buscar'.
        buscar();
    }
});

// Define uma função assíncrona chamada 'iniciarBusca'. Funções assíncronas permitem o uso do 'await'.
async function iniciarBusca() {
    // Faz uma requisição para buscar o arquivo "data.json" e aguarda a resposta.
    let resposta = await fetch("data.json");
    // Converte a resposta da requisição para o formato JSON e aguarda o resultado, armazenando em 'dados'.
    dados = await resposta.json();
    // Limpa o container de cards para garantir que a página comece em branco.
    cardContainer.innerHTML = "";
}

// Função auxiliar para remover acentos de uma string.
function removerAcentos(texto) {
    // Normaliza a string para decompor os caracteres acentuados e depois remove os diacríticos.
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Define a função 'buscar'.
function buscar() {
    // Pega o valor da busca, converte para minúsculas e remove acentos.
    let termoBusca = removerAcentos(caixaBusca.value.toLowerCase());
    // Filtra o array 'dados' para encontrar itens cujo nome ou descrição incluam o termo de busca.
    let dadosFiltrados = dados.filter(dado => {
        // Compara o termo de busca (sem acentos) com o nome e a descrição (também sem acentos).
        return removerAcentos(dado.nome.toLowerCase()).includes(termoBusca) ||
               removerAcentos(dado.descricao.toLowerCase()).includes(termoBusca);
    });
    // Verifica se o array filtrado está vazio, ou seja, se nenhum resultado foi encontrado.
    if (dadosFiltrados.length === 0) {
        // Se nenhum resultado for encontrado, exibe uma mensagem no container de cards.
        cardContainer.innerHTML = `<p>Nenhum resultado encontrado para "${caixaBusca.value}"</p>`;
    } else {
        // Se resultados forem encontrados, chama a função 'renderizarCards' para exibi-los.
        renderizarCards(dadosFiltrados);
    }
}

// Define a função 'renderizarCards' que recebe um array de dados para exibir.
function renderizarCards(dados) {
    // Limpa o conteúdo atual do container de cards para evitar duplicatas.
    cardContainer.innerHTML = "";
    // Itera sobre cada objeto 'dado' no array de dados fornecido.
    dados.forEach(dado => {
        // Cria um novo elemento HTML <article>.
        let article = document.createElement("article");

        // Gera a lista de álbuns famosos com links para o Spotify.
        const listaAlbuns = criarListaSpotify(dado.albunsFamosos, 'Álbuns Famosos');
        // Gera a lista de músicas famosas com links para o Spotify.
        const listaMusicas = criarListaSpotify(dado.musicasFamosas, 'Músicas Famosas');

        // Define o conteúdo HTML do elemento <article> usando os dados do objeto atual.
        article.innerHTML = `
            <a href="${dado.spotifyProfileUrl}" target="_blank" class="spotify-profile-link">
                <h2>${dado.nome}</h2>
            </a>
            <p><strong>Ano de Nascimento:</strong> ${dado.idade}</p>
            <p>${dado.descricao}</p>
            <div class="spotify-info">
                ${listaAlbuns}
                ${listaMusicas}
            </div>
            <a href="${dado.link}" target="_blank" class="wiki-link">Saiba mais na Wikipédia</a>
        `;
        // Adiciona o novo <article> criado como um filho do container de cards.
        cardContainer.appendChild(article);
    });
}

// Função auxiliar para criar listas de álbuns ou músicas com links para o Spotify.
function criarListaSpotify(itens, titulo) {
    // Se a lista de itens não existir ou estiver vazia, retorna uma string vazia.
    if (!itens || itens.length === 0) {
        return "";
    }

    // Mapeia cada item para um elemento de lista <li> com um link <a>.
    const itensLista = itens.map(item => {
        const nomeItem = item.nome_album || item.nome_musica; // Usa a chave correta (nome_album ou nome_musica)
        return `<li><a href="${item.url}" target="_blank">${nomeItem}</a></li>`;
    }).join('');

    // Retorna a estrutura HTML completa da lista.
    return `<div class="spotify-list"><h4>${titulo}</h4><ul>${itensLista}</ul></div>`;
}