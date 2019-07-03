window.onload = function(){
    var chronoWidth = 150;
    var chronoHeight = 110;
    var ctx;
    var counterColor = "gray";
    var counterClock = 30;
    var delayClock = 1000; // 1 second
    var timeout;

    init();
    count();

     function init(){
        var chrono = document.createElement('canvas');
        chrono.width = chronoWidth;
        chrono.height = chronoHeight;
        chrono.style.border = "2px solid black";
        chrono.style.margin = "50px  50px auto auto";
        chrono.style.display = "block";
        chrono.style.backgroundColor = "#ddd";
        document.body.appendChild(chrono);
        ctx = chrono.getContext('2d');
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

     function drawCounter(){
        ctx.clearRect(0,0, chronoWidth, chronoHeight);
        ctx.font = "bold 120px sans-serif";
        ctx.fillStyle = counterColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centreX = chronoWidth / 2;
        var centreY = chronoHeight / 2+8;
        ctx.fillText(counterClock.toString(), centreX, centreY);
    }
}

 
    
   