// POST request

async function getPokemon() {
    try {
        const response = await fetch('http://localhost:3000/johto');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('GET request succeeded:', data);
    } catch (error) {
        console.error('GET request failed:', error);
    }
}

getPokemon();
