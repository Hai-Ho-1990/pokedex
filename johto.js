let newPokemon = {
    id: '3',
    name: 'Meganium',
    order: 154,
    image: 'https://archives.bulbagarden.net/media/upload/8/8b/0154Meganium.png',
    types: [{ type: { name: 'grass' } }],
    weight: 1050,
    height: 180,
    stats: [
        { name: 'Hp', base_stat: 80 },
        { name: 'Atk', base_stat: 82 },
        { name: 'Defense', base_stat: 100 },
        { name: 'SpAtk', base_stat: 83 },
        { name: 'SpDef', base_stat: 100 },
        { name: 'Speed', base_stat: 80 }
    ]
};
async function getPokemonJohto() {
    try {
        let response = await fetch('http://localhost:3000/johto');
        let result = await response.json();
        console.log(result);
        return result;
    }
    catch (error) {
        console.error('Error fetching Pokémon:', error);
    }
}
// POST pokemon
async function postPokemonJohto(newPokemon) {
    try {
        let response = await fetch('http://localhost:3000/johto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPokemon)
        });
        let data = await response.json();
        console.log('Posted Pokémon:', data);
        return data;
    }
    catch (error) {
        console.error('Error posting Pokémon:', error);
    }
}
let addPokemon = document.getElementById('addPokemon');
addPokemon.addEventListener('click', () => {
    // Kontrollera och lägg till Pokémon om den inte redan finns
    getPokemonJohto().then((johtoPokemons) => {
        // vi får tillbaka en listan av pokemon
        if (!johtoPokemons.some((pokemon) => pokemon.id === newPokemon.id)) {
            postPokemonJohto(newPokemon);
        }
        else {
            console.log('pokemon finns redan i listan');
        }
    });
});
// DELETE en pokemon
let deleteBtn = document.getElementById('deletePokemon');
async function deletePokemonJohto() {
    try {
        let response = await fetch('http://localhost:3000/johto/3', {
            method: 'DELETE'
        });
    }
    catch (error) {
        console.error('Error deleting Pokémon:', error);
    }
}
deleteBtn.addEventListener('click', () => {
    //Kontrollera om pokemon jag vill ta bort har samma id som pokemon i listan
    getPokemonJohto().then((johtoPokemons) => {
        if (johtoPokemons.some((pokemon) => pokemon.id === newPokemon.id)) {
            deletePokemonJohto();
        }
        else {
            console.log('Denna pokemon finns inte i listan.');
        }
    });
});
//------------------------------------------------------------------------------
//Display Johto Pokemon på sidan
let containerPokemon = document.querySelector('.pokemon-container');
let pokemonPerPage = 12; //deklarera antal pokemon ska visas.
let currentPage = 1; //deklarera aktuell sidan
let allJohtoPokemon = [];
async function displayJohtoPokemon() {
    allJohtoPokemon = await getPokemonJohto();
    // Start index
    let start = (currentPage - 1) * pokemonPerPage;
    // Sista index
    let end = currentPage * pokemonPerPage;
    //Visa endast 12 pokemon på sidan
    let pokemonToDisplay = allJohtoPokemon.slice(start, end);
    //Vi har en lista av alla pokemon objekter. Loopa den listan för att ta ut
    //varje pokemon och dess egenskaper
    pokemonToDisplay.forEach((pokemon) => {
        let imgSrc = pokemon.image;
        let pokemonName = pokemon.name;
        let order = pokemon.order;
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
}
displayJohtoPokemon();
import { changeStyle, setupCheckboxListener } from './module/styleMode.js';
changeStyle();
setupCheckboxListener();
//# sourceMappingURL=johto.js.map