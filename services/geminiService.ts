import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question, SubjectType } from '../types';

// Initialize Gemini
// NOTE: In a real environment, never expose keys on the client. 
// This is for demonstration purposes using the provided process.env pattern.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Define the schema for generated questions to ensure valid JSON output
const questionSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      text: { type: Type.STRING, description: "The question text." },
      options: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "An array of 4 multiple choice options." 
      },
      correctAnswerIndex: { type: Type.INTEGER, description: "The index (0-3) of the correct answer." },
      explanation: { type: Type.STRING, description: "A brief explanation of why the answer is correct." }
    },
    required: ["text", "options", "correctAnswerIndex", "explanation"]
  }
};

export const generateQuizQuestions = async (subject: SubjectType, topic: string, count: number = 3): Promise<Question[]> => {
  if (!apiKey) {
    console.warn("No API Key provided. Returning mock data.");
    return getMockQuestions(subject);
  }

  try {
    const prompt = `Generate ${count} multiple choice questions for a student learning ${subject} about the topic "${topic}". 
    The questions should be educational and challenging. Return ONLY JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
        systemInstruction: "You are an expert academic tutor creating curriculum content.",
      },
    });

    const rawText = response.text;
    if (!rawText) throw new Error("No response from AI");

    const parsedData = JSON.parse(rawText);
    
    // Add IDs to the questions
    return parsedData.map((q: any, index: number) => ({
      ...q,
      id: `gen-${Date.now()}-${index}`
    }));

  } catch (error) {
    console.error("Gemini API Error:", error);
    return getMockQuestions(subject);
  }
};

export const askTutor = async (questionContext: string, userQuery: string): Promise<string> => {
  if (!apiKey) return "Por favor configura tu API Key para usar el tutor virtual.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Context: The student is looking at this question: "${questionContext}".\nStudent Question: "${userQuery}"\nProvide a helpful, guiding hint without giving away the answer immediately. Be encouraging.`,
    });
    return response.text || "Lo siento, no pude generar una respuesta en este momento.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Hubo un error al conectar con el tutor.";
  }
};

// Fallback data if API key is missing or fails
const getMockQuestions = (subject: SubjectType): Question[] => {
  return [
    {
      id: 'mock-1',
      text: `Pregunta de muestra sobre ${subject}: ¿Cuál es el concepto fundamental?`,
      options: ['Opción A', 'Opción B (Correcta)', 'Opción C', 'Opción D'],
      correctAnswerIndex: 1,
      explanation: "Esta es una explicación pre-cargada porque no se detectó la API Key."
    },
    {
      id: 'mock-2',
      text: '¿Siguiente paso lógico en la secuencia?',
      options: ['Paso 1', 'Paso 2', 'Paso 3 (Correcta)', 'Paso 4'],
      correctAnswerIndex: 2,
      explanation: "El análisis lógico indica que el paso 3 sigue la secuencia establecida."
    }
  ];
};
