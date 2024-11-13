// API Endpoint
const pokemonApi = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=493';

// DOM Elements
let containerPokemon = document.querySelector(
    '.pokemon-container'
)! as HTMLElement;
let loadMore = document.querySelector('#load-more')! as HTMLElement;
let favoritePokemon = document.querySelector(
    '.favorite-pokemon-container'
)! as HTMLElement;
let add = document.querySelector('#add-pokemon')! as HTMLElement;
let back = document.querySelector('#go-back')! as HTMLElement;
let show = document.querySelector('#show-pokemon')! as HTMLElement;
let minus = document.querySelector('#delete-pokemon')! as HTMLElement;
let fieldSet = document.querySelector('fieldset')! as HTMLElement;

// Pokemon-related variables
let filteredPokemon: any[] = [];
let pokemonPerPage = 12;
let currentPage = 1;
let allPokemon: Pokemon[] = [];
let savedPokemonId: string;

// Interfaces
interface Sprites {
    other: {
        'official-artwork': {
            front_default: string;
        };
    };
}

interface Pokemon {
    id: number;
    name: string;
    sprites: Sprites;
}

// Fetch Functions
async function fetchPokemonApi() {
    try {
        let response = await fetch(pokemonApi);
        if (!response.ok)
            throw new Error(
                'Nätverksresponsen var inte okej: ' + response.status
            );
        let data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Det gick inte att hämta data', error);
    }
}

async function getPokemonUrl() {
    let response = await fetchPokemonApi();
    return response.map(
        (pokemon: { name: string; url: string }) => pokemon.url
    );
}

async function getPokemonInfo() {
    let promises = [];
    let urls = await getPokemonUrl();

    for (let url of urls) {
        promises.push(fetch(url).then((response) => response.json()));
    }

    return Promise.all(promises);
}

// Display Functions
async function displayPokemon() {
    allPokemon = await getPokemonInfo();
    let start = (currentPage - 1) * pokemonPerPage;
    let end = currentPage * pokemonPerPage;
    let pokemonToDisplay = allPokemon.slice(start, end);

    pokemonToDisplay.forEach((pokemon: Pokemon) => {
        let imgSrc = pokemon.sprites.other['official-artwork'].front_default;
        let pokemonName = pokemon.name;
        let order = pokemon.id;

        containerPokemon.innerHTML += `
            <div class="col-md-4">
                <div class="card" id=${order}>
                    <img src="${imgSrc}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h6 class="card-order"> #${order}</h6>
                        <h5 class="card-title"> ${pokemonName}</h5>
                    </div>
                </div>
            </div>`;
    });

    if (end >= allPokemon.length) {
        loadMore.style.display = 'none';
    } else {
        loadMore.style.display = 'block';
    }

    choosePokemon();
}

// Load More Event
loadMore.addEventListener('click', () => {
    currentPage++;
    if (inputElement.value.trim() === '') {
        displayPokemon();
    } else {
        displayFilteredPokemon();
    }
});

// Search Functionality
let message = document.querySelector('.message')! as HTMLElement;
let inputElement = document.getElementById('search')! as HTMLInputElement;
let pokedexText = document.querySelector('main h1')! as HTMLElement;

inputElement.addEventListener('input', (event) => {
    let input = (event.target as HTMLInputElement).value.toLowerCase();
    filteredPokemon = allPokemon.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(input)
    );
    containerPokemon.innerHTML = '';

    if (filteredPokemon.length === 0) {
        message.style.display = 'block';
        loadMore.style.display = 'none';
        pokedexText.style.display = 'none';
    } else {
        message.style.display = 'none';
        displayFilteredPokemon();
    }

    if (inputElement.value.length === 0) {
        loadMore.style.display = 'block';
    }
});

function displayFilteredPokemon() {
    let start = (currentPage - 1) * pokemonPerPage;
    let end = currentPage * pokemonPerPage;
    let pokemonToDisplay = filteredPokemon.slice(start, end);

    if (end >= filteredPokemon.length) {
        loadMore.style.display = 'none';
    } else {
        loadMore.style.display = 'block';
    }

    pokemonToDisplay.forEach((pokemon) => {
        let imgSrc = pokemon.sprites.other['official-artwork'].front_default;
        let pokemonName = pokemon.name;
        let order = pokemon.id;

        containerPokemon.innerHTML += `
            <div class="col-md-4">
                <div class="card" id=${order}>
                    <img src="${imgSrc}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h6 class="card-order"> #${order}</h6>
                        <h5 class="card-title"> ${pokemonName}</h5>
                    </div>
                </div>
            </div>`;
    });

    choosePokemon();
}

