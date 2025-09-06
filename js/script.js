function startGame() {
    let div = document.getElementById("buttonContainer");
    div.style.padding = "20px";
    div.innerHTML = "";


    let value = document.getElementById("myInput").value;

    if (isNaN(value)) {
        alert(ENTER_NUMBER);
        return;
    }

    if (value < 3 || value > 7) {
        alert(BETWEEN_3_AND_7);
        return;
    }

    document.getElementById("inputContainer").style.display = "none";


    let arrayButtons = [];
    let colors = ["808000", "FF0000" , "FFFF00", "008000", "FF00FF" , "800080", "008080", "00FFFF"]

    
    for (i = 0; i < value; i++) {
        const colorsIndex = Math.floor(Math.random() * colors.length);
        let color = '#' + colors[colorsIndex];
        colors.splice(colorsIndex, 1);
        

        let width = 10 + "em";
        let height = 5 + "em";
        let top = 10 + "px";
        
        let left = (window.innerWidth / value) * (i)  + "px";

        let location = new Location(top, left);
         
        arrayButtons.push(new Button(color, width, height, location, i));   
    }

    
    
    for (i = 0; i < arrayButtons.length; i++) {

        div.appendChild(arrayButtons[i].object);
    }

 

    arrayButtons.forEach(button =>
        button.setLocation(
            (Math.floor(0) + "px",
            Math.floor(100) + "px"
            )
    ))

    let intervalInBetween = 2 * 1000;
    let pauseBeforeStart = value * 1000;

    setTimeout(() => {
       intervalKickOff(arrayButtons, value, intervalInBetween, () => {
    // ✅ playgame runs AFTER scrambling finishes
    playgame(arrayButtons, div);
  });
    }, pauseBeforeStart); 
    
}


function playgame(arrayButtons, div) {

    round = 1;
    arrayButtons.forEach(button => 
        button.object.addEventListener("click", function(){
            if (button.order === round) {

                alert(CORRECT);
                round++;
                button.object.addText = round;
                button.resetToOrigin()
                button.returnText()

                    if (round === arrayButtons.length + 1) {
                        alert(EXCELLENT_MEMORY);
                        div.innerHTML = "";
                        document.getElementById("inputContainer").style.display = "block";
                 }
            }

            else {
                alert(WRONG_BUTTON_GAME_OVER);
                div.innerHTML = "" ;
                document.getElementById("inputContainer").style.display = "block";
            }
        })
    )
}



function intervalKickOff(arrayButtons, numberOfTimes, delayTime, callback) {
  let count = 0;

  let intervalId = setInterval(() => {
    count++;
    console.log(`Scramble round ${count}`);

    arrayButtons.forEach(button => {
              
        let top = Math.floor(Math.random() * (window.innerHeight - 100) )
        let left = Math.floor(Math.random() * (window.innerWidth - 100) )
        
        if ( top < 100 ) {
            top = 100;
        } else if ( top > window.innerHeight - 100 ) {
            top = window.innerHeight - 100;
        }

        if ( left < 100 ) {
            left = 100;
        } else if ( left > window.innerWidth - 100 ) {
            left = window.innerWidth - 100;
        }

      button.resetLocation(top + "px", left + "px");
      button.removeText();
    });

    if (count >= numberOfTimes) {
      clearInterval(intervalId); 
      if (callback) callback();
      console.log("Scrambling finished!");
    }
  }, delayTime);
}


class Location {
    constructor(top, left) {
        this.locationResets = 0
        this.originalTop = top; 
        this.originalLeft = left
        this.top = top;
        this.left = left;
    }

    setTop = function(top) {
        this.top = top;
    }

    setLeft = function(left) {
        this.left = left;
    }

    getBackToOriginal = function() {
        this.top = this.originalTop;
        this.left = this.originalLeft;
    }   
}


class GameObject {
    constructor(location, objectType) {
        this.object = document.createElement(objectType);  
        this.location = location; 
        this.setLocation()
    }

    resetToOrigin = function() {
        this.location.getBackToOriginal();
        this.setLocation(this.location);
    }

    resetLocation = function(top, left) {
        this.location.setTop(top);
        this.location.setLeft(left);    
        this.setLocation(this.location);
    }
        
    
    setLocation = function() {
            this.object.style.top = this.location.top;
            this.object.style.left = this.location.left;
        }
}



class Button extends GameObject {
    constructor(color, width, height, location, order) {
        super(location, "button");
        this.order = (order + 1)
        this.object.innerHTML =  (order + 1)
        this.object.style.backgroundColor = color;
        this.object.style.width = width;
        this.object.style.height = height;
        this.object.style.position = "absolute";
    }

    removeText = function() {
        this.object.innerHTML = "";
    }

    returnText = function() {
        this.object.innerHTML = this.order;
    }

}