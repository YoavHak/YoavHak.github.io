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

if (levelsBeaten){
    console.log(levelsBeaten, "exists")
}
console.log(levelsBeaten, "nope")

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
}