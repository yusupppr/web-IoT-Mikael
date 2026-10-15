# 🌡️ IoT Room Monitor Dashboard

Dashboard web real-time untuk memantau kondisi ruangan menggunakan ESP32 + sensor DHT11 & LDR, yang terhubung melalui protokol **MQTT**.

Data dari perangkat IoT dikirim ke broker MQTT publik dan langsung ditampilkan di dashboard web tanpa perlu refresh halaman.

---

## 📌 Fitur

- 🌡️ **Monitoring Suhu** — Data suhu ruangan dari sensor DHT11
- 💧 **Monitoring Kelembaban** — Data kelembaban dari sensor DHT11
- 💡 **Monitoring Cahaya** — Status gelap/terang dari sensor LDR
- 📡 **Real-time via MQTT** — Data diperbarui otomatis setiap 2 detik
- 🔌 **Multi-Perangkat** — Mendukung 2 perangkat IoT sekaligus (Pengecek Ruangan 1 & 2)
- 🟢 **Status Koneksi** — Indikator status MQTT (connected / reconnecting / offline)
- ⚠️ **Data Stale Detection** — Notifikasi jika data sudah lebih dari 60 detik tidak diperbarui

---

## 🛠️ Tech Stack

| Bagian | Teknologi |
|--------|-----------|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| MQTT Client | [MQTT.js](https://github.com/mqttjs/MQTT.js) |
| Broker | [EMQX Public Broker](https://www.emqx.com/en/mqtt/public-mqtt5-broker) |
| Hardware | ESP32 + DHT11 + LDR |
| Firmware | Arduino (C++) |

---

## 📁 Struktur Proyek

```
web-IoT-Mikael/
├── arduino/
│   └── ruang/
│       └── ruang.ino         # Kode firmware ESP32
├── src/
│   ├── components/
│   │   ├── Header.jsx        # Header + status koneksi MQTT
│   │   ├── SensorCard.jsx    # Kartu tampilan data sensor
│   │   └── ConnectionStatus.jsx
│   ├── hooks/
│   │   └── useMqtt.js        # Hook untuk koneksi MQTT
│   ├── utils/
│   │   ├── mqttTopics.js     # Definisi topic MQTT
│   │   └── formatters.js     # Helper format angka
│   ├── config/
│   │   └── mqttConfig.js     # Konfigurasi broker MQTT
│   └── App.jsx
├── .env.example              # Contoh file environment
├── index.html
└── package.json
```

---

## ⚡ Cara Instalasi & Menjalankan

### Prasyarat

- [Node.js](https://nodejs.org/) versi 18 atau lebih baru
- npm (sudah termasuk bersama Node.js)

### Langkah-langkah

**1. Clone repo ini**

```bash
git clone https://github.com/yusupppr/web-IoT-Mikael.git
cd web-IoT-Mikael
```

**2. Install dependencies**

```bash
npm install
```

**3. Buat file konfigurasi environment**

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Lalu sesuaikan isi `.env` jika diperlukan (misalnya jika ingin menggunakan broker MQTT sendiri).

**4. Jalankan development server**

```bash
npm run dev
```

Buka browser dan akses: **http://localhost:5173**

### Build untuk Production

```bash
npm run build
```

File hasil build akan ada di folder `dist/`.

---

## 📡 Konfigurasi MQTT

Secara default, aplikasi menggunakan broker publik **EMQX** dengan topik berikut:

| Topik | Isi Data |
|-------|----------|
| `ruangan/suhu` | Suhu dalam °C (IoT 1) |
| `ruangan/kelembaban` | Kelembaban dalam % (IoT 1) |
| `ruangan/cahaya` | `Terang` atau `Gelap` (IoT 1) |
| `ruangan2/suhu` | Suhu dalam °C (IoT 2) |
| `ruangan2/kelembaban` | Kelembaban dalam % (IoT 2) |
| `ruangan2/cahaya` | `Terang` atau `Gelap` (IoT 2) |

Jika ingin menggunakan topik atau broker yang berbeda, edit file:
- `src/config/mqttConfig.js` — untuk URL broker
- `src/utils/mqttTopics.js` — untuk nama topik

---

## 🔧 Firmware Arduino (ESP32)

Kode firmware untuk ESP32 tersedia di folder `arduino/ruang/ruang.ino`.

### Hardware yang Dibutuhkan

| Komponen | Keterangan |
|----------|------------|
| ESP32 | Mikrokontroler utama dengan Wi-Fi |
| DHT11 | Sensor suhu & kelembaban |
| LDR | Sensor cahaya |
| LCD I2C 16x2 | Tampilan lokal (opsional) |
| Relay x2 | Kontrol lampu (Merah & Biru) |

### Wiring Pin

| Pin ESP32 | Komponen |
|-----------|----------|
| GPIO 4 | DHT11 Data |
| GPIO 34 | LDR (Analog) |
| GPIO 18 | Relay 1 (Lampu Merah/Panas) |
| GPIO 19 | Relay 2 (Lampu Biru/Normal) |
| SDA/SCL | LCD I2C |

### Library Arduino yang Dibutuhkan

Install melalui **Arduino IDE Library Manager**:

- `LiquidCrystal_I2C` by Frank de Brabander
- `DHT sensor library` by Adafruit
- `PubSubClient` by Nick O'Leary
- `WiFi` (sudah bawaan ESP32 board)

### Cara Upload Firmware

1. Buka `arduino/ruang/ruang.ino` di Arduino IDE
2. Sesuaikan konfigurasi Wi-Fi di file:
   ```cpp
   const char* ssid     = "NAMA_WIFI_KAMU";
   const char* password = "PASSWORD_WIFI_KAMU";
   ```
3. Pilih board: **ESP32 Dev Module**
4. Upload ke ESP32

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan belajar dan bebas digunakan.
