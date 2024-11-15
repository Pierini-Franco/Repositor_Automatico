/* PINES ESP32*/
// Sensores CNY70
#define PIN_CNY_1 36
#define PIN_CNY_2 39
#define PIN_CNY_3 34
#define PIN_CNY_4 35
#define PIN_CNY_5 32
#define PIN_CNY_6 33
#define PIN_CNY_7 25
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

int PINES_CNY[7] = {PIN_CNY_1, PIN_CNY_2, PIN_CNY_3, PIN_CNY_4, PIN_CNY_5, PIN_CNY_6, PIN_CNY_7};
float pesos[7] = {-2, -1, 0, 0, 0, 1, 2};
int lecturas_cny[7];
int sum_pond, sum_lecturas;
int error_previo = 0;
int derivada = 0;
int pid_output;
int p_max = 4095;
float error = 0;
float p_output;
float Kp = 0.5;
float Ki;
float Kd;
// para suma ponderada: -3; -2; -1; 0; 1; 2; 3

int crr_vel = 0;
int vel_max = 150;

void setup() {
  Serial.begin(115200);
  // caracteristicas canal PWM
  // enlace con pines salida
  ledcAttachChannel(PIN_PMOTORESa_1, FRQ, RES, CHa_1);
  ledcAttachChannel(PIN_PMOTORESa_2, FRQ, RES, CHa_2);
  ledcAttachChannel(PIN_PMOTORESb_1, FRQ, RES, CHb_1);
  ledcAttachChannel(PIN_PMOTORESb_2, FRQ, RES, CHb_2);
  
  for(int i; i <= 6; i++){
    pinMode(PINES_CNY[i], INPUT);
  }
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
  
  p_output = 0;
  pid_output = 0;
  sum_pond = 0;
  sum_lecturas = 0;
  
  /*Obtener lecturas y error*/
  Serial.println(" ");
  Serial.print("Lecturas: ");
  for(int i = 0; i <= 6; i++){
    lecturas_cny[i] = analogRead(PINES_CNY[i]);
    sum_pond = sum_pond + (lecturas_cny[i] * pesos[i]);
    
    /*Depurar lecturas*/
    Serial.print(lecturas_cny[i]);
    Serial.print(" ");
  }

  /*Equivalencia Calculo de error*/
  //sum_pond = (lecturas_cny[0] * -2) + (lecturas_cny[1] * -1) + (lecturas_cny[2] * 0) + (lecturas_cny[3] * 0) + (lecturas_cny[4] * 0) + (lecturas_cny[5] * 1) + (lecturas_cny[6] * 2);
  //suma_lecturas = (lecturas_cny[0]) + (lecturas_cny[1]) + (lecturas_cny[2]) + (lecturas_cny[3]) + (lecturas_cny[4]) + (lecturas_cny[5]) + (lecturas_cny[6]);

  /*Calculo error*/
  error = sum_pond;
  
  /*Calculo componentes*/
  p_output = Kp * error;
  pid_output = p_output;

  /*Calcular correccion velocidad*/
  crr_vel = (p_output / p_max) * 254;
  
  if(crr_vel >= 0){
    Adelante(vel_max, PIN_PMOTORESa_1, PIN_PMOTORESa_2); // par motor a; par izquierdo
    Adelante((vel_max - crr_vel), PIN_PMOTORESb_1, PIN_PMOTORESb_2); // par motor b; par derecho
  }
  else if(crr_vel < 0){
    Adelante((vel_max - crr_vel), PIN_PMOTORESa_1, PIN_PMOTORESa_2); // par motor a; par izquierdo
    Adelante(vel_max, PIN_PMOTORESb_1, PIN_PMOTORESb_2); // par motor b; par derecho
  }
  
  /*Depuracion*/
  Serial.println(" ");
  Serial.print("Suma ponderada: ");
  Serial.println(sum_pond);
  Serial.print("Error: ");
  Serial.println(error);
  Serial.print("Componente P: ");
  Serial.println(p_output);
  Serial.print("PID: ");
  Serial.println(pid_output);
  Serial.print("Correccion velocidad: ");
  Serial.println(crr_vel);
  
  /*derivada = error - error_previo;
  integral =+ error;
  pid_output = (Kp * error) + (Ki * (integral)) + (Kd * (derivada));*/
  delay(500);
}

