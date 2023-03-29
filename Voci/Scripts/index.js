sessionStorage.setItem("selectedList", "");
let webContent = document.querySelector(".web-content");
var toRemoveScripts = [];

document.querySelector("#createButton").addEventListener("click", (event) => {
    event.preventDefault();
    toRemoveScripts = removeScripts(toRemoveScripts);
    router.navigate(routes.create.hash)
})

document.querySelector("#studyButton").addEventListener("click", (event) => {
    event.preventDefault();
    toRemoveScripts = removeScripts(toRemoveScripts);
    router.navigate(routes.lists.hash)
})

document.querySelector(".homeButton").addEventListener("click", (event) => {
    event.preventDefault();
    toRemoveScripts = removeScripts(toRemoveScripts);
    router.navigate(routes.home.hash)
})

let renderHome = () => {
    webContent.innerHTML = `
    <div class="buttonContainer">
    <div class="circleButton" id="studyButton">
        <img class="buttonIcon" src="images/Study.jpg"/>
    </div>
    <div class="buttonDetails">
        <div class="buttonTitle">Study</div>
        <div class="buttonText">Select one of your vocabulary lists and start studying.</div>
        <div class="source"><a href="https://www.freepik.com/free-vector/round-education-icons_1012548.htm#query=pictogram%20study&position=7&from_view=search&track=ais">Image by macrovector</a> on Freepik</div>
    </div>
</div>
<div class="buttonContainer">
    <div class="buttonDetails">
        <div class="buttonTitle">Create</div>
        <div class="buttonText">Create your own vocabulary list. </div>
        <div class="source"><a href="https://www.freepik.com/free-vector/round-education-icons_1012548.htm#query=pictogram%20study&position=7&from_view=search&track=ais">Image by macrovector</a> on Freepik</div>
    </div>
    <div class="circleButton" id="createButton">
        <img class="buttonIcon" src="images/Create.jpg"/>
    </div>
</div>
    `

    document.querySelector("#createButton").addEventListener("click", (event) => {
        event.preventDefault();
        toRemoveScripts = removeScripts(toRemoveScripts);
        router.navigate(routes.create.hash)
    })

    document.querySelector("#studyButton").addEventListener("click", (event) => {
        event.preventDefault();
        toRemoveScripts = removeScripts(toRemoveScripts);
        router.navigate(routes.lists.hash)
    })
}

let renderCreate = () => {
    webContent.innerHTML = `    
    <div class="indicator">Create a vocabulary:</div>
    <div class="createContainer">
    <div class="inputDemand">Name your list:</div>
    <input class="listNameInput" type="text" maxlength="20" placeholder="Input any name for your list"/>

    <div class="inputDemand">Vocabulary</div>
    <textarea class="vocInput" rows="20" cols="50" placeholder="Write down all your words this way:
Apple|Apfel
Tree|Baum
to be happy|glücklich sein"></textarea>
    <div class="submit">Submit</div>
</div>
<script src="scripts/create.js"></script>
`

    createScript('./Scripts/create.js')
}

let renderLists = () => {
    webContent.innerHTML = `<div class="indicator">Your vocabularies:</div>
    <div class="vocabularyContainer"></div>`

    displayLists();
}

let renderStudy = () => {
    webContent.innerHTML = `
    <div class="solution hidden">
    <div class="solutionTitle">Solution</div>
    <div class="solutionText">Apple</div>
    </div>
    <div class="indicator">Study</div>
    <audio id="quizAudio" loop>
        <source src="${chooseMusic()}" type="audio/mpeg">
    </audio>
    <div class="studyButtons">
    <div class="invertButton"><img class="invertIcon" src="images/invert.svg"/></div>
    <div class="muteButton">
        <img class="invertIcon" src="images/soundOn.svg"/>
    </div>
    </div>
    <div class="card"><div class="prompt"></div></div>
    <input type="text" id="vocAnswer"/>
    <div class="source">Music by <a href="https://pixabay.com/de/users/michitheonlyone-5962636/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=16574">michitheonlyone</a> from <a href="https://pixabay.com/music//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=16574">Pixabay</a></div>`;
    createScript("./Scripts/study.js");
}

let renderEdit = () => {
    webContent.innerHTML = `    
    <div class="indicator">Edit your vocabulary:</div>
    <div class="createContainer">
    <div class="inputDemand">Name your list:</div>
    <input class="listNameInput" type="text" maxlength="20" placeholder="Input any name for your list"/>

    <div class="inputDemand">Vocabulary</div>
    <textarea class="vocInput" rows="20" cols="50" placeholder="Write down all your words this way:
Apple|Apfel
Tree|Baum
to be happy|glücklich sein"></textarea>
    <div class="submit">Submit</div>
</div>
<script src="scripts/create.js"></script>
`

    createScript('./Scripts/edit.js')
}

let renderNotFound = () => {
    webContent.innerHTML = "Couldn't find the page you were looking for"
}

function createScript(path){
    var script = document.createElement('script');
    script.src = path;
    document.head.appendChild(script);
    toRemoveScripts.push(script);
}

function removeScripts(scripts){
    scripts.forEach(script => {
        script.remove();
    });
    return [];
}

async function  displayLists(){
    let container = webContent.querySelector(".vocabularyContainer");
    container.innerHTML = "";
    await fetch('http://localhost:3000/api/voci')
        .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
     })
    .then(data => {
        data.forEach(d => {
            let examples = [];
            for(i = 0; i < 3; i++){
            if(d.languageOne[i] !== undefined || d.languageTwo[i] !== undefined){
                examples.push(`<div class="word">${d.languageOne[i]}</div><div class="word">${d.languageTwo[i]}</div>`)
            }
            else{
                examples.push("")                
            }
        }
        container.innerHTML += `<div class="list" data-value="${d.id}">
        <div class="listName">${d.name}</div>
        <div class="vocExample">
            <div class="example">${examples[0]}</div>
            <div class="example">${examples[1]}</div>
            <div class="example">${examples[2]}</div>
            <div class="example"><div class="word">...</div><div>...</div></div>
        </div>
        <div class="listButtons">
            <div class="editButton">Edit</div>
            <div class="deleteButton">Delete</div>
        </div>
        </div>
        `;
        })
        })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

    document.querySelectorAll(".list").forEach(list => {
        list.addEventListener("click", (event) => {
            event.preventDefault();
            toRemoveScripts = removeScripts(toRemoveScripts);
            sessionStorage.setItem("selectedList", list.dataset.value);
            router.navigate(routes.study.hash);
        })
    })


    document.querySelectorAll(".deleteButton").forEach(button => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            fetch(`http://localhost:3000/api/voci/${button.parentElement.parentElement.dataset.value}`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                displayLists();
            })
            .catch(error => console.error(error));

        })
    })

    document.querySelectorAll(".editButton").forEach(button => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            sessionStorage.setItem("selectedList", button.parentElement.parentElement.dataset.value);
            router.navigate(routes.edit.hash);
        })
    })
}

function chooseMusic(){
    let music;
    let randomNumber = Math.random();
    if (randomNumber < 0.5) {
        music = './music/quiz.mp3';
    } else {
        music = './music/alternateQuiz.mp3';
    }

    return music;
}

