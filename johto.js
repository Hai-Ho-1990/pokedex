// GET request
let getPokemonJohto = fetch('http://localhost:3000/johto')
    .then((response) => response.json())
    .then((result) => {
        console.log('Fetched Pokémon:', result);
        return result;
    })
    .catch((error) => console.error('GET request failed:', error));

// Execute the GET request and log result
getPokemonJohto.then((data) => console.log(data));

// POST request
fetch('http://localhost:3000/johto', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'Bayleef',
        order: 153,
        image: 'https://archives.bulbagarden.net/media/upload/8/85/0153Bayleef.png',
        types: [
            {
                type: {
                    name: 'grass'
                }
            }
        ],
        weight: 640,
        height: 90,
        stats: [
            { name: 'Hp', base_stat: 60 },
            { name: 'Atk', base_stat: 62 },
            { name: 'Defense', base_stat: 80 },
            { name: 'SpAtk', base_stat: 63 },
            { name: 'SpDef', base_stat: 80 },
            { name: 'Speed', base_stat: 60 }
        ]
    })
})
    .then((response) => response.json())
    .then((data) => console.log('Added Pokémon:', data))
    .catch((error) => console.error('POST request failed:', error));
