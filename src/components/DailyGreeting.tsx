import React, { useState, useEffect } from 'react';
import { Sun, Cloud, Wind, Thermometer, Copy, RefreshCw, CheckCircle2, MapPin, Search } from 'lucide-react';
import { generateDailyContent, getWeatherByCity } from '../services/gemini';
import { getWeekday, getLunarDate, cn } from '../utils';
import { DailyContent } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function DailyGreeting() {
  const [loading, setLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [content, setContent] = useState<DailyContent | null>(null);
  const [city, setCity] = useState("北京");
  const [customCity, setCustomCity] = useState("");
  const [weather, setWeather] = useState({
    temp: "12°C ~ 22°C",
    condition: "晴转多云",
    aqi: "45 优",
    advice: "昼夜温差大，建议采用洋葱式穿衣法。"
  });
  const [selections, setSelections] = useState({
    date: true,
    weather: true,
    wisdom: true,
    joke: true,
    health: true,
  });
  const [copied, setCopied] = useState(false);

  const today = new Date();
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
  const weekday = getWeekday(today);
  const lunar = getLunarDate(today);

  const fetchWeather = async (targetCity: string) => {
    setWeatherLoading(true);
    try {
      const data = await getWeatherByCity(targetCity);
      setWeather(data);
    } catch (error) {
      console.error("Fetch weather error:", error);
    } finally {
      setWeatherLoading(false);
    }
  };

  const fetchContent = async () => {
    setLoading(true);
    try {
      const weatherStr = `${weather.condition}, ${weather.temp}, AQI: ${weather.aqi}`;
      const data = await generateDailyContent(`${dateStr} ${weekday} ${lunar}`, weatherStr);
      setContent(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  useEffect(() => {
    if (!weatherLoading) {
      fetchContent();
    }
  }, [weatherLoading]);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val !== "custom") {
      setCity(val);
    }
  };

  const handleCustomCitySearch = () => {
    if (customCity.trim()) {
      setCity(customCity.trim());
    }
  };

  const generateFinalText = () => {
    let text = `【${city}物业温馨早报】\n\n`;
    if (selections.date) {
      text += `📅 日期：${dateStr} ${weekday}\n🏮 农历：${lunar}\n\n`;
    }
    if (selections.weather) {
      text += `🌤 天气：${weather.condition} ${weather.temp}\n🍃 空气：${weather.aqi}\n💡 建议：${weather.advice}\n\n`;
    }
    if (content) {
      if (selections.wisdom) text += `✨ 智慧语录：\n${content.wisdom}\n\n`;
      if (selections.joke) text += `😄 开心一笑：\n${content.joke}\n\n`;
      if (selections.health) text += `🍵 养生贴士：\n${content.healthTip}\n🍲 食补建议：${content.foodAdvice}\n\n`;
    }
    text += `祝您开启美好的一天！🌸`;
    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateFinalText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">每日温情问候</h2>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <select 
              value={city}
              onChange={handleCityChange}
              className="pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 appearance-none w-full"
            >
              <option value="北京">北京</option>
              <option value="上海">上海</option>
              <option value="广州">广州</option>
              <option value="深圳">深圳</option>
              <option value="杭州">杭州</option>
              <option value="成都">成都</option>
              <option value="武汉">武汉</option>
              <option value="custom">其他城市...</option>
            </select>
          </div>
          <div className="flex gap-1 flex-1 md:flex-none">
            <input 
              type="text" 
              placeholder="输入城市名"
              value={customCity}
              onChange={e => setCustomCity(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-32"
            />
            <button 
              onClick={handleCustomCitySearch}
              className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Search className="w-4 h-4 text-slate-600" />
            </button>
          </div>
          <button 
            onClick={fetchContent}
            disabled={loading || weatherLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn("w-4 h-4", (loading || weatherLoading) && "animate-spin")} />
            更新内容
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Configuration */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              内容勾选
            </h3>
            <div className="space-y-3">
              {Object.entries(selections).map(([key, value]) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={value}
                    onChange={() => setSelections(prev => ({ ...prev, [key]: !value }))}
                    className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-slate-600 group-hover:text-slate-900 transition-colors capitalize">
                    {key === 'date' ? '基础日期' : key === 'weather' ? '天气预报' : key === 'wisdom' ? '智慧语录' : key === 'joke' ? '开心一笑' : '节气养生'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 relative overflow-hidden">
            {weatherLoading && (
              <div className="absolute inset-0 bg-emerald-50/80 backdrop-blur-sm flex items-center justify-center z-10">
                <RefreshCw className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}
            <h3 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
              <Sun className="w-5 h-5" />
              {city}天气
            </h3>
            <div className="text-emerald-800 space-y-1 text-sm">
              <p className="font-medium">{weather.condition} {weather.temp}</p>
              <p>空气质量：{weather.aqi}</p>
              <p className="mt-2 italic opacity-80">“{weather.advice}”</p>
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">早报预览</h3>
              <button 
                onClick={handleCopy}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all",
                  copied ? "bg-emerald-500 text-white" : "bg-primary text-white hover:bg-primary-dark"
                )}
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "已复制" : "一键复制"}
              </button>
            </div>
            
            <div className="flex-1 bg-slate-50 rounded-xl p-6 font-mono text-sm whitespace-pre-wrap text-slate-700 border border-slate-200">
              {loading || weatherLoading ? (
                <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                  <p>{weatherLoading ? "正在查询实时天气..." : "正在为您生成今日早报..."}</p>
                </div>
              ) : (
                generateFinalText()
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
