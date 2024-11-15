#include "BluetoothSerial.h"
// configuramos el Serial Bluetooth
#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

BluetoothSerial SerialBT;

/*ESP32*/
#define DEBUG 1
// Sensores CNY70
#define PIN_CNY_1 36
#define PIN_CNY_2 39
#define PIN_CNY_3 34
#define PIN_CNY_4 35
#define PIN_CNY_5 32
#define PIN_CNY_6 33
#define PIN_CNY_7 25
#define PIN_PULSADOR_CONFIRM 13
#define PIN_PULSADOR_MODE 8

#define TICK_CNY70 150
#define TICK_MODE 150
int currentTimeCNY70 = 0;
int currentTimeMode = 0;
bool debug_cny70;
int count_mode = 0;

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

int PINES_CNY[7] = {PIN_CNY_1, PIN_CNY_2, PIN_CNY_3, PIN_CNY_4, PIN_CNY_5, PIN_CNY_6, PIN_CNY_7};
int pesos[7] = {-8, -4, -2, 1, 2, 4, 8}; // pesos en base exponencial 2
int lecturas_cny[7];
int suma_ponderada = 0;
int error = 0;
int error_previo = 0;
int pid_output = 0;
float Kp = 2; // Kp tiene que ser siempre mayor a 1
float Ki;
float Kd;
int derivada = 0;

// rango de velocidad
int vel_min = 0;  
int vel_max = 45;
int vel_base = 160; // velocidad crucero
int vel_pid = 0;
// rango de lecturas
int pid_min = 10000;
int pid_max = -10000;

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

void setup() {
  SerialBT.begin("KOSMOS");
  Serial.begin(115200);
  // caracteristicas canal PWM & enlace con pines salida
  ledcAttachChannel(PIN_PMOTORESa_1, FRQ, RES, CHa_1);
  ledcAttachChannel(PIN_PMOTORESa_2, FRQ, RES, CHa_2);
  ledcAttachChannel(PIN_PMOTORESb_1, FRQ, RES, CHb_1);
  ledcAttachChannel(PIN_PMOTORESb_2, FRQ, RES, CHb_2);
  
  for(int i; i <= 6; i++){
    pinMode(PINES_CNY[i], INPUT);
  }
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(PIN_PULSADOR_CONFIRM, INPUT);
  while((digitalRead(PIN_PULSADOR_CONFIRM)) == 1){
    digitalWrite(LED_BUILTIN, HIGH);
    if((digitalRead(PIN_PULSADOR_MODE)) == true){
      digitalWrite(LED_BUILTIN, LOW);
      if(millis() > currentTimeMode + TICK_MODE){
        currentTimeMode = millis();
        count_mode++;
        if(count_mode > 2) count_mode = 1;
      }
    }
  }
  digitalWrite(LED_BUILTIN, LOW);
}

void loop() {
  switch(count_mode){
    case 1:
      while(true){
        Adelante(150, PIN_PMOTORESa_1, PIN_PMOTORESa_2); // par motor a; par izquierdo
        Adelante(150, PIN_PMOTORESb_1, PIN_PMOTORESb_2); // par motor b; par derecho
      }
      break;

    case 2:
      while(true){
        debug_cny70 = false;
        suma_ponderada = 0;

        if(millis() > currentTimeCNY70 + TICK_CNY70){
          currentTimeCNY70 = millis();
          debug_cny70 = true;
        }

        if(debug_cny70){
          SerialBT.print(" ");
          SerialBT.println("Lecturas: "); 
        }

        for(int i = 0; i <= 6; i++){
          lecturas_cny[i] = analogRead(PINES_CNY[i]);
          suma_ponderada = suma_ponderada + (lecturas_cny[i] * pesos[i]);
          if(debug_cny70){
            SerialBT.println(lecturas_cny[i]);
          }
        }

        /*Calculo error y salida PID*/
        error = suma_ponderada;
        pid_output = (Kp * error);

        /*Mapear salida PID para valor velocidad de correccion*/
        vel_pid = map(pid_output, pid_min, pid_max, vel_min, vel_max);
        if(pid_output < pid_min) pid_min = pid_output;
        if(pid_output > pid_max) pid_max = pid_output;
  
        vel_pid = constrain(vel_pid, 0, 255);

        if(DEBUG) Serial.print("Velocidad pid: ");
        if(DEBUG) Serial.println(vel_pid);
        
        /*Determinar sentido y aplicar velocidad*/
        if(pid_output >= 0){
          Adelante((vel_base + vel_pid), PIN_PMOTORESa_1, PIN_PMOTORESa_2); // par motor a; par izquierdo
          Adelante((vel_base - vel_pid), PIN_PMOTORESb_1, PIN_PMOTORESb_2); // par motor b; par derecho
        }
        else if(pid_output < 0){
          Adelante((vel_base - vel_pid), PIN_PMOTORESa_1, PIN_PMOTORESa_2); // par motor a; par izquierdo
          Adelante((vel_base + vel_pid), PIN_PMOTORESb_1, PIN_PMOTORESb_2); // par motor b; par derecho
        }

        if(DEBUG){
          Serial.println(" ");
          Serial.print("Suma ponderada: ");
          Serial.println(suma_ponderada);
          Serial.print("Error: ");
          Serial.println(error);
          Serial.print("PID: ");
          Serial.println(pid_output);
          Serial.print("Correccion velocidad: ");
          Serial.println(vel_pid);
          Serial.print("Velocidad: ");
          Serial.println((vel_base + vel_pid));
        }
      }
      break;
  }
  /*
  derivada = error - error_previo;
  integral =+ error;
  pid_output = (Kp * error) + (Ki * (integral)) + (Kd * (derivada));
  */
}
