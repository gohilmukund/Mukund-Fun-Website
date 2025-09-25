import { GoogleGenerativeAI } from '@google/generative-ai';

type GenerativeModel = any; // TODO: Replace with actual type once types are available
type ChatSession = any;

let model: GenerativeModel | null = null;
let chat: ChatSession | null = null;

// Resume context to ground Gemini's responses
const RESUME_CONTEXT = `
You are an AI assistant for Mukund's portfolio website.
You should answer questions about:
- Mukund's experience, skills, and background
- Projects shown on the website
- Technical capabilities
- Professional background

Some key facts about Mukund (extract from resume at /public/assets/mukund.pdf):
- [Add 3-4 key points from your resume]

When answering:
- Be concise but informative
- Focus on facts from Mukund's resume and portfolio
- For technical questions, answer based on your knowledge but relate to Mukund's experience
- If unsure about a detail, say so rather than making assumptions
`;

export async function initGemini() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error('Gemini API key missing');
        
        const genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        // Start chat with resume context
        chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: "Here is important context about how you should respond: " + RESUME_CONTEXT
                },
                {
                    role: "model",
                    parts: "I understand. I will act as an AI assistant for Mukund's portfolio website, providing information about his experience, skills, projects, and background based on his resume and the provided context. I'll be concise, factual, and transparent about any uncertainties."
                }
            ],
        });
        
        return true;
    } catch (error) {
        console.error('Failed to initialize Gemini:', error);
        return false;
    }
}

export async function* getGeminiResponse(prompt: string) {
    if (!model || !chat) {
        yield "Error: Gemini not initialized. Please try again.";
        return;
    }

    try {
        const result = await chat.sendMessageStream(prompt);
        for await (const chunk of result) {
            yield chunk.text;
        }
    } catch (error: any) {
        yield `Error: ${error.message || 'Failed to get response'}`;
    }
}