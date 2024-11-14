#include <WiFi.h>
#include <PubSubClient.h>
#include "BluetoothSerial.h"
#define DEBUG 0
#define IN6 16
#define IN5 17
#define IN4 18
#define IN3 19
#define IN2 21
#define IN1 22
#define PIN_CNY1 36
#define PIN_CNY2 39
#define PIN_CNY3 34
#define PIN_CNY4 35
#define PIN_CNY5 32
#define PIN_CNY6 33
#define PIN_CNY7 25
#define FC1 4
#define FC2 26
#define FC3 27
#define led_ESP 2

#define derecha 1
#define izquierda 0
#define arriba 1
#define abajo 0

//Hardware
int x = 0; 
float anterior = 0, espera = 10, TIME;
int umbral = 1000; // negro > 1000
int var;
int ARRANCA;
int nivel;  
int destino;
int estado; 

// Canales PWM
#define CHA1 4
#define CHA2 5
#define CHB1 6
#define CHB2 7
#define CHC1 8
#define CHC2 9

#define FRQ 1000
#define RES 8
#define VEL 70


//Futbolista
/*int CT;
const int canalPWM0 = 0;
const int canalPWM1 = 1;
const int frecuencia = 10000;
const int resolucion = 8;  // Ciclo de trabajo de 0 a 255
String incoming, angulo;
char angulo1;
int modulo, boton;
BluetoothSerial BT;  // Objeto Bluetooth
*/
//conexion wifi
// WiFi 
//const char *ssid = "MovistarFibra-F76AF0"; // Enter your WiFi name
//const char *password = "cnvpmJkmdYrtNfX4ts2G";  // Enter WiFi password
//const char *ssid = "Franco's Galaxy A11"; // Introduce el nombre de tu WiFi 
//const char *password = "gkme2498";  // Introduce tu contraseña WiFi 
const char *ssid = "Taller_Electronica";
const char *password = "robotica";

WiFiClient espClient;                        // Definir espClient como un objeto de la clase WiFiClient. 


// MQTT Broker
int PAYLOADINT;
const char *mqtt_broker = "broker.emqx.io";
const char *topic = "KOSMOS"; //nombre a cambiar (nombre broker)
const char *mqtt_username = "KOSMOS_ESP"; //nombre a cambiar (nombre usuario)
const char *mqtt_password = "Repositor1"; //nombre a cambiar (nombre contraseña)
const int mqtt_port = 1883;
PubSubClient client(espClient);              // Definir espClient como objeto de la clase PubSubClient.


