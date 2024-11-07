async function getPokemonStats() {
    let pokemonId = new URLSearchParams(window.location.search).get('id');
    //Byta pokemonId från string till number så att kunna använda senare i back och forward
    let pokemonIdNumber = parseInt(pokemonId);

    let response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
    );

    let pokemon = await response.json();
    console.log(pokemon.stats);

    //Extrahera Pokemon stats
    let stats = pokemon.stats.map((stat) => stat.base_stat);
    console.log(stats);

    let pokemonHp = stats[0];
    let pokemonAtk = stats[1];
    let pokemonDef = stats[2];
    let pokemonSpAtk = stats[3];
    let pokemonSpDef = stats[4];
    let pokemonSpeed = stats[5];
    console.log(pokemonHp);

    let pokemonStats = document.getElementById('myChart');
    const data = {
        labels: ['HP', 'Atk', 'Def', 'Spd', 'SpDef', 'SpAtk'],
        datasets: [
            {
                label: 'Stats',
                data: [
                    pokemonHp,
                    pokemonAtk,
                    pokemonDef,
                    pokemonSpeed,
                    pokemonSpDef,
                    pokemonSpAtk
                ],
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)'
            }
        ]
    };

    const config = {
        type: 'radar',
        data: data,
        options: {
            responsive: true, // Gör diagrammet responsivt
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Döljer legenden
                }
            },
            elements: {
                line: {
                    borderWidth: 3
                }
            },
            scales: {
                r: {
                    angleLines: {
                        display: false
                    },
                    suggestedMin: 20,
                    suggestedMax: 150,
                    pointLabels: {
                        font: {
                            size: 18
                        }
                    }
                }
            }
        }
    };

    new Chart(pokemonStats, config);
}
getPokemonStats();
