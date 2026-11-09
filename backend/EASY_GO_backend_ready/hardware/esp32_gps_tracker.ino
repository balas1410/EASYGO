/* EASY GO ESP32 GPS tracker reference firmware
   Hardware: ESP32 + u-blox NEO-6M/NEO-M8N GPS (UART2).
   GPS TX -> ESP32 GPIO16 (RX2); GPS RX -> GPIO17 (TX2) optional.
   Install TinyGPSPlus library. Configure Wi-Fi, API URL and device token.
   Use HTTPS in production. This example uses WiFiClientSecure with certificate
   validation disabled ONLY as a bring-up placeholder; install the host CA cert
   before real deployment and remove setInsecure(). */
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <TinyGPSPlus.h>
const char* WIFI_SSID = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
const char* API_URL = "https://YOUR-API.onrender.com/api/tracking/position";
const char* DEVICE_TOKEN = "YOUR_ESP32_DEVICE_TOKEN";
const char* DEVICE_ID = "easygo-chair-01";
HardwareSerial GPSSerial(2); TinyGPSPlus gps; unsigned long lastSend=0;
void setup(){ Serial.begin(115200); GPSSerial.begin(9600,SERIAL_8N1,16,17); WiFi.begin(WIFI_SSID,WIFI_PASSWORD); while(WiFi.status()!=WL_CONNECTED){delay(500);Serial.print('.');} Serial.println("WiFi connected"); }
void loop(){ while(GPSSerial.available()) gps.encode(GPSSerial.read()); if(millis()-lastSend<3000) return; lastSend=millis(); if(!gps.location.isValid() || gps.location.age()>10000){Serial.println("Waiting for fresh GPS fix");return;} if(WiFi.status()!=WL_CONNECTED) return;
  WiFiClientSecure client; client.setInsecure(); // Replace with CA certificate validation for production.
  HTTPClient http; if(!http.begin(client,API_URL)) return; http.addHeader("Content-Type","application/json"); http.addHeader("x-device-token",DEVICE_TOKEN);
  String body="{\"deviceId\":\""+String(DEVICE_ID)+"\",\"latitude\":"+String(gps.location.lat(),7)+",\"longitude\":"+String(gps.location.lng(),7)+",\"altitude\":"+String(gps.altitude.meters(),1)+",\"speedKph\":"+String(gps.speed.kmph(),2)+",\"heading\":"+String(gps.course.deg(),1)+",\"accuracyM\":"+String(gps.hdop.hdop(),1)+",\"satellites\":"+String(gps.satellites.value())+"}"; int code=http.POST(body); Serial.printf("GPS upload HTTP %d\n",code); http.end();
}