void setup() {
  Serial.begin(115200);         // Inicialización de la conexión en serie para la depuración
  pinMode(IN6, OUTPUT);  
  pinMode(IN5, OUTPUT);  
  pinMode(IN4, OUTPUT);  
  pinMode(IN3, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(led_ESP, OUTPUT);
  pinMode(PIN_CNY1, INPUT);
  pinMode(PIN_CNY2, INPUT);
  pinMode(PIN_CNY3, INPUT);
  pinMode(PIN_CNY4, INPUT);
  pinMode(PIN_CNY5, INPUT);
  pinMode(PIN_CNY6, INPUT);
  pinMode(PIN_CNY7, INPUT); 
  pinMode(FC1, INPUT); 
  pinMode(FC2, INPUT);
  pinMode(FC3, INPUT);

  //PWM
  ledcSetup(CHA1, FRQ, RES);
  ledcSetup(CHA2, FRQ, RES);
  ledcSetup(CHB1, FRQ, RES);
  ledcSetup(CHB2, FRQ, RES);
  ledcSetup(CHC1, FRQ, RES);
  ledcSetup(CHC2, FRQ, RES);

  ledcAttachPin(IN1, CHA1);
  ledcAttachPin(IN2, CHA2);
  ledcAttachPin(IN3, CHB1);
  ledcAttachPin(IN4, CHB2);
  ledcAttachPin(IN5, CHC1);
  ledcAttachPin(IN6, CHC2);
  
  //Conexion WIFI

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to WiFi..");

  //Inicialización broker
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);
  while (!client.connected()) {
    String client_id = "esp32-client-";
    client_id += String(WiFi.macAddress());
    Serial.printf("The client %s connects to the public MQTT broker\n", client_id.c_str());
    if (client.connect(client_id.c_str(), mqtt_username, mqtt_password)) {
        Serial.println("Public EMQX MQTT broker connected");
        client.publish("Altura", "Hi EMQX I'm ESP32 ^^"); // Publish message upon successful connection
        digitalWrite (led_ESP, HIGH); 
    } else {
        Serial.print("failed with state ");
        Serial.print(client.state());
        delay(2000);
    }
    client.subscribe("Altura");
    client.subscribe("Direccion");
    client.subscribe("Iniciacion");
    client.subscribe("Estado");
  }

  //PARA FUTBOLISTA
  //BT.begin("ESP32_Kosmos");  // Nombre de su dispositivo Bluetooth y en modo esclavo
 /* ledcAttachPin(ENA, canalPWM0);  // hasta aca decia el video
  ledcAttachPin(ENB, canalPWM1);
  ledcSetup(canalPWM0, frecuencia, resolucion);
  ledcSetup(canalPWM1, frecuencia, resolucion);
 */
 //Charla esp
  client.publish(topic, "Hi, I'm ESP32 ^^");
  client.subscribe(topic);
}
void adelante() {
  ledcWrite(CHA1, VEL);
  ledcWrite(CHA2, 0);
  ledcWrite(CHB1, VEL);
  ledcWrite(CHB2, 0);
}
void atras() {
  ledcWrite(CHA1, 0);
  ledcWrite(CHA2, VEL);
  ledcWrite(CHB1, 0);
  ledcWrite(CHB2, VEL);
}
void doblarIzquierda() {
  ledcWrite(CHA1, VEL);
  ledcWrite(CHA2, 0);
  ledcWrite(CHB1, 0);
  ledcWrite(CHB2, 0);
}
void doblarDerecha() {
  ledcWrite(CHA1, 0);
  ledcWrite(CHA2, 0);
  ledcWrite(CHB1, VEL);
  ledcWrite(CHB2, 0);
}
void quieto(){
  ledcWrite(CHA1, 0);
  ledcWrite(CHA2, 0);
  ledcWrite(CHB1, 0);
  ledcWrite(CHB2, 0);
  ledcWrite(CHC1, 0);
  ledcWrite(CHC2, 0);
}
void subir(){
  ledcWrite(CHC1, VEL);
  ledcWrite(CHC2, 0);
}
void bajar(){
  ledcWrite(CHC1, 0);
  ledcWrite(CHC2, VEL);
}
bool tomar_objeto(int fc1){
  while (!fc1) subir(); 
  quieto(); 
  if (fc1) var = 1; 
  return var; 
}
int dejar_objeto(int fc1){
  while (fc1) bajar(); 
  quieto(); 
  if (!fc1) var = 1; 
  return var; 
} 
void giro180(int direccion){
  //arranca a girar, cuando volviste a leer blanco para tanto tiempo.
  TIME = millis();
  if (direccion == derecha) doblarDerecha(); 
  else doblarIzquierda();
  if(TIME - anterior > espera){
      anterior = TIME;

  while (!centro_negro()){
    if(direccion == derecha) doblarDerecha();
    else doblarIzquierda();
    }
    quieto();
  }
  if(TIME - anterior > espera){
    anterior = TIME;
    quieto(); 
  }
}
/*
void pruebaMotores(){
      digitalWrite(IN6, LOW );
        digitalWrite(IN5, HIGH);
        digitalWrite(IN4, LOW);
        digitalWrite(IN3, HIGH);
        digitalWrite(IN2, LOW);
        digitalWrite(IN1, HIGH);
        digitalWrite(ENA, HIGH);
        digitalWrite(ENB, HIGH);
        digitalWrite(ENC, HIGH);
}

void futbolista(){
  if (BT.available()) {
    incoming = BT.readStringUntil('#');
    angulo = incoming.substring(0, 1);
    angulo1 = angulo[0];
    boton = incoming.substring(1, 2).toInt();
  }
  Serial.println(incoming);
  //Serial.print("Recibido: ");
  if (DEBUG) BT.println(incoming);
  switch (angulo1) {
    case 'N':
      {
        digitalWrite(IN4, LOW);
        digitalWrite(IN3, HIGH);
        digitalWrite(IN2, LOW);
        digitalWrite(IN1, HIGH);
        if (DEBUG) BT.println("Adelante");
      }
      break;
    case 'S':
      {
        digitalWrite(IN4, HIGH);
        digitalWrite(IN3, LOW);
        digitalWrite(IN2, HIGH);
        digitalWrite(IN1, LOW);
        if (DEBUG) BT.println("Atras");
      }
      break;
    case 'E':
      {
        digitalWrite(IN4, LOW);

        digitalWrite(IN3, HIGH);
        digitalWrite(IN2, HIGH);
        digitalWrite(IN1, LOW);
        if (DEBUG) BT.println("Giro Derecha");
      }
      break;
    case 'W':
      {
        digitalWrite(IN4, HIGH);
        digitalWrite(IN3, LOW);
        digitalWrite(IN2, LOW);
        digitalWrite(IN1, HIGH);
        if (DEBUG) BT.println("Giro Izquierda");
      }
      break;
    case 'B':
      {
        digitalWrite(IN4, HIGH);
        digitalWrite(IN3, LOW);
        digitalWrite(IN2, LOW);
        digitalWrite(IN1, LOW);
        if (DEBUG) BT.println("PARA ATRAS A LA DERECHA");
      }
      break;
    case 'C':
      {
        digitalWrite(IN4, HIGH);
        digitalWrite(IN3, HIGH);
        digitalWrite(IN2, HIGH);
        digitalWrite(IN1, LOW);
        if (DEBUG) BT.println("PARA ATRAS A LA IZQUIERDA");
      }
      break;
    case 'A':
      {
        digitalWrite(IN4, LOW);
        digitalWrite(IN3, HIGH);
        digitalWrite(IN2, HIGH);
        digitalWrite(IN1, HIGH);
        if (DEBUG) BT.println("PARA ADELANTE A LA DERECHA");
      }
      break;
    case 'D':
      {
        digitalWrite(IN4, HIGH);
        digitalWrite(IN3, HIGH);
        digitalWrite(IN2, LOW);
        digitalWrite(IN1, HIGH);
        if (DEBUG) BT.println("PARA ADELANTE A LA IZQUIERDA");
      }
      break;
    case '0':
      {
        digitalWrite(IN4, LOW);
        digitalWrite(IN3, LOW);
        digitalWrite(IN2, LOW);
        digitalWrite(IN1, LOW);
        if (DEBUG) BT.println("FRENA");
      }
      break;
  }
  switch (boton)  // vamos a darle velocidad con esto.
  {
    case 4:
      {
        CT = 255;
        ledcWrite(canalPWM0, CT);
        ledcWrite(canalPWM1, CT);
      }
      break;
    case 3:
      {
        CT = 216;
        ledcWrite(canalPWM0, CT);
        ledcWrite(canalPWM1, CT);
      }
      break;
    case 2:
      {
        CT = 192;
        ledcWrite(canalPWM0, CT);
        ledcWrite(canalPWM1, CT);
      }
      break;
    case 1:
      {
        CT = 127;
        ledcWrite(canalPWM0, CT);
        ledcWrite(canalPWM1, CT);
      }
      break;
    case 0:
      {
        CT = 0;
        ledcWrite(canalPWM0, CT);
        ledcWrite(canalPWM1, CT);
      }
  }
}*/
void lecturaCNY_prueba() {
  Serial.println(analogRead(PIN_CNY1));
  Serial.println(analogRead(PIN_CNY2));
  Serial.println(analogRead(PIN_CNY3));
  Serial.println(analogRead(PIN_CNY4));
  Serial.println(analogRead(PIN_CNY5));
  Serial.println(analogRead(PIN_CNY6));
  Serial.println(analogRead(PIN_CNY7));
  delay(200);
}
bool es_negro(int pin){
  int sumatoria = 0; 
  for (int i=0; i<5; i++){
    sumatoria += analogRead(pin);  
  }
  int promedio = sumatoria / 5;
  return promedio > umbral;
}

