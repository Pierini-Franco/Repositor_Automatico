#include "BluetoothSerial.h"
// configuramos el Serial Bluetooth
#if !defined(CONFIG_BT_ENABLED) || !defined(CONFIG_BLUEDROID_ENABLED)
#error Bluetooth is not enabled! Please run `make menuconfig` to and enable it
#endif

#define TICK_CNY70 150
int currentTimeCNY70 = 0;

BluetoothSerial SerialBT;

void setup() {
  SerialBT.begin("Kosmos");
}

void loop() {
  if(millis() > currentTimeCNY70 + TICK_CNY70){
    currentTimeCNY70 = millis();
    SerialBT.println("Hola");
  }
}
