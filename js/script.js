window.onload = function(){
    /* chrono */
    var chronoWidth = 150;
    var chronoHeight = 110;
    var chronoCtx;
    var counterColor = "gray";
    var counterClock = 30;
    var delayClock = 1000; // 1 second 
    var timeout;

    /* color grid */
    var classicColors=["blue", "yellow", "green", "purple", "black", "gray", "pink", "red", "orange", "brown"];
    var currentColorSequence = [];
    var gridWidth = 600;
    var gridHeight = 600;
    var blockSize = 200;
    var gridCtx;

    /* flags */
    var gameOver = true;
    var rightColorWasClicked = false;
    var askedColor = "";

    /* main */
    init();

    /* functions */

    function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    console.log("x: " + x + " y: " + y)
}
    
    function init(){
        initGrid();
        initChrono();
    }

    function initGrid(){
        var gridCanvas = document.createElement('canvas');
        gridCanvas.width = gridWidth;
        gridCanvas.height = gridHeight;
        gridCanvas.style.border = "10px solid #444";
        gridCanvas.style.margin = "50px auto auto 300px";
        gridCanvas.style.display = "block";
        gridCanvas.style.float = "left";
        gridCanvas.style.backgroundColor = "#ddd";
        gridCtx = gridCanvas.getContext('2d');
        document.getElementById("colorGrid").appendChild(gridCanvas);
        gridCanvas.addEventListener('mousedown', function(e) {
        getCursorPosition(gridCanvas, e)
        })
    }

    function initChrono(){
        var chronoCanvas = document.createElement('canvas');
        chronoCanvas.width = chronoWidth;
        chronoCanvas.height = chronoHeight;
        chronoCanvas.style.border = "2px solid black";
        chronoCanvas.style.margin = "50px  50px auto auto";
        chronoCanvas.style.display = "block";
        chronoCanvas.style.backgroundColor = "#ddd";
        chronoCtx = chronoCanvas.getContext('2d');
        document.getElementById("chrono").appendChild(chronoCanvas);
    }

    function play(){
        if(gameOver){ // no game running
            gameOver = false;
            count();
            while(counterClock>0){
                if(rightColorWasClicked){
                    rightColorWasClicked = false;
                    drawGrid();
                    askNewColor();
                }
                //element.onclick = functionRef
            }
            gameOver = true;
        }
    }

    function count(){
        if(counterClock==5){
            counterColor = "red";
        }
        drawCounter();
        if(counterClock>0){
            counterClock --;
            timeout = setTimeout(count, delayClock);
        }
    }

    function drawBlock(ctx, position){
        var x = position[0]*blockSize;
        var y = position[1]*blockSize;
        ctx.fillRect(x,y, blockSize, blockSize);
    }

    function drawGrid(){
        currentColorSequence = getClassicColorSequence();
        console.log(currentColorSequence);
        for (var i=0;i<9;i++){
            gridCtx.fillStyle = currentColorSequence[i];
            console.log(currentColorSequence[i]);
            if(i<3){
                drawBlock(gridCtx, [i,0]);
            } else if(i<6){
                drawBlock(gridCtx, [i-3,1]);
            }else{
                drawBlock(gridCtx, [i-6,2]);
            }
        }
        return currentColorSequence;
    }

    function drawCounter(){
        chronoCtx.clearRect(0,0, chronoWidth, chronoHeight);
        chronoCtx.font = "bold 120px sans-serif";
        chronoCtx.fillStyle = counterColor;
        chronoCtx.textAlign = "center";
        chronoCtx.textBaseline = "middle";
        var centreX = chronoWidth / 2;
        var centreY = chronoHeight / 2+8;
        chronoCtx.fillText(counterClock.toString(), centreX, centreY);
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function getClassicColorSequence(){
        var newColorSequence = [];
        var randomColor;
        while (newColorSequence.length<9){
            randomColor = classicColors[getRandomInt(10)];
            if (!inArray(randomColor, newColorSequence)){
                newColorSequence.push(randomColor);
            }
        }
        return newColorSequence;
    }

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

    function askNewColor(){
        var index = getRandomInt(currentColorSequence.length);
        askedColor = currentColorSequence[index];
        document.getElementById("askedColor").innerHTML = askedColor.fontcolor(askedColor);
    }
    
}

 
    
   