bool centro_negro(){
  var = es_negro(PIN_CNY3) && es_negro(PIN_CNY4) && es_negro(PIN_CNY5); 
  return var;
}

bool bifurcacion(){
  var = es_negro(PIN_CNY6) && es_negro(PIN_CNY7); 
  return var;
}

bool cod_llegue(){
  var = es_negro(PIN_CNY1) && es_negro(PIN_CNY2) && es_negro(PIN_CNY3) && es_negro(PIN_CNY4) && es_negro(PIN_CNY5) && es_negro(PIN_CNY6) && es_negro(PIN_CNY7); 
  return var;
}

bool cod_volver(){
  var =es_negro(PIN_CNY1) && es_negro(PIN_CNY3) && es_negro(PIN_CNY4) && es_negro(PIN_CNY5) && es_negro(PIN_CNY6);  
  return var;
}

bool cod_izq(){
  var =es_negro(PIN_CNY1) && es_negro(PIN_CNY2) && es_negro(PIN_CNY3) && es_negro(PIN_CNY4) && es_negro(PIN_CNY5);  
  return var;
}

bool cod_salir(){
  var =es_negro(PIN_CNY2) && es_negro(PIN_CNY3) && es_negro(PIN_CNY4) && es_negro(PIN_CNY5) && es_negro(PIN_CNY7); 
  return var;
}

