const pokemonApi = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=493';
// Hämtar DOM
let containerPokemon = document.querySelector('.pokemon-container');
let loadMore = document.querySelector('#load-more');
let favoritePokemon = document.querySelector('.favorite-pokemon-container');
let filteredPokemon = [];
let add = document.querySelector('#add-pokemon');
let addMore = document.querySelector('#add-more');
let show = document.querySelector('#show-pokemon');
let minus = document.querySelector('#delete-pokemon');
let fieldSet = document.querySelector('fieldset');
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
        <div class="card" id=${order}>
        <img src="${imgSrc}" class="card-img-top" alt="...">
        <div class="card-body">
        <h6 class="card-order"> #${order}</h6>
        <h5 class="card-title"> ${pokemonName}</h5>
        </div>
        </div></div>`;
    });
    //När alla pokemon visas ska "load more" button döljas.
    if (end >= allPokemon.length) {
        loadMore.style.display = 'none';
    }
    else {
        loadMore.style.display = 'block';
    }
    choosePokemon();
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
// Pokemon sökning
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
    // Vi har en lista av alla pokemon objekter. Loopa den listan för att ta ut
    //varje pokemon och dess önskade egenskaper
    pokemonToDisplay.forEach((pokemon) => {
        let imgSrc = pokemon.sprites.other['official-artwork'].front_default;
        let pokemonName = pokemon.name;
        let order = pokemon.id;
        //Skapar en card för varje pokemon och visa upp den på webbläsare
        containerPokemon.innerHTML += `<div class="col-md-4">
         <div class="card" id=${order}>
        <img src="${imgSrc}" class="card-img-top" alt="...">
        <div class="card-body">
        <h6 class="card-order"> #${order}</h6>
        <h5 class="card-title"> ${pokemonName}</h5>
        </div>
        </div></div>`;
    });
    choosePokemon();
}
displayFilteredPokemon();
//------------------------------------------------------------------------------
//Markera pokemon
let savedPokemonId;
function choosePokemon() {
    let cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
        card.addEventListener('click', function () {
            // Lägg till en border till den klickade card
            card.style.setProperty('border', '2px solid red', 'important');
            savedPokemonId = String(card.id);
            console.log(savedPokemonId);
        });
    });
}
function addPokemon() {
    add.addEventListener('click', async function () {
        show.style.display = 'block';
        //Kontrollera om pokemon redan dinns i favoritlistan
        let favorites = await fetchPokemonFromDb();
        let isAlreadyFavorite = favorites.some((pokemon) => String(pokemon.id) === savedPokemonId);
        if (isAlreadyFavorite) {
            alert('Denna pokemon finns redan di favoritlistan.');
        }
        fetchPokemonById(savedPokemonId);
    });
}
//Hämta pokemon med dess id
async function fetchPokemonById(savedPokemonId) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${savedPokemonId}`);
    let pokemon = await response.json();
    postPokemonToDB(pokemon);
    console.log(pokemon);
}
// POST pokemon
async function postPokemonToDB(pokemon) {
    try {
        pokemon.id = String(pokemon.id);
        let response = await fetch('http://localhost:3000/favorite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pokemon)
        });
        let data = await response.json();
        console.log('Posted Pokémon:', data);
        return data;
    }
    catch (error) {
        console.error('Error posting Pokémon:', error);
    }
}
//Fetcha db json server
async function fetchPokemonFromDb() {
    try {
        let response = await fetch('http://localhost:3000/favorite');
        if (!response.ok) {
            throw new Error('Failed to fetch favorite Pokémon.');
        }
        let data = await response.json();
        console.log('Favorite Pokémon from DB:', data);
        return data;
    }
    catch (error) {
        console.error('Error fetching Pokémon from database:', error);
        return []; // Return an empty array in case of error
    }
}
async function displayFavoritePokemon() {
    allPokemon = await fetchPokemonFromDb();
    // Start index
    let start = (currentPage - 1) * pokemonPerPage;
    // Sista index
    let end = currentPage * pokemonPerPage;
    //Visa endast 12 pokemon på sidan
    let pokemonToDisplay = allPokemon.slice(start, end);
    //Vi har en lista av alla pokemon objekter. Loopa den listan för att ta ut
    //varje pokemon och dess egenskaper
    pokemonToDisplay.forEach((pokemon) => {
        var _a, _b, _c;
        let imgSrc = ((_c = (_b = (_a = pokemon.sprites) === null || _a === void 0 ? void 0 : _a.other) === null || _b === void 0 ? void 0 : _b['official-artwork']) === null || _c === void 0 ? void 0 : _c.front_default) || '';
        let pokemonName = pokemon.name;
        let order = pokemon.id;
        //Skapar en card för varje pokemon och visa upp den på webbläsare
        favoritePokemon.innerHTML += `<div class="col-md-4">
        <div class="card" id=${order}>
        <img src="${imgSrc}" class="card-img-top" alt="...">
        <div class="card-body">
        <h6 class="card-order"> #${order}</h6>
        <h5 class="card-title"> ${pokemonName}</h5>
        </div>
        </div></div>`;
    });
    //Denna funktioner anropas för att kunna markera även i favoritlistan.
    choosePokemon();
    //När det når 151 pokemon ska "load more" button döljas.
    if (end >= allPokemon.length) {
        loadMore.style.display = 'none';
    }
}
//------------------------------------------------------------------------------
//Visa upp pokemon
let headingFavoriteList = document.querySelector('main > h1');
async function showFavoritePokemon() {
    show.addEventListener('click', async function () {
        containerPokemon.style.display = 'none';
        show.style.display = 'none';
        minus.style.display = 'block';
        add.style.display = 'none';
        addMore.style.display = 'block';
        fieldSet.style.display = 'none';
        headingFavoriteList.innerHTML = 'Your favourite list';
        await displayFavoritePokemon();
        fetchPokemonFromDb();
    });
}
showFavoritePokemon();
choosePokemon();
addPokemon();
//Add more funktion, man går tillbaka till all Pokemon för att adda flera.
async function fetchFavoritePokemon() {
    try {
        const response = await fetch('http://localhost:3000/favorite');
        const data = await response.json();
        console.log(data);
        return data; // Returnera listan med alla favoriter
    }
    catch (error) {
        console.error('Error fetching Pokémon:', error);
    }
}
fetchFavoritePokemon();
async function deletePokemon() {
    try {
        await fetch(`http://localhost:3000/favorite/${savedPokemonId}`, {
            method: 'DELETE'
        });
        favoritePokemon.innerHTML = '';
        await displayFavoritePokemon();
    }
    catch (error) {
        console.error('Error deleting pokemon:', error);
    }
}
minus.addEventListener('click', async function () {
    // Hämta favorit Pokémon från databasen
    const favoritePokemonList = await fetchPokemonFromDb();
    console.log('Favorite Pokémon List:', favoritePokemonList); // Logga listan för att säkerställa att den är hämtad korrekt
    console.log('Saved Pokémon ID:', savedPokemonId); // Logga savedPokemonId för att säkerställa att den är korrekt
    // Hitta Pokémon att ta bort i listan
    let pokemonToDelete = favoritePokemonList.find((pokemon) => String(pokemon.id) === savedPokemonId);
    console.log('Parsed savedPokemonId:', savedPokemonId);
    if (pokemonToDelete) {
        // Om Pokémon hittades, ta bort den
        console.log('Found Pokémon to delete:', pokemonToDelete); // Logga den Pokémon som hittades
        deletePokemon();
    }
    else {
        // Om Pokémon inte hittades
        console.error('Pokémon to delete not found');
    }
});
//------------------------------------------------------------------------------
//Ändra & spara header & footer bakgrund färg när användare bockar av checkbox
import { changeStyle, setupCheckboxListener } from '../module/styleMode.js';
changeStyle();
setupCheckboxListener();
//# sourceMappingURL=favorite.js.map