// JavaScript source code

var selectorDiv = document.getElementById("levelSelector");

var levelTable = document.getElementById("levelTable");

var progressViewer = document.getElementById("progressViewer");

var levelsProgressPercentage = document.getElementById("levelsProgressPercentage");

var eggsProgressPercentage = document.getElementById("eggsProgressPercentage");

var totalProgressPercentage = document.getElementById("totalProgressPercentage");

const backgroundMusic = document.getElementById('backgroundMusic');

const styleSheet = document.styleSheets[0];

const mathSymbols = document.querySelectorAll('.math-symbol');

var hoverSounds = [];

var playerImage = document.getElementById("player");

var float_rotation = 50;

var float_interval;

var levelsBeaten = parseInt(localStorage.getItem('levelsBeaten'));

var LEVEL_NUM = 25;

var MAX_EGGS = 4;

const muteButton = document.getElementById('muteButton');
const muteIcon = document.getElementById('muteIcon');
let isMuted = false;

muteButton.addEventListener('click', () => {
    changeMuteState();
});

if (levelsBeaten) {
    levelsBeaten = parseInt(levelsBeaten);
}
else {
    levelsBeaten = 0;
    localStorage.setItem("levelsBeaten", levelsBeaten);
}

if (levelsBeaten > 0){
    
    changeMuteState();
    changeScene();
}

var secretsFound = localStorage.getItem('secretsFound');

if (secretsFound) {
    secretsFound = JSON.parse(secretsFound);
}
else{
    secretsFound = [];
}
localStorage.setItem('secretsFound', JSON.stringify(secretsFound));

localStorage.setItem("maxEggs", MAX_EGGS);





for (var i = 1; i< 26; i++){
    var sound = document.createElement("audio");
    sound.setAttribute("src", "Sounds/Hover.mp3");
    sound.volume = 0.5;
    hoverSounds.push(sound);
}

backgroundMusic.volume = 0.5;
backgroundMusic.loop = true;
backgroundMusic.load();

playerImage.style.transformOrigin = "center 25%";

document.getElementById("resetButton").onclick = function() {
    
    localStorage.setItem('levelsBeaten', 0);
    localStorage.setItem('secretsFound', JSON.stringify([]));
    location.reload();
};

document.getElementById("progressButton").onclick = function() {
    selectorDiv.classList.add("disabled");
    progressViewer.style.visibility = "visible";

    levelsBeaten = parseInt(localStorage.getItem('levelsBeaten'));
    secretsFound = JSON.parse(localStorage.getItem('secretsFound'))

    var temp_LPP = levelsBeaten / LEVEL_NUM;
    var temp_EPP = secretsFound.length / MAX_EGGS;

    levelsProgressPercentage.innerHTML = Math.round(100 * temp_LPP) + "%";
    eggsProgressPercentage.innerHTML = Math.round(100 * temp_EPP) + "%";
    totalProgressPercentage.innerHTML = Math.round(100 * (levelsBeaten + secretsFound.length) / (LEVEL_NUM + MAX_EGGS)) + "%";

    document.getElementById("levelsProgressBar").style.width = levelsProgressPercentage.innerHTML;
    document.getElementById("eggsProgressBar").style.width = eggsProgressPercentage.innerHTML;
    document.getElementById("totalProgressBar").style.width = totalProgressPercentage.innerHTML;

};

document.getElementById("progressExitButton").onclick = function() {
    selectorDiv.classList.remove("disabled");
    progressViewer.style.visibility = "hidden";
};



for (var i = 0; i < 5; i++) {
    var tr = document.createElement("tr");
    for (var j = 0; j < 5; j++) {
        var td = document.createElement("td");
        

        let index = (i * 5 + j + 1);
        td.innerHTML = index;

        
        td.style.backgroundSize = "cover";
        td.style.backgroundPosition = "center";
        if (td.innerHTML > levelsBeaten + 1){
            td.style.opacity = "0.5";
        }

        // Animate cell on click and redirect
        td.onclick = function () {
            if (this.innerHTML <= levelsBeaten + 1) {
                this.style.backgroundColor = '#ff6a00';
                this.style.color = '#2b2b2b';
                clearInterval(float_interval);
                window.location.href = `Levels/Level.html?index=${this.innerHTML}`;
            }
            else if (!isMuted) {
                
                var sound = document.createElement("audio");
                sound.setAttribute("src", "Sounds/Locked.mp3");
                sound.volume = 0.1;
                sound.play();
            }
        };
        td.onmouseover = function () {
            if (!isMuted){

                hoverSounds[parseInt(this.innerHTML) - 1 ].play();
            }
        };
        tr.appendChild(td);
    }
    levelTable.appendChild(tr);
}


// Play button click event
document.getElementById('playButton').addEventListener('click', () => {
    changeScene();
    backgroundMusic.play();
});

function changeScene() {
    document.getElementById('gameMenu').style.display = 'none'; // Hide the menu
    document.getElementById('levelSelector').style.display = 'flex'; // Show the level selector
    setTimeout(() => {
        float_interval = setInterval(FloatLeft, 1);
    }, 60000);
}

function FloatLeft(){
    float_rotation += 0.1;

    playerImage.style.left = parseFloat(player.style.left) + 0.1 + 'px';
    playerImage.style.transform = 'rotate(' + float_rotation + 'deg)';

    if (parseFloat(player.style.left) == 1225){
        if (!isMuted){
            var sound = document.createElement("audio");
    
            sound.setAttribute("src", "Sounds/AmongUsType.mp3");
            sound.play();
        }

        // Show the first message and type out the text
        typeText("imposterText", "Garry Graph was not The Imposter.", 42);


        setTimeout(() => {
            switch (MAX_EGGS - secretsFound.length) {
                case 0:
                    fadeText("easterEggText", "You have now found every Easter Egg.");
                    break;
                case 1:
                    fadeText("easterEggText", "1 Easter Egg remains.");
                    break;
                default:
                    fadeText("easterEggText", (MAX_EGGS - secretsFound.length) + " Easter Eggs remaining.");
              }
        }, 2500);

        secretsFound = JSON.parse(localStorage.getItem('secretsFound'));
        if (!secretsFound.includes("PATIENCE")){
            
            secretsFound.push("PATIENCE");
            localStorage.setItem('secretsFound', JSON.stringify(secretsFound));
        }
    }
}


function typeText(elementId, text, delay, callback) {
    const element = document.getElementById(elementId);
    element.style.opacity = 1; // Make the text visible
    element.textContent = ""; // Clear any previous content

    let index = 0;
    const interval = setInterval(() => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
        } else {
            clearInterval(interval);
        }
    }, delay);
}

function fadeText(elementId, text) {
    const element = document.getElementById(elementId);
    element.innerHTML = text;
    element.style.opacity = 1; // Make the text visible

}

function changeMuteState(){
    isMuted = !isMuted;
    if (isMuted) {
        backgroundMusic.muted = true;
        muteIcon.src = 'Images/sound-off.png'; // Image for muted state
    } else {
        backgroundMusic.muted = false;
        if (backgroundMusic.duration == 0 || backgroundMusic.paused){
            backgroundMusic.play();
        }
        muteIcon.src = 'Images/sound-on.png'; // Image for unmuted state
    }
}