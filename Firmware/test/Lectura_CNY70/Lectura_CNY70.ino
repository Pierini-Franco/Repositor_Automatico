#define PIN_CNY 4

void setup() {
  Serial.begin(115200);
}

void loop() {
  Serial.println(analogRead(PIN_CNY));
  delay(200);
}
