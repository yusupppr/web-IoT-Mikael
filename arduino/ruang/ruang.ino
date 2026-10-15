#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>
#include <WiFi.h>
#include <PubSubClient.h>

// ================= PENGATURAN PIN =================
#define DHTPIN 4          
#define DHTTYPE DHT11     
#define LDR_PIN 34        
#define RELAY1_PIN 18     // Mengontrol Lampu Merah (Panas)
#define RELAY2_PIN 19     // Mengontrol Lampu Biru (Dingin/Normal)

LiquidCrystal_I2C lcd(0x27, 16, 2); 
DHT dht(DHTPIN, DHTTYPE);

// ================= PENGATURAN WIFI & MQTT =================
const char* ssid = "RPL 1";        
const char* password =""; 
const char* mqtt_server = "broker.emqx.io";
const int mqtt_port = 1883; 

WiFiClient espClient;
PubSubClient client(espClient);

// ================= VARIABEL SISTEM =================
float batasSuhuPanas = 30.0; 
int batasCahayaGelap = 2000;
unsigned long waktuTerakhir = 0; 
const long intervalKirim = 2000; // Kirim data setiap 2 detik

// Fungsi Koneksi Wi-Fi
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Menghubungkan ke ");
  Serial.println(ssid);
  
  WiFi.mode(WIFI_STA); // Tambahkan ini agar lebih stabil di ESP32
  WiFi.begin(ssid, password);
  
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("WiFi: ");
  lcd.print(ssid);
  lcd.setCursor(0, 1);

  int dotCount = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    lcd.print(".");
    dotCount++;
    if(dotCount > 16) { // cegah titik memenuhi baris LCD
      lcd.setCursor(0, 1);
      lcd.print("                ");
      lcd.setCursor(0, 1);
      dotCount = 0;
    }
  }
  Serial.println("\nWiFi terhubung!");
}

// Fungsi Koneksi Ulang MQTT
void reconnect() {
  while (!client.connected()) {
    Serial.print("Mencoba koneksi MQTT...");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Mencari MQTT...");

    String clientId = "ESP32Client-SmartRoom-";
    clientId += String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str())) {
      Serial.println("Terhubung ke Broker!");
      lcd.setCursor(0, 1);
      lcd.print("MQTT OK!      ");
      delay(1000);
      lcd.clear();
    } else {
      Serial.print("Gagal, rc=");
      Serial.print(client.state());
      Serial.println(" Coba lagi dalam 5 detik");
      
      lcd.setCursor(0, 1);
      lcd.print("Gagal rc=");
      lcd.print(client.state());
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  
  // Inisialisasi Perangkat Keras
  dht.begin();
  lcd.init();
  lcd.backlight();
  pinMode(RELAY1_PIN, OUTPUT);
  pinMode(RELAY2_PIN, OUTPUT);
  pinMode(LDR_PIN, INPUT);

  digitalWrite(RELAY1_PIN, HIGH);
  digitalWrite(RELAY2_PIN, HIGH);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Mulai Jaringan..");
  
  // Inisialisasi Jaringan
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  
  lcd.clear();
  lcd.print("WiFi & MQTT OK!");
  delay(2000);
  lcd.clear();
}

void loop() {
  // Jaga koneksi MQTT tetap hidup
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long waktuSekarang = millis();

  // Gunakan millis() alih-alih delay() agar koneksi MQTT tidak terputus
  if (waktuSekarang - waktuTerakhir >= intervalKirim) {
    waktuTerakhir = waktuSekarang;

    // 1. Membaca Data
    float t = dht.readTemperature();
    float h = dht.readHumidity();
    int ldrValue = analogRead(LDR_PIN);
    String statusCahaya = (ldrValue > batasCahayaGelap) ? "Gelap" : "Terang";

    if (isnan(t) || isnan(h)) {
      Serial.println("Gagal membaca DHT!");
      return; 
    }

    // 2. Menampilkan ke LCD
    lcd.setCursor(0, 0);
    lcd.print("S:"); lcd.print(t, 1); 
    lcd.print("C H:"); lcd.print(h, 0); lcd.print("%  "); 
    lcd.setCursor(0, 1);
    lcd.print("Cahaya: ");
    lcd.print(statusCahaya);
    lcd.print("     "); 

    // 3. Logika Relay Lokal (Suhu Merah vs Biru)
    if (t > batasSuhuPanas) {
      digitalWrite(RELAY1_PIN, LOW);  // Merah Nyala
      digitalWrite(RELAY2_PIN, HIGH); // Biru Mati
    } else {
      digitalWrite(RELAY1_PIN, HIGH); // Merah Mati
      digitalWrite(RELAY2_PIN, LOW);  // Biru Nyala
    }

    // 4. Publikasi Data ke MQTT
    // Konversi angka ke String sebelum dikirim
    client.publish("ruangan/suhu", String(t).c_str());
    client.publish("ruangan/kelembaban", String(h).c_str());
    client.publish("ruangan/cahaya", statusCahaya.c_str());
    
    Serial.println("Data berhasil dikirim ke MQTT");
  }
}