const pokemonApi = 'https://pokeapi.co/api/v2/pokemon?limit=151';

// Hämtar DOM
let containerPokemon = document.querySelector('.pokemon-container');
let loadMore = document.querySelector('.btn-danger');

// Fetch Url och hämta url för 151 pokemon i json objekt

async function fetchPokemonApi() {
    try {
        let response = await fetch(pokemonApi);
        if (!response.ok) {
            throw new Error(
                'Nätverksresponsen var inte okej: ' + response.status
            );
        }
        let data = await response.json();
        let result = data.results;
        console.log(result);
        return result;
    } catch (error) {
        console.error('Det gick inte att hämta data', error);
    }
}

fetchPokemonApi();

//Skapa en ny funktion och köra ovanför function för att hämta alla url om varenda pokemon
async function getPokemonUrl() {
    let response = await fetchPokemonApi();
    let pokemonUrl = response.map((pokemon) => pokemon.url);
    console.log(pokemonUrl);
    return pokemonUrl;
}

getPokemonUrl();

//Fetch alla 151 url från ovanför funktion till 151 objekt
async function getPokemonInfo() {
    let promises = []; // tom array för att spara alla promise efter fetch klart getPokemonUrl()
    let array = await getPokemonUrl();
    //Loopa och fetcha alla url och lägg resultat i en tom array
    for (let i = 0; i < array.length; i++) {
        let pokemonData = fetch(array[i]).then((response) => response.json());

        promises.push(pokemonData);
    }

    // Vänta på att alla promises ska avslutas och samla resultaten
    let pokemons = await Promise.all(promises);
    console.log(pokemons); // Logga resultaten (array av Pokémon-objekt)
    return pokemons; // Returnera arrayen med Pokémon-objekt
}

getPokemonInfo();

//Load more funktion
let pokemonPerPage = 12; //deklarera antal pokemon ska visas.
let currentPage = 1; //deklarera aktuell sidan
let allPokemon = [];
//Hämta pokemon
async function displayPokemon() {
    allPokemon = await getPokemonInfo();

    let start = (currentPage - 1) * pokemonPerPage;
    let end = currentPage * pokemonPerPage;
    //Visa endast 12 pokemon "per" sidan
    let pokemonToDisplay = allPokemon.slice(start, end);

    /* Vi har en lista av alla pokemon objekter. Loopa den listan för att ta ut varje pokemon och dess egenskaper */
    pokemonToDisplay.forEach((pokemon) => {
        let imgSrc = pokemon.sprites.other['official-artwork'].front_default;
        let pokemonName = pokemon.name;
        let order = pokemon.id;
        //Skapar en card för varje pokemon och visa upp den på webbläsare
        containerPokemon.innerHTML += `<div class="col-md-4"> <div class="card" >
    <img src="${imgSrc}" class="card-img-top" alt="...">
    <div class="card-body">
      <h6 class="card-order"> #${order}</h6>
      <h5 class="card-title"> ${pokemonName}</h5>
    </div>
  </div></div>`;
    });
    //När det når 151 pokemon ska "load more" button döljas.
    if (end >= allPokemon.length) {
        loadMore.style.display = 'none';
    }
}

//Varje gång button trycks ska en sidan med 12 pokemon visas.
loadMore.addEventListener('click', () => {
    currentPage++;

    displayPokemon();
});

displayPokemon();