// Choose Pokemon Function
function choosePokemon() {
    let cards = document.querySelectorAll('.card') as NodeListOf<HTMLElement>;

    cards.forEach((card) => {
        card.addEventListener('click', () => {
            card.style.setProperty('border', '2px solid red', 'important');
            savedPokemonId = String(card.id);
        });
    });
}

// Add Pokemon Functionality
function addPokemon() {
    add.addEventListener('click', async () => {
        show.style.display = 'block';
        let favorites = await fetchPokemonFromDb();
        let isAlreadyFavorite = favorites.some(
            (pokemon: Pokemon) => String(pokemon.id) === savedPokemonId
        );

        if (isAlreadyFavorite) {
            alert('Denna Pokémon finns redan i favoritlistan.');
        } else {
            fetchPokemonById(savedPokemonId);
        }
    });
}

async function fetchPokemonById(id: string) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    let pokemon = await response.json();
    postPokemonToDB(pokemon);
}

async function postPokemonToDB(pokemon: any) {
    try {
        pokemon.id = String(pokemon.id);
        let response = await fetch('http://localhost:3000/favorite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pokemon)
        });
        let data = await response.json();
        return data;
    } catch (error) {
        console.error('Error posting Pokémon:', error);
    }
}

// Fetch from DB
async function fetchPokemonFromDb() {
    try {
        let response = await fetch('http://localhost:3000/favorite');
        if (!response.ok) throw new Error('Failed to fetch favorite Pokémon.');
        return await response.json();
    } catch (error) {
        console.error('Error fetching Pokémon from database:', error);
        return [];
    }
}

async function displayFavoritePokemon() {
    allPokemon = await fetchPokemonFromDb();
    let start = (currentPage - 1) * pokemonPerPage;
    let end = currentPage * pokemonPerPage;
    let pokemonToDisplay = allPokemon.slice(start, end);

    pokemonToDisplay.forEach((pokemon: Pokemon) => {
        let imgSrc =
            pokemon.sprites?.other?.['official-artwork']?.front_default || '';
        let pokemonName = pokemon.name;
        let order = pokemon.id;

        favoritePokemon.innerHTML += `
            <div class="col-md-4">
                <div class="card" id=${order}>
                    <img src="${imgSrc}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h6 class="card-order"> #${order}</h6>
                        <h5 class="card-title"> ${pokemonName}</h5>
                    </div>
                </div>
            </div>`;
    });

    choosePokemon();

    if (end >= allPokemon.length) {
        loadMore.style.display = 'none';
    }
}

// Show Favorite Pokemon
let headingFavoriteList = document.querySelector('main > h1')!;
function showFavoritePokemon() {
    show.addEventListener('click', async () => {
        containerPokemon.style.display = 'none';
        show.style.display = 'none';
        minus.style.display = 'block';
        add.style.display = 'none';
        back.style.display = 'block';
        fieldSet.style.display = 'none';
        headingFavoriteList.innerHTML = 'Your favourite list';
        await displayFavoritePokemon();
        fetchPokemonFromDb();
    });
}

// Delete Functionality
async function deletePokemon() {
    try {
        await fetch(`http://localhost:3000/favorite/${savedPokemonId}`, {
            method: 'DELETE'
        });
        favoritePokemon.innerHTML = '';
        await displayFavoritePokemon();
    } catch (error) {
        console.error('Error deleting Pokémon:', error);
    }
}

minus.addEventListener('click', async () => {
    let favoritePokemonList = await fetchPokemonFromDb();
    let pokemonToDelete = favoritePokemonList.find(
        (pokemon: Pokemon) => String(pokemon.id) === savedPokemonId
    );

    if (pokemonToDelete) {
        deletePokemon();
    }
});

// Go Back to Main List
function goBack() {
    back.addEventListener('click', () => {
        containerPokemon.style.display = 'block';
        show.style.display = 'block';
        minus.style.display = 'none';
        add.style.display = 'block';
        back.style.display = 'none';
        fieldSet.style.display = 'block';
        favoritePokemon.innerHTML = '';
        headingFavoriteList.innerHTML = 'Pokedex';
        loadMore.style.display = 'block';
    });
}

// Initialize Functions
displayPokemon();
addPokemon();
showFavoritePokemon();
goBack();
