window.onload = function(){

    /* VARIABLES */

    /* chrono */
    var chronoWidth = Math.min(150,  window.innerWidth*0.225);
    var chronoHeight = Math.min(110,  window.innerWidth*0.165);
    var chronoFontSize = Math.min(120,  window.innerWidth*0.18); // in pixels
    var chronoCtx;
    var counterColor = "gray";
    var gameLength = 20;
    var counterClock = gameLength;
    var delayClock = 1000; // 1 second 
    var timeout;

    /* color grid */
    var classicColors=["Blue", "Yellow", "Green", "Purple", "Black", "Gray", "Pink", "Red", "Orange", "Brown"];
    var hardColors=["LightSeaGreen", "LightBlue", "LightSteelBlue", "DodgerBlue", "DarkTurquoise", "DarkSeaGreen", "PaleGreen ", "Cyan", "CornflowerBlue", "Aquamarine"];
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
    var difficulty = "Normal";
    var normalBut = document.getElementById('normalButton');
    var hardBut = document.getElementById('hardButton');

    /* MAIN PROGRAM */

    init();

    /* FUNTIONS */
    
    /* This functions initializes all the program */
    function init(){
        initGrid();
        initChrono();
        drawInitialMessage();
        document.getElementById("score").innerHTML = score;
        document.getElementById("bestScore").innerHTML = bestScore;
        document.getElementById("difficulty").innerHTML = difficulty;
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
            drawGrid();
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
        gridCtx.font = "bold "+(gridSize/13.33).toString()+"px sans-serif";
        gridCtx.strokeText("Press space key or", centerX, centerY-30);
        gridCtx.fillText("Press space key or", centerX, centerY-30);
        gridCtx.strokeText("double click here to play", centerX, centerY+30);
        gridCtx.fillText("double click here to play", centerX, centerY+30);
    }

    /* This function displays game over message */
    function drawGameOverMessage(){
        gridCtx.clearRect(0,0, gridSize, gridSize);
        var centerX = gridSize / 2;
        var centerY = gridSize / 2;
        gridCtx.fillStyle = "#000";
        gridCtx.font = "bold "+(gridSize/8).toString()+"px sans-serif";
        gridCtx.strokeText("Game Over", centerX, centerY-40);
        gridCtx.fillText("Game Over", centerX, centerY-40);
        gridCtx.font = "bold "+(gridSize/17.14).toString()+"px sans-serif";
        gridCtx.strokeText("Press space key or double", centerX, centerY+40);
        gridCtx.fillText("Press space key or double", centerX, centerY+40);
        gridCtx.strokeText("click here to play again", centerX, centerY+90);
        gridCtx.fillText("click here to play again", centerX, centerY+90);
    }

    /* This function displays a new number on the counter */
    function drawCounter(){
        chronoCtx.clearRect(0,0, chronoWidth, chronoHeight);
        chronoCtx.font = "bold "+chronoFontSize.toString()+"px sans-serif";
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
            if(difficulty==="Normal"){
                randomColor = classicColors[getRandomInt(classicColors.length)];
            } else if(difficulty==="Hard"){
                randomColor = hardColors[getRandomInt(hardColors.length)];
            }
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

    /* CLASSES */

    /* Class ColorBox : an instance a this class corresponds to a color square on the gridCanvas */
    function ColorBox(color, x, y){
        this.color = color;
        this.xCoord = x;
        this.yCoord = y;
    }

    /* MOUSE HANDLER */

    /* This function gets the X and Y coordinates of a click on the gridCanvas */
    function getCursorPosition(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        xClick = event.clientX - rect.left - gridCanvasBorderWidth;
        yClick = event.clientY - rect.top - gridCanvasBorderWidth;
    }

    /* This function starts a new game when a click occurred on the gridCanvas when no game is running */
    document.getElementById("colorGrid").ondblclick = function(){
        var clickCounter;
        if(gameOver){
            startGame();
        }
    }

     /* This function sets the difficulty to normal */
     normalBut.onclick = function()
   {
        difficulty = "Normal";
        document.getElementById("difficulty").innerHTML = difficulty;
    };

    /* This function sets the difficulty to hard */
    hardBut.onclick = function()
   {
        difficulty = "Hard";
        document.getElementById("difficulty").innerHTML = difficulty;
   };

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