int contador(){
  //contador, devuelve derecha o izquierda y lee sensores para ver que llego
  //tomar dato de la base de datos (¿Cuando doblo, en que bifurcación?)
  //esto es para IR al destino

  //destino = dato_base;   
  if (bifurcacion()){
    int x = x+1; 
  }
  if (x == destino){
    doblar(derecha); 
    return 1; 
  } 
}

void doblar(int direccion) {
TIME = millis();
  if (direccion == derecha) doblarDerecha(); 
  else doblarIzquierda();
  if(TIME - anterior > espera){
      anterior = TIME;

  while (!centro_negro()){
    if(direccion == derecha) doblarDerecha();
    else doblarIzquierda();
    }
  }
  quieto();
  if(TIME - anterior > espera){
    anterior = TIME; 
    quieto();
  }
}

void salir (int ARRANCA){
  TIME = millis();
  if (ARRANCA){
  while (!cod_salir()){
  atras(); 
  }  
  quieto();   
  if(TIME - anterior > espera)
    {
      anterior = TIME; 
      giro180(derecha);  
    }
  }
}

void volver (){
  TIME = millis();
  while (!cod_volver()) atras();   
  quieto();   
  if(TIME - anterior > espera)
    {
      anterior = TIME; 
      giro180(izquierda);  
    }
  }


void giro_vuelta(){
  TIME = millis();
  while (!cod_izq) doblarIzquierda();
  quieto(); 
  if(TIME - anterior > espera){
    anterior = TIME; 
    quieto();
  }
} 

int nivelar_pala (int nivel, int fc2){
  //Corregir
  // Me va a entrar por base de datos en q gondola (arriba o abajo) va el objeto. Para subir y bajar vamos a usar tiempo y alguna barrera fisica
  TIME = millis();
  int espera1 = 500; //a definir cuando sepamos cuanto es necesario para poner bien la pala
  if(TIME - anterior > espera1){
  anterior = TIME;
  if (nivel==1){
    while (!fc2){
    subir();
    var = 1;  
    }
  }  
  else{ 
    var = 0; 
    } 
  }
  quieto(); 
  if(TIME - anterior > espera){
    anterior = TIME; 
    quieto();
  }
  return var; 
}
void devolver_pala(int fc3){
  TIME = millis();
  while (!fc3){
  bajar(); 
  }
  quieto();
  if(TIME - anterior > espera){
    anterior = TIME; 
    quieto();
  }
}
void depositar_objeto(){  

  //pruebaMotores();  
  //FC da 1 cuando detecta algo
  //Salir de la estacion y nivelar pala
  //Salir de la estacion: poner marca para hacer giro 180°, establecer si estoy yendo o volviendo 
  //Por ahora estoy programando para ir a buscar algo, no traerlo
  //La base de datos me va a decir: gondola a la que ir, altura, yendo a bucar o trayendo, me dice ARRANCA

  //TODOOO ESTO ES PARA IR
  //int ARRANCA = 1;
  //int nivel = 1;  
  //ARRANCA, nivel me lo va a dar la base de datos
  int estado_objeto = 0; 
  int estado_pala = 0; 
  int fc1 = 0;
  int fc2 = 0;
  int fc3 = 0;
   
  fc1 = digitalRead(FC1);
  fc2 = digitalRead(FC2);
  fc3 = digitalRead(FC3);  
  if (ARRANCA == 1){
  if (tomar_objeto(fc1)){
  salir (ARRANCA);
  estado_pala = nivelar_pala(nivel, fc2); 
    } 
  while (centro_negro()){
  if (contador()){
    while (!cod_llegue()){
    adelante();
    }
    quieto(); 
   estado_objeto = dejar_objeto(fc1); 
  }
  else {adelante();}
  }

  //VOLVEEER
  if (estado_objeto){
 volver();  
  }
  while (!cod_llegue()) adelante(); 
  quieto(); 
  giro_vuelta(); 
  while (!cod_llegue()) adelante();
  quieto(); 
  if (estado_pala) devolver_pala(fc3);
  quieto();  
  }
}

