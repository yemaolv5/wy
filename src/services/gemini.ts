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

export async function generateDailyContent(dateStr: string, weatherInfo: string, sections: string[]) {
  const ai = getAI();
  const sectionPrompts = {
    wisdom: "wisdom: 一句励志、处世或邻里和谐的金句。",
    joke: "joke: 一个简短健康的幽默段子或生活小笑话。",
    health: "healthTip: 针对当前节气或天气的养生小贴士；foodAdvice: 对应的传统食补或健康饮食建议。"
  };

  const requestedPrompts = sections
    .map(s => sectionPrompts[s as keyof typeof sectionPrompts])
    .filter(Boolean)
    .join("\n    ");

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `请为物业客服生成一份今日早报内容。
    日期信息：${dateStr}
    天气信息：${weatherInfo}
    
    请根据要求包含以下部分，并以JSON格式返回：
    ${requestedPrompts}
    
    注意：即使某些部分未请求，也请返回一个完整的JSON对象，未请求的字段可以为空字符串。`,
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
