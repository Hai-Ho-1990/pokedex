//------------------------------------------------------------------------------
// Global konfiguration
//------------------------------------------------------------------------------
const pokemonApi = 'https://pokeapi.co/api/v2/pokemon?offset=151&limit=100';
let pokemonPerPage = 12;
let currentPage = 1;
let allPokemon = [];
let filteredPokemon = [];
//------------------------------------------------------------------------------
// DOM-element
//------------------------------------------------------------------------------
let containerPokemon = document.querySelector('.pokemon-container');
let loadMore = document.querySelector('.btn-danger');
let message = document.querySelector('.message');
let inputElement = document.getElementById('search');
let pokedexText = document.querySelector('main h1');
//------------------------------------------------------------------------------
// Funktioner för att hämta data
//------------------------------------------------------------------------------
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
async function getPokemonUrl() {
    let response = await fetchPokemonApi();
    let pokemonUrl = response.map((pokemon) => pokemon.url);
    console.log(pokemonUrl);
    return pokemonUrl;
}
getPokemonUrl();
async function getPokemonInfo() {
    let promises = [];
    let array = await getPokemonUrl();
    for (let i = 0; i < array.length; i++) {
        let pokemonData = fetch(array[i]).then((response) => response.json());
        promises.push(pokemonData);
    }
    let pokemons = await Promise.all(promises);
    console.log(pokemons);
    return pokemons;
}
getPokemonInfo();
//------------------------------------------------------------------------------
// Hämta och visa Pokémon
//------------------------------------------------------------------------------
async function displayPokemon() {
    allPokemon = await getPokemonInfo();
    let start = (currentPage - 1) * pokemonPerPage;
    let end = currentPage * pokemonPerPage;
    let pokemonToDisplay = allPokemon.slice(start, end);
    pokemonToDisplay.forEach((pokemon) => {
        let imgSrc = pokemon.sprites.other['official-artwork'].front_default;
        let pokemonName = pokemon.name;
        let order = pokemon.id;
        containerPokemon.innerHTML += `<div class="col-md-4">
        <a href="detail.html?id=${order}" style="text-decoration:none">
        <div class="card">
        <img src="${imgSrc}" class="card-img-top" alt="...">
        <div class="card-body">
        <h6 class="card-order"> #${order}</h6>
        <h5 class="card-title"> ${pokemonName}</h5>
        </div>
        </div></div>`;
    });
    if (end >= allPokemon.length) {
        loadMore.style.display = 'none';
    }
}
displayPokemon();
//------------------------------------------------------------------------------
// Event-lyssnare
//------------------------------------------------------------------------------
loadMore.addEventListener('click', () => {
    currentPage++;
    if (inputElement.value.trim() === '') {
        displayPokemon();
    }
    else {
        displayFilteredPokemon();
    }
});
inputElement.addEventListener('input', function (event) {
    let input = event.target.value.toLowerCase();
    filteredPokemon = allPokemon.filter((pokemon) => pokemon.name.toLowerCase().includes(input));
    containerPokemon.innerHTML = '';
    if (filteredPokemon.length === 0) {
        message.style.display = 'block';
        loadMore.style.display = 'none';
        pokedexText.style.display = 'none';
    }
    else {
        message.style.display = 'none';
        displayFilteredPokemon();
    }
    if (inputElement.value.length === 0) {
        loadMore.style.display = 'block';
    }
});
//------------------------------------------------------------------------------
// Visa filtrerad Pokémon
//------------------------------------------------------------------------------
function displayFilteredPokemon() {
    let start = (currentPage - 1) * pokemonPerPage;
    let end = currentPage * pokemonPerPage;
    let pokemonToDisplay = filteredPokemon.slice(start, end);
    if (end >= filteredPokemon.length) {
        loadMore.style.display = 'none';
    }
    else {
        loadMore.style.display = 'block';
    }
    pokemonToDisplay.forEach((pokemon) => {
        let imgSrc = pokemon.sprites.other['official-artwork'].front_default;
        let pokemonName = pokemon.name;
        let order = pokemon.id;
        containerPokemon.innerHTML += `<div class="col-md-4">
        <a href="detail.html?id=${order}" style="text-decoration:none">
        <div class="card">
        <img src="${imgSrc}" class="card-img-top" alt="...">
        <div class="card-body">
        <h6 class="card-order"> #${order}</h6>
        <h5 class="card-title"> ${pokemonName}</h5>
        </div>
        </div></div>`;
    });
}
//------------------------------------------------------------------------------
// Ändra & spara header och footer bakgrundsfärg
//------------------------------------------------------------------------------
import { changeStyle, setupCheckboxListener } from '../module/styleMode.js';
changeStyle();
setupCheckboxListener();
//# sourceMappingURL=johto.js.map