const pokemonApi = 'https://pokeapi.co/api/v2/pokemon?limit=151';
// Hämtar DOM
let containerPokemon = document.querySelector('.pokemon-container');
let loadMore = document.querySelector('.btn-danger');
let filteredPokemon = [];
// Fetch Url och hämta url för 151 pokemon i json objekt
async function fetchPokemonApi() {
    try {
        let response = await fetch(pokemonApi);
        if (!response.ok) {
            throw new Error('Nätverksresponsen var inte okej: ' + response.status);
        }
        let data = await response.json();
        let result = data.results;
        console.log(result);
        return result;
    }
    catch (error) {
        console.error('Det gick inte att hämta data', error);
    }
}
fetchPokemonApi();
//Skapa en ny funktion och köra ovanför function för att hämta alla url om varenda pokemon
async function getPokemonUrl() {
    let response = await fetchPokemonApi();
    let pokemonUrl = response.map((pokemon) => pokemon.url);
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
let pokemonPerPage = 12; //deklarera antal pokemon ska visas.
let currentPage = 1; //deklarera aktuell sidan
let allPokemon = [];
//Hämta pokemon
async function displayPokemon() {
    allPokemon = await getPokemonInfo();
    // Start index
    let start = (currentPage - 1) * pokemonPerPage;
    // Sista index
    let end = currentPage * pokemonPerPage;
    //Visa endast 12 pokemon på sidan
    let pokemonToDisplay = allPokemon.slice(start, end);
    //Vi har en lista av alla pokemon objekter. Loopa den listan för att ta ut
    //varje pokemon och dess egenskaper
    pokemonToDisplay.forEach((pokemon) => {
        let imgSrc = pokemon.sprites.other['official-artwork'].front_default;
        let pokemonName = pokemon.name;
        let order = pokemon.id;
        //Skapar en card för varje pokemon och visa upp den på webbläsare
        containerPokemon.innerHTML += `<div class="col-md-4">
        <a href="detail.html?id=${order}" style="text-decoration:none" >
        <div class="card" >
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
displayPokemon();
//Varje gång button trycks ska en sidan med 12 pokemon visas.
loadMore.addEventListener('click', () => {
    currentPage++;
    // Om sökfältet är tom så visas alla pokemon annars endast filtrerad pokemon visas.
    if (inputElement.value.trim() === '') {
        displayPokemon();
    }
    else {
        displayFilteredPokemon();
    }
});
//------------------------------------------------------------------------------
//Ändra & spara header & footer bakgrund färg när användare bockar av checkbox
import { changeStyle, setupCheckboxListener } from './module/styleMode.js';
changeStyle();
setupCheckboxListener();
//------------------------------------------------------------------------------
/* Pokemon sökning */
let message = document.querySelector('.message');
let inputElement = document.getElementById('search');
let pokedexText = document.querySelector('main h1');
inputElement.addEventListener('input', function (event) {
    let input = event.target.value.toLowerCase(); //
    filteredPokemon = allPokemon.filter((pokemon) => pokemon.name.toLowerCase().includes(input));
    containerPokemon.innerHTML = '';
    //Om det finns inga pokemon att visa ska fel meddelande visas upp.
    if (filteredPokemon.length === 0) {
        message.style.display = 'block';
        loadMore.style.display = 'none';
        pokedexText.style.display = 'none';
    }
    else {
        message.style.display = 'none';
        displayFilteredPokemon();
    }
    //Om användaren rensar sökning ska alla pokemon visas igen.
    if (inputElement.value.length === 0) {
        loadMore.style.display = 'block';
    }
});
//Skapa en funktion för att visa filtrerad pokemon
function displayFilteredPokemon() {
    //start index
    let start = (currentPage - 1) * pokemonPerPage;
    // Sista index
    let end = currentPage * pokemonPerPage;
    //Visa endast 12 pokemon på sidan
    let pokemonToDisplay = filteredPokemon.slice(start, end);
    if (end >= filteredPokemon.length) {
        loadMore.style.display = 'none';
    }
    else {
        loadMore.style.display = 'block';
    }
    // Vi har en lista av alla pokemon objekter. Loopa den listan för att ta ut varje pokemon och dess egenskaper */
    pokemonToDisplay.forEach((pokemon) => {
        let imgSrc = pokemon.sprites.other['official-artwork'].front_default;
        let pokemonName = pokemon.name;
        let order = pokemon.id;
        //Skapar en card för varje pokemon och visa upp den på webbläsare
        containerPokemon.innerHTML += `<div class="col-md-4">
        <a href="detail.html?id=${order}" style="text-decoration:none" > <div class="card" >
        <img src="${imgSrc}" class="card-img-top" alt="...">
        <div class="card-body">
        <h6 class="card-order"> #${order}</h6>
        <h5 class="card-title"> ${pokemonName}</h5>
        </div>
        </div></div>`;
    });
}
//# sourceMappingURL=main.js.map