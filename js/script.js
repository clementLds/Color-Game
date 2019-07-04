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
    var gridWidth = 600;
    var gridHeight = 600;
    var blockSize = 200;
    var gridCtx;

    /* main */
    init();
    count();
    drawGrid();
    //document.getElementById("mydiv").innerHTML = "str1".fontcolor("red");

    /* functions */
    
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
        document.body.appendChild(gridCanvas);
        gridCtx = gridCanvas.getContext('2d');
    }

    function initChrono(){
        var chronoCanvas = document.createElement('canvas');
        chronoCanvas.width = chronoWidth;
        chronoCanvas.height = chronoHeight;
        chronoCanvas.style.border = "2px solid black";
        chronoCanvas.style.margin = "50px  50px auto auto";
        chronoCanvas.style.display = "block";
        chronoCanvas.style.backgroundColor = "#ddd";
        document.body.appendChild(chronoCanvas);
        chronoCtx = chronoCanvas.getContext('2d');
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
        var newColorSequence = getClassicColorSequence();
        console.log(newColorSequence);
        for (var i=0;i<9;i++){
            gridCtx.fillStyle = newColorSequence[i];
            console.log(newColorSequence[i]);
            if(i<3){
                drawBlock(gridCtx, [i,0]);
            } else if(i<6){
                drawBlock(gridCtx, [i-3,1]);
            }else{
                drawBlock(gridCtx, [i-6,2]);
            }
        }
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
        var mySequence = [];
        var randomColor;
        while (mySequence.length<9){
            randomColor = classicColors[getRandomInt(10)];
            if (!inArray(randomColor, mySequence)){
                mySequence.push(randomColor);
            }
        }
        return mySequence;
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
    
}

 
    
   