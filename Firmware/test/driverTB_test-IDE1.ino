// Par de motores
#define PIN_PMOTORESa_1 22 
#define PIN_PMOTORESa_2 21
#define PIN_PMOTORESb_1 5 
#define PIN_PMOTORESb_2 18
// PWM
const int CHa_1 = 4;
const int CHa_2 = 5;
const int CHb_1 = 6;
const int CHb_2 = 7;
const int FRQ = 10000;
const int RES = 8;
// DUTY CYCLE es el pid_output

void setup() {
  Serial.begin(115200);
  
  // caracteristicas canal PWM
  ledcSetup(CHa_1, FRQ, RES);
  ledcSetup(CHa_2, FRQ, RES);
  /*
  ledcSetup(CHb_1, FRQ, RES);
  ledcSetup(CHb_2, FRQ, RES);
  */
  // enlace con pines salida
  ledcAttachPin(PIN_PMOTORESa_1, CHa_1);
  ledcAttachPin(PIN_PMOTORESa_2, CHa_2);
  /*
  ledcAttachPin(PIN_PMOTORESb_1, CHb_1);
  ledcAttachPin(PIN_PMOTORESb_2, CHb_2);
  */
}

void Adelante(int vel, int ch_1, int ch_2){
  ledcWrite(ch_1, vel);
  ledcWrite(ch_2, 0);
}

void Atras(int vel, int ch_1, int ch_2){
  ledcWrite(ch_1, 0);
  ledcWrite(ch_2, vel);
}

// ej.: Adelante(pid_output, CHa_1, CHa_2); par de motor 1
// ej.: Atras(pid_output, CHb_1, CHb_2); par de motor 2

void loop() {
  for(int i = 85; i <= 255; i = i + 10){
    Adelante(i, CHa_1, CHa_2);
    delay(90);
    }
    for(int i = 255; i >= 85; i = i - 10){
    Adelante(i, CHa_1, CHa_2);
    delay(90);
    }
}
