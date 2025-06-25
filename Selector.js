

(function() {

    // ✅ BACKEND URL hosted on Replit
    const BACKEND_URL = "https://5484eccc-32b4-46d1-8a0b-68d8a9073837-00-1waszd38yd3rf.sisko.replit.dev:3001";

    // ✅ Connect to WebSockete(/^http/, 'ws')}ws`);
    const ws = new WebSocket(`${BACKEND_URL.replace(/^http(s?)/, 'ws$1')}/ws`);



    ws.onopen = () => {
        console.log("✅ WebSocket connected to backend");
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("📩 Message from server:", data);
        // TODO: update game state with `data`
    };

    ws.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
    };

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Send message to other clients via WebSocket
    function sendToServer(data) {
        ws.send(JSON.stringify(data));
    }

    // ✅ Save score via HTTP POST
    function saveHighScore(playerName, score) {
        fetch(`${BACKEND_URL}/api/save_score`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({ player: playerName, score: score })
        })
        .then(res => res.json())
        .then(response => {
            console.log("💾 Score saved:", response);
            location.reload();
        })
        .catch(err => {
            console.error("❌ Failed to save score:", err);
        });
    }


    async function fetchHighScores() {
        return fetch(`${BACKEND_URL}/api/get_scores`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Network response was not ok: ${res.statusText}`);
                }
                return res.json();
            })
            .then(data => {
                // Assuming your backend returns an object like { scores: [...] }
                highScores = data.scores || [];
                // console.log("High scores loaded:", highScores);
                return highScores; // Return the list
            })
            .catch(err => {
                console.error("Failed to fetch high scores:", err);
                throw err; // Re-throw if you want to handle it later
            });
    }





    var selectorDiv = document.getElementById("levelSelector");

    var levelTable = document.getElementById("levelTable");

    var progressViewer = document.getElementById("progressViewer");

    var confirmReset = document.getElementById("confirmReset");

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

    var LEVEL_NUM = 15;

    localStorage.setItem("LEVEL_NUM", LEVEL_NUM);

    var levelsBeaten = parseInt(localStorage.getItem('levelsBeaten'));

    var MAX_EGGS = 4;

    var AI_MODE = localStorage.getItem('AI_mode');

    let soundIsMuted = false;

    let musicIsMuted = false;

    var imposterTextAppeared = false;

    // Select buttons and modal elements
    const submitButton = document.getElementById('submitButton');
    const nameModal = document.getElementById('nameModal');
    const playerNameInput = document.getElementById('playerNameInput');
    const submitNameBtn = document.getElementById('submitName');
    const cancelNameBtn = document.getElementById('cancelName');

    // Show modal on button click
    submitButton.onclick = () => {
        selectorDiv.classList.add("disabled");
        nameModal.style.display = 'block';
        playerNameInput.value = ''; // Clear previous input
        playerNameInput.focus();
    };

    // Handle submit
    submitNameBtn.onclick = () => {
        const name = playerNameInput.value.trim();
        if (name) {
            if (name.length < 4) {
                alert('Name too short!');
            }
            else if (name.length > 18) {
                alert('Name too long!');
            }
            else {
                selectorDiv.classList.remove("disabled");
                // Call your saveHighScore function or similar
                // For example, you can use current progress info:
                const levelsBeaten = parseInt(localStorage.getItem('levelsBeaten')) || 0;
                const secretsFound = JSON.parse(localStorage.getItem('secretsFound')) || [];
                const totalScore = Math.floor(100 * (levelsBeaten + secretsFound.length) / (LEVEL_NUM + MAX_EGGS));
                saveHighScore(name, totalScore);
                
                // alert('High score submitted!');
                nameModal.style.display = 'none';
            }
        }
        else {
            alert('Please enter a name.');
        }
    };

    // Handle cancel
    cancelNameBtn.onclick = () => {
        selectorDiv.classList.remove("disabled");
        nameModal.style.display = 'none';
    };




    const muteSoundsButton = document.getElementById('muteSoundsButton');
    const muteSoundsIcon = document.getElementById('muteSoundsIcon');

    muteSoundsButton.addEventListener('click', () => {
        changeMuteSoundsState();
    });

    const muteMusicButton = document.getElementById('muteMusicButton');
    const muteMusicIcon = document.getElementById('muteMusicIcon');

    muteMusicButton.addEventListener('click', () => {
        changeMuteMusicState();
    });

    const AIModeButton = document.getElementById('AIModeButton');
    const AIModeIcon = document.getElementById('AIModeIcon');

    AIModeButton.addEventListener('click', () => {
        change_AI_Mode_State();
    });

    var comingSoonText = document.getElementById("comingSoonText");
    comingSoonText.innerHTML = "LEVEL " + (LEVEL_NUM + 1) + " COMING SOON...";


    if (!levelsBeaten) {
        levelsBeaten = 0;
        localStorage.setItem("levelsBeaten", levelsBeaten);
    }

    if (AI_MODE) {
        AI_MODE = JSON.parse(AI_MODE);
        if (AI_MODE) {
            AIModeIcon.src = 'Images/robot.png';
        }
        else {
            AIModeIcon.src = 'Images/player-resized.png';
        }
    }
    else {
        AI_MODE = false;
        localStorage.setItem('AI_mode', JSON.stringify(AI_MODE));
    }

    if (levelsBeaten > 0) {

        changeMuteSoundsState();
        changeMuteMusicState();
        changeScene();

        if (levelsBeaten > LEVEL_NUM) {
            levelsBeaten = 8;

            localStorage.setItem("levelsBeaten", levelsBeaten);
        }
    }


    var secretsFound = localStorage.getItem('secretsFound');

    if (secretsFound) {
        secretsFound = JSON.parse(secretsFound);
    }
    else {
        secretsFound = [];
    }
    localStorage.setItem('secretsFound', JSON.stringify(secretsFound));

    localStorage.setItem("maxEggs", MAX_EGGS);







    for (var i = 1; i < 26; i++) {
        var sound = document.createElement("audio");
        sound.setAttribute("src", "Sounds/Hover.mp3");
        sound.volume = 0.5;
        hoverSounds.push(sound);
    }

    backgroundMusic.volume = 0.5;
    backgroundMusic.loop = true;
    backgroundMusic.load();

    playerImage.style.transformOrigin = "center 25%";

    document.getElementById("resetButton").onclick = function () {
        selectorDiv.classList.add("disabled");
        confirmReset.style.visibility = "visible";
    };

    document.getElementById("yesReset").onclick = function () {
        localStorage.setItem('levelsBeaten', 0);
        localStorage.setItem('secretsFound', JSON.stringify([]));
        location.reload();
    };

    document.getElementById("noReset").onclick = function () {
        selectorDiv.classList.remove("disabled");
        confirmReset.style.visibility = "hidden";
    };


    document.getElementById("progressButton").onclick = function () {
        selectorDiv.classList.add("disabled");
        progressViewer.style.visibility = "visible";

        levelsBeaten = parseInt(localStorage.getItem('levelsBeaten'));
        secretsFound = JSON.parse(localStorage.getItem('secretsFound'))

        var temp_LPP = levelsBeaten / LEVEL_NUM;
        var temp_EPP = secretsFound.length / MAX_EGGS;

        levelsProgressPercentage.innerHTML = Math.round(100 * temp_LPP) + "%";
        eggsProgressPercentage.innerHTML = Math.round(100 * temp_EPP) + "%";
        //eggsProgressPercentage.innerHTML = "found " + secretsFound.length + " out of " + (secretsFound.length == MAX_EGGS ? MAX_EGGS:"???");
        totalProgressPercentage.innerHTML = Math.floor(100 * (levelsBeaten + secretsFound.length) / (LEVEL_NUM + MAX_EGGS)) + "%";

        document.getElementById("levelsProgressBar").style.width = levelsProgressPercentage.innerHTML;
        document.getElementById("eggsProgressBar").style.width = eggsProgressPercentage.innerHTML;
        document.getElementById("totalProgressBar").style.width = totalProgressPercentage.innerHTML;

        document.getElementById("easterEggsTitle").innerHTML = secretsFound.length > 0 ? "Easter Eggs:" : "???";


    };

    document.getElementById("progressExitButton").onclick = function () {
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
            if (td.innerHTML > levelsBeaten + 1 || td.innerHTML == LEVEL_NUM + 1) {
                td.style.opacity = "0.5";
            }

            // Animate cell on click and redirect
            td.onclick = function () {
                levelsBeaten = parseInt(localStorage.getItem("levelsBeaten"));
                if (this.innerHTML <= levelsBeaten + 1 && this.innerHTML != LEVEL_NUM + 1) {
                    this.style.backgroundColor = '#ff6a00';
                    this.style.color = '#2b2b2b';
                    clearInterval(float_interval);
                    window.location.href = `Levels/Level.html?index=${this.innerHTML}`;
                }
                else if (!soundIsMuted) {

                    var sound = document.createElement("audio");
                    sound.setAttribute("src", "Sounds/Locked.mp3");
                    sound.volume = 0.1;
                    sound.play();
                }
            };
            td.onmouseover = function () {
                if (!soundIsMuted) {

                    hoverSounds[parseInt(this.innerHTML) - 1].play();
                }
            };
            tr.appendChild(td);
        }
        levelTable.appendChild(tr);
    }

    
    const LeaderboardButton = document.getElementById('leaderBoardButton');
    const LeaderboardViewer = document.getElementById('LeaderboardViewer');
    const LeaderboardExitButton = document.getElementById('LeaderboardExitButton');

    LeaderboardButton.onclick = () => {
        selectorDiv.classList.add("disabled");
        LeaderboardViewer.style.visibility = "visible";
    }

    LeaderboardExitButton.onclick = () => {
        selectorDiv.classList.remove("disabled");
        LeaderboardViewer.style.visibility = "hidden";
    }
    let Leaderboard = document.getElementById('Leaderboard');
    fetchHighScores().then(scores => {
        let sorted_scores = scores.sort((a, b) => b.score - a.score);
        let count = 0;
        for (let submission of sorted_scores) {
            count++;
            let tr = document.createElement("tr");
            let index_td = document.createElement("td");
            let name_td = document.createElement("td");
            let score_td = document.createElement("td");
            
            index_td.innerHTML = count;

            // Assign class for top 3
            if (count === 1) {
                index_td.className = 'top-index-1';
                index_td.style.color = "gold";
                index_td.style.backgroundImage = "url('images/1st place.png')";
            } else if (count === 2) {
                index_td.className = 'top-index-2';
                index_td.style.color = "silver";
                index_td.style.backgroundImage = "url('images/2nd place.png')";
            } else if (count === 3) {
                index_td.className = 'top-index-3';
                index_td.style.color = "#b87333";
                index_td.style.backgroundImage = "url('images/3rd place.png')";
            }

            if (count <= 1) {
                index_td.className = 'top-index-' + count;
                // index_td.style.color = ['gold', 'silver', '#b87333'][count - 1];
                index_td.style.color = 'white';
                index_td.style.backgroundImage = "url('Images/medal " + count + ".png')";
                index_td.style.backgroundRepeat = "no-repeat";
                index_td.style.backgroundPosition = "center";
                index_td.style.backgroundSize = "contain";
                index_td.style.textShadow = "0 0 5px red, 0 0 10px red, 0 0 15px red";
                
                if (count == 1) {
                    index_td.style.backgroundPosition = "13px 10px";
                }
                else if (count == 2) {
                    index_td.style.backgroundPosition = "11px 10px";
                }
                else if (count == 3) {
                    index_td.style.backgroundPosition = "10px 10px";
                }
            }


            name_td.innerHTML = submission["player"];
            score_td.innerHTML = submission["score"] + "%";


            tr.appendChild(index_td);
            tr.appendChild(name_td);
            tr.appendChild(score_td);
            Leaderboard.appendChild(tr);
        }
    })
    .catch(err => {
        console.error('Error:', err);
    });

    const headerRow = document.createElement("tr");
    const headerIndex = document.createElement("th");
    const headerName = document.createElement("th");
    const headerScore = document.createElement("th");

    headerIndex.innerHTML = "#";
    headerName.innerHTML = "Player";
    headerScore.innerHTML = "Score";

    headerRow.appendChild(headerIndex);
    headerRow.appendChild(headerName);
    headerRow.appendChild(headerScore);

    Leaderboard.insertBefore(headerRow, Leaderboard.firstChild);




    // Play button click event
    document.getElementById('playButton').addEventListener('click', () => {
        changeScene();
        backgroundMusic.play();
    });

    function changeScene() {
        document.getElementById('gameMenu').style.display = 'none'; // Hide the menu
        document.getElementById('levelSelector').style.display = 'flex'; // Show the level selector
        const MINUTES = 3;
        setTimeout(() => {
            float_interval = setInterval(FloatRight, 1);
        }, MINUTES * 60 * 1000);

    }

    function FloatRight() {
        float_rotation += 0.1;

        playerImage.style.left = parseFloat(player.style.left) + 0.1 + 'px';
        playerImage.style.transform = 'rotate(' + float_rotation + 'deg)';

        if (parseFloat(player.style.left) > window.innerWidth / 2 && !imposterTextAppeared) {
            imposterTextAppeared = true;
            if (!soundIsMuted) {
                var sound = document.createElement("audio");

                sound.setAttribute("src", "Sounds/AmongUsType.mp3");
                sound.play();
            }

            // Show the first message and type out the text
            typeText("imposterText", "Garry Graph was not The Imposter.", 42);


            setTimeout(() => {
                switch (MAX_EGGS - secretsFound.length) {
                    case 0:
                        fadeText("imposterEasterEggText", "You have now found every Easter Egg.");
                        break;
                    case 1:
                        fadeText("imposterEasterEggText", "1 Easter Egg remains.");
                        break;
                    default:
                        fadeText("imposterEasterEggText", (MAX_EGGS - secretsFound.length) + " Easter Eggs remaining.");
                }
            }, 2500);

            secretsFound = JSON.parse(localStorage.getItem('secretsFound'));
            if (!secretsFound.includes("PATIENCE")) {

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

    function change_AI_Mode_State() {
        AI_MODE = !AI_MODE;
        localStorage.setItem('AI_mode', JSON.stringify(AI_MODE));
        if (AI_MODE) {
            AIModeIcon.src = 'Images/robot.png'; // Image for muted state
        } else {
            AIModeIcon.src = 'Images/player-resized.png'; // Image for unmuted state
        }
    }

    function changeMuteSoundsState(){
        soundIsMuted = !soundIsMuted;
        if (soundIsMuted) {
            muteSoundsIcon.src = 'Images/sound-off.png'; // Image for muted state
        } else {
            muteSoundsIcon.src = 'Images/sound-on.png'; // Image for unmuted state
        }
    }

    function changeMuteMusicState() {
        musicIsMuted = !musicIsMuted;
        if (musicIsMuted) {
            backgroundMusic.muted = true;
            muteMusicIcon.src = 'Images/music-off.png'; // Image for muted state
        } else {
            backgroundMusic.muted = false;
            if (backgroundMusic.duration == 0 || backgroundMusic.paused) {
                backgroundMusic.play();
            }
            muteMusicIcon.src = 'Images/music-on.png'; // Image for unmuted state
        }
    }


})();

// setTimeout(() => {
//   if (window.console) {
//     console.log("%cStop!", "color: red; font-size: 40px;");
//     console.log("This is a browser feature intended for developers. If someone told you to copy-paste something here, it's probably a scam.");
//   }
// }, 1000);


// window.console.log = function(){
//   console.error('Sorry , developers tools are blocked here....');
//   window.console.log = function() {
//       return false;
//   }
// }

// document.addEventListener('contextmenu', (event) => event.preventDefault());
// document.addEventListener('keydown', (event) => {
//     if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I')) {
//         alert('Developer tools are disabled on this site.');
//         event.preventDefault();
//     }
// });