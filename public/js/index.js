const input = document.getElementById('input')
const button = document.getElementById('button')


const responseAPI = async (e) => {
    e.preventDefault()


    const res = await fetch('http://localhost:3000/message', {
        method: 'GET'
    })

    console.log(res);

    const data = await res.json();
    
    input.value = data.message;
}

button.addEventListener('click', responseAPI)


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
