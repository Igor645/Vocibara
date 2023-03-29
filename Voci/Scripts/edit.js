var listId = sessionStorage.getItem("selectedList");
var words = [];

document.querySelector(".vocInput").style.setProperty('--placeholder-color', 'gray');
document.querySelector(".listNameInput").style.setProperty('--placeholder-color', 'gray');

fetch(`http://localhost:3000/api/voci/${listId}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
    })
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
     })
    .then(data => {
        document.querySelector(".listNameInput").value = data.name;

        for(i = 0; i < data.languageOne.length; i++)
        {
            words.push(`${data.languageOne[i]}|${data.languageTwo[i]}`);
        }

        words.forEach(word => {
            document.querySelector(".vocInput").innerHTML += word + "\n";
        })
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

document.querySelector(".submit").addEventListener("click", (event) => {
    let textfields = [document.querySelector(".vocInput"), document.querySelector(".listNameInput")];
    if(checkForInput(textfields)){
        getText(textfields)
    }
})

function getText(fields){
    const name = document.querySelector(".listNameInput").value;
    const rows = fields[0].value.split('\n');
    const languageOne = [];
    const languageTwo = [];
    var parts = [];

    rows.forEach(row => {
        parts = row.split('|');
        if(parts.length < 2){
            parts.push("");
        }
        if(parts[0].trim() !== "" && parts[1].trim() !== ""){
            languageOne.push(parts[0]);
            languageTwo.push(parts[1]);
        }
        console.log(languageOne)
    });

    const updatedData = {
        name: name,
        languageOne: languageOne,
        languageTwo: languageTwo,
        id: parseInt(listId)
    };
    console.log(updatedData)
    
    if(languageOne.length !== 0|| languageTwo.length !== 0)
    {
    fetch(`http://localhost:3000/api/voci/${listId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
        })
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        })
        .then(data => console.log(data))
        .catch(error => console.error(error));
            renderHome();
        }
    }

function checkForInput(fields){
    let ifInput = true;
    fields.forEach(field => {
        if(field.value === "" || field.value.trim() === ""){
            field.setAttribute("placeholder", "You have to type something");
            field.style.setProperty('--placeholder-color', 'red');
            ifInput = false;
        }
    })
    return ifInput;
}