









// const btc = document.getElementById('btc-price')
// const eth = document.getElementById('eth-price');

// let btcws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
// let lastBTCPrice = null;

// btcws.onmessage = (event) =>{
//     stockObject = JSON.parse(event.data);
//     let price = parseFloat(stockObject.p);

//     btc.innerHTML = price;
//     btc.style.color = !lastBTCPrice || lastBTCPrice === price ? 'black' : price > lastBTCPrice ? 'green' : 'red';

//     lastBTCPrice = price;

// }

// let ethws = new WebSocket('wss://stream.binance.com:9443/ws/ethusdt@trade');
// let lastETHPrice = null;

// ethws.onmessage = (event) => {
//     let stockObject = JSON.parse(event.data);
//     let price = parseFloat(stockObject.p);

//     eth.innerHTML = price;
//     eth.style.color = !lastETHPrice || lastETHPrice === price ? 'black' : price > lastETHPrice ? 'green' : 'red';

//     lastETHPrice = price;
// };





// const input2 = document.getElementById('outside')
// const button2 = document.getElementById('outsideButton')

// const responseAPI2 = async (e) => {
//     e.preventDefault();
//     const res = await fetch('https://jsonplaceholder.typicode.com/todos/1', {
//         method: 'GET'
//     })

//     console.log(res);

//     const data = await res.json();
    
//     input2.value = data.title;


// }

// button2.addEventListener('click', responseAPI2)
