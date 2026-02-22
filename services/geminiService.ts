
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis } from "../types";

// Always use a named parameter for apiKey and use process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Performs AI-powered resume screening using Gemini.
 * Uses gemini-3-pro-preview for complex reasoning and analysis tasks.
 */
export const performAIScreening = async (resumeText: string, jobDescription: string): Promise<AIAnalysis> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Analyze this resume against the job description. 
    Resume: ${resumeText}
    JD: ${jobDescription}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER, description: "Match score from 0-100" },
          fraudRiskScore: { type: Type.NUMBER, description: "Risk score from 0-100" },
          skillsMatch: { type: Type.ARRAY, items: { type: Type.STRING } },
          missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          experienceMatch: { type: Type.STRING },
          fraudIndicators: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendation: { type: Type.STRING },
          explanation: { type: Type.STRING }
        },
        required: ["overallScore", "fraudRiskScore", "skillsMatch", "missingSkills", "recommendation", "explanation"]
      }
    }
  });

  // Extract text directly using the .text property as per guidelines.
  const jsonStr = response.text.trim();
  return JSON.parse(jsonStr) as AIAnalysis;
};

/**
 * Starts an AI interview session using a chat interface.
 */
export const startAIInterview = async (jobTitle: string) => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are an AI Interviewer for a ${jobTitle} position. 
      Ask technical and behavioral questions one by one. 
      Keep it professional and concise. 
      Evaluate the communication skills and depth of the candidate's answers.`
    }
  });
};

/**
 * Suggests interview slots based on interviewer availability and candidate preferences using AI.
 */
export const suggestInterviewSlots = async (busySlots: any[], preferences: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Suggest 3 optimal 45-minute interview slots.
    Interviewer Busy Slots: ${JSON.stringify(busySlots)}
    Candidate Preferences: ${preferences}
    Current Time: ${new Date().toISOString()}
    
    Return ONLY a JSON array of ISO strings for the START times.`
  });
  
  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("AI Slot Suggestion failed", e);
    return [];
  }
};
