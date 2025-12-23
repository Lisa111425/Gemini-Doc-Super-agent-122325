
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateSummary(content: string, modelName: string, prompt: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: modelName,
        contents: `${prompt}\n\nDocument Content:\n${content.substring(0, 50000)}`,
        config: {
          temperature: 0.7,
          thinkingConfig: { thinkingBudget: 20000 }
        }
      });
      return response.text || "No response generated.";
    } catch (error) {
      console.error("Gemini Error:", error);
      throw error;
    }
  }

  async chatWithFile(content: string, query: string, modelName: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: modelName,
        contents: `Based on the following document context, answer the question.\n\nContext:\n${content.substring(0, 20000)}\n\nQuestion: ${query}`,
        config: {
          temperature: 0.5
        }
      });
      return response.text || "No response generated.";
    } catch (error) {
      console.error("Gemini Error:", error);
      throw error;
    }
  }
}
