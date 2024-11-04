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
    } catch (error) {
        console.error('Error fetching Pokémon:', error);
    }
}

// POST pokemon
/* async function postPokemonJohto(newPokemon) {
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
    } catch (error) {
        console.error('Error posting Pokémon:', error);
    }
}

// Kontrollera och lägg till Pokémon om den inte redan finns
getPokemonJohto().then((johtoPokemons) => {
    // vi får tillbaka en listan av pokemon
    if (!johtoPokemons.some((pokemon) => pokemon.id === newPokemon.id)) {
        postPokemonJohto(newPokemon);
    } else {
        console.log('pokemon finns redan i listan');
    }
}); */

// DELETE en pokemon
async function deletePokemonJohto() {
    try {
        await fetch('http://localhost:3000/johto/3', {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Error deleting Pokémon:', error);
    }
}

//Kontrollera om pokemon jag vill ta bort har samma id som pokemon i listan
getPokemonJohto().then((johtoPokemons) => {
    if (johtoPokemons.some((pokemon) => pokemon.id === newPokemon.id)) {
        deletePokemonJohto();
    } else {
        console.log('Denna pokemon finns inte i listan.');
    }
});
