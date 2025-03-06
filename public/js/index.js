const input = document.getElementById('input')
const button = document.getElementById('button')


// const responseAPI = async (e) => {
//     e.preventDefault()


//     const res = await fetch('http://localhost:3000/message', {
//         method: 'GET'
//     })

//     console.log(res);

//     const data = await res.json();
    
//     input.value = data.message;
// }

// button.addEventListener('click', responseAPI)


const btc = document.getElementById('btc-price')
const eth = document.getElementById('eth-price');

let btcws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
let lastBTCPrice = null;

btcws.onmessage = (event) =>{
    stockObject = JSON.parse(event.data);
    let price = parseFloat(stockObject.p);

    btc.innerHTML = price;
    btc.style.color = !lastBTCPrice || lastBTCPrice === price ? 'black' : price > lastBTCPrice ? 'green' : 'red';

    lastBTCPrice = price;

}

let ethws = new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@trade');
let lastETHPrice = null;

ethws.onmessage = (event) => {
    let stockObject = JSON.parse(event.data);
    let price = parseFloat(stockObject.p);

    eth.innerHTML = price;
    eth.style.color = !lastETHPrice || lastETHPrice === price ? 'black' : price > lastETHPrice ? 'green' : 'red';

    lastETHPrice = price;
};






const APIController = (function() {

    const clientID = ''
    const clientSecret = ''

    const _getToken = async () => {
        const result = await fetch('https://api.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientID + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        })

        const data = await result.json();
        return data.access_token;
    }


    const _getGenres = async (token) => {

        const result = await fetch('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + token}
        });
    
        const data = await result.json();
        return data.categories.items;
    
    }
    
    const _getPlaylistByGenre = async (token, genreId) => {
    
        const limit = 10;
    
        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + token}
        });
    
        const data = await result.json();
        return data.playlists.items;
    
    }
    
    
    const _getTracks = async (token, tracksEndpoint) => {
    
        const limit = 10;
    
        const result = await fetch(`${tracksEndpoint}?limit=${limit}`, {
            method:'GET',
            headers: {'Authorization': 'Bearer ' + token}
        });
    
        const data = await result.json();
        return data.items;
    }

    const _getTrack = async (token, trackEndpoint) => {
    
        const limit = 10;
    
        const result = await fetch(`${trackEndpoint}?limit=${limit}`, {
            method:'GET',
            headers: {'Authorization': 'Bearer ' + token}
        });
    
        const data = await result.json();
        return data.items;
    }

    return {
        _getToken(){
            return _getToken();
        },
        _getGenres(token){
            return _getGenres(token);
        },
        _getPlaylistByGenre(token, genreId){
            return _getPlaylistByGenre(token, genreId);
        },
        _getTracks(token, tracksEndpoint){
            return _getTracks(token, tracksEndpoint);
        },
        _getTrack(token, trackEndpoint){
            return _getTrack(token, trackEndpoint);
        }
    }



})();





const input2 = document.getElementById('outside')
const button2 = document.getElementById('outsideButton')

const responseAPI2 = async (e) => {
    e.preventDefault();
    const res = await fetch('https://jsonplaceholder.typicode.com/todos/1', {
        method: 'GET'
    })

    console.log(res);

    const data = await res.json();
    
    input2.value = data.title;


}

button2.addEventListener('click', responseAPI2)
