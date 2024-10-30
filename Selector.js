// JavaScript source code

var levelTable = document.getElementById("levelTable");

const backgroundMusic = document.getElementById('backgroundMusic');

const styleSheet = document.styleSheets[0];

const mathSymbols = document.querySelectorAll('.math-symbol');

var hoverSounds = [];

var playerImage = document.getElementById("player");

var float_rotation = 50;

for (var i = 1; i< 26; i++){
    var sound = document.createElement("audio");
    sound.setAttribute("src", "Sounds/Hover.mp3");
    hoverSounds.push(sound);
}

backgroundMusic.volume = 0.5;
backgroundMusic.loop = true;
backgroundMusic.load();

playerImage.style.transformOrigin = "center 25%";

if (typeof levelsBeaten !== 'undefined') {
    console.log("yeah", levelsBeaten);
}
console.log(typeof levelsBeaten, "nope");

for (var i = 0; i < 5; i++) {
    var tr = document.createElement("tr");
    for (var j = 0; j < 5; j++) {
        var td = document.createElement("td");
        td.style = 'border: 5px solid #ff6a00; font-size: 36px; text-align: center; padding: 20px; color: #ffeb3b; cursor: pointer;';
        
        let index = (i * 5 + j + 1);
        td.innerHTML = index;

        // Animate cell on click and redirect
        td.onclick = function () {
            this.style.backgroundColor = '#ff6a00';
            this.style.color = '#2b2b2b';
            window.location.href = `Levels/Level.html?index=${this.innerHTML}`;
        };
        td.onmouseover = function () {
            hoverSounds[parseInt(this.innerHTML) - 1 ].play();
        };
        tr.appendChild(td);
    }
    levelTable.appendChild(tr);
}


// Play button click event
document.getElementById('playButton').addEventListener('click', () => {
    document.getElementById('gameMenu').style.display = 'none'; // Hide the menu
    document.getElementById('levelSelector').style.display = 'flex'; // Show the level selector
    document.body.style.backgroundImage = "url('Images/Space.jpg')";
    backgroundMusic.play();

    setTimeout(() => {
        var float_interval = setInterval(FloatLeft, 1);
    }, 60000);
});


function FloatLeft(){
    float_rotation += 0.1;

    playerImage.style.left = parseFloat(player.style.left) + 0.1 + 'px';
    playerImage.style.transform = 'rotate(' + float_rotation + 'deg)';

    if (parseFloat(player.style.left) == 1225){
        var sound = document.createElement("audio");

        sound.setAttribute("src", "Sounds/AmongUsType.mp3");
        sound.play();

        // Show the first message and type out the text
        typeText("imposterText", "Garry Graph was not The Imposter.", 50);
        //1 Easter Egg remains.
        setTimeout(() => {fadeText("easterEggText", "1 Easter Egg remains.")
        }, 2500);
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
            if (callback) callback(); // Call the next function if provided
        }
    }, delay);
}

function fadeText(elementId, callback) {
    const element = document.getElementById(elementId);
    element.style.opacity = 1; // Make the text visible

    // Delay to wait for the bounce animation to finish, then trigger the callback
    setTimeout(() => {
        if (callback) callback();
    }, 1000); // Duration of the bounce animation
}