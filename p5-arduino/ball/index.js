const BAUD_RATE = 9600;
const MIN_DIAMETER = 10;
const MAX_DIAMETER = 40;

const MOVE_SPEED = 5;
const DEADZONE = 100;
const GOAL_DIAMETER = 40;

let port, connectBtn;

// Game variables
let ballX, ballY;
let goalX, goalY;
let diameter = 20;
let score = 0;
let lastButtonState = 1;

function setup() {
  setupSerial();
  createCanvas(windowWidth, windowHeight);

  resetGame();
}

// Reset the game to its starting state
function resetGame() {
  ballX = width * 0.2;
  ballY = height * 0.5;

  goalX = width * 0.8;
  goalY = height * 0.5;

  score = 0;
}

function draw() {
  const portIsOpen = checkPort();
  if (!portIsOpen) return;

  // Read data from Arduino
  let str = port.readUntil("\n");

  if (str.length > 0) {
    let arr = str.trim().split(",");

    if (arr.length === 4) {
      let x = Number(arr[0]);
      let y = Number(arr[1]);
      let pot = Number(arr[2]);
      let button = Number(arr[3]);

      if ([x, y, pot, button].every(Number.isFinite)) {

        // Potentiometer controls ball size
        diameter = map(
          pot, 0, 1023,
          MIN_DIAMETER, MAX_DIAMETER
        );

        // Reset when joystick button is pressed
        if (button === 0 && lastButtonState === 1) {
          resetGame();
        } else {
          // Relative joystick movement
          if (x < 512 - DEADZONE) {
            ballX -= MOVE_SPEED;
          } else if (x > 512 + DEADZONE) {
            ballX += MOVE_SPEED;
          }

          if (y < 512 - DEADZONE) {
            ballY -= MOVE_SPEED;
          } else if (y > 512 + DEADZONE) {
            ballY += MOVE_SPEED;
          }
        }

        lastButtonState = button;
      }
    }
  }

  // Keep the ball inside the canvas
  ballX = constrain(
    ballX, diameter / 2, width - diameter / 2
  );
  ballY = constrain(
    ballY, diameter / 2, height - diameter / 2
  );

  // Check if the ball reaches the goal
  let distance = dist(ballX, ballY, goalX, goalY);

  if (distance < (diameter + GOAL_DIAMETER) / 2) {
    score++;

    // Return ball to starting position
    ballX = width * 0.2;
    ballY = height * 0.5;
  }

  // Draw game background
  background(245);

  // Display score and instructions
  fill(30);
  noStroke();
  textSize(24);
  textAlign(CENTER);
  text("Score: " + score, width / 2, 50);

  textSize(15);
  text(
    "Move the ball to the green goal!",
    width / 2, 80
  );

  // Draw goal
  fill("lightgreen");
  stroke("green");
  strokeWeight(3);
  circle(goalX, goalY, GOAL_DIAMETER);

  // Draw player's ball
  fill("cornflowerblue");
  stroke("royalblue");
  strokeWeight(2);
  circle(ballX, ballY, diameter);
}

// Serial connection helpers from original example

function setupSerial() {
  port = createSerial();

  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], BAUD_RATE);
  }

  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(5, 5);
  connectBtn.mouseClicked(onConnectButtonClicked);
}

function checkPort() {
  if (!port.opened()) {
    connectBtn.html("Connect to Arduino");
    background("gray");
    return false;
  } else {
    connectBtn.html("Disconnect");
    return true;
  }
}

function onConnectButtonClicked() {
  if (!port.opened()) {
    port.open(BAUD_RATE);
  } else {
    port.close();
  }
}