void extraer_objeto(){

  //int ARRANCA = 1;
  int nivel = 0;
  int destino = 2;   
  //ARRANCA, nivel me lo va a dar la base de datos
  //IR
  int estado_objeto = 0; 
  int fc1 = 0;
  int fc2 = 0;
  int fc3 = 0;
   
  fc1 = digitalRead(FC1);
  fc2 = digitalRead(FC2);
  fc3 = digitalRead(FC3);  

  if (ARRANCA){
  salir (ARRANCA);
  int estado_pala = nivelar_pala(nivel, fc2); 
  while (centro_negro()){
  if (contador()){
    while (!cod_llegue()){
    adelante();
    }
    quieto(); 
    estado_objeto = tomar_objeto(fc1); 
  }
  else adelante();
  }

  //VOLVER
  if (estado_objeto){
 volver();  
  }
  while (!cod_llegue()) adelante(); 
  quieto(); 
  giro_vuelta(); 
  while (!cod_llegue()) adelante();
  quieto();
  dejar_objeto(fc1); 
  quieto(); 
  }
}
void callback(char *topic, byte *payload, unsigned int length) {
  //La base de datos me va a decir: gondola a la que ir, altura, yendo a bucar o trayendo, me dice ARRANCA
  //Hacer otros if con otros topicos para las otras cosas a guardar. Hace un topico, confirma y va a otro topico.
  if (strcmp (topic, "Altura")==0){
    char payload_string[ length + 1]; 
    memcpy (payload_string, payload, length);  
    payload_string[length] = '\0'; 
    PAYLOADINT = atoi(payload_string);
    Serial.println(PAYLOADINT); 
    nivel = PAYLOADINT; 
  }
  else if (strcmp (topic, "Direccion")==0){
    char payload_string[ length + 1]; 
    memcpy (payload_string, payload, length); 
    payload_string[length] = '\0'; 
    PAYLOADINT = atoi(payload_string); 
    Serial.println(PAYLOADINT);
    destino = PAYLOADINT; 
  }
  else if (strcmp (topic, "Estado")==0){
    char payload_string[ length + 1]; 
    memcpy (payload_string, payload, length); 
    payload_string[length] = '\0'; 
    PAYLOADINT = atoi(payload_string); 
    Serial.println(PAYLOADINT);
    estado = PAYLOADINT; 
  }
    else if (strcmp (topic, "Iniciacion")==0){
    char payload_string[ length + 1]; 
    memcpy (payload_string, payload, length); 
    payload_string[length] = '\0'; 
    PAYLOADINT = atoi(payload_string); 
    Serial.println(PAYLOADINT);
    ARRANCA = PAYLOADINT; 
  }
}

void loop() {
  //int deposito = 1; 
  //Pedirle a base de datos si deposito o extraigo
  client.loop();
  estado = 0; 
  if (estado) depositar_objeto(); 
  else extraer_objeto();
  //Serial.println ("Hola");  
  //pruebaMotores(); 

}