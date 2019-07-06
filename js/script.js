window.onload = function(){

    /* VARIABLES */

    /* chrono */
    var chronoWidth = 150;
    var chronoHeight = 110;
    var chronoCtx;
    var counterColor = "gray";
    var gameLength = 5;
    var counterClock = gameLength;
    var delayClock = 1000; // 1 second 
    var timeout;

    /* color grid */
    var classicColors=["blue", "yellow", "green", "purple", "black", "gray", "pink", "red", "orange", "brown"];
    var hardColors=["blue", "yellow", "green", "purple", "black", "gray", "pink", "red", "orange", "brown"];
    var currentColorBoxSequence = [];
    var gridSize = Math.min(600, window.innerWidth*0.8, window.innerHeight*0.8);
    var blockSize = gridSize/3;
    var gridCanvasBorderWidth = 10; // in pixels
    var gridCtx;

    /* score */
    var score = 0;
    var bestScore = 0;

    /* game */
    var gameOver = true;
    var rightColorWasClicked = false;
    var firstLoop = true;
    var askedColorBox;
    var xClick = -100;
    var yClick = -100;
    var difficulty = "normal";

    /* MAIN PROGRAM */

    init();

    /* FUNTIONS */
    
    /* This functions initializes all the program */
    function init(){
        initGrid();
        initChrono();
        drawGrid();
        drawInitialMessage();
    }

    /* This funtion creates all elements of the grid */
    function initGrid(){
        var gridCanvas = document.createElement('canvas');
        gridCanvas.width = gridSize;
        gridCanvas.height = gridSize;
        gridCanvas.style.border = gridCanvasBorderWidth.toString()+"px solid #444";
        gridCanvas.style.margin = "auto";
        gridCanvas.style.display = "block";
        gridCanvas.style.backgroundColor = "#ddd";
        gridCtx = gridCanvas.getContext('2d');
        document.getElementById("colorGrid").appendChild(gridCanvas);
        gridCanvas.addEventListener('mousedown', function(e) {
            getCursorPosition(gridCanvas, e)
        })
        gridCtx.textAlign = "center";
        gridCtx.textBaseline = "middle";
        gridCtx.strokeStyle = "white";
    }

    /* This funtion creates all elements of the chrono */
    function initChrono(){
        var chronoCanvas = document.createElement('canvas');
        chronoCanvas.width = chronoWidth;
        chronoCanvas.height = chronoHeight;
        chronoCanvas.style.border = "1px solid black";
        chronoCanvas.style.margin = "auto";
        chronoCanvas.style.display = "block";
        chronoCanvas.style.backgroundColor = "#eee";
        chronoCtx = chronoCanvas.getContext('2d');
        document.getElementById("chrono").appendChild(chronoCanvas);
    }

    /* This function starts a new game */
    function startGame(){
        if(gameOver){ // no game running
            gameOver = false;
            score = 0;
            xClick = -100;
            yClick = -100;
            firstLoop = true;
            counterClock=gameLength;
            count();
            askNewColorBox();
            gameLoop();
        }
    }

    /* This function checks if a click occurred on the asked color and updates variables in consequence */
    function gameLoop(){
        if(xClick>=askedColorBox.xCoord*blockSize && xClick<(askedColorBox.xCoord+1)*blockSize && yClick>=askedColorBox.yCoord*blockSize && yClick<(askedColorBox.yCoord+1)*blockSize){
            rightColorWasClicked = true;
        }
        if(rightColorWasClicked || firstLoop){
            xClick = -100;
            yClick = -100;
            drawGrid();
            askNewColorBox();
            if(rightColorWasClicked){
                rightColorWasClicked = false;
                score++;
            }
            if(firstLoop) {
                firstLoop = false;
            }
            document.getElementById("score").innerHTML = score;
        }
        if(counterClock>=0){
            timeout = setTimeout(gameLoop, 50);
        }  else {
            drawGameOverMessage();
            if(score>bestScore){
                bestScore = score;
                document.getElementById("bestScore").innerHTML = bestScore;
            }
            document.getElementById("askedColor").innerHTML = "";
            gameOver = true;
        }
    }

    /* This recursive function does the time count */
    function count(){
        if(gameOver){
            return;
        }
        if(counterClock>5){
            counterColor = "gray";
        } else {
            counterColor = "red";
        }
        if(counterClock>=0){
            drawCounter();
            counterClock --;
            if(counterClock>=0){
                timeout = setTimeout(count, delayClock);
            }
        }
    }

    /* This function displays a single color block */
    function drawBlock(ctx, position){
        var x = position[0]*blockSize;
        var y = position[1]*blockSize;
        ctx.fillRect(x,y, blockSize, blockSize);
    }

    /* This function displays random colors on the gridCanvas and updates currentColorBoxSequence*/
    function drawGrid(){
        getClassicColorBoxSequence();
        for (var i=0;i<9;i++){
            gridCtx.fillStyle = currentColorBoxSequence[i].color;
            drawBlock(gridCtx, [currentColorBoxSequence[i].xCoord ,currentColorBoxSequence[i].yCoord]);
        }
    }

     /* This function displays initial message */
    function drawInitialMessage(){
        gridCtx.clearRect(0,0, gridSize, gridSize);
        var centerX = gridSize / 2;
        var centerY = gridSize / 2;
        gridCtx.fillStyle = "#000";
        gridCtx.font = "bold 45px sans-serif";
        gridCtx.strokeText("Press space key to play", centerX, centerY);
        gridCtx.fillText("Press space key to play", centerX, centerY);
    }

    /* This function displays game over message */
    function drawGameOverMessage(){
        gridCtx.clearRect(0,0, gridSize, gridSize);
        var centerX = gridSize / 2;
        var centerY = gridSize / 2;
        gridCtx.fillStyle = "#000";
        gridCtx.font = "bold 75px sans-serif";
        gridCtx.strokeText("Game Over", centerX, centerY-40);
        gridCtx.fillText("Game Over", centerX, centerY-40);
        gridCtx.font = "bold 35px sans-serif";
        gridCtx.strokeText("Press space key to play again", centerX, centerY+40);
        gridCtx.fillText("Press space key to play again", centerX, centerY+40);
    }

    /* This function displays a new number on the counter */
    function drawCounter(){
        chronoCtx.clearRect(0,0, chronoWidth, chronoHeight);
        chronoCtx.font = "bold 120px sans-serif";
        chronoCtx.fillStyle = counterColor;
        chronoCtx.textAlign = "center";
        chronoCtx.textBaseline = "middle";
        var centerX = chronoWidth / 2;
        var centerY = chronoHeight / 2+8;
        chronoCtx.fillText(counterClock.toString(), centerX, centerY);
    }

    /* This function returns a random int between 0 and max-1 */
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    /* This function return a random list of 9 ColorBox objects */
    function getClassicColorBoxSequence(){
        var newColorSequence = [];
        var randomColor;
        while (newColorSequence.length<9){
            randomColor = classicColors[getRandomInt(10)];
            if (!inArray(randomColor, newColorSequence)){
                newColorSequence.push(randomColor);
            }
        }
        for(var i=0; i<9; i++){
            currentColorBoxSequence[i]= new ColorBox(newColorSequence[i], i%3, Math.floor(i/3));
        }
    }
    
    /* This function checks in the entered element is in the entered array */
    function inArray(element, array){
    var count=array.length;
    for(var i=0;i<count;i++)
    {
        if(array[i]===element){
            return true;
        }
    }
    return false;
    }

    /* This function chooses a random ColorBox object among thoose in the newColorBoxSequence */
    function askNewColorBox(){
        var askedColorBoxIndex = getRandomInt(currentColorBoxSequence.length);
        askedColorBox = currentColorBoxSequence[askedColorBoxIndex];
        document.getElementById("askedColor").innerHTML = askedColorBox.color.fontcolor(askedColorBox.color);
    }

    /* This function set the difficulty to normal */
    function setToNormalMode(){
        difficulty = "normal";
    }

     /* This function set the difficulty to hard */
    function setToHardMode(){
        difficulty = "hard";
    }

    /* CLASSES */

    /* Class ColorBox : an instance a this class corresponds to a color square on the gridCanvas */
    function ColorBox(color, x, y){
        this.color = color;
        this.xCoord = x;
        this.yCoord = y;
    }

    /* MOUSE HANDLER */

    function getCursorPosition(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        xClick = event.clientX - rect.left - gridCanvasBorderWidth;
        yClick = event.clientY - rect.top - gridCanvasBorderWidth;
        console.log("x: " + xClick + " y: " + yClick)
    }

    /* KEYBOARD HANDLER */

    document.onkeydown = function handleKeyDown(e){
        var key = e.keyCode;
        switch(key){
            case 32: // space
                startGame();
                return;
            default:
                return;
        }
    }
    
}