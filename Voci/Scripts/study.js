var listId = sessionStorage.getItem("selectedList");
var textField = document.getElementById("vocAnswer");
var invertButton = document.querySelector(".invertButton");
var alreadyAsked = [];
var failed = [];
var failedIndices = [];
var randomIndex;
var card = document.querySelector(".card");
var inverted = false;
var muteButton = document.querySelector(".muteButton");
var audio = document.getElementById("quizAudio");
var soloutionPopUp = document.querySelector(".solution");
var wordAmount = 0;

audio.play();
renderQuestion();

muteButton.addEventListener("click", (event) => {
    event.preventDefault();
    if(muteButton.children[0].src.endsWith("images/soundOff.svg"))
    {
        muteButton.children[0].src = "images/soundOn.svg";
        audio.play();
    }
    else{
        muteButton.children[0].src = "images/soundOff.svg"
        audio.pause();
    }
})

invertButton.addEventListener("animationend", (event) => {
    invertButton.classList.remove(event.animationName);
    invertButton.style.animationName = "";
})

audio.addEventListener("ended", function() {
  this.currentTime = 0;
  this.play();
});
audio.play();


card.addEventListener('animationend', (event) => {
    card.classList.remove(event.animationName);
    if(alreadyAsked.length !== wordAmount && (event.animationName === "swipe-left" || event.animationName === "swipe-right")){
        card.classList.add("hidden")
        setTimeout(() =>  {
            card.classList.remove("hidden")
            playAnimation(card, "pop-up")
        }, 200)
        renderQuestion();
    }
    else if(event.animationName === "swipe-left" || event.animationName === "swipe-right"){
        renderResults();
    }
    card.style.animationName = "";
})

soloutionPopUp.addEventListener('animationend', (event) => {
    if(event.animationName === "slide-in"){
        setTimeout(() => {
            playAnimation(soloutionPopUp, "slide-out");
        }, 1500)
    }
    else if(event.animationName === "slide-out"){
        soloutionPopUp.classList.add("hidden");
    }
})

invertButton.addEventListener("click", (event) => {
    event.preventDefault();
    playAnimation(invertButton, "inversion")
    if(inverted === false){
        inverted = true;
    }
    else{
        inverted = false;
    }
    alreadyAsked = [];
    failed = [];
    failedIndices = [];
    renderQuestion();
})

textField.addEventListener("keypress",
function(event) {
    if (event.key === "Enter"){
       event.preventDefault();
      submit(textField.value);
   }
});

function renderQuestion(){
    let prompt = document.querySelector(".prompt");
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
    .then((data) => {
        wordAmount = data.languageOne.length;
        do{
            randomIndex = Math.floor(Math.random() * wordAmount);
        }while(alreadyAsked.includes(randomIndex))
        if(inverted)
        {
            prompt.innerHTML = `<div class="promptText">${data.languageTwo[randomIndex]}</div>`
        }
        else{
            prompt.innerHTML = `<div class="promptText">${data.languageOne[randomIndex]}</div>`
        }
    })
    .catch(error => console.error(error));

}

function submit(input){
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
        .then((data) => {
            if((inverted && data.languageOne[randomIndex] === input) || (!inverted && data.languageTwo[randomIndex] === input)){
                disableTextfield(textField, 1000);
                textField.value = "";
                alreadyAsked.push(randomIndex);
                playAnimation(card, "swipe-left");
            }
            else{
                disableTextfield(textField, 2000);
                if(!failedIndices.includes(randomIndex))
                {
                    failed.push(`${data.languageOne[randomIndex]}|${data.languageTwo[randomIndex]}`);
                    failedIndices.push(randomIndex);
                }
                textField.value = "";
                if(!inverted){
                    soloutionPopUp.querySelector(".solutionText").innerHTML = `${data.languageTwo[randomIndex]}`;
                }
                else{
                    soloutionPopUp.querySelector(".solutionText").innerHTML = `${data.languageOne[randomIndex]}`;
                }
                soloutionPopUp.classList.remove("hidden");
                playAnimation(soloutionPopUp, "slide-in");
                playAnimation(card, "swipe-right")
            }
        })
        .catch(error => console.error(error));
}

function disableTextfield(textfield, time){
    textfield.disabled = true;
    setTimeout(function() {
      textField.disabled = false;
      textField.focus();
    }, time);
}

function playAnimation(element, animationName){
    element.classList.remove(animationName);
    element.classList.add(animationName);
    element.style.animationName = animationName;
}

function renderResults(){
    var correct = wordAmount - failed.length;
    webContent.innerHTML = `<div class="resultContainer">
    <div class="resultTitle">Results</div>
    <div class="resultDetails">
    <div class="pointContainer">
    <div>Correct on first try:</div>
    <div>${correct}/${wordAmount}</div>
    </div>
    <div class="description">Those are words you found tricky:</div>
    <textarea class="trickyWords" cols="50"></textarea>
    </div>
    </div>`
    var trickyWords = document.querySelector(".trickyWords");
    if(failed.length !== 0){
        failed.forEach(fail => {
            trickyWords.innerHTML += fail + "\n";
        })
    }
    else{
        trickyWords.innerHTML = "None, congratulations!"
    }
}
