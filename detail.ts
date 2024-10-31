let checkbox = document.querySelector('#red-mode-toggle')! as HTMLInputElement;
let header = document.querySelector('header')!;
let navIcon = document.querySelector('.navbar-toggler-icon')! as HTMLElement;
let navCollapse = document.querySelector('.navbar-collapse')! as HTMLElement;
let navLink = document.querySelectorAll(
    '.navbar-nav a'
) as NodeListOf<HTMLElement>; // lösning till när man väljer flera elements.

let footer = document.querySelector('footer')!;
let footerIcons = document.querySelectorAll(
    '.footer-icon'
) as NodeListOf<HTMLElement>;
let whiteIcons = document.querySelectorAll(
    '.footer-icon-white'
) as NodeListOf<HTMLElement>;
let copyright = document.querySelector(
    '.footer-container > p '
)! as HTMLElement;

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
    } else if (!checkbox.checked) {
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
function setupCheckboxListener() {
    checkbox.addEventListener('click', function () {
        // Värde måste vara en sträng därför man ska konvertera statusen till sträng
        localStorage.setItem(
            'checkboxStatus',
            JSON.stringify(checkbox.checked)
        );
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
//Extrahera varende pokemon value och returnera dom i html
const pokemonApi = 'https://pokeapi.co/api/v2/pokemon?limit=151';
// skapa ett URLSearchParams-objekt som innehåller alla parametrar från query-strängen i webbläsarens aktuella URL. Den här query-strängen börjar efter frågetecknet (?) i en URL.
async function getPokemon() {
    //window.location.search är en del av URL som innehåller själva query-strängen, alltså allt efter ? i URL
    let pokemonId: string = new URLSearchParams(window.location.search).get(
        'id'
    )!;
    //Byta pokemonId från string till number så att kunna använda senare i back och forward
    let pokemonIdNumber: number = parseInt(pokemonId);

    let response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    );

    let pokemon = await response.json();
    console.log(pokemon);

    let pokemonName = document.querySelector('.name-wrapp h1')!;
    let pokemonOrder = document.querySelector('.order')!;
    let pokemonImg = document.querySelector(
        '.pokemon-image img'
    )! as HTMLImageElement;
    let pokemonType = document.querySelectorAll(
        '.type'
    )! as NodeListOf<HTMLElement>;
    let pokemonType1 = document.querySelector('#first')! as HTMLElement;
    let pokemonType2 = document.querySelector('#second')!;
    let pokemonWeight = document.getElementById('weight')!;
    let pokemonHeight = document.getElementById('height')!;

    pokemonName.textContent = pokemon.name;
    pokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
    pokemonOrder.textContent = pokemon.id;
    // Hämtar pokemon weight och height
    pokemonWeight.innerHTML = pokemon.weight;
    pokemonHeight.innerHTML = pokemon.height;

    interface Type {
        type: {
            name: string;
        };
    }
    // Extrahera pokemon types
    pokemonType = pokemon.types.map((type: Type) => type.type.name);
    if (pokemonType.length === 1) {
        pokemonType1.innerHTML = pokemonType.toString();
    } else {
        pokemonType1.innerHTML = pokemonType[0].toString();
        pokemonType2.innerHTML = pokemonType[1].toString();
    }
    // Back och forward
    let leftArrow = document.getElementById('left-arrow')! as HTMLAnchorElement;
    let rightArrow = document.getElementById(
        'right-arrow'
    )! as HTMLAnchorElement;
    leftArrow.href = `detail.html?id=${pokemonIdNumber - 1}`;
    rightArrow.href = `detail.html?id=${pokemonIdNumber + 1}`;

    if (pokemonIdNumber === 1) {
        leftArrow.style.display = 'none';
    } else {
        leftArrow.style.display = 'block';
    }
}

getPokemon();
