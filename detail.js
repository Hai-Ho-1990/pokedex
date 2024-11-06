let checkbox = document.querySelector('#red-mode-toggle');
let header = document.querySelector('header');
let navIcon = document.querySelector('.navbar-toggler-icon');
let navCollapse = document.querySelector('.navbar-collapse');
let navLink = document.querySelectorAll('.navbar-nav a'); // lösning till när man väljer flera elements.
let footer = document.querySelector('footer');
let footerIcons = document.querySelectorAll('.footer-icon');
let whiteIcons = document.querySelectorAll('.footer-icon-white');
let copyright = document.querySelector('.footer-container > p ');
//Skapar först stilar för header när användare bockar av knappen.
function changeStyleDetail() {
    if (checkbox.checked) {
        header.style.background = '#C61700';
        navIcon.style.color = 'white';
        navCollapse.style.setProperty('background', '#C61700', 'important');
        copyright.style.color = 'white';
        footer.style.background = '#C61700';
        for (let i = 0; i < navLink.length; i++) {
            navLink[i].style.setProperty('color', 'white', 'important');
        }
        for (let i = 0; i < footerIcons.length; i++) {
            whiteIcons[i].style.display = 'block';
            footerIcons[i].style.display = 'none';
        }
    }
    else if (!checkbox.checked) {
        header.style.background = 'white';
        navCollapse.style.background = 'white';
        copyright.style.color = 'black';
        footer.style.background = 'white';
        for (let i = 0; i < navLink.length; i++) {
            navLink[i].style.color = 'black';
        }
        for (let i = 0; i < footerIcons.length; i++) {
            whiteIcons[i].style.display = 'none';
            footerIcons[i].style.display = 'block';
        }
    }
}
// Så fort användaren klickar så sparas checkboxen status och ändrar webbläsares bakgrundsfärg
export function setupCheckboxListener() {
    checkbox.addEventListener('click', function () {
        // Värde måste vara en sträng därför man ska konvertera statusen till sträng
        localStorage.setItem('checkboxStatus', JSON.stringify(checkbox.checked));
        changeStyleDetail();
    });
}
setupCheckboxListener();
// Man hämtar statusen som man har sparat och applicera dess stilar till webbläsaren.
let saveCheckboxStatus = localStorage.getItem('checkboxStatus');
if (saveCheckboxStatus) {
    checkbox.checked = JSON.parse(saveCheckboxStatus);
    changeStyleDetail();
}
//-----------------------------------------------------
// skapa ett URLSearchParams-objekt som innehåller alla parametrar från query-strängen i webbläsarens aktuella URL. Den här query-strängen börjar efter frågetecknet (?) i en URL.
async function getPokemon() {
    //window.location.search är en del av URL som innehåller själva query-strängen, alltså allt efter ? i URL
    //Konvertera pokemonId från string till number genom använda parseInt()
    let pokemonId = parseInt(new URLSearchParams(window.location.search).get('id'));
    //Varje gång man lägga manuellt en ny pokemon måste öka begränsningar.
    if (pokemonId > 153) {
        pokemonId = 153;
    }
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    let pokemon = await response.json();
    let pokemonName = document.querySelector('.name-wrapp h1');
    let pokemonOrder = document.querySelector('.order');
    let pokemonImg = document.querySelector('.pokemon-image img');
    let pokemonType1 = document.querySelector('#first');
    let pokemonType2 = document.querySelector('#second');
    let pokemonType = document.querySelectorAll('.type');
    let pokemonWeight = document.getElementById('weight');
    let pokemonHeight = document.getElementById('height');
    pokemonName.textContent = pokemon.name;
    pokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
    pokemonOrder.textContent = `#${pokemon.id}`;
    // Hämtar pokemon weight och height
    pokemonWeight.innerHTML = `${pokemon.weight}0g`;
    pokemonHeight.innerHTML = `${pokemon.height}0cm`;
    /*  */
    let pokemonTypeUrl = pokemon.types.map((type) => type.type.url);
    async function fetchPokemonType() {
        try {
            // Skapar en array av `fetch`-anrop för varje URL
            // Eftersom vi har massa av type API så vi måste loopar varenda url
            let promises = pokemonTypeUrl.map((url) => fetch(url).then((response) => {
                if (!response.ok)
                    throw new Error('Kunde inte fetcha.');
                return response.json();
            }));
            //Pormise.all() behövs när man jobbar med flera asynkrona operationer som kan köras parallellt
            let data = await Promise.all(promises);
            console.log(data);
            data.forEach((pokemonType, index) => {
                var _a, _b, _c;
                //?. kontrollerar om sprites, ['generation-viii'] & ['legends-arceus']
                //finns eller inte.
                let typeImg = (_c = (_b = (_a = pokemonType.sprites) === null || _a === void 0 ? void 0 : _a['generation-viii']) === null || _b === void 0 ? void 0 : _b['legends-arceus']) === null || _c === void 0 ? void 0 : _c.name_icon;
                if (typeImg) {
                    console.log(data.length);
                }
                if (index === 0) {
                    pokemonType1.innerHTML = `<img src="${typeImg}" class="type" alt="...">`;
                }
                else if (index === 1) {
                    pokemonType2.innerHTML = `<img src="${typeImg}" class="type" alt="...">`;
                }
            });
        }
        catch (error) {
            console.error(error);
        }
    }
    fetchPokemonType();
    // Back och forward
    let leftArrow = document.getElementById('left-arrow');
    let rightArrow = document.getElementById('right-arrow');
    leftArrow.href = `detail.html?id=${pokemonId - 1}`;
    rightArrow.href = `detail.html?id=${pokemonId + 1}`;
    if (pokemonId === 1) {
        leftArrow.style.display = 'none';
    }
    else {
        leftArrow.style.display = 'block';
    }
    return pokemon;
}
getPokemon();
//------------------------------------------------------------------------------
//Ändra bakgrundsfärg beroende på pokemon typ
let topBackground = document.querySelector('#pokemon-wrapper');
// Mappning av Pokémon-typer till klassnamn
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
async function changeBackgroundPokemon() {
    let pokemon = await getPokemon();
    let pokemonTypes = [];
    // Hämta Pokémon-typer
    pokemonTypes = pokemon.types.map((type) => type.type.name);
    // Ta bort tidigare typer
    topBackground.className = ''; // Rensa tidigare klassnamn
    // Hämta första typen och lägg till den motsvarande bakgrundsklassen
    let primaryType = pokemonTypes[0];
    let backgroundClass = typeBackgroundMap[primaryType];
    //Om backgroundClass finns, lägg till den med dess egenskaper
    if (backgroundClass) {
        topBackground.classList.add(backgroundClass);
    }
}
// Anropa funktionen för att ändra bakgrunden
changeBackgroundPokemon();
//# sourceMappingURL=detail.js.map