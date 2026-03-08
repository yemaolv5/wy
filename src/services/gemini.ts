import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please check your environment variables.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function getWeatherByCity(city: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `请查询并返回${city}当前的实时天气信息。
    请包含：
    1. temp: 当前气温范围（例如：12°C ~ 22°C）
    2. condition: 天气状况（例如：晴、多云、小雨）
    3. aqi: 空气质量指数及等级（例如：45 优）
    4. advice: 针对当前天气的穿衣或出行建议。
    
    请以JSON格式返回：
    {
      "temp": "...",
      "condition": "...",
      "aqi": "...",
      "advice": "..."
    }`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function generateDailyContent(dateStr: string, weatherInfo: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `请为物业客服生成一份今日早报内容。
    日期信息：${dateStr}
    天气信息：${weatherInfo}
    
    请包含以下四个部分，并以JSON格式返回：
    1. wisdom: 一句励志、处世或邻里和谐的金句。
    2. joke: 一个简短健康的幽默段子或生活小笑话。
    3. healthTip: 针对当前节气或天气的养生小贴士。
    4. foodAdvice: 对应的传统食补或健康饮食建议。
    
    返回格式示例：
    {
      "wisdom": "...",
      "joke": "...",
      "healthTip": "...",
      "foodAdvice": "..."
    }`,
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function generateNotice(type: string, details: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `你是一个专业的物业客服，请根据以下信息生成一份正式的物业通知：
    通知类型：${type}
    具体细节：${details}
    
    要求：语气礼貌、专业，包含标题、正文、温馨提示、落款（XX物业服务中心）和日期占位符。`,
  });

  return response.text;
}
