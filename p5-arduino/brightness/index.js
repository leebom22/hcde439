const BAUD_RATE = 9600;

let port, connectBtn, powerBtn;
let brightness = 0;
let ledOn = true;
let savedBrightness = 150;

function setup() {
  setupSerial();
  createCanvas(windowWidth, windowHeight);

  textFont("system-ui", 24);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);

  powerBtn = createButton("Turn LED OFF");
  powerBtn.position(5, 45);
  powerBtn.mouseClicked(toggleLED);
}

function draw() {
  const portIsOpen = checkPort();
  if (!portIsOpen) return;

  let str = port.readUntil("\n");

  if (str.length > 0) {
    brightness = Number(str.trim());
  }

  background(0, 0, brightness);

  fill(255);

  text(
    "Brightness: " + brightness,
    windowWidth / 2,
    windowHeight / 2 - 40
  );

  text(
    ledOn
      ? "Move the mouse left/right to change brightness"
      : "LED is OFF",
    windowWidth / 2,
    windowHeight / 2 + 40
  );
}

function mouseMoved() {
  if (!port.opened() || !ledOn) return;

  let val = Math.floor(
    map(mouseX, 0, windowWidth, 0, 255)
  );

  val = constrain(val, 0, 255);

  savedBrightness = val;

  port.write([val]);
}

function toggleLED() {
  if (!port.opened()) return;

  ledOn = !ledOn;

  if (ledOn) {
    port.write([savedBrightness]);
    powerBtn.html("Turn LED OFF");
  } else {
    port.write([0]);
    powerBtn.html("Turn LED ON");
  }
}

function setupSerial() {
  port = createSerial();

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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
