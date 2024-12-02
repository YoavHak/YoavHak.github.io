// JavaScript source code
var canvas = document.getElementById("myCanvas"),
    levelDiv = document.getElementById("level"),
    outLevelDiv = document.getElementById("outLevel"),
    player = document.getElementById("player"),
    door = document.getElementById("Door"),
    ctx = canvas.getContext('2d'),
    ctx2 = canvas.getContext('2d'),
    start_message = document.getElementById('start_message'),
    font = '40px sans-serif', n = canvas.width, xMin = -9, xMax = 9, yMin = -3.8, yMax = 5.1,

    mathjs = mathjs(),
    expr = '',
    scope = { x: 0 },
    tree = mathjs.parse(expr, scope),
    right = 1,
    DeathText = document.getElementById("Deaths")
    ;



var input = document.getElementById("input");


var enteredMath = "";

var map = [];

var funcMap = [];

var deathMap = [];

var start = true;

var gamespeed = 5;

var pause = true;

var play;

var Wins = 0;

var Deaths = 0;

var index = 0;

var ACC = 9.80665;

var vel = 0;

var calculator;

var elt;

var gameStarted = false;

var secretsFound = JSON.parse(localStorage.getItem('secretsFound'));

var returnButton = document.getElementById("returnButton");

var GLOBAL_OFFSET_Y = parseInt(canvas.style.top);

var LEVEL_NUM = parseInt(localStorage.getItem("LEVEL_NUM"));

// Use the function to get the value of 'index'
const levelNum = getQueryParameter('index');


if (levelNum !== null) {
    // You can now use the index variable as needed
}







//start
if (true){

    index = levelNum;

    if (parseInt(localStorage.getItem('levelsBeaten')) + 1 < parseInt(levelNum) && parseInt(levelNum) < LEVEL_NUM){
        window.location.href = `../Functions.html`;
    }
    else{

        map = [];
        deathMap = [];
        for (var i = 1; i <= canvas.width; i++) {
            var temp = [];
            temp.push(0);
            temp.push(0);
            deathMap.push(temp);
        }
    
    
        if (levelNum == "1") {
            player.style.top = "308px";
            door.style.top = "650px";
            for (var i = 1; i <= canvas.width; i++) {
                if (i > 910 && i < 1215) {
                    map.push(2000 - GLOBAL_OFFSET_Y);
                }
                else {
                    map.push(880 - GLOBAL_OFFSET_Y);
                }
            }
        }
        else if (levelNum == "2") {
    
            player.style.top = "308px";
            door.style.top = "170px";
            for (var i = 1; i <= canvas.width; i++) {
                if (i <= 763) {
                    map.push(712 -GLOBAL_OFFSET_Y);
                }
                else if (i < 1363) {
                    map.push(2000-GLOBAL_OFFSET_Y);
                }
                else {
                    map.push(412-GLOBAL_OFFSET_Y);
                }
            }
        }
        else if (levelNum == "3") {
    
            player.style.top = "178px";
            door.style.top = "470px";
            for (var i = 1; i <= canvas.width; i++) {
                if (i < 763) {
                    map.push(412-GLOBAL_OFFSET_Y);
                }
                else if (i < 1213) {
                    map.push(2000-GLOBAL_OFFSET_Y);
                }
                else {
                    map.push(712-GLOBAL_OFFSET_Y);
                }
            }
    
        }
        else if (levelNum == "4") {
            deathMap = [];
            player.style.top = "308px";
            door.style.top = "428px";
            for (var i = 1; i <= canvas.width; i++) {
    
                if (i == 913) {
                    var temp = [1, 570-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 914) {
                    var temp = [728-GLOBAL_OFFSET_Y, 2000-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else {
                    var temp = [];
                    temp.push(0);
                    temp.push(0);
                    deathMap.push(temp);
                }
    
                if (i <= 763) {
                    map.push(742-GLOBAL_OFFSET_Y);
                }
                else if (i < 1213) {
    
                    map.push(2000-GLOBAL_OFFSET_Y);
                }
                else {
                    map.push(697-GLOBAL_OFFSET_Y);
                }
            }
        }
        else if (levelNum == "5") {
            deathMap = [];
            player.style.top = "308px";
            door.style.top = "458px";
            for (var i = 1; i <= canvas.width; i++) {
    
                if (i == 688) {
                    var temp = [1, 450-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 940) {
                    var temp = [562-GLOBAL_OFFSET_Y, 2000-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 1129) {
                    var temp = [1, 364-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else {
                    var temp = [0, 0];
                    deathMap.push(temp);
                }
    
    
    
                if (i <= 463) {
                    map.push(412-GLOBAL_OFFSET_Y);
                }
                else if (i < 1213) {
    
                    map.push(2000-GLOBAL_OFFSET_Y);
                }
                else {
                    map.push(712-GLOBAL_OFFSET_Y);
                }
            }
        }
        else if (levelNum == "6") {
            deathMap = [];
            player.style.top = "308px";
            door.style.top = "608px";
            for (var i = 1; i <= canvas.width; i++) {
    
                if (i == 972) {
                    var temp = [1, 487-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 1002) {
                    var temp = [667-GLOBAL_OFFSET_Y, 2000-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 1062) {
                    var temp = [1, 472-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 1063) {
                    var temp = [637-GLOBAL_OFFSET_Y, 2000-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 1153) {
                    var temp = [697-GLOBAL_OFFSET_Y, 2000-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else {
                    var temp = [0, 0];
                    deathMap.push(temp);
                }
    
    
    
    
                map.push(862-GLOBAL_OFFSET_Y);
            }
        }
        else if (levelNum == "7") {
            deathMap = [];
            player.style.top = "308px";
            door.style.top = "608px";
            for (var i = 1; i <= canvas.width; i++) {
    
                if (i == 673) {
                    var temp = [1, 412-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 703) {
                    var temp = [592-GLOBAL_OFFSET_Y, 2000-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 762) {
                    var temp = [1, 397-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 763) {
                    var temp = [562-GLOBAL_OFFSET_Y, 2000-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 853) {
                    var temp = [622-GLOBAL_OFFSET_Y, 2000-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else {
                    var temp = [0, 0];
                    deathMap.push(temp);
                }
    
    
    
    
                map.push(862-GLOBAL_OFFSET_Y);
            }
        }
        else if (levelNum == "8") {
            deathMap = [];
            player.style.top = "178px";
            door.style.top = "150px";
            for (var i = 1; i <= canvas.width; i++) {
                
                if (i == 852) {
                    var temp = [600-GLOBAL_OFFSET_Y, 2000-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 1062) {
                    var temp = [1, 450-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 1061) {
                    var temp = [717-GLOBAL_OFFSET_Y, 2000-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 1272) {
                    var temp = [600-GLOBAL_OFFSET_Y, 2000-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else {
                    var temp = [0, 0];
                    deathMap.push(temp);
                }
    
    
    
    
                if (i <= 725) {
                    map.push(410-GLOBAL_OFFSET_Y);
                }
                else if (i < 1397) {
    
                    map.push(2000-GLOBAL_OFFSET_Y);
                }
                else {
                    map.push(410-GLOBAL_OFFSET_Y);
                }
            }
        }
        else if (levelNum == "9") {
            deathMap = [];
            player.style.top = "308px";
            door.style.top = "608px";
            for (var i = 1; i <= canvas.width; i++) {
    
                if (i == 673) {
                    var temp = [1, 412-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 703) {
                    var temp = [592-GLOBAL_OFFSET_Y, 2000-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 762) {
                    var temp = [1, 397-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 763) {
                    var temp = [562-GLOBAL_OFFSET_Y, 2000-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 853) {
                    var temp = [622-GLOBAL_OFFSET_Y, 2000-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }

                
                else if (i == 1423) {
                    var temp = [1, 412-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 1453) {
                    var temp = [592-GLOBAL_OFFSET_Y, 2000-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 1512) {
                    var temp = [1, 397-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 1513) {
                    var temp = [562-GLOBAL_OFFSET_Y, 2000-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 1603) {
                    var temp = [622-GLOBAL_OFFSET_Y, 2000-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }


                else {
                    var temp = [0, 0];
                    deathMap.push(temp);
                }
    
    
    
    
                map.push(862-GLOBAL_OFFSET_Y);
            }
        }
        else if (levelNum == "10") {
            deathMap = [];
            player.style.top = "308px";
            door.style.top = "308px";
            for (var i = 1; i <= canvas.width; i++) {
    
                if (i == 462) {
                    var temp = [780-GLOBAL_OFFSET_Y, 2000-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 612) {
                    var temp = [1, 502-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 762) {
                    var temp = [610-GLOBAL_OFFSET_Y, 2000-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 912) {
                    var temp = [1, 415-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 1062) {
                    var temp = [563-GLOBAL_OFFSET_Y, 2000-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 1212) {
                    var temp = [1, 382-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 1362) {
                    var temp = [490-GLOBAL_OFFSET_Y, 2000-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 1512) {
                    var temp = [1, 220-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 1662) {
                    var temp = [300-GLOBAL_OFFSET_Y, 2000-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 2037) {
                    var temp = [562-GLOBAL_OFFSET_Y, 2000-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else if (i == 2112) {
                    var temp = [1, 310-GLOBAL_OFFSET_Y];
                    deathMap.push(temp);
                }
                else {
                    var temp = [0, 0];
                    deathMap.push(temp);
                }
    
    
    
    
                if (i <= 373) {
                    map.push(862-GLOBAL_OFFSET_Y);
                }
                else {
                    map.push(1000-GLOBAL_OFFSET_Y);
                }
            }
        }
        else if (parseInt(levelNum) > 25){
            window.location.href = `../nothing_to_see_here/25+.html`;
        }
        else {
            player.style.top = "308px";
            door.style.top = "650px";
            for (var i = 1; i <= canvas.width; i++) {
                if (i > 910 && i < 1215) {
                    map.push(2000-GLOBAL_OFFSET_Y);
                }
                else {
                    map.push(880-GLOBAL_OFFSET_Y);
                }
            }
        }
        
        elt = document.getElementById('Graph');
        //elt.style.width 
        calculator = Desmos.GraphingCalculator(elt, {
            expressions: false,
            keypad: false,
            settingsMenu: false,
            zoomButtons: false,
            projectorMode: false,
            lockViewport: true
        });
        canvas.width = calculator.graphpaperBounds.pixelCoordinates.width;
        canvas.height = calculator.graphpaperBounds.pixelCoordinates.height;
        n = canvas.width;
    
        Wins = 0;
        Deaths = 0;
        play = setInterval("Play()", gamespeed);
        
        calculator.setExpression({
            id: 'line',
            latex: 'y=',
        });
        
        DrawFunc();
    
        returnButton.onclick = function () {
            window.location.href = `../Functions.html`;
        };
    
        document.onkeydown = function (e) {
            if (e.keyCode == "27" && gameStarted) {
                pause = !pause;
            }
            if (e.keyCode == "13" && !gameStarted) {
                pause = false;
                gameStarted = true;
                start_message.style.visibility = "hidden";
            }
        };
    }
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

// Function to update the transform property
function updateTransform() {
    var scaledOffsetX = offsetX/scale;
    var scaledOffsetY = offsetY/scale;
    elt.style.left = (( -1628/scale + 1188 - scaledOffsetX)) + "px";//-440
    elt.style.top = ((-1645/scale + 555 - scaledOffsetY)) + "px";//-1090
    
    elt.style.width = (3250/(scale) - 250) + "px";
    elt.style.height = (3250/(scale) - 250) + "px";


    
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



function point(x, y) {
    ctx2.moveTo(x, y);
    ctx2.lineTo(x + 1, y + 1);
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

function drawText(txt, x, y) {
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.font = font;
    ctx.fillText(txt, x - 4, y - 4);
}

function inRange(num1, num2) {
    return (num1 < num2 + 5 && num1 > num2 - 5);
}

"use strict"; // To avoid this-wrapping overhead (optional)

Number.prototype.factorial = function () {
    return this > 0 ? this * (this - 1).factorial() : 1;
}


function DrawFunc() {

    

    start = false;
    var xPixel, yPixel, mathX, mathY;

    funcMap = [];


    n = calculator.graphpaperBounds.pixelCoordinates.width * 2;
    ctx.beginPath();
    for (var i = 0; i < n; i++) {
        mathX = calculator.pixelsToMath({x: (i-parseInt(elt.style.left)), y: 0}).x

        mathY = evaluateMathExpr(mathX);


        xPixel = i;
        yPixel = calculator.mathToPixels({ x: mathX, y: mathY }).y + parseInt(elt.style.top) 

        if (isNaN(yPixel)) {
            funcMap[Math.floor(xPixel)] = 2000 - GLOBAL_OFFSET_Y;
        }
        else {
            if (!isNaN(xPixel)) {
                funcMap[Math.floor(xPixel)] = yPixel - GLOBAL_OFFSET_Y;
            }
        }


        //  ctx.fillStyle = "white";
        //  ctx.fillRect(i, funcMap[i], 6, 6);

        //  ctx.fillStyle = "orange";
        //  ctx.fillRect(i, funcMap[i], 6, 6);

        //  ctx.fillStyle = "black";

    }

    ctx.stroke();
    
    for (var i = 0; i < map.length - 1; i++) {
        if (map[i] != -1 && map[i + 1] != -1) { //wall
            drawLine(ctx, i, map[i], i + 1, map[i + 1], 'black', 3);
        }
    }
    for (var i = 0; i < deathMap.length - 1; i++) {
        if (map[i] != 0) { //death wall
            drawLine(ctx, i, deathMap[i][0], i, deathMap[i][1], 'red', 5);
        }
    }



    //drawText("y  =", 10, 40);
    //ctx.fillStyle = "white";
    //ctx.fillRect(450, 20, 280, 60);
    //ctx.fillStyle = "black";
    //drawText("Deaths: " + Deaths, 460, 40);
    DeathText.innerHTML = "Deaths: " + Deaths;
}

function IsColliding(IncRad) {

    var bottomLeft = [parseInt(parseFloat(player.style.left) + (1 - Math.cos(IncRad)) * parseFloat(player.style.width) / 2), parseInt(parseFloat(player.style.top) + parseFloat(player.style.height) / 2 + Math.sin(IncRad) * parseFloat(player.style.width) / 2) - GLOBAL_OFFSET_Y];
    var bottomRight = [parseInt(parseFloat(player.style.left) + (1 + Math.cos(IncRad)) * parseFloat(player.style.width) / 2), parseFloat(player.style.top) + parseFloat(player.style.height) / 2 - Math.sin(IncRad) * parseFloat(player.style.width) / 2 - GLOBAL_OFFSET_Y];
    var topLeft = [parseInt(parseFloat(player.style.left) + (1 - Math.cos(IncRad)) * parseFloat(player.style.width) / 2 - Math.sin(IncRad) * parseFloat(player.style.height) / 2), parseInt(parseFloat(player.style.top) + (1 - Math.cos(IncRad)) * parseFloat(player.style.height) / 2 + Math.sin(IncRad) * parseFloat(player.style.width) / 2) - GLOBAL_OFFSET_Y];
    var topRight = [parseInt(parseFloat(player.style.left) + (1 + Math.cos(IncRad)) * parseFloat(player.style.width) / 2 - Math.sin(IncRad) * parseFloat(player.style.height) / 2), parseInt(parseFloat(player.style.top) + (1 - Math.cos(IncRad)) * parseFloat(player.style.height) / 2 - Math.sin(IncRad) * parseFloat(player.style.width) / 2) - GLOBAL_OFFSET_Y];

    var Blr = [parseInt((bottomLeft[0] + bottomRight[0]) / 2), parseInt((bottomLeft[1] + bottomRight[1]) / 2)];
    var btR = [parseInt((bottomRight[0] + topRight[0]) / 2), parseInt((bottomRight[1] + topRight[1]) / 2)];
    var Trl = [parseInt((topRight[0] + topLeft[0]) / 2), parseInt((topRight[1] + topLeft[1]) / 2)];
    var tbL = [parseInt((topLeft[0] + bottomLeft[0]) / 2), parseInt((topLeft[1] + bottomLeft[1]) / 2)];

    //var points = [bottomLeft, bottomRight, topLeft, topRight];
    var points = [bottomLeft, Blr, bottomRight, btR, topLeft, Trl, topRight, tbL];
    
        

    // ctx.fillStyle = "white";
    // for (var i = 0; i < points.length; i++) {
    //    ctx.fillRect(points[i][0]-right, points[i][1], 6, 6);
    // }

    // ctx.fillStyle = "orange";
    // for (var i = 0; i < points.length; i++) {
    //    ctx.fillRect(points[i][0], points[i][1], 6, 6);
    // }

    // ctx.fillStyle = "black";

    for (var i = 0; i < points.length; i++) {

        for (var j = -right; j < right; j++) {
            if (points[i][0] > 0 && points[i][0] < deathMap.length){
                //point exists
                if (points[i][1] > deathMap[points[i][0] + j][0] && points[i][1] < deathMap[points[i][0] + j][1]) {
                    return true;
                }

            }

        }
    }

    return false;
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


function FilterExpression(exp){
    var newExpr = "";
    for (var i = 0; i < exp.length; i++) {

        if (i > 0 && (exp[i] == 'x' || exp[i] == 's' || exp[i] == '(') && ((parseInt(exp[i - 1]) >= 0 && parseInt(exp[i - 1]) <= 9) || exp[i - 1] == 'x')) {

            newExpr += '*';
        }
        if (exp[i] == 'X'){
            newExpr += 'x'
        }
        else if (exp[i] != ' '){
            newExpr += exp[i];
        }

    }
    newExpr = transformLogExpression(newExpr);
    
    return newExpr;
}


function FilterExpression2(exp){
    var newExpr = "";
    for (var i = 0; i < exp.length - 1; i++) {
        if (exp[i] == 'p' && exp[i + 1] == 'i'){
            newExpr += "\\";
        }
        newExpr += exp[i];
    }


    return newExpr + exp[exp.length-1];
}

function Play() {
    var answerMathField = MQ.MathField(input, {
        handlers: {
            edit: function () {
                enteredMath = answerMathField.latex(); // Get entered math in LaTeX format
            }
        }
    });
    expr = FilterExpression(MQtoAM(String(enteredMath)));
    var expr2 = FilterExpression2(enteredMath);

    //console.log("expr: " + expr, "expr2: " + expr2)
    
    input.style.width = (expr.length * 17) + 'px';
    if (expr.length < 11) {
        input.style.width = "200px";
    }


    try {
        tree = mathjs.parse(expr, scope);
    }
    catch (err) {
        tree = mathjs.parse("", scope);

    }
    if (expr != last || start) {
        calculator.setExpression({
            id: 'line',
            latex: 'y=' + expr2,
        });
        
        DrawFunc();

        console.log(expr)

        if (expr2 == String.raw`\int_{ }^{ }\sqrt{∞}\\piθσ\sum_{ }^{ }Δ` || expr2 == String.raw`\int_{ }^{ }\sqrt{\infty}\\pi\theta\sigma\sum_{ }^{ }\Delta`){
            
            window.location.href = `../nothing_to_see_here/puzz.html`;
        }
    }


    if (!pause) {

        var playerLeftX = parseFloat(player.style.left) + 50;
        var legsHeight = parseFloat(player.style.top) + parseFloat(player.style.height) / 2 - GLOBAL_OFFSET_Y;
        var moveY = vel, baseIncline = 0, funcIncline = funcMap[playerLeftX + 1] - funcMap[playerLeftX];
        
        // ctx.fillStyle = "white";
        // ctx.fillRect(playerLeftX-1, legsHeight, 6, 6);

        // ctx.fillStyle = "orange";
        // ctx.fillRect(playerLeftX, legsHeight, 6, 6);

        // ctx.fillStyle = "black";

        //console.log(funcMap[playerLeftX], calculator.pixelsToMath({ x: 0, y: funcMap[playerLeftX]}).y)
        if (inRange(funcMap[playerLeftX], map[playerLeftX]) && inRange(legsHeight, map[playerLeftX])) {
            //switch between function and base
            //console.log("switch");
            moveY += Math.min(funcIncline, baseIncline) - vel;
            vel = 0;

            
            player.style.transform = 'rotate(' + Math.atan(Math.min(funcIncline, baseIncline)) * 180 / Math.PI + 'deg)';
        }
        else if (inRange(legsHeight, funcMap[playerLeftX])) {
            //walk on function
            //console.log("walk func");
            moveY += funcIncline - vel;
            vel = 0;


            player.style.transform = 'rotate(' + Math.atan(funcIncline) * 180 / Math.PI + 'deg)';
        }
        else if (inRange(legsHeight, map[playerLeftX - 20])) {
            //walk on base
            //console.log("walk base");

            moveY += baseIncline - vel + (map[playerLeftX -20] - legsHeight);
            vel = 0;

            player.style.transform = 'rotate(' + Math.atan(baseIncline) * 180 / Math.PI + 'deg)';

        }
        else if (playerLeftX < 50) {
            //start of map
            //console.log("start");
            moveY = map[0] - legsHeight;
            vel = 0;
        }
        else {
            //fall
            //console.log("fall");
            player.style.transform = 'rotate(' + (parseInt(player.style.transform.substring(7, player.style.transform.length - 4)) + Math.sin(playerLeftX / n)) + 'deg)';
            vel += (ACC / 65.378);
        }


        player.style.top = parseFloat(player.style.top) + moveY + 'px';
        player.style.left = parseFloat(player.style.left) + right + 'px';
        
        if (legsHeight > 1400 - GLOBAL_OFFSET_Y || legsHeight < -150 - GLOBAL_OFFSET_Y) {
            player.style.left = '-102px';
            player.style.top = '308px';
            player.style.transform = 'rotate(0deg)';
            Deaths++;
            DrawFunc();
        }
        else if (playerLeftX > 2080) {

            if (legsHeight > parseFloat(door.style.top) - GLOBAL_OFFSET_Y && legsHeight < parseFloat(door.style.top) + door.height - GLOBAL_OFFSET_Y) {
                Wins++;


                DrawFunc();
                player.style.left = '-102px';
                player.style.top = '308px';
                player.style.transform = 'rotate(0deg)';

                if (levelNum > parseInt(localStorage.getItem('levelsBeaten'))) {
                    localStorage.setItem('levelsBeaten', levelNum);
                }

                secretsFound = JSON.parse(localStorage.getItem('secretsFound'));
                if (Deaths > 100 && !secretsFound.includes("UNSTOPPABLE")){
                    window.location.href = `../nothing_to_see_here/ded.html`;
                }
                else{
                    window.location.href = `../Functions.html`;
                }
            }
            else if (playerLeftX > 2300){
                Deaths++;
                DrawFunc();
                player.style.left = '-102px';
                player.style.top = '308px';
                player.style.transform = 'rotate(0deg)';
            }
        }
           
        else if (IsColliding(-1 * parseFloat(player.style.transform.substring(7, player.style.transform.length - 4)) * Math.PI / 180)) {
            player.style.left = '-102px';
            player.style.top = '308px';
            player.style.transform = 'rotate(0deg)';
            Deaths++;
            DrawFunc();
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

function evaluateMathExpr(mathX) {

    scope.x = mathX;
    try {
        return tree.eval();
    }
    catch (err) {
        try {
            return evaluatex(FilterExpression2(enteredMath))({ x: mathX, X: mathX });

        } catch (e) {

        }
    }
}

// Function to get the value of a query parameter by name
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}



