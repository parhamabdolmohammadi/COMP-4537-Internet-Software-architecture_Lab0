    // Global variables
    let arrayButtons = [];
    let round = 1;

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

      arrayButtons = []; // reset global buttons
      let colors = ["808000", "FF0000", "FFFF00", "008000", "FF00FF", "800080", "008080", "00FFFF"];

      for (let i = 0; i < value; i++) {
        const colorsIndex = Math.floor(Math.random() * colors.length);
        let color = "#" + colors[colorsIndex];
        colors.splice(colorsIndex, 1);

        let width = "10em";
        let height = "5em";
        let top = "10px";
        let left = (window.innerWidth / value) * i + "px";

        let location = new Location(top, left);
        arrayButtons.push(new Button(color, width, height, location, i));
      }

      for (let i = 0; i < arrayButtons.length; i++) {
        div.appendChild(arrayButtons[i].object);
      }

      arrayButtons.forEach(button => button.setLocation("10px", button.location.left));

      let intervalInBetween = 2000; 
      let pauseBeforeStart = value * 1000;

      setTimeout(() => {
        intervalKickOff(arrayButtons, value, intervalInBetween, () => {
          playgame(arrayButtons, div);
        });
      }, pauseBeforeStart);
    }

    function playgame(arrayButtons, div) {
      round = 1;
      arrayButtons.forEach(button =>
        button.object.addEventListener("click", function () {
          if (button.order === round) {
            alert(CORRECT);
            round++;
            button.resetToOrigin();
            button.returnText();

            if (round === arrayButtons.length + 1) {
              alert(EXCELLENT_MEMORY);
              div.innerHTML = "";
              document.getElementById("inputContainer").style.display = "block";
            }
          } else {
            alert(WRONG_BUTTON_GAME_OVER);
            div.innerHTML = "";
            document.getElementById("inputContainer").style.display = "block";
          }
        })
      );
    }

    function intervalKickOff(arrayButtons, numberOfTimes, delayTime, callback) {
      let count = 0;

      let intervalId = setInterval(() => {
        count++;
        console.log(`Scramble round ${count}`);

        arrayButtons.forEach(button => {
          let top = Math.floor(Math.random() * (window.innerHeight - 100));
          let left = Math.floor(Math.random() * (window.innerWidth - 100));

          if (top < 100) top = 100;
          if (top > window.innerHeight - 100) top = window.innerHeight - 100;
          if (left < 100) left = 100;
          if (left > window.innerWidth - 100) left = window.innerWidth - 100;

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



let prevWidth = window.innerWidth;
let prevHeight = window.innerHeight;

window.addEventListener("resize", () => {
  const scaleX = window.innerWidth / prevWidth;
  const scaleY = window.innerHeight / prevHeight;

  arrayButtons.forEach(button => {
    let oldLeft = parseFloat(button.location.left);
    let oldTop = parseFloat(button.location.top);

    let newLeft = oldLeft * scaleX + "px";
    let newTop = oldTop * scaleY + "px";

    button.location.left = newLeft;
    button.location.top = newTop;
    button.setLocation();
  });

  prevWidth = window.innerWidth;
  prevHeight = window.innerHeight;
});
    class Location {
      constructor(top, left) {
        this.originalTop = top;
        this.originalLeft = left;
        this.top = top;
        this.left = left;
      }

      setTop(top) {
        this.top = top;
      }
      setLeft(left) {
        this.left = left;
      }
      getBackToOriginal() {
        this.top = this.originalTop;
        this.left = this.originalLeft;
      }
    }

    class GameObject {
      constructor(location, objectType) {
        this.object = document.createElement(objectType);
        this.location = location;
        this.setLocation();
      }

      resetToOrigin() {
        this.location.getBackToOriginal();
        this.setLocation();
      }

      resetLocation(top, left) {
        this.location.setTop(top);
        this.location.setLeft(left);
        this.setLocation();
      }

      setLocation(top = this.location.top, left = this.location.left) {
        this.object.style.top = top;
        this.object.style.left = left;
        this.location.top = top;
        this.location.left = left;
      }
    }

    class Button extends GameObject {
      constructor(color, width, height, location, order) {
        super(location, "button");
        this.order = order + 1;
        this.object.innerHTML = this.order;
        this.object.style.backgroundColor = color;
        this.object.style.width = width;
        this.object.style.height = height;
        this.object.style.position = "absolute";
      }

      removeText() {
        this.object.innerHTML = "";
      }

      returnText() {
        this.object.innerHTML = this.order;
      }
    }