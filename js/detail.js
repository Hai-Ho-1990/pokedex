// ---------------------------------------------------------------
// Variabler för att hantera UI-element
let checkbox = document.querySelector('#red-mode-toggle');
let header = document.querySelector('header');
let navIcon = document.querySelector('.navbar-toggler-icon');
let navCollapse = document.querySelector('.navbar-collapse');
let navLink = document.querySelectorAll('.navbar-nav a');
let footer = document.querySelector('footer');
let footerIcons = document.querySelectorAll('.footer-icon');
let whiteIcons = document.querySelectorAll('.footer-icon-white');
let copyright = document.querySelector('.footer-container > p');
// ---------------------------------------------------------------
// Funktion för att ändra stilar beroende på checkboxens status
function changeStyleDetail() {
    if (checkbox.checked) {
        // Aktivera "red mode"
        header.style.background = '#A92D22';
        navIcon.style.color = 'white';
        navCollapse.style.setProperty('background', 'transparent', 'important');
        copyright.style.color = 'white';
        footer.style.background = '#A92D22';
        // Uppdatera navigationslänkar
        for (let i = 0; i < navLink.length; i++) {
            navLink[i].style.setProperty('color', 'white', 'important');
        }
        // Hantera footer-ikoner
        for (let i = 0; i < footerIcons.length; i++) {
            whiteIcons[i].style.display = 'block';
            footerIcons[i].style.display = 'none';
        }
    }
    else {
        // Återställ till standardläge
        header.style.background = 'white';
        navCollapse.style.setProperty('background', 'transparent', 'important');
        copyright.style.color = 'black';
        footer.style.background = 'white';
        // Uppdatera navigationslänkar
        for (let i = 0; i < navLink.length; i++) {
            navLink[i].style.color = 'black';
        }
        // Hantera footer-ikoner
        for (let i = 0; i < footerIcons.length; i++) {
            whiteIcons[i].style.display = 'none';
            footerIcons[i].style.display = 'block';
        }
    }
}
// ---------------------------------------------------------------
// Funktion för att lyssna på checkbox-statusändringar och spara status i localStorage
export function setupCheckboxListener() {
    checkbox.addEventListener('click', function () {
        localStorage.setItem('checkboxStatus', JSON.stringify(checkbox.checked));
        changeStyleDetail();
    });
}
// Initiera checkbox-lyssnaren
setupCheckboxListener();
// Hämta och tillämpa sparad checkbox-status vid sidladdning
let saveCheckboxStatus = localStorage.getItem('checkboxStatus');
if (saveCheckboxStatus) {
    checkbox.checked = JSON.parse(saveCheckboxStatus);
    changeStyleDetail();
}
// ---------------------------------------------------------------
// Funktion för att hämta och visa Pokémon-data
async function getPokemon() {
    // Hämta Pokémon-id från URL:s query-string
    let pokemonId = parseInt(new URLSearchParams(window.location.search).get('id'));
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    let pokemon = await response.json();
    // Hämta HTML-element för att visa Pokémon-data
    let pokemonName = document.querySelector('.name-wrapp h1');
    let pokemonOrder = document.querySelector('.order');
    let pokemonImg = document.querySelector('.pokemon-image img');
    let pokemonFirstType = document.querySelector('#first');
    let pokemonSecondType = document.querySelector('#second');
    let pokemonType = document.querySelectorAll('.type');
    let pokemonWeight = document.getElementById('weight');
    let pokemonHeight = document.getElementById('height');
    // Uppdatera Pokémon-data i UI
    pokemonName.textContent = pokemon.name;
    pokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
    pokemonOrder.textContent = `#${pokemon.id}`;
    pokemonWeight.innerHTML = `${pokemon.weight}00g`;
    pokemonHeight.innerHTML = `${pokemon.height}0cm`;
    let pokemonTypeUrl = pokemon.types.map((type) => type.type.url);
    // Funktion för att hämta Pokémon-typer
    async function fetchPokemonType() {
        try {
            let promises = pokemonTypeUrl.map((url) => fetch(url).then((response) => {
                if (!response.ok)
                    throw new Error('Kunde inte fetcha.');
                return response.json();
            }));
            let data = await Promise.all(promises);
            // Uppdatera typbilder
            data.forEach((pokemonType, index) => {
                var _a, _b, _c;
                let typeImg = (_c = (_b = (_a = pokemonType.sprites) === null || _a === void 0 ? void 0 : _a['generation-viii']) === null || _b === void 0 ? void 0 : _b['legends-arceus']) === null || _c === void 0 ? void 0 : _c.name_icon;
                if (index === 0) {
                    pokemonFirstType.innerHTML = `<img src="${typeImg}" class="type" alt="...">`;
                }
                else if (index === 1) {
                    pokemonSecondType.innerHTML = `<img src="${typeImg}" class="type" alt="...">`;
                }
            });
        }
        catch (error) {
            console.error(error);
        }
    }
    // Hämta och visa Pokémon-typer
    fetchPokemonType();
    // Funktion för navigering mellan Pokémon (föregående och nästa)
    let leftArrow = document.getElementById('left-arrow');
    let rightArrow = document.getElementById('right-arrow');
    leftArrow.href = `detail.html?id=${pokemonId - 1}`;
    rightArrow.href = `detail.html?id=${pokemonId + 1}`;
    // Dölj vänsterpil om det är första Pokémon
    if (pokemonId === 1) {
        leftArrow.style.display = 'none';
    }
    else {
        leftArrow.style.display = 'block';
    }
    return pokemon;
}
// Hämta Pokémon-information
getPokemon();
// ---------------------------------------------------------------
// Funktion för att ändra bakgrund beroende på Pokémon-typ
let topBackground = document.querySelector('#pokemon-wrapper');
let typeBackgroundMap = {
    grass: 'grass-background',
    fire: 'fire-background',
    water: 'water-background',
    normal: 'normal-background',
    bug: 'bug-background',
    electric: 'electric-background',
    psychic: 'psychic-background',
    fairy: 'fairy-background',
    dark: 'dark-background',
    ghost: 'ghost-background',
    poison: 'poison-background',
    rock: 'rock-background',
    ground: 'ground-background',
    steel: 'steel-background',
    ice: 'ice-background',
    fighting: 'fighting-background',
    dragon: 'dragon-background',
    flying: 'flying-background'
};
// Funktion för att ändra bakgrund baserat på Pokémon-typ
async function changeBackgroundPokemon() {
    let pokemon = await getPokemon();
    let pokemonTypes = pokemon.types.map((type) => type.type.name);
    // Rensa tidigare bakgrundsinställningar
    topBackground.className = '';
    // Ta den första Pokémon-typen och använd motsvarande bakgrund
    let primaryType = pokemonTypes[0];
    let backgroundClass = typeBackgroundMap[primaryType];
    if (backgroundClass) {
        topBackground.classList.add(backgroundClass);
    }
}
// Uppdatera bakgrunden baserat på Pokémon-typ
changeBackgroundPokemon();
//# sourceMappingURL=detail.js.map