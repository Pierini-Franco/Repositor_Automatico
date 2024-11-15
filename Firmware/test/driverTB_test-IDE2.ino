// Pulsador
#define PIN_PULSADOR 13
// Par de motores
const int PIN_PMOTORESa_1 = 22; 
const int PIN_PMOTORESa_2 = 21;
const int PIN_PMOTORESb_1 = 19; 
const int PIN_PMOTORESb_2 = 18;
// PWM
const int CHa_1 = 4;
const int CHa_2 = 5;
const int CHb_1 = 6;
const int CHb_2 = 7;
const int FRQ = 10000;
const int RES = 8;
// DUTY CYCLE es el pid_output

void setup() {
  // caracteristicas canal PWM
  // enlace con pines salida
  pinMode(PIN_PMOTORESa_1, OUTPUT);
  pinMode(PIN_PMOTORESa_2, OUTPUT);
  pinMode(PIN_PMOTORESb_1, OUTPUT);
  pinMode(PIN_PMOTORESb_2, OUTPUT);

  ledcAttachChannel(PIN_PMOTORESa_1, FRQ, RES, CHa_1);
  ledcAttachChannel(PIN_PMOTORESa_2, FRQ, RES, CHa_2);
  ledcAttachChannel(PIN_PMOTORESb_1, FRQ, RES, CHb_1);
  ledcAttachChannel(PIN_PMOTORESb_2, FRQ, RES, CHb_2);

  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(PIN_PULSADOR, INPUT);
  while((digitalRead(PIN_PULSADOR)) == 1){
    digitalWrite(LED_BUILTIN, HIGH);
  }
  digitalWrite(LED_BUILTIN, LOW);
}

void Adelante(int vel, int pin_1, int pin_2){
  ledcWrite(pin_1, vel);
  ledcWrite(pin_2, 0);
}

void Atras(int vel, int pin_1, int pin_2){
  ledcWrite(pin_1, 0);
  ledcWrite(pin_2, vel);
}

// ej.: Adelante(pid_output, PIN_PMOTORESa_1, PIN_PMOTORESa_2); par de motor 1
// ej.: Atras(pid_output, PIN_PMOTORESb_1, PIN_PMOTORESb_2); par de motor 2

void loop() {
  Adelante(150, PIN_PMOTORESa_1, PIN_PMOTORESa_2);
  Adelante(150, PIN_PMOTORESb_1, PIN_PMOTORESb_2);
}
