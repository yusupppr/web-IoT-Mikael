import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SensorCard } from './components/SensorCard';
import { useMqtt } from './hooks/useMqtt';
import { TOPICS, TOPIC_LIST } from './utils/mqttTopics';
import { formatTemperature, formatHumidity } from './utils/formatters';
import { Thermometer, Droplets, Lightbulb, Activity } from 'lucide-react';

const STALE_THRESHOLD_MS = 60000;

function App() {
  const { status, data } = useMqtt(TOPIC_LIST);
  const [now, setNow] = useState(Date.now());

  // Tick every second to evaluate stale status
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getSensorStatus = (topicData) => {
    if (!topicData || topicData.value === undefined) return 'no-data';
    if (now - topicData.lastUpdated.getTime() > STALE_THRESHOLD_MS) return 'stale';
    return 'ok';
  };

  const suhuData = data[TOPICS.SUHU];
  const kelembabanData = data[TOPICS.KELEMBABAN];
  const cahayaData = data[TOPICS.CAHAYA];

  const suhuData2 = data[TOPICS.SUHU2];
  const kelembabanData2 = data[TOPICS.KELEMBABAN2];
  const cahayaData2 = data[TOPICS.CAHAYA2];

  // Helper for light sensor parsing (handles 'terang'/'gelap' or 1/0)
  const getCahayaDisplay = (val) => {
    if (val === undefined || val === null) return undefined;
    if (val === 1 || (typeof val === 'string' && val.toLowerCase() === 'terang')) return 'Terang';
    if (val === 0 || (typeof val === 'string' && val.toLowerCase() === 'gelap')) return 'Gelap';
    return val; // Fallback
  };

  return (
    <div className="min-h-screen flex flex-col pt-6">
      <Header status={status} />
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 z-10 flex flex-col gap-10">
        
        {/* IoT 1 Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)] text-blue-400">
              <Activity size={18} />
            </div>
            <h2 className="text-xl font-semibold text-slate-100 tracking-wide">Pengecek Ruangan</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SensorCard
              label="Temperature"
              value={suhuData ? formatTemperature(suhuData.value) : undefined}
              unit="°C"
              icon={Thermometer}
              status={getSensorStatus(suhuData)}
              lastUpdated={suhuData?.lastUpdated}
            />
            <SensorCard
              label="Humidity"
              value={kelembabanData ? formatHumidity(kelembabanData.value) : undefined}
              unit="%"
              icon={Droplets}
              status={getSensorStatus(kelembabanData)}
              lastUpdated={kelembabanData?.lastUpdated}
            />
            <SensorCard
              label="Light"
              value={cahayaData ? getCahayaDisplay(cahayaData.value) : undefined}
              unit=""
              icon={Lightbulb}
              status={getSensorStatus(cahayaData)}
              lastUpdated={cahayaData?.lastUpdated}
            />
          </div>
        </section>

        {/* Divider */}
        <div className="w-full h-px bg-slate-800/50 rounded-full" />

        {/* IoT 2 Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] text-purple-400">
              <Activity size={18} />
            </div>
            <h2 className="text-xl font-semibold text-slate-100 tracking-wide">Pengecek Ruangan</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SensorCard
              label="Temperature"
              value={suhuData2 ? formatTemperature(suhuData2.value) : undefined}
              unit="°C"
              icon={Thermometer}
              status={getSensorStatus(suhuData2)}
              lastUpdated={suhuData2?.lastUpdated}
            />
            <SensorCard
              label="Humidity"
              value={kelembabanData2 ? formatHumidity(kelembabanData2.value) : undefined}
              unit="%"
              icon={Droplets}
              status={getSensorStatus(kelembabanData2)}
              lastUpdated={kelembabanData2?.lastUpdated}
            />
            <SensorCard
              label="Light"
              value={cahayaData2 ? getCahayaDisplay(cahayaData2.value) : undefined}
              unit=""
              icon={Lightbulb}
              status={getSensorStatus(cahayaData2)}
              lastUpdated={cahayaData2?.lastUpdated}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
