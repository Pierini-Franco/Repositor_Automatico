// Pulsador
#define PIN_PULSADOR 13

void setup() {
  Serial.begin(115200);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(PIN_PULSADOR, INPUT);
  while((digitalRead(PIN_PULSADOR)) == 1){
    digitalWrite(LED_BUILTIN, HIGH);
    Serial.println("Sin presionar");
    delay(100);
  }
  digitalWrite(LED_BUILTIN, LOW);
  Serial.println("Presionado");
}

void loop() {
  
}
