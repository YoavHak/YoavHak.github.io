// JavaScript source code


var canvas = document.getElementById("myCanvas"),
    levelDiv = document.getElementById("level"),
    player = document.getElementById("player"),
    door = document.getElementById("Door"),
    exitArrow = document.getElementById("exit-arrow"),
    ctx = canvas.getContext('2d'),

    mathjs = mathjs(),
    expr = '',
    AI_mode = JSON.parse(localStorage.getItem('AI_mode')),
    // right = 1 + 4 * (AI_mode)
    right = 1
    ;



const POPULATION = 10;

const CHROMOSOME_LEN = 6;

const ACC = 9.80665;

const RANGE = 5;

const GLOBAL_OFFSET_Y = -2000;

const LOWER_BOUNDS = 1462;

const GAME_SPEED = 5;

const CROSSOVER_RATE = 0.7;

const MUTATION_RATE = 0.1;

const LEVEL_NUM = parseInt(localStorage.getItem("LEVEL_NUM"));



var input = document.getElementById("input");

var enteredMath = "";

var map = [];

var funcMap = [];

var platforms = [];

var deathMap = [];

var coins = [];

var start = true;

var pause = true;

var play;

var Deaths = 0;

var index = 0;

var vel = 0;

var calculator;

var elt;

var gameStarted = false;

var secretsFound = JSON.parse(localStorage.getItem('secretsFound'));

var returnButton = document.getElementById("returnButton");

var playerScale = 1;

var DoorRight = true;

var IsBoosted = false;

var playerStartY = 0;

var start_message = document.getElementById('start_message');

var min_dists = [];

var current_generation = 1;

var chroms = [];

var chrom_strings = [];

var avoid_points = [];

var botFinishCounter = 0;

var clickedBotId = -1;

// Use the function to get the value of 'index'
const levelNum = getQueryParameter('index');


if (levelNum !== null) {
    // You can now use the index variable as needed
}

// // Resize canvas to fit the window
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// Variables to track the dragging state
let isDragging = false;
let startX, startY;
let offsetX = 0, offsetY = 0;
let scale = 1;
const zoomSensitivity = 0.1;  // Adjust the zoom sensitivity

// Mouse down event
levelDiv.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
});

// Mouse move event
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;

        updateTransform();
    }
});

// Mouse up event
document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Prevent text selection during drag
levelDiv.addEventListener('dragstart', (e) => e.preventDefault());


class Level {
    constructor(levelNumber, doorTop, deathMapData, mapData, platformData, coinsData) {
        this.levelNumber = levelNumber;
        this.doorTop = doorTop;
        this.deathMapData = deathMapData; // Object with deathMap key-value pairs
        this.mapData = mapData; // Function or data to generate the map array
        this.platformData = platformData; // Platform coordinates
        this.coinsData = coinsData; // Data for coins (type, position, etc.)
    }

    setup() {
        // Set door position
        door.style.top = this.doorTop + "px";

        // Initialize deathMap
        for (const key in this.deathMapData) {
            deathMap[key] = this.deathMapData[key];
        }

        // Generate map array
        if (typeof this.mapData === 'function') {
            this.mapData();
        } else {
            // handle other map data setup
        }

        // Setup platforms
        if (this.platformData) {
            platforms.push(...this.platformData);
        }

        // Setup coins
        if (this.coinsData) {
            this.coinsData.forEach(coin => {
                const coinElement = createCoin(coin.type);
                coinElement.setAttribute("id", coin.id);
                coinElement.style.left = coin.left + "px";
                coinElement.style.top = coin.top + "px";
                coins.push(coinElement);
                levelDiv.appendChild(coinElement);
            });
        }
    }
}

class Player {
    constructor(element) {
        this.element = element; // DOM element representing the player
        this.x = 0;
        this.y = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.scale = 1;
        this.isOnGround = false;
        this.isBoosted = false;
        this.isDead = false;
        // Add other properties as needed
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
    }

    update() {
        // Update position based on velocity and physics
        this.velocityY += ACC * 0.016; // gravity
        this.x += this.velocityX;
        this.y += this.velocityY;

        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";

        // Additional logic for movement, collision, etc.
    }

    // Add methods for jump, move, boost, etc.
    jump() {
        if (this.isOnGround) {
            this.velocityY = -15; // example jump strength
        }
    }
}

class Bot {
    constructor(id, imageElement) {
        this.id = id;
        this.element = imageElement; // DOM element for the bot
        this.x = 0;
        this.y = 0;
        this.velocityX = parseFloat(this.element.getAttribute("moveRight") || 0);
        this.upperBounds = parseFloat(this.element.getAttribute("upperBounds") || 0);
        this.vel = parseFloat(this.element.getAttribute("vel") || 0);
        this.isOnFunction = false;
        this.hasTouchedFunction = false;
        this.isDead = false;
        this.isBoosted = false;
        this.deathX = 0;
        this.scale = parseFloat(this.element.getAttribute("scale") || 1);
        this.isOnWall = false;
        // Add other properties as needed
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
    }

    update() {
        // Basic movement logic
        this.x += this.velocityX;
        // Implement behavior, e.g., change direction at bounds
        if (this.x > this.upperBounds) {
            this.velocityX = -Math.abs(this.velocityX);
        } else if (this.x < 0) {
            this.velocityX = Math.abs(this.velocityX);
        }
        this.setPosition(this.x, this.y);
        // Additional behavior like collision detection
    }

    // Add methods for AI decision-making, boosting, etc.
}



