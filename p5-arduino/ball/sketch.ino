const int JOY_X = A0;
const int JOY_Y = A1;
const int POT_PIN = A2;
const int BUTTON_PIN = 2;

void setup() {
  Serial.begin(9600);

  pinMode(BUTTON_PIN, INPUT_PULLUP);
}

void loop() {
  // Read joystick and potentiometer values
  int x = analogRead(JOY_X);
  int y = analogRead(JOY_Y);
  int pot = analogRead(POT_PIN);

  // Button: 1 = released, 0 = pressed
  int button = digitalRead(BUTTON_PIN);

  // Send four comma-separated values
  Serial.print(x);
  Serial.print(",");
  Serial.print(y);
  Serial.print(",");
  Serial.print(pot);
  Serial.print(",");
  Serial.println(button);

  delay(50);
}
