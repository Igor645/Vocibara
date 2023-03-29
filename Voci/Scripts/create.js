document.querySelector(".vocInput").style.setProperty('--placeholder-color', 'gray');
document.querySelector(".listNameInput").style.setProperty('--placeholder-color', 'gray');

document.querySelector(".submit").addEventListener("click", (event) => {
    let textfields = [document.querySelector(".vocInput"), document.querySelector(".listNameInput")];
    if(checkForInput(textfields)){
        getText(textfields)
    }
})

function getText(fields){
    const rows = fields[0].value.split('\n');
    const languageOne = [];
    const languageTwo = [];
    var parts = [];
    
    rows.forEach(row => {
        parts = row.split('|');
        if(parts.length < 2){
            parts.push("");
        }
        if(parts[0].trim() != "" && parts[1].trim() != ""){
            languageOne.push(parts[0]);
            languageTwo.push(parts[1]);
        }
    });

    console.log(parts)
    
    if(languageOne.length !== 0|| languageTwo.length !== 0)
    {
    fetch('http://localhost:3000/api/voci/count')
    .then(response => response.json())
    .then(count => {
        const newid = count + 1;
        fetch('http://localhost:3000/api/voci', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: fields[1].value,
                languageOne: languageOne,
                languageTwo: languageTwo,
                id: newid
            })
        })
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => console.log(data))
        .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
    }
    renderHome();
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