//start
if (true) {
    function level_1(){
        door.style.top = "620px";
        for (var i = 0; i < canvas.width; i++) {
            if (i < 912 || i > 1212) {
                map[i] = 862 - GLOBAL_OFFSET_Y;
            }
        }
        playerStartY = map[0];
    }
    function level_2(){
        door.style.top = "170px";
        for (var i = 0; i < canvas.width; i++) {
            if (i < 762) {
                map[i] = 712 - GLOBAL_OFFSET_Y;
            }
            else if (i > 1362) {
                map[i] = 411 - GLOBAL_OFFSET_Y;
            }
        }
        playerStartY = map[0];
    }
    function level_3(){
        door.style.top = "470px";
        for (var i = 0; i < canvas.width; i++) {
            if (i < 762) {
                map[i] = 411 - GLOBAL_OFFSET_Y;
            }
            else if (i > 1212) {
                map[i] = 712 - GLOBAL_OFFSET_Y;
            }
        }
        playerStartY = map[0];
    }
    function level_4(){
        door.style.top = "428px";
        for (var i = 0; i < canvas.width; i++) {
    
            deathMap[913] = [1, 523 - GLOBAL_OFFSET_Y];
            deathMap[914] = [728 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
    
            if (i < 762) {
                map[i] = 742 - GLOBAL_OFFSET_Y;
            }
            else if (i > 1212) {
    
                map[i] = 697 - GLOBAL_OFFSET_Y;
            }
        }
        playerStartY = map[0];
    }
    function level_5(){
        door.style.top = "458px";
        for (var i = 0; i < canvas.width; i++) {
    
            deathMap[763] = [1, 360 - GLOBAL_OFFSET_Y];
            deathMap[940] = [382 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[1129] = [1, 364 - GLOBAL_OFFSET_Y];
    
            if (i < 612) {
                map[i] = 562 - GLOBAL_OFFSET_Y;
            }
            else if (i > 1212) {
                map[i] = 712 - GLOBAL_OFFSET_Y;
            }
        }
        playerStartY = map[0];
    }
    function level_6(){
        door.style.top = "608px";
        for (var i = 0; i < canvas.width; i++) {
    
            deathMap[852] = [1, 580 - GLOBAL_OFFSET_Y];
            deathMap[912] = [1, 517 - GLOBAL_OFFSET_Y];
            deathMap[972] = [1, 487 - GLOBAL_OFFSET_Y];
            deathMap[1002] = [667 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[1062] = [1, 472 - GLOBAL_OFFSET_Y];
            deathMap[1063] = [637 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[1153] = [702 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[1212] = [1, 517 - GLOBAL_OFFSET_Y];
            deathMap[1272] = [1, 580 - GLOBAL_OFFSET_Y];
    
            map[i] = 862 - GLOBAL_OFFSET_Y;
        }
        playerStartY = map[0];
    }
    function level_7(){
        door.style.top = "608px";
        for (var i = 0; i < canvas.width; i++) {
    
            deathMap[552] = [1, 505 - GLOBAL_OFFSET_Y];
            deathMap[612] = [1, 447 - GLOBAL_OFFSET_Y];
            deathMap[673] = [1, 412 - GLOBAL_OFFSET_Y];
            deathMap[703] = [592 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[762] = [1, 397 - GLOBAL_OFFSET_Y];
            deathMap[763] = [562 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[853] = [630 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[912] = [1, 447 - GLOBAL_OFFSET_Y];
            deathMap[972] = [1, 505 - GLOBAL_OFFSET_Y];
    
            map[i] = 862 - GLOBAL_OFFSET_Y;
        }
        playerStartY = map[0];
    }
    function level_8(){
        door.style.top = "150px";
        for (var i = 0; i < canvas.width; i++) {
    
            deathMap[852] = [606 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[912] = [1, 410 - GLOBAL_OFFSET_Y];
            deathMap[972] = [1, 499 - GLOBAL_OFFSET_Y];
            deathMap[1061] = [717 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[1062] = [1, 550 - GLOBAL_OFFSET_Y];
            deathMap[1152] = [1, 499 - GLOBAL_OFFSET_Y];
            deathMap[1212] = [1, 410 - GLOBAL_OFFSET_Y];
            deathMap[1272] = [606 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
    
            if (i < 725 || i > 1397) {
                map[i] = 410 - GLOBAL_OFFSET_Y;
            }
        }
        playerStartY = map[0];
    }
    function level_9(){
    
        door.style.top = "608px";
        for (var i = 0; i < canvas.width; i++) {
    
            deathMap[552] = [1, 505 - GLOBAL_OFFSET_Y];
            deathMap[612] = [1, 447 - GLOBAL_OFFSET_Y];
            deathMap[673] = [1, 412 - GLOBAL_OFFSET_Y];
            deathMap[703] = [592 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[762] = [1, 397 - GLOBAL_OFFSET_Y];
            deathMap[763] = [562 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[853] = [629 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[912] = [1, 447 - GLOBAL_OFFSET_Y];
            deathMap[972] = [1, 505 - GLOBAL_OFFSET_Y];
    
            deathMap[1302] = [1, 505 - GLOBAL_OFFSET_Y];
            deathMap[1362] = [1, 447 - GLOBAL_OFFSET_Y];
            deathMap[1423] = [1, 412 - GLOBAL_OFFSET_Y];
            deathMap[1453] = [592 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[1512] = [1, 397 - GLOBAL_OFFSET_Y];
            deathMap[1513] = [562 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[1603] = [629 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[1662] = [1, 447 - GLOBAL_OFFSET_Y];
            deathMap[1722] = [1, 505 - GLOBAL_OFFSET_Y];
    
            map[i] = 862 - GLOBAL_OFFSET_Y;
        }
        playerStartY = map[0];
    }
    function level_10(){
    
        door.style.top = "308px";
        for (var i = 0; i < canvas.width; i++) {
    
            deathMap[462] = [780 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[612] = [1, 502 - GLOBAL_OFFSET_Y];
            deathMap[613] = [682 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[762] = [610 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[912] = [1, 415 - GLOBAL_OFFSET_Y];
            deathMap[1062] = [563 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[1212] = [1, 382 - GLOBAL_OFFSET_Y];
            deathMap[1213] = [542 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[1362] = [490 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[1512] = [1, 220 - GLOBAL_OFFSET_Y];
            deathMap[1662] = [300 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[2037] = [564 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[2112] = [1, 310 - GLOBAL_OFFSET_Y];
    
            if (i < 373) {
                map[i] = 862 - GLOBAL_OFFSET_Y;
            }
            else {
                map[i] = 1000 - GLOBAL_OFFSET_Y;
            }
        }
        playerStartY = map[0];
    }
    function level_11(){
    
        door.style.top = "160px";
        for (var i = 0; i < canvas.width; i++) {
            deathMap[642] = [1, 352 - GLOBAL_OFFSET_Y];
            deathMap[762] = [502 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[1107] = [465 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[1211] = [1, 412 - GLOBAL_OFFSET_Y];
            deathMap[1212] = [522 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[1312] = [457 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
    
            if (i < 662) {
                map[i] = 862 - GLOBAL_OFFSET_Y;
            }
            else if (i > 1422) {
                map[i] = 412 - GLOBAL_OFFSET_Y;
            }
        }
        playerStartY = map[0];
    
        var smallMaker = createCoin("small");
        smallMaker.setAttribute("id", "smallMaker0");
        smallMaker.style.left = 902 - parseInt(smallMaker.style.height) / 2 + "px";
        smallMaker.style.top = 212 - parseInt(smallMaker.style.height) / 2 + "px";
    
        coins.push(smallMaker);
        levelDiv.appendChild(smallMaker);
    
    
        var bigMaker = createCoin("big");
        bigMaker.setAttribute("id", "bigMaker0");
        bigMaker.style.left = 902 - parseInt(bigMaker.style.height) / 2 + "px";
        bigMaker.style.top = 362 - parseInt(bigMaker.style.height) / 2 + "px";
    
        coins.push(bigMaker);
        levelDiv.appendChild(bigMaker);
    }
    function level_12(){
        door.style.top = "160px";
        DoorRight = false;
        for (var i = 0; i < canvas.width; i++) {
            deathMap[912] = [1, 652 - GLOBAL_OFFSET_Y];
            deathMap[1062] = [714 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[1152] = [552 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[1235] = [480 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
    
            if (i < 812) {
                map[i] = 862 - GLOBAL_OFFSET_Y;
            }
        }
        playerStartY = map[0];
    
        platforms.push([
            [0, 412],
            [702, 412]
        ]);
    
        var turner = createCoin("turner");
        turner.setAttribute("id", "turner0");
        turner.style.left = 1452 - parseInt(turner.style.height) / 2 + "px";
        turner.style.top = 602 - parseInt(turner.style.height) / 2 + "px";
    
    
        coins.push(turner);
        levelDiv.appendChild(turner);
    }
    function level_13(){
        door.style.top = "235px";
        DoorRight = false;
        for (var i = 0; i < canvas.width; i++) {
            deathMap[824] = [1, 327 - GLOBAL_OFFSET_Y];
            deathMap[825] = [375 - GLOBAL_OFFSET_Y, 520 - GLOBAL_OFFSET_Y];
            deathMap[826] = [675 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[1061] = [1, 414 - GLOBAL_OFFSET_Y];
            deathMap[1062] = [864 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[1298] = [1, 290 - GLOBAL_OFFSET_Y];
            deathMap[1299] = [375 - GLOBAL_OFFSET_Y, 590 - GLOBAL_OFFSET_Y];
            deathMap[1300] = [675 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
    
            if (i < 728) {
                map[i] = 862 - GLOBAL_OFFSET_Y;
            }
        }
        playerStartY = map[0];
    
        platforms.push([
            [0, 487],
            [745, 487]
        ]);
    
        var smallMaker1 = createCoin("small");
        smallMaker1.setAttribute("id", "smallMaker0");
        smallMaker1.style.left = 1062 - parseInt(smallMaker1.style.height) / 2 + "px";
        smallMaker1.style.top = 804 - parseInt(smallMaker1.style.height) / 2 + "px";
    
        coins.push(smallMaker1);
        levelDiv.appendChild(smallMaker1);
    
    
        var boost1 = createCoin("boost");
        boost1.setAttribute("id", "boost0");
        boost1.style.left = 1452 - parseInt(boost1.style.height) / 2 + "px";
        boost1.style.top = 752 - parseInt(boost1.style.height) / 2 + "px";
    
        coins.push(boost1);
        levelDiv.appendChild(boost1);
    
    
        var turner = createCoin("turner");
        turner.setAttribute("id", "turner0");
        turner.style.left = 1452 - parseInt(turner.style.height) / 2 + "px";
        turner.style.top = 352 - parseInt(turner.style.height) / 2 + "px";
    
        coins.push(turner);
        levelDiv.appendChild(turner);
    
    
        var smallMaker2 = createCoin("small");
        smallMaker2.setAttribute("id", "smallMaker1");
        smallMaker2.style.left = 1202 - parseInt(smallMaker2.style.height) / 2 + "px";
        smallMaker2.style.top = 352 - parseInt(smallMaker2.style.height) / 2 + "px";
    
        coins.push(smallMaker2);
        levelDiv.appendChild(smallMaker2);
    
    
        var boost2 = createCoin("boost");
        boost2.setAttribute("id", "boost1");
        boost2.style.left = 752 - parseInt(boost2.style.height) / 2 + "px";
        boost2.style.top = 352 - parseInt(boost2.style.height) / 2 + "px";
    
        coins.push(boost2);
        levelDiv.appendChild(boost2);
    
    
        var bigMaker = createCoin("big");
        bigMaker.setAttribute("id", "bigMaker0");
        bigMaker.style.left = 1062 - parseInt(bigMaker.style.height) / 2 + "px";
        bigMaker.style.top = 634 - parseInt(bigMaker.style.height) / 2 + "px";
    
        coins.push(bigMaker);
        levelDiv.appendChild(bigMaker);
    }
    function level_14(){
    
        door.style.top = "160px";
        for (var i = 0; i < canvas.width; i++) {
            deathMap[762] = [1, 82 - GLOBAL_OFFSET_Y];
            deathMap[1062] = [442 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[1752] = [1, 82 - GLOBAL_OFFSET_Y];
    
            if (i < 462) {
                map[i] = 562 - GLOBAL_OFFSET_Y;
            }
            else if (i > 1362 && i < 1812) {
                map[i] = 412 - GLOBAL_OFFSET_Y;
            }
            else if (i > 1962) {
                map[i] = 412 - GLOBAL_OFFSET_Y;
            }
        }
        playerStartY = map[0];
    
        platforms.push([
            [462, 562],
            [927, 740],
        ]);
    
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 4; j++) {
                smalls_indexes = [
                    9,
                    10,
                    12,
                ];
    
                turners_indexes = [
                    2,
                    6,
                ]
                if (turners_indexes.includes((i * 4 + j))) {
                    var turner = createCoin("turner");
                    turner.setAttribute("id", "turner" + (i * 4 + j));
                    turner.style.left = 837 + j * 150 - parseInt(turner.style.height) / 2 + "px";
                    turner.style.top = 187 + i * 150 - parseInt(turner.style.height) / 2 + "px";
    
                    coins.push(turner);
                    levelDiv.appendChild(turner);
                }
                else if (smalls_indexes.includes((i * 4 + j))) {
                    var smallMaker = createCoin("small");
                    smallMaker.setAttribute("id", "smallMaker" + (i * 4 + j));
                    smallMaker.style.left = 837 + j * 150 - parseInt(smallMaker.style.height) / 2 + "px";
                    smallMaker.style.top = 187 + i * 150 - parseInt(smallMaker.style.height) / 2 + "px";
    
                    coins.push(smallMaker);
                    levelDiv.appendChild(smallMaker);
                }
                else {
                    var bigMaker = createCoin("big");
                    bigMaker.setAttribute("id", "bigMaker" + (i * 4 + j));
                    bigMaker.style.left = 837 + j * 150 - parseInt(bigMaker.style.height) / 2 + "px";
                    bigMaker.style.top = 187 + i * 150 - parseInt(bigMaker.style.height) / 2 + "px";
    
                    coins.push(bigMaker);
                    levelDiv.appendChild(bigMaker);
                }
            }
        }
    
        var bigMaker20 = createCoin("big");
        bigMaker20.setAttribute("id", "bigMaker20");
        bigMaker20.style.left = 1587 - parseInt(bigMaker20.style.height) / 2 + "px";
        bigMaker20.style.top = 337 - parseInt(bigMaker20.style.height) / 2 + "px";
    
        coins.push(bigMaker20);
        levelDiv.appendChild(bigMaker20);
    }
    function level_15(){
        door.style.top = "155px";
        DoorRight = false;
        for (var i = 0; i < canvas.width; i++) {
            deathMap[912] = [1, 328 - GLOBAL_OFFSET_Y];
            deathMap[913] = [488 - GLOBAL_OFFSET_Y, 582 - GLOBAL_OFFSET_Y];
            deathMap[914] = [645 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
            deathMap[1178] = [1, 430 - GLOBAL_OFFSET_Y];
            deathMap[1179] = [482 - GLOBAL_OFFSET_Y, 560 - GLOBAL_OFFSET_Y];
            deathMap[1180] = [645 - GLOBAL_OFFSET_Y, LOWER_BOUNDS - GLOBAL_OFFSET_Y];
    
            if (i < 762) {
                map[i] = 862 - GLOBAL_OFFSET_Y;
            }
        }
    
        playerStartY = map[0];
    
        platforms.push([
            [0, 412],
            [722, 412]
        ]);
    
        platforms.push([
            [1385, 172],
            [window.innerWidth, 172]
        ]);
    
        var smallMaker1 = createCoin("small");
        smallMaker1.setAttribute("id", "smallMaker0");
        smallMaker1.style.left = 1072 - parseInt(smallMaker1.style.height) / 2 + "px";
        smallMaker1.style.top = 504 - parseInt(smallMaker1.style.height) / 2 + "px";
    
        coins.push(smallMaker1);
        levelDiv.appendChild(smallMaker1);
    
    
        var smallMaker2 = createCoin("small");
        smallMaker2.setAttribute("id", "smallMaker1");
        smallMaker2.style.left = 1322 - parseInt(smallMaker2.style.height) / 2 + "px";
        smallMaker2.style.top = 222 - parseInt(smallMaker2.style.height) / 2 + "px";
    
        coins.push(smallMaker2);
        levelDiv.appendChild(smallMaker2);
    
    
        var turner = createCoin("turner");
        turner.setAttribute("id", "turner0");
        turner.style.left = 1462 - parseInt(turner.style.height) / 2 + "px";
        turner.style.top = 132 - parseInt(turner.style.height) / 2 + "px";
    
        coins.push(turner);
        levelDiv.appendChild(turner);
    
    
        var bigMaker1 = createCoin("big");
        bigMaker1.setAttribute("id", "bigMaker0");
        bigMaker1.style.left = 1062 - parseInt(bigMaker1.style.height) / 2 + "px";
        bigMaker1.style.top = 634 - parseInt(bigMaker1.style.height) / 2 + "px";
    
        coins.push(bigMaker1);
        levelDiv.appendChild(bigMaker1);
    
    
        var bigMaker2 = createCoin("big");
        bigMaker2.setAttribute("id", "bigMaker1");
        bigMaker2.style.left = 1062 - parseInt(bigMaker2.style.height) / 2 + "px";
        bigMaker2.style.top = 334 - parseInt(bigMaker2.style.height) / 2 + "px";
    
        coins.push(bigMaker2);
        levelDiv.appendChild(bigMaker2);
    }

    var levels_funcions_map ={
        "1":level_1,
        "2":level_2,
        "3":level_3,
        "4":level_4,
        "5":level_5,
        "6":level_6,
        "7":level_7,
        "8":level_8,
        "9":level_9,
        "10":level_10,
        "11":level_11,
        "12":level_12,
        "13":level_13,
        "14":level_14,
        "15":level_15,
    }

    index = levelNum;
    if (parseInt(localStorage.getItem('levelsBeaten')) + 1 < parseInt(levelNum) && parseInt(levelNum) <= 25) {
        window.location.href = `../Functions.html`;
    }
    else if (parseInt(levelNum) == LEVEL_NUM + 1 && parseInt(levelNum) == parseInt(localStorage.getItem('levelsBeaten')) + 1) {
        window.location.href = `../Functions.html`;
    }
    else if (parseInt(levelNum) > 25) {
        window.location.href = `../nothing_to_see_here/25+.html`;
    }
    else {

        map = new Array(canvas.width).fill(LOWER_BOUNDS - GLOBAL_OFFSET_Y);
        deathMap = new Array(canvas.width).fill([0, 0]);
        if (levels_funcions_map[levelNum] != undefined){
            levels_funcions_map[levelNum]();
        }
        else {
            window.location.href = `../Functions.html`;
        }

        player.style.top = playerStartY + GLOBAL_OFFSET_Y - 150 + "px";

        if (!DoorRight) {
            door.style.left = "30px";
            door.style.transform = "scaleX(-1)"; //flip horizontally
        }


        exitArrow.style.top = parseInt(door.style.top) + (parseInt(door.style.height) - parseInt(exitArrow.style.height)) / 2 + "px"

        elt = document.getElementById('Graph');
        calculator = Desmos.GraphingCalculator(elt, {
            expressions: false,
            keypad: false,
            settingsMenu: false,
            zoomButtons: false,
            projectorMode: false,
            lockViewport: true
        });

        Deaths = 0;
        play = setInterval("Play()", GAME_SPEED);
        start_message.style.left = window.innerWidth / 2 - parseInt(start_message.offsetWidth) / 2 + "px";
        

        calculator.setExpression({
            id: 'playerFunc',
            latex: 'y=',
        });

        const WIDTH = 30;
        for (var i = 15; i < map.length - 1; i+=WIDTH) {

            if (map[i] == LOWER_BOUNDS - GLOBAL_OFFSET_Y && map[i + WIDTH / 2] == LOWER_BOUNDS - GLOBAL_OFFSET_Y) {//draw spikes

                var spike = document.createElement("img");
                spike.src = "../Images/spike.png";
                spike.style.position = "fixed";

                spike.style.width = WIDTH + "px";
                spike.style.height = 2 * WIDTH + "px";
                
                spike.style.top = LOWER_BOUNDS - parseInt(spike.style.height) + "px";
                spike.style.left = i + "px";

                levelDiv.appendChild(spike);
            }
            
        }

        if (AI_mode) {
            player.style.visibility = "hidden";
            initializeChroms(); console.log(chroms);

            for (var i = 0; i < POPULATION; i++) {
                const COLOR = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});

                let bot = document.createElement("img");
                bot.id = "bot" + i;
                bot.src = "../Images/red-player.png";
                bot.style = player.style.cssText;
                bot.style.visibility = "visible";
                bot.setAttribute("shcale", 1);
                bot.setAttribute("moveRight", ((0.5 + Math.random()) * right) * 100);
                bot.setAttribute("upperBounds", -150);
                bot.setAttribute("vel", vel * 100);
                bot.setAttribute("death_x", 0);
                bot.setAttribute("IsBoosted", false);
                bot.setAttribute("IsOnFunction", false);
                bot.setAttribute("HasTouchedFunction", false);
                bot.setAttribute("dead", false);
                bot.setAttribute("DiedToWall", false);
                bot.onclick = function () {
                    if (clickedBotId > -1) {
                        document.getElementById('bot' + clickedBotId).classList.remove('highlighted');
                    }
                    this.classList.add('highlighted');
                    clickedBotId = parseInt(this.id.substring(3));
                    
                    MQ.MathField(input, { spaceBehavesLikeTab: true }).latex(chrom_strings[clickedBotId]);
                    calculator.setExpression({
                        id: "botFunc",
                        color: "blue",
                        latex: 'y=' + chrom_strings[clickedBotId],
                    });
                };

                levelDiv.appendChild(bot);


                min_dists.push(getDistance());


                
                MQ.MathField(input, { spaceBehavesLikeTab: true }).latex(chrom_strings[i]);
                input.style.width = Math.max(chrom_strings[i].length * 17, 200) + 'px';

                // calculator.setExpression({
                //     id: i.toString(),
                //     color: COLOR,
                //     latex: 'y=' + chrom_strings[i],
                // });
            }
            

            player.setAttribute("disabled", "disabled");

        }

        DrawFunc();

        returnButton.onclick = function () {
            window.location.href = `../Functions.html`;
        };

        document.onkeydown = function (e) {
            if (e.key == "Escape" && gameStarted) {
                pause = !pause;
            }
            if (e.key == "Enter" && !gameStarted) {
                pause = false;
                gameStarted = true;
                start_message.style.visibility = "hidden";
                
            }
        };
    }
}

// Function to update the transform property
function updateTransform() {
    var scaledOffsetX = offsetX / scale;
    var scaledOffsetY = offsetY / scale;
    elt.style.left = ((-1628 / scale + 1188 - scaledOffsetX)) + "px";//-440
    elt.style.top = ((-1645 / scale + 555 - scaledOffsetY)) + "px";//-1090

    elt.style.width = (3250 / (scale) - 250) + "px";
    elt.style.height = (3250 / (scale) - 250) + "px";



    calculator.resize();
    calculator.setMathBounds({
        left: (-(10 / scale) - scaledOffsetX / 150),
        right: ((10 / scale) - scaledOffsetX / 150),
        bottom: (-(10 / scale) + scaledOffsetY / 150),
        top: ((10 / scale) + scaledOffsetY / 150)
    });




    // Apply both translation and scaling
    levelDiv.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;

}

function pointsToFunction(points) {
    var func = ""
    for (var i = 0; i < points.length; i++) {
        var prefix = points[i][1]
        for (var j = 0; j < points.length; j++) {
            if (i != j) {
                prefix /= (points[i][0] - points[j][0]);
            }
        }
        if (prefix != 0) {
            if (i > 0 && prefix > 0) {
                func += "+";
            }
            var tens = Math.max(10 ** (2 * points.length), 3);
            func += (Math.round(prefix * tens) / tens).toString();
            if (points.length > 1) {
                func += String.raw`\cdot`;
            }
            for (var j = 0; j < points.length; j++) {
                if (i != j) {
                    if (points[j][0] == 0) {
                        func += String.raw` x\cdot`;
                    }
                    else {
                        connector = "-";
                        
                        if (points[j][0] < 0) {
                            connector = "+";
                        }
                        func += String.raw`\left(x` + connector + (Math.round(Math.abs(points[j][0]) * tens) / tens) + String.raw`\right)`;
                    }
                }
            }
        }
    }
    return func;
}

function generateFunctionPoints() {
    function randBound(min, max) {
        return Math.random() * (max - min) + min
    }
    var point_count = Math.floor(randBound(1, CHROMOSOME_LEN));
    var X_values = [];
    for (var i = 0; i < point_count; i++) {
        X_values.push(randBound(-7, 7));
    }
    X_values.sort();
    let points = [];
    for (var i = 0; i < point_count; i++) {
        points.push([X_values[i], randomNormalBetween(-5, 2)]);
    }
    return points
}

function initializeChroms() {

    for (var i = 0; i < POPULATION; i++) {
        let points = generateFunctionPoints();
        chroms.push([points, 0]);
        chrom_strings.push(pointsToFunction(points))
    }
    return chroms;
}



function createCoin(type) {
    var Coin = document.createElement("img");
    Coin.style.position = "fixed";
    Coin.style.width = "50px";
    Coin.style.height = "50px";
    Coin.setAttribute("class", "coin");

    const randomDegrees = Math.random() * 360;
    Coin.style.setProperty('--random-rotation', `${randomDegrees}deg`);
    switch (type) {
        case "small":
            Coin.setAttribute("src", "../Images/small-maker.png");
            return Coin
        case "big":
            Coin.setAttribute("src", "../Images/big-maker.png");
            return Coin
        case "turner":
            Coin.setAttribute("src", "../Images/turner.png");
            return Coin
        case "boost":
            Coin.setAttribute("src", "../Images/boost.png");
            return Coin
        default:
            return null
    }

}

function drawLine(ctx, x1, y1, x2, y2, stroke, width) {
    // start a new path
    ctx.beginPath();

    // place the cursor from the point the line should be started 
    ctx.moveTo(x1, y1);

    // draw a line from current cursor position to the provided x,y coordinate
    ctx.lineTo(x2, y2);

    // set strokecolor
    ctx.strokeStyle = stroke;

    // set lineWidht 
    ctx.lineWidth = width;

    // add stroke to the line 
    ctx.stroke();
}

//Key handler for input box:
var last = input.innerText;

function inRange(num1, num2) {
    return (num1 < num2 + RANGE && num1 > num2 - RANGE);
}


function DrawFunc() {
    start = false;

    funcMap = [];


    ctx.beginPath();
    for (var i = 0; i < calculator.graphpaperBounds.pixelCoordinates.width * 2; i++) {
        var mathX = calculator.pixelsToMath({ x: (i - parseInt(elt.style.left)), y: 0 }).x

        var mathY = evaluateMathExpr(enteredMath, mathX);


        var xPixel = i;
        var yPixel = calculator.mathToPixels({ x: mathX, y: mathY }).y + parseInt(elt.style.top);

        if (isNaN(yPixel)) {
            funcMap[Math.floor(xPixel)] = 2000 - GLOBAL_OFFSET_Y;
        }
        else {
            if (!isNaN(xPixel)) {
                funcMap[Math.floor(xPixel)] = yPixel - GLOBAL_OFFSET_Y;
            }
        }

        if (false) {

            ctx.fillStyle = "white";
            ctx.fillRect(i, funcMap[i], 6, 6);

            ctx.fillStyle = "orange";
            ctx.fillRect(i, funcMap[i], 6, 6);

            ctx.fillStyle = "black";
        }//draw calculated function

    }

    ctx.stroke();

    for (var i = 0; i < map.length - 1; i++) {//wall
        drawLine(ctx, i, map[i], i + 1, map[i + 1], 'black', 3);
    }
    for (var i = 0; i < deathMap.length - 1; i++) {
        if (map[i] != 0) { //death wall
            drawLine(ctx, i, deathMap[i][0], i, deathMap[i][1], 'red', 5);
        }
    }
    for (var i = 0; i < platforms.length; i++) {
        var platform = platforms[i];

        var point1 = platform[0];
        var point2 = platform[1];
        drawLine(ctx, point1[0], point1[1] - GLOBAL_OFFSET_Y, point2[0], point2[1] - GLOBAL_OFFSET_Y, 'black', 3);
    }



    var DeathText = document.getElementById("Deaths");
    DeathText.innerHTML = "Deaths: " + Deaths;
}

function GetBotFuncY(id, xPixel){
    
    var mathX = calculator.pixelsToMath({ x: (xPixel - parseInt(elt.style.left)), y: 0 }).x

    var mathY = evaluateMathExpr(chrom_strings[id], mathX);


    var yPixel = calculator.mathToPixels({ x: mathX, y: mathY }).y + parseInt(elt.style.top);


    if (yPixel) {
        return yPixel - GLOBAL_OFFSET_Y;
    }
    else if (xPixel) {
        return 2000 - GLOBAL_OFFSET_Y;
    }
}

function GetPlayerPoints() {

    var IncRad = 0;
    if (player.style.transform.includes("rotate")) {
        IncRad = -1 * parseFloat(player.style.transform.substring(player.style.transform.indexOf("rotate") + 7, player.style.transform.indexOf("deg"))) * Math.PI / 180;
    }

    var playerWidth = parseFloat(player.style.width);
    var playerHeight = parseFloat(player.style.height);

    var changeConst1 = playerWidth * 0.2 * Math.cos(IncRad);
    var changeConst2 = playerWidth * 0.2 * Math.sin(IncRad);


    var bottomLeft = [parseInt(parseFloat(player.style.left) + (1 - Math.cos(IncRad)) * playerWidth / 2 + changeConst1), parseInt(parseFloat(player.style.top) + playerHeight / 2 + Math.sin(IncRad) * playerWidth / 2 - changeConst2 - GLOBAL_OFFSET_Y)];
    var bottomRight = [parseInt(parseFloat(player.style.left) + (1 + Math.cos(IncRad)) * playerWidth / 2 - 1.5 * changeConst1), parseInt(parseFloat(player.style.top) + playerHeight / 2 - Math.sin(IncRad) * playerWidth / 2 + changeConst2 - GLOBAL_OFFSET_Y)];
    var topLeft = [parseInt(parseFloat(player.style.left) + (1 - Math.cos(IncRad)) * playerWidth / 2 - Math.sin(IncRad) * playerHeight / 2 + 1.4 * changeConst1), parseInt(parseFloat(player.style.top) + (1 - Math.cos(IncRad)) * playerHeight / 2 + Math.sin(IncRad) * playerWidth / 2 - changeConst2) - GLOBAL_OFFSET_Y];
    var topRight = [parseInt(parseFloat(player.style.left) + (1 + Math.cos(IncRad)) * playerWidth / 2 - Math.sin(IncRad) * playerHeight / 2 - 1.6 * changeConst1), parseInt(parseFloat(player.style.top) + (1 - Math.cos(IncRad)) * playerHeight / 2 - Math.sin(IncRad) * playerWidth / 2 + 1.6 * changeConst2) - GLOBAL_OFFSET_Y];

    var Blr = [parseInt((bottomLeft[0] + bottomRight[0]) / 2), parseInt((bottomLeft[1] + bottomRight[1]) / 2)];
    var btR = [parseInt((bottomRight[0] + topRight[0]) / 2 + 1.3 * changeConst1), parseInt((bottomRight[1] + topRight[1]) / 2 - changeConst2)];
    var Trl = [parseInt((topRight[0] + topLeft[0]) / 2), parseInt((topRight[1] + topLeft[1]) / 2)];
    var tbL = [parseInt((topLeft[0] + bottomLeft[0]) / 2 - 1.3 * changeConst1), parseInt((topLeft[1] + bottomLeft[1]) / 2 + changeConst2)];

    var points = [bottomLeft, Blr, bottomRight, btR, topLeft, Trl, topRight, tbL];

    var points2 = [bottomLeft, Blr, bottomRight, btR, topLeft, Trl, topRight, tbL];

    if (false) {

        ctx.fillStyle = "white";
        for (var i = 0; i < points.length; i++) {
            ctx.fillRect(points[i][0] - right, points[i][1], 6, 6);
        }

        ctx.fillStyle = "orange";
        for (var i = 0; i < points.length; i++) {
            ctx.fillRect(points[i][0], points[i][1], 6, 6);
        }


        ctx.fillStyle = "black";
    }// draw collision dots

    return points2;


}

function GetBotPoints(id) {
    let bot = document.getElementById("bot" + id);

    var IncRad = 0;
    if (bot.style.transform.includes("rotate")) {
        IncRad = -1 * parseFloat(bot.style.transform.substring(bot.style.transform.indexOf("rotate") + 7, bot.style.transform.indexOf("deg"))) * Math.PI / 180;
    }

    var playerWidth = parseFloat(bot.style.width);
    var playerHeight = parseFloat(bot.style.height);

    var changeConst1 = playerWidth * 0.2 * Math.cos(IncRad);
    var changeConst2 = playerWidth * 0.2 * Math.sin(IncRad);


    var bottomLeft = [parseInt(parseFloat(bot.style.left) + (1 - Math.cos(IncRad)) * playerWidth / 2 + changeConst1), (parseFloat(bot.style.top) + playerHeight / 2 + Math.sin(IncRad) * playerWidth / 2 - changeConst2 - GLOBAL_OFFSET_Y)];
    var bottomRight = [parseInt(parseFloat(bot.style.left) + (1 + Math.cos(IncRad)) * playerWidth / 2 - 1.5 * changeConst1), (parseFloat(bot.style.top) + playerHeight / 2 - Math.sin(IncRad) * playerWidth / 2 + changeConst2 - GLOBAL_OFFSET_Y)];
    var topLeft = [parseInt(parseFloat(bot.style.left) + (1 - Math.cos(IncRad)) * playerWidth / 2 - Math.sin(IncRad) * playerHeight / 2 + 1.4 * changeConst1), parseInt(parseFloat(bot.style.top) + (1 - Math.cos(IncRad)) * playerHeight / 2 + Math.sin(IncRad) * playerWidth / 2 - changeConst2) - GLOBAL_OFFSET_Y];
    var topRight = [parseInt(parseFloat(bot.style.left) + (1 + Math.cos(IncRad)) * playerWidth / 2 - Math.sin(IncRad) * playerHeight / 2 - 1.6 * changeConst1), parseInt(parseFloat(bot.style.top) + (1 - Math.cos(IncRad)) * playerHeight / 2 - Math.sin(IncRad) * playerWidth / 2 + 1.6 * changeConst2) - GLOBAL_OFFSET_Y];

    var Blr = [parseInt((bottomLeft[0] + bottomRight[0]) / 2), ((bottomLeft[1] + bottomRight[1]) / 2)];
    var btR = [parseInt((bottomRight[0] + topRight[0]) / 2 + 1.3 * changeConst1), parseInt((bottomRight[1] + topRight[1]) / 2 - changeConst2)];
    var Trl = [parseInt((topRight[0] + topLeft[0]) / 2), parseInt((topRight[1] + topLeft[1]) / 2)];
    var tbL = [parseInt((topLeft[0] + bottomLeft[0]) / 2 - 1.3 * changeConst1), parseInt((topLeft[1] + bottomLeft[1]) / 2 + changeConst2)];

    var points = [bottomLeft, Blr, bottomRight, btR, topLeft, Trl, topRight, tbL];

    var points2 = [bottomLeft, Blr, bottomRight, btR, topLeft, Trl, topRight, tbL];

    if (false) {

        ctx.fillStyle = "white";
        for (var i = 0; i < points.length; i++) {
            ctx.fillRect(points[i][0] - right, points[i][1], 6, 6);
        }

        ctx.fillStyle = "orange";
        for (var i = 0; i < points.length; i++) {
            ctx.fillRect(points[i][0], points[i][1], 6, 6);
        }


        ctx.fillStyle = "black";
    }// draw collision dots

    return points2;


}

function IsCollidingDeath() {
    var points = GetPlayerPoints();

    for (var i = 0; i < points.length; i++) {

        for (var j = -RANGE; j < RANGE; j++) {
            if (points[i][0] + j > 0 && points[i][0] + j < deathMap.length) {
                //point exists


                if (points[i][1] > deathMap[points[i][0] + j][0] && points[i][1] < deathMap[points[i][0] + j][1]) {
                    return true;
                }
            }

        }
    }

    return false;
}

function IsBotCollidingDeath(id) {
    var points = GetBotPoints(id);

    for (var i = 0; i < points.length; i++) {

        for (var j = -RANGE; j < RANGE; j++) {
            if (points[i][0] + j > 0 && points[i][0] + j < deathMap.length) {
                //point exists


                if (points[i][1] > deathMap[points[i][0] + j][0] && points[i][1] < deathMap[points[i][0] + j][1]) {
                    return true;
                }
            }

        }
    }

    return false;
}



// Helper function to check circle-line intersection
function circleIntersectsLine(circle, start, end) {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];

    const circleRadius = parseInt(circle.style.height) / 2;

    const fx = start[0] - (parseInt(circle.style.left) + circleRadius);
    const fy = start[1] - (parseInt(circle.style.top) + circleRadius - GLOBAL_OFFSET_Y);

    const a = dx ** 2 + dy ** 2;
    const b = 2 * (fx * dx + fy * dy);
    const c = fx ** 2 + fy ** 2 - circleRadius ** 2;

    const discriminant = b ** 2 - 4 * a * c;

    if (discriminant < 0) {
        return false; // No intersection
    }

    // Check if the intersection points are on the line segment
    const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
    const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);

    return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
}


function IsCollidingCoins() {
    var coins = document.querySelectorAll('.coin');
    for (var i = 0; i < coins.length; i++) {
        var collidingCoinID = IsCollidingCoin(coins[i].id);
        if (collidingCoinID.length > 0) {
            return collidingCoinID;
        }
    }
    return "";
}

function IsBotCollidingCoins(id) {
    var coins = document.querySelectorAll('.coin');
    for (var i = 0; i < coins.length; i++) {
        var collidingCoinID = IsBotCollidingCoin(id, coins[i].id);
        if (collidingCoinID.length > 0) {
            return collidingCoinID;
        }
    }
    return "";
}

function IsCollidingCoin(CoinID) {


    var Coin = document.getElementById(CoinID);

    var CoinRadius = parseInt(Coin.style.height) / 2;
    var CoinX = parseInt(Coin.style.left) + CoinRadius;
    var CoinY = parseInt(Coin.style.top) + CoinRadius - GLOBAL_OFFSET_Y;

    var playerPoints = GetPlayerPoints();
    for (var j = 0; j < playerPoints.length; j++) {
        var dist = Math.sqrt((playerPoints[j][0] - CoinX) ** 2 + (playerPoints[j][1] - CoinY) ** 2);
        if (dist <= CoinRadius) {
            return CoinID;
        }

        const start = playerPoints[j];
        const end = playerPoints[(j + 1) % playerPoints.length]; // Loop back to the first point
        if (circleIntersectsLine(Coin, start, end)) {
            return CoinID; // Circle intersects an edge
        }
    }
    return "";
}

function IsBotCollidingCoin(botId, CoinID) {


    var Coin = document.getElementById(CoinID);

    var CoinRadius = parseInt(Coin.style.height) / 2;
    var CoinX = parseInt(Coin.style.left) + CoinRadius;
    var CoinY = parseInt(Coin.style.top) + CoinRadius - GLOBAL_OFFSET_Y;

    var playerPoints = GetBotPoints(botId);
    for (var j = 0; j < playerPoints.length; j++) {
        var dist = Math.sqrt((playerPoints[j][0] - CoinX) ** 2 + (playerPoints[j][1] - CoinY) ** 2);
        if (dist <= CoinRadius) {
            return CoinID;
        }

        const start = playerPoints[j];
        const end = playerPoints[(j + 1) % playerPoints.length]; // Loop back to the first point
        if (circleIntersectsLine(Coin, start, end)) {
            return CoinID; // Circle intersects an edge
        }
    }
    return "";
}

function ResetGame() {
    player.style.left = '-102px';
    player.style.top = '308px';
    player.style.transform = 'rotate(0deg)';

    var coins = document.querySelectorAll('.coin');
    for (var i = 0; i < coins.length; i++) {
        var Coin = document.getElementById(coins[i].id);
        Coin.style.visibility = "visible";
    }

    scalePlayer(1 / playerScale);
    playerScale = 1;

    if (right < 0) {
        right = -right;
    }

    Deaths++;
    DrawFunc();
}


function ResetBot(id, is_win=false) {
    let bot = document.getElementById("bot" + id);
    
    var points = GetBotPoints(id);
    var botCenterX = points[1][0];
    var legsHeight = points[1][1];


    
    var death_point = calculator.pixelsToMath({ 
        x: (botCenterX - parseInt(elt.style.left)), 
        y: (legsHeight + GLOBAL_OFFSET_Y - parseInt(elt.style.top))
    });
    var death_x = death_point.x;
    var death_y = death_point.y;
    

    bot.style.left = '-102px';
    bot.style.top = '308px';
    bot.style.transform = 'rotate(0deg)';
    bot.style.visibility = 'hidden';
    bot.setAttribute("dead", true);
    bot.setAttribute("death_x", death_x);
    

    var coins = document.querySelectorAll('.coin');
    for (var i = 0; i < coins.length; i++) {
        var Coin = document.getElementById(coins[i].id);
        Coin.style.visibility = "visible";
    }

    scaleBot(id, 1 / playerScale);
    bot.setAttribute("shcale", 1);

    if (parseInt(bot.getAttribute("moveRight")) < 0) {
        bot.setAttribute("moveRight", -parseInt(bot.getAttribute("moveRight")));
    }

    if (bot.getAttribute("HasTouchedFunction") != "true") {
        min_dists[id] = 10000;
    }

    if (bot.getAttribute("DiedToWall") == "true" && Math.abs(death_y - evaluateMathExpr(chrom_strings[id], death_x)) < 0.1) {
        avoid_points.push([death_x, death_y]);
    }
    console.log(avoid_points);

    if (id == clickedBotId) {
        bot.classList.remove('highlighted');
        clickedBotId = -1;
    }
    
    // let flitered_func = FilterExpression(MQtoAM(chrom_strings[id]));

    bot.setAttribute("moveRight", parseInt(bot.getAttribute("moveRight")) * (1 + 0.1 / current_generation));

    var rate = 0;
    try {
        rate = 1 / min_dists[id];
    }
    catch (error) {
        console.error(error);
    } console.log((botFinishCounter + 1) + ") id: " + id + ", dist: " + min_dists[id].toFixed(2));

    chroms[id][1] = rate;


    
    
    if (botFinishCounter + 1 == POPULATION) {
        botFinishCounter = 0;
        clickedBotId = -1;
        //sort by highest to lowest (NaN is highest)
        chroms.sort((a, b) => {
            return b[1] - a[1];
        });
        og_func = pointsToFunction(chroms[0][0]);
        flitered_func = FilterExpression(MQtoAM(og_func)); 
        ;console.log("GEN " + current_generation + " OVER, best func's id: " + id + ", y = " + og_func + ", with dist: " + (1 / chroms[0][1]).toFixed(2));
        
        if (!is_win) {
            for (var i = 0; i < POPULATION; i++) {
                let tempBot = document.getElementById("bot" + i);
                tempBot.style.visibility = "visible"
                tempBot.setAttribute("dead", false);
                
                let func_str = pointsToFunction(chroms[i][0])
                MQ.MathField(input, { spaceBehavesLikeTab: true }).latex(func_str);
                input.style.width = Math.max(func_str.length * 17, 200) + 'px';

                tempBot.setAttribute("HasTouchedFunction", false);
            }

            newChromGeneration();
        }
    }
    else {
        
        botFinishCounter++;
    }


    min_dists[id] = getDistance();
    

    Deaths++;
    DrawFunc();
}


function transformLogExpression(expression) {
    // Regular expression to match logs with nested parentheses in the base or argument
    const logPattern = /log_\(([^()]+|\((?:[^)(]+|\([^)(]*\))*\))\)\(([^()]+)\)|log_([^\W_]+)\(([^()]+)\)|log\(([^()]+)\)|log([^\W_]+)|ln\(([^()]+)\)/g;

    function replaceLogs(match, baseWithParens, argWithParens, baseSimple, argSimple, logWithParens, simpleLog, lnArgument) {
        if (baseWithParens && argWithParens) {
            // Case: log_((base))(argument) or log_(base)(argument)
            const base = transformLogExpression(baseWithParens);
            const argument = transformLogExpression(argWithParens);
            return `log(${argument}, ${base})`;
        } else if (baseSimple && argSimple) {
            // Case: log_base(argument)
            const base = transformLogExpression(baseSimple);
            const argument = transformLogExpression(argSimple);
            return `log(${argument}, ${base})`;
        } else if (logWithParens) {
            // Case: log(argument) with default base 10
            const argument = transformLogExpression(logWithParens);
            return `log(${argument}, 10)`;
        } else if (simpleLog) {
            // Case: logX with default base 10
            const argument = transformLogExpression(simpleLog);
            return `log(${argument}, 10)`;
        } else if (lnArgument) {
            // Case: ln(argument) -> log(argument, e)
            const argument = transformLogExpression(lnArgument);
            return `log(${argument}, e)`;
        }
        return match; // Return unchanged if it doesn't match
    }

    return expression.replace(logPattern, replaceLogs);
}

function FilterExpression(exp) {
    var newExpr = "";
    for (var i = 0; i < exp.length; i++) {

        if (i > 0 && (exp[i] == 'x' || exp[i] == 's' || exp[i] == '(') && ((parseInt(exp[i - 1]) >= 0 && parseInt(exp[i - 1]) <= 9) || exp[i - 1] == 'x')) {

            newExpr += '*';
        }
        if (exp[i] == 'X') {
            newExpr += 'x'
        }
        else if (exp[i] != ' ') {
            newExpr += exp[i];
        }

    }
    newExpr = transformLogExpression(newExpr);

    return newExpr;
}

function FilterExpression2(exp) {
    var newExpr = "";
    for (var i = 0; i < exp.length - 1; i++) {
        if (exp[i] == 'p' && exp[i + 1] == 'i') {
            newExpr += "\\";
        }
        newExpr += exp[i];
    }


    return newExpr + exp[exp.length - 1];
}



function scalePlayer(factor) {
    // Calculate new width and height
    const currentWidth = parseFloat(player.style.width);
    const currentHeight = parseFloat(player.style.height);
    const newWidth = currentWidth * factor;
    const newHeight = currentHeight * factor;

    // Adjust position to maintain center
    const widthDiff = (currentWidth - newWidth) / 2;
    const heightDiff = (currentHeight - newHeight) / 2;

    player.style.width = `${newWidth}px`;
    player.style.height = `${newHeight}px`;
    player.style.left = `${parseFloat(player.style.left) + widthDiff}px`;
    player.style.top = `${parseFloat(player.style.top) + heightDiff}px`;
}

function scaleBot(id, factor) {
    let bot = document.getElementById("bot" + id);

    // Calculate new width and height
    const currentWidth = parseFloat(bot.style.width);
    const currentHeight = parseFloat(bot.style.height);
    const newWidth = currentWidth * factor;
    const newHeight = currentHeight * factor;

    // Adjust position to maintain center
    const widthDiff = (currentWidth - newWidth) / 2;
    const heightDiff = (currentHeight - newHeight) / 2;

    bot.style.width = `${newWidth}px`;
    bot.style.height = `${newHeight}px`;
    bot.style.left = `${parseFloat(bot.style.left) + widthDiff}px`;
    bot.style.top = `${parseFloat(bot.style.top) + heightDiff}px`;
}

function IsPointOnPlayer(pointX, pointY) {
    function crossProduct(p1, p2, p3) {
        return (p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0]);
    }

    var points = GetPlayerPoints();

    var BottomLeft = points[0];
    var BottomRight = points[2];
    var TopLeft = points[4];
    var TopRight = points[6];

    let cross1 = crossProduct(BottomLeft, BottomRight, [pointX, pointY]);
    let cross2 = crossProduct(BottomRight, TopLeft, [pointX, pointY]);
    let cross3 = crossProduct(TopLeft, TopRight, [pointX, pointY]);
    let cross4 = crossProduct(TopRight, BottomLeft, [pointX, pointY]);

    let hasPositive = cross1 > 0 || cross2 > 0 || cross3 > 0 || cross4 > 0;
    let hasNegative = cross1 < 0 || cross2 < 0 || cross3 < 0 || cross4 < 0;

    return !(hasPositive && hasNegative);
}

function IsPointOnBot(id, pointX, pointY) {
    function crossProduct(p1, p2, p3) {
        return (p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0]);
    }

    var points = GetBotPoints(id);

    var BottomLeft = points[0];
    var BottomRight = points[2];
    var TopLeft = points[4];
    var TopRight = points[6];

    let cross1 = crossProduct(BottomLeft, BottomRight, [pointX, pointY]);
    let cross2 = crossProduct(BottomRight, TopLeft, [pointX, pointY]);
    let cross3 = crossProduct(TopLeft, TopRight, [pointX, pointY]);
    let cross4 = crossProduct(TopRight, BottomLeft, [pointX, pointY]);

    let hasPositive = cross1 > 0 || cross2 > 0 || cross3 > 0 || cross4 > 0;
    let hasNegative = cross1 < 0 || cross2 < 0 || cross3 < 0 || cross4 < 0;

    return !(hasPositive && hasNegative);
}

function GetPlatformY(X) {
    var Y_values = [];

    for (var i = 0; i < platforms.length; i++) {
        var platform = platforms[i];

        var point1 = platform[0];
        var point2 = platform[1];

        var leftPoint = point1[0] < point2[0] ? point1 : point2;

        var rightPoint = point1[0] > point2[0] ? point1 : point2;

        var platInc = (point1[1] - point2[1]) / (point1[0] - point2[0]);

        if (leftPoint[0] < X && X < rightPoint[0]) {
            Y_values.push([i, leftPoint[1] + platInc * (X - leftPoint[0])]);
        }


    }
    return Y_values;
}

function IsOnPlatform() {
    var points = GetPlayerPoints();

    var playerX = points[1][0];
    var playerY = points[1][1];

    var Y_values = GetPlatformY(playerX);

    for (var i = 0; i < Y_values.length; i++) {
        if (inRange(Y_values[i][1], playerY + GLOBAL_OFFSET_Y)) {
            return Y_values[i][0];
        }
    }

    return -1;
}

function IsBotOnPlatform(id) {
    var points = GetBotPoints(id);

    var playerX = points[1][0];
    var playerY = points[1][1];

    var Y_values = GetPlatformY(playerX);

    for (var i = 0; i < Y_values.length; i++) {
        if (inRange(Y_values[i][1], playerY + GLOBAL_OFFSET_Y)) {
            return Y_values[i][0];
        }
    }

    return -1;
}

function GetPlatformIncline() {
    var points = GetPlayerPoints();

    var playerX = points[1][0];
    var playerY = points[1][1];

    var Y_values = GetPlatformY(playerX);

    for (var i = 0; i < Y_values.length; i++) {
        if (inRange(Y_values[i][1], playerY + GLOBAL_OFFSET_Y)) {
            var next_Y_values = GetPlatformY(playerX + right);
            for (var j = 0; j < next_Y_values.length; j++) {
                if (Y_values[i][0] == next_Y_values[j][0]) {
                    return next_Y_values[j][1] - Y_values[i][1];
                }
            }
        }
    }


    return 0;
}

function GetBotPlatformIncline(id) {
    var points = GetBotPoints(id);

    var botX = points[1][0];
    var botY = points[1][1];

    var Y_values = GetPlatformY(botX);

    for (var i = 0; i < Y_values.length; i++) {
        if (inRange(Y_values[i][1], botY + GLOBAL_OFFSET_Y)) {
            var next_Y_values = GetPlatformY(botX + right);
            for (var j = 0; j < next_Y_values.length; j++) {
                if (Y_values[i][0] == next_Y_values[j][0]) {
                    return next_Y_values[j][1] - Y_values[i][1];
                }
            }
        }
    }


    return 0;
}

function HeadHitPlatform() {
    var points = GetPlayerPoints();

    var TopLeft = points[4];
    var TopRight = points[6];
    var CenterRight = points[3];


    for (var i = 0; i < platforms.length; i++) {
        var platform = platforms[i];

        var point1 = platform[0];
        var point2 = platform[1];

        if (Math.max(TopRight[0], CenterRight[0]) > Math.min(point1[0], point2[0]) && TopLeft[0] < Math.max(point1[0], point2[0])) {
            var platInc = (point1[1] - point2[1]) / (point1[0] - point2[0]);
            var hitY1 = platInc * (TopLeft[0] - point1[0]) + point1[1] - GLOBAL_OFFSET_Y;
            var hitY2 = platInc * (TopRight[0] - point1[0]) + point1[1] - GLOBAL_OFFSET_Y;
            var hitY3 = platInc * (CenterRight[0] - point1[0]) + point1[1] - GLOBAL_OFFSET_Y;

            if (inRange(hitY1, TopLeft[1]) && hitY1 < TopRight[1]) {
                return true;
            }
            if (inRange(hitY2, TopRight[1])) {
                return true;
            }
            if (inRange(hitY3, CenterRight[1])) {
                return true;
            }

        }
    }
    return false;
}

function BotHeadHitPlatform(id) {
    var points = GetBotPoints(id);

    var TopLeft = points[4];
    var TopRight = points[6];
    var CenterRight = points[3];


    for (var i = 0; i < platforms.length; i++) {
        var platform = platforms[i];

        var point1 = platform[0];
        var point2 = platform[1];

        if (Math.max(TopRight[0], CenterRight[0]) > Math.min(point1[0], point2[0]) && TopLeft[0] < Math.max(point1[0], point2[0])) {
            var platInc = (point1[1] - point2[1]) / (point1[0] - point2[0]);
            var hitY1 = platInc * (TopLeft[0] - point1[0]) + point1[1] - GLOBAL_OFFSET_Y;
            var hitY2 = platInc * (TopRight[0] - point1[0]) + point1[1] - GLOBAL_OFFSET_Y;
            var hitY3 = platInc * (CenterRight[0] - point1[0]) + point1[1] - GLOBAL_OFFSET_Y;

            if (inRange(hitY1, TopLeft[1]) && hitY1 < TopRight[1]) {
                return true;
            }
            if (inRange(hitY2, TopRight[1])) {
                return true;
            }
            if (inRange(hitY3, CenterRight[1])) {
                return true;
            }

        }
    }
    return false;
}

function DoCoinEffect(collidingCoinID) {
    const scaleDiff = 0.5;


    if (collidingCoinID.includes("small")) {
        playerScale *= scaleDiff;
        scalePlayer(scaleDiff);
    }
    else if (collidingCoinID.includes("big")) {
        playerScale /= scaleDiff;
        scalePlayer(1 / scaleDiff);
    }
    else if (collidingCoinID.includes("turner")) {
        right = -right;
    }
    else if (collidingCoinID.includes("boost")) {
        IsBoosted = true;
    }
}

function DoCoinEffectBot(id, collidingCoinID) {
    const scaleDiff = 0.5;
    
    let bot = document.getElementById("bot" + id);


    if (collidingCoinID.includes("small")) {
        bot.setAttribute("shcale", parseInt(bot.getAttribute("shcale")) * scaleDiff) ;
        scalePlayer(scaleDiff);
    }
    else if (collidingCoinID.includes("big")) {
        bot.setAttribute("shcale", parseInt(bot.getAttribute("shcale")) / scaleDiff) ;
        scalePlayer(1 / scaleDiff);
    }
    else if (collidingCoinID.includes("turner")) {
        bot.setAttribute("moveRight", -parseInt(bot.getAttribute("moveRight"))) ;
    }
    else if (collidingCoinID.includes("boost")) {
        bot.setAttribute("IsBoosted", true) ;
    }
}

function getDistance() {
    var points = GetPlayerPoints();

    var playerPoint = points[1];

    var doorPoint = [parseInt(door.style.left) + parseInt(door.style.width) / 2, parseInt(door.style.top) + parseInt(door.style.height) / 2 - GLOBAL_OFFSET_Y];

    var distance = Math.sqrt((playerPoint[0] - doorPoint[0]) ** 2 + (playerPoint[1] - doorPoint[1]) ** 2)

    // console.log("player: " + playerPoint);
    // console.log("door: " + doorPoint);
    // console.log("distance: " + distance);
    // console.log("min_dist: " + min_dist);
    // console.log(" ");

    return distance;
}

function getBotDistance(id) {
    var points = GetBotPoints(id);

    var botPoint = points[1];

    var doorPoint = [parseInt(door.style.left) + parseInt(door.style.width) / 2, parseInt(door.style.top) + parseInt(door.style.height) / 2 - GLOBAL_OFFSET_Y];

    var distance = Math.sqrt((botPoint[0] - doorPoint[0]) ** 2 + (botPoint[1] - doorPoint[1]) ** 2)

    // console.log("player: " + playerPoint);
    // console.log("door: " + doorPoint);
    // console.log("distance: " + distance);
    // console.log("min_dist: " + min_dist);
    // console.log(" ");

    return distance;
}

function mutateChrom(chrom) {

    for (var i = 0; i < chrom.length; i++) {
        if (Math.random() < 1 / chrom.length) {
            chrom[i] = [randomNormalBetween(Math.max(chrom[i][0] - 0.5, -7), Math.min(chrom[i][0] + 0.5, 7)), randomNormalBetween(Math.max(chrom[i][1] - 0.5, -5), Math.min(chrom[i][1] + 0.5, 2))];
        }
    }

    return chrom;
}

function chooseByWheel(options) {
    let totalWeight = options.reduce((sum, option) => sum + option[1], 0);
    let randomValue = Math.random() * totalWeight;
    for (let [item, weight] of options) {
        if (randomValue < weight) return item;
        randomValue -= weight;
    }
}

function newChromGeneration() {
    current_generation++;

    var filtered_chroms = [];
    for (var i = 0; i < chroms.length ; i++) {
        if (chroms[i][1] > 0.0002) {
            filtered_chroms.push(chroms[i].slice());
        }
    }
    var new_chroms = [];
    var new_chrom_strings = [];
    if (filtered_chroms.length > 0) {
        new_chroms.push([filtered_chroms[0][0], 0]);
        new_chrom_strings.push(pointsToFunction(filtered_chroms[0][0]));
    }

    for (var i = 0; i < filtered_chroms.length - 1; i++) {
        let choice_chrom = [chooseByWheel(filtered_chroms), 0];

        let id = 0;
        
        for (; id < filtered_chroms.length; id++) {
            if (filtered_chroms[id][0] == choice_chrom[0]) {
                break;
            }
            if (id == filtered_chroms.length - 1) {
                console.error("PROBLEM");
            }
        }
        
        let bot = document.getElementById("bot" + id);
        let death_x = bot.getAttribute("death_x") / 100;

        let child = [[], 0];
        for (var j = 0; j < choice_chrom[0].length; j++) {
            let point = choice_chrom[0][j];
            if (j < choice_chrom[0].length - 1 && point[0] < death_x && choice_chrom[0][j+1][0] > death_x) {
                if (death_x - point[0] < 1) {
                    child[0].push([point[0], getGoodY(point[0])]);
                }
                else {
                    child[0].push([death_x, getGoodY(death_x)]);
                }
            }
            else {
                child[0].push(point);
            }
        }
        
        if (Math.random() < MUTATION_RATE) {
            child = mutateChrom(child);
        }

        new_chroms.push(child);
        new_chrom_strings.push(pointsToFunction(child[0]));
    }

    let padding_len = POPULATION - new_chroms.length
    for (var i = 0; i < padding_len; i++) {
        let chrom = generateFunctionPoints();
        new_chroms.push([chrom, 0]);
        new_chrom_strings.push(pointsToFunction(chrom));
    }

    
    
    chroms = new_chroms.slice();
    chrom_strings = new_chrom_strings.slice();
}

function getGoodY(x) {
    let y = randomNormalBetween(-5, 2);
    let good = false;
    while (!good) {
        good = true;
        for (var i = 0; i < avoid_points.length; i++) {
            if (Math.sqrt((x - avoid_points[i][0]) ** 2 + (y - avoid_points[i][1]) ** 2) < 0.1) {
                good = false;
                y = randomNormalBetween(-5, 2);
            }
        }
    }
    return y
}

function rateChroms() {


    //sort by highest to lowest (NaN is highest)
    chroms.sort((a, b) => {
        return b[1] - a[1];
    });
}

function Play() {

    var answerMathField = MQ.MathField(input, {
        handlers: {
            edit: function () {
                enteredMath = answerMathField.latex(); // Get entered math in LaTeX format
            }
        }
    });
    const validPattern = /^[a-zA-Z0-9\s\-.,+*/=(){}[\]]*$/;
    if (!validPattern.test(input.value)) {
        console.error("Invalid characters detected")
    }


    expr = FilterExpression(MQtoAM(String(enteredMath)));
    var expr2 = FilterExpression2(enteredMath);

    input.style.width = Math.max(expr.length * 17, 200) + 'px';

    if ((expr != last || start) && !AI_mode) {
        calculator.setExpression({
            id: 'playerFunc',
            latex: 'y=' + expr2,
        });

        DrawFunc();


        if (expr2 == String.raw`\int_{ }^{ }\sqrt{∞}\\piθσ\sum_{ }^{ }Δ` || expr2 == String.raw`\int_{ }^{ }\sqrt{\infty}\\pi\theta\sigma\sum_{ }^{ }\Delta`) {

            window.location.href = `../nothing_to_see_here/puzz.html`;
        }
    }


    if (DoorRight * (2 * parseInt(door.style.left) + parseInt(door.style.width) - window.innerWidth + 2 * offsetX) > parseInt(door.style.left) + parseInt(door.style.width) + offsetX) {
        exitArrow.setAttribute("src", "../Images/exit-arrow-" + (DoorRight ? "right" : "left") + ".png");
        exitArrow.setAttribute("class", "arrow-" + (DoorRight ? "right" : "left"));
        exitArrow.style.visibility = "visible";
        exitArrow.style.left = (DoorRight * (window.innerWidth - parseInt(exitArrow.style.width) - 20) - offsetX + 10) + "px"
        exitArrow.style.top = Math.min(Math.max(parseInt(door.style.top) + 65, - offsetY + 10), window.innerHeight - offsetY - parseInt(exitArrow.style.height) - 10) + "px"

    }
    else {
        exitArrow.style.visibility = "hidden";
    }

    if (parseInt(door.style.top) + parseInt(door.style.height) - 65 < - offsetY) {
        exitArrow.setAttribute("src", "../Images/exit-arrow-up.png");
        exitArrow.setAttribute("class", "arrow-up");
        exitArrow.style.visibility = "visible";
        exitArrow.style.top = (- offsetY + 10) + "px"
        exitArrow.style.left = parseInt(door.style.left) - 20 + "px"
        if (parseInt(door.style.left) + parseInt(door.style.width) > window.innerWidth - offsetX - 10) {

            exitArrow.style.left = DoorRight * (window.innerWidth - parseInt(exitArrow.style.width) - 20) - offsetX + 10 + "px"
        }
        if (parseInt(door.style.left) < - offsetX + 30) {
            exitArrow.style.left = DoorRight * -40 - offsetX + 20 + "px"
        }
        returnLeft = window.innerWidth - offsetX - 300;
        returnHeight = 50;
        if (parseInt(door.style.left) + parseInt(door.style.width) > returnLeft) {
            exitArrow.style.top = - offsetY + returnHeight + 20 + "px";
        }
        if (parseInt(door.style.left) < 150 - offsetX) {
            exitArrow.style.top = - offsetY + returnHeight + 120 + "px";
        }
    }
    else if (parseInt(door.style.top) > window.innerHeight - offsetY) {
        exitArrow.setAttribute("src", "../Images/exit-arrow-down.png");
        exitArrow.setAttribute("class", "arrow-down");
        exitArrow.style.visibility = "visible";
        exitArrow.style.top = (window.innerHeight - offsetY - parseInt(exitArrow.style.height) - 10) + "px"
        exitArrow.style.left = parseInt(door.style.left) - 20 + "px"
        if (parseInt(door.style.left) + parseInt(door.style.width) > window.innerWidth - offsetX - 10) {

            exitArrow.style.left = DoorRight * (window.innerWidth - parseInt(exitArrow.style.width) - 20) - offsetX + 10 + "px"
        }
        if (parseInt(door.style.left) < - offsetX + 30) {
            exitArrow.style.left = DoorRight * -20 - offsetX + 10 + "px"
        }
    }

    if (parseInt(returnButton.style.left) != window.innerWidth - 20){
        returnButton.style.left = window.innerWidth - 20 + "px";
    }
    

    if (!pause) {
        if (AI_mode){
            for (var turn = 0; turn < 5; turn++) {
                let max_bot_x = 0;
                let max_bot_x_id = 0;


                for (var botId = 0; botId < POPULATION; botId++) {
                    let bot = document.getElementById("bot" + botId);
                    if (bot.getAttribute("dead") != "true") {
                        var points = GetBotPoints(botId);
        
                        var botCenterX = parseInt(parseFloat(bot.style.left) + parseFloat(bot.style.width) / 2);
                        if (botCenterX > max_bot_x && botId != max_bot_x_id) {
                            // console.log(botCenterX, max_bot_x, botId, max_bot_x_id);
                            max_bot_x = botCenterX;
                            max_bot_x_id = botId;
                        }
                        var legsHeight = points[1][1];
                        
                        var botRight = parseInt(bot.getAttribute("moveRight")) / 100;
                        var botVel = parseInt(bot.getAttribute("vel")) / 100;
                        
                        var funcY_atBotX = GetBotFuncY(botId, botCenterX);
                        
                        var moveY = botVel, moveX = botRight;
                        var baseIncline = map[botCenterX + Math.round(botRight)] - map[botCenterX];
                        var funcIncline = GetBotFuncY(botId, botCenterX + botRight) - funcY_atBotX;
                        var platIncline = GetBotPlatformIncline(botId);
                        var upperBounds = parseInt(bot.getAttribute("upperBounds"));
                        var isOnFunction = bot.getAttribute("IsOnFunction") == "true";
                        var IsBotBoosted = bot.getAttribute("IsBoosted") == "true";
                        
                        var IncDeg = 0;
                        if (bot.style.transform.includes("rotate")) {
                            IncDeg = parseFloat(bot.style.transform.substring(bot.style.transform.indexOf("rotate") + 7, bot.style.transform.indexOf("deg")));
                        }
                        
            
                        if (baseIncline / botRight > 5) {
                            baseIncline = 0;
                        }
                
                        if (funcIncline > 800) {
                            funcIncline = 0;
                        }
        
                        current_dist = getBotDistance(botId);
                        if (current_dist < min_dists[botId]) {
                            min_dists[botId] = current_dist
                        }
                        else if (current_dist > min_dists[botId] + 50) {
                            ResetBot(botId);
                        }
        
        
        

                        // console.log(legsHeight, funcY_atBotX, funcIncline);


                        

                        if (legsHeight > 2860 && botCenterX < 900) {
                            // console.log("BEFORE:", botId, legsHeight, funcY_atBotX, map[botCenterX]);
                        }
        
                        const printActions = false;
                        if (botCenterX < 50) {
                            //start of map
                            if (printActions) {console.log("start");
                            }
                            moveY = playerStartY - legsHeight - RANGE / 2;
                            botVel = 0;
                        }
                        else if (IsBotBoosted) {
                            if (printActions) {console.log("boost");
                            }
                            IsBotBoosted = false;
                            bot.setAttribute("IsBoosted", false);
                            botVel = -8;
                            moveY += botVel;
                        }
                        else if (IsBotOnPlatform(botId) >= 0) {
                            //something with platform

                            if (inRange(legsHeight, funcY_atBotX)) {
                                //switch between function and platform
                                if (printActions) {console.log("switch func-plat");
                                }
                    
                                moveY += Math.min(funcIncline, platIncline) - botVel;
                                if (platIncline >= funcIncline && inRange(legsHeight - 1, funcY_atBotX)) {
                                    moveY -= 1;
                                }
                                botVel = 0;
                    
                                bot.style.transform = 'rotate(' + (botRight / Math.abs(botRight)) * Math.atan(Math.min(funcIncline, baseIncline) / botRight) * 180 / Math.PI + 'deg)';
                        
                            }
                            else if (inRange(legsHeight, map[botCenterX])) {
                                //switch between function and platform
                                if (printActions) {console.log("switch base-plat");
                                }
                    
                                moveY += Math.min(baseIncline, platIncline) - botVel;
                                if (platIncline >= baseIncline && inRange(legsHeight - 1, map[botCenterX])) {
                                    moveY -= 1;
                                }
                                botVel = 0;
                    
                                bot.style.transform = 'rotate(' + (botRight / Math.abs(botRight)) * Math.atan(Math.min(platIncline, baseIncline) / botRight) * 180 / Math.PI + 'deg)';
                            }
                            else {
                                
                                //walk on platform
                                if (printActions) {console.log("walk platform");
                                }
                    
                                moveY += platIncline - botVel;
                                botVel = 0;
                    
                    
                                bot.style.transform = 'rotate(' + Math.atan(platIncline) * 180 / Math.PI + 'deg)';
                            
                            }
                        }
                        else if (inRange(funcY_atBotX, map[botCenterX]) && inRange(legsHeight, map[botCenterX])) {
                            //switch between function and base
                            if (printActions) {console.log("switch func-base");
                            }
                            moveY += Math.min(funcIncline, baseIncline) - botVel;
                            if (funcIncline == Math.min(funcIncline, baseIncline) && inRange(legsHeight - 1, funcY_atBotX)) {
                                moveY -= 1;
                            }
                            botVel = 0;

                            
                
                            bot.style.transform = 'rotate(' + (botRight / Math.abs(botRight)) * Math.atan(Math.min(funcIncline, baseIncline) / botRight) * 180 / Math.PI + 'deg)';
                        }
                        else if (inRange(legsHeight, funcY_atBotX)) {
                            //walk on function
                            if (printActions) {console.log("walk func");
                            }
                            isOnFunction = true;
                            bot.setAttribute("IsOnFunction", true);
                            bot.setAttribute("HasTouchedFunction", true);
                            
                            moveY += funcIncline - botVel;
                            botVel = 0;
                            upperBounds = Math.min(150 * funcIncline / botRight, 0);
                            bot.setAttribute("upperBounds", upperBounds);
                
                            bot.style.transform = 'rotate(' + Math.atan(funcIncline / botRight) * 180 / Math.PI + 'deg)';
                        }
                        else if (inRange(points[0][1], map[points[0][0]]) || inRange(points[2][1], map[points[2][0]])) {
                            //walk on base
                            if (printActions) {console.log("walk base");
                            }
                
                            moveY += baseIncline - botVel;
                            botVel = 0;
                
                            bot.style.transform = 'rotate(' + Math.atan(baseIncline) * 180 / Math.PI + 'deg)';
                
                        }
                        else if (legsHeight < funcY_atBotX && legsHeight + vel > funcY_atBotX) {
                            //fall to function
                            if (printActions) {console.log("fall to func");
                            }
                            botVel = 0;
                            moveY = funcY_atBotX - legsHeight - RANGE;
                
                            bot.style.transform = 'rotate(' + (botRight / Math.abs(botRight)) * Math.atan(funcIncline / botRight) * 180 / Math.PI + 'deg)';
                        }
                        else {
                            //fall
                            if (printActions) {console.log("fall");
                            }
                
                
                            bot.style.transform = 'rotate(' + (IncDeg * 0.95) + 'deg)';
                            botVel += (ACC / 100) * botRight * botRight;
                            
                            // console.log(botId, legsHeight, funcY_atBotX, map[botCenterX]);
                
                        }
                        bot.setAttribute("vel", botVel * 100);
        
        
                        for (var i = 0; i < points.length; i++) {
                
                            if (points[i][1] < map[points[i][0] - botRight] && points[i][1] - RANGE > map[points[i][0] + botRight + 1]) {
                                moveX -= botRight;
                                if (moveY == botVel - (ACC / 100) * botRight * botRight) {
                                    moveY = 2;
                                    bot.style.transform = 'rotate(' + (IncDeg * 0.95) + 'deg)';
                                }
                                if (isOnFunction) {
                                    min_dists[botId] = 10000;
                                    ResetBot(botId);
                                }
                                break;
                
                            }
                        }
        
                        
                        if (BotHeadHitPlatform(botId)) {
                            if (printActions) {console.log("head hit platform");
                            }
                            moveX = 0;
                            if (moveY != botVel - (ACC / 100) * botRight * botRight) {
                                moveY = 0;
                            }
                            if (isOnFunction) {
                                min_dists[botId] = 10000;
                                ResetBot(botId);
                            }
                        }
                
                        for (var i = Math.min(points[4][0], points[7][0]); i < Math.max(points[2][0], points[3][0]) - botRight; i++) {
                            if (map[i] > points[2][1] && map[i + right] < points[2][1] - RANGE) {
                                moveX = i - Math.max(points[2][0], points[3][0]);
                                
                                if (isOnFunction) {
                                    min_dists[botId] = 10000;
                                    ResetBot(botId);
                                }
                            }
                        }
                

                        bot.style.top = parseFloat(bot.style.top) + moveY + 'px';
                        bot.style.left = parseFloat(bot.style.left) + moveX + 'px';
        
                        
                        var collidingCoinID = IsBotCollidingCoins(botId);
                        if (collidingCoinID.length > 0) {
                            var collidingCoin = document.getElementById(collidingCoinID);
                            if (collidingCoin.style.visibility != "hidden") {
                                collidingCoin.style.visibility = "hidden";
                                DoCoinEffectBot(botId, collidingCoinID);
                            }
                        }
                
                        if (legsHeight > LOWER_BOUNDS - 30 - GLOBAL_OFFSET_Y|| legsHeight < upperBounds - GLOBAL_OFFSET_Y) {// out of bounds - death
                
                            ResetBot(botId);
                        }
                        if (legsHeight > parseFloat(door.style.top) - GLOBAL_OFFSET_Y && legsHeight < parseFloat(door.style.top) + parseFloat(door.style.height) - GLOBAL_OFFSET_Y) {// win
                            if (botCenterX > parseFloat(door.style.left) + 50 * (botRight > 0) && botCenterX < parseFloat(door.style.left) + parseFloat(door.style.width) - 50 * (botRight < 0)) {
                
                                Deaths--;
                                ResetBot(botId, true);
                
                
                
                                ctx.fillStyle = "orange";
                                ctx.fillRect(i, GetBotFuncY(i), 6, 6);
                
                                if (levelNum > parseInt(localStorage.getItem('levelsBeaten'))) {
                                    localStorage.setItem('levelsBeaten', levelNum);
                                }
                
                                secretsFound = JSON.parse(localStorage.getItem('secretsFound'));
                                if (Deaths > 100 && !secretsFound.includes("UNSTOPPABLE")) {
                                    window.location.href = `../nothing_to_see_here/ded.html`;
                                }
                                else {
                                    // window.location.href = `../Functions.html`;
                                    pause = true;
                                }
                            }
                        }
                        if (botCenterX > 2300 || botCenterX < -240) {// after door - death
                
                            ResetBot(botId);
                        }
                        if (IsBotCollidingDeath(botId)) {// hit death wall - death
                            bot.setAttribute("DiedToWall", true);
                            ResetBot(botId);
                        }
                    }
                }
                if (!pause && clickedBotId == -1) {
                    MQ.MathField(input, { spaceBehavesLikeTab: true }).latex(chrom_strings[max_bot_x_id]);
                    // let simplified_max_func = FilterExpression(MQtoAM(String(chrom_strings[max_bot_x_id].length)));
                    // input.style.width = Math.max(simplified_max_func * 10, 200) + 'px';
                    calculator.setExpression({
                        id: "botFunc",
                        color: "blue",
                        latex: 'y=' + chrom_strings[max_bot_x_id],
                    });

                }
            }
        }
        else {
            var points = GetPlayerPoints();
    
            var playerCenterX = parseInt(parseFloat(player.style.left) + parseFloat(player.style.width) / 2);
            var legsHeight = points[1][1];
    
    
            var moveY = vel, moveX = right;
            var baseIncline = map[playerCenterX + right] - map[playerCenterX];
            var funcIncline = funcMap[playerCenterX + right] - funcMap[playerCenterX];
            var platIncline = GetPlatformIncline();
            var upperBounds = -150;
            var isOnFunction = false;
    
    
            var IncDeg = 0;
            if (player.style.transform.includes("rotate")) {
                IncDeg = parseFloat(player.style.transform.substring(player.style.transform.indexOf("rotate") + 7, player.style.transform.indexOf("deg")));
            }
    
            if (baseIncline / right > 5) {
                baseIncline = 0;
            }
    
            if (funcIncline > 800) {
                funcIncline = 0;
            }
    
            const printActions = false;
            if (playerCenterX < 50) {
                //start of map
                if (printActions) {console.log("start");
                }
                moveY = playerStartY - legsHeight - RANGE / 2;
                vel = 0;
            }
            else if (IsBoosted) {
                if (printActions) {console.log("boost");
                }
                IsBoosted = false;
                vel = -8;
                moveY += vel;
            }
            else if (IsOnPlatform() >= 0) {
                if (inRange(legsHeight, funcMap[playerCenterX])) {
                    //switch between function and platform
                    if (printActions) {console.log("switch func-plat");
                    }
        
                    moveY += Math.min(funcIncline, platIncline) - vel;
                    if (platIncline >= funcIncline && inRange(legsHeight - 1, funcMap[playerCenterX])) {
                        moveY -= 1;
                    }
                    vel = 0;
        
                    player.style.transform = 'rotate(' + (right / Math.abs(right)) * Math.atan(Math.min(funcIncline, baseIncline) / right) * 180 / Math.PI + 'deg)';
                }
                else if (inRange(legsHeight, map[playerCenterX])) {
                    //switch between function and platform
                    if (printActions) {console.log("switch base-plat");
                    }
        
                    moveY += Math.min(baseIncline, platIncline) - vel;
                    if (platIncline >= baseIncline && inRange(legsHeight - 1, map[playerCenterX])) {
                        moveY -= 1;
                    }
                    vel = 0;
        
                    player.style.transform = 'rotate(' + (right / Math.abs(right)) * Math.atan(Math.min(platIncline, baseIncline) / right) * 180 / Math.PI + 'deg)';
                }
                else {
                    //walk on platform
                    if (printActions) {console.log("walk platform");
                    }
        
                    moveY += platIncline - vel;
                    vel = 0;
        
        
                    player.style.transform = 'rotate(' + Math.atan(platIncline) * 180 / Math.PI + 'deg)';
                }
            }
            else if (inRange(funcMap[playerCenterX], map[playerCenterX]) && inRange(legsHeight, map[playerCenterX])) {
                //switch between function and base
                if (printActions) {console.log("switch func-map");
                }
                moveY += Math.min(funcIncline, baseIncline) - vel;
                if (funcIncline == Math.min(funcIncline, baseIncline) && inRange(legsHeight - 1, funcMap[playerCenterX])) {
                    moveY -= 1;
                }
                vel = 0;
    
                player.style.transform = 'rotate(' + (right / Math.abs(right)) * Math.atan(Math.min(funcIncline, baseIncline) / right) * 180 / Math.PI + 'deg)';
            }
            else if (inRange(legsHeight, funcMap[playerCenterX])) {
                //walk on function
                if (printActions) {console.log("walk func");
                }
                isOnFunction = true;
                moveY += funcIncline - vel;
                vel = 0;
                upperBounds = Math.min(150 * funcIncline / right, 0);
    
                player.style.transform = 'rotate(' + Math.atan(funcIncline / right) * 180 / Math.PI + 'deg)';
            }
            else if (inRange(points[0][1], map[points[0][0]]) || inRange(points[2][1], map[points[2][0]])) {
                //walk on base
                if (printActions) {console.log("walk base");
                }
    
                moveY += baseIncline - vel;
                vel = 0;
    
                player.style.transform = 'rotate(' + Math.atan(baseIncline) * 180 / Math.PI + 'deg)';
    
            }
            else if (legsHeight < funcMap[playerCenterX] && legsHeight + vel > funcMap[playerCenterX]) {
                //fall to function
                if (printActions) {console.log("fall to func", funcMap[playerCenterX], legsHeight, vel);
                }
                vel = 0;
                moveY = funcMap[playerCenterX] - legsHeight - RANGE;
    
                player.style.transform = 'rotate(' + (right / Math.abs(right)) * Math.atan(funcIncline / right) * 180 / Math.PI + 'deg)';
            }
            else {
                //fall
                if (printActions) {console.log("fall");
                }
    
    
                player.style.transform = 'rotate(' + (IncDeg * 0.95) + 'deg)';
                vel += (ACC / 100) * right * right;
    
            }
    
            for (var i = 0; i < points.length; i++) {
    
                if (points[i][1] < map[points[i][0] - right] && points[i][1] - RANGE > map[points[i][0] + right + 1]) {
                    moveX -= right;
                    if (moveY == vel - (ACC / 100) * right * right) {
                        moveY = 2;
                        player.style.transform = 'rotate(' + (IncDeg * 0.95) + 'deg)';
                    }
                    break;
    
                }
            }
    
            if (HeadHitPlatform()) {
                if (printActions) {console.log("head hit platform");
                }
                moveX = 0;
                if (moveY != vel - (ACC / 100) * right * right) {
                    moveY = 0;
                }
                
            }
    
            for (var i = Math.min(points[4][0], points[7][0]); i < Math.max(points[2][0], points[3][0]) - right; i++) {
                if (map[i] > points[2][1] && map[i + right] < points[2][1] - RANGE) {
                    moveX = i - Math.max(points[2][0], points[3][0]);
                    
                }
            }
    
    
            player.style.top = parseFloat(player.style.top) + moveY + 'px';
            player.style.left = parseFloat(player.style.left) + moveX + 'px';
    
    
    
    
            var collidingCoinID = IsCollidingCoins();
            if (collidingCoinID.length > 0) {
                var collidingCoin = document.getElementById(collidingCoinID);
                if (collidingCoin.style.visibility != "hidden") {
                    collidingCoin.style.visibility = "hidden";
                    DoCoinEffect(collidingCoinID);
                }
            }
    
            if (legsHeight > LOWER_BOUNDS - 30 - GLOBAL_OFFSET_Y|| legsHeight < upperBounds - GLOBAL_OFFSET_Y) {// out of bounds - death
    
                ResetGame();
            }
            if (gameStarted && legsHeight > parseFloat(door.style.top) - GLOBAL_OFFSET_Y && legsHeight < parseFloat(door.style.top) + parseFloat(door.style.height) - GLOBAL_OFFSET_Y) {// win
                if (playerCenterX > parseFloat(door.style.left) + 50 * (right > 0) && playerCenterX < parseFloat(door.style.left) + parseFloat(door.style.width) - 50 * (right < 0)) {
    
                    Deaths--;
                    ResetGame();
    
    
    
                    ctx.fillStyle = "orange";
                    ctx.fillRect(i, funcMap[i], 6, 6);
    
                    if (levelNum > parseInt(localStorage.getItem('levelsBeaten'))) {
                        localStorage.setItem('levelsBeaten', levelNum);
                    }
    
                    secretsFound = JSON.parse(localStorage.getItem('secretsFound'));
                    if (Deaths > 100 && !secretsFound.includes("UNSTOPPABLE")) {
                        window.location.href = `../nothing_to_see_here/ded.html`;
                    }
                    else {
                        window.location.href = `../Functions.html`;
                    }
                }
            }
            if (playerCenterX > 2300 || playerCenterX < -240) {// after door - death
    
                ResetGame();
            }
            if (IsCollidingDeath()) {// hit death wall - death
    
                ResetGame();
            }
        }

        
    }
    last = expr;
}

function MQtoAM(tex, display) {
    var nested, lb, rb, isfuncleft, curpos, c, i;
    tex = tex.replace(/\\:/g, ' ');
    tex = tex.replace(/\\operatorname{(\w+)}/g, ' $1');
    if (!display) {
        while ((i = tex.lastIndexOf('\\left|')) != -1) { //found a left |)
            rb = tex.indexOf('\\right|', i + 1);
            if (rb != -1) {  //have a right |  - replace with abs( )
                isfuncleft = tex.substring(0, i).match(/(arcsinh|arccosh|arctanh|arcsech|arccsch|arccoth|arcsin|arccos|arctan|arcsec|arccsc|arccot|sinh|cosh|tanh|sech|csch|coth|ln|log|exp|sin|cos|tan|sec|csc|cot)(\^\d+)?$/);
                tex = tex.substring(0, rb) + ")" + (isfuncleft ? ')' : '') + tex.substring(rb + 7);
                tex = tex.substring(0, i) + (isfuncleft ? '(' : '') + "abs(" + tex.substring(i + 6);
            } else {
                tex = tex.substring(0, i) + "|" + tex.substring(i + 6);
            }
        }
        tex = tex.replace(/\\text{\s*or\s*}/g, ' or ');
        tex = tex.replace(/\\text{all\s+real\s+numbers}/g, 'all real numbers');
        tex = tex.replace(/\\text{DNE}/g, 'DNE');
        tex = tex.replace(/\\varnothing/g, 'DNE');
        tex = tex.replace(/\\Re/g, 'all real numbers');
    } else {
        tex = tex.replace(/\\Re/g, 'RR');
    }
    tex = tex.replace(/\\begin{.?matrix}(.*?)\\end{.?matrix}/g, function (m, p) {
        return '[(' + p.replace(/\\\\/g, '),(').replace(/&/g, ',') + ')]';
    });
    tex = tex.replace(/\\le(?=(\b|\d))/g, '<=');
    tex = tex.replace(/\\ge(?=(\b|\d))/g, '>=');
    tex = tex.replace(/\\ne(?=(\b|\d))/g, '!=');
    tex = tex.replace(/\\pm/g, '+-');
    tex = tex.replace(/\\approx/g, '~~');
    tex = tex.replace(/(\\arrow|\\rightarrow)/g, 'rarr');
    tex = tex.replace(/\\cup/g, 'U');
    tex = tex.replace(/\\times/g, 'xx');
    tex = tex.replace(/\\left\\{/g, 'lbrace').replace(/\\right\\}/g, 'rbrace');
    tex = tex.replace(/\\left/g, '');
    tex = tex.replace(/\\right/g, '');
    tex = tex.replace(/\\langle/g, '<<');
    tex = tex.replace(/\\rangle/g, '>>');
    tex = tex.replace(/\\cdot/g, '*');
    tex = tex.replace(/\\infty/g, 'oo');
    tex = tex.replace(/\\nthroot/g, 'root');
    tex = tex.replace(/\\mid/g, '|');
    tex = tex.replace(/\\/g, '');
    tex = tex.replace(/sqrt\[(.*?)\]\{(.*?)\}/g, 'root($1, $2)');
    tex = tex.replace(/(\d)frac/g, '$1 frac');
    while ((i = tex.indexOf('frac{')) != -1) { //found a fraction start
        nested = 1;
        curpos = i + 5;
        while (nested > 0 && curpos < tex.length - 1) {
            curpos++;
            c = tex.charAt(curpos);
            if (c == '{') { nested++; }
            else if (c == '}') { nested--; }
        }
        if (nested == 0) {
            tex = tex.substring(0, i) + "(" + tex.substring(i + 5, curpos) + ")/" + tex.substring(curpos + 1);
        } else {
            tex = tex.substring(0, i) + tex.substring(i + 4);
        }
    }
    //separate un-braced subscripts using latex rules
    tex = tex.replace(/_(\w)(\w)/g, '_$1 $2');
    tex = tex.replace(/(\^|_)([+\-])([^\^])/g, '$1$2 $3');
    tex = tex.replace(/\^(\w)(\w)/g, '^$1 $2');
    tex = tex.replace(/_{([\d\.]+)}\^/g, '_$1^');
    tex = tex.replace(/_{([\d\.]+)}([^\^])/g, '_$1 $2');
    tex = tex.replace(/_{([\d\.]+)}$/g, '_$1');
    tex = tex.replace(/_{(\w+)}$/g, '_($1)');
    tex = tex.replace(/{/g, '(').replace(/}/g, ')');
    tex = tex.replace(/lbrace/g, '{').replace(/rbrace/g, '}');
    tex = tex.replace(/\(([\d\.]+)\)\/\(([\d\.]+)\)/g, '$1/$2');  //change (2)/(3) to 2/3
    tex = tex.replace(/\/\(([\d\.]+)\)/g, '/$1');  //change /(3) to /3
    tex = tex.replace(/\(([\d\.]+)\)\//g, '$1/');  //change (3)/ to 3/
    tex = tex.replace(/\/\(([\a-zA-Z])\)/g, '/$1');  //change /(x) to /x
    tex = tex.replace(/\(([\a-zA-Z])\)\//g, '$1/');  //change (x)/ to x/
    tex = tex.replace(/\^\(-1\)/g, '^-1');
    tex = tex.replace(/\^\((-?[\d\.]+)\)/g, '^$1');
    tex = tex.replace(/\/\(([\a-zA-Z])\^([\d\.]+)\)/g, '/$1^$2');  //change /(x^n) to /x^n
    tex = tex.replace(/\(([\a-zA-Z])\^([\d\.]+)\)\//g, '$1^$2/');  //change (x^n)/ to x^n/
    tex = tex.replace(/\+\-/g, '+ -'); // ensure spacing so it doesn't interpret as +-
    tex = tex.replace(/text\(([^)]*)\)/g, '$1');
    tex = tex.replace(/sqrt\{(.*?)\}/g, 'squareroot($1)');
    return tex;
}

function evaluateMathExpr(mathFunc, mathX) {

    try {
        return mathjs.eval(mathFunc, { x: mathX, X: mathX });
    }
    catch (err) {
        try {
            return evalX(FilterExpression2(mathFunc), { x: mathX, X: mathX });

        } catch (e) {

            try {
                return evalX(FilterExpression(MQtoAM(String(mathFunc))), { x: mathX, X: mathX });
    
            } catch (e) {
                return null;
            }
        }
    }
}

function evalX(expression, params) {
    
    const originalLog = console.log; console.log = function() { };

    try {
        let result = evaluatex(expression)(params); console.log = originalLog;
        return result
    }
    catch (error) {console.log = originalLog;
        0/0
    }
}

function isValidMathFunction(mathFunction) {

    for (var x = -15; x < 15; x+=0.5) {
        try {
            let result = evaluateMathExpr(mathFunction, x);
            let resultInPixels = 1350 * result + parseInt(elt.style.top);
            if (resultInPixels > -150 && resultInPixels < LOWER_BOUNDS - GLOBAL_OFFSET_Y){
                return true;
            }
        }
        catch (err) {
        }
    }
    return false;
}

function randomNormalBetween(min, max) {
  const mean = (min + max) / 2;
  const stdDev = (max - min) / 6; // 99.7% of values fall within [min, max]

  function boxMullerRandom() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // avoid 0
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  let value;
  do {
    value = boxMullerRandom() * stdDev + mean;
  } while (value < min || value > max); // Reject out-of-bounds samples

  return value;
}

// Function to get the value of a query parameter by name
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function hexToRgba(hex, alpha = 1) {
    // Remove the hash (#) if present
    hex = hex.replace(/^#/, '');
    
    // Check if the HEX code is 3 or 6 characters
    let r, g, b;
    if (hex.length === 3) {
        // Convert 3-digit HEX to 6-digit HEX
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
    } else {
        throw new Error('Invalid HEX color format');
    }
    
    // Return the RGBA color string
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getMaxBracketDepth(expression) {
    let maxDepth = 0;
    let currentDepth = 0;
    
    for (let char of expression) {
        if (char === '(') {
            currentDepth++;
            maxDepth = Math.max(maxDepth, currentDepth);
        } else if (char === ')') {
            currentDepth--;
        }
    }
    
    return maxDepth;
}
    
function getRandomNumber(min = -10, max = 10) {
    return (Math.random() * (max - min) + min).toFixed(2);
}




// document.addEventListener('contextmenu', (event) => event.preventDefault());
// document.addEventListener('keydown', (event) => {
//     if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I')) {
//         alert('Developer tools are disabled on this site.');
//         event.preventDefault();
//     }
// });

// (function detectConsole() {
//     const element = new Image();
//     Object.defineProperty(element, 'id', {
//         get: function () {
//             alert('Console access is disabled!');
//             throw new Error('Console access detected');
//         }
//     });
// })();