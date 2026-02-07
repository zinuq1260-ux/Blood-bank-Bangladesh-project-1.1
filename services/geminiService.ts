
import { GoogleGenAI, Type } from "@google/genai";

export const getSmartDonorMatch = async (bloodRequest: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analyze this blood request and suggest a matching strategy: 
  Patient: ${bloodRequest.patientName}, 
  Blood Group Needed: ${bloodRequest.bloodGroup}, 
  Urgency: ${bloodRequest.urgency},
  Hospital: ${bloodRequest.hospital}.
  Provide 3 specific tips for the family to secure this donor quickly in Bangladesh context.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI matching engine currently unavailable. Please proceed with standard protocols.";
  }
};

export const getHealthTipsForDonors = async () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Provide 5 concise health tips for a first-time blood donor in Bangladesh, focusing on local nutrition and weather conditions.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              tip: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["tip", "description"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    return [];
  }
};
