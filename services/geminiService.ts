
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { Tip, Challenge, ApplianceAnalysis } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const chat: Chat = ai.chats.create({
  model: 'gemini-2.5-flash',
  config: {
    systemInstruction: `You are EcoWise, an expert AI assistant specializing in electricity conservation, carbon footprint reduction, and sustainability. Your goal is to provide users with helpful, concise, and actionable advice on how to save energy and money. Keep your responses friendly, encouraging, and easy to understand. When appropriate, use bullet points or numbered lists to break down complex information. Do not mention that you are an AI model.`,
  },
});


export const getChatbotResponse = async (prompt: string): Promise<string> => {
    try {
        const response = await chat.sendMessage({ message: prompt });
        return response.text;
    } catch (error) {
        console.error("Error getting chatbot response:", error);
        return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
    }
};

export const getEnergySavingTips = async (): Promise<Tip[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate 3 diverse and effective energy-saving tips for a household. One should be a simple behavioral change, one related to appliance usage, and one a small investment.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        tips: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    tip: {
                                        type: Type.STRING,
                                        description: "A short, catchy title for the tip.",
                                    },
                                    description: {
                                        type: Type.STRING,
                                        description: "A brief explanation of the tip and its benefits.",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        const jsonStr = response.text.trim();
        const parsed = JSON.parse(jsonStr);
        return parsed.tips || [];

    } catch (error) {
        console.error("Error fetching energy saving tips:", error);
        throw new Error("Could not fetch tips from AI service.");
    }
};

export const getWeeklyChallenge = async (): Promise<Challenge> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate a single, fun, and actionable weekly energy-saving challenge for a user. The challenge should be easy to understand and implement in a typical household.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: {
                            type: Type.STRING,
                            description: "A short, engaging title for the challenge."
                        },
                        description: {
                            type: Type.STRING,
                            description: "A one-sentence description of how to complete the challenge."
                        },
                    },
                },
            },
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error fetching weekly challenge:", error);
        throw new Error("Could not fetch a new challenge.");
    }
};

export const analyzeApplianceImage = async (base64ImageData: string, mimeType: string): Promise<ApplianceAnalysis> => {
    try {
        const imagePart = {
            inlineData: {
                data: base64ImageData,
                mimeType,
            },
        };

        const textPart = {
            text: `Analyze the appliance in this image. Identify the type of appliance, provide a realistic estimated monthly energy consumption in kWh for a typical model, and list three concise, actionable energy-saving tips for it.`,
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        applianceName: {
                            type: Type.STRING,
                            description: "The name of the identified appliance (e.g., 'Refrigerator', 'Microwave Oven')."
                        },
                        estimatedConsumption: {
                            type: Type.STRING,
                            description: "The estimated monthly energy consumption, formatted as 'X-Y kWh/month'."
                        },
                        tips: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "An array of three short energy-saving tips."
                        },
                    },
                },
            },
        });

        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error analyzing appliance image:", error);
        throw new Error("Could not analyze the appliance image.");
    